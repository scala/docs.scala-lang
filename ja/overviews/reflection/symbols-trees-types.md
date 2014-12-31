---
layout: overview-large

disqus: true

partof: reflection
num: 3
outof: 6
language: ja
title: シンボル、構文木、型
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## シンボル

**シンボル** (symbol) は名前 (name) とその名前が参照するクラスやメソッドのような実体
(entity) の間のバインディングを作るのに用いられる。Scala において定義され名前を付けられるものは全て関連付けられたシンボルを持つ。

シンボルは実体 (`class`、`object`、`trait` など) もしくはメンバ (`val`、`var`、`def` など)
の宣言に関する全ての情報を格納するため、実行時リフレクションとコンパイル時リフレクション
(マクロ) の両方において中心的な役割を果たす抽象体だ。

全てのシンボルにある基本的な `name` メソッドをはじめ、より複雑で込み入った概念である
`ClassSymbol` に定義される `baseClasses` を取得するメソッドなど、シンボルは幅広い情報を提供する。
もう一つの一般的なシンボルの利用方法としてはメンバのシグネチャのインスペクトや、
クラスの型パラメータの取得、メソッドのパラメータ型の取得、フィールドの型の取得などが挙げられる。

### シンボルのオーナーの階層

シンボルは階層化されている。
例えば、メソッドのパラメータを表すシンボルはそのメソッドのシンボルに**所有**されており、
メソッドのシンボルはそれを内包するクラス、トレイト、もしくはオブジェクトに**所有**されており、
クラスはそれを含むパッケージに**所有**されいてるという具合だ。

例えばトップレベルのパッケージのようなトップレベルの実体であるためにシンボルにオーナーが無い場合は、
`NoSymbol` という特殊なシングルトン・オブジェクトのオーナーが用いられる。
シンボルが無いことを表す `NoSymbol` は空を表わしたり、デフォルトの値として API の中で多用されている。
`NoSymbol` の `owner` にアクセスすると例外が発生する。
[`Symbol`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/reflect/api/Symbols$SymbolApi.html)
型によって提供される一般インターフェイスに関しては API doc を参照してほしい。

### 型シンボル (`TypeSymbol`)

型シンボル (`TypeSymbol`) は型、クラス、トレイトの宣言そして、型パラメータを表す。
より特定の `ClassSymbol` には当てはまらないメンバとして `isAbstractType`、
`isContravariant`、`isCovariant` といったメソッドを持つ。

- `ClassSymbol`: クラスやトレイトの宣言に格納される全ての情報へのアクセスを提供する。具体的には、`name`、修飾子 (`isFinal`、 `isPrivate`、 `isProtected`、 `isAbstractClass` など)、 `baseClasses`、 `typeParams` など。

### 項シンボル (`TermSymbol`)

項シンボル (`TermSymbol`) は `val`、`var`、`def`、そしてオブジェクトの宣言、パッケージや値のパラメータを表す。

- メソッド・シンボル (`MethodSymbol`) は `def` の宣言を表す (`TermSymbol` のサブクラスだ)。メソッドが(基本)コンストラクタであるか、可変長引数をサポートするかなどの問い合わせを行うことができる。
- モジュール・シンボル (`ModuleSymbol`) はオブジェクトの宣言を表す。`moduleClass` メンバを用いてオブジェクトに暗黙的に関連付けられているクラスを照会することができる。逆の照会も可能だ。モジュール・クラスから `selfType.termSymbol` によって関連付けられるモジュール・シンボルを得られる。

### シンボル変換

状況によっては汎用の `Symbol` 型を返すメソッドを使う場面があるかもしれない。
その場合、汎用の `Symbol` 型をより特定の特殊化されたシンボル型へと変換することができる。
例えば `MethodSymbol` のインターフェイスを使いたいといった状況に合わせて、`asMethod` や `asClass` のようなシンボル変換を用いると特殊化した
`Symbol` のサブタイプに変換することができる。

具体例を用いて説明しよう。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> class C[T] { def test[U](x: T)(y: U): Int = ??? }
    defined class C

    scala> val testMember = typeOf[C[Int]].member(newTermName("test"))
    testMember: scala.reflect.runtime.universe.Symbol = method test

この場合、`member` は期待される `MethodSymbol` ではなく `Symbol` のインスタンスを返す。
このため、`asMethod` を使って `MethodSymbol` が返されたことを保証する必要がある。

    scala> testMember.asMethod
    res0: scala.reflect.runtime.universe.MethodSymbol = method test

### 自由シンボル

2つのシンボル型 `FreeTermSymbol` と `FreeTypeSymbol`
は入手可能な情報が不完全であるという特殊なステータスを持つシンボルだ。
これらのシンボルはレイフィケーションの過程において生成される
(詳しくは構文木のレイフィケーションの節を参照)。
レイフィケーションがシンボルを特定できない場合
(例えば、ローカルクラスを参照しているため、あるシンボルが対応するクラスファイルから見つけることができない場合)
元の名前とオーナー、そして元の型シグネチャに似た代理シグネチャを持った合成のダミーシンボルへとレイファイする。このシンボルは自由型
(free type) と呼ばれる。
あるシンボルが自由型かどうかは `sym.isFreeType` を呼ぶことで確かめることができる。
また、`tree.freeTypes` を呼ぶことで特定の構文木とその部分木から参照されている全ての自由型のリストを取得することができる。
最後に、`-Xlog-free-types` を用いることでレイフィケーションが自由型を生成したときに警告を得ることができる。

## 型

名前が示すとおり、`Type` のインスタンスは対応するシンボルの型情報を表す。
これは、直接宣言もしくは継承されたメンバ (メソッド、フィールド、型エイリアス、抽象型、内部クラス、トレイトなど)、
基底型、型消去などを含む。他にも、型は型の適合性 (conformance) や等価性 (equivalence) を検査することができる。

### 型のインスタンス化

一般的には以下の 3通りの方法で `Type` を得ることができる。

1. `Universe` にミックスインされている `scala.reflect.api.TypeTags` の `typeOf` メソッド経由。(最も簡単で、一般的な方法)
2. `Int`、`Boolean`、`Any`、や `Unit` のような標準型はユニバースからアクセス可能だ。
3. `scala.reflect.api.Types` の `typeRef` や `polyType` といったメソッドを使った手動のインスタンス化。(非推奨)

#### `typeOf` を用いた型のインスタンス化

多くの場合、型をインスタンス化するのには
`scala.reflect.api.TypeTags#typeOf` メソッドを使うことができる。
これは型引数を受け取り、その引数を表す `Type` のインスタンスを返す。
具体例で説明すると、

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> typeOf[List[Int]]
    res0: scala.reflect.runtime.universe.Type = scala.List[Int]

この例では、型コンストラクタ `List` に型引数 `Int` が適用された
[`scala.reflect.api.Types$TypeRef`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/reflect/api/Types$TypeRef.html)
が返っている。

しかし、この方法はインスタンス化しようとしている型を手動で指定する必要があることに注意してほしい。
もし任意のインスタンスに対応する `Type` のインスタンスを取得しようとしてる場合はどうすればいいだろう？
型パラメータに context bound を付けたメソッドを定義すればいいだけだ。これは特殊な `TypeTag`
を生成し、そこから任意のインスタンスに対する型を取得することができる:

    scala> def getType[T: TypeTag](obj: T) = typeOf[T]
    getType: [T](obj: T)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T])scala.reflect.runtime.universe.Type

    scala> getType(List(1,2,3))
    res1: scala.reflect.runtime.universe.Type = List[Int]

    scala> class Animal; class Cat extends Animal
    defined class Animal
    defined class Cat

    scala> val a = new Animal
    a: Animal = Animal@21c17f5a

    scala> getType(a)
    res2: scala.reflect.runtime.universe.Type = Animal

    scala> val c = new Cat
    c: Cat = Cat@2302d72d

    scala> getType(c)
    res3: scala.reflect.runtime.universe.Type = Cat

**注意**: `typeOf` メソッドは、型パラメータを受け取る型
(例えば、`A` が型パラメータであるとき `typeOf[List[A]]`) では動作しない。
その場合は、代わりに `scala.reflect.api.TypeTags#weakTypeOf` を使うことができる。
これに関する詳細はこのガイドの [TypeTags]({{ site.baseurl }}/ja/overviews/reflection/typetags-manifests.html)
に関する節を参照。

#### 標準型

`Int`、`Boolean`、`Any`、や `Unit` のような標準型はユニバースの `definitions` メンバからアクセス可能だ。
具体的には、

    scala> import scala.reflect.runtime.universe
    import scala.reflect.runtime.universe

    scala> val intTpe = universe.definitions.IntTpe
    intTpe: scala.reflect.runtime.universe.Type = Int

標準型のリストは [`scala.reflect.api.StandardDefinitions`](http://www.scala-lang.org/api/current/index.html#scala.reflect.api.StandardDefinitions$StandardTypes) 内の `StandardTypes`
トレイトにて定義されている。

### 型の一般的な演算

型の典型的な用例としては型の適合性の検査や、メンバの問い合わせがある。
型に対する演算を 3つに大別すると以下のようになる:

<ol>
<li>2つの型の間のサブタイプ関係の検査。</li>
<li>2つの型の間の等価性の検査。</li>
<li>渡された型の特定のメンバや内部型の問い合わせ。</li>
</ol>

#### サブタイプ関係

2つの `Type` インスタンスがあるとき、`<:<` を用いて簡単に一方がもう片方のサブタイプであるかを調べることができる。
(後で説明する例外的な場合においては、`weak_<:<` を使う)

    scala> import scala.reflect.runtime.universe._
    import scala-lang.reflect.runtime.universe._

    scala> class A; class B extends A
    defined class A
    defined class B

    scala> typeOf[A] <:< typeOf[B]
    res0: Boolean = false

    scala> typeOf[B] <:< typeOf[A]
    res1: Boolean = true

`weak_<:<` メソッドは、2つの型の間の**弱い適合性** (weak conformance) をチェックするのに使われることに注意。
これは典型的には数値型を取り扱う際に重要となる。

Scala の数値型は以下の順序付けに従っている (Scala 言語仕様 3.5.3 節):

> Scala はいくつかの状況では、より一般的な適合性関係を用います。 もし `S <: T` であるか、あるいは、`S` と `T` 両方がプリミティブな数値型で、次の順序中で `S` が `T` の前にあるなら、型 `S` は型 `T` に弱く適合するといい、`S <:w T` と書きます。

| 弱適合性関係 |
 ---------------------------
| `Byte` `<:w` `Short` |
| `Short` `<:w` `Int` |
| `Char` `<:w` `Int` |
| `Int` `<:w` `Long` |
| `Long` `<:w` `Float` |
| `Float` `<:w` `Double` |

例えば、以下の if-式の型は弱い適合性によって決定されている。

    scala> if (true) 1 else 1d
    res2: Double = 1.0

上記の if-式では結果の型は 2つの型の**弱い最小の上限境界**
(weak least upper bound、つまり弱い適合性上で最小の上限境界) だと定義されている。

`Int` と `Double` の間では (上記の仕様により) `Double`
が弱い適合性上での最小の上限境界だと定義されいるため、
`Double` が例の if-式の型だと推論される。

`weak_<:<` メソッドは弱い適合性をチェックすることに注意してほしい。
(それに対して、`<:<` は仕様 3.5.3 節の弱い適合性を考慮しない適合性を検査する)
そのため、数値型 `Int` と `Double` の適合性関係を正しくインスペクトできる:

    scala> typeOf[Int] weak_<:< typeOf[Double]
    res3: Boolean = true

    scala> typeOf[Double] weak_<:< typeOf[Int]
    res4: Boolean = false

`<:<` を使った場合は `Int` と `Double` は互いに不適合であると間違った結果となる:

    scala> typeOf[Int] <:< typeOf[Double]
    res5: Boolean = false

    scala> typeOf[Double] <:< typeOf[Int]
    res6: Boolean = false

#### 型の等価性

型の適合性同様に 2つの型の等価性を簡単に検査することができる。
2つの任意の型が与えられたとき、`=:=` メソッドを使うことでそれらが全く同一のコンパイル時型を表記しているかを調べることができる。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def getType[T: TypeTag](obj: T) = typeOf[T]
    getType: [T](obj: T)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T])scala.reflect.runtime.universe.Type

    scala> class A
    defined class A

    scala> val a1 = new A; val a2 = new A
    a1: A = A@cddb2e7
    a2: A = A@2f0c624a

    scala> getType(a1) =:= getType(a2)
    res0: Boolean = true

両方のインスタンスの型情報が寸分違わず一致している必要があることに注意してほしい。
例えば、以下のコードにおいて異なる型引数を取る 2つの `List` のインスタンスがある。

    scala> getType(List(1,2,3)) =:= getType(List(1.0, 2.0, 3.0))
    res1: Boolean = false

    scala> getType(List(1,2,3)) =:= getType(List(9,8,7))
    res2: Boolean = true

また、型の等価性を検査するためには**常に** `=:=` を使う必要があることに注意してほしい。
つまり、型エイリアスをチェックすることができない `==` は絶対に使ってはいけないということだ:

    scala> type Histogram = List[Int]
    defined type alias Histogram

    scala> typeOf[Histogram] =:= getType(List(4,5,6))
    res3: Boolean = true

    scala> typeOf[Histogram] == getType(List(4,5,6))
    res4: Boolean = false

見てのとおり、`==` は `Histogram` と `List[Int]` が異なる型であると間違った結果を出している。

#### 型に対するメンバと宣言の照会

ある `Type` があるとき、特定のメンバや宣言を**照会** (query) することができる。
`Type` の**メンバ** (member) には全てのフィールド、メソッド、型エイリアス、抽象型、内部クラス/オブジェクト/トレイトなどが含まれる。
`Type` の**宣言** (declaration) にはその `Type` が表すクラス/オブジェクト/トレイト内で宣言された (継承されなかった) メンバのみが含まれる。

ある特定のメンバや宣言の `Symbol` を取得するにはその型に関連する定義のリストを提供する
`members` か `declarations` メソッドを使うだけでいい。単一のシンボルのみを返す
`meber` と `declaration` というメソッドもある。以下に 4つのメソッド全てのシグネチャを示す:

    /** The member with given name, either directly declared or inherited, an
      * OverloadedSymbol if several exist, NoSymbol if none exist. */
    def member(name: Universe.Name): Universe.Symbol

    /** The defined or declared members with name name in this type; an
      * OverloadedSymbol if several exist, NoSymbol if none exist. */
    def declaration(name: Universe.Name): Universe.Symbol

    /** A Scope containing all members of this type
      * (directly declared or inherited). */
    def members: Universe.MemberScope // MemberScope is a type of
                                      // Traversable, use higher-order
                                      // functions such as map,
                                      // filter, foreach to query!

    /** A Scope containing the members declared directly on this type. */
    def declarations: Universe.MemberScope // MemberScope is a type of
                                           // Traversable, use higher-order
                                           // functions such as map,
                                           // filter, foreach to query!

例えば、`List` の `map` メソッドを照会するには以下のようにする。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> typeOf[List[_]].member("map": TermName)
    res0: scala.reflect.runtime.universe.Symbol = method map

メソッドを照会するために `member` メソッドに `TermName` を渡していることに注意してほしい。
ここで、`List` の自分型である `Self` のような型メンバを照会する場合は `TypeName` を渡す:

    scala> typeOf[List[_]].member("Self": TypeName)
    res1: scala.reflect.runtime.universe.Symbol = type Self

型の全てのメンバや宣言を面白い方法で照会することもできる。
`members` メソッドを使って、渡された型の全ての継承もしくは宣言されたメンバを表す
`Symbol` の `Traversable` を取得することができる (`MemberScopeApi` は `Traversable` を継承する)。
これにより、`foreach`、`filter`、`map` などの馴染み深いコレクションに対する高階関数を使って型のメンバを探検することができる。
例えば、`List` のメンバのうち private なものだけを表示したいとする:

    scala> typeOf[List[Int]].members.filter(_.isPrivate).foreach(println _)
    method super$sameElements
    method occCounts
    class CombinationsItr
    class PermutationsItr
    method sequential
    method iterateUntilEmpty

## 構文木

**構文木** (`Tree`) は、プログラムを表す Scala の抽象構文の基盤となっている。
これらは抽象構文木 (abstract syntax tree) とも呼ばれ、一般に AST と略される。

Scala リフレクションで、構文木を生成または利用する API には以下のようなものがある:

1. Scala アノテーションは引数に構文木を用い、`Annotation.scalaArgs` として公開されている。(詳細はこのガイドの[アノテーション]({{ site.baseurl }}/ja/overviews/reflection/names-exprs-scopes-more.html)の節を参照)
2. 任意の式を受け取りその AST を返す `reify` という特殊なメソッド。
3. マクロを用いたコンパイル時リフレクション (詳細は[マクロ]({{ site.baseurl }}/ja/overview/macros/overview.html)参照) とツールボックスを用いた実行時リフレクションは両方とも構文木を用いてプログラムを表現する。

ここで注意してほしいのは構文木は `pos` (`Position`)、 `symbol` (`Symbol`)、
と型検査の際に代入される `tpe` (`Type`) という 3つのフィールドの他は不変 (immutable) であることだ。

### 構文木の種類

構文木は以下の 3つのカテゴリーに大別することができる:

1. **`TermTree` のサブクラス**は項を表す。例えば、メソッドの呼び出しは `Apply` ノードで表され、オブジェクトのインスタンス化は `New` ノードで行われる。
2. **`TypTree` のサブクラス**はプログラムのソースコード中に現れる型を表す。例えば、`List[Int]` は `AppliedTypeTree` へとパースされる。**注意**: `TypTree` は綴り間違いではないし、概念的に `TypeTree` とは異なるものだ。(例えば型推論などによって) コンパイラが `Type` を構築する場合にプログラムの AST に統合できるように `TypeTree` にラッピングされる。
3. **`SymTree` のサブクラス**は定義を導入または参照する。新しい定義の導入の具体例としてはクラスやトレイトの定義を表す `ClassDef` や、フィールドやパラメータ定義を表す `ValDef` が挙げられる。既存の定義に対する参照の例としてはローカル変数やメソッドなど現行のスコープ内にある既存の定義を参照する `Ident` を挙げることができる。

上記のカテゴリー以外の構文木を目にすることがあるとすれば、それは典型的には合成的なものか短命な構築物だ。
例えば、各マッチケースをラッピングする `CaseDef` は項でも型でもなく、シンボルも持たない。

### 構文木をインスペクトする

Scala リフレクションは、ユニバース経由で構文木を視覚化する方法をいくつか提供する。渡された構文木があるとき、

- `show` もしくは `toString` メソッドを使って構文木が表す擬似 Scala コードを表示することができる。
- `showRaw` メソッドを使ってタイプチェッカが用いる生の構文木の内部構造を見ることができる。

具体例を使って説明しよう:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Ident(newTermName("x")), newTermName("$plus")), List(Literal(Constant(2))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2)

`show` メソッド (もしくは同等の `toString`) を使ってこの構文木が何を表しているかを見てみよう。

    scala> show(tree)
    res0: String = x.$plus(2)

見てのとおり、`tree` は `2` を項 `x` に加算する。

逆の方向に行くこともできる。ある Scala の式が与えられたとき、そこから構文木を取得した後で
`showRaw` メソッドを用いてコンパイラやタイプチェッカが使っている生の構文木の内部構造を見ることができる。
例えば、以下の式があるとする:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val expr = reify { class Flower { def name = "Rose" } }
    expr: scala.reflect.runtime.universe.Expr[Unit] = ...

ここで、`reify` は Scala 式を受け取り `Tree` と `TypeTag` をラッピングする `Expr` を返す。
(`Expr` の詳細に関してはこのガイドの[式]({{ site.baseurl }}/ja/overviews/reflection/names-exprs-scopes-more.html)の節を参照)
`expr` が保持する構文木は以下のように取得できる:

    scala> val tree = expr.tree
    tree: scala.reflect.runtime.universe.Tree =
    {
      class Flower extends AnyRef {
        def <init>() = {
          super.<init>();
          ()
        };
        def name = "Rose"
      };
      ()
    }

生の構文木の内部構造をインスペクトするには以下のように行う:

    scala> showRaw(tree)
    res1: String = Block(List(ClassDef(Modifiers(), newTypeName("Flower"), List(), Template(List(Ident(newTypeName("AnyRef"))), emptyValDef, List(DefDef(Modifiers(), nme.CONSTRUCTOR, List(), List(List()), TypeTree(), Block(List(Apply(Select(Super(This(tpnme.EMPTY), tpnme.EMPTY), nme.CONSTRUCTOR), List())), Literal(Constant(())))), DefDef(Modifiers(), newTermName("name"), List(), List(), TypeTree(), Literal(Constant("Rose"))))))), Literal(Constant(())))

### 構文木の走査

構文木の内部構造が分かった所で、よくある次のステップは情報を抽出することだ。
これは構文木を**走査**することで行われ、以下の 2通りの方法がある:

<ul>
<li>パターンマッチングを用いた走査</li>
<li><code>Traverser</code> のサブクラスを用いた走査</li>
</ul>

#### パターンマッチングを用いた走査

パターンマッチングを用いた走査は最も簡単で一般的な構文木の走査方法だ。
典型的にはある構文木の単一のノードの状態を知りたい場合にパターンマッチングを用いた走査を行う。
例えば、以下の構文木に1つだけある `Apply` ノードから関数と引数を取得したいとする。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Ident(newTermName("x")), newTermName("$plus")), List(Literal(Constant(2))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2)

`tree` に対してマッチをかけてやるだけでよく、`Apply` ケースの場合には `Apply` の関数と引数を返す:

    scala> val (fun, arg) = tree match {
         |     case Apply(fn, a :: Nil) => (fn, a)
         | }
    fun: scala.reflect.runtime.universe.Tree = x.$plus
    arg: scala.reflect.runtime.universe.Tree = 2

パターンマッチを左辺項に移すことで上記と同じことをより簡潔に実現できる:

    scala> val Apply(fun, arg :: Nil) = tree
    fun: scala.reflect.runtime.universe.Tree = x.$plus
    arg: scala.reflect.runtime.universe.Tree = 2

ノードは他のノード内に任意の深さで入れ子になることができるため、`Tree`
は普通かなり複雑となることに注意してほしい。これを示す簡単な例として、上記の構文木に
2つ目の `Apply` を加えて既にある和に `3` を加算する:

    scala> val tree = Apply(Select(Apply(Select(Ident(newTermName("x")), newTermName("$plus")), List(Literal(Constant(2)))), newTermName("$plus")), List(Literal(Constant(3))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2).$plus(3)

これに上記と同じパターンマッチを適用すると外側の `Apply`
ノードが得られ、それは上で見た `x.$plus(2)` を表す構文木を関数部分として格納する:

    scala> val Apply(fun, arg :: Nil) = tree
    fun: scala.reflect.runtime.universe.Tree = x.$plus(2).$plus
    arg: scala.reflect.runtime.universe.Tree = 3

    scala> showRaw(fun)
    res3: String = Select(Apply(Select(Ident(newTermName("x")), newTermName("$plus")), List(Literal(Constant(2)))), newTermName("$plus"))

特定のノードで止まることなく構文木全体を走査したり、特定の型のノードを収集してインスペクトするなどより複雑なタスクを行うためには
`Traverser` を用いた走査の方が適しているかもしれない。

#### `Traverser` のサブクラスを用いた走査

初めから終わりまで構文木全体を走査する必要がある場合は、パターンマッチ中に現れうる全ての型に対する処理をする必要があるためパターンマッチングを用いた走査は適さない。
そのため、そのような場合は `Traverser` クラスを用いる。

`Traevrser` は幅優先探索を用いて渡された構文木の全てのノードを訪れることを保証する。

`Traverser` を使うには、`Traverser` を継承して `traverse` メソッドをオーバーライドする。
こうすることで必要なケースだけを処理するカスタムロジックを提供する。
例えば `x.$plus(2).$plus(3)` の構文木があるとき、全ての `Apply` ノードを収集したいとする:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Apply(Select(Ident(newTermName("x")), newTermName("$plus")), List(Literal(Constant(2)))), newTermName("$plus")), List(Literal(Constant(3))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2).$plus(3)

    scala> object traverser extends Traverser {
         |   var applies = List[Apply]()
         |   override def traverse(tree: Tree): Unit = tree match {
         |     case app @ Apply(fun, args) =>
         |       applies = app :: applies
         |       super.traverse(fun)
         |       super.traverseTrees(args)
         |     case _ => super.traverse(tree)
         |   }
         | }
    defined module traverser

上のコードは渡された構文木のうち `Apply` ノードだけを探してリストを構築している。

これはスーパークラス `Traverser` で既に幅優先探索として実装されている
`traverse` メソッドをサブクラス `traverser` のオーバーライドされた
`traverse` メソッドが特別なケースを**追加**するという形で実現されている。
この特別なケースは `Apply(fun, args)` というパターンにマッチするノードのみに効用がある。
(`fun` は `Tree` で表される関数、`args` は `Tree` のリストで表される引数のリストとなる)

ある構文木がこのパターンにマッチすると (つまり、`Apply` ノードがあるとき)、
`List[Apply]` である `applies` に追加して、走査を続行する。

マッチした場合の処理で `Apply` にラッピングされた関数 `fun` に対して `super.traverse`
そして引数のリスト `args` に対しては `super.traverseTrees`
(`super.traverse` とほぼ同じものだが、単一の `Tree` の代わりに `List[Tree]` を受け取る)
を呼び出していることに注意してほしい。
両方の呼び出しとも目的は簡単で、`fun` の中にも `Apply` パターンがあるか分からないため部分木に対してもデフォルトの
`Traverser` の `traverse` メソッドが確かに呼ばれるようにしている。
スーパークラスである `Traverser` は全ての入れ子になっている部分木に対して `this.traverse`
を呼び出すため、`Apply` パターンを含む部分木もカスタムの `traverse` メソッドを呼び出すことが保証されている。

`traverse` を開始して、その結果の `Apply` の `List` を表示するには以下のように行う:

    scala> traverser.traverse(tree)

    scala> traverser.applies
    res0: List[scala.reflect.runtime.universe.Apply] = List(x.$plus(2), x.$plus(2).$plus(3))

### 構文木の構築

実行時リフレクションを行う際に、構文木を手動で構築する必要は無い。
しかし、ツールボックスを用いて実行時コンパイルする場合やマクロを用いてコンパイル時リフレクションを行う場合はプログラムを表現する媒体として構文木が使われる。
そのような場合、構文木を構築する 3通りの方法がある:

1. `reify` メソッドを用いる (可能な限りこれを使うことを推奨する)
2. ツールボックスの `parse` メソッドを用いる
3. 手動で構築する (非推奨)

#### `reify` を用いた構文木の構築

`reify` メソッドは Scala 式を引数として受け取り、その引数を `Tree` として表現したものを結果として返す。

Scala リフレクションでは、`reify` メソッドを用いた構文木の構築が推奨される方法だ。その理由を具体例を用いて説明しよう:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> { val tree = reify(println(2)).tree; showRaw(tree) }
    res0: String = Apply(Select(Select(This(newTypeName("scala")), newTermName("Predef")), newTermName("println")), List(Literal(Constant(2))))

ここで、単に `println(2)` という呼び出しを `reify` している。
つまり、`println(2)` という式をそれに対応する構文木の表現に変換している。そして、生の構文木の内部構造を出力している。
`println` メソッドが `scala.Predef.println` に変換されたことに注目してほしい。
このような変換は `reify` の結果がどこで用いられても意味が変わらないことを保証する。
例えば、この `println(2)` というコードが独自の `println` を定義するブロックに挿入されたとしてもこのコードの振る舞いには影響しない。

このような構文木の構築は、識別子のバインディングを保持するため**健全** (hygenic) であるといわれる。

##### 構文木のスプライシング

`reify` を使うことで複数の小さい構文木から 1つの構文木へと合成することもできる。これは
`Expr.splice` (スプライス、「継ぎ足す」という意味) を用いて行われる。

**注意**: `Expr` は `reify` の戻り値の型だ。**型付けされた** (typed) 構文木、`TypeTag`
そして `splice` などのレイフィケーションに関連するいくつかのメソッドを含む簡単なラッパーだと思ってもらえばいい。
`Expr` に関する詳細は[このガイドの関連項目]({{ site.baseurl}}/ja/overviews/reflection/annotations-names-scopes.html)を参照。

例えば、`splice` を用いて `println(2)` を表す構文木を構築してみよう:

    scala> val x = reify(2)
    x: scala.reflect.runtime.universe.Expr[Int(2)] = Expr[Int(2)](2)

    scala> reify(println(x.splice))
    res1: scala.reflect.runtime.universe.Expr[Unit] = Expr[Unit](scala.this.Predef.println(2))

ここで `2` と `println` をそれぞれ別に `reify` して、一方を他方の中に `splice` している。

しかし、`reify` の引数は妥当で型付け可能な Scala のコードであることが要求されることに注意してほしい。
`println` の引数の代わりに、`println` そのものを抽象化しようとした場合は失敗することを以下に示す:

    scala> val fn = reify(println)
    fn: scala.reflect.runtime.universe.Expr[Unit] = Expr[Unit](scala.this.Predef.println())

    scala> reify(fn.splice(2))
    <console>:12: error: Unit does not take parameters
                reify(fn.splice(2))
                                ^

見てのとおり、呼び出された関数の名前だけを捕捉したかったわけだが、コンパイラは引数無しの `println` という呼び出しをレイファイしたかったのだと決めてかかっている。

このようなユースケースは現在 `reify` を用いては表現することはできない。

#### ツールボックスの `parse` を用いた構文木の構築

**ツールボックス** (`Toolbox`) を使って構文木の型検査、コンパイル、および実行を行うことができる。
ツールボックスはまた、文字列を構文木へとパースすることができる。

**注意**: ツールボックスの仕様は `scala-compiler.jar` にクラスパスが通っていることを必要とする。

`parse` メソッドを使った場合に、前述の `println` の例がどうなるかみてみよう:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> import scala.tools.reflect.ToolBox
    import scala.tools.reflect.ToolBox

    scala> val tb = runtimeMirror(getClass.getClassLoader).mkToolBox()
    tb: scala.tools.reflect.ToolBox[scala.reflect.runtime.universe.type] = scala.tools.reflect.ToolBoxFactory$ToolBoxImpl@7bc979dd

    scala> showRaw(tb.parse("println(2)"))
    res2: String = Apply(Ident(newTermName("println")), List(Literal(Constant(2))))

`reify` と違って、ツールボックスは型付けの要求を必要としないことに注目してほしい。
この柔軟性の引き換えに堅牢性が犠牲になっている。どういう事かと言うと、`reify`
と違ってこの `parse` は `println` が標準の `println` メソッドにバインドされていることが反映されていない。

**注意**: マクロを使っている場合は、`ToolBox.parse` を使うべきではない。マクロコンテキストに既に
`parse` メソッドが組み込まれているからだ。具体例を使って説明しよう:

    scala> import scala.language.experimental.macros
    import scala.language.experimental.macros

    scala> def impl(c: scala.reflect.macros.Context) = c.Expr[Unit](c.parse("println(2)"))
    impl: (c: scala.reflect.macros.Context)c.Expr[Unit]

    scala> def test = macro impl
    test: Unit

    scala> test
    2

##### ツールボックスを用いた型検査

前に少し触れたが、ツールボックス (`ToolBox`) は文字列から構文木を構築する以外にも使い道があって、構文木の型検査、コンパイル、および実行を行うことができる。

プログラムの大まかな構造を保持する他に、構文木はプログラムの意味論に関する重要な情報を
`symbol` (定義を導入または参照する構文木に割り当てられたシンボル) や
`tpe` (構文木の型) という形で保持する。デフォルトでは、これらのフィールドは空だが、型検査をすることで充足される。

実行時リフレクションのフレームワークを利用する場合、型検査は `ToolBox.typeCheck` によって実装される。
コンパイル時にマクロを利用する場合は `Context.typeCheck` メソッドを使う。

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = reify { "test".length }.tree
    tree: scala.reflect.runtime.universe.Tree = "test".length()

    scala> import scala.tools.reflect.ToolBox
    import scala.tools.reflect.ToolBox

    scala> val tb = runtimeMirror(getClass.getClassLoader).mkToolBox()
    tb: scala.tools.reflect.ToolBox[scala.reflect.runtime.universe.type] = ...

    scala> val ttree = tb.typeCheck(tree)
    ttree: tb.u.Tree = "test".length()

    scala> ttree.tpe
    res5: tb.u.Type = Int

    scala> ttree.symbol
    res6: tb.u.Symbol = method length

上の例では、`"test".length` という呼び出しを表現する構文木を構築して、`ToolBox` `tb`
の `typeCheck` メソッドを用いて構文木を型検査している。
見てのとおり、`ttree` は正しい型 `Int` を取得して、`Symbol` も正しく設定されている。

#### 手動の構文木の構築

もし全てが失敗した場合は、手動で構文木を構築することもできる。これは最も低レベルな構文木を構築する方法で、他の方法がうまくいかなかった場合のみ挑むべき方法だ。
`parse` に比べてより柔軟な方法を提供するが、その柔軟性は過度の冗長さと脆弱さによって実現されている。

`println(2)` を使った例題を手動で構築すると、こうなる:

    scala> Apply(Ident(newTermName("println")), List(Literal(Constant(2))))
    res0: scala.reflect.runtime.universe.Apply = println(2)

このテクニックの典型的なユースケースは単独では意味を成さない動的に構築された部分木を組み合わせて構文木を作る必要がある場合だ。
そのような場合、引数が型付けられていることを必要とする `reify` はおそらく不適切だろう。
構文木は個々の部分木では Scala ソースとして表現することができない式以下のレベルから組み立てられることがよくあるため、`parse`
でもうまくいかないだろう。
