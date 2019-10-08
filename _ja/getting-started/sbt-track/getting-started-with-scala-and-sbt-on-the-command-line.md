---
title: コマンドラインの sbt で Scala を始める
layout: singlepage-overview
partof: getting-started-with-scala-and-sbt-on-the-command-line
language: ja
disqus: true
next-page: /ja/testing-scala-with-sbt-on-the-command-line
---

このチュートリアルでは、テンプレートから Scala プロジェクトを作成する方法を見ていきます。
あなた自身のプロジェクトを始めるスタート地点として使えます。
Scala のデファクトのビルドツール [sbt](https://www.scala-sbt.org/1.x/docs/index.html) を用います。
sbt はあなたのプロジェクトに関連した様々なタスク、とりわけコンパイル、実行、テストをしてくれます。
ターミナルの使い方を知っていることを前提とします。

## インストール
1. Java 8 JDK（別名 1.8）がインストールされていることを確認します。
    * コマンドラインで `javac -version` を実行し、`javac 1.8.___` と表示されるのを確認します。
    * バージョン 1.8 かそれ以上がなければ、[JDK をインストールします](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)。
1. sbt をインストールします。
    * [Mac](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Mac.html)
    * [Windows](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Windows.html)
    * [Linux](https://www.scala-sbt.org/1.x/docs/Installing-sbt-on-Linux.html)

## プロジェクトを作成
1. 空のフォルダーに `cd` 。
1. コマンド `sbt new scala/hello-world.g8` を実行します。
これは GitHub から 'hello-world' というテンプレートを取ってきます。
`target` フォルダーも作成しますが、無視してください。
1. 入力をうながされたら、アプリを `hello-world` と名付けます。
これで "hello-world" というプロジェクトが作成されます。
1. 生成されたばかりのものを見てみましょう。

```
- hello-world
    - project （sbt はこのディレクトリを管理プラグインや依存関係のインストールに使います）
        - build.properties
    - src
        - main
            - scala （Scala コードはここに来ます)
                -Main.scala (プログラムの入口） <-- 今のところこれこそが欲しいものです
    build.sbt （sbt のビルド定義ファイル）
```

プロジェクトをビルドしたら、sbt は生成されるファイルのための `target` をもっと作るでしょう。
これらは無視してください。

## プロジェクトを実行
1. `hello-world` に `cd` 。
1. `sbt` を実行します。sbt コンソールが開くでしょう。
1. `~run` と入力します。`~` はオプションで、ファイルが保存されるたびに sbt にコマンドを再実行させるので、すばやい編集/実行/デバッグサイクルを回せます。
sbt は `target` ディレクトリを作成しますが、無視してください。

## コードを修正
1. お好きなテキストディタでファイル `src/main/scala/Main.scala` を開きます。
1. "Hello, World!" を "Hello, New York!" に変更します。
1. sbt コマンドを停止していなければ、コンソールに "Hello, New York!" と印字されるのが見えるでしょう。
1. 繰り返し変更してみてコンソールが変化するのを見てみましょう。

## 依存関係を追加
趣向を少し変えて、アプリに追加機能を加えるために公開ライブラリの使い方を見てみましょう。

`build.sbt` を開き、以下のファイルを追加します。

1. `build.sbt` を開き、以下の行を追加します。

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```

ここで `libraryDependencies` は依存関係の集合であり、`+=` を使うことにより、[scala-parser-combinators](https://github.com/scala/scala-parser-combinators) への依存を、sbt が起動時に取得してくる依存関係の集合に加えています。
これで、どの Scala ファイルでも、`scala-parser-combinator` にあるクラスやオブジェクトなどを通常のインポートでインポートできます。

さらなる公開ライブラリは、Scala ライブラリインデックス [Scaladex](https://index.scala-lang.org/) で見つけられます。
そこでは上述のような依存関係情報をコピーでき、`build.sbt` ファイルにペーストできます。

## 次のステップ

**sbt で入門** シリーズの次のチュートリアルに進み、[コマンドライン で sbt を使って Scala をテストする](testing-scala-with-sbt-on-the-command-line.html)方法を学びます。

**あるいは**

- インタラクティブなオンラインコース [Scala Exercises](https://www.scala-exercises.org/scala_tutorial) で Scala を学習します。
- [Scala ツアー](/ja//tour/tour-of-scala.html) で Scala の特徴を一口大のサイズでステップバイステップに学びます。
