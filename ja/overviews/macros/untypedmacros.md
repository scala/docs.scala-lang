---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 5
outof: 7
title: 型指定の無いマクロ
---
<a href="/overviews/macros/paradise.html"><span class="label important" style="float: right;">MACRO PARADISE</span></a>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

型指定の無いマクロ (untyped macro) はマクロパラダイスと呼ばれているオフィシャル Scala リポジトリ内の実験的なブランチに含まれるリリース前の機能だ。[マクロパラダイス](/ja/overviews/macros/paradise.html)ページの説明にしたがってナイトリービルドをダウンロードしてほしい。

## 直観

静的に型付けされることは素晴らしいが、それは時として重荷ともなりうる。例えば、Alois Cochard 氏の型マクロを使った列挙型の実装の実験、いわゆる [Enum Paradise](https://github.com/aloiscochard/enum-paradise) をみてみよう。Alois は以下のように、ライトウェイトなスペックから列挙型モジュールを生成する型マクロを書かなければいけない:

    object Days extends Enum('Monday, 'Tuesday, 'Wednesday...)

`Monday` や `Friday` のようにクリーンな識別子名を使う代わりに、タイプチェッカーが存在しない識別子に関して怒らないようにこれらの名前をクォートする必要がある。`Enum` マクロでは既存のバインディングを参照しているのではなく、新しいものを導入したいわけだが、コンパイラはマクロに渡されるものを全て型検査しようとするためこれを許さない。

`Enum` マクロがどのように実装されているかをマクロ定義と実装のシグネチャを読むことでみていこう。マクロ定義のシグネチャに `symbol: Symbol*` と書いてあることが分かる。これで、対応する引数の型検査をコンパイラに強制している:

    type Enum(symbol: Symbol*) = macro Macros.enum
    object Macros {
      def enum(c: Context)(symbol: c.Expr[Symbol]*): c.Tree = ...
    }

型指定の無いマクロはマクロに渡された引数の型検査をコンパイラの代わりに実行すると伝える記法と機構を提供する。
そのためには、単にマクロ定義のパラメータ型をアンダースコアで置き換えマクロ定義のパラメータ型を `c.Tree` とする:

    type Enum(symbol: _*) = macro Macros.enum
    object Macros {
      def enum(c: Context)(symbol: c.Tree*): c.Tree = ...
    }

## 詳細

型検査を停止するアンダースコアは Scala プログラムの中で以下の 3ヶ所において使うことができる:

<ol>
<li>マクロへのパラメータ型</li>
<li>マクロへの可変長パラメータ型</li>
<li>マクロの戻り値型</li>
</ol>

マクロ以外や複合型の一部としてのアンダースコアの使用は期待通り動作しない。
前者はコンパイルエラーに、後者、例えば `List[_]` は通常通り存在型を返すだろう。

もしマクロに型指定の無いパラメータがあった場合、マクロ展開を型付けする際にタイプチェッカーは引数に関しては何もせずに型指定の無いままマクロに渡す。もしいくつかのパラメータが型アノテーションを持っていたとしても、現行では無視される。これは将来改善される予定だ: [SI-6971](https://issues.scala-lang.org/browse/SI-6971)。引数が型検査されていないため、implicit の解決や型引数の推論は実行されない (しかし、両者ともそれぞれ `c.typeCheck` と `c.inferImplicitValue` として実行できる)。

明示的に渡された型引数はそのままマクロに渡される。もし型引数が渡されなかった場合は、値引数を型検査しない範囲で可能な限り型引数を推論してマクロに渡す。つまり、型引数は型検査されるということだが、この制約は将来無くなるかもしれない: [SI-6972](https://issues.scala-lang.org/browse/SI-6972)。

もし、def マクロが型指定の無い戻り値を持つ場合、マクロ展開後に実行される 2つの型検査のうち最初のものが省略される。ここで復習しておくと、def マクロが展開されるとまずその定義の戻り値の型に対して型検査され、次に展開されたものに期待される型に対して型検査が実行される。これに関しては Stack Overflow の [Static return type of Scala macros](http://stackoverflow.com/questions/13669974/static-return-type-of-scala-macros) を参照してほしい。型マクロは最初の型検査が行われないため、何も変わらない (そもそも型マクロに戻り値の型は指定できないからだ)。

最後に、型指定のないマクロのパッチは `c.Expr[T]` の代わりにマクロ実装のシグネチャのどこでも `c.Tree` を使うことを可能とする。
マクロ定義の型指定なし/型付きと、構文木/式によるマクロ実装の 4通りの組み合わせ全てがパラメータと戻り値の型の両方においてサポートされている。
さらに詳しいことはユニットテストを参照してほしい: [test/files/run/macro-untyped-conformance](https://github.com/scalamacros/kepler/blob/b55bda4860a205c88e9ae27015cf2d6563cc241d/test/files/run/macro-untyped-conformance/Impls_Macros_1.scala)。
