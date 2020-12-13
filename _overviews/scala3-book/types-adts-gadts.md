---
title: Algebraic Data Types
type: section
description: This section introduces and demonstrates algebraic data types (ADTs) in Scala 3.
num: 43
previous-page: types-union
next-page: types-type-classes
---


Algebraic Data Types (ADTs) are created with the `enum` construct, so we’ll review enumerations before looking at ADTs.

### Enumerations

An *enumeration* is used to define a type consisting of a set of named values:

```scala
enum Color:
  case Red, Green, Blue
```

Enums can be parameterized:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

They can also have custom definitions:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // 5 or 6 more planets ...
```

Like classes and `case` classes, you can also define a companion object for an enum:

```scala
object Planet:
  def main(args: Array[String]) =
    val earthWeight = args(0).toDouble
    val mass = earthWeight / Earth.surfaceGravity
    for (p <- values)
      println(s"Your weight on $p is ${p.surfaceWeight(mass)}")
```

### ADTs and GADTs

The `enum` concept is general enough to also support algebraic data types (ADTs) and their generalized version (GADTs). Here’s an example how an `Option` type can be represented as an ADT:

```scala
enum Option[+T]:
  case Some(x: T)
  case None
```

This example creates an `Option` enum with a covariant type parameter `T` consisting of two cases, `Some` and `None`. `Some` is parameterized with a value parameter `x`; this is a shorthand for writing a `case` class that extends `Option`. Since `None` is not parameterized, it’s treated as a normal `enum` value.

The `extends` clauses that were omitted in the example above can also be given explicitly:

```scala
enum Option[+T]:
  case Some(x: T) extends Option[T]
  case None       extends Option[Nothing]
```

<!--Note that the parent type of the `None` value is inferred as
`Option[Nothing]`. Generally, all covariant type parameters of the enum
class are minimized in a compiler-generated extends clause whereas all
contravariant type parameters are maximized. If `Option` was non-variant,
you would need to give the extends clause of `None` explicitly.-->

As with normal `enum` values, the cases of an `enum` are defined in the `enum`s companion object. So they’re referred to as `Option.Some` and `Option.None`, unless the definitions are “pulled out” with an import:

```scala
scala> Option.Some("hello")
val res1: t2.Option[String] = Some(hello)

scala> Option.None
val res2: t2.Option[Nothing] = None
```

<!-- Note that the type of the expressions above is always `Option`. Generally, the type of an `enum` case constructor application will be widened to the underlying enum type, unless a more specific type is expected. This is a subtle difference with respect to normal case classes. The classes making up the cases do exist, and can be unveiled, either by constructing them directly with a `new`, or by explicitly providing an expected type.

```scala
scala> new Option.Some(2)
val res3: Option.Some[Int] = Some(2)
scala> val x: Option.Some[Int] = Option.Some(3)
val res4: Option.Some[Int] = Some(3)
```
-->

As with other enumeration uses, ADTs can define methods. For instance, here’s `Option` again, with an `isDefined` method and an `Option(...)` constructor in its companion object.

```scala
enum Option[+T]:
  case Some(x: T)
  case None

  def isDefined: Boolean = this match
    case None => false
    case some => true

object Option:
  def apply[T >: Null](x: T): Option[T] =
    if (x == null) None else Some(x)
```

Enumerations and ADTs share the same syntactic construct, so they can
be seen simply as two ends of a spectrum, and it’s perfectly possible
to construct hybrids. For instance, the code below gives an
implementation of `Color` either with three enum values or with a
parameterized case that takes an RGB value.

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)
```


