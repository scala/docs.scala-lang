---
layout: tour
title: Package Objects

discourse: true

partof: scala-tour

num: 35
previous-page: packages-and-imports
---

# Package Objects
Scala provides you package object as convenient container shared across the package. Package objects
can contain arbitrary definitions, not just variable and method definitions. For instance, they frequently
used to hold package-wide type aliases and implicit conversions. Package objects can even inherit
Scala classes and traits.

Package objects usually created as separate scala file in the package lavel - `package.scala`

Each package is allowed to have one package object. Any definitions placed in a package object are considered
members of the package itself.

See example below. Assume first a class `Fruit` and three `Fruit` objects in a package
`gardening.fruits`:

```
// in file gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object apple extends Fruit("Apple", "green")
object plum extends Fruit("Plum", "blue")
object banana extends Fruit("Banana", "yellow")
```
Now assume you want to place a variable planted and a method `showFruit` directly into package `gardening`.
Here's how this is done:
```
// in file gardening/fruits/package.scala
package gardening
package object fruits {
  val planted = List(apple, plum, banana)               
  def showFruit(fruit: Fruit) {
    println(fruit.name +"s are "+ fruit.color)
  }
}
```

Having the package Object above, any other code in the same package can import the method just like it would import
a class. For example, the following object `PrintPlanted` imports `planted` and `showFruit` in exactly the same
way it imports class `Fruit`, using a wildcard import on package gardening.fruits:

```
// in file PrintPlanted.scala
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]) {
    for (fruit: Fruit <- fruits.planted) {
      showFruit(fruit)
    }
  }
}
```
Having package object also helps reducing number of imports on client use.

Package objects are usual objects. That means you can use inheritance for building them (for exmple from traits):
```
package object fruits extends FruitAliases 
                          with FruitHelpers {
// helpers and variables follows here          
}
```
Note that method overloading doesn't work in package objects.

