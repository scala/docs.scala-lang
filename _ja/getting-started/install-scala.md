---
layout: singlepage-overview
title: 入門
partof: getting-started
language: ja
includeTOC: true
redirect_from:
  - /ja/scala3/getting-started.html  # we deleted the scala 3 version of this page
---

このページは Scala 2と Scala 3の両方に対応しています。

## インストールなしで今すぐ Scala を試す！

Scala を今すぐ試すには<a href="https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw" target="_blank">ブラウザで「Scastie」を使います。</a>
Scastieは Scala のサンプルコードがどのように動作するかをブラウザで簡単に試すことができるオンライン「playground」で、様々なバージョンのコンパイラと公開されているライブラリが利用できます。

> Scastie は Scala 2と Scala 3の両方をサポートしていますが、デフォルトでは Scala 3になっています。Scala 2のスニペットをお探しの方は、[こちら](https://scastie.scala-lang.org/MHc7C9iiTbGfeSAvg8CKAA)をご覧ください。

##  コンピューターに Scala をインストールする

Scala をインストールすると、コンパイラやビルドツールなどの様々なコマンドラインツールが同時にインストールされます。
私たちは必須ツール全てを確実にインストールするために「Coursier」の使用をお勧めしますが、それらを手動でインストールすることもできます。

### Scala インストーラーを使う（推奨）

Scala のインストーラーは[Coursier](https://get-coursier.io/docs/cli-overview)というツールで、コマンドは`cs`です。このツールを使うと、JVM と標準 Scala ツールがシステムにインストールされます。
以下の手順でお使いのシステムにインストールしてください。

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew  "または、Homebrewを使用しない場合は" %}
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
  [the Scala installer for Windows]({{site.data.setup-scala.windows-link}})を、ダウンロードして実行してください。
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Other for=install-cs-setup-tabs defaultTab %}
  <noscript>
    <p><span style="font-style:italic;">JavaScript is disabled, click the tab relevant for your OS.</span></p>
  </noscript>
  [手順に従って `cs` ランチャーをインストール](https://get-coursier.io/docs/cli-installation)し、その次に以下を実行します。`./cs setup`
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

`cs setup` は JVM の管理だけでなく、便利なコマンドラインツールもインストールします:

- JDK (インストール済みでなければ)
- [sbt](https://www.scala-sbt.org/) ビルドツール
- [Ammonite](https://ammonite.io/), 強化された REPL
- [scalafmt](https://scalameta.org/scalafmt/), コードフォーマッター
- `scalac` (Scala 2 コンパイラー)
- `scala` (Scala 2 の REPL と script runner).

`cs`の詳細については、[ccoursier-cliのドキュメント](https://get-coursier.io/docs/cli-overview)をご覧ください。

> 現在`cs setup` は Scala 2 のコンパイラとランナー(それぞれ`scalac`と`scala`コマンド)をインストールします。ほとんどのプロジェクトでは Scala 2 と Scala 3 の両方に対応したビルドツールを使用しているので、通常は問題になりません。しかし、以下の追加コマンドを実行することで、Scala 3のコンパイラとランナーをコマンドラインツールとしてインストールすることができます。
> ```
> $ cs install scala3-compiler
> $ cs install scala3
> ```

### 手動でのインストール

Scala プロジェクトのコンパイル、実行、テスト、パッケージ化に必要なツールは Java と sbt の2つだけです。
Java のバージョンは8または11です。
これらを手動でインストールするには:

1. Java 8または11がインストールされていない場合は、[Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)、[Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)、または[AdoptOpenJDK 8/11](https://adoptopenjdk.net/)からJavaをダウンロードしてください。Scala と Java の互換性の詳細については、[JDK Compatibility](/overviews/jdk-compatibility/overview.html)を参照してください。
1. [sbt](https://www.scala-sbt.org/download.html)をインストールしてください。

## sbt で「Hello World」プロジェクトを作成する

sbt をインストールしたら、次のセクションで説明する Scala プロジェクトを作成する準備ができました。

プロジェクトの作成には、コマンドラインまたはIDEを使用します。コマンドラインに慣れている方は、その方法をお勧めします。

### コマンドラインを使う

sbt は、Scala のビルドツールです。sbt は、Scala のコードをコンパイルし、実行し、テストします。(sbt は、Scala コードのコンパイル、実行、テストを行います（ライブラリの公開やその他多くのタスクも可能です）。

sbt で新しい Scala プロジェクトを作成するには、以下の手順で行います:

1. 空のディレクトリに`cd`する.
1. Scala 3プロジェクトを作成する場合は`sbt new scala/scala3.g8`、Scala 2プロジェクトを作成する場合は`sbt new scala/hello-world.g8`というコマンドを実行します。これは、GitHub からプロジェクトのテンプレートを引き出します。このとき"target"という名前のディレクトリが作成されますが無視してください。
1. プロンプトが表示されたら、アプリケーションの名前を`hello-world`とします。これにより、"hello-world "というプロジェクトが作成されます。
1. それでは、生成されたばかりのものを見てみましょう:

```
- hello-world
    - project (sbt が利用するファイル)
        - build.properties
    - build.sbt (sbt のビルド定義)
    - src
        - main
            - scala (あなたの Scala のコードはすべてここに入る)
                - Main.scala (プログラムのエントリーポイント) <-- 今、必要なのはこれだけです
```

sbt についての詳しいドキュメントは、[Scala Book](/scala3/book/tools-sbt.html)（[Scala 2バージョンはこちら](/overviews/scala-book/scala-build-tool-sbt.html)）と、[sbt の公式ドキュメント](https://www.scala-sbt.org/1.x/docs/ja/index.html)に掲載されています。

### IDEを使う

このページの残りの部分を読み飛ばして、[Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)に進んでも問題ありません。

## hello-world プロジェクトを開く

IDE を使ってプロジェクトを開いてみましょう。最もポピュラーなものは IntelliJ と VSCode です。どちらも豊富な IDE 機能を備えていますが、他にも[多くのエディタ](https://scalameta.org/metals/docs/editors/overview.html)を使うことができます。

### IntelliJ を使う

1. [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)をダウンロードしてインストールします。
1. IntelliJ プラグインのインストール方法にしたがって、[Scala プラグインをインストール](https://www.jetbrains.com/help/idea/managing-plugins.html)します。
1. `build.sbt`ファイルを開き、*Open as a project*を選択します。

### VSCode で metals を使う

1. [VSCode](https://code.visualstudio.com/Download)をダウンロードする
1. [Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)から Metals extension をインストールする
1. 次に、build.sbt ファイルがあるディレクトリを開きます（前の指示に従った場合は、hello-world というディレクトリになるはずです）。プロンプトが表示されたら、「Import build」を選択します。

>
>[Metals](https://scalameta.org/metals) は、[VS Codeや	Atom、Sublime Textなど](https://scalameta.org/metals/docs/editors/overview.html)のエディタで Scala のコードを書くためのサポートを提供する「Scala 言語サーバ」であり、Language Server Protocol を使用しています。
> Metalsはバックグラウンドで[BSP（Build Server Protocol）](https://build-server-protocol.github.io/)を使用してビルドツールと通信します。Metalsの仕組みについては、[「Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals」](https://www.scala-lang.org/2019/04/16/metals.html)を参照してください。

### ソースコードをいじってみよう

この2つのファイルを IDE で表示します:

- _build.sbt_
- _src/main/scala/Main.scala_

次のステップでプロジェクトを実行すると、 _src/main/scala/Main.scala_ のコードを実行するために、 _build.sbt_ の設定が使われます。

## Hello World の実行

IDE の使用に慣れている場合は、IDE から _Main.scala_ のコードを実行することができます。

または、以下の手順でターミナルからアプリケーションを実行できます:

1. `hello-world`ディレクトリに`cd` する
1. `sbt`コマンドを実行し、sbt console を開く
1. `~run`と打ち込む。 `~` は全てのコマンドの前に追加できるコマンドで、ファイル保存を検知してコマンドを再実行してくれるため、編集・実行・デバッグのサイクルを高速に行うことができます。sbt はここでも`target`ディレクトリを生成しますが無視してください。

このプロジェクトの`run`を止めたければ、`[Enter]`を押して`run`コマンドを中断します。その後`exit`と入力するか`[Ctrl+D]`を押すと sbt が終了し、コマンドラインプロンプトに戻ります。

## 次のステップ

上記のチュートリアルの後は以下の教材に進んでください。

* [The Scala Book](/scala3/book/introduction.html) (Scala 2版は[こちら](/overviews/scala-book/introduction.html))はScalaの主な機能を紹介する短いレッスンのセットを提供します。
* [The Tour of Scala](/tour/tour-of-scala.html) Scalaの機能を一口サイズで紹介します。
* [Learning Courses](/online-courses.html) オンラインのインタラクティブなチュートリアルやコースです。
* [books](/books.html) 人気のある Scalaの 書籍を紹介します
* [The migration guide](/scala3/guides/migration/compatibility-intro.html) 既存の Scala 2コードベースを Scala 3に移行する際に役立ちます。

## ヘルプが必要な人は
他の Scala ユーザーとすぐに連絡を取りたい場合は、多くのメーリングリストやリアルタイムのチャットルームがあります。これらのリソースのリストや、どこに問い合わせればよいかについては、[コミュニティページ](https://scala-lang.org/community/)をご覧ください。

### (日本語のみ追記)
Scala について日本語で質問したい場合、X（旧Twitter）でつぶやくと気づいた人が教えてくれます。
