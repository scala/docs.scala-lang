---
title: 前提条件
type: section
description: このセクションはScala 3への移行の前提条件について詳細化します
num: 9
previous-page: tutorial-intro
next-page: tutorial-sbt
language: ja
---

[互換性リファレンス](compatibility-intro.html)のページで示したように、Scala 3への移行に関してはScala 2.13とScala 3の相互互換性のおかげで容易であります。

しかしながら、Scala 3移植を始める前にかならず確認しなければならないScala 2.13プロジェクトの前提条件があります。:
- Scala 3にまだ移植されていないマクロライブラリに依存してはなりません
- Scala 3に同等のものがないコンパイラプラグインを使用してはなりません
- `scala-reflect`に依存してはなりません.

次の段落では、これらの前提条件を確認する方法と、それらが満たされていな場合の対処方法について説明します。

移植を続行する準備ができたら[sbt移行チュートリアル](tutorial-sbt.html)にジャンプできます。

## マクロの依存

マクロライブラリはScalaのライブラリでマクロメソッドを公開しています。

それらのライブラリはScala 2で幅広く使われています。
例えば、: 
- [lightbend/scala-logging](https://index.scala-lang.org/lightbend/scala-logging)
- [milessabin/shapeless](https://index.scala-lang.org/milessabin/shapeless)
- [playframework/play-json](https://index.scala-lang.org/playframework/play-json)
- [scalatest/scalatest](https://index.scala-lang.org/scalatest/scalatest)

しかしScala 3コンパイラはScala 2.13のマクロを展開することができません。
なので、Scala3にジャンプする前に、あなたは移植されていないマクロライブラリに依存していないかを確認する必要があります。

あなたはたくさんのマクロの移行状態を[Scala Macro Libraries](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html) ページで確認することができます。
幸いなことにたくさんのライブラリはこの行を読むまでに移植されているでしょう。

プロジェクト内のこれらのマクロ依存ごとに、クロスビルドバージョン、すなわちScala 2.13とScala 3の両方で使用可能なバージョンにアップグレードする必要があります。

いくつか例を上げてみましょう

`"scalatest" %% "scalatest" % "3.0.9"` への依存関係は、次の理由でアップグレードする必要があります。:
- `scalatest` API は一部のマクロ定義がベースになっているから。
- `3.0.9` バージョンはScala 3用にパブリッシュされていないから.

`3.2.7`までアップグレードする必要があり、そしてそれは、Scala 2.13とScala 3のクロス公開されています。

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.7"
```

## コンパイラプラグイン

Scala 2のコンパイラプラグインはScala 3との互換性がありません。

コンパイラプラグインは一般的に`build.sbt`ファイルに設定されていて一つにまとまっています。:

```scala
// build.sbt
libraryDependencies +=
  compilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)

addCompilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)
```

一部のコンパイラプラグインは自動的にsbtプラグインによって追加されるでしょう。

自身のプロジェクトのコンパイラオブションを見ることによって設定されているプラグインを見つけることができるでしょう。

{% highlight text %}
sbt:example> show example / Compile / scalacOptions
[info] * -Xplugin:target/compiler_plugins/wartremover_2.13.6-2.4.15.jar
[info] * -Xplugin:target/compiler_plugins/semanticdb-scalac_2.13.6-4.4.18.jar
[info] * -Yrangepos
[info] * -P:semanticdb:targetroot:/example/target/scala-2.13/meta
{% endhighlight %}

上記の例では、wartremoverとsemanticdbの2つのコンパイラプラグインが使用されていることがわかります。
これらのプラグインごとに、代替ソリューションがあることを確認するか、無効にする必要があります。

最もよく使用されるコンパイラプラグインの代替ソリューションを以下に示します。

### SemanticDB

[SemanticDB](https://scalameta.org/docs/semanticdb/guide.html) は現在Scala 3コンパイラに同梱されています。
:
- `-Ysemanticdb` オプションはsemanticDBファイルを生成します。
- `-semanticdb-target` オプションはsemanticDBファイルの出力ディレクトリを指定できます。

sbtは`semanticdbEnabled := true`という単一の設定で、semanticDB設定を自動的に構成できます。

### Scala.js

Scala3上での[Scala.js](https://www.scala-js.org/) コンパイルはコンパイラプラグインに依存していないです。

Scala.jsプロジェクトをコンパイルするには`sbt-scalajs`プラグインバージョン`1.5.0`以上だと使用できます。

```scala
// project/plugins.sbt
addSbtPlugin("org.scala-js" % "sbt-scalajs" % "1.5.0")
```

### Scala Native

Scala 3 はまだ[Scala Native](https://scala-native.readthedocs.io/en/latest/)をサポートしていません。

もしScala Nativeにクロスビルドできていれば、Scala3移植は可能です。
しかしまだNativeプラットフォーム用にコンパイルはできません。

### Kind Projector

[the Kind Projector](https://github.com/typelevel/kind-projector) シンタックスの一部はScala 3の`-Ykind-projector` オプションによりサポートされています。

加えて、多くの場合`kind-projector`を不要にする次の機能があります。:
- [Type Lambdas](http://dotty.epfl.ch/docs/reference/new-types/type-lambdas.html)
- [Polymorphic Functions](http://dotty.epfl.ch/docs/reference/new-types/polymorphic-function-types.html)
- [Kind Polymorphism](http://dotty.epfl.ch/docs/reference/other-new-features/kind-polymorphism.html)

Kind Projectorの移行を学びたい方は [dedicated page](plugin-kind-projector.html)に。

## Runtime reflection

`scala-reflect` Scala3に移植されないでしょう、なぜならScala 3には存在しないScala 2コンパイラの内部展開をするからです。

もしあなたのプロジェクトが `scala-reflect`に依存している、または `Manifest`クラスのインスタンスを使用している場合、Scala 3コンパイラでコンパイルできません
この状況を改善する位は、Javaリフレクヨンまたは[Scala 3メタプログラミング機能](compatibility-metaprogramming.html)を使用して、コードの対応する部分を再実装してみてください。

`scala-reflect` がクラスパスに推移的に追加されている場合は、それをもたらす依存関係自体をアップグレードする必要があります。
