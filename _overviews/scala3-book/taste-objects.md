---
title: Objects
type: section
description: This section provides an introduction to the use of objects in Scala 3.
num: 12
previous-page: taste-functions
next-page: taste-collections
---


In Scala, the `object` keyword creates a Singleton object.
Put another way, an object defines a class that has exactly one instance.

Objects have several uses:

- They are used to create collections of utility methods.
- A _companion object_ is an object that has the same name as the class it shares a file with.
  In this situation, that class is also called a _companion class_.
- They’re used to implement traits to create _modules_.



## “Utility” methods

Because an `object` is a Singleton, its methods can be accessed like `static` methods in a Java class.
For example, this `StringUtils` object contains a small collection of string-related methods:

```scala
object StringUtils:
  def isNullOrEmpty(s: String): Boolean =
    if (s==null || s.trim.equals("")) true else false
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
```

Because `StringUtils` is a singleton, its methods can be called directly on the object:

```scala
val x = StringUtils.isNullOrEmpty("")    // true
val x = StringUtils.isNullOrEmpty("a")   // false
```


## Companion objects

A companion class or object can access the private members of its companion.
Use a companion object for methods and values which aren’t specific to instances of the companion class.

This example demonstrates how the `area` method in the companion class can access the private `calculateArea` method in its companion object:

```scala
import scala.math.*

class Circle(radius: Double):
  import Circle.*
  def area: Double = calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double =
    Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area   // Double = 78.53981633974483
```


## Creating modules from traits

Objects can also be used to implement traits to create modules.
This technique takes two traits and combines them to create a concrete `object`:

```scala
trait AddService:
  def add(a: Int, b: Int) = a + b

trait MultiplyService:
  def multiply(a: Int, b: Int) = a * b

// implement those traits as a concrete object
object MathService extends AddService, MultiplyService

// use the object
import MathService.*
println(add(1,1))        // 2
println(multiply(2,2))   // 4
```

{% comment %}
NOTE: I don’t know if this is worth keeping, but I’m leaving it here as a comment for now.

> You may read that objects are used to _reify_ traits into modules.
> _Reify_ means, “to take an abstract concept and turn it into something concrete.” This is what happens in these examples, but “implement” is a more familiar word for most people than “reify.”
{% endcomment %}



