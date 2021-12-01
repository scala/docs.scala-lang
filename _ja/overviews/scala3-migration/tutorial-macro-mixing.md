---
title: Scala 2.13 と Scala 3 マクロの mixing
type: section
description: このセクションはScala 2.13とScala 3マクロの単一アーティファクトでの mixing について示します
num: 12
previous-page: tutorial-macro-mixing
next-page: tooling-syntax-rewriting
language: ja
---

このチュートリアルでは、Scala 2.13 と Scala 3 マクロを単一アーティファクトで mixing する方法を見せる。

この手法を用いて、新しい Scala 3 マクロライブラリを作り、それをScala 2.13 ユーザでも利用可能にする。
それだけでなく、既存の Scala 2.13 マクロライブラリも Scala 3 に移植することは可能だが、その場合この手法よりクロスビルドのほうが簡単だ。

## 導入

Scala 2.13 コンパイラは Sala 2.13 マクロを展開することができ、逆に、Scala 3 コンパイラは Scala 3 マクロを展開することができる。
mixing macro のアイデアは単一アーティファクトにある両方のマクロをパッケージ化し、マクロ展開のフェーズでコンパイラーに2つから選択させることだ。

これは Scala 3 だけ可能で、なぜなら Scala 3 のコンパイラは Scala 2 と Scala 3 の両方の定義を読むことができるからだ。

以下のコードスケルトンで実際に考えてみよう:

```scala
// example/src/main/scala/location/Location.scala
package location

case class Location(path: String, line: Int)

object Macros:
  def location: Location = macro ???
  inline def location: Location = ${ ??? }
```

見ての通り、`location` マクロの定義は2つある:

- `def location: Location = macro ???` は Scala 2.13 マクロ定義
- `inline def location: Location = ${ ??? }` は Scala 3 マクロ定義

`location` はオーバーロードされたメソッドではない。なぜなら2つのシグネチャーは厳密には同一だからだ。
これは非常に驚くべきことだ！
コンパイラは同じ名前とシグネチャーを持つ2つのメソッドをどのように受け入れるのだろうか？

現状のまとめとしては、最初の定義は Scala 2.13 のみであり、2番目の定義は Scala 3 のみであるということだ。

## 1. Scala 3 マクロの実装

Scala 3 マクロ実装を定義の横に配置できる。

```scala
package location

import scala.quoted.{Quotes, Expr}

case class Location(path: String, line: Int)

object Macros:
  def location: Location = macro ???
  inline def location: Location = ${locationImpl}

  private def locationImpl(using quotes: Quotes): Expr[Location] =
    import quotes.reflect.Position
    val file = Expr(Position.ofMacroExpansion.sourceFile.jpath.toString)
    val line = Expr(Position.ofMacroExpansion.startLine + 1)
    '{new Location($file, $line)}
```

## 2. Scala 2 マクロの実装

Scala 3 コンパイラは、ダブルクォートや reification が含まれていない場合、Scala 2 マクロ実装のコンパイルは可能だ。

たとえば、このコードは Scala 3 でコンパイルされるため、Scala 3 の実装と一緒に配置できる。

```scala
import scala.reflect.macros.blackbox.Context

def locationImpl(c: Context): c.Tree =  {
  import c.universe._
  val line = Literal(Constant(c.enclosingPosition.line))
  val path = Literal(Constant(c.enclosingPosition.source.path))
  New(c.mirror.staticClass(classOf[Location].getName()), path, line)
}
```

しかしながら、多くのケースで Scala 2.13 マクロ実装を Scala 2.13サブモジュールに移動しなければならないだろう。

```scala
// build.sbt

lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.0.0"
  )
  .dependsOn(`example-compat`)

lazy val `example-compat` = project.in(file("example-compat"))
  .settings(
    scalaVersion := "2.13.6",
    libraryDependency += "org.scala-lang" % "scala-reflect" % scalaVersion.value
  )
```

この例の、`example` に関して、Scala 3 でコンパイルされたメインライブラリは、Scala 2.13でコンパイルされた `example-compat` に依存している。

このような場合、Scala 2 マクロの実装を `example-compat` にいれて、ダブルクォートを使用できる。

```scala
package location

import scala.reflect.macros.blackbox.Context
import scala.language.experimental.macros

case class Location(path: String, line: Int)

object Scala2MacrosCompat {
  private[location] def locationImpl(c: Context): c.Tree =  {
    import c.universe._
    val location = typeOf[Location]
    val line = Literal(Constant(c.enclosingPosition.line))
    val path = Literal(Constant(c.enclosingPosition.source.path))
    q"new $location($path, $line)"
  }
}
```

`Location` クラスを下流に移動させる必要があることに注意してください。

## 3. マクロの交差検証

いくつかのテストを加えることはマクロメソッドが両方の Scala のバージョンで動くかどうかの確認に重要である。

Scala 2.13 と Scala 3 で実行したいので、クロスビルドモジュールを作る:

```scala
// build.sbt
lazy val `example-test` = project.in(file("example-test"))
  .settings(
    scalaVersion := "3.0.0",
    crossScalaVersions := Seq("3.0.0", "2.13.6"),
    scalacOptions ++= {
      CrossVersion.partialVersion(scalaVersion.value) match {
        case Some((2, 13)) => Seq("-Ytasty-reader")
        case _ => Seq.empty
      }
    },
    libraryDependencies += "org.scalameta" %% "munit" % "0.7.26" % Test
  )
  .dependsOn(example)
```

> `-Ytasty-reader` は Scala 3 アーティファクトを消費するために Scala 2.13 上で必要だ

例えば、テストは次のようになる:

```scala
// example-test/src/test/scala/location/MacrosSpec.scala
package location

class MacrosSpec extends munit.FunSuite {
  test("location") {
    assertEquals(Macros.location.line, 5)
  }
}
```

これで両方のバージョンでテスト可能のはずだ。

{% highlight text %}
sbt:example> ++2.13.6
sbt:example> example-test / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
sbt:example> ++3.0.0
sbt:example> example-test / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
{% endhighlight %}

## さいごに

現在のライブラリの構成である:

-  メインの Scala 3 モジュールは Scala 3 マクロ実装と mixing したマクロ定義が含まれている。
-  Scala 2.13 の互換性のあるモジュールは Scala 2.13 マクロ実装を含んでいる。
これは、コンパイラのマクロ展開フェーズで Scala 2.13 により消費されるだろう。

![Mixing-macros Architecture](/resources/images/scala3-migration/tutorial-macro-mixing.svg)

これでライブラリを公開する準備ができた。

Scala 3 プロジェクトで利用可能であり、次の設定の Scala 2.13 プロジェクトでも利用可能だ:

```scala
scalaVersion := "2.13.6"
libraryDependencies += ("org" %% "example" % "x.y.z").cross(CrossVersion.for2_13Use3)
scalacOptions += "-Ytasty-reader"
```
