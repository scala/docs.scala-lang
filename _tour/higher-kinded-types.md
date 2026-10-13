---
layout: tour
title: Higher-Kinded Types
permalink: /tour/higher-kinded-types.html
---

# Higher-Kinded Types

This section introduces Higher-Kinded Types (HKT), an advanced type system feature in Scala, along with related concepts like type bounds and type projections.

## What are Higher-Kinded Types?

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

## Type Bounds and Typeclasses

Scala supports upper and lower bounds and commonly uses typeclasses for comparison:

```scala
def max[T](x: T, y: T)(implicit ord: Ordering[T]): T =
  if (ord.gt(x, y)) x else y
```

Here `Ordering[T]` provides comparison logic for type `T` using a typeclass pattern.

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
