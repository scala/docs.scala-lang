---
layout: singlepage-overview
title: 値クラスと汎用トレイト

partof: value-classes

language: ja
---

**Mark Harrah 著**<br>
**Eugene Yokota 訳**

## はじめに

**値クラス** (value class) は実行時のオブジェクトの割り当てを回避するための Scala の新しい機構だ。
これは新たに定義付けされる `AnyVal` のサブクラスによって実現される。
これは [SIP-15](https://docs.scala-lang.org/sips/pending/value-classes.html) にて提案された。
以下に最小限の値クラスの定義を示す:

    class Wrapper(val underlying: Int) extends AnyVal

これはただ1つの、public な `val` パラメータを持ち、これが内部での実行時のデータ構造となる。
コンパイル時の型は `Wrapper` だが、実行時のデータ構造は `Int` だ。
値クラスは `def` を定義することができるが、`val`、`var`、または入れ子の `trait`、`class`、`object` は許されない:

    class Wrapper(val underlying: Int) extends AnyVal {
      def foo: Wrapper = new Wrapper(underlying * 19)
    }

値クラスは<b>汎用トレイト</b> (universal trait) のみを拡張することができる。また、他のクラスは値クラスを拡張することはできない。
汎用トレイトは `Any` を拡張するトレイトで、メンバとして `def` のみを持ち、初期化を一切行わない。
汎用トレイトによって値クラスはメソッドの基本的な継承ができるようになるが、これは<b>メモリ割り当てのオーバーヘッドを伴うようにもなる</b>。具体例で説明しよう:

    trait Printable extends Any {
      def print(): Unit = println(this)
    }
    class Wrapper(val underlying: Int) extends AnyVal with Printable

    val w = new Wrapper(3)
    w.print() // Wrapper のインスタンスをここでインスタンス化する必要がある

以下の項で用例、メモリ割り当てが発生するかしないかの詳細、および値クラスの制約を具体例を使ってみていきたい。

## 拡張メソッド

値クラスの使い方の1つに implicit クラス ([SIP-13](https://docs.scala-lang.org/sips/pending/implicit-classes.html)) と組み合わせてメモリ割り当てを必要としない拡張メソッドとして使うというものがある。implicit クラスは拡張メソッドを定義するより便利な構文を提供する一方、値クラスは実行時のオーバーヘッドを無くすことができる。この良い例が標準ライブラリの `RichInt` クラスだ。これは値クラスであるため、`RichInt` のメソッドを使うのに `RichInt` のインスタンスを作る必要はない。

`RichInt` から抜粋した以下のコードは、それが `Int` を拡張して `3.toHexString` という式が書けるようにしていることを示す:

    implicit class RichInt(val self: Int) extends AnyVal {
      def toHexString: String = java.lang.Integer.toHexString(self)
    }

実行時には、この `3.toHexString` という式は、新しくインスタンス化されるオブジェクトへのメソッド呼び出しではなく、静的なオブジェクトへのメソッド呼び出しと同様のコード (`RichInt$.MODULE$.extension$toHexString(3)`) へと最適化される。

## 正当性

値クラスのもう1つの使い方として、実行時のメモリ割り当て無しにデータ型同様の型安全性を得るというものがある。
例えば、距離を表すデータ型はこのようなコードになるかもしれない:

    class Meter(val value: Double) extends AnyVal {
      def +(m: Meter): Meter = new Meter(value + m.value)
    }

以下のような 2つの距離を加算するコード

    val x = new Meter(3.4)
    val y = new Meter(4.3)
    val z = x + y

は実際には `Meter` インスタンスを割り当てず、組み込みの `Double` 型のみが実行時に使われる。

注意: 実際には、case class や拡張メソッドを用いてよりきれいな構文を提供することができる。

## メモリ割り当てが必要になるとき

JVM は値クラスをサポートしないため、Scala は場合によっては値クラスをインスタンス化する必要がある。
完全な詳細は [SIP-15](https://docs.scala-lang.org/sips/pending/value-classes.html) を参照してほしい。

### メモリ割り当ての概要

以下の状況において値クラスのインスタンスはインスタンス化される:

<!-- keep this html -->
<ol>
<li>値クラスが別の型として扱われるとき。</li>
<li>値クラスが配列に代入されるとき。</li>
<li>パターンマッチングなどにおいて、実行時の型検査を行うとき。</li>
</ol>

### メモリ割り当ての詳細

値クラスの値が、汎用トレイトを含む別の型として扱われるとき、値クラスのインスタンスの実体がインスタンス化される必要がある。
具体例としては、以下の `Meter` 値クラスをみてほしい:

    trait Distance extends Any
    case class Meter(val value: Double) extends AnyVal with Distance

`Distance` 型の値を受け取るメソッドは実体の `Meter` インスタンスが必要となる。
以下の例では `Meter` クラスはインスタンス化される:

    def add(a: Distance, b: Distance): Distance = ...
    add(Meter(3.4), Meter(4.3))

`add` のシグネチャが以下のようであれば

    def add(a: Meter, b: Meter): Meter = ...

メモリ割り当ては必要無い。
値クラスが型引数として使われる場合もこのルールがあてはまる。
例えば、`identify` を呼び出すだけでも `Meter` インスタンスの実体が作成されることが必要となる:

    def identity[T](t: T): T = t
    identity(Meter(5.0))

メモリ割り当てが必要となるもう1つの状況は、配列への代入だ。たとえその値クラスの配列だったとしてもだ。具体例で説明する:

    val m = Meter(5.0)
    val array = Array[Meter](m)

この配列は、内部表現の `Double` だけではなく `Meter` の実体を格納する。

最後に、パターンマッチングや `asInstaneOf` のような型検査は値クラスのインスタンスの実体を必要とする:

    case class P(val i: Int) extends AnyVal

    val p = new P(3)
    p match { // new P instantiated here
      case P(3) => println("Matched 3")
      case P(x) => println("Not 3")
    }

## 制約

JVM が値クラスという概念をサポートしていないこともあり、値クラスには現在いくつかの制約がある。
値クラスの実装とその制約の詳細に関しては [SIP-15](https://docs.scala-lang.org/sips/pending/value-classes.html) を参照。

### 制約の概要

値クラスは …

<!-- keep this html -->
<ol>
<li> … ただ1つの public で値クラス以外の型の <code>val</code> パラメータを持つプライマリコンストラクタのみを持つことができる。</li>
<li> … specialized な型パラメータを持つことができない。</li>
<li> … 入れ子のローカルクラス、トレイト、やオブジェクトを持つことがでない。</li>
<li> … <code>equals</code> や <code>hashCode</code> メソッドを定義することができない。</li>
<li> … トップレベルクラスか静的にアクセス可能なオブジェクトのメンバである必要がある。</li>
<li> … <code>def</code> のみをメンバとして持つことができる。特に、<code>lazy val</code>、<code>var</code>、<code>val</code> をメンバとして持つことができない。</li>
<li> … 他のクラスによって拡張されることができない。</li>
</ol>

### 制約の具体例

この項ではメモリ割り当ての項で取り扱わなかった制約の具体例を色々みていく。

コンストラクタのパラメータを複数持つことができない:

    class Complex(val real: Double, val imag: Double) extends AnyVal

Scala コンパイラは以下のエラーメッセージを生成する:

    Complex.scala:1: error: value class needs to have exactly one public val parameter
    class Complex(val real: Double, val imag: Double) extends AnyVal
          ^

コンストラクタのパラメータは `val` である必要があるため、名前渡しのパラメータは使うことができない:

    NoByName.scala:1: error: `val' parameters may not be call-by-name
    class NoByName(val x: => Int) extends AnyVal
                          ^

Scala はコンストラクタのパラメータとして `lazy val` を許さないため、それも使うことができない。
複数のコンストラクタを持つことができない:

    class Secondary(val x: Int) extends AnyVal {
      def this(y: Double) = this(y.toInt)
    }

    Secondary.scala:2: error: value class may not have secondary constructors
      def this(y: Double) = this(y.toInt)
          ^

値クラスは `lazy val` や `val` のメンバ、入れ子の `class`、`trait`、や `object` を持つことができない:

    class NoLazyMember(val evaluate: () => Double) extends AnyVal {
      val member: Int = 3
      lazy val x: Double = evaluate()
      object NestedObject
      class NestedClass
    }

    Invalid.scala:2: error: this statement is not allowed in value class: private[this] val member: Int = 3
      val member: Int = 3
          ^
    Invalid.scala:3: error: this statement is not allowed in value class: lazy private[this] var x: Double = NoLazyMember.this.evaluate.apply()
      lazy val x: Double = evaluate()
               ^
    Invalid.scala:4: error: value class may not have nested module definitions
      object NestedObject
             ^
    Invalid.scala:5: error: value class may not have nested class definitions
      class NestedClass
            ^

以下のとおり、ローカルクラス、トレイト、オブジェクトも許されないことに注意:

    class NoLocalTemplates(val x: Int) extends AnyVal {
      def aMethod = {
        class Local
        ...
      }
    }

現在の実装の制約のため、値クラスを入れ子とすることができない:

    class Outer(val inner: Inner) extends AnyVal
    class Inner(val value: Int) extends AnyVal

    Nested.scala:1: error: value class may not wrap another user-defined value class
    class Outer(val inner: Inner) extends AnyVal
                    ^

また、構造的部分型はメソッドのパラメータや戻り型に値クラスを取ることができない:

    class Value(val x: Int) extends AnyVal
    object Usage {
      def anyValue(v: { def value: Value }): Value =
        v.value
    }

    Struct.scala:3: error: Result type in structural refinement may not refer to a user-defined value class
      def anyValue(v: { def value: Value }): Value =
                                   ^

値クラスは非汎用トレイトを拡張することができない。また、値クラスを拡張することもできない。

    trait NotUniversal
    class Value(val x: Int) extends AnyVal with NotUniversal
    class Extend(x: Int) extends Value(x)

    Extend.scala:2: error: illegal inheritance; superclass AnyVal
     is not a subclass of the superclass Object
     of the mixin trait NotUniversal
    class Value(val x: Int) extends AnyVal with NotUniversal
                                                ^
    Extend.scala:3: error: illegal inheritance from final class Value
    class Extend(x: Int) extends Value(x)
                                 ^

2つ目のエラーメッセージは、明示的には値クラスに `final` 修飾子が指定されなくても、それが暗に指定されていることを示している。

値クラスが 1つのパラメータしかサポートしないことによって生じるもう1つの制約は、値クラスがトップレベルであるか、静的にアクセス可能なオブジェクトのメンバである必要がある。
これは、入れ子になった値クラスはそれを内包するクラスへの参照を2つ目のパラメータとして受け取る必要があるからだ。
そのため、これは許されない:

    class Outer {
      class Inner(val x: Int) extends AnyVal
    }

    Outer.scala:2: error: value class may not be a member of another class
    class Inner(val x: Int) extends AnyVal
          ^

しかし、これは内包するオブジェクトがトップレベルであるため許される:

    object Outer {
      class Inner(val x: Int) extends AnyVal
    }
