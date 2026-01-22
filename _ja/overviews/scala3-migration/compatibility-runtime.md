---
title: 実行時互換性
type: section
description: このセクションではScala 3の実行時の特性について記述しています。
num: 4
previous-page: compatibility-classpath
next-page: compatibility-metaprogramming
language: ja
---

Scala 2.13 と Scala 3 は同じアプリケーションバイナリインターフェイス ( ABI ) を共有する。

> ABI はバイトコード上、または Scala.js IR で Scala コードを表現しているものだ。
> ABI は実行時における Scala プログラムの振る舞いを決める。

Scala 2.13 と Scala 3 の混ざった同一ソースコードをコンパイルすると、非常に似たバイトコードを生成する。
違いとしてはいくつかの機能が変更されたことで、例えば lazy val の初期化が改善した。

ABI の共有により Scala 2.13 と Scala 3 ファイルを同じ JVM クラスでロードできる。
同様に、Scala 2.13 ファイルと Scala 3 `sjsir` ファイルは、Scala.js リンカーによってリンクできる。

予期せぬ実行時の振る舞いをある程度軽減させることができる。
そして、Scala 2.13からScala 3の移行で、実行時のクラッシュとパフォーマンスを安全にしてくれます。

Scala 3 で書かれたプログラムの実行時特性は、一見したところ Scala 2.13系と比較して良くも悪くもなっていない。
しかし、以下の新機能によってプログラムの最適化を行うことができる:
- [Opaque Type Aliases](http://dotty.epfl.ch/docs/reference/other-new-features/opaques.html)
- [Inline Methods](http://dotty.epfl.ch/docs/reference/metaprogramming/inline.html)
- [@threadUnsafe annotation](http://dotty.epfl.ch/docs/reference/other-new-features/threadUnsafe-annotation.html)
