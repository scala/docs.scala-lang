---
title: Intersection Types
type: section
description: This section introduces and demonstrates intersection types in Scala 3.
num: 50
previous-page: types-generics
next-page: types-union
---


Used on types, the `&` operator creates a so called _intersection type_.
The type `A & B` represents values that are **both** of the type `A` and of the type `B` at the same time.
For instance, the following example uses the intersection type `Resettable & Growable[String]`:

```scala
trait Resettable:
  def reset(): Unit

trait Growable[A]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]): Unit =
  x.reset()
  x.add("first")
```

In the method `f` in this example, the parameter `x` is required to be *both* a `Resettable` and a `Growable[String]`.

The _members_ of an intersection type `A & B` are all the members of `A` and all the members of `B`.
Therefore, as shown, `Resettable & Growable[String]` has member methods `reset` and `add`.

Intersection types can be useful to describe requirements _structurally_.
That is, in our example `f`, we directly express that we are happy with any value for `x` as long as it’s a subtype of both `Resettable` and `Growable`.
We **did not** have to create a _nominal_ helper trait like the following:
```scala
trait Both[A] extends Resettable, Growable[A]
def f(x: Both[String]): Unit
```
There is an important difference between the two alternatives of defining `f`: While both allow `f` to be called with instances of `Both`, only the former allows passing instances that are subtypes of `Resettable` and `Growable[String]`, but _not of_ `Both[String]`.

> Note that `&` is _commutative_: `A & B` is the same type as `B & A`.
