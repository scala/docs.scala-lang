---
layout: singlepage-overview
title: Getting Started with Scala 3
scala3: true
language: ja
---



## Try Scala without installing anything

いますぐ Scala 3 を試してみたいなら <a href="https://scastie.scala-lang.org/?target=dotty" target="_blank">ブラウザ上で動作する“Scastie” </a> を使ってみよう。
_Scastie_ は Scala のコードがどのように動作するか試せるオンラインのプレイグラウンドである。全ての Scala のコンパイラと公開されているライブラリを使うこともできる。


## Scala をインストールする

Scala をインストールするということはつまり、さまざまなコマンドラインツールやビルドツールをインストールするということである。
Scala のインストーラツール "Coursier" を使うのが推奨されている。Coursier を使えばインストールが必要なものすべてを自動でインストールできる。 もちろん、手動でそれぞれのツールをインストールすることもできる。最低限 Java、sbt があれば Scala のコードを書き始められる。

### Scala インストーラ を使う (推奨)

Scala インストーラは [Coursier](https://get-coursier.io/docs/cli-overview)という名前のツールで、メインコマンドは`cs`である。
Coursier はシステムに JVM と Scala のツールがインストールされているかどうか確認する。

次の手順に従って Coursier をインストールしてください。

<div class="main-download">
  <div id="download-step-one">
    <p><a href="https://get-coursier.io/docs/cli-overview.html#install-native-launcher" target="_blank"><code>cs</code> launcherをインストールする手順</a>に従ってインストールし、次のコマンドを実行する。:</p>
    <p><code>$ ./cs setup</code></p>
  </div>
</div>

JVM の管理に加えて、 `cs setup` コマンドは次のような便利なコマンドラインツールもインストールする。:

- JDK
- ビルドツール [sbt](https://www.scala-sbt.org) と [mill](https://com-lihaoyi.github.io/mill/) 
- [Ammonite](https://ammonite.io), 高機能 REPL
- [scalafmt](https://scalameta.org/scalafmt), the Scala formatter
- [Coursier CLI](https://get-coursier.io/docs/cli-overview), Scala で書かれたアプリケーションをインストールできる
- (**Scala 2.13** 向けの `scala` コマンドと `scalac` コマンド。Scala 3 用ではない。)



`cs setup`を実行したら以下のコマンドで Java, Scala がインストールされているかどうか確認する。

```shell
java --version
scala --version
```

詳しくは、 [coursier-cli documentation](https://get-coursier.io/docs/cli-overview)を読もう。

### ... または、手動でインストールする

Scala プロジェクトをコンパイル、実行、テストやパッケージングするには次の二つのツールだけで十分である。Java 8 または 11、そして sbt である。
これらのツールを手動でインストールするには、以下の手順に従ってください。

1. Java を [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html), か [AdoptOpenJDK 8/11](https://adoptopenjdk.net/)からダウンロードする。 Scala/Java の互換性の詳細については [JDK Compatibility](/overviews/jdk-compatibility/overview.html) を参照せよ。
2.  [sbt](https://www.scala-sbt.org/download.html) をインストールする。

## sbtで “Hello, world” プロジェクトを作成する

Scala 3 をインストールする前に、Scala を使ったことがない開発者に向けて sbt を使ってプロジェクトを作成、実行する方法について解説する。

もし sbt でプロジェクトを作成する方法を既に知っているなら 「Scala 3 のインストール」 の章まで読み飛ばしていい。

コマンドライン、IDE のどちらからでも sbt プロジェクトを作成できる。

もし慣れているならコマンドラインツールを使うアプローチを推奨する。


### コマンドラインツールを使う

sbt は Scala のビルドツールである。
sbt を使って Scala のコードをコンパイル、実行やテストできる。

(ライブラリを公開したり他の様々なタスクを実行することもできる。)

sbt で新しくプロジェクトを作成するには次の手順に従ってください。:

1. `cd` コマンドで新しいディレクトリに移動する。
1. `sbt new scala/hello-world.g8` コマンドを実行する。
このコマンドを実行すると ['hello-world' template][template-url] を GitHub から pull する。
また、無視してよい _target_ フォルダを作成する。
1. ターミナルでアプリケーション名の入力を促されたら `hello-world` と入力する。
  "hello-world"と言う名前のプロジェクトが作成される。
1. 次のようなファイル、ディレクトリが作成される:

```
hello-world/
  project/           (sbt が管理するファイルがここに入ります。)
    build.properties
  src/main/scala/    (Scala のソースコードはここに書きます。)
    Main.scala       (プログラムのエントリーポイントです。)
  build.sbt          (sbt の ビルド定義ファイルです。)
```
今のところ `src/main/scala` にある `Main.scala` だけ必要である。

sbt の詳しいドキュメントは [Scala Book](/scala3/book/scala-tools.html) と  sbt 公式 [documentation](https://www.scala-sbt.org/1.x/docs/index.html) にある。


{% comment %}
### With IntelliJ IDEA

これ以降は読み飛ばしてそのまま [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)を見ても問題ない。
{% endcomment %}


## “Hello, world” プロジェクトを開く

IDE を使ってプロジェクトを開く。
最も人気なエディタは IntelliJ IDEA と VS Code である。
どちらも 高度な IDE 機能を提供している。しかし、 [その他のエディタ](https://scalameta.org/metals/docs/editors/overview.html)を使うこともできる。

### IntelliJ IDEA を利用する

1. [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/) をダウンロード、インストールする。
1. リンク先の手順に従って Scala プラグインをインストールする。 [the instructions on how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html)
1.  _build.sbt_ ファイルを開いて、 _Open as a project_ を選択する。

### VS Code と Metals を利用する

1. [VS Code](https://code.visualstudio.com/Download) をダウンロードする。
1. [Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals) から 拡張機能 Metals をインストールする。
1. 次に、_build.sbt_ ファイルが置いてあるディレクトリを開いてください。ダイアログが表示されたら _Import build_ をクリックする。

>[Metals](https://scalameta.org/metals) は Scala の lauguage server である。Metals は Lauguage Server Protocol を使ってVS Code やその他のエディタ、たとえば[Atom, Sublime Text, and more](https://scalameta.org/metals/docs/editors/overview.html)、で Scala を書くための補助機能を提供している。
(Metals の仕組みについて詳しく知りたい方は、以下のリンクを参照。 [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).)



### ソースコードを見る

以下の2つのファイルをIDEで開く:

- _build.sbt_
- _src/main/scala/Main.scala_

次のステップでプロジェクトを起動したとき、_build.sbt_ に書かれた設定が _src/main/scala/Main.scala_ を実行するために使われる。


##  “Hello, world” プロジェクトを実行する

IDEを使ってコードを書くのに特に抵抗がないなら、 _Main.scala_ に書かれたコードをIDEから実行しよう。

そうでないなら、次の手順でターミナルからアプリケーションを実行することもできる。

1. `cd` コマンドで _hello-world_ に移動する。
1. `sbt` コマンドを実行してください。sbt console が開く。
1. `~run` と入力。
  `~` は オプショナルな接頭辞で、これを付けるとファイルを保存するたびに sbt がそのコマンドを実行するので 編集/実行/デバッグのサイクルを高速に回せる。sbt は自身が使うために `target` ディレクトリを生成する。 開発者はこのディレクトリを無視してよい。

このプロジェクトを試し終えたら、エンターキーを押し `run` コマンドの実行を停止しよう。

`exit`と入力するか `[Ctrl][d]` ショートカットをおすと sbt から出てコマンドプロンプトに戻る。

### Scala 3 のインストール

Scala 3 を始めるには以下のような方法があります。詳しくは[こちら](https://dotty.epfl.ch/)も参照してください。

1. sbt をインストールし sbt で`sbt new lampepfl/dotty.g8` を実行して Scala 3 プロジェクトを始めることができる。
1. 先に説明した通り、`cs setup` コマンドを使って Java、Scala(2.**)の環境をセットアップすることができる。 また、`cs install scala3-compiler`、`cs install scala3-repl`コマンドでそれぞれ Scala 3 のコンパイラ、 Scala 3 の REPL をインストールできる。
1. Scala 3 のソースを[ここ](https://github.com/lampepfl/dotty/releases)から手動でインストールすることができる。

#### sbt を使って Scala 3 プロジェクトをはじめる(オプショナル)

上の手順で`cs setup` をすでに実行しているなら `sbt`コマンドが使えるようになっているはずである。 以下のコマンドを実行することで Scala 3 のテンプレートプロジェクトを作れる。
```shell
sbt new lampepfl/dotty.g8
```

Scala 2 とクロスコンパイル可能なプロジェクトテンプレートを利用する場合は以下のコマンドを実行しよう。

```shell
sbt new lampepfl/dotty-cross.g8
```
#### Coursierを使ってScala 3 用のコンパイラと REPL をインストールする(オプショナル)

以下では Scala 3 のコンパイラ、REPL と Scala 3 をインストールする手順を説明する。

```shell
cs install scala3-compiler
cs install scala3-repl
```

インストールしたコンパイラ、REPL は`cs launch <name>` で実行できる。
```shell
cs launch scala3-compiler -- Hello.scala
```

```shell
cs launch scala3-repl
```



#### Scala 3 を手動でインストールする(オプショナル)

Scala 3 はまだリリースされていないので Github から最新のソース(2021/03時点で scala3-3.0.0-RC1 )を直接ダウンロードしてpathを通す。

```shell
wget https://github.com/lampepfl/dotty/releases/download/3.0.0-RC1/scala3-3.0.0-RC1.tar.gz
tar -zxvf scala3-3.0.0-RC1.tar.gz
```





## 次のステップ

Scala 3 を使った 最初の “Hello world” プロジェクトを作れたので、 次のステップに進む。

以下の記事をチェックしよう:

- [The Scala 3 Book](/scala3/book/introduction.html), Scala の主要な機能の導入となる一連の短いレッスンが用意されている。
- [The migration guide](https://scalacenter.github.io/scala-3-migration-guide/) 既にある Scala 2 で書かれたコードベースを Scala 3 に移行する際に役立つ情報がまとめてある。

他の Scala ユーザーと交流したいなら、いくつかのメーリングリストやリアルタイムチャットルームがある。
これらのリソースのリストや助けを求める場所を探すには、[Scala community page](https://scala-lang.org/community/) をチェックしよう。

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
