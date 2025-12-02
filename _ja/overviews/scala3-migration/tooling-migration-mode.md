---
title: Scala 3 マイグレーション・モード
type: chapter
description: このセクションではScala 3コンパイラのマイグレーション・モードについて記述します
num: 7
previous-page: tooling-tour
next-page: tutorial-intro
language: ja
---

Scala 3 のコンパイラは移行を簡単にするため、いくつかの便利な utilities を提供している。

`scalac` を試すとそれらの utilities を垣間見ることが可能だ:

> `scalac` は実行可能な Scala コンパイラであり、[Github](https://github.com/lampepfl/dotty/releases/)からダウンロードできる。
> 
> また、Coursier と `cs install scala3-compiler` を用いることでインストールすることもでき、その場合は`scalac` は別名 `scala3-compiler` となる。

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

## マイグレーション・モード

`-source:3.0-migration` オプションは、コンパイラを廃止された機能の多くに対して寛容にして、エラーの代わりに警告を出力する。
各警告は非推奨のコードに関して、クロスコンパイルに対応するコードを安全に書き換えが可能だということを強調して示す。

我々はこれを **Scala 3 マイグレーション・コンパイル**と呼ぶ。

## 自動書き換え

一度マイグレーション・モードでコンパイルすると、ほとんど全ての警告はコンパイラによって自動的に解決する。
これを行うためには、再度コンパイルする必要があり、今回は、 `-source:3.0-migration` と　`-rewrite` オプションを使う。

> コンパイラがコードを変更することに注意してください！ 安全ではある。
> しかし、コンパイラにより適用されたコード差分を出力し、必要ならばもとに戻せるように初期状態をコミットしておくことを勧める。

> #### 良い知らせ
> - rewrite はもしコードコンパイルにエラーがあった場合は適用されない。
> - 適用するルールを自身で決めることはできなく、コンパイラがその全てを担う。

[非互換性テーブル](incompatibility-table.html) を参考に、Scala 3 migration rewrites のリストを確認することが可能だ。

## エラーの説明

`-source:3.0-migration` モードはたくさんの変更を処理できますが、全てではない。
コンパイラは `-explain` および `-explain-types` オプションを呼ぶと、残りのエラーの詳細について与えてくれる。

> `-explain` および `-explain-types` オプションは、移行に限定したオプションではない。
> 一般に、Scala 3 での学習とコーディングを支援するものだ。
