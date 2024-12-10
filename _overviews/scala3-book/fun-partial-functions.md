---
title: Partial Functions
type: section
description: This page shows how to use function variables in Scala.
num: 31
previous-page: fun-function-variables
next-page: fun-eta-expansion
---

A partial function is a function that may not be defined for all values of its argument type. In Scala, partial functions
are unary functions implementing the `PartialFunction[A, B]` trait, where `A` is the argument type and `B` the result type.

To define a partial function, use a `case` identical to those used in `match` expressions:

{% tabs fun-partial-1 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledOdds: PartialFunction[Int, Int] = {
  case i if i % 2 == 1 => i * 2
}
```
{% endtab %}
{% endtabs %}

To check if a partial function is for an argument, use the `isDefinedAt` method:

{% tabs fun-partial-2 %}
{% tab 'Scala 2 and 3' %}
```scala
doubledOdds.isDefinedAt(3)  // true
doubledOdds.isDefinedAt(4)  // false
```
{% endtab %}
{% endtabs %}

Trying to apply a partial function to an argument not belonging to its domain results in `MatchError`:

{% tabs fun-partial-3 %}
{% tab 'Scala 2 and 3' %}
```scala
doubledOdds(4)  // Exception in thread "main" scala.MatchError: 4
```
{% endtab %}
{% endtabs %}

### Using partial functions

A partial function can be passed as an argument to a method:

{% tabs fun-partial-4 %}
{% tab 'Scala 2 and 3' %}
```scala
val res = List(1, 2, 3).collect({ case i if i % 2 == 1 => i * 2 }) // List(2, 6)
```
{% endtab %}
{% endtabs %}

You can define a default value for arguments not in domain with `applyOrElse`:

{% tabs fun-partial-5 %}
{% tab 'Scala 2 and 3' %}
```scala
doubledOdds.applyOrElse(4, _ + 1)  // 5
```
{% endtab %}
{% endtabs %}

Two partial function can be composed with `orElse`, the second function will be applied for arguments where the first
one is not defined:

{% tabs fun-partial-6 %}
{% tab 'Scala 2 and 3' %}
```scala
val incrementedEvens: PartialFunction[Int, Int] = {
  case i if i % 2 == 0 => i + 1
}

val res2 = List(1, 2, 3).collect(doubledOdds.orElse(incrementedEvens)) // List(2, 3, 6)
```
{% endtab %}
{% endtabs %}