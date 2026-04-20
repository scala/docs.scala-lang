---
title: メタプログラミング互換性
type: section
description: このセクションはメタプログラミングの移行を解説する。 
num: 5
previous-page: compatibility-runtime
next-page: tooling-tour
language: ja
---

マクロメソッドの呼び出しは、マクロ展開と呼ばれるコンパイラフェーズの中で実行され、抽象構文木 (つまりプログラムの一部) を生成する。

Scala 2.13 のマクロ API は Scala 2.13 コンパイラの内部と密接に関連している。
それゆえ、Scala 3 コンパイラでは Scala 2.13 マクロを展開することはできない。

一方 Scala 3 は、安定性を考慮して設計しなおされた、新たなメタプログラミングの方法を導入する。
Scala 3 マクロとそしてそのインラインメソッドは通常、Scala 3 コンパイラの将来のバージョンと互換性がある。
これは異論のない改善だが、新しいメタプログラミング機能を使用して、すべての Scala 2.13 マクロをゼロから書き直す必要があるということも意味している。

## マクロを定義するライブラリ依存性

Scala 3 のモジュールはマクロ定義が含まれている Scala 2.13 アーティファクトに依存することができますが、コンパイラはそれらのマクロを展開することはできないだろう。
マクロ展開に当たると、それは単にエラーが返ってくるようになる。

{% highlight text %}
 -- Error: /src/main/scala/example/Example.scala:10:45 
 10 |  val documentFormat = Json.format[Document]
    |                            ^
    |Scala 2 macro cannot be used in Scala 3. See https://dotty.epfl.ch/docs/reference/dropped-features/macros.html
    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

`-Xignore-scala2-macros` を使うことで型検査の役には立つが、不完全なクラスファイルを生成することに注意してほしい。

あなたのプロジェクトでこのエラーが出た場合、結局の所、マクロ定義元のアーティファクトを Scala 3 系にアップグレードする以外の選択肢は残されていない。

## マクロエコシステムの移行

Scala 2 マクロは実験的機能とは言われつつも、実際の所 Scala コミュニティーは広範囲に渡ってマクロを採用し、コード生成、最適化、使い易い DSL など様々な面で使われている。

大部分のエコシステムは現在 Scala 2.13 マクロにより定義されている外部ライブラリに依存してる。
それらのライブラリの識別や移植はエコシステムを前進させるだろう。

[このページ](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html)に多くのオープンソースの移行状態が可視化されている。

## マクロの書き換え

この新しいメタプログラミング機能は完全に Scala 2 と異なる。
構成としては:
- [インラインメソッド][inline]
- [コンパイル時の演算][compiletime]
- [マクロ][macros]
- [クォート][quotes]
- [抽象構文木 (AST) のリフレクション][reflection]

マクロの再実装に深入りしてしまう前に、以下を自問するべきだ:
- `inline` と `scala.compiletime` を使用してロジックの再実装できるだろうか?
- よりシンプルで安全な式ベースのマクロを使うことができるか?
- AST にアクセスすることが本当に必要なことか?
- 返り値の型として[マッチタイプ](/scala3/reference/new-types/match-types.html) を使うことができるだろうか?

新しく登場したメタプログラミングの概念の全ては [Macro Tutorial][scala3-macros] にて解説してある。

## マクロライブラリのクロスビルド

素晴らしいマクロライブラリを書いて、Scala 2.13 系と Scala 3 系の両方でリリースしたいとする。
その場合、従来のクロスビルドと、より新しい mixing macro という 2つの異なるアプローチがある。
詳細は以下のチュートリアルを参考にしてほしい:
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
