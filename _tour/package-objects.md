---
layout: tour
title: Package Objects
partof: scala-tour

num: 36
previous-page: packages-and-imports
---

# Package objects

Scala provides package objects as a convenient container shared across an entire package.

Package objects
can contain arbitrary definitions, not just variable and method definitions. For instance, they are frequently
used to hold package-wide type aliases and implicit conversions. Package objects can even inherit
Scala classes and traits.

By convention, the source code for a package object is usually put in a source file named `package.scala`.

Each package is allowed to have one package object. Any definitions placed in a package object are considered
members of the package itself.

See example below. Assume first a class `Fruit` and three `Fruit` objects in a package
`gardening.fruits`:

```
// in file gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

Now assume you want to place a variable `planted` and a method `showFruit` directly into package `gardening.fruits`.
Here's how this is done:

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

As an example of how the use site looks, the following object `PrintPlanted` imports `planted` and `showFruit` in exactly the same
way it imports class `Fruit`, using a wildcard import on package gardening.fruits:

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

Package objects are like other objects, which means you can use inheritance for building them. For example, one might mix in a couple of traits:

```
package object fruits extends FruitAliases with FruitHelpers {
  // helpers and variables follows here
}
```
