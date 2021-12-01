---
title: マクロライブラリのクロスビルド
type: section
description: このセクションはマクロライブラリのクロスビルド方法について示します
num: 11
previous-page: tutorial-sbt
next-page: tutorial-macro-mixing
language: ja
---

マクロライブラリはゼロから再実装しなければならない。

開始する前に[sbtプロジェクトの移行](tutorial-sbt.html)チュートリアルに記載している Scala3 移行について理解しておく必要がある。
このチュートリアルの目的は、既存の Scala 2.13 のマクロライブラリをクロスビルドし Scala 3 と Scala 2.13 の両方で使用することである。

代替手法としてはマクロミクシングは[次のチュートリアル](tutorial-macro-mixing.html)で説明する。
両方の代替手法を読み、必要に合わせて最適な手法を選択することをおすすめする。

## 導入

このチュートリアルを例証するために、最小限のマクロライブラリの定義を下記に示す。

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

ライブラリとのいくつかの類似点を認識する必要がある:
例示したマクロメソッド（この場合は `location` メソッド）はマクロコンテキストを引数に、`Context` からの `Tree` を返すように実装されている。

sbt が提供する[クロスビルディング手法](https://www.scala-sbt.org/1.x/docs/Cross-Build.html)を使用して、このライブラリを Scala 3 ユーザが利用できるように扱うことができる。

主なアイデアとして、アーティファクトを2回ビルドし、2つのリリース物を公開することです。:

- `example_2.13` は Scala 2.13 ユーザ用
- `example_3` は Scala 3 ユーザ用

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

## 1. クロスビルディングの設定

Scala 3 に `crossScalaVersions` のリストを追加することができる:

```scala
crossScalaVersions := Seq("2.13.6", "3.0.0")
```

`scala-reflect` の依存関係は Scala 3 では役に立たない。
次のような条件で条件付き削除を行う:

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

sbt の再起動後、`++3.0.0` を動かすことで、Scala 3 コンテキストにスイッチできる。
`++2.13.6` を実行するといつでも Scala 2.13 コンテキストに戻ることができる。

## 2. バージョン固有のソースディレクトリでコードを再配置

Scala 3 でコンパイルしようとすると、いくつかの種類のエラーに遭遇するだろう:

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

Scala 2 の実装を維持しながら Scala 3 への代替手段を提供するために、バージョン固有のソースディレクトリでコードを再配置する。
Scala 3 コンパイラでコンパイルできないすべてのコードは、`src/main/scala-2` フォルダに移動する。

> Scala のバージョン固有のソースディレクトリは、デフォルトで利用できるsbt 機能だ。
> 詳細については[sbt documentation](https://www.scala-sbt.org/1.x/docs/Cross-Build.html)で学ぶことができる。

例では、`Location` クラスは `src/main/scala` フォルダに残るが、`Macros` オブジェクトは `src/main/scala-2` フォルダに移動する:

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

これで `src/main/scala-3` フォルダにある Scala 3 マクロ定義をそれぞれ初期化できる。
ただし、Scala 2.13 の対応物と全く同じシグネチャーを持っている必要がある。

```scala
// example/src/main/scala-3/location/Macros.scala
package location

object Macros:
  def location: Location = ???
```

## 3. Scala 3 マクロの実装

Scala 2 マクロを Scala 3 に移植するための魔法の公式は存在しない。
新しい[メタプログラミング](compatibility-metaprogramming.html)機能について学ぶ必要がある。

最終的に、この実装を思いつくとする:

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

いくつかのテストを加えることはマクロメソッドが両方の Scala のバージョンで動くかどうかの確認に重要だ。

例として、一つのテストを追加する。

```scala
// example/src/test/scala/location/MacrosSpec.scala
package location

class MacrosSpec extends munit.FunSuite {
  test("location") {
    assertEquals(Macros.location.line, 5)
  }
}
```

これで両方のバージョンでテストを実行できるようになる。

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

あなたのプロジェクトは現在以下のソースファイルが含まれているだろう:
- `src/main/scala/*.scala`: クロスコンパイルクラス群
- `src/main/scala-2/*.scala`: Scala 2 で実装されたマクロメソッド
- `src/main/scala-3/*.scala`: Scala 3 で実装されたマクロメソッド
- `src/test/scala/*.scala`: テスト

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

これで、2つのリリース物を作ることにより、ライブラリ公開の準備ができた:

- `example_2.13` はScala 2.13ユーザ用
- `example_3` はScala 3ユーザ用
