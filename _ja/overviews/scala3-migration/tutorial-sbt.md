---
title: sbtプロジェクトの移行
type: section
description: このセクションはsbtプロジェクトの移行方法について示します
num: 10
previous-page: tutorial-prerequisites
next-page: tutorial-macro-cross-building
language: ja
---

> このチュートリアルでは、sbtについて記述しています。
> といっても、Scala 3をサポートしてる限り、移行のアプローチは他のビルドツールと非常に似ています。

Scala3にジャンプする前に、最新版のScala 2.13.xとsbt 1.5.xであることを確認しましょう。

それでは、プロジェクト全体をScala 3に移植するために必要な手順を見ていきましょう。

## 1. プロジェクトの前提をチェック

プロジェクトが移行されるかの確認をしましょう:
- Scala 3にまだ移植されていないマクロライブラリに依存してはなりません。
- Scala 3に同等のものがないコンパイラプラグインは使用してはなりません。
- `scala-reflect`に依存してはなりません。

これらの前提に関しては、[前のページ](tutorial-prerequisites.html)で詳しく話しています。

## 2. モジュールを選択する

Scala 2.13とScala 3の相互互換性のおかげで、あなたは全てのモジュールからでも移行を開始することができます。
しかしながら、依存関係が最も少ないモジュールから始めるほうがおそらく簡単です。

もしあなたがマクロ定義やマクロアノテーションを内部的に使っているのであれば、そこを始めに移植する必要があります。

## 3. クロスビルドのセットアップ

コードベースの移行の2つの主な課題は次のとおりです。:
- コードコンパイルする
- ランタイム時の動作で変更がされていないことの確認をする

クロスビルド戦略をおすすめしており、Scala 3とScala 2.13の両方でコンパイルすることです。
背後にあるロジックは修正のたびにScala 2.13でテストを実行できるようにすることです。
これにより、ランタイムの動作が変更されていなことを確認ですることができます。
これは、非互換性を修正するときに発生する可能性のあるバグを回避するために重要です。

sbtのクロスビルディング設定は以下の様にまとめられます。:

```scala
scalaVersion := "3.0.0"
crossScalaVersions ++= Seq("2.13.6", "3.0.0")
```

この設定の意味は:
- デフォルトバージョンは `3.0.0`。
- 2.13.6 は `++2.13.6` コマンドを走らすことによってロードされます。
- 3.0.0 は `++3.0.0` コマンドを走らすことによってロードされます。

`reload` コマンドは常にデフォルトバージョンをロードすることに気をつけましょう、ここでは 3.0.0です。

## 4. 依存に対する準備

このステージで、もしあなたが `compile`を走らせると, sbtが一部の依存関係が見つからないということについて忠告してくる可能性があります。
これは依存関係の宣言されたバージョンがScala 3に対して公開されていないためです。

依存関係を新しいバージョンにアップグレードするか、ライブラリのScala 2.13 バージョンを使用するようにsbtに指示する必要があります。

> ライブラリの依存関係を変更するときは、プロジェクトのすべてのモジュールに同じ変更を適用してください。

ライブラリの利用可能なScala3バージョンがあるかどうかを確認します。
これを行うには、[Scaladex](https://index.scala-lang.org/)のバージョンマトリックスを使用できます。
ライブラリのプロジェクトページに移動し、バージョンマトリックスボタンをクリックして、Scala 3とScala 2.13でフィルター処理します。

#### 1. ライブラリにScala3バージョンが有る場合

我々は強く利用可能なバージョンを使うことを提案します。
ただ、選択したものが破壊的変更をもたらさないことは確認してください。

#### 2. ライブラリにScala3バージョンがない場合

あなたはScala2.13のバージョンのライブラリを使うことができます。 そのときのシンタックスは以下のようになります。:

```scala
("com.lihaoyi" %% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

Scala.jsの依存関係は以下のようになります。:

```scala
("com.lihaoyi" %%% "os-lib" % "0.7.7").cross(CrossVersion.for3Use2_13)
```

一度あなたが全ての未解決の依存関係について修正したら、Scala 2.13でテストがまだ通るかどうかのチェックが可能になります。:

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

## 5. Scala3コンパイラの設定

Scala3コンパイラオプションはScala2,13のオプションとは異なり、いくつかに関しては変名したり、未だサポートされてなかったりします。
[Compiler Options Lookup](options-lookup.html) ページでScala3へ`scalacOptions` が適応されているかのリストを見ることができます。

あなたは一般的なオプションのリスト、Scala 2.13固有のオプションリスト、 およびSala3固有のオプションリストを考え出す必要があります。

典型的な設定は以下のようになります:
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

`-source:3.0-migration` オプションを追加することで, [Scala 3移行モード](tooling-migration-mode.html)に切り替わります。   
また、移行モードと自動書き換えを最大限に活用するには、`-Xfatal-warnings`を無効にする必要があります。

## 6. 非互換性の解消

Scala 3でコンパイルするときが来ました:

{% highlight text %}
sbt:example> ++3.0.0
[info] Setting Scala version to 3.0.0 on 1 project.
...
sbt:example> example / compile
...
sbt:example> example / Test / compile
{% endhighlight %}

> `example / compile` はプロジェクトの `main`ソースをコンパイルします。
> 厳密には `example / Compile / compile`と等価です。
>
> `example / Test / compile`は `test` ソースをコンパイルします。

コンパイラは２つの異なるレベルの診断を生成します。:
- *Migration Warning*: `-rewrite` オプションにてコンパイルしたときに自動的に適用される警告。
- *Error*: どこかしらでコードがコンパイルできなかったときに出るもの。

コンパイラが自動的に修正をかますのでMigration Warningに関しては無視することもできます。.
しかしながら、非互換性のエラーは必ず手動でケアせねばなりません。

多くの既知の非互換性が[非互換性テーブル](incompatibility-table.html)にリストされています。 
ここで、エラーの説明といくつかの提案された解決策を見つけることができます。

可能であれば、コードのバイナリ互換性を最もよく維持する修正を見けるようにしてみるべきです。
プロジェクトが公開ライブラリである場合は、このことは特に重要です。

> マクロの非互換性は解決が簡単にはできないです。
> 多くのコードは0からの書き直しが必要です。
> [メタプログラミング](compatibility-metaprogramming.html)を見てください。

非互換性を修正した後は、あなたはScala 2.13でテストを実行することで検証できます。

{% highlight text %}
sbt:example> ++2.13.6
[info] Setting Scala version to 2.13.6 on 1 project.
...
sbt:example> example / test
...
[success]
{% endhighlight %}

定期的に変更をコミットすることを検討してください。

全てのエラーの修正が完了したらScala 3でコンパイルを行う事ができるでしょう。
ただMigration Warningだけがのこっていると思います。
`-source:3.0-migration -rewrite` オプションとコンパイルで自動的にパッチが当てれるでしょう。

{% highlight text %}
sbt:example> ++3.0.0
sbt:example> set example / scalacOptions += "-rewrite"
sbt:example> example / compile
...
[info] [patched file /example/src/main/scala/app/Main.scala]
[warn] two warnings found
[success]
{% endhighlight %}

ここで`-source:3.0-migration` オプションお削除する必要があります。また、`-Xfatal-warnings` オプションを再度追加することもできます。
リロード、忘れずに。

## 7. 移行の検証

まれに、異なるImplicit値が解決され、ランタイム時の動作が変更される可能性があります。
良いテストはそのようなバグが見過ごされないようにする唯一の保証です。

Scala 2.13とScala 3でテストか通るかどうか確認してください。

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

もしCIパイプラインがあれば、Scala 3用にセットアップするときが来ました。

## 8. さいごに

おめでとう！これで、モジュールがScala 3に移行できたはずです。
プロジェクトがScala 3に完全移行されるまで、モジュールごとに同じプロセスを繰り返すことができます。

プログラムを相互公開するかどうかに応じてSala 2.13クロスビルディング構成を保持、または削除できます。

これでsbtプロジェクトの移行についての説明は終わりです。
