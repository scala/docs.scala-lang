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
trait Node[+B] {
  def prepend(elem: B): Node[B]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
}
```

This program implements a singly-linked list. `Nil` represents an empty element (i.e. an empty list). `class ListNode` is a node which contains an element of type `B` (`head`) and a reference to the rest of the list (`tail`). The `class Node` and its subtypes are covariant because we have `+B`.

However, this program does _not_ compile because the parameter `elem` in `prepend` is of type `B`, which we declared *co*variant. This doesn't work because functions are *contra*variant in their parameter types and *co*variant in their result types.

To fix this, we need to flip the variance of the type of the parameter `elem` in `prepend`. We do this by introducing a new type parameter `U` that has `B` as a lower type bound.

```scala mdoc
trait Node[+B] {
  def prepend[U >: B](elem: U): Node[U]
}

case class ListNode[+B](head: B, tail: Node[B]) extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
}

object Nil extends Node[Nothing] {
  def prepend[U >: Nothing](elem: U): ListNode[U] = ListNode(elem, this)
}
```

We have also simplified `ListNode` to leverage its `case class` fields, and `Nil` to be a singleton object; it is a "node of nothing" because it does not hold an element. The type parameter for `Node` is `B` to suggest we want to store birds at each node.

Now we can do the following:
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird

val africanSwallows: Node[AfricanSwallow] = ListNode[AfricanSwallow](AfricanSwallow(), Nil)
val swallowsFromAntarctica: Node[Bird] = Nil

// assign swallows to birds
val birds: Node[Bird] = africanSwallows

// add a swallow to birds
val moreBirds = birds.prepend(EuropeanSwallow())

// add disparate swallows together to get birds
val allBirds = africanSwallows.prepend(EuropeanSwallow())

// but this is a mistake! adding a Node to birds widens the type arg too much. -Xlint will warn!
val error = moreBirds.prepend(swallowsFromAntarctica)
```
The covariant type parameter allows `birds` to get the value of `africanSwallows`.

The type bound on the type parameter for `prepend` allows adding different varieties of swallows and getting a wider type: instead of `Node[AfricanSwallow]`, we get a `Node[Bird]`.

The canary in the coal mine is `-Xlint`, which will warn if the type arg is widened too much.
