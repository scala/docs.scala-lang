---
title: Scala 3移行モード
type: chapter
description: このセクションではScala 3コンパイラの移行モードについて記述します
num: 7
previous-page: tooling-tour
next-page: tutorial-intro
language: ja
---

Scala 3 のコンパイラは移行を簡単にするためのいくつかの便利なutilitiesを提供します。

`scalac` を試すとそれらのutilitiesを垣間見ることができます:

> `scalac` は実行可能なScalaコンパイラであり、[Github](https://github.com/lampepfl/dotty/releases/)からダウンロードできます。
> 
> また、Coursierと`cs install scala3-compiler`を用いることでインストールすることもでき、その場合は`scalac`は別名`scala3-compiler`となります。

{% highlight text %}
$ scalac
Usage: scalac <options> <source files>
where possible standard options include:

...
-explain           Explain errors in more detail.
-explain-types     Explain type errors in more detail.
...
-rewrite           When used in conjunction with a `...-migration` source version, rewrites sources to migrate to new version.
...
-source            source version
                   Default: 3.0.
                   Choices: 3.0, future, 3.0-migration, future-migration.
...
{% endhighlight %}

## 移行モード

`-source:3.0-migration` オプションは除去された機能の多くを許容し、エラーの代わりにWARNINGを出力します。
各WARNINGは非推奨のコードに関して、クロスコンパイルに対応するコードを安全に書き換えられることを強く示しています。

我々はこれを **Scala 3 migration compilation**とよんでいます.

## 自動書き換え

一度マイグレーションモードでコンパイルすると、ほとんど全てのWARNINGはコンパイラによって自動的に解決されます。
これを行うためには、再度コンパイルする必要があり、今回は、 `-source:3.0-migration` と　`-rewrite` オプションを使います。

> コンパイラがコードを変更することに注意してください！ 安全を目的としています。
> しかしながら、コンパイラによって適用された差分を出力し、必要ならばもとに戻せるように初期状態をコミットしておくことをおすすめします。

> #### 良い知らせ
> - rewriteはもしコードコンパイルにエラーが有った場合は適用されません。
> - 適用するルールを自身で決めることはできなく、コンパイラがその全てを担います。

[非互換性テーブル](incompatibility-table.html) を参考に、Scala 3 migration rewritesのリストを確認することができます。

## エラーの説明

`-source:3.0-migration` モードはたくさんの変更を処理できますが、全てではありません。
コンパイラは`-explain` および `-explain-types` オプションを呼び出すときに、残りのエラーの詳細について与えてくれます。

> `-explain` および `-explain-types` オプションは、移行に限定されません。
> 一般に、Scala 3での学習とコーディングを支援します。
