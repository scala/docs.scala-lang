---
layout: inner-page-documentation
overview-name: "Scala 3 Documentation"
title: Contributing to the Docs
language: ja
scala3: true
---

## 概要
Scala 3 の高品質なドキュメンテーションを作るためのいくつかの試みが目下進行中である。
特に次のようなドキュメントがある。

- Scala 3 book
- Macros tutorial
- Migration guide
- Scala 3 language reference

ドキュメンテーションの種類に関わらずコミュニティからのコントリビューションを歓迎する。


### コントリビューションの仕方
さまざまな方法で私たちを支援することができる :
- **ドキュメントのどこかで混乱するところがある** Issue をたてる。
- **最新の状態を反映していないドキュメントがある** Issue をたてるか、PR をつくる。
- **タイポの修正やその他ちょっとした文章の改善** PR をつくる。
- **なにかを新しく追加したり大きな変更を加えたい**  議論できるよう Issue をたてる。

通常、ドキュメントプロジェクトのそれぞれには編集・改善用のリンクが含まれている。(このドキュメントについても同様で、目次の領域にある。) また、コントリビューションをはじめるために必要な情報は以下に記載されている。

## Scala 3 Book
[Scala 3 Book][scala3-book] は Alvin Alexander 氏 が書いている。 この本は Scala 3 のすべての重要な機能の概説書である。これから Scala を使いはじめる読者を対象にしている。

- [Sources](https://github.com/scala/docs.scala-lang/tree/master/_overviews/scala3-book)
- [Issues](https://github.com/scala/docs.scala-lang/issues)

## Macros Tutorial
[Macros Tutorial](/scala3/guides/macros)は Nicolas Stucki 氏 が書いている。この本では Scala 3 のマクロとそのベストプラクティスについて詳しく説明している。 

- [Sources](https://github.com/scala/docs.scala-lang/tree/master/_overviews/scala3-macros)
- [Issues](https://github.com/scala/docs.scala-lang/issues)

## Migration Guide
[Scala 3 Migration Guide](https://scalacenter.github.io/scala-3-migration-guide/) は Scala 2 と Scala 3 の互換性、移行に役立つツールの紹介、そして詳しい移行のガイドを含んだ包括的なドキュメントである。

- [Contribution Overview](https://scalacenter.github.io/scala-3-migration-guide/docs/contributing.html)
- [Source](https://github.com/scalacenter/scala-3-migration-guide)
- [Issues](https://github.com/scalacenter/scala-3-migration-guide/issues)


## Scala 3 Language Reference
The [Dotty reference](https://dotty.epfl.ch/docs/reference/overview.html) は Scala 3 になる予定である。これにはさまざまな言語仕様に関する公式のプレゼンテーションや技術的情報が含まれている。

- [Sources](https://github.com/lampepfl/dotty/tree/master/docs/docs/reference)
- [Issues](https://github.com/lampepfl/dotty/issues)


[scala3-book]: {% link _overviews/scala3-book/introduction.md %}

[best-practices]: {% link _overviews/scala3-macros/best-practices.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[cross-compilation]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/migration-tutorial.html#cross-building
[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[migration-status]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html#macro-libraries
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[tasty]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
[reflection-api]: https://dotty.epfl.ch/api/scala/quoted.html
