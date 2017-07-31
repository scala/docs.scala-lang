---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 4

title: マクロバンドル
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロバンドル (macro bundle) は、Scala 2.11.x および Scala 2.12.x 系列に含まれる機能だ。マクロバンドルは Scala 2.10.x では実装されていない。Scala 2.10.x 向けのマクロパラダイスでも、これは実装されていない。

## マクロバンドル

Scala 2.10.x においてマクロ実装は関数として表されている。コンパイラがマクロ定義の適用を見つけると、マクロ実装を呼び出すという単純なものだ。しかし、実際に使ってみると以下の理由によりただの関数では不十分なことがあることが分かった:

<ol>
<li>関数に制限されることで複雑なマクロのモジュール化がしづらくなる。マクロのロジックがマクロ実装外のヘルパートレイトに集中していて、マクロ実装がヘルパーをインスタンス化するだけのラッパーになってしまっているのは典型的な例だ。</li>
<li>さらに、マクロのパラメータがマクロのコンテキストにパス依存であるため、ヘルパーと実装をつなぐのに<a href="/ja/overviews/macros/overview.html#writing_bigger_macros">特殊なおまじない</a>を必要とする。</li>
</ol>

マクロバンドルは、マクロ実装を
`c: scala.reflect.macros.blackbox.Context` か
`c: scala.reflect.macros.whitebox.Context`をコンストラクタのパラメータとして受け取るクラス内で実装することで、コンテキストをマクロ実装側のシグネチャで宣言しなくても済むようになり、モジュール化を簡単にする。

    import scala.reflect.macros.blackbox.Context

    class Impl(val c: Context) {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }

## blackbox vs whitebox

マクロバンドルは、[blackbox](/ja/overviews/macros/blackbox-whitebox.html) と [whitebox](/ja/overviews/macros/blackbox-whitebox.html)
の両方のマクロの実装に使うことができる。マクロバンドルのコンストラクタのパラメータに
`scala.reflect.macros.blackbox.Context` の型を渡せば blackbox マクロになって、
`scala.reflect.macros.whitebox.Context` ならば whitebox マクロになる。
