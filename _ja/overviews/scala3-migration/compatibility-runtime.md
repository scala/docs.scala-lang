---
title: ランタイム互換性
type: section
description: このセクションではScala 3のランタイム時の特性について記述しています。
num: 4
previous-page: compatibility-classpath
next-page: compatibility-metaprogramming
language: ja
---

Scala 2.13とScala 3は同じアプリケーションバイナリインターフェイス(ABI)を共有します。

> ABIはバイトコード上、またはScala.js IRでScalaコードを表現しているものです。
> ABIはランタイムにおけるScalaプログラムの振る舞いを決めます。

Scala 2.13とScala 3の混ざった同一ソースコードをコンパイルすると、とても似ているバイトコードを生成します。
違いとしてはいくつかの機能が変更されたことで、lazy valの初期化インスタンスが向上しています。

ABIの共有によりScala 2.13とScala 3ファイルを同じJVMクラスによりロードできるようになります。
同様に、Scala 2.13ファイルとScala 3 `sjsir` ファイルは、Scala.jsリンカーによってリンクできます。

更に、ランタイム時の突発的なふるまいから我々を守ってくれます。
そして、Scala 2.13からScala 3の移行で、ランタイム時時のクラッシュとパフォーマンスを安全にしてくれます。

まずはじめに、Scalaプログラムの実行時の特性を確認することは、Scala 2.13と比較してScala 3では良くも悪くもありません。
しかしながら、いくつかの新しい機能があなたの課題に関して選択肢を与えてくれるでしょう。:
- [Opaque Type Aliases](http://dotty.epfl.ch/docs/reference/other-new-features/opaques.html)
- [Inline Methods](http://dotty.epfl.ch/docs/reference/metaprogramming/inline.html)
- [@threadUnsafe annotation](http://dotty.epfl.ch/docs/reference/other-new-features/threadUnsafe-annotation.html)
