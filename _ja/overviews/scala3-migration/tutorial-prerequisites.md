---
title: 前提条件
type: section
description: このセクションは Scala 3 への移行の前提条件について詳細化します
num: 9
previous-page: tutorial-intro
next-page: tutorial-sbt
language: ja
---

[互換性リファレンス](compatibility-intro.html)のページで示したように、Scala 3 への移行に関しては Scala 2.13 と Scala 3 の相互互換性のおかげで容易だ。

しかし、Scala 3 移植を始める前にかならず確認しなければならない Scala 2.13 プロジェクトの前提条件がある:

- Scala 3 にまだ移植されていないマクロライブラリに依存してはならない
- Scala 3 に同等のものがないコンパイラプラグインを使用してはならない
- `scala-reflect` に依存してはならない

次の段落では、これらの前提条件を確認する方法と、満たされていない場合の対処方法について説明する。

移植作業を続ける準備ができたら[sbt移行チュートリアル](tutorial-sbt.html)に飛ぶことができる。

## マクロの依存

マクロライブラリは Scala のライブラリでマクロメソッドを公開している。

それらのライブラリは Scala 2 で幅広く使われている。
例えば:

- [lightbend/scala-logging](https://index.scala-lang.org/lightbend/scala-logging)
- [milessabin/shapeless](https://index.scala-lang.org/milessabin/shapeless)
- [playframework/play-json](https://index.scala-lang.org/playframework/play-json)
- [scalatest/scalatest](https://index.scala-lang.org/scalatest/scalatest)

しかし Scala 3 コンパイラは Scala 2.13 のマクロを展開することができない。
だから、Scala3 に移行する前に、移植されていないマクロライブラリに依存していないかを確認する必要がある。

多くのマクロの移行状態を[Scala Macro Libraries](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html) ページで確認することができる。
幸いなことに、たくさんのライブラリはこの行を読むまでに移植されているだろう。

プロジェクト内のマクロの依存ごとに、クロスビルドバージョン、即ち Scala 2.13 と Scala 3 の両方で使用可能なバージョンにアップグレードする必要がある。

いくつか例を上げてみる。

`"scalatest" %% "scalatest" % "3.0.9"` への依存関係は、次の理由でアップグレードする必要がある:

- `scalatest` API は一部のマクロ定義がベースになっている。
- `3.0.9` バージョンは Scala 3 用に公開されていない。

`3.2.7` までバージョンアップグレードする必要があり、このバージョンでは、Scala 2.13 と Scala 3 の両方で公開されている。

```scala
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.7"
```

## コンパイラプラグイン

Scala 2 のコンパイラプラグインは Scala 3 との互換性がない。

コンパイラプラグインは一般的に `build.sbt` ファイルに設定されていて一つにまとまっている:

```scala
// build.sbt
libraryDependencies +=
  compilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)

addCompilerPlugin("org.typelevel" %% "kind-projector" % "0.11.0" cross CrossVersion.full)
```

一部のコンパイラプラグインは自動的に sbt プラグインによって追加されるだろう。

自身のプロジェクトのコンパイラオブションを確認することで設定されているプラグインを見つけることが可能だろう。

{% highlight text %}
sbt:example> show example / Compile / scalacOptions
[info] * -Xplugin:target/compiler_plugins/wartremover_2.13.6-2.4.15.jar
[info] * -Xplugin:target/compiler_plugins/semanticdb-scalac_2.13.6-4.4.18.jar
[info] * -Yrangepos
[info] * -P:semanticdb:targetroot:/example/target/scala-2.13/meta
{% endhighlight %}

上記の例では、wartremover と semanticdb の2つのコンパイラプラグインが使用されている。
これらのプラグインごとに、代替方法があることを確認するか、無効にする必要がある。

最もよく使用されるコンパイラプラグインの代替方法を以下に示す。

### SemanticDB

[SemanticDB](https://scalameta.org/docs/semanticdb/guide.html) は現在 Scala 3 コンパイラに同梱されている
:

- `-Ysemanticdb` オプションは semanticDB ファイルを生成する。
- `-semanticdb-target` オプションは semanticDB ファイルの出力ディレクトリを指定できる。

sbt は `semanticdbEnabled := true` という単一設定で、semanticDB の設定を自動的に構成する。

### Scala.js

Scala3 上での [Scala.js](https://www.scala-js.org/) コンパイルはコンパイラプラグインに依存していない。

Scala.js プロジェクトをコンパイルするには `sbt-scalajs` プラグインバージョン `1.5.0` 以上が必要である。

```scala
// project/plugins.sbt
addSbtPlugin("org.scala-js" % "sbt-scalajs" % "1.5.0")
```

### Scala Native

Scala 3 はまだ[Scala Native](https://scala-native.readthedocs.io/en/latest/)をサポートしていない。

もし Scala Native がクロスビルドできれば、Scala3 移植は可能だ。
しかし、まだ Native プラットフォーム用にコンパイルはできない。

### Kind Projector

[the Kind Projector](https://github.com/typelevel/kind-projector) 構文の一部は Scala 3 の `-Ykind-projector`  オプションによりサポートされている。

加えて、多くの場合で `kind-projector` を不要にする機能がある:

- [Type Lambdas](http://dotty.epfl.ch/docs/reference/new-types/type-lambdas.html)
- [Polymorphic Functions](http://dotty.epfl.ch/docs/reference/new-types/polymorphic-function-types.html)
- [Kind Polymorphism](http://dotty.epfl.ch/docs/reference/other-new-features/kind-polymorphism.html)

Kind Projector の移行について学びたい方は [dedicated page](plugin-kind-projector.html)に示されている。

## Runtime reflection
`scala-reflect` は Scala3 に移植されないだろう。なぜなら Scala 3 には存在しない Scala 2 コンパイラの内部展開があるからだ。

もしプロジェクトが `scala-reflect` に依存している、または `Manifest` クラスのインスタンスを使用している場合、Scala 3 コンパイラではコンパイルできない。
この状況を打破するには、Java リフレクションまたは[Scala 3メタプログラミング機能](compatibility-metaprogramming.html)を使用して、再実装してください。

`scala-reflect` がクラスパスに推移的に追加されている場合は、それらの依存関係自体もアップグレードする必要がある。
