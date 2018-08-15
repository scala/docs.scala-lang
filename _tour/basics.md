---
layout: tour
title: Basics

discourse: true

partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala

redirect_from: "/tutorials/tour/basics.html"
---

In this page, we will cover basics of Scala.

## Trying Scala in the Browser

You can run Scala in your browser with ScalaFiddle.

1. Go to [https://scalafiddle.io](https://scalafiddle.io).
2. Paste `println("Hello, world!")` in the left pane.
3. Hit "Run" button. Output appears in the right pane.

This is an easy, zero-setup way to experiment with pieces of Scala code.

Many of the code examples in this documentation are also integrated with ScalaFiddle, so you
can directly experiment with them simply by clicking the Run-button.

## Expressions

Expressions are computable statements.
```
1 + 1
```
You can output results of expressions using `println`.

{% scalafiddle %}
```tut
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Values

You can name results of expressions with the `val` keyword.

```tut
val x = 1 + 1
println(x) // 2
```

Named results, such as `x` here, are called values. Referencing
a value does not re-compute it.

Values cannot be re-assigned.

```tut:fail
x = 3 // This does not compile.
```

Types of values can be inferred, but you can also explicitly state the type, like this:

```tut
val x: Int = 1 + 1
```

Notice how the type declaration `Int` comes after the identifier `x`. You also need a `:`.  

### Variables

Variables are like values, except you can re-assign them. You can define a variable with the `var` keyword.

```tut
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

As with values, you can explicitly state the type if you want:

```tut
var x: Int = 1 + 1
```


## Blocks

You can combine expressions by surrounding them with `{}`. We call this a block.

The result of the last expression in the block is the result of the overall block, too.

```tut
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Functions

Functions are expressions that take parameters.

You can define an anonymous function (i.e. no name) that returns a given integer plus one:

```tut
(x: Int) => x + 1
```

On the left of `=>` is a list of parameters. On the right is an expression involving the parameters.

You can also name functions.

{% scalafiddle %}
```tut
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Functions may take multiple parameters.

{% scalafiddle %}
```tut
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Or it can take no parameters.

```tut
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Methods

Methods look and behave very similar to functions, but there are a few key differences between them.

Methods are defined with the `def` keyword.  `def` is followed by a name, parameter lists, a return type, and a body.

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Notice how the return type is declared _after_ the parameter list and a colon `: Int`.

Methods can take multiple parameter lists.

{% scalafiddle %}
```tut
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

Or no parameter lists at all.

```tut
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

There are some other differences, but for now, you can think of them as something similar to functions.

Methods can have multi-line expressions as well.
```tut
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
```
The last expression in the body is the method's return value. (Scala does have a `return` keyword, but it's rarely used.)

## Classes

You can define classes with the `class` keyword followed by its name and constructor parameters.

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
The return type of the method `greet` is `Unit`, which says there's nothing meaningful to return. It's used similarly to `void` in Java and C. (A difference is that because every Scala expression must have some value, there is actually a singleton value of type Unit, written (). It carries no information.)

You can make an instance of a class with the `new` keyword.

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

We will cover classes in depth [later](classes.html).

## Case Classes

Scala has a special type of class called a "case" class.  By default, case classes are immutable and compared by value. You can define case classes with the `case class` keywords.

```tut
case class Point(x: Int, y: Int)
```

You can instantiate case classes without `new` keyword.

```tut
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

And they are compared by value.

```tut
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) and Point(2,2) are different.
```

There is a lot more to case classes that we'd like to introduce, and we are convinced you will fall in love with them! We will cover them in depth [later](case-classes.html).

## Objects

Objects are single instances of their own definitions. You can think of them as singletons of their own classes.

You can define objects with the `object` keyword.

```tut
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

You can access an object by referring to its name.

```tut
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

We will cover objects in depth [later](singleton-objects.html).

## Traits

Traits are types containing certain fields and methods.  Multiple traits can be combined.

You can define traits with `trait` keyword.

```tut
trait Greeter {
  def greet(name: String): Unit
}
```

Traits can also have default implementations.

{% scalafiddle %}
```tut
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

You can extend traits with the `extends` keyword and override an implementation with the `override` keyword.

```tut
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
{% endscalafiddle %}

Here, `DefaultGreeter` extends only a single trait, but it could extend multiple traits.

We will cover traits in depth [later](traits.html).

## Main Method

The main method is an entry point of a program.  The Java Virtual
Machine requires a main method to be named `main` and take one
argument, an array of strings.

Using an object, you can define a main method as follows:

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
