---
title: マクロライブラリのクロスビルド
type: section
description: このセクションはマクロライブラリのクロスビルド方法について示します
num: 11
previous-page: tutorial-sbt
next-page: tutorial-macro-mixing
language: ja
---

マクロライブラリは0から再実装しなければなりません。

開始する前に[sbtプロジェクトの移行](tutorial-sbt.html)チュートリアルに記載しているScala3移行について理解しておく必要があります。
このチュートリアルの目的としては、既存のScala 2.13のマクロライブラリをクロスビルドしScala 3とScala 2.13の両方で使用するためことです。

代替手法としてはマクロミクシングは[次のチュートリアル](tutorial-macro-mixing.html)で説明します。
両方のソリューションを読んで、ニーズに最適な手法を選択することをおすすめします。

## 導入

このチュートリアルを例証するために、最小限のマクロライブラリの定義を下記で考えます。

```scala
// build.sbt
lazy val example = project
  .in(file("example"))
  .settings(
    scalaVersion := "2.13.6",
    libraryDependencies ++= Seq(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value
    )
  )
```

```scala
// example/src/main/scala/location/Location.scala
package location

import scala.reflect.macros.blackbox.Context
import scala.language.experimental.macros

case class Location(path: String, line: Int)

object Macros {
  def location: Location = macro locationImpl

  private def locationImpl(c: Context): c.Tree =  {
    import c.universe._
    val location = typeOf[Location]
    val line = Literal(Constant(c.enclosingPosition.line))
    val path = Literal(Constant(c.enclosingPosition.source.path))
    q"new $location($path, $line)"
  }
}
```

ライブラリとのいくつかの類似点を認識する必要があります。:
一つ以上のマクロメソッド（この場合は`location`メソッド）はマクロコンテキストとこの`Context`からの`Tree`を返すことで実装されています。

sbtが提供する[クロスビルディング手法](https://www.scala-sbt.org/1.x/docs/Cross-Build.html)を使用して、このライブラリをScala 3ユーザが利用できるように吸うことができます。

主要なアイデアは、アーティファクトを2回ビルドし、2つのリリース物を公開することです。:
- `example_2.13` はScala 2.13ユーザ用
- `example_3` はScala 3ユーザ用

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

## 1. クロスビルディングの設定

Scala 3に `crossScalaVersions` のリストを追加することができます。:

```scala
crossScalaVersions := Seq("2.13.6", "3.0.0")
```

`scala-reflect` の依存関係はScala 3では役に立ちません。
次のような条件で条件付き削除を行います。:

```scala
// build.sbt
libraryDependencies ++= {
  CrossVersion.partialVersion(scalaVersion.value) match {
    case Some((2, 13)) => Seq(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value
    )
    case _ => Seq.empty
  }
}
```

sbtの再起動後、`++3.0.0`を動かすことで、Scala 3コンテキストにスイッチできます。
`++2.13.6`を実行するといつでもScala 2.13コンテキストに戻ることができます。

## 2. バージョン固有のソースディレクトリでコードを再配置

Scala 3でコンパイルしようとすると、あなたはいくつかの種類のエラーに遭遇するでしょう:

{% highlight text %}
sbt:example> ++3.0.0
sbt:example> example / compile
[error] -- Error: /example/src/main/scala/location/Location.scala:15:35 
[error] 15 |    val location = typeOf[Location]
[error]    |                                   ^
[error]    |                              No TypeTag available for location.Location
[error] -- Error: /example/src/main/scala/location/Location.scala:18:4 
[error] 18 |    q"new $location($path, $line)"
[error]    |    ^
[error]    |Scala 2 macro cannot be used in Dotty. See https://dotty.epfl.ch/docs/reference/dropped-features/macros.html
[error]    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

Scala 2の実装を維持しながらScala 3の代替手段を提供するために、バージョン固有のソースディレクトリでコードを再配置します。
Scala 3コンパイラでコンパイルできないすべてのコードは、`src/main/scala-2` フォルダに移動します。

> Scalaのバージョン固有のソースディレクトリは、デフォルトで利用できるsbt機能です。
> 詳細については[sbt documentation](https://www.scala-sbt.org/1.x/docs/Cross-Build.html)で学ぶことができます。

例として、`Location` クラスは`src/main/scala`フォルダに残りますが、`Macros` オブジェクトは`src/main/scala-2` フォルダに移動します。:

```scala
// example/src/main/scala/location/Location.scala
package location

case class Location(path: String, line: Int)
```

```scala
// example/src/main/scala-2/location/Macros.scala
package location

import scala.reflect.macros.blackbox.Context
import scala.language.experimental.macros

object Macros {
  def location: Location = macro locationImpl

  private def locationImpl(c: Context): c.Tree =  {
    import c.universe._
    val location = typeOf[Location]
    val line = Literal(Constant(c.enclosingPosition.line))
    val path = Literal(Constant(c.enclosingPosition.source.path))
    q"new $location($path, $line)"
  }
}
```

これで我々は`src/main/scala-3`フォルダにあるScala 3マクロ定義をそれぞれ初期化できます。
それらは、Scala 2.13の対応物と全く同じシグネチャーを持っている必要があります。

```scala
// example/src/main/scala-3/location/Macros.scala
package location

object Macros:
  def location: Location = ???
```

## 3. Scala 3マクロの実装

Scala2マクロをScala3に移植するための魔法の公式はありません。
新しい[メタプログラミング](compatibility-metaprogramming.html)機能について学ぶ必要があります。

最終的に、この実装を思いつきます。:

```scala
// example/src/main/scala-3/location/Macros.scala
package location

import scala.quoted.{Quotes, Expr}

object Macros:
  inline def location: Location = ${locationImpl}

  private def locationImpl(using quotes: Quotes): Expr[Location] =
    import quotes.reflect.Position
    val pos = Position.ofMacroExpansion
    val file = Expr(pos.sourceFile.jpath.toString)
    val line = Expr(pos.startLine + 1)
    '{new Location($file, $line)}
```

## 4. マクロの交差検証

いくつかのテストを加えることはマクロメソッドが両方のScalaのバージョンで動くかどうかの確認に重要です。

例として、一つのテストを追加します。

```scala
// example/src/test/scala/location/MacrosSpec.scala
package location

class MacrosSpec extends munit.FunSuite {
  test("location") {
    assertEquals(Macros.location.line, 5)
  }
}
```

あなたは両方のバージョンでテストを実行できるようになります。

{% highlight text %}
sbt:example> ++2.13.6
sbt:example> example / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
sbt:example> ++3.0.0
sbt:example> example / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
{% endhighlight %}

## さいごに

あなたのマクロプエオジェクトは現在以下のソースファイルが含まれているでしょう:
- `src/main/scala/*.scala`: クロスコンパイルクラス群
- `src/main/scala-2/*.scala`: Scala 2で実装されたマクロメソッド
- `src/main/scala-3/*.scala`: Scala 3で実装されたマクロメソッド
- `src/test/scala/*.scala`: テスト

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

これで、2つのリリースを作ることによってライブラリ公開の準備ができました:
- `example_2.13` はScala 2.13ユーザ用
- `example_3` はScala 3ユーザ用
