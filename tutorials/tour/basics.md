---
layout: tutorial
title: Basics

disqus: true

tutorial: scala-tour
num: 2
next-page: unified-types
previous-page: tour-of-scala
---

In this page, we will cover basics of Scala.

## Trying Scala in the Browser

You can run Scala in your browser by using [ScalaFiddle](https://scalafiddle.io).

1. Go to https://scalafiddle.io.
2. Copy and paste `println("Hello, world!")` to the left pane.
3. Hit "Run" button and see it prints "Hello, world!" on the right pane.

It is a perfect way for anybody to experiment with a piece of Scala code anywhere, anytime!

## Expressions

Expressions are computable statements.

You can output results of expressions using the `println`.

```
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```

You can name the result of an expression by using the `val` keyword.

```
val x = 1 + 1
println(x) // 2
```

Named results are called values. For example, in above case, `x` is called a value. Values only hold results of expressions, so they will not re-compute expressions when referenced.

Values cannot be re-assigned.

```
val x = 1 + 1
x = 3 // This does not compile.
```

Types of values can be inferred, but you can also explicitly state types like below.

```
val x: Int = 1 + 1
```

You can create a single expression out of multiple statements by wrapping them with `{}`. When statements are wrapped with `{}`, the result of the last statement will be the result of the overall expression.

```
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Variables

Variables are similar to values except you can re-assign results they hold. You can define variables with the `var` keyword.

```
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x) // 3
```

Just like values, you can also explicitly state types of variables like below.

```
var x: Int = 1 + 1
```

## Functions

Functions are expressions with parameters.

You can define a function that returns a given integer + 1 like below.

```
(x: Int) => x + 1
```

Left hand side of `=>` is a list of parameters and right hand side of `=>` is an expression taking the parameters.

You can also name functions.

```
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```

Or it can take multiple parameters.

```
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```

Or it can take no parameters.

```
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

We will cover functions in depth [later](anonymous-function-syntax.md).

## Methods

Methods look and behave very similar to functions, but there are a few key differences between them.

Methods are defined like below with the `def` keyword followed by its name, a list of parameter groups, return type, and an expression.

```
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```

Methods cannot be named with the `val` or `var` keywords.

```
def add(x: Int, y: Int): Int = x + y
val add2 = add // This does not compile.
var add3 = add // This does not compile either.
```

Methods can take multiple parameter groups.

```
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```

Or no parameter groups at all.

```
def name: String = System.getProperty("name")
println("Hello, " + name + "!")
```

There are some other differences, but for now, you can think of them as something similar to functions.

## Classes

You can define classes with the `class` keyword followed by its name and constructor parameters.

```
class Greeter(prefix: String, postfix: String) {
  def greet(name: String): Unit = println(prefix + name + postfix)
}
```

You can instantiate classes with the `new` keyword.

```
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

We will cover classes in depth [later](classes.md).

## Case Classes

Scala has a special type of class called case class that's immutable and compared by value by default. You can define case classes with the `case class` keyword.

```
case class Point(x: Int, y: Int)
```

You can instantiate case classes without `new` keyword.

```
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

And they are compared by values.

```
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
}
// Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
}
// Point(1,2) and Point(2,2) are different.
```

There is a lot more to case classes that we'd like to introduce, and we are convinced you will fall in love with it! We will cover them in depth [later](case-classes.md).

## Objects

Objects are single instances of their own definitions. You can think of them as singletons of their own classes.

You can define objects with the `object` keyword.

```
object IdFactory {
  private var counter = 0

  def create(): Int = {
    counter += 1
    counter
  }
}
```

You can access objects by referring its name.

```
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

We will cover objects in depth [later](singleton-objects.md).

## Traits

Traits define specification of types as signature of fields and methods.

You can define traits with `trait` keyword.

```
trait Greeter {
  def greet(name: String): Unit
}
```

Traits can also have default implementations.

```
trait Greeter {
  def greet(name: String): Unit = println("Hello, " + name + "!")
}
```

You can extend traits with the `extends` keyword and override their implementations with the `override` keyword.

```
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```

We will cover traits in depth [later](traits.md).

## Main Method

Main method is an entry point of a program.

Using objects, you can define main methods like below.

```
object Main {
  def main(args: Array[String]): Unit = println("Hello, Scala developer!")
}
```
