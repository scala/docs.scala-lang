---
layout: tour
title: Top Level Definitions in Packages
partof: scala-tour

num: 36
previous-page: packages-and-imports
---

Often, it is convenient to have definitions accessible across an entire package, and not need to invent a
name for a wrapper `object` to contain them.

{% tabs pkg-obj-vs-top-lvl_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_1 %}
Scala 2 provides _package objects_ as a convenient container shared across an entire package.

Package objects
can contain arbitrary definitions, not just variable and method definitions. For instance, they are frequently
used to hold package-wide type aliases and implicit conversions. Package objects can even inherit
Scala classes and traits.

> In a future version of Scala 3, package objects will be removed in favor of top level definitions.

By convention, the source code for a package object is usually put in a source file named `package.scala`.

Each package is allowed to have one package object. Any definitions placed in a package object are considered
members of the package itself.

{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_1 %}
In Scala 3, any kind of definition can be declared at the top level of a package. For example, classes, enums,
methods and variables.

Any definitions placed at the top level of a package are considered members of the package itself.

> In Scala 2, top-level method, type and variable definitions had to be wrapped in a **package object**.
> These are still usable in Scala 3 for backwards compatibility. You can see how they work by switching tabs.

{% endtab %}
{% endtabs %}

See example below. Assume first a class `Fruit` and three `Fruit` objects in a package
`gardening.fruits`:


{% tabs pkg-obj-vs-top-lvl_2 %}
{% tab 'Scala 2 and 3' for=pkg-obj-vs-top-lvl_2 %}
```
// in file gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```
{% endtab %}
{% endtabs %}

Now assume you want to place a variable `planted` and a method `showFruit` directly into package `gardening.fruits`.
Here's how this is done:

{% tabs pkg-obj-vs-top-lvl_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_3 %}

```
// in file gardening/fruits/package.scala
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```
{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_3 %}

```
// in file gardening/fruits/package.scala
package gardening.fruits

val planted = List(Apple, Plum, Banana)
def showFruit(fruit: Fruit): Unit =
  println(s"${fruit.name}s are ${fruit.color}")
```
{% endtab %}
{% endtabs %}

As an example of how to use this, the following program imports `planted` and `showFruit` in exactly the same
way it imports class `Fruit`, using a wildcard import on package `gardening.fruits`:

{% tabs pkg-obj-vs-top-lvl_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_4 %}
```
// in file PrintPlanted.scala
import gardening.fruits._

object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```
{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_4 %}
```
// in file printPlanted.scala
import gardening.fruits.*

@main def printPlanted(): Unit =
  for fruit <- planted do
    showFruit(fruit)
```
{% endtab %}
{% endtabs %}

### Aggregating Several Definitions at the Package Level

Often, your project may have several reusable definitions defined in various modules, that you
wish to aggregate at the top level of a package.

For example, some helper methods in the trait `FruitHelpers` and
some term/type aliases in trait `FruitAliases`. Here is how you can put all their definitions at the level of the `fruit`
package:

{% tabs pkg-obj-vs-top-lvl_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_5 %}

Package objects are like other objects, which means you can use inheritance for building them.
So here we mix in the helper traits as parents of the package object.

```
package gardening

// `fruits` instead inherits its members from its parents.
package object fruits extends FruitAliases with FruitHelpers
```
{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_5 %}

In Scala 3, it is preferred to use `export` to compose members from several objects into a single scope.
Here we define private objects that mix in the helper traits, then export their members at the top level:

```
package gardening.fruits

private object FruitAliases extends FruitAliases
private object FruitHelpers extends FruitHelpers

export FruitHelpers.*, FruitAliases.*
```
{% endtab %}
{% endtabs %}
