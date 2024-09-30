---
title: Context Bounds
type: section
description: This page demonstrates Context Bounds in Scala.
languages: [ru, zh-cn]
num: 62
previous-page: ca-context-parameters
next-page: ca-given-imports
---

In many situations the name of a [context parameter]({% link _overviews/scala3-book/ca-context-parameters.md %}#context-parameters) does not have to be mentioned explicitly, since it is only used by the compiler in synthesized arguments for other context parameters.
In that case you don’t have to define a parameter name, and can just provide the parameter type.


## Background

For example, consider a method `maxElement` that returns the maximum value in a collection:

{% tabs context-bounds-max-named-param class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(ord))
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def maxElement[A](as: List[A])(using ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(using ord))
```
{% endtab %}

{% endtabs %}

The method `maxElement` takes a _context parameter_ of type `Ord[A]` only to pass it on as an argument to the method
`max`.

For the sake of completeness, here are the definitions of `max` and `Ord` (note that in practice we would use the
existing method `max` on `List`, but we made up this example for illustration purpose):

{% tabs context-bounds-max-ord class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
// Defines how to compare values of type `A`
trait Ord[A] {
  def greaterThan(a1: A, a2: A): Boolean
}

// Returns the maximum of two values
def max[A](a1: A, a2: A)(implicit ord: Ord[A]): A =
  if (ord.greaterThan(a1, a2)) a1 else a2
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
// Defines how to compare values of type `A`
trait Ord[A]:
  def greaterThan(a1: A, a2: A): Boolean

// Returns the maximum of two values
def max[A](a1: A, a2: A)(using ord: Ord[A]): A =
  if ord.greaterThan(a1, a2) then a1 else a2
```
{% endtab %}

{% endtabs %}

Note that the method `max` takes a context parameter of type `Ord[A]`, like the method `maxElement`.

## Omitting context arguments

Since `ord` is a context parameter in the method `max`, the compiler can supply it for us in the implementation of `maxElement`,
when we call the method `max`:

{% tabs context-bounds-context class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _))
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def maxElement[A](as: List[A])(using Ord[A]): A =
  as.reduceLeft(max(_, _))
```

Note that, because we don’t need to explicitly pass it to the method `max`, we can leave out its name in the definition
of the method `maxElement`. This is an _anonymous context parameter_.
{% endtab %}

{% endtabs %}

## Context bounds

Given that background, a _context bound_ is a shorthand syntax for expressing the pattern of, “a context parameter applied to a type parameter.”

Using a context bound, the `maxElement` method can be written like this:

{% tabs context-bounds-max-rewritten %}

{% tab 'Scala 2 and 3' %}

```scala
def maxElement[A: Ord](as: List[A]): A =
  as.reduceLeft(max(_, _))
```

{% endtab %}

{% endtabs %}


A bound like `: Ord` on a type parameter `A` of a method or class indicates a context parameter with type `Ord[A]`.
Under the hood, the compiler transforms this syntax into the one shown in the Background section.

For more information about context bounds, see the [“What are context bounds?”]({% link _overviews/FAQ/index.md %}#what-are-context-bounds) section of the Scala FAQ.
