---
title: Toplevel Definitions
type: section
description: This page provides an introduction to top-level definitions in Scala 3
num: 15
previous-page: taste-contextual-abstractions
next-page: taste-summary
---


In Scala 3, all kinds of definitions can be written at the “top level” of your source code files.
For instance, you can create a file named _MyCoolApp.scala_ and put these contents into it:

```scala
import scala.collection.mutable.ArrayBuffer

enum Topping:
  case Cheese, Pepperoni, Mushrooms

import Topping.*
class Pizza:
  val toppings = ArrayBuffer[Topping]()

val p = Pizza()

extension (s: String)
  def capitalizeAllWords = s.split(" ").map(_.capitalize).mkString(" ")

val hwUpper = "hello, world".capitalizeAllWords

type Money = BigDecimal

// more definitions here as desired ...

@main def myApp =
  p.toppings += Cheese
  println("show me the code".capitalizeAllWords)
```

As shown, there’s no need to put those definitions inside a `package`, `class`, or other construct.


## Replaces package objects

If you’re familiar with Scala 2, this approach replaces _package objects_.
But while being much easier to use, they work similarly: When you place a definition in a package named _foo_, you can then access that definition under all other packages under _foo_, such as within the _foo.bar_ package in this example:

```scala
package foo {
  def double(i: Int) = i * 2
}

package foo {
  package bar {
    @main def fooBarMain =
      println(s"${double(1)}")   // this works
  }
}
```

Curly braces are used in this example to put an emphasis on the package nesting.

The benefit of this approach is that you can place definitions under a package named _com.acme.myapp_, and then those definitions can be referenced within _com.acme.myapp.model_, _com.acme.myapp.controller_, etc.


