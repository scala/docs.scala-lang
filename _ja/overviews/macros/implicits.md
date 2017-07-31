---
layout: multipage-overview

language: ja
discourse: false

partof: macros
overview-name: Macros

num: 5

title: implicit マクロ
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

implicit マクロは Scala 2.10.0 以降にある実験的機能だが、クリティカルなバグ修正があったため 2.10.2 以降で完全に動作するようになった。
2.10.x と 2.11 のどちらでも、implicit マクロを使うのにマクロパラダイスは必要ない。

implicit マクロの拡張の 1つである関数従属性の具現化 (fundep materialization) は、2.10.0 から 2.10.4 からは使えないが、
[マクロパラダイス](/ja/overviews/macros/paradise.html)、2.10.5、と 2.11.x で実装された。
2.10.0 から 2.10.4 において関数従属性の具現化を拡張するのにもマクロパラダイスが必要となるため、その関数従属性の具現化を使うためにはユーザのビルドにもマクロパラダイスを含めなければいけないことに注意してほしい。
しかし、関数従属性の具現化が展開した後ならば、その結果のコードを参照するのにはコンパイル時でも実行時でもマクロパラダイスは必要ない。
また、2.10.5 では関数従属性の具現化の展開にはマクロパラダイスは必要ないが、ユーザ側で <code>-Yfundep-materialization</code> というコンパイラフラグを有効にする必要がある。

## implicit マクロ

### 型クラス

以下の例ではデータの表示を抽象化する `Showable` という型クラスを定義する。
`show` メソッドは、明示的なパラメータとしてターゲット、そして暗黙のパラメータとして `Showable` のインスタンスという 2つのパラメータを受け取る:

    trait Showable[T] { def show(x: T): String }
    def show[T](x: T)(implicit s: Showable[T]) = s.show(x)

このように宣言された後、`show` はターゲットのみを渡すことで呼び出すことができる。
もう一つのパラメータは `scalac` が call site のスコープ内からターゲットの型に対応する型クラスのインスタンスを導き出そうとする。もしスコープ内にマッチする暗黙の値があれば、それが推論されコンパイルは成功する。見つからなければ、コンパイルエラーが発生する。

    implicit object IntShowable extends Showable[Int] {
      def show(x: Int) = x.toString
    }
    show(42) // "42"
    show("42") // compilation error

### 蔓延するボイラープレート

特に Scala における型クラスにおいてよく知られている問題の一つとして似た型のインスタンス定義が往々にして非常に似通ったものになりやすく、ボイラープレートコードの蔓延につながることが挙げられる。

例えば、多くのオブジェクトの場合において整形表示はクラス名を表示した後フィールドを表示するという形になる。
これは簡潔な方法だが、実際にやってみると簡潔に実装することが大変難しく、繰り返し似たコードを書くはめになる。

    class C(x: Int)
    implicit def cShowable = new Showable[C] {
      def show(c: C) = "C(" + c.x + ")"
    }

    class D(x: Int)
    implicit def dShowable = new Showable[D] {
      def show(d: D) = "D(" + d.x + ")"
    }

このユースケースに限ると実行時リフレクションを用いて実装することができるが、リフレクションは往々にして型消去のために不正確すぎるか、オーバーヘッドのために遅すぎることが多い。

Lars Hupel 氏が紹介した [`TypeClass` 型クラステクニック](http://typelevel.org/blog/2013/06/24/deriving-instances-1.html)のような型レベルプログラミングに基づいたジェネリックプログラミングという方法もあるが、やはりこれも手書きの型クラスのインスタンスに比べると性能が劣化するのが現状だ。

### implicit の具現化

implicit マクロを用いることで、型クラスのインスタンスを手書きで定義する必要を無くし、性能を落とさずにボイラプレートを一切無くすことができる。

    trait Showable[T] { def show(x: T): String }
    object Showable {
      implicit def materializeShowable[T]: Showable[T] = macro ...
    }

複数のインスタンス定義を書く代わりに、プログラマは、`Showable` 型クラスのコンパニオンオブジェクト内に `materializeShowable` マクロを一度だけ定義する。これにより `Showable` のインスタンスが明示的に提供されなければ materializer が呼び出される。呼び出された materializer は `T` の型情報を取得して、適切な `Showable` 型クラスのインスタンスを生成する。

implicit マクロの長所は、それが既存の implicit 検索のインフラに自然と溶け込むことだ。
Scala implicit の標準機能である複数のパラメータや重複したインスタンスなどもプログラマ側は特に何もせずに implicit マクロから使うことができる。例えば、整形表示可能な要素を持つリストのためのマクロを使わない整形表示を実装して、それをマクロベースの具現化に統合させるといったことも可能だ。

    implicit def listShowable[T](implicit s: Showable[T]) =
      new Showable[List[T]] {
        def show(x: List[T]) = { x.map(s.show).mkString("List(", ", ", ")")
      }
    }
    show(List(42)) // prints: List(42)

この場合、必須のインスタンスである `Showable[Int]` は先に定義した具現化マクロによって生成される。つまり、マクロを implicit にすることで型クラスインスタンスの具現化を自動化すると同時にマクロを使わない implicit もシームレスに統合することができる。

<a name="fundep_materialization">&nbsp;</a>

## 関数従属性の具現化

### 動機となった具体例

関数従属性 (functional dependency; fundep) の具現化が生まれるキッカケとなったのは Miles Sabin さんと氏の [shapeless](https://github.com/milessabin/shapeless) ライブラリだ。2.0.0 以前のバージョンの shapeless において Miles は型間の同型射 (isomorphism) を表す `Iso` トレイトを定義していた。例えば `Iso` を使ってケースクラスとタプル間を投射することができる (実際には shapeless は `Iso` を用いてケースクラスと HList の変換を行うが、話を簡略化するためにここではタプルを用いる)。

    trait Iso[T, U] {
      def to(t: T) : U
      def from(u: U) : T
    }

    case class Foo(i: Int, s: String, b: Boolean)
    def conv[C, L](c: C)(implicit iso: Iso[C, L]): L = iso.from(c)

    val tp  = conv(Foo(23, "foo", true))
    tp: (Int, String, Boolean)
    tp == (23, "foo", true)

ここで我々は `Iso` のための implicit materializer を書こうとしたが、壁にあたってしまった。
`conv` のような関数の適用を型検査するときに scala は型引数の `L` を推論しなければいけないが、お手上げ状態になってしまう (ドメインに特化した知識なので仕方がない)。
結果として、`Iso[C, L]` を合成する implicit マクロを定義しても、scalac はマクロ展開時に `L` を `Nothing` だと推論してしまい、全てが崩れてしまう。

### 提案

[https://github.com/scala/scala/pull/2499](https://github.com/scala/scala/pull/2499) が示すとおり、上記の問題の解法は非常にシンプルでエレガントなものだ。

Scala 2.10 においてはマクロの適用は全ての型引数が推論されるまでは展開されない。しかし、そうする必要は特に無い。
タイプチェッカはできる所まで推論して (この例の場合、`C` は `Foo` と推論され、`L` は未定となる) そこで一旦停止する。その後マクロを展開して、展開された型を補助にタイプチェッカは再び以前未定だった型引数の型検査を続行する。Scala 2.11.0 ではそのように実装されている。

このテクニックを具体例で例示したものとして [files/run/t5923c](https://github.com/scala/scala/tree/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923c) テストがある。
全てがすごくシンプルになっていることに注意してほしい。implicit マクロの `materializeIso` は最初の型引数だけを使って展開コードを生成する。
型推論は自動的に行われるので、(推論することができなかった) 2つ目の型引数のことは分からなくてもいい。

ただし、`Nothing` に関してはまだ[おかしい制限](https://github.com/scala/scala/blob/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923a/Macros_1.scala)があるので注意する必要がある。

## blackbox vs whitebox

本稿の前半で紹介した素の具現化は [blackbox](/ja/overviews/macros/blackbox-whitebox.html) と [whitebox](/ja/overviews/macros/blackbox-whitebox.html) のどちらでもいい。

blackbox な具現化と whitebox な具現化には大きな違いが一つある。blackbox な implicit マクロの展開 (例えば、明示的な `c.abort` の呼び出しや展開時の型検査の失敗)
はコンパイルエラーとなるが、whitebox な implicit マクロの展開は、実際のエラーはユーザ側には報告されずに現在の implicit 検索から implicit の候補が抜けるだけになる。
これによって、blackbox implicit マクロの方がエラー報告という意味では良いけども、whitebox implicit マクロの方が動的に無効化できるなどより柔軟性が高いというトレードオフが生じる。

関数従属性の具現化は [whitebox](/ja/overviews/macros/blackbox-whitebox.html) マクロじゃないと動作しないことにも注意。
関数従属性の具現化を [blackbox](/ja/overviews/macros/blackbox-whitebox.html) だと宣言すると正しく動作しない。
