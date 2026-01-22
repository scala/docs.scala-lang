---
layout: multipage-overview
title: Advanced Type Features
partof: scaladoc
overview-name: Scaladoc
num: 4
permalink: /overviews/scaladoc/advanced-type-features.html
---

# Advanced Type Features in Scala

This section introduces some advanced type system features in Scala, including **Higher-Kinded Types (HKT)**, type bounds, and type projections.

## Higher-Kinded Types

Higher-Kinded Types allow abstracting over type constructors. For example:

```scala
trait Functor[F[_]] {
  def map[A, B](fa: F[A])(f: A => B): F[B]
}
```

Here `F[_]` is a type constructor that takes a single type parameter.

### Example Usage:

```scala
val optionFunctor = new Functor[Option] {
  def map[A, B](fa: Option[A])(f: A => B): Option[B] = fa.map(f)
}

val result = optionFunctor.map(Some(2))(_ * 2) // Some(4)
```

## Type Bounds

Scala supports upper and lower bounds:

```scala
def max[T <: Ordered[T]](x: T, y: T): T = if (x > y) x else y
```

Here `T <: Ordered[T]` means `T` must implement `Ordered`.

## Type Projections

You can refer to a type member of another type:

```scala
class Outer {
  class Inner
}

val o = new Outer
val i: o.Inner = new o.Inner
```

## Summary

These features allow Scala developers to write highly abstract and reusable code. Higher-Kinded Types, type bounds, and type projections are cornerstones of Scala’s expressive type system.
