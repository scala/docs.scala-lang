---
title: Scala 2.13とScala 3マクロのミクシング
type: section
description: このセクションはScala 2.13とScala 3マクロの単一アーティファクトでのミクシングについて示します
num: 12
previous-page: tutorial-macro-mixing
next-page: tooling-syntax-rewriting
language: ja
---

このチュートリアルでは、Scala 2.13とScala 3マクロを単一アーティファクトでミックスする方法をお見せします。

これを使用して、新しいScala 3マクロライブラリを作り、それをScala 2.13ユーザでも利用可能にすることができます。
それだけでなく、既存のScala 2.13マクロライブラリをScala 3に移植することも可能ですが、おそらくクロスビルドのほうが簡単です。

## 導入

Scala 2.13コンパイラはSala 2.13マクロを展開することができ、逆に、Scala 3コンパイラはScala 3マクロを展開することができます。
マクロミクシングのアイデアは単一アーティファクトにある両方のマクロをパッケージ化し、マクロ展開のフェーズでコンパイラーに2つから選択させることです。

これはScala 3だけ可能で、なぜならScala 3のコンパイラはScala 2とScala 3の両方とも定義を読むことができるからです。

以下のコードスケルトンで実際に考えてみましょう:

```scala
// example/src/main/scala/location/Location.scala
package location

case class Location(path: String, line: Int)

object Macros:
  def location: Location = macro ???
  inline def location: Location = ${ ??? }
```

見ての通り、`location` マクロの定義は2つあります。:
- `def location: Location = macro ???` はScala 2.13マクロ定義です
- `inline def location: Location = ${ ??? }` はScala 3マクロ定義です。

`location` はオーバーロードされたメソッドではないです、なぜなら2つのシグネチャーは厳密には同一だからです。
これは非常に驚くべきことです！
コンパイラは同じ名前とシグネチャーを持つ2つのメソッドをどのように受け入れるのでしょうか？

現状のまとめとしては、最初の定義はScala 2.13のみであり、2番目の定義はScala 3のみであるということです。

## 1. Scala　3マクロの実装

Scala3マクロ実装を定義の横に置くことができます。

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

## 2. Scala　2マクロの実装

Scala 3コンパイラは, ダブルクォートまたは、reificationが含まれていない場合、Scala 2マクロ実装はコンパイルできます

たとえば、このコードはScala 3でコンパイルされるため、Scala 3の実装と一緒に配置できます。
```scala
import scala.reflect.macros.blackbox.Context

def locationImpl(c: Context): c.Tree =  {
  import c.universe._
  val line = Literal(Constant(c.enclosingPosition.line))
  val path = Literal(Constant(c.enclosingPosition.source.path))
  New(c.mirror.staticClass(classOf[Location].getName()), path, line)
}
```

しかしながら、多くのケースであなたはScala 2.13マクロ実装をScala 2.13サブモジュールに移動しなければならないでしょう。

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

このような`example`では, この例では、Scala 3でコンパイルされたメインライブラリは、Scala 2.13でコンパイルされた`example-compat`に依存しています。

このような場合、Scala 2マクロの実装を`example-compat`にいれて、ダブルクォートを使用できます。

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

`Location`クラスを下流に移動させる必要があることに注意してください。

## 3. マクロの交差検証

いくつかのテストを加えることはマクロメソッドが両方のScalaのバージョンで動くかどうかの確認に重要です。

Scala 2.13とScala 3で実行したいので、クロスビルドモジュールを作ります。:

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

> `-Ytasty-reader`はScala 3アーティファクトを消費するためにScala 2.13上で必要です

例えば、テストは次のようになります。:
```scala
// example-test/src/test/scala/location/MacrosSpec.scala
package location

class MacrosSpec extends munit.FunSuite {
  test("location") {
    assertEquals(Macros.location.line, 5)
  }
}
```

これで両方のバージョンでテスト可能のはずです。

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

現在のライブラリの構成です:
-  メインのScala 3モジュールはScala 3マクロ実装とミクシングしたマクロ定義が含まれています。
-  Scala 2.13の互換性のあるモジュールはScala 2.13マクロ実装を含んでいます。
これは、コンパイラのマクロ展開フェーズでScala 2.13により消費されるでしょう

![Mixing-macros Architecture](/resources/images/scala3-migration/tutorial-macro-mixing.svg)

これでライブラリを公開する準備ができました。

Scala 3プロジェクトで利用可能ですし、または次の設定のScala 2.13プロジェクトでも利用できます。:

```scala
scalaVersion := "2.13.6"
libraryDependencies += ("org" %% "example" % "x.y.z").cross(CrossVersion.for2_13Use3)
scalacOptions += "-Ytasty-reader"
```
