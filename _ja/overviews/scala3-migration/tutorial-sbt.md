---
title: sbtプロジェクトの移行
type: section
description: このセクションは sbt プロジェクトの移行方法について示します。
num: 10
previous-page: tutorial-prerequisites
next-page: tutorial-macro-cross-building
language: ja
---

> このチュートリアルでは、sbt について記述する。
> といっても、Scala 3 をサポートしてる限り、移行のアプローチは他のビルドツールと非常に似ている。

Scala3 に移行する前に、最新版の Scala 2.13.x と sbt 1.5.x であることを確認すべきだ。

それでは、プロジェクト全体を Scala 3 に移植するために必要な手順を見ていこう。

## 1. プロジェクトの前提をチェック

プロジェクトが移行可能かの確認しよう:

- Scala 3 にまだ移植されていないマクロライブラリに依存してはならない。
- Scala 3 に同等のものがないコンパイラプラグインは使用してはならない。
- `scala-reflect` に依存してはならない。

これらの前提に関しては、[前のページ](tutorial-prerequisites.html)で詳しく話している。

## 2. モジュールを選択する

Scala 2.13 と Scala 3 の相互互換性のおかげで、全てのモジュールからでも移行を開始することができる。
しかし、依存関係が最も少ないモジュールから始めるほうがおそらく簡単である。

もし自身のプロジェクトでがマクロ定義やマクロアノテーションを内部的に使っているのであれば、そこを始めに移植する必要がある。

## 3. クロスビルドのセットアップ

コードベースの移行の2つの主な課題は次のとおりだ:

- コードコンパイルする
- 実行時の動作で変更がされていないことの確認をする

クロスビルド戦略を勧めており、それは Scala 3 と Scala 2.13 の両方でコンパイルすることだ。
背後にあるロジックは修正のたびに Scala 2.13 でテストを実行できるようにするべきだ。
これにより、実行時の動作が変更されていなことを確認ですることができる。
これは、非互換性を修正するときに発生する可能性のあるバグを回避するために重要である。

sbt のクロスビルディング設定は以下にまとめられる:

```scala
scalaVersion := "3.0.0"
crossScalaVersions ++= Seq("2.13.6", "3.0.0")
```

この設定の意味は:

- デフォルトバージョンは `3.0.0`。
- 2.13.6 は `++2.13.6` コマンドを走らすことによってロードされる。
- 3.0.0 は `++3.0.0` コマンドを走らすことによってロードされる。

`reload` コマンドは常にデフォルトバージョンをロードすることに気をつけるべきで、ここでは 3.0.0 だ。

## 4. 依存に対する準備

この段階で、`compile` を走らせると, sbt が一部の依存関係が見つからないということについて忠告してくるかもしれない。
これは依存関係の宣言されたバージョンが Scala 3 に対して公開されていないためだ。

依存関係を新しいバージョンにアップグレードするか、ライブラリの Scala 2.13 バージョンを使用するように sbt に指示する必要がある。

> ライブラリの依存関係を変更するときは、プロジェクトのすべてのモジュールに同じ変更を適用する必要がある。

ライブラリの利用可能なScala3バージョンがあるかどうかを確認する。
これを行うには、[Scaladex](https://index.scala-lang.org/)のバージョンマトリックスが使用できる。
ライブラリのプロジェクトページに移動し、バージョンマトリックスボタンをクリックして、Scala 3 と Scala 2.13 でフィルター処理を行う。

#### 1. ライブラリにScala3バージョンが有る場合

利用可能なバージョンを使うことを強く勧める。
ただ、選択したものが破壊的変更をもたらさないことは確認すべきだ。

#### 2. ライブラリにScala3バージョンがない場合

Scala2.13 のバージョンのライブラリを使うことができる。 そのときの構文は以下のようになる:

```scala
("com.lihaoyi" %% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

Scala.js の依存関係は以下のようになる:

```scala
("com.lihaoyi" %%% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

全ての未解決の依存関係について修正したら、通過済みの Scala 2.13 のテストが通るかどうかのチェックが可能になる:

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

## 5. Scala3コンパイラの設定

Scala 3 コンパイラオプションは Scala 2.13 のオプションとは異なり、一部に関しては変名したり、未だサポートされてなかったりする。
[コンパイラオプションのルックアップテーブル](options-lookup.html) ページで Scala 3 へ `scalacOptions` が適応されているかのリストを見ることができる。

一般的なオプションのリスト、Scala 2.13 固有のオプションリスト、および Sala 3 固有のオプションリストを考える必要がある。

典型的な設定は以下のようになる:

```scala
scalacOptions ++= {
  Seq(
    "-encoding",
    "UTF-8",
    "-feature",
    "-language:implicitConversions",
    // disabled during the migration
    // "-Xfatal-warnings"
  ) ++ 
    (CrossVersion.partialVersion(scalaVersion.value) match {
      case Some((3, _)) => Seq(
        "-unchecked",
        "-source:3.0-migration"
      )
      case _ => Seq(
        "-deprecation",
        "-Xfatal-warnings",
        "-Wunused:imports,privates,locals",
        "-Wvalue-discard"
      )
    })
}
```

`-source:3.0-migration` オプションを追加することで、 [Scala 3 マイグレーション・モード](tooling-migration-mode.html)に切り替わる。
また、マイグレーション・モードと自動書き換えを最大限に活用するには、`-Xfatal-warnings` を無効にする必要がある。

## 6. 非互換性の解消

Scala 3 でコンパイルする時が来た:

{% highlight text %}
sbt:example> ++3.0.0
[info] Setting Scala version to 3.0.0 on 1 project.
...
sbt:example> example / compile
...
sbt:example> example / Test / compile
{% endhighlight %}

> `example / compile` はプロジェクトの `main` ソースをコンパイルする。
> 厳密には `example / Compile / compile` と等価だ。
>
> `example / Test / compile` は `test` ソースをコンパイルする。

コンパイラは2つの異なるレベルのコンパイル結果を生成する:

- *Migration Warning*: `-rewrite` オプションでコンパイルしたときに自動的に適用される警告。
- *Error*: どこかしらでコードがコンパイルできなかったときに出る。

コンパイラが自動的に修正を適用するのでMigration Warningに関しては無視することもできる。
しかしながら、非互換性のエラーは必ず手動でケアしなければならない。

多くの既知の非互換性が[非互換性テーブル](incompatibility-table.html)にリストされている。
ここで、エラーの説明といくつかの提案された解決策を見つけることができる。

可能であれば、コードのバイナリ互換性を最もよく維持する修正を見けるべきだ。
プロジェクトが公開ライブラリである場合は、このことは特に重要です。

> マクロの非互換性は解決が簡単にはできない。
> 多くのコードはゼロからの書き直しが必要だ。
> [メタプログラミング](compatibility-metaprogramming.html)を見てください。

非互換性を修正した後は、Scala 2.13 でテストを実行することで検証できる。

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

定期的に変更をコミットすることを検討してください。

全てのエラーの修正が完了したら Scala 3 でコンパイルを行う事ができるだろう。
Migration Warningだけが残るだろう。
`-source:3.0-migration -rewrite` オプションとコンパイルで自動的にパッチが当てれるはずだ。

{% highlight text %}
sbt:example> ++3.0.0
sbt:example> set example / scalacOptions += "-rewrite"
sbt:example> example / compile
...
[info] [patched file /example/src/main/scala/app/Main.scala]
[warn] two warnings found
[success]
{% endhighlight %}

ここで `-source:3.0-migration` オプションを削除する必要がある。また、`-Xfatal-warnings` オプションを再度追加することもできる。
ただし再起動は忘れないように。

## 7. 移行の検証

まれに、異なる Implicit 値が解決され、実行時の動作が変更される可能性がある。
良いテストはそのようなバグが見過ごされないようにする唯一の保証だ。

Scala 2.13 と Scala 3 でテストか通るかどうか確認すべきだ。

{% highlight text %}
sbt:example> ++2.13.6
sbt:example> example / test
...
[success]
sbt:example> ++3.0.0
sbt:example> example / test
...
[success]
{% endhighlight %}

もし CI パイプラインがあれば、Scala 3 用にセットアップする時が来た。

## 8. さいごに

おめでとう！これで、モジュールが Scala 3 に移行できたはずだ。
プロジェクトが Scala 3 に完全移行されるまで、モジュールごとに同じプロセスを繰り返すだろう。

プログラムを相互公開するかどうかに応じて Sala 2.13 クロスビルディング構成を保持、または削除できる。

これで sbt プロジェクトの移行についての説明は終わりだ。
