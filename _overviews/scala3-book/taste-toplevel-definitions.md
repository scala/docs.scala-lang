---
title: Toplevel Definitions
type: section
description: This page provides an introduction to top-level definitions in Scala 3
num: 15
previous-page: taste-contextual-abstractions
next-page: taste-summary
---


In Scala 3, all kinds of definitions can be written at the “top level” of your source code files. For instance, you can create a file named *MyCoolApp.scala* and put these contents into it:

```scala
import scala.collection.mutable.ArrayBuffer

enum Topping:
  case Cheese, Pepperoni, Mushrooms

import Topping._
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

If you’re familiar with Scala 2, this approach replaces *package objects*. But while being much easier to use, they work similarly: When you place a definition in a package named *foo*, you can then access that definition under all other packages under *foo*, such as within the *foo.bar* package in this example:

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

The benefit of this approach is that you can place definitions under a package named *com.acme.myapp*, and then those definitions can be referenced within *com.acme.myapp.model*, *com.acme.myapp.controller*, etc.


