---
title: Implicit Conversions
type: section
description: This page demonstrates how to implement Implicit Conversions in Scala 3.
num: 66
previous-page: ca-multiversal-equality
next-page: ca-summary
---


Implicit conversions are defined by `given` instances of the _scala.Conversion_ class.
For example, not accounting for possible conversion errors, this code defines an an implicit conversion from `String` to `Int`:

```scala
given Conversion[String, Int] with
  def apply(s: String): Int = Integer.parseInt(s)
```

Using an alias this can be expressed more concisely as:

```scala
given Conversion[String, Int] = Integer.parseInt(_)
```

Using either of those conversions, you can now use a `String` in places where an `Int` is expected:

```scala
import scala.language.implicitConversions

// a method that expects an Int
def plus1(i: Int) = i + 1

// pass it a String that converts to an Int
plus1("1")
```

## Discussion

The Predef package contains “auto-boxing” conversions that map primitive number types to subclasses of _java.lang.Number_.
For instance, the conversion from `Int` to _java.lang.Integer_ can be defined as follows:

```scala
given int2Integer: Conversion[Int, java.lang.Integer] =
  java.lang.Integer.valueOf(_)
```
