---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 6

title: 抽出子マクロ
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

抽出子マクロ (extractor macro) は、Scala 2.11.x および Scala 2.12.x 系列に含まれる機能で、Scala 2.11.0-M5 にて Paul Phillips 氏によって導入された name-based extractor によって可能となった。抽出子マクロは Scala 2.10.x では実装されていない。Scala 2.10.x 向けのマクロパラダイスでも、これは実装されていない。

## パターン

具体例で説明するために、以下のような `unapply` メソッドがあるとする
(話を簡単にするために、被検査体を具象型とするが、テストで示した通りこの抽出子を多相とすることも可能だ):

    def unapply(x: SomeType) = ???

呼び出しの対象は (`c.prefix`) と被検査体 (scrutinee; `x` に入るもの) の型を使って
呼び出しごとに unapply の抽出シグネチャを生成するマクロをこれで書くことができ、
その結果のシグネチャはタイプチェッカに渡される。

例えば、以下はパターンマッチに被検査体をそのまま返すマクロの定義だ
(複数の被抽出体を表現するシグネチャを扱うためには [scala/scala#2848](https://github.com/scala/scala/pull/2848) を参照)。

    def unapply(x: SomeType) = macro impl
    def impl(c: Context)(x: c.Tree) = {
      q"""
        new {
          class Match(x: SomeType) {
            def isEmpty = false
            def get = x
          }
          def unapply(x: SomeType) = new Match(x)
        }.unapply($x)
      """
    }


ドメインに特化したマッチングの論理を実装するマッチャーはいいとして、その他の所でボイラープレートがかなり多いが、
typer とのよどみない会話をお膳立てするには全ての部分が必要であると思われる。
まだ改善の余地はあると思うが、タイプチェッカに手を入れないことには不可能だと思う。

このパターンは構造的部分型を使っているが、不思議なことに生成されるコードはリフレクションを使った呼び出しが含まれていない
(これは `-Xlog-reflective-calls` をかけた後で自分でも生成されたコードを読んで二重に検査した)。
これは謎だが、抽出子マクロに性能ペナルティを受けないということなので、良いニュースだ。

と言いたいところだが、残念ながら、値クラスはローカルでは宣言できないため、マッチャーを値クラスにすることはできなかった。
しかしながら、この制限が将来的に無くなることを願って、無くなり次第タレコミが入るように小鳥を仕組んできた ([neg/t5903e](https://github.com/scala/scala/blob/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/neg/t5903e/Macros_1.scala#L1))。

## 用例

このパターンが特に有用なのは文字列補間子のパターンマッチャーで、泥臭い方法を使わずに変幻自在のパターンマッチを実装できる。
例えば、準クォートの `unapply` はこれでハードコードしなくてすむようになる:

    def doTypedApply(tree: Tree, fun0: Tree, args: List[Tree], ...) = {
      ...
      fun.tpe match {
        case ExtractorType(unapply) if mode.inPatternMode =>
          // this hardcode in Typers.scala is no longer necessary
          if (unapply == QuasiquoteClass_api_unapply) macroExpandUnapply(...)
          else doTypedUnapply(tree, fun0, fun, args, mode, pt)
      }
    }

実装の大まかな方針としては、`c.prefix` を分解する抽出子マクロを書いて、`StringContext` のパーツを解析して、上記のコードと同様のマッチャーを生成すればいい。

この用例や他の抽出子マクロの用例の実装は、
[run/t5903a](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903a)、
[run/t5903b](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903b)、
[run/t5903c](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903c)、
[run/t5903d](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903d)
などのテストケースを参照してほしい。

## blackbox vs whitebox

抽出子マクロは [whitebox](/ja/overviews/macros/blackbox-whitebox.html) である必要がある。
抽出子マクロを [blackbox](/ja/overviews/macros/blackbox-whitebox.html) だと宣言すると正しく動作しない。
