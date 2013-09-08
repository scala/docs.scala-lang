---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 4
outof: 9
title: マクロバンドル
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロバンドル (macro bundle) はマクロパラダイスと呼ばれているオフィシャル Scala リポジトリ内の実験的なブランチに含まれるリリース前の機能だ。[マクロパラダイス](/ja/overviews/macros/paradise.html)ページの説明にしたがってナイトリービルドをダウンロードしてほしい。

## マクロバンドル

現行の Scala 2.10.0 においてマクロ実装は関数として表されている。コンパイラがマクロ定義の適用を見つけると、マクロ実装を呼び出すという単純なものだ。しかし、実際に使ってみると以下の理由によりただの関数では不十分なことがあることが分かった:

<ol>
<li>関数に制限されることで複雑なマクロのモジュール化がしづらくなる。マクロのロジックがマクロ実装外のヘルパートレイトに集中していて、マクロ実装がヘルパーをインスタンス化するだけのラッパーになってしまっているのは典型的な例だ。</li>
<li>さらに、マクロのパラメータがマクロのコンテキストにパス依存であるため、ヘルパーと実装をつなぐのに<a href="/ja/overviews/macros/overview.html#writing_bigger_macros">特殊なおまじない</a>を必要とする。</li>
<li>マクロが進化してくると、コンパイラとマクロ間において別のコミュニケーションのインターフェイスが必要であることが<a href="https://twitter.com/milessabin/status/281379835773857792">明らかになってきた</a>。現在はコンパイラはマクロ展開しかできないが、例えばマクロを型推論に使いたいとしたらどうだろう?</li>
</ol>

マクロバンドルは、マクロ実装を `scala.reflect.macros.Macro` を継承したトレイトで実装することで、これらの問題に対する解決策となる。この基底トレイトは `c: Context` 変数を定義してあるため、マクロ実装側のシグネチャで宣言しなくても済むようになり、モジュール化を簡単にする。将来には `Macro` は `onInfer` などのコールバックメソッドを提供するかもしれない。

    trait Macro {
      val c: Context
    }

バンドルで定義されたマクロ実装を参照するのは、オブジェクトで定義された実装を参照するのと同じ方法で行われる。まずバンドル名を指定して、必要ならば型引数付きでメソッドを選択する。

    import scala.reflect.macros.Context
    import scala.reflect.macros.Macro

    trait Impl extends Macro {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }

## マクロコンパイラ

マクロバンドルを実装する際に気付いたのはマクロ定義とマクロ実装をリンクしている機構が硬直すぎるということだ。この機構は単に `scala/tools/nsc/typechecker/Macros.scala` でハードコードされたロジックを使っていて、マクロ定義の右辺値を静的なメソッドの参照として型検査して、そのメソッドを対応するマクロ実装に使っている。

これからはマクロ定義のコンパイルが拡張できるようになる。ハードコードされた実装でマクロ実装を照会するのではなく、マクロエンジンはスコープ内にある `MacroCompiler` を implicit 検索して、マクロ定義の `DefDef` を渡して `resolveMacroImpl` メソッドを呼び出し、静的なメソッドへの参照を返してもらう。もちろんこれが正しく動作するためには `resolveMacroImpl` そのものも[型指定の無い](/ja/overviews/macros/untypedmacros.html)マクロであるべきだ。

    trait MacroCompiler {
      def resolveMacroImpl(macroDef: _): _ = macro ???
    }

この型クラスのデフォルトのインスタンス `Predef.DefaultMacroCompiler` はこれまでハードコードされていた型検査のロジックを実装する。
代替実装を提供することで、例えばマクロ定義のためのライトウェイトな構文や `c.introduceTopLevel` を使ったアドホックに生成されるマクロ実装を提供することができる。
