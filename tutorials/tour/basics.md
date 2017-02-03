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

## Running Scala on Browser

You can run Scala on browser by using [ScalaFiddle](https://scalafiddle.io).

1. Go to https://scalafiddle.io.
2. Copy and paste `println("Hello, world!")` to the left pane.
3. Hit "Run" button and see it prints "Hello, world!" on the right pane.

It is a perfect way for anybody to experiment a piece of Scala code anywhere, anytime!

## Variables

You can define variables with the `val` keyword.

```
val x = 1 + 1
```

Variables defined by `val` cannot be re-assigned and are immutable in that sense.

```
val x = 1 + 1
x += 2 // This does not compile because it is re-assigning the variable.
```

If you need to mutate variables, you can use the `var` keyword instead.

```
var y = 1 + 1
y += 2 // This compiles because "y" is declared with "var" keyword.
```

Type of variables can be inferred, but you can also explicitly state type like below.

```
val x: Int = 1 + 1
```

## Functions

You can define functions that returns a given integer + 1 like below.

```
(x: Int) => x + 1
```

Left hand side of `=>` is parameter(s) and right hand side of it is body.

Notice that the function has no `return` keyword. This is because, in Scala, the last expression of the function is automatically returned.

You can also assign functions to variables.

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

If your function body spans across multiple lines, you can wrap them with `{}`.

```
val greet = (name: String) => {
  println("Hello, " + name + "!")
  println("How are you doing today?")
}
greet("Scala developer")
// Hello, Scala developer!
// How are you doing today?
```

We will cover functions in depth [later](anonymous-function-syntax.md).

## Methods

Methods look and behave very similar to functions, but there are a few key differences between them.

Methods are defined like below with the `def` keyword followed by its name, parameter(s), return type, and body.

```
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```

Methods cannot be assigned to variables.

```
def add(x: Int, y: Int): Int = x + y
val add2 = add // This does not compile.
```

Methods can take multiple parameter groups.

```
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```

Or no parameter group at all.

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

By default, classes are compared by reference. If you want to compare them by values, you need to override `equals` and `hashCode` methods.

```
class Point(val x: Int, val y: Int) {
  override def equals(o: Any) = o match {
    case that: Point => x == that.x && y == that.y
    case _ => false
  }
  override def hashCode = (x.hashCode << 16) + y.hashCode
}
```

While it works, it's tedious to define those methods for all classes you want to compare by value.

Thankfully, Scala has another type of class called `case class` that's compared by value by default.

```
case class Point(x: Int, y: Int)
```

You can instantiate case classes without `new` keyword.

```
val point = Point(1, 2) // no "new" here
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
println(point == anotherPoint) // true
println(point == yetAnotherPoint) // false
```

Case classes are immutable by default, but it also provides `copy` method so that you can easily create another instance of the class while reusing the values from exiting instances.

Using `copy` method, you can also write the above code like below.

```
val point = Point(1, 2)
val anotherPoint = point.copy()
val yetAnotherPoint = point.copy(x = 2)
println(point == anotherPoint) // true
println(point == yetAnotherPoint) // false
```

Because of case classes, you almost never see classes overriding `equals` and `hashCode` methods in Scala.

There are many other features you get out-of-the-box by using case classes. We will cover them in depth [later](case-classes.md).

## Singleton Objects

You can define singleton objects with `object` keyword.

```
object IdFactory {
  private var counter = 0

  def create(): Int = {
    counter += 1
    counter
  }
}
```

You can access singleton objects just by referring its name.

```
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

We will cover singleton objects in depth [later](singleton-objects.md).

## Traits

Traits define specification of types as signature of fields and methods.

You can define traits with `trait` keyword.

```
trait Point {
  var x: Int
  var y: Int
}
```

Traits can also have implementation.

```
trait Point {
  var x: Int
  var y: Int
  
  override def toString: String = "(" + x + ", " + y + ")"
}
```

You can extend traits with `extends` keyword.

```
class MyPoint(var x: Int, var y: Int) extends Point {
  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }
}
```

We will cover traits in depth [later](traits.md).

## Main Method

Using singleton objects, you can define main methods like below.

```
object Main {
  def main(args: Array[String]): Unit = {
    println("Hello, world!")
  }
}
```

Because every runnable application has a main method, Scala also provides a more convenient way of defining your main method by extending `App` trait.

```
object Main extends App {
  println("Hello, world!")
}
```
