---
layout: tour
title: Basics
partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala

redirect_from: "/tutorials/tour/basics.html"
---

In this page, we will cover the basics of Scala.

## Trying Scala in the Browser

You can run Scala in your browser with _Scastie_. This is an easy, zero-setup way to experiment with pieces of Scala code:

1. Go to [Scastie](https://scastie.scala-lang.org/).
2. Paste `println("Hello, world!")` in the left pane.
3. Click __Run__. The output appears in the right pane.

_Scastie_ is integrated with some of the code examples in this documentation; if you see a __Run__ button in a code example below, click it to directly experiment with the code.

## Expressions

Expressions are computable statements:

{% tabs expression %}
{% tab 'Scala 2 and 3' for=expression %}
```scala mdoc
1 + 1
```
{% endtab %}
{% endtabs %}

You can output the results of expressions using `println`:

{% tabs println %}
{% tab 'Scala 2 and 3' for=println %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endtab %}
{% endtabs %}

### Values

You can name the results of expressions using the `val` keyword:

{% tabs val %}
{% tab 'Scala 2 and 3' for=val %}
```scala mdoc
val x = 1 + 1
println(x) // 2
```
{% endtab %}
{% endtabs %}

Named results, such as `x` here, are called values. Referencing
a value does not re-compute it.

Values cannot be re-assigned:

{% tabs val-error %}
{% tab 'Scala 2 and 3' for=val-error %}
```scala mdoc:fail
x = 3 // This does not compile.
```
{% endtab %}
{% endtabs %}

The type of a value can be omitted and [inferred](https://docs.scala-lang.org/tour/type-inference.html), or it can be explicitly stated:

{% tabs type-inference %}
{% tab 'Scala 2 and 3' for=type-inference %}
```scala mdoc:nest
val x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}

Notice how the type declaration `Int` comes after the identifier `x`. You also need a `:`.

### Variables

Variables are like values, except you can re-assign them. You can define a variable with the `var` keyword.

{% tabs var %}
{% tab 'Scala 2 and 3' for=var %}
```scala mdoc:nest
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```
{% endtab %}
{% endtabs %}

As with values, the type of a variable can be omitted and [inferred](https://docs.scala-lang.org/tour/type-inference.html), or it can be explicitly stated:

{% tabs type-inference-2 %}
{% tab 'Scala 2 and 3' for=type-inference-2 %}
```scala mdoc:nest
var x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}


## Blocks

You can combine expressions by surrounding them with `{}`. We call this a block.

The result of the last expression in the block is the result of the overall block, too:

{% tabs blocks %}
{% tab 'Scala 2 and 3' for=blocks %}
```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```
{% endtab %}
{% endtabs %}

## Functions

Functions are expressions that have parameters, and take arguments.

You can define an anonymous function (i.e., a function that has no name) that returns a given integer plus one:

{% tabs anonymous-function %}
{% tab 'Scala 2 and 3' for=anonymous-function %}
```scala mdoc
(x: Int) => x + 1
```
{% endtab %}
{% endtabs %}

On the left of `=>` is a list of parameters. On the right is an expression involving the parameters.

You can also name functions:

{% tabs named-function %}
{% tab 'Scala 2 and 3' for=named-function %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endtab %}
{% endtabs %}

A function can have multiple parameters:

{% tabs multiple-parameters %}
{% tab 'Scala 2 and 3' for=multiple-parameters %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Or it can have no parameters at all:

{% tabs no-parameters %}
{% tab 'Scala 2 and 3' for=no-parameters %}
```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```
{% endtab %}
{% endtabs %}

## Methods

Methods look and behave very similar to functions, but there are a few key differences between them.

Methods are defined with the `def` keyword.  `def` is followed by a name, parameter list(s), a return type, and a body:

{% tabs method %}
{% tab 'Scala 2 and 3' for=method %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Notice how the return type `Int` is declared _after_ the parameter list and a `:`.

A method can take multiple parameter lists:

{% tabs multiple-parameter-lists %}
{% tab 'Scala 2 and 3' for=multiple-parameter-lists %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endtab %}
{% endtabs %}

Or no parameter lists at all:

{% tabs no-parameter-lists %}
{% tab 'Scala 2 and 3' for=no-parameter-lists %}
```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
{% endtab %}
{% endtabs %}

There are some other differences, but for now, you can think of methods as something similar to functions.

Methods can have multi-line expressions as well:

{% tabs get-square-string class=tabs-scala-version %}

{% tab 'Scala 2' for=get-square-string %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% tab 'Scala 3' for=get-square-string %}
```scala
def getSquareString(input: Double): String =
  val square = input * input
  square.toString

println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% endtabs %}

The last expression in the body is the method's return value. (Scala does have a `return` keyword, but it is rarely used.)

## Classes

You can define classes with the `class` keyword, followed by its name and constructor parameters:

{% tabs greeter-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-definition %}
```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-definition %}
```scala
class Greeter(prefix: String, suffix: String):
  def greet(name: String): Unit =
    println(prefix + name + suffix)
```
{% endtab %}

{% endtabs %}

The return type of the method `greet` is `Unit`, which signifies that there is nothing meaningful to return. It is used similarly to `void` in Java and C. (A difference is that, because every Scala expression must have some value, there is actually a singleton value of type Unit, written (). It carries no information.)

In Scala 2 you can make an instance of a class with the `new` keyword. In Scala 3, however, the `new` keyword is not needed:

{% tabs greeter-usage class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-usage %}
```scala mdoc:nest
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% tab 'Scala 3' for=greeter-usage %}
```scala
val greeter = Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% endtabs %}

We will cover classes in depth [later](classes.html).

## Case Classes

Scala has a special type of class called a "case" class. By default, instances of case classes are immutable, and they are compared by value (unlike classes, whose instances are compared by reference). This makes them additionally useful for [pattern matching](https://docs.scala-lang.org/tour/pattern-matching.html#matching-on-case-classes).

You can define case classes with the `case class` keywords:

{% tabs case-class-definition %}
{% tab 'Scala 2 and 3' for=case-class-definition %}
```scala mdoc
case class Point(x: Int, y: Int)
```
{% endtab %}
{% endtabs %}

You can instantiate case classes without the `new` keyword:

{% tabs case-class-creation %}
{% tab 'Scala 2 and 3' for=case-class-creation %}
```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```
{% endtab %}
{% endtabs %}

Instances of case classes are compared by value, not by reference:

{% tabs compare-case-class-equality class=tabs-scala-version %}

{% tab 'Scala 2' for=compare-case-class-equality %}
```scala mdoc
if (point == anotherPoint) {
  println(s"$point and $anotherPoint are the same.")
} else {
  println(s"$point and $anotherPoint are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(s"$point and $yetAnotherPoint are the same.")
} else {
  println(s"$point and $yetAnotherPoint are different.")
} // Point(1,2) and Point(2,2) are different.
```
{% endtab %}

{% tab 'Scala 3' for=compare-case-class-equality %}
```scala
if point == anotherPoint then
  println(s"$point and $anotherPoint are the same.")
else
  println(s"$point and $anotherPoint are different.")
// ==> Point(1,2) and Point(1,2) are the same.

if point == yetAnotherPoint then
  println(s"$point and $yetAnotherPoint are the same.")
else
  println(s"$point and $yetAnotherPoint are different.")
// ==> Point(1,2) and Point(2,2) are different.
```
{% endtab %}

{% endtabs %}

There is a lot more to case classes that we would like to introduce, and we are convinced you will fall in love with them! We will cover them in depth [later](case-classes.html).

## Objects

Objects are single instances of their own definitions. You can think of them as singletons of their own classes.

You can define objects with the `object` keyword:

{% tabs id-factory-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=id-factory-definition %}
```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=id-factory-definition %}
```scala
object IdFactory:
  private var counter = 0
  def create(): Int =
    counter += 1
    counter
```
{% endtab %}

{% endtabs %}

You can access an object by referring to its name:

{% tabs id-factory-usage %}
{% tab 'Scala 2 and 3' for=id-factory-usage %}
```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```
{% endtab %}
{% endtabs %}

We will cover objects in depth [later](singleton-objects.html).

## Traits

Traits are abstract data types containing certain fields and methods. In Scala inheritance, a class can only extend one other class, but it can extend multiple traits.

You can define traits with the `trait` keyword:

{% tabs greeter-trait-def class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def %}
```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def %}
```scala
trait Greeter:
  def greet(name: String): Unit
```
{% endtab %}

{% endtabs %}

Traits can also have default implementations:

{% tabs greeter-trait-def-impl class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def-impl %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def-impl %}
```scala
trait Greeter:
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
```
{% endtab %}

{% endtabs %}

You can extend traits with the `extends` keyword and override an implementation with the `override` keyword:

{% tabs greeter-implementations class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-implementations %}
```scala mdoc
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
{% endtab %}

{% tab 'Scala 3' for=greeter-implementations %}
```scala
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter:
  override def greet(name: String): Unit =
    println(prefix + name + postfix)

val greeter = DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endtab %}

{% endtabs %}

Here, `DefaultGreeter` extends only one single trait, but it could extend multiple traits.

We will cover traits in depth [later](traits.html).

## Program Entry Point

The main method is the entry point of a Scala program.  The Java Virtual
Machine requires a main method, named `main`, that takes one
argument: an array of strings.

{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}

In Scala 2 you must define a main method manually. Using an object, you can define the main method as follows:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}

In Scala 3, with the `@main` annotation, a main method is automatically generated from a method as follows:

```scala
@main def hello() = println("Hello, Scala developer!")
```
{% endtab %}

{% endtabs %}

## More resources

* [Scala book](/overviews/scala-book/prelude-taste-of-scala.html) overview
