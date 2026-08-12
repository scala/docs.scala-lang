---
title: その他変更された機能
type: section
description: この章では機能変更に伴い生じたすべての非互換性に関して詳細化します。
num: 18
previous-page: incompat-contextual-abstractions
next-page: incompat-type-checker
language: ja
---

その他の機能は言語をより簡単、安全、または一貫性のあるものにするために簡略化または制限した。

|Incompatibility|Scala 3 Migration Rewrite|
|--- |--- |
|[継承シャドウイング](#継承シャドウイング)|✅|
|[プライベートクラスのNon privateなコンストラクタ](#プライベートクラスのnon-privateなコンストラクタ)|Migration Warning|
|[抽象オーバーライド](#抽象オーバーライド)||
|[ケースクラスコンパニオン](#ケースクラスコンパニオン)||
|[明示的な`unapply`の呼び出し](#明示的なunapplyの呼び出し)||
|[見えないビーンプロパティ](#見えないビーンプロパティ)||
|[型パラメータとしての`=> T`](#型パラメータとしての-t)||
|[型引数のワイルドカード](#型引数のワイルドカード)||

## 継承シャドウイング

親クラスまたはトレイトからの継承されたメンバーは外部スコープで定義された識別子をシャドウイングすることができる。
このパターンのことを継承シャドウイングと呼ぶ。

```scala
object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
```

例として、以下のコードを与える。C の中にある単項式 `x` は `x` のメンバー定義を外部クラス `B` から参照することができ、また親クラス `A` の `x` のメンバー定義からも参照できる。
どちらの参照かは `A` の定義に進むまでわからない。

これはエラーが発生しやすいことで知られている。

そのため、Scala 3 では、親クラス `A` に実際にメンバー `x` がある場合、コンパイラは曖昧性解消を必要とする。

これにより、次のコードがコンパイルされなくなった。

```scala
class A {
  val x = 2
}

object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
```

{% highlight text %}
-- [E049] Reference Error: src/main/scala/inheritance-shadowing.scala:9:14 
9 |      println(x)
  |              ^
  |              Reference to x is ambiguous,
  |              it is both defined in object B
  |              and inherited subsequently in class C
{% endhighlight %}

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html) は`println(x)` を `println(this.x)` に置き換えることで自動的に曖昧性解消を行う。

## プライベートクラスのNon privateなコンストラクタ

Scala 3 ではプライベートクラスのコンストラクタはプライベートである必要がある。

例としては、次のようになる:

```scala
package foo

private class Bar private[foo] () {}
```

エラーメッセージは以下になる:

```
-- Error: /home/piquerez/scalacenter/scala-3-migration-guide/incompat/access-modifier/src/main/scala-2.13/access-modifier.scala:4:19 
4 |  private class Bar private[foo] ()
  |                   ^
  |      non-private constructor Bar in class Bar refers to private class Bar
  |      in its type signature (): foo.Foo.Bar
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html) では自動的には書き換えが行われず警告が表示される。

クラスはプライベートであるため、解決策はコンストラクタをプライベートにすることだ。

## 抽象オーバーライド

Scala 3 では、抽象 def で def をオーバーライドすると、サブクラスは def 抽象を考慮するが、Scala 2 では具象とみなされていた。

次のコードでは、`C` の `bar` メソッドは Scala 2.13 コンパイラでは具象であるとみなされているが、Scala 3 コンパイラでは抽象的であるとみなされるため、次のエラーが発生する。

```scala
trait A {
  def bar(x: Int): Int = x + 3
}

trait B extends A {
  def bar(x: Int): Int
}

class C extends B // Error: def bar(x: Int): Int は定義されていませんので、class C は抽象である必要があります
```

この振る舞いは[Dotty issue #4770](https://github.com/lampepfl/dotty/issues/4770)にて決定した。

簡単な修正としては、抽象 def を削除することだ。
これは、実際には Scala 2 では効果がなかったためだ。

## ケースクラスコンパニオン

ケースクラスのコンパニオンオブジェクトは `Function{0-23}` の特性を拡張しなくした。
特に、これらのメソッドは継承しない: `tupled`, `curried`, `andThen`, `compose`...

例として、このコードは無効になる:

```scala
case class Foo(x: Int, b: Boolean)

Foo.curried(1)(true)
Foo.tupled((2, false))
```

クロスコンパイルによるソリューションはメソッド `Foo.apply` を明示的にイータ展開することだ。

{% highlight diff %}
-Foo.curried(1)(true)
+(Foo.apply _).curried(1)(true)

-Foo.tupled((2, false))
+(Foo.apply _).tupled((2, false))
{% endhighlight %}

パフォーマンス上の理由から、中間間数値を導入することもできる。

```scala
val fooCtr: (Int, Boolean) => Foo = (x, b) => Foo(x, b)

fooCtr.curried(1)(true)
fooCtr.tupled((2, false))
```
## 明示的な`unapply`の呼び出し

Scala において、ケースクラスには自動生成された抽象メソッドがあり、コンパニオンオブジェクトで `unapply` と呼ばれている。
Scala 2.13 と Scala 3 間でシグネチャが変わった。

新しいシグネチャは、オプションがなく(参照として新しい[Pattern Matching](/scala3/reference/changed-features/pattern-matching.html)) 、これにより、`unapply` が明示的に呼び出されたときに非互換性が発生する。

この問題は、Scala バージョン間でシグネチャが同じ状態のユーザが定義したエクストラクタには影響しないことに注意すべきだ。

次のケースクラス定義があるとする:

```scala
case class Location(lat: Double, long: Double)
```

Scala 2.13 コンパイラでは `unapply` メソッドを生成する:

```scala
object Location {
  def unapply(location: Location): Option[(Double, Double)] = Some((location.lat, location.long))
}
```

一方で Scala 3 コンパイラでは以下のようにメソッドを生成する:

```scala
object Location {
  def unapply(location: Location): Location = location
}
```

その結果、次のコードはコンパイルされなくなる

```scala
def tuple(location: Location): (Int, Int) = {
  Location.unapply(location).get // [E008] Not Found Error: value get is not a member of Location
}
```

考えられる解決策は、パターンバインディングを使用することだ:

{% highlight diff %}
def tuple(location: Location): (Int, Int) = {
-  Location.unapply(location).get
+  val Location(lat, lon) = location
+  (lat, lon)
}
{% endhighlight %}

## 見えないビーンプロパティ

`BeanProperty` アノテーションにより生成された getter と setter メソッドは、主なユースケースが Java フレームワークと相互運用性があるため、Scala 3 では表示されない。

例として下記に示す:

```scala
class Pojo() {
  @BeanProperty var fooBar: String = ""
}

val pojo = new Pojo()

pojo.setFooBar("hello") // [E008] Not Found Error: value setFooBar is not a member of Pojo

println(pojo.getFooBar()) // [E008] Not Found Error: value getFooBar is not a member of Pojo
```

解決策は、より慣用的な `pojo.fooBar` getter と setter 呼び出すことだ。

{% highlight diff %}
val pojo = new Pojo()

-pojo.setFooBar("hello")
+pojo.fooBar = "hello"

-println(pojo.getFooBar())
+println(pojo.fooBar)
{% endhighlight %}

## 型パラメータとしての`=> T`

この `=> T` ようなフォームでは型パラメータへの引数として使用できなくなった。 

この決定は Scala 3 ソースコードの[コメント](https://github.com/lampepfl/dotty/blob/0f1a23e008148f76fd0a1c2991b991e1dad600e8/compiler/src/dotty/tools/dotc/core/ConstraintHandling.scala#L144-L152)で説明している。

例として、`Int => (=> Int) => Int` の関数は、型パラメータ `T2` に `=> Int` を割り当てるため、カリー化なしのメソッドにわたすことはできない。

```
-- [E134] Type Mismatch Error: src/main/scala/by-name-param-type-infer.scala:3:41
3 |  val g: (Int, => Int) => Int = Function.uncurried(f)
  |                                ^^^^^^^^^^^^^^^^^^
  |None of the overloaded alternatives of method uncurried in object Function with types
  | [T1, T2, T3, T4, T5, R]
  |  (f: T1 => T2 => T3 => T4 => T5 => R): (T1, T2, T3, T4, T5) => R
  | [T1, T2, T3, T4, R](f: T1 => T2 => T3 => T4 => R): (T1, T2, T3, T4) => R
  | [T1, T2, T3, R](f: T1 => T2 => T3 => R): (T1, T2, T3) => R
  | [T1, T2, R](f: T1 => T2 => R): (T1, T2) => R
  |match arguments ((Test.f : Int => (=> Int) => Int))
```

この解決策は状況に依存する。例では、いずれかを行うことができる:

  - 適切なシグネチャを使用して、独自の`カリー化してない`メソッドを定義する。
  - `カリー化していない`実装をローカルでインライン化する。

## 型引数のワイルドカード

Scala 3 ではワイルドカードの引数より種類の多い抽象型メンバーへの適用は減らすことができない。

この例では、コンパイルされない。

```scala
trait Example {
  type Foo[A]

  def f(foo: Foo[_]): Unit // [E043] Type Error: unreducible application of higher-kinded type Example.this.Foo to wildcard arguments 
}
```

型パラメータを使うことで修正できる。:

{% highlight diff %}
-def f(foo: Foo[_]): Unit
+def f[A](foo: Foo[A]): Unit
{% endhighlight %}

しかし、簡単な解決策では `Foo` が自身を型パラメータとして使われるときはうまくいかない。

```scala
def g(foos: Seq[Foo[_]]): Unit
```

このようなケースでは、`Foo` の周りをラップするクラスを使う:

{% highlight diff %}
+class FooWrapper[A](foo: Foo[A])

-def g(foos: Seq[Foo[_]]): Unit
+def g(foos: Seq[FooWrapper[_]]): Unit
{% endhighlight %}
