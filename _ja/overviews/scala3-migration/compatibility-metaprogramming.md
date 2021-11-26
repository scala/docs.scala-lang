---
title: メタプログラミング互換性
type: section
description: このセクションではメタプログラミングの移行について議論します。 
num: 5
previous-page: compatibility-runtime
next-page: tooling-tour
language: ja
---

マクロを呼ぶメソッドはマクロ展開と呼ばれるコンパイラフェーズ中に実行され、プログラムの一部である抽象的なシンタックスツリーを生成します。

Scala 2.13のマクロAPIはScala 2.13コンパイラの内部と密接に関連しています。
それゆえ、Scala 3コンパイラではScala 2.13マクロを展開することはできないのです。

対象的に、Scala 3ではメタプログラミングの新たで原理的なアプローチを導入しており、安定性のために設計されています。
Scala 3マクロとそしてそのインラインメソッドは通常、Scala 3コンパイラの将来のバージョンと互換性があります。
これは異論のない改善ですが、新しいメタプログラミング機能を使用して、すべてのScala 2.13マクロをゼロから書き直す必要があるということも意味しています。

## マクロの依存

Scala 3のモジュールはマクロ定義が含まれているScala 2.13アーティファクトに依存することができますがコンパイラはそれらのマクロを展開することはできないでしょう。
シンプルにエラーとして帰ってきます。

{% highlight text %}
 -- Error: /src/main/scala/example/Example.scala:10:45 
 10 |  val documentFormat = Json.format[Document]
    |                            ^
    |Scala 2 macro cannot be used in Scala 3. See https://dotty.epfl.ch/docs/reference/dropped-features/macros.html
    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

`-Xignore-scala2-macros` を使うことはコードの型チェックに役立つだけではなく、未完成なクラスファイルを生成します。

あなたのプロジェクトでこのエラーが出た時、あなたは次第にマクロアーティファクトのScala 3コンパイルバージョンを上げるほか選択肢がなくなるでしょう

## マクロエコシステムの移行

実験的ではありながら、ScalaコミュニティはScala 2マクロ機能を複数の方法で大きく適用させてきました。: コード生成, 最適化, 人間工学的なDSL...

大部分のエコシステムは現在Scala 2.13マクロにより定義されている外部ライブラリに依存しています。
それらのライブラリの識別や移植はエコシステムを前に動かすキーとなるでしょう。

[このページ](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html)にたくさんのオープンソースの移行状態が可視化されています。.

## マクロの再記述

この新しいメタプログラミング機能は完全にScala 2と異なります。
構成としては:
- [インラインメソッド][inline]
- [コンパイル時間のオペレーション][compiletime]
- [マクロ][macros]
- [クォーテッドコード][quotes]
- [抽象的シンタックスツリーを超えた反映 (AST)][reflection]

マクロを再実装する前に次のことを自問する必要があります。:
- `インライン`と`scala.compiletime`を使用してロジックの再実装できますか?
- シンプルかつ安全にマクロ展開ができるか?
- ASTにアクセスすることが本当に必要なことですか?
- 返却型として[マッチタイプ](/scala3/reference/new-types/match-types.html) を利用しますか?

あなたは全ての新メタプログラミング概念を [Macro Tutorial][scala3-macros]を読むことで学ぶことができます。

## マクロライブラリのクロスビルド

素晴らしいマクロライブラリを書き終わると、Scala 2.13とScala 3の中で利用可能になります。
ここで２つの異なるアプローチがあり、伝統的なクロスビルド技術と、より最新の合成マクロ技術があります。
あなたは下記のチュートリアルを読むことでそれを学ぶことができます。:
- [Cross-Building a Macro Library](tutorial-macro-cross-building.html)
- [Mixing Scala 2.13 and Scala 3 Macros](tutorial-macro-mixing.html)

## 追加のリソース

Blog posts and talks:
- [Macros: The Plan For Scala 3](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html)
- [Scala Days - Metaprogramming in Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc)

Early-adopter projects:
- [XML Interpolator](https://github.com/dotty-staging/xml-interpolator/tree/master)
- [Shapeless 3](https://github.com/dotty-staging/shapeless/tree/shapeless-3)

[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
[scala3-macros]: {% link _overviews/scala3-macros/tutorial/index.md %}
