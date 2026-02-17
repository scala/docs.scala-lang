---
title: Cross-Building a Macro Library
type: section
description: This section shows how to cross-build a macro library
num: 13
previous-page: tutorial-sbt
next-page: tutorial-macro-mixing
---

Macro libraries must be re-implemented from the ground-up.

Before starting you should be familiar with the Scala 3 migration as described in the [Porting an sbt Project](tutorial-sbt.html) tutorial.
The purpose of the current tutorial is to cross-build an existing Scala 2.13 macro library so that it becomes available in both Scala 3 and Scala 2.13.

An alternative solution called *Mixing Macros* is explained in the [next tutorial](tutorial-macro-mixing.html).
You are encouraged to read both solutions to choose the technique that is best suited for your needs.

## Introduction

In order to exemplify this tutorial, we will consider the minimal macro library defined below.

```scala
// build.sbt
lazy val example = project
  .in(file("example"))
  .settings(
    scalaVersion := "2.13.11",
    libraryDependencies ++= Seq(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value
    )
  )
```

{% tabs scala-2-location %}
{% tab 'Scala 2 Only' %}
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
{% endtab %}
{% endtabs %}

You should recognize some similarities with your library:
one or more macro methods, in our case the `location` method, are implemented by consuming a macro `Context` and returning a `Tree` from this context.

We can make this library available for Scala 3 users by using the [Cross Building](https://www.scala-sbt.org/1.x/docs/Cross-Build.html) technique provided by sbt.

The main idea is to build the artifact twice and to publish two releases:
- `example_2.13` for Scala 2.13 users
- `example_3` for Scala 3 users

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

## 1. Set cross-building up

You can add Scala 3 to the list of `crossScalaVersions` of your project:

```scala
crossScalaVersions := Seq("2.13.11", "3.3.1")
```

The `scala-reflect` dependency won't be useful in Scala 3.
Remove it conditionally with something like:

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

After reloading sbt, you can switch to the Scala 3 context by running `++3.3.1`.
At any point you can go back to the Scala 2.13 context by running `++2.13.11`.

## 2. Rearrange the code in version-specific source directories

If you try to compile with Scala 3 you should see some errors of the same kind as:

{% highlight text %}
sbt:example> ++3.3.1
sbt:example> example / compile
[error] -- Error: /example/src/main/scala/location/Location.scala:15:35
[error] 15 |    val location = typeOf[Location]
[error]    |                                   ^
[error]    |                              No TypeTag available for location.Location
[error] -- Error: /example/src/main/scala/location/Location.scala:18:4
[error] 18 |    q"new $location($path, $line)"
[error]    |    ^
[error]    |Scala 2 macro cannot be used in Dotty. See https://nightly.scala-lang.org/docs/reference/dropped-features/macros.html
[error]    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

To provide a Scala 3 alternative while preserving the Scala 2 implementation, we are going to rearrange the code in version-specific source directories.
All the code that cannot be compiled by the Scala 3 compiler goes to the `src/main/scala-2` folder.

> Scala version-specific source directories is an sbt feature that is available by default.
> Learn more about it in the [sbt documentation](https://www.scala-sbt.org/1.x/docs/Cross-Build.html).

In our example, the `Location` class stays in the `src/main/scala` folder but the `Macros` object is moved to the `src/main/scala-2` folder:

{% tabs shared-location %}
{% tab 'Scala 2 and 3' %}
```scala
// example/src/main/scala/location/Location.scala
package location

case class Location(path: String, line: Int)
```
{% endtab %}
{% endtabs %}

{% tabs scala-2-location_2 %}
{% tab 'Scala 2 Only' %}
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
{% endtab %}
{% endtabs %}

Now we can initialize each of our Scala 3 macro definitions in the `src/main/scala-3` folder.
They must have the exact same signature than their Scala 2.13 counterparts.

{% tabs scala-3-location_1 %}
{% tab 'Scala 3 Only' %}
```scala
// example/src/main/scala-3/location/Macros.scala
package location

object Macros:
  inline def location: Location = ???
```
{% endtab %}
{% endtabs %}

## 3. Implement the Scala 3 macro

There is no magic formula to port a Scala 2 macro into Scala 3.
One needs to learn about the new [Metaprogramming](compatibility-metaprogramming.html) features.

We eventually come up with this implementation:

{% tabs scala-3-location_2 %}
{% tab 'Scala 3 Only' %}
```scala
// example/src/main/scala-3/location/Macros.scala
package location

import scala.quoted.{Quotes, Expr}

object Macros:
  inline def location: Location = ${locationImpl}

  private def locationImpl(using quotes: Quotes): Expr[Location] =
    import quotes.reflect.Position
    val pos = Position.ofMacroExpansion
    val file = Expr(pos.sourceFile.path.toString)
    val line = Expr(pos.startLine + 1)
    '{new Location($file, $line)}
```
{% endtab %}
{% endtabs %}

## 4. Cross-validate the macro

Adding some tests is important to check that the macro method works the same in both Scala versions.

In our example, we add a single test.

{% tabs shared-test %}
{% tab 'Scala 2 and 3' %}
```scala
// example/src/test/scala/location/MacrosSpec.scala
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
sbt:example> ++2.13.11
sbt:example> example / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
sbt:example> ++3.3.1
sbt:example> example / test
location.MacrosSpec:
  + location
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
[success]
{% endhighlight %}

## Final overview

Your macro project should now contain the following source files:
- `src/main/scala/*.scala`: Cross-compatible classes
- `src/main/scala-2/*.scala`: The Scala 2 implementation of the macro methods
- `src/main/scala-3/*.scala`: The Scala 3 implementation of the macro methods
- `src/test/scala/*.scala`: Common tests

![Cross-building Architecture](/resources/images/scala3-migration/tutorial-macro-cross-building.svg)

You are now ready to publish your library by creating two releases:
- `example_2.13` for Scala 2.13 users
- `example_3` for Scala 3 users
