---
title: Implicit Conversions
type: section
description: This page demonstrates how to implement Implicit Conversions in Scala 3.
num: 66
previous-page: ca-multiversal-equality
next-page: ca-summary
---


Implicit conversions are defined by `given` instances of the _scala.Conversion_ class. For example, not accounting for possible conversion errors, this code defines an an implicit conversion from `String` to `Int`:

```scala
given Conversion[String, Int] with
  def apply(s: String): Int = Integer.parseInt(s)
```

Using an alias this can be expressed more concisely as:

```scala
given Conversion[String, Int] = Integer.parseInt(s)
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

The Predef package contains “auto-boxing” conversions that map primitive number types to subclasses of _java.lang.Number_. For instance, the conversion from `Int` to _java.lang.Integer_ can be defined as follows:

```scala
given int2Integer: Conversion[Int, java.lang.Integer] =
  java.lang.Integer.valueOf(_)
```


{% comment %}
NOTE: I thought this was too much detail for an overview, but I left here in case anyone else thinks differently.

### More details

An implicit conversion is applied automatically by the compiler in three situations:

- If an expression `e` has type `B`, and `B` does not conform to the expression’s expected type `A`
- In a selection `e.m` with `e` of type `B`, but `B` defines no member `m`
- In an application `e.m(args)` with `e` of type `B`, if `B` does define some member(s) named `m`, but none of these members can be applied to the arguments args

In the first case, the compiler looks for a given _scala.Conversion_ instance that maps an argument of type `B` to type `A`. In the second and third case, it looks for a given _scala.Conversion_ instance that maps an argument of type `B` to a type that defines a member `m` which can be applied to `args` if present. If such an instance `C` is found, the expression e is replaced by `C.apply(e)`.
{% endcomment %}
