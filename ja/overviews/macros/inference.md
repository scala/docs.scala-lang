---
layout: overview-large
language: ja

disqus: true

title: 型推論補助マクロ
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

型推論補助マクロ (inference-driving macro) はマクロパラダイスと呼ばれているオフィシャル Scala リポジトリ内の実験的なブランチに含まれるリリース前の機能だ。[マクロパラダイス](/ja/overviews/macros/paradise.html)ページの説明にしたがってナイトリービルドをダウンロードしてほしい。

注意! これはパラダイスの実験的機能の中でも最も実験的なものだ。型マクロのような完成に近づいているものと違って、この機能は API の詳細が定まっていないだけでなく、現行の方法が正しいものであるかも確信できていない。フィードバックをこれまでになく必要としている。この[原版](/overviews/macros/inference.html)のコメント欄に直接コメントするか、[scala-internals での議論](http://groups.google.com/group/scala-internals/browse_thread/thread/ad309e68d645b775)に参加してほしい。

## 動機となった具体例

型推論補助マクロが生まれるキッカケとなったユースケースは、Miles Sabin 氏と氏が作った [shapeless](https://github.com/milessabin/shapeless) ライブラリにより提供された。Miles は 型間の同型射 (isomorphism) を表す `Iso` トレイトを定義した。

    trait Iso[T, U] {
      def to(t : T) : U
      def from(u : U) : T
    }

現在は `Iso` のインスタンスは手動で定義され、暗黙の値として公開される。定義された同型射を利用したいメソッドは `Iso` 型の暗黙のパラメータを宣言して、そこに implicit 検索時に値が渡される。

    def foo[C](c: C)(implicit iso: Iso[C, L]): L = iso.from(c)

    case class Foo(i: Int, s: String, b: Boolean)
    implicit val fooIsoTuple = Iso.tuple(Foo.apply _, Foo.unapply _)

    val tp  = foo(Foo(23, "foo", true))
    tp : (Int, String, Boolean)
    tp == (23, "foo", true)

見ての通り、ケースクラスとタプル間の同型射は簡単に書くことができる (実際には shapeless は Iso を用いてケースクラスと HList 間を変換するが、話を簡潔にするためにここではタプルを使う)。コンパイラは必要なメソッドを既に生成しているため、それを利用するだけでいい。残念ながら Scala 2.10.0 ではこれより単純化することは不可能で、全てのケースクラスに対して手動で implicit の `Iso` インスタンスを定義する必要がある。

これまでマクロはボイラープレイトを撤去するのに役立つをことを示してきたが、2.10.0 の形のままではここでは役に立たない。問題は master では数週間まえに修正されている [SI-5923](https://issues.scala-lang.org/browse/SI-5923) だけではない。

真の問題は `foo` のようなメソッドの適用を型検査する際に、scalac は何も知らない型引数 `L` を推論する必要があることだ (これはドメインに特化した知識なのでコンパイラのせいではない)。結果として、`Iso[C, L]` を合成する暗黙のマクロを定義したとしても、scalac はマクロを展開する前に `L` を `Nothing` と推論して全てが崩れてしまう。

## 型推論の内部構造

この数日で分かったのは Scala の型推論は `scala/tools/nsc/typechecker/Infer.scala` 内の [`inferExprInstance`](https://github.com/scalamacros/kepler/blob/d7b59f452f5fa35df48a5e0385f579c98ebf3555/src/compiler/scala/tools/nsc/typechecker/Infer.scala#L1123) と
[`inferMethodInstance`](https://github.com/scalamacros/kepler/blob/d7b59f452f5fa35df48a5e0385f579c98ebf3555/src/compiler/scala/tools/nsc/typechecker/Infer.scala#L1173) という 2つのメソッドで行われているということだ。
今の所、型推論を使った様々なコードに対して `-Yinfer-debug` のログを表示させてみる以外、特に書くことは無い。

    def foo[T1](x: T1) = ???
    foo(2)

    [solve types] solving for T1 in ?T1
    [infer method] solving for T1 in (x: T1)Nothing based on (Int)Nothing (solved: T1=Int)

    def bar[T2] = ???
    bar

    [solve types] solving for T2 in ?T2
    inferExprInstance {
      tree      C.this.bar[T2]
      tree.tpe  Nothing
      tparams   type T2
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }

    class Baz[T]
    implicit val ibaz = new Baz[Int]
    def baz[T3](implicit ibaz: Baz[T3]) = ???
    baz

    [solve types] solving for T3 in ?T3
    inferExprInstance {
      tree      C.this.baz[T3]
      tree.tpe  (implicit ibaz: C.this.Baz[T3])Nothing
      tparams   type T3
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }
    inferExprInstance/AdjustedTypeArgs {
      okParams
      okArgs
      leftUndet  type T3
    }
    [infer implicit] C.this.baz[T3] with pt=C.this.Baz[T3] in class C
    [search] C.this.baz[T3] with pt=C.this.Baz[T3] in class C, eligible:
      ibaz: => C.this.Baz[Int]
    [search] considering T3 (pt contains ?T3) trying C.this.Baz[Int] against pt=C.this.Baz[T3]
    [solve types] solving for T3 in ?T3
    [success] found SearchResult(C.this.ibaz, TreeTypeSubstituter(List(type T3),List(Int))) for pt C.this.Baz[=?Int]
    [infer implicit] inferred SearchResult(C.this.ibaz, TreeTypeSubstituter(List(type T3),List(Int)))

    class Qwe[T]
    implicit def idef[T4] = new Qwe[T4]
    def qwe[T4](implicit xs: Qwe[T4]) = ???
    qwe

    [solve types] solving for T4 in ?T4
    inferExprInstance {
      tree      C.this.qwe[T4]
      tree.tpe  (implicit xs: C.this.Qwe[T4])Nothing
      tparams   type T4
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }
    inferExprInstance/AdjustedTypeArgs {
      okParams
      okArgs
      leftUndet  type T4
    }
    [infer implicit] C.this.qwe[T4] with pt=C.this.Qwe[T4] in class C
    [search] C.this.qwe[T4] with pt=C.this.Qwe[T4] in class C, eligible:
      idef: [T4]=> C.this.Qwe[T4]
    [solve types] solving for T4 in ?T4
    inferExprInstance {
      tree      C.this.idef[T4]
      tree.tpe  C.this.Qwe[T4]
      tparams   type T4
      pt        C.this.Qwe[?]
      targs     Nothing
      tvars     =?Nothing
    }
    [search] considering T4 (pt contains ?T4) trying C.this.Qwe[Nothing] against pt=C.this.Qwe[T4]
    [solve types] solving for T4 in ?T4
    [success] found SearchResult(C.this.idef[Nothing], ) for pt C.this.Qwe[=?Nothing]
    [infer implicit] inferred SearchResult(C.this.idef[Nothing], )
    [solve types] solving for T4 in ?T4
    [infer method] solving for T4 in (implicit xs: C.this.Qwe[T4])Nothing based on (C.this.Qwe[Nothing])Nothing (solved: T4=Nothing)

## 提案

[マクロバンドル](/ja/overviews/macros/bundles.html)で提供されるインフラを使って、`onInfer` というコールバックを導入する。
このコールバックが定義されていれば、コンパイラによって `inferExprInstance` と `inferMethodInstance` から呼び出される。
これは、`inferXXX` メソッドへの引数をカプセル化し未知の型パラメータの型推論を実行するメソッドを提供する `c.TypeInferenceContext` 型のパラメータを 1つ受け取る。

    trait Macro {
      val c: Context
      def onInfer(tc: c.TypeInferenceContext): Unit = tc.inferDefault()
    }

    type TypeInferenceContext <: TypeInferenceContextApi
    trait TypeInferenceContextApi {
      def tree: Tree
      def unknowns: List[Symbol]
      def expectedType: Type
      def actualType: Type

      // TODO: can we get rid of this couple?
      def keepNothings: Boolean
      def useWeaklyCompatible: Boolean

      def infer(sym: Symbol, tpe: Type): Unit

      // TODO: would be lovely to have a different signature here, namely:
      // def inferDefault(sym: Symbol): Type
      // so that the macro can partially rely on out-of-the-box inference
      // and infer the rest afterwards
      def inferDefault(): Unit
    }

このインフラがあれば、`materializeIso` マクロを書いて手動で implicit を宣言する手間を省くことができる。
完全なソースコードは [paradise/macros](https://github.com/scalamacros/kepler/blob/paradise/macros/test/files/run/macro-programmable-type-inference/Impls_Macros_1.scala) より入手できるが、以下に主な部分を抜粋する:

    override def onInfer(tic: c.TypeInferenceContext): Unit = {
      val C = tic.unknowns(0)
      val L = tic.unknowns(1)
      import c.universe._
      import definitions._
      val TypeRef(_, _, caseClassTpe :: _ :: Nil) = tic.expectedType // Iso[Test.Foo,?]
      tic.infer(C, caseClassTpe)
      val fields = caseClassTpe.typeSymbol.typeSignature.declarations.toList.collect{ case x: TermSymbol if x.isVal && x.isCaseAccessor => x }
      val core = (TupleClass(fields.length) orElse UnitClass).asType.toType
      val tequiv = if (fields.length == 0) core else appliedType(core, fields map (_.typeSignature))
      tic.infer(L, tequiv)
    }
