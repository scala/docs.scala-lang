---
title: Intellij で Scala を始める
layout: singlepage-overview
partof: getting-started-with-scala-in-intellij
language: ja
disqus: true
next-page: /ja/building-a-scala-project-with-intellij-and-sbt
---

このチュートリアルでは、Intellij IDEA と Scala プラグインを使って最小限の Scala プロジェクトを作る方法を見ていきます。
このガイドでは、Intellij があなたのために Scala をダウンロードしてくれます。

## インストール
1. Java 8 JDK（別名 1.8）がインストールされていることを確認します。
    * コマンドラインで `javac -version` を実行し、`javac 1.8.___` と表示されるのを確認します。
    * バージョン 1.8 かそれ以上がなければ、[JDK をインストールします](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)。
1. [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/) をダウンロード、インストールします。
1. それから、Intellij を起動したあと、[how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/installing-updating-and-uninstalling-repository-plugins.html) の指示に従って Scala プラグインをダウンロードしてインストールできます（プラグインメニューで「Scala」と検索）。

プロジェクトを作るときは、Scala の最新バージョンをインストールします。
注：存在する Scala プロジェクトを開きたければ、Intellij をスタートするときに **Open** をクリックします。


## プロジェクトを作成
1. Intellij を開き、**File** => **New** => **Project** をクリックします。
1. 左パネルで Scala を選びます。右のパネルで IDEA を開きます。
1. プロジェクトに **HelloWorld** と名前を付けます。
1. 今回始めて Intellij で Scala プロジェクトを初めて作るとすれば、Scala SDK をインストールする必要があります。Scala SDK フィールドの右側にある **Create** ボタンをクリックします。
1. 最新のバージョン番号（例 {{ site.scala-version }}）を選び、**Download**をクリックします。
 これは数分かかるかもしれませんが、今後のプロジェクトでは同じ SDK を使えます。
1. SDK がダウンロードされたらすぐに、「New Project」ウィンドウに戻って **Finish** ボタンをクリックします。


## コードを記述

1. 左側の **プロジェクト** ペインで、`src` ディレクトリを右クリックし、**New** => **Scala class** を選択します。
 もし、**Scala class** が見当たらなければ、**HelloWorld** を右クリックし、**Add Framework Support...** をクリックし、**Scala** を選択して進めます。
 **Error: library is not specified** が発生したら、ダウンロードボタンをクリックするか、またはライブラリパスを手動で選択します。
1. クラスに `Hello` と名前を付けて、**Kind** を `object` に変更します。
1. クラスのコードを次のように変更します。

```
object Hello extends App {
  println("Hello, World!")
}
```

## 実行
* あなたのコード `Hello` で右クリックし、**Run 'Hello'** を選びます。
* 完了です！

## Scala を試してみる

コード例を試してみる良い方法は、Scala ワークシートです。

1. 左のプロジェクトペインで、`src` ディレクトリを右クリックし、**New** => **Scala Worksheet** を選びます。
2. 新しい Scala ワークシートに "Mathematician" と名前を付けます。
3. ワークシートに以下のコードを入力します。

```
def square(x: Int) = x * x

square(2)
```

コードを変更するにつれて、その評価結果が右ペインに現れるのに気づくでしょう。

## 次のステップ

言語を学び始めるのに使える、シンプルな Scala プロジェクトの作り方を学びました。
次のチュートリアルでは、シンプルなプロジェクトから本番アプリケーションまで使える sbt という重要なビルドツールを紹介します。

次: [Intellij で sbt を使って Scala プロジェクトをビルドする](building-a-scala-project-with-intellij-and-sbt.html)
