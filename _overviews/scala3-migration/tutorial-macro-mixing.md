---
title: Mixing Scala 2.13 and Scala 3 Macros
type: section
description: This section shows how to mix Scala 2.13 and Scala 3 macros in a single artifact
num: 14
previous-page: tutorial-macro-mixing
next-page: tooling-syntax-rewriting
---

This tutorial shows how to mix Scala 2.13 and Scala 3 macros in a single artifact.  This means that consumers can use `-Ytasty-reader` from Scala 2.13 code that uses your macros.

There are two main benefits of this:

1. Making a new or existing scala 3 macro library available for Scala 2.13 users without having to provide a separate 2.13 version
2. Allowing your macros to be usable in multi-project builds that are being upgraded module by module.

## Introduction

The Scala 2.13 compiler can only expand Scala 2.13 macros and, conversely, the Scala 3 compiler can only expand Scala 3 macros.
The idea of mixing macros is to package both macros in a single artifact, and let the compiler choose between the two during the macro expansion phase.

This is only possible in Scala 3, since the Scala 3 compiler can read both the Scala 3 and the Scala 2 definitions.

Let's start by considering the following code skeleton:

{% tabs scala-3-location_1 %}
{% tab 'Scala 3 Only' %}
```scala
// example/src/main/scala/location/Location.scala
package location

case class Location(path: String, line: Int)

object Macros:
  def location: Location = macro ???
  inline def location: Location = ${ ??? }
```
{% endtab %}
{% endtabs %}

As you can see the `location` macro is defined twice:
- `def location: Location = macro ???` is a Scala 2.13 macro definition
- `inline def location: Location = ${ ??? }` is a Scala 3 macro definition

`location` is not an overloaded method, since both signatures are strictly identical.
This is quite surprising!
How does the compiler accept two methods with the same name and signature?

The explanation is that it recognizes the first definition is for Scala 2.13 only and the second is for Scala 3 only.

## 1. Implement the Scala 3 macro

You can put the Scala 3 macro implementation alongside the definition.

{% tabs scala-3-location_2 %}
{% tab 'Scala 3 Only' %}
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
{% endtab %}
{% endtabs %}

## 2. Implement the Scala 2 macro

The Scala 3 compiler can compile a Scala 2 macro implementation if it contains no quasiquote or reification.

For instance this piece of code does compile with Scala 3, and so you can put it alongside the Scala 3 implementation.

{% tabs scala-2-and-3-location %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.reflect.macros.blackbox.Context

def locationImpl(c: Context): c.Tree =  {
  import c.universe._
  val line = Literal(Constant(c.enclosingPosition.line))
  val path = Literal(Constant(c.enclosingPosition.source.path))
  New(c.mirror.staticClass(classOf[Location].getName()), path, line)
}
```
{% endtab %}
{% endtabs %}

However, in many cases you will have to move the Scala 2.13 macro implementation in a Scala 2.13 submodule.

```scala
// build.sbt

lazy val example = project.in(file("example"))
  .settings(
    scalaVersion := "3.3.1"
  )
  .dependsOn(`example-compat`)

lazy val `example-compat` = project.in(file("example-compat"))
  .settings(
    scalaVersion := "2.13.12",
    libraryDependencies += "org.scala-lang" % "scala-reflect" % scalaVersion.value
  )
```

Here `example`, our main library compiled in Scala 3, depends on `example-compat` which is compiled in Scala 2.13.

In such a case we can put the Scala 2 macro implementation in `example-compat` and use quasiquotes.

{% tabs scala-2-location %}
{% tab 'Scala 2 Only' %}
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
{% endtab %}
{% endtabs %}

Note that we had to move the `Location` class downstream.

## 3. Cross-validate the macro

Adding some tests is important to check that the macro method works the same in both Scala versions.

Since we want to execute the tests in Scala 2.13 and Scala 3, we create a cross-built module on the top:

```scala
// build.sbt
lazy val `example-test` = project.in(file("example-test"))
  .settings(
    scalaVersion := "3.3.1",
    crossScalaVersions := Seq("3.3.1", "2.13.12"),
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

> `-Ytasty-reader` is needed in Scala 2.13 to consume Scala 3 artifacts

For instance the test can be:

{% tabs scala-2-and-3-test %}
{% tab 'Scala 2 and 3' %}
```scala
// example-test/src/test/scala/location/MacrosSpec.scala
package location

class MacrosSpec extends munit.FunSuite {
  test("location") {
    assertEquals(Macros.location.line, 5)
  }
}
```
{% endtab %}
{% endtabs %}

You should now be able to run the tests in both versions.

{% highlight text %}
sbt:example> ++2.13.12
sbt:example> example-test / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
sbt:example> ++3.3.1
sbt:example> example-test / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
{% endhighlight %}

## Final Overview

You library is now composed of:
-  The main Scala 3 module containing the mixed macro definitions and the Scala 3 macro implementation.
-  The Scala 2.13 compatibility module containing the Scala 2.13 macro implementation.
It will only be consumed in Scala 2.13 during the macro expansion phase of the compiler.

![Mixing-macros Architecture](/resources/images/scala3-migration/tutorial-macro-mixing.svg)

You are now ready to publish your library.

It can be used in Scala 3 projects, or in Scala 2.13 projects with these settings:

```scala
scalaVersion := "2.13.12"
libraryDependencies += ("org" %% "example" % "x.y.z").cross(CrossVersion.for2_13Use3)
scalacOptions += "-Ytasty-reader"
```
