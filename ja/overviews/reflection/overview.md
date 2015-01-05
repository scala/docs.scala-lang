---
layout: overview-large

partof: reflection
num: 1
outof: 6
language: ja
title: 概要
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

**Heather Miller、Eugene Burmako、Philipp Haller 著**<br/>
**Eugene Yokota 訳**

**リフレクション** (reflection) とは、プログラムが実行時において自身をインスペクトしたり、変更したりできる能力のことだ。それはオブジェクト指向、関数型、論理プログラミングなど様々なプログラミングのパラダイムに渡って長い歴史を持つ。
それぞれのパラダイムが、時として顕著に異なる方向性に向けて**現在の**リフレクションを進化させてきた。
LISP/Scheme のような関数型の言語が動的なインタープリタを可能とすることに比重を置いてきたのに対し、Java のようなオブジェクト指向言語は実行時におけるクラスメンバのインスペクションや呼び出しを実現するための実行時リフレクションに主な比重を置いてきた。

複数の言語やパラダイムに渡る主要なリフレクションの用例を以下に 3つ挙げる:

<ol>
<li><b>実行時リフレクション</b>。実行時にランタイム型 (runtime type) やそのメンバをインスペクトしたり呼び出す能力。</li>
<li><b>コンパイル時リフレクション</b>。コンパイル時に抽象構文木にアクセスしたり、それを操作する能力。</li>
<li><b>レイフィケーション</b> (reification)。(1) の場合は実行時に、(2) の場合はコンパイル時に抽象構文木を生成すること。</li>
</ol>

Scala 2.10 までは Scala は独自のリフレクション機能を持っていなかった。
代わりに、Java リフレクションを使って (1) の実行時リフレクションのうちの非常に限定的な一部の機能のみを使うことができた。
しかし、存在型、高カインド型、パス依存型、抽象型など多くの Scala 独自の型の情報はそのままの Java リフレクションのもとでは実行時に復元不可能だった。
これらの Scala 独自の型に加え、Java リフレクションはコンパイル時にジェネリックである Java 型の実行時型情報も復元できない。
この制約は Scala のジェネリック型の実行時リフレクションも受け継いでいる。

Scala 2.10 は、Scala 独自型とジェネリック型に対する Java の実行時リフレクションの欠点に対処するためだけではなく、
汎用リフレクション機能を持ったより強力なツールボックスを追加するために新しいリフレクションのライブラリを導入する。
Scala 型とジェネリックスに対する完全な実行時リフレクション (1) の他に、
Scala 2.10 は[マクロ]({{site.baseurl}}/ja/overviews/macros/overview.html) という形でコンパイル時リフレクション機能 (2) と、
Scala の式を抽象構文木へと**レイファイ** (reify) する機能 (3) も提供する。

## 実行時リフレクション

実行時リフレクション (runtime reflection) とは何だろう？
**実行時**に何らかの型もしくはオブジェクトが渡されたとき、リフレクションは以下のことができる:

<ul>
<li>ジェネリック型を含め、そのオブジェクトがどの型かをインスペクトでき、</li>
<li>新しいオブジェクトを作成することができ、</li>
<li>そのオブジェクトのメンバにアクセスしたり、呼び出したりできる。</li>
</ul>

それぞれの能力をいくつかの具体例とともにみていこう。

### 具体例

<a name="inspecting_a_runtime_type">&nbsp;</a>
#### ランタイム型のインスペクション (実行時におけるジェネリック型も含む)

他の JVM言語同様に、Scala の型はコンパイル時に**消去** (erase) される。
これは、何らかのインスタンスのランタイム型をインスペクトしてもコンパイル時に
Scala コンパイラが持つ型情報を全ては入手できない可能性があることを意味する。

**型タグ** (`TypeTag`) は、コンパイル時に入手可能な全ての型情報を実行時に持ち込むためのオブジェクトだと考えることができる。
しかし、型タグは常にコンパイラによって生成されなくてはいけないことに注意してほしい。
この生成は暗黙のパラメータか context bound によって型タグが必要とされた時にトリガーされる。
そのため、通常は、型タグは暗黙のパラメータか context bound によってのみ取得できる。

例えば、context bound を使ってみよう:

    scala> import scala.reflect.runtime.{universe => ru}
    import scala.reflect.runtime.{universe=>ru}

    scala> val l = List(1,2,3)
    l: List[Int] = List(1, 2, 3)

    scala> def getTypeTag[T: ru.TypeTag](obj: T) = ru.typeTag[T]
    getTypeTag: [T](obj: T)(implicit evidence$1: ru.TypeTag[T])ru.TypeTag[T]

    scala> val theType = getTypeTag(l).tpe
    theType: ru.Type = List[Int]

上の例では、まず `scala.reflect.runtime.universe` をインポートして
(型タグを使うためには必ずインポートされる必要がある)、`l` という名前の `List[Int]` を作る。
次に、context bound を持った型パラメータ `T` を持つ `getTypeTag` というメソッドは定義する
(REPL が示すとおり、これは暗黙の evidence パラメータを定義することに等価であり、コンパイラは `T` に対する型タグを生成する)。
最後に、このメソッドに `l` を渡して呼び出し、`TypeTag` に格納される型を返す `tpe` を呼び出す。
見ての通り、正しい完全な型 (つまり、`List` の具象型引数を含むということ) である `List[Int]` が返ってきた。

目的の `Type` のインスタンスが得られれば、これをインスペクトすることもできる。以下に具体例で説明しよう:

    scala> val decls = theType.declarations.take(10)
    decls: Iterable[ru.Symbol] = List(constructor List, method companion, method isEmpty, method head, method tail, method ::, method :::, method reverse_:::, method mapConserve, method ++)

#### ランタイム型のインスタンス化

リフレクションによって得られた型は適当な invoker ミラーを使ってコンストラクタを呼び出すことでインスタンス化することができる
(ミラーに関しては[後ほど]({{ site.baseurl }}/ja/overviews/reflection/overview.html#mirrors)説明する)。
以下に REPL を使った具体例を用いて説明しよう:

    scala> case class Person(name: String)
    defined class Person

    scala> val m = ru.runtimeMirror(getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror with ...

最初のステップとして現在のクラスローダで読み込まれた (`Person` クラスを含む)
全てのクラスや型をアクセス可能とするミラー `m` を取得する。

    scala> val classPerson = ru.typeOf[Person].typeSymbol.asClass
    classPerson: scala.reflect.runtime.universe.ClassSymbol = class Person

    scala> val cm = m.reflectClass(classPerson)
    cm: scala.reflect.runtime.universe.ClassMirror = class mirror for Person (bound to null)

次に、`reflectClass` メソッドを使って `Person` クラスの `ClassMirror` を取得する。
`ClassMirror` は `Person` クラスのコンストラクタへのアクセスを提供する。

    scala> val ctor = ru.typeOf[Person].declaration(ru.nme.CONSTRUCTOR).asMethod
    ctor: scala.reflect.runtime.universe.MethodSymbol = constructor Person

`Person` のコンストラクタのシンボルは実行時ユニバース `ru` を用いて `Person` 型の宣言から照会することによってのみ得られる。

    scala> val ctorm = cm.reflectConstructor(ctor)
    ctorm: scala.reflect.runtime.universe.MethodMirror = constructor mirror for Person.<init>(name: String): Person (bound to null)

    scala> val p = ctorm("Mike")
    p: Any = Person(Mike)

#### ランタイム型のメンバへのアクセスと呼び出し

一般的に、ランタイム型のメンバは適当な invoker ミラーを使ってコンストラクタを呼び出すことでインスタンス化することができる
(ミラーに関しては[後ほど]({{ site.baseurl }}/ja/overviews/reflection/overview.html#mirrors)説明する)。
以下に REPL を使った具体例を用いて説明しよう:

    scala> case class Purchase(name: String, orderNumber: Int, var shipped: Boolean)
    defined class Purchase

    scala> val p = Purchase("Jeff Lebowski", 23819, false)
    p: Purchase = Purchase(Jeff Lebowski,23819,false)

この例では `Purchase` `p` の `shipped` フィールドをリフレクションを使って get/set を行う:

    scala> import scala.reflect.runtime.{universe => ru}
    import scala.reflect.runtime.{universe=>ru}

    scala> val m = ru.runtimeMirror(p.getClass.getClassLoader)
    m: scala.reflect.runtime.universe.Mirror = JavaMirror with ...

`shipped` メンバにアクセスするには、前の例と同じく、`p` のクラス (`Purchase`) を含むクラスローダが読み込んだ全てのクラスを入手可能とするミラー `m`
を取得することから始める。

    scala> val shippingTermSymb = ru.typeOf[Purchase].declaration(ru.newTermName("shipped")).asTerm
    shippingTermSymb: scala.reflect.runtime.universe.TermSymbol = method shipped

次に、`shipped` フィールドの宣言を照会して `TermSymbol` (`Symbol` 型の 1つ) を得る。
この `Symbol` は後で (何からのオブジェクトの) このフィールドの値にアクセスするのに必要なミラーを得るのに使う。

    scala> val im = m.reflect(p)
    im: scala.reflect.runtime.universe.InstanceMirror = instance mirror for Purchase(Jeff Lebowski,23819,false)

    scala> val shippingFieldMirror = im.reflectField(shippingTermSymb)
    shippingFieldMirror: scala.reflect.runtime.universe.FieldMirror = field mirror for Purchase.shipped (bound to Purchase(Jeff Lebowski,23819,false))

ある特定のインスタンスの `shipped` メンバにアクセスするためには、その特定のインスタンス `p`
のためのミラー `im` を必要とする。
このインスタンスミラーから `p` の型のフィールドを表す `TermSymbol` に対して `FieldMirror` を得ることができる。

特定のフィールドに対して `FieldMirror` が得られたところで、`get` と `set` メソッドを使って特定のインスタンスの
`shipped` メンバを get/set できる。
`shipped` の状態を `true` に変更してみよう。

    scala> shippingFieldMirror.get
    res7: Any = false

    scala> shippingFieldMirror.set(true)

    scala> shippingFieldMirror.get
    res9: Any = true

### Java のランタイムクラス と Scala のランタイム型の比較

Java のリフレクションを使って実行時に Java の **Class**
のインスタンスを取得したことのある読者は、Scala ではランタイム**型**を取得することに気付いただろう。

以下の RELP の実行結果は Scala のクラスに対して Java
リフレクションを使った場合に予想外もしくは間違った結果が返ってくることがあることを示す。

まず、抽象型メンバ `T` を持つ基底クラス `E` を定義して、それから 2つの派生クラス基底
`C` と `D` を派生する。

    scala> class E {
         |   type T
         |   val x: Option[T] = None
         | }
    defined class E

    scala> class C extends E
    defined class C

    scala> class D extends C
    defined class D

次に具象型メンバ `T` (この場合 `String`) を使う `C` と `D` のインスタンスを作成する。

    scala> val c = new C { type T = String }
    c: C{type T = String} = $anon$1@7113bc51

    scala> val d = new D { type T = String }
    d: D{type T = String} = $anon$1@46364879

ここで Java リフレクションの `getClass` と `isAssignableFrom` メソッドを使って
`c` と `d` のランタイムクラスを表す `java.lang.Class` のインスタンスを取得して、
`d` のランタイムクラスが `c` のランタイムクラスのサブクラスであるかを検証する。

    scala> c.getClass.isAssignableFrom(d.getClass)
    res6: Boolean = false

`D` が `C` を継承することは上のコードにより明らかなので、この結果は意外なものかもしれない。
この「`d` のクラスは `c` のクラスのサブクラスであるか？」
というような簡単な実行時型検査において期待される答は `true` だと思う。
しかし、上の例で気付いたかもしれないが、`c` と `d` がインスタンス化されるとき
Scala コンパイラは実はそれぞれに `C` と `D` の匿名のサブクラスを作成している。
これは Scala コンパイラが Scala 特定の (つまり、非 Java の) 言語機能を
JVM 上で実行させるために等価な Java バイトコードに翻訳する必要があるからだ。
そのため、Scala コンパイラは往々にしてユーザが定義したクラスの代わりに合成クラス (つまり、自動的に生成されたクラス)
を作成してそれを実行時に使用する。これは Scala
では日常茶飯事と言ってもいいぐらいで、クロージャ、型メンバ、型の細別、ローカルクラスなど多くの
Scala 機能に対して Java リフレクションを使う事で観測することができる。

このような状況においては、これらの Scala オブジェクトに対して
Scala リフレクションを使うことで正確なランタイム型を得ることができる。
Scala のランタイム型は全てのコンパイル時の型情報を保持することでコンパイル時と実行時の型のミスマッチを回避している。

以下に Scala リフレクションを使って渡された 2つの引数のランタイム型を取得して両者のサブタイプ関係をチェックするメソッドを定義する。
もしも、第1引数の型が第2引数の型のサブタイプである場合は `true` を返す。

    scala> import scala.reflect.runtime.{universe => ru}
    import scala.reflect.runtime.{universe=>ru}

    scala> def m[T: ru.TypeTag, S: ru.TypeTag](x: T, y: S): Boolean = {
        |   val leftTag = ru.typeTag[T]
        |   val rightTag = ru.typeTag[S]
        |   leftTag.tpe <:< rightTag.tpe
        | }
    m: [T, S](x: T, y: S)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T], implicit evidence$2: scala.reflect.runtime.universe.TypeTag[S])Boolean

    scala> m(d, c)
    res9: Boolean = true

以上に示した通り、これは期待される結果を返す。`d` のランタイム型は確かに `c` のランタイム型のサブタイプだ。

## コンパイル時リフレクション

Scala リフレクションは、プログラムがコンパイル時に**自身**を変更するという**メタプログラミング**の一種を可能とする。
このコンパイル時リフレクションはマクロという形で実現されており、抽象構文木を操作するメソッドをコンパイル時に実行できる能力として提供される。

マクロの特に興味深い側面の1つは `scala.reflect.api` で提供される Scala の実行時リフレクションの基となっている
API に基づいていることだ。これにより、マクロと実行時リフレクションを利用した実装の間で汎用コードを共有することが可能となっている。

[マクロのガイド]({{ site.baseurl }}/ja/overviews/macros/overview.html)はマクロ固有のことに焦点を絞っているのに対し、
本稿ではリフレクション API 全般を取り扱っていることに注意してほしい。
しかし、[シンボル、構文木、型]({{site.baseurl }}/ja/overviews/reflection/symbols-trees-types.html)の節で詳しく説明される抽象構文木のように多くの概念は直接マクロにも応用することができる。

## 環境

全てのリフレクションを用いたタスクは適切な環境設定を必要とする。
この環境はリフレクションを用いたタスクが実行時に行われるのかコンパイル時に行われるのかによって異なる。
実行時とコンパイル時における環境の違いは**ユニバース**と呼ばれているものによってカプセル化されている。
リフレクション環境におけるもう 1つの重要なものにリフレクションを用いてアクセスが可能な実体の集合がある。
この実体の集合は**ミラー**と呼ばれているものによって決定される。

ミラーはリフレクションを用いてアクセスすることができる実体の集合を決定するだけではなく、
それらの実体に対するリフレクションを用いた演算を提供する。
例えば、実行時リフレクションにおいて **invoker ミラー**を使うことで任意のクラスのメソッドやコンストラクタを呼び出すことができる。

### ユニバース

ユニバース (`Universe`) は Scala リフレクションへの入り口だ。
ユニバースは、型 (`Type`)、構文木 (`Tree`)、アノテーション (`Annotation`)
といったリフレクションで使われる主要な概念に対するインターフェイスを提供する。
詳細はこのガイドの[ユニバース]({{ site.baseurl}}/ja/overviews/reflection/environment-universes-mirrors.html)の節か、
`scala.reflect.api` パッケージの[ユニバースの API doc](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/reflect/api/Universe.html)
を参考にしてほしい。

このガイドにおける多くの例を含め、Scala リフレクションを利用するには何らかの
`Universe` もしくはその `Universe` のメンバをインポートする必要がある。
典型的には実行時リフレクションを利用するには
`scala.reflect.runtime.universe` の全てのメンバをワイルドカードインポートを用いてインポートする:

    import scala.reflect.runtime.universe._

### ミラー

ミラー (`Mirror`) は Scala リフレクションの中心部を構成する。
リフレクションによって提供される全ての情報はこのミラーと呼ばれるものを通して公開されている。
型情報の種類やリフレクションを用いたタスクの種類によって異なるミラーを使う必要がある。

詳細はこのガイドの[ミラー]({{ site.baseurl}}/ja/overviews/reflection/environment-universes-mirrors.html)の節か、
`scala.reflect.api` パッケージの[ミラーの API doc](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/reflect/api/Mirrors.html)
を参考にしてほしい。