---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 5
outof: 10

title: マクロバンドル
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロバンドル (macro bundle) は Scala 2.11.0-M4 以降のマイルストーン版に含まれる機能だ。Scala 2.10.x やマクロパラダイスには含まれない。[http://www.scala-lang.org/download/](http://www.scala-lang.org/download/) の説明にしたがって最新の 2.11 のマイルストーン版をダウンロードしてほしい。

## マクロバンドル

現行の Scala 2.10.x においてマクロ実装は関数として表されている。コンパイラがマクロ定義の適用を見つけると、マクロ実装を呼び出すという単純なものだ。しかし、実際に使ってみると以下の理由によりただの関数では不十分なことがあることが分かった:

<ol>
<li>関数に制限されることで複雑なマクロのモジュール化がしづらくなる。マクロのロジックがマクロ実装外のヘルパートレイトに集中していて、マクロ実装がヘルパーをインスタンス化するだけのラッパーになってしまっているのは典型的な例だ。</li>
<li>さらに、マクロのパラメータがマクロのコンテキストにパス依存であるため、ヘルパーと実装をつなぐのに<a href="/ja/overviews/macros/overview.html#writing_bigger_macros">特殊なおまじない</a>を必要とする。</li>
</ol>

マクロバンドルは、マクロ実装を
`scala.reflect.macros.BlackboxMacro` か
`scala.reflect.macros.WhiteboxMacro` を継承したトレイトで実装することで、これらの問題に対する解決策となる。この基底トレイトはそれぞれ
`val c: BlackboxContext` と
`val c: WhiteboxContext` を定義してあるため、マクロ実装側のシグネチャで宣言しなくても済むようになり、モジュール化を簡単にする。

    trait BlackboxMacro {
      val c: BlackboxContext
    }

    trait WhiteboxMacro {
      val c: WhiteboxContext
    }

バンドルで定義されたマクロ実装を参照するのは、オブジェクトで定義された実装を参照するのと同じ方法で行われる。まずバンドル名を指定して、必要ならば型引数付きでメソッドを選択する。

    import scala.reflect.macros.Context
    import scala.reflect.macros.BlackboxMacro

    trait Impl extends BlackboxMacro {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }
