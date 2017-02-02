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

## Variables

You can define variables with `var` keyword.

```
var x = 1 + 1
x += 1
```

Often, you want your variables to be immutable. You can use `val` keyword in that case.

```
val x = 1 + 1
x += 1 // This does not compile because you declared the variable with "val" keyword
```

Type of variables can be inferred, but you can also explicitly state type like below.

```
val x: Int = 1 + 1
```

## Functions

You can define functions like below.

```
(name: String) => println("Hello, " + name + "!")
```

You can also assign functions to variables.

```
val greet = (name: String) => println("Hello, " + name + "!")
greet("Scala") // Hello, Scala!
```

We will cover functions in depth [later](anonymous-function-syntax.md).

## Classes

You can define classes with `class` keyword.

```
class Point(var x: Int, var y: Int) {
  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String = "(" + x + ", " + y + ")"
}
```

You can instantiate classes with `new` keyword.

```
val point = new Point(1, 2)
println(point) // (1, 2)
```

We will cover classes in depth [later](classes.md).

## Traits

Traits define types as signature of fields and methods.

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

## Case Classes

By default, classes are compared by reference. If you want to compare them by values, you need to override `equals` and `hashCode` methods.

```
class Point(x: Int, y: Int) {
  override def equals(o: Any) = o match {
    case that: Point => x == that.x && y == that.y
    case _ => false
  }
  override def hashCode = (x.hashCode << 16) + y.hashCode
}
```

It works, but it's tedious to define those methods for all classes you want to compare by value.

Thankfully, Scala has another type of class called `case class` that's compared by value by default.

```
case class Point(x: Int, y: Int)
```

Because of case classes, you almost never see Scala classes overriding `equals` and `hashCode` methods.

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
