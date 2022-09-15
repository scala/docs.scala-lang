---
title: Intellij で sbt を使って Scala プロジェクトをビルドする
layout: singlepage-overview
partof: building-a-scala-project-with-intellij-and-sbt
language: ja
disqus: true
previous-page: /ja/getting-started/intellij-track/getting-started-with-scala-in-intellij
next-page: /ja/testing-scala-in-intellij-with-scalatest
---

このチュートリアルでは、[sbt](https://www.scala-sbt.org/1.x/docs/index.html) を使って Scala プロジェクトをビルドする方法を見ていきます。
sbtは、どのようなサイズの Scala プロジェクトでもコンパイル、実行、テストできる人気のツールです。
sbt（または Maven や Gradle）のようなビルドツールの使用は、1つ以上のコードファイルや依存関係のあるプロジェクトを作ったら、絶対不可欠になります。
[最初のチュートリアル](./getting-started-with-scala-in-intellij.html)を完了していることを前提とします。

## プロジェクトを作成
このでは、Intellij でプロジェクトの作り方をお見せします。
ですが、コマンドラインのほうが快適でしたら、[Getting
コマンドラインの sbt で Scala を始める](/ja/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html) を試して、「Scala コードを記述」節に戻ってくるのをおすすめします。

1. コマンドラインからプロジェクトを作っていなければ、Intellij を開き、"Create New Project" を選びます。
    * 左パネルで Scala を選び、右パネルで sbt を選びます。
    * **Next** をクリックします
    * プロジェクトに **SbtExampleProject** と名前を付けます。
1. コマンドラインですでにプロジェクトを作成していたら、Intelij を開き、**Import Project** を選んで、あなたのプロジェクトの `build.sbt` ファイルを開きます。
1. **JDK version** が `1.8` で、**sbt version** が少なくとも `0.13.13` であることを確認します。
1. **Use auto-import** を選びます。すると依存関係が利用可能であれば自動でダウンロードされます。
1. **Finish** を選びます。

## ディレクトリ構造を理解

sbt は、より複雑なプロジェクトを構築すだしたら便利になるであろう多くのディレクトリを作成します。
今はそのほとんどを無視できますが、全部が何のためかをここでちらっと見ておきましょう。

```
- .idea (IntelliJ ファイル)
- project (sbt のプラグインや追加設定)
- src (ソースファイル)
    - main (アプリケーションコード)
        - java (Java ソースファイル)
        - scala (Scala ソースファイル)
          ^-- 今はこれが必要なものの全てです
        - scala-2.12 (Scala 2.12 固有ファイル)
    - test (ユニットテスト)
- target (生成されたファイル)
- build.sbt (sbt のためのビルド定義ファイル)
```


## Scala コードを記述
1. 左の **Project** パネルで、`SbtExampleProject` => `src` => `main` を展開します。
1. `scala` を右クリックし、**New** => **Package** を選択します。
1. パッケージに `example` と名前をつけ、**OK** をクリックします。
1. パッケージ `example` を右クリックし、**New** => **Scala class** をクリックします。
1. クラスに　`Main` と名前をつけ、**Kind** を `object` に変更します。
1. クラスのコードを次おように変更します。

```
@main def run() =
  val ages = Seq(42, 75, 29, 64)
  println(s"The oldest person is ${ages.max}")
```

注：Intellij は Scala コンパイラーの独自実装を持っており、コードが間違っていると Intellij が示しても正しい場合がときどきあります。
コマンドラインで sbt がプロジェクトを実行できるかを常にチェックできます。。

## プロジェクトを実行
1. **Run** メニューから、**Edit configurations** を選びます。
1. **+** ボタンをクリックし、**sbt Task** を選びます
1. それに `Run the program` と名付けます。
1. **Tasks** フィールドで、`~run` と入力します.
    `~` は、プロジェクトファイルへの変更を保存するたびに sbt にプロジェクトを再ビルド、再実行させます。
1. **OK** をクリックします。
1. **Run** メニューで、**Run 'Run the program'** をクリックします。
1. コードの `75` を `61` に変えて、コンソールで更新された出力を見ます。

## 依存関係を追加

趣向を少し変えて、アプリに追加機能を加えるために公開ライブラリの使い方を見てみましょう。

`build.sbt` を開き、以下のファイルを追加します。

```
libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2"
```

ここで `libraryDependencies` は依存関係の集合であり、`+=` を使うことにより、[scala-parser-combinators](https://github.com/scala/scala-parser-combinators) への依存を、sbt が起動時に取得してくる依存関係の集合に加えています。
これで、どの Scala ファイルでも、`scala-parser-combinator` にあるクラスやオブジェクトなどを通常のインポートでインポートできます。

さらなる公開ライブラリは、Scala ライブラリインデックス [Scaladex](https://index.scala-lang.org/) で見つけられます。
そこでは上述のような依存関係情報をコピーでき、`build.sbt` ファイルにペーストできます。

## 次のステップ

**Intellij で入門** シリーズの次のチュートリアルに進み、[Intelij で ScalaTest を使って Scala をテストする](testing-scala-in-intellij-with-scalatest.html)方法を学びます。

**あるいは**

- インタラクティブなオンラインコース [Scala Exercises](https://www.scala-exercises.org/scala_tutorial) で Scala を学習します。
- [Scala ツアー](/ja//tour/tour-of-scala.html) で Scala の特徴を一口大のサイズでステップバイステップに学びます。
