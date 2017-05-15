---

title: Anonymous Function Syntax

disqus: true
layout: inner-page-no-masthead

tutorial: scala-tour
categories: tour
num: 7
next-page: higher-order-functions
previous-page: mixin-class-composition
---

Scala provides a relatively lightweight syntax for defining anonymous functions. The following expression creates a successor function for integers:

```tut
(x: Int) => x + 1
```

This is a shorthand for the following anonymous class definition:

```tut
new Function1[Int, Int] {
  def apply(x: Int): Int = x + 1
}
```

It is also possible to define functions with multiple parameters:

```tut
(x: Int, y: Int) => "(" + x + ", " + y + ")"
```

or with no parameter:

```tut
() => { System.getProperty("user.dir") }
```

There is also a very lightweight way to write function types. Here are the types of the three functions defined above:

```
Int => Int
(Int, Int) => String
() => String
```

This syntax is a shorthand for the following types:

```
Function1[Int, Int]
Function2[Int, Int, String]
Function0[String]
```

The following example shows how to use anonymous function of the beginning of this page

```tut
object AnonymousFunction {

  /**
   * Method to increment an integer by one.
   */
  val plusOne = (x: Int) => x + 1

  /**
   * Main method
   * @param args application arguments
   */
  def main(args: Array[String]) {

    println(plusOne(0)) // Prints: 1

  }
}
```
