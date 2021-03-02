---
layout: singlepage-overview
title: Getting Started with Scala 3
scala3: true
language: ja
---



## Try Scala without installing anything

いますぐ Scala 3 を試してみたいなら <a href="https://scastie.scala-lang.org/?target=dotty" target="_blank">ブラウザ上で動作する“Scastie” </a> を使ってみてください。
_Scastie_ は Scala のコードがどのように動作するか試せるオンラインのプレイグラウンドです。全ての Scala のコンパイラと公開されているライブラリを使うこともできます。


## Scala をインストールする

Scala をインストールするということはつまり、さまざまなコマンドラインツールやビルドツールをインストールするということです。
Scalaのインストーラツールの"Coursier"を使うのがおすすめです。Coursier を使えばインストールが必要なものすべてを自動でインストールできます。 もちろん、手動でそれぞれのツールをインストールすることもできます。最低限 Java、sbt があれば Scala のコードを書き始められます。

### Scala インストーラ を使う (推奨)

Scala インストーラは [Coursier](https://get-coursier.io/docs/cli-overview)という名前のツールで、メインコマンドは`cs`です。
Coursier はシステムに JVM と Scala のツールがインストールされているかどうか確認します。

次の手順に従って Coursier をインストールしてください。

<div class="main-download">
  <div id="download-step-one">
    <p><a href="https://get-coursier.io/docs/cli-overview.html#install-native-launcher" target="_blank"><code>cs</code> launcherをインストールする手順</a>に従ってインストールし、次のコマンドを実行してください。:</p>
    <p><code>$ ./cs setup</code></p>
  </div>
</div>

JVM の管理に加えて、 `cs setup` コマンドは次のような便利なコマンドラインツールもインストールします。:

- JDK
- ビルドツール [sbt](https://www.scala-sbt.org) と [mill](https://www.lihaoyi.com/mill) 
- [Ammonite](https://ammonite.io), 高機能 REPL
- [scalafmt](https://scalameta.org/scalafmt), the Scala formatter
- [Coursier CLI](https://get-coursier.io/docs/cli-overview), Scala で書かれたアプリケーションをインストールできます
- (**Scala 2.13** 向けの `scala` コマンドと `scalac` コマンド。Scala 3 用ではありません。)


`cs setup`を実行したら以下のコマンドで Java, Scala がインストールされているかどうか確認してください。

```shell
java --version
scala --version
```

詳しくは、 [coursier-cli documentation](https://get-coursier.io/docs/cli-overview)を読んでください。

### ... または、手動でインストールする

Scala プロジェクトをコンパイル、実行、テストやパッケージングするには次の二つのツールだけで十分です。Java 8 または 11、そして sbt です。
これらのツールを手動でインストールするには、以下の手順に従ってください。

1. Java を [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html), か [AdoptOpenJDK 8/11](https://adoptopenjdk.net/)からダウンロードしてください。 Scala/Java の互換性の詳細については [JDK Compatibility](/overviews/jdk-compatibility/overview.html) を参照してください。
2.  [sbt](https://www.scala-sbt.org/download.html) をインストールしてください。

## sbtで “Hello, world” プロジェクトを作成する

Scala 3 をインストールする前に、Scala を使ったことがない開発者に向けて sbt を使ってプロジェクトを作成、実行する方法について解説します。

もし sbt でプロジェクトを作成する方法を既に知っているなら 「Scala 3 のインストール」 の章まで読み飛ばしてください。

コマンドライン、IDE のどちらからでも sbt プロジェクトを作成できます。

もし慣れているならコマンドラインツールを使うアプローチを推奨します。


### コマンドラインツールを使う

sbt は Scala のビルドツールです。
sbt を使って Scala のコードをコンパイル、実行やテストできます。

(ライブラリを公開したり他の様々なタスクを実行することもできます。)

sbt で新しくプロジェクトを作成するには次の手順に従ってください。:

1. `cd` コマンドで新しいディレクトリに移動してください。
1. `sbt new scala/hello-world.g8` コマンドを実行してください。
このコマンドを実行すると ['hello-world' template][template-url] を GitHub から pull します。
また、無視してよい _target_ フォルダを作成します。
1. ターミナルでアプリケーション名の入力を促されたら `hello-world` と入力してください。
  "hello-world"と言う名前のプロジェクトが作成されます。
1. 次のようなファイル、ディレクトリが作成されるはずです:

```
hello-world/
  project/           (sbt が管理するファイルがここに入ります。)
    build.properties
  src/main/scala/    (Scala のソースコードはここに書きます。)
    Main.scala       (プログラムのエントリーポイントです。)
  build.sbt          (sbt の ビルド定義ファイルです。)
```
今のところ `src/main/scala` にある `Main.scala` しか必要ありません。

sbt の詳しいドキュメントは [Scala Book](/scala3/book/scala-tools.html) と  sbt 公式 [documentation](https://www.scala-sbt.org/1.x/docs/index.html) にあります。


{% comment %}
### With IntelliJ IDEA

You can skip the rest of this page and go directly to [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)
{% endcomment %}


## “Hello, world” プロジェクトを開く

IDE を使ってプロジェクトを開きます。
最も人気なエディタは IntelliJ IDEA と VS Code です。
どちらも 高度な IDE 機能を提供しています。しかし、 [その他のエディタ](https://scalameta.org/metals/docs/editors/overview.html)を使うこともできます。

### IntelliJ IDEA を利用する

1. [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/) をダウンロード、インストールしてください。
1. リンク先の手順に従って Scala プラグインをインストールしてください。 [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html)
1.  _build.sbt_ ファイルを開いて、 _Open as a project_ を選択してください。

### VS Code と Metals を利用する

1. [VS Code](https://code.visualstudio.com/Download) をダウンロードしてください。
1. [Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals) から 拡張機能 Metals をインストールしてください。
1. 次に、_build.sbt_ ファイルが置いてあるディレクトリを開いてください。ダイアログが表示されたら _Import build_ をおしてください。

>[Metals](https://scalameta.org/metals) は Scala の lauguage server です。Metals は Lauguage Server Protocol を使ってVS Code やその他のエディタ、たとえば[Atom, Sublime Text, and more](https://scalameta.org/metals/docs/editors/overview.html)、で Scala を書くための補助機能を提供します。
(Metals の仕組みについて詳しく知りたい方は、以下のリンクをご覧ください。 [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).)



### ソースコードを見る

以下の2つのファイルをIDEで開いてください:

- _build.sbt_
- _src/main/scala/Main.scala_

次のステップでプロジェクトを起動したとき、_build.sbt_ に書かれた設定が _src/main/scala/Main.scala_ を実行するために使われます。


##  “Hello, world” プロジェクトを実行する

IDEを使ってコードを書くのに特に抵抗がないなら、 _Main.scala_ に書かれたコードをIDEから実行してください。

そうでないなら、次の手順でターミナルからアプリケーションを実行することもできます。

1. `cd` コマンドで _hello-world_ に移動してください。
1. `sbt` コマンドを実行してください。sbt console が開きます。
1. `~run` と入力してください。
  `~` は オプショナルな接頭辞で、これを付けるとファイルを保存するたびに sbt がそのコマンドを実行するので 編集/実行/デバッグのサイクルを高速に回せます。sbt は自身が使うために `target` ディレクトリを生成します。 開発者はこのディレクトリを無視してかまいません。

このプロジェクトを試し終わったら、エンターキーを押して `run` コマンドの実行を停止してください。

`exit`と入力するか `[Ctrl][d]` ショートカットをおすと sbt から出てコマンドプロンプトに戻ります。

### Scala 3 のインストール

Scala 3 を始めるには以下のような方法があります。詳しくは[こちら](https://dotty.epfl.ch/)も参照してください。

1. sbt をインストールし sbt で`sbt new lampepfl/dotty.g8` を実行して Scala 3 プロジェクトを始めることができます。
1. 先に説明した通り、`cs setup` コマンドを使って Java、Scala(2.**)の環境をセットアップすることができます。 また、`cs install scala3-compiler`、`cs install scala3-repl`コマンドでそれぞれ Scala 3 のコンパイラ、 Scala 3 の REPL をインストールできます。
1. Scala 3 のソースを[ここ](https://github.com/lampepfl/dotty/releases)から手動でインストールすることができます。

#### sbt を使って Scala 3 プロジェクトをはじめる(オプショナル)

上の手順で`cs setup` をすでに実行しているなら `sbt`コマンドが使えるようになっているはずです。 以下のコマンドを実行することで Scala 3 のテンプレートプロジェクトを作れます。
```shell
sbt new lampepfl/dotty.g8
```

Scala 2 とクロスコンパイル可能なプロジェクトテンプレートを利用する場合は以下のコマンドを実行してください。

```shell
sbt new lampepfl/dotty-cross.g8
```
#### Coursierを使ってScala 3 用のコンパイラと REPL をインストールする(オプショナル)

以下では Scala 3 のコンパイラ、REPL と Scala 3 をインストールする手順を説明します。

```shell
cs install scala3-compiler
cs install scala3-repl
```

インストールしたコンパイラ、REPL は`cs launch <name>` で実行できます。
```shell
cs launch scala3-compiler -- Hello.scala
```

```shell
cs launch scala3-repl
```



#### Scala 3 を手動でインストールする(オプショナル)

Scala 3 はまだリリースされていないので Github から最新のソース(2021/02時点で scala3-3.0.0-M3 )を直接ダウンロードしてpathを通してください。

```shell
wget https://github.com/lampepfl/dotty/releases/download/3.0.0-M3/scala3-3.0.0-M3.tar.gz
tar -zxvf scala3-3.0.0-M3.tar.gz
```





## 次のステップ

Scala 3 を使った 最初の “Hello, world” プロジェクトを作れたので, 次のステップに進んでみましょう。

以下の記事をチェックしてみてください:

- [The Scala 3 Book](/scala3/book/introduction.html), Scala の主要な機能の導入となる一連の短いレッスンが用意されています。
- [The migration guide](https://scalacenter.github.io/scala-3-migration-guide/) 既にある Scala 2 で書かれたコードベースを Scala 3 に移行する際に役立つ情報がまとめてあります。

他の Scala ユーザーと交流したいなら、いくつかのメーリングリストやリアルタイムチャットルームがあります。
これらのリソースのリストや助けを求める場所を探すには、[Scala community page](https://scala-lang.org/community/) をチェックしてみてください。

<!-- Hidden elements whose content are used to provide OS-specific download instructions.
 -- This is handled in `resources/js/functions.js`.
 -->
<div style="display:none" id="stepOne-linux">
       <code class="hljs">$ curl -Lo cs https://git.io/coursier-cli-linux && chmod +x cs && ./cs setup </code> <br>
</div>

<div style="display:none" id="stepOne-unix">
    <p>Follow <a href="https://get-coursier.io/docs/cli-overview.html#install-native-launcher" target="_blank">the instructions to install the <code>cs</code> launcher</a> then run:</p>
    <p><code>$ ./cs setup</code></p>
</div>

<div style="display:none" id="stepOne-osx">
    <p>Homebrewを使っている場合:</p>
    <div class="highlight">
        <code class="hljs">$ brew install coursier/formulas/coursier && cs setup </code> <br>
    </div>
    <p>Homebrew を使わない場合:</p>
    <div class="highlight">
        <code class="hljs">$ curl -Lo cs https://git.io/coursier-cli-macos && chmod +x cs &&  (xattr -d com.apple.quarantine cs || true) && ./cs  setup </code> <br>
    </div>
</div>

<div style="display:none" id="stepOne-windows">
    <p>coursier ベースの<a href="https://git.io/coursier-cli-windows-exe">Scala installer for Windows</a> をダウンロードして実行してください。</p>
</div>

[template-url]: https://github.com/scala/hello-world.g8
