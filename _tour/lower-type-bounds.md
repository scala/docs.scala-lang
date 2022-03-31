---
layout: tour
title: Lower Type Bounds
partof: scala-tour

num: 23
next-page: inner-classes
previous-page: upper-type-bounds
prerequisite-knowledge: upper-type-bounds, generics, variance

redirect_from: "/tutorials/tour/lower-type-bounds.html"
---

While [upper type bounds](upper-type-bounds.html) limit a type to a subtype of another type, *lower type bounds* declare a type to be a supertype of another type. The term `B >: A` expresses that the type parameter `B` or the abstract type `B` refer to a supertype of type `A`. In most cases, `A` will be the type parameter of the class and `B` will be the type parameter of a method.

Here is an example where this is useful:

```scala mdoc:fail
trait List[+B] {
  def prepend(elem: B): NonEmptyList[B] = NonEmptyList(elem, this)
}

case class NonEmptyList[+B](head: B, tail: List[B]) extends List[B]

object Nil extends List[Nothing]
```

This program implements a singly-linked list. `Nil` represents an empty list with no elements. `class NonEmptyList` is a node which contains an element of type `B` (`head`) and a reference to the rest of the list (`tail`). The `trait List` and its subtypes are covariant because we have `+B`.

However, this program does _not_ compile because the parameter `elem` in `prepend` is of type `B`, which we declared *co*variant. This doesn't work because functions are *contra*variant in their parameter types and *co*variant in their result types.

To fix this, we need to flip the variance of the type of the parameter `elem` in `prepend`. We do this by introducing a new type parameter `U` that has `B` as a lower type bound.

```scala mdoc
trait List[+B] {
  def prepend[U >: B](elem: U): NonEmptyList[U] = NonEmptyList(elem, this)
}

case class NonEmptyList[+B](head: B, tail: List[B]) extends List[B]

object Nil extends List[Nothing]
```

The type parameter for `List` is `B` to suggest we want to keep lists of birds.

Now we can do the following:
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird

val africanSwallows: List[AfricanSwallow] = Nil.prepend(AfricanSwallow())
val swallowsFromAntarctica: List[Bird] = Nil

// assign swallows to birds
val birds: List[Bird] = africanSwallows

// add a swallow to birds
val moreBirds = birds.prepend(EuropeanSwallow())

// add disparate swallows together to get birds
val allBirds = africanSwallows.prepend(EuropeanSwallow())

// but this is a mistake! adding a list of birds widens the type arg too much. -Xlint will warn!
val error = moreBirds.prepend(swallowsFromAntarctica)
```
The covariant type parameter allows `birds` to get the value of `africanSwallows`.

The type bound on the type parameter for `prepend` allows adding different varieties of swallows and getting a wider type: instead of `List[AfricanSwallow]`, we get a `List[Bird]`.

The canary in the coal mine is `-Xlint`, which will warn if the type arg is widened too much.
