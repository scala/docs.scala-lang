---
layout: tour
title: Classes
partof: scala-tour

num: 4
next-page: default-parameter-values
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures

redirect_from: "/tutorials/tour/classes.html"
---

Classes in Scala are blueprints for creating objects. They can contain methods,
values, variables, types, objects, traits, and classes which are collectively called _members_. Types, objects, and traits will be covered later in the tour.

## Defining a class
A minimal class definition is simply the keyword `class` and
an identifier. Class names should be capitalized.

{% tabs class-minimal-user class=tabs-scala-version %}

{% tab 'Scala 2' for=class-minimal-user %}
```scala mdoc
class User

val user1 = new User
```

The keyword `new` is used to create an instance of the class.
{% endtab %}

{% tab 'Scala 3' for=class-minimal-user %}
```scala
class User

val user1 = User()
```

We call the class like a function, as `User()`, to create an instance of the class.
It is also possible to explicitly use the `new` keyword, as `new User()`, although that is usually left out.
{% endtab %}

{% endtabs %}

`User` has a default constructor which takes no arguments because no constructor was defined. However, you'll often want a constructor and class body. Here is an example class definition for a point:

{% tabs class-point-example class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-example %}
```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
println(point1.x)  // prints 2
println(point1)    // prints (2, 3)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-example %}
```scala
class Point(var x: Int, var y: Int):

  def move(dx: Int, dy: Int): Unit =
    x = x + dx
    y = y + dy

  override def toString: String =
    s"($x, $y)"
end Point

val point1 = Point(2, 3)
println(point1.x)  // prints 2
println(point1)    // prints (2, 3)
```
{% endtab %}

{% endtabs %}

This `Point` class has four members: the variables `x` and `y` and the methods `move` and
`toString`. Unlike many other languages, the primary constructor is in the class signature `(var x: Int, var y: Int)`. The `move` method takes two integer arguments and returns the Unit value `()`, which carries no information. This corresponds roughly to `void` in Java-like languages. `toString`, on the other hand, does not take any arguments but returns a `String` value. Since `toString` overrides `toString` from [`AnyRef`](unified-types.html), it is tagged with the `override` keyword.

## Constructors

Constructors can have optional parameters by providing a default value like so:

{% tabs class-point-with-default-values class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-with-default-values %}
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point    // x and y are both set to 0
val point1 = new Point(1) // x is set to 1 and y is set to 0
println(point1)           // prints (1, 0)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-with-default-values %}
```scala
class Point(var x: Int = 0, var y: Int = 0)

val origin = Point()  // x and y are both set to 0
val point1 = Point(1) // x is set to 1 and y is set to 0
println(point1)       // prints (1, 0)
```
{% endtab %}

{% endtabs %}

In this version of the `Point` class, `x` and `y` have the default value `0` so no arguments are required. However, because the constructor reads arguments left to right, if you just wanted to pass in a `y` value, you would need to name the parameter.

{% tabs class-point-named-argument class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-named-argument %}
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y = 2)
println(point2)               // prints (0, 2)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-named-argument %}
```scala
class Point(var x: Int = 0, var y: Int = 0)
val point2 = Point(y = 2)
println(point2)           // prints (0, 2)
```
{% endtab %}

{% endtabs %}

This is also a good practice to enhance clarity.

## Private Members and Getter/Setter Syntax
Members are public by default. Use the `private` access modifier
to hide them from outside of the class.

{% tabs class-point-private-getter-setter class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-private-getter-setter %}
```scala mdoc:reset
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x: Int = _x
  def x_=(newValue: Int): Unit = {
    if (newValue < bound)
      _x = newValue
    else
      printWarning()
  }

  def y: Int = _y
  def y_=(newValue: Int): Unit = {
    if (newValue < bound)
      _y = newValue
    else
      printWarning()
  }

  private def printWarning(): Unit =
    println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // prints the warning
```
{% endtab %}

{% tab 'Scala 3' for=class-point-private-getter-setter %}
```scala
class Point:
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x: Int = _x
  def x_=(newValue: Int): Unit =
    if newValue < bound then
      _x = newValue
    else
      printWarning()

  def y: Int = _y
  def y_=(newValue: Int): Unit =
    if newValue < bound then
      _y = newValue
    else
      printWarning()

  private def printWarning(): Unit =
    println("WARNING: Out of bounds")
end Point

val point1 = Point()
point1.x = 99
point1.y = 101 // prints the warning
```
{% endtab %}

{% endtabs %}

In this version of the `Point` class, the data is stored in private variables `_x` and `_y`. There are methods `def x` and `def y` for accessing the private data. `def x_=` and `def y_=` are for validating and setting the value of `_x` and `_y`. Notice the special syntax for the setters: the method has `_=` appended to the identifier of the getter and the parameters come after.

Primary constructor parameters with `val` and `var` are public. However, because `val`s are immutable, you can't write the following.

{% tabs class-point-cannot-set-val class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-cannot-set-val %}
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- does not compile
```
{% endtab %}

{% tab 'Scala 3' for=class-point-cannot-set-val %}
```scala
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
point.x = 3  // <-- does not compile
```
{% endtab %}

{% endtabs %}

Parameters without `val` or `var` are private values, visible only within the class.

{% tabs class-point-non-val-ctor-param class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-non-val-ctor-param %}
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- does not compile
```
{% endtab %}

{% tab 'Scala 3' for=class-point-non-val-ctor-param %}
```scala
class Point(x: Int, y: Int)
val point = Point(1, 2)
point.x  // <-- does not compile
```
{% endtab %}

{% endtabs %}

## More resources

* Learn more about Classes in the [Scala Book](/scala3/book/domain-modeling-tools.html#classes)
* How to use [Auxiliary Class Constructors](/scala3/book/domain-modeling-tools.html#auxiliary-constructors)
