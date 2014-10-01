---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 4

title: マクロバンドル
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロバンドル (macro bundle) は Scala 2.11.0-M4 以降のマイルストーン版に含まれる機能だ (しかし、2.11.0-M8 で構文が変更されたため、本稿は以前の 2.11 には当てはまらない)。Scala 2.10.x やマクロパラダイスには含まれない。[http://www.scala-lang.org/download/](http://www.scala-lang.org/download/) の説明にしたがって最新の 2.11 のマイルストーン版をダウンロードしてほしい。

## マクロバンドル

現行の Scala 2.10.x においてマクロ実装は関数として表されている。コンパイラがマクロ定義の適用を見つけると、マクロ実装を呼び出すという単純なものだ。しかし、実際に使ってみると以下の理由によりただの関数では不十分なことがあることが分かった:

<ol>
<li>関数に制限されることで複雑なマクロのモジュール化がしづらくなる。マクロのロジックがマクロ実装外のヘルパートレイトに集中していて、マクロ実装がヘルパーをインスタンス化するだけのラッパーになってしまっているのは典型的な例だ。</li>
<li>さらに、マクロのパラメータがマクロのコンテキストにパス依存であるため、ヘルパーと実装をつなぐのに<a href="/ja/overviews/macros/overview.html#writing_bigger_macros">特殊なおまじない</a>を必要とする。</li>
</ol>

マクロバンドルは、マクロ実装を
`blackbox.Context` か
`whitebox.Context` をコンストラクタのパラメータとして受け取るクラス内で実装することで、コンテキストをマクロ実装側のシグネチャで宣言しなくても済むようになり、モジュール化を簡単にする。

    import scala.reflect.macros.blackbox.Context

    class Impl(val c: Context) {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }
