---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 7

title: 型プロバイダ
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

型プロバイダ (type provider) はそれ専用にマクロの種類があるわけではなくて、すでに Scala マクロが提供する機能の上に成り立っている。

型プロバイダをエミュレートするのは 2通りの方法があって、構造的部分型に基づいたもの (これは「匿名型プロバイダ」と呼ぶ; anonymous type provider) と、
マクロアノテーションに基づいたもの (これは「public 型プロバイダ」と呼ぶ; public type provider) がある。前者は 2.10.x、2.11.x、2.12.x 系列から既に使える機能を用いて実現されるが、
後者はマクロパラダイスを必要とする。両方の方法とも消去型のプロバイダを実装するのに使うことができる。

マクロアノテーションのコンパイルと展開の両方にマクロパラダイスが必要なため、public 型プロバイダの作者とユーザの両方がマクロパラダイスを
ビルドに含める必要があることに注意してほしい。
しかし、マクロアノテーションを展開した後は、その結果のコードにはマクロパラダイスへの参照は残らないため、コンパイル時にも実行時にもマクロパラダイスは必要ない。

## 導入

型プロバイダは強く型付けされた型ブリッジング機構で、F# 3.0 においてインフォメーションリッチプログラミング (information-rich programming) を可能とする。
型プロバイダは、静的に受け取ったデータソースを元に定義群とその実装を生成するコンパイル時の仕組みだ。
型プロバイダには、非消去 (non-erased) と消去 (erased) という 2つのモードがある。
前者はテキストを用いたコード生成と似ていて、全ての生成された型はバイトコードになるが、後者は生成された型は型検査にだけ現れて、
バイトコード生成が行われる前に消去されてプログラマ側で予め提供した上限境界 (upper bound) になる。

Scala では、マクロ展開は `ClassDef`、`ModuleDef`、`DefDef`、その他の定義ノードを含むプログラマが好きなコードを生成できるため、
コード生成という型プロバイダの側面はすでにカバーされている。これを念頭において、型プロバイダをエミュレートするにはあと 2つの課題が残っている。

1. 生成された定義群を公開する (Scala 2.10.x、2.11.x、2.12.x 系列から使うことができる唯一の種類のマクロ、def マクロは展開されるスコープが制限されるという意味で局所的なものだ: [https://groups.google.com/d/msg/scala-user/97ARwwoaq2U/kIGWeiqSGzcJ](https://groups.google.com/d/msg/scala-user/97ARwwoaq2U/kIGWeiqSGzcJ))
2. 生成された定義群を任意に消去可能とする (Scala は、抽象型メンバや値クラスといった多くの言語機構について型消去をサポートしているが、その機構は拡張可能ではないためマクロ作者がカスタマイズすることはできない。)

## 匿名型プロバイダ

def マクロによって展開された定義群のスコープは展開されたコードに制限されるが、これらの定義群はスコープを構造的部分型にすることで脱出可能だ。
例えば、接続文字列を受け取って、渡されたデータベースをカプセル化したモジュールを生成する `h2db` マクロは以下のように展開する。

    def h2db(connString: String): Any = macro ...

    // an invocation of the `h2db` macro
    val db = h2db("jdbc:h2:coffees.h2.db")

    // expands into the following code
    val db = {
      trait Db {
        case class Coffee(...)
        val Coffees: Table[Coffee] = ...
      }
      new Db {}
    }

確かに、このままだとマクロ展開されたブロックの外部からは誰も `Coffee` クラスを直接見ることができないが、
`db` の型を調べてみると、面白いことが分かる。

    scala> val db = h2db("jdbc:h2:coffees.h2.db")
    db: AnyRef {
      type Coffee { val name: String; val price: Int; ... }
      val Coffees: Table[this.Coffee]
    } = $anon$1...

見ての通り、タイプチェッカが `db` の型を推論しようとしたときに、ローカルで宣言されたクラスへの参照全てを元のクラスの公開されたメンバを全て含む構造的部分型に置き換えたみたいだ。
こうしてできた型は生成された型の本質を表したものとなっており、それらメンバの静的型付けされたインターフェイスを提供する。

    scala> db.Coffees.all
    res1: List[Db$1.this.Coffee] = List(Coffee(Brazilian,99,0))

これはプロダクションで使えるバージョンの Scala で実現できるため、便利な型プロバイダの方法だと言えるが、
構造的部分型のメンバにアクセスするのに Scala はリフレクションをつかった呼び出しを生成するので、性能に問題がある。
これにもいくつかの対策があるが、この余白はそれを書くには狭すぎるので Travis Brown 氏の驚くべきブログシリーズを紹介する:
[その1](http://meta.plasm.us/posts/2013/06/19/macro-supported-dsls-for-schema-bindings/)、[その2](http://meta.plasm.us/posts/2013/07/11/fake-type-providers-part-2/)、
[その3](http://meta.plasm.us/posts/2013/07/12/vampire-methods-for-structural-types/)。

## public 型プロバイダ

[マクロパラダイス](/ja/overviews/macros/paradise.html)と[マクロアノテーション](/ja/overviews/macros/annotations.html)を使うことで
構造的部分型を使った回避策を使わなくても簡単に外部から見えるクラスを生成できるようになった。
アノテーションを使った方法は率直なものなので、ここではあまり解説しない。

    class H2Db(connString: String) extends StaticAnnotation {
      def macroTransform(annottees: Any*) = macro ...
    }

    @H2Db("jdbc:h2:coffees.h2.db") object Db
    println(Db.Coffees.all)
    Db.Coffees.insert("Brazilian", 99, 0)

### 型消去の対策

これはまだ深くは研究していないけども、型メンバとシングルトン型を使えば F# 同様の消去型プロバイダを提供できるのではないかという仮説がある。
具体的には、消去したくない型は普通に今までどおり宣言して、任意の上限境界に消去したいクラスは一意に定まる識別子を持ったシングルトン型によってパラメータ化された上限境界の型エイリアスとして提供すればいい。
この方法を用いても全ての新しい型に対して型エイリアスのメタデータのための余計なバイトコードというオーバヘッドが発生するけども、このバイトコードは普通のクラスのバイトコードに比べると非常に小さいものとなる。
このテクニックは匿名と public の両方の型プロバイダにあてはまる。

    object Netflix {
      type Title = XmlEntity["http://.../Title".type]
      def Titles: List[Title] = ...
      type Director = XmlEntity["http://.../Director".type]
      def Directors: List[Director] = ...
      ...
    }

    class XmlEntity[Url] extends Dynamic {
      def selectDynamic(field: String) = macro XmlEntity.impl
    }

    object XmlEntity {
      def impl(c: Context)(field: c.Tree) = {
        import c.universe._
        val TypeRef(_, _, tUrl) = c.prefix.tpe
        val ConstantType(Constant(sUrl: String)) = tUrl
        val schema = loadSchema(sUrl)
        val Literal(Constant(sField: String)) = field
        if (schema.contains(sField)) q"${c.prefix}($sField)"
        else c.abort(s"value $sField is not a member of $sUrl")
      }
    }

## blackbox vs whitebox

匿名と public の両方の型プロバイダとも [whitebox](/ja/overviews/macros/blackbox-whitebox.html) である必要がある。
型プロバイダマクロを [blackbox](/ja/overviews/macros/blackbox-whitebox.html) だと宣言すると正しく動作しない。
