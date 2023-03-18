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

{% tabs upper-type-bounds_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds_1 %}
```scala mdoc:fail
trait List[+A] {
  def prepend(elem: A): NonEmptyList[A] = NonEmptyList(elem, this)
}

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```
{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds_1 %}
```scala
trait List[+A]:
  def prepend(elem: A): NonEmptyList[A] = NonEmptyList(elem, this)

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```
{% endtab %}
{% endtabs %}

This program implements a singly-linked list. `Nil` represents an empty list with no elements. `class NonEmptyList` is a node which contains an element of type `A` (`head`) and a reference to the rest of the list (`tail`). The `trait List` and its subtypes are covariant because we have `+A`.

However, this program does _not_ compile because the parameter `elem` in `prepend` is of type `A`, which we declared *co*variant. This doesn't work because functions are *contra*variant in their parameter types and *co*variant in their result types.

To fix this, we need to flip the variance of the type of the parameter `elem` in `prepend`. We do this by introducing a new type parameter `B` that has `A` as a lower type bound.

{% tabs upper-type-bounds_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds_2 %}
```scala mdoc
trait List[+A] {
  def prepend[B >: A](elem: B): NonEmptyList[B] = NonEmptyList(elem, this)
}

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```
{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds_2 %}
```scala
trait List[+A]:
  def prepend[B >: A](elem: B): NonEmptyList[B] = NonEmptyList(elem, this)

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```
{% endtab %}
{% endtabs %}

Now we can do the following:

{% tabs upper-type-bounds_3 %}
{% tab 'Scala 2 and 3' for=upper-type-bounds_3 %}
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird

val africanSwallows: List[AfricanSwallow] = Nil.prepend(AfricanSwallow())
val swallowsFromAntarctica: List[Bird] = Nil
val someBird: Bird = EuropeanSwallow()

// assign swallows to birds
val birds: List[Bird] = africanSwallows

// add some bird to swallows, `B` is `Bird`
val someBirds = africanSwallows.prepend(someBird)

// add a swallow to birds
val moreBirds = birds.prepend(EuropeanSwallow())

// add disparate swallows together, `B` is `Bird` because that is the supertype common to both swallows
val allBirds = africanSwallows.prepend(EuropeanSwallow())

// but this is a mistake! adding a list of birds widens the type arg too much. -Xlint will warn!
val error = moreBirds.prepend(swallowsFromAntarctica)    // List[Object]
```
{% endtab %}
{% endtabs %}

The covariant type parameter allows `birds` to get the value of `africanSwallows`.

The type bound on the type parameter for `prepend` allows adding different varieties of swallows and getting a wider type: instead of `List[AfricanSwallow]`, we get a `List[Bird]`.
