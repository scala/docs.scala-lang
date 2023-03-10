---
title: Context Bounds
type: section
description: This page demonstrates Context Bounds in Scala.
languages: [zh-cn]
num: 61
previous-page: ca-given-using-clauses
next-page: ca-given-imports
---

In many situations the name of a [context parameter]({% link _overviews/scala3-book/ca-given-using-clauses.md %}#using-clauses) doesn’t have to be mentioned explicitly, since it’s only used by the compiler in synthesized arguments for other context parameters.
In that case you don’t have to define a parameter name, and can just provide the parameter type.


## Background

For example, this `maximum` method takes a _context parameter_ of type `Ord`, only to pass it on as an argument to `max`:

{% tabs context-bounds-max-named-param class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def maximum[A](xs: List[A])(implicit ord: Ord[A]): A =
  xs.reduceLeft(max(_, _)(ord))
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def maximum[A](xs: List[A])(using ord: Ord[A]): A =
  xs.reduceLeft(max(_, _)(using ord))
```
{% endtab %}

{% endtabs %}

## Context bounds

Given that background, a _context bound_ is a shorthand syntax for expressing the pattern of, “a context parameter applied to a type parameter.”

Using a context bound, the `maximum` method can be written like this:

{% tabs context-bounds-max-rewritten %}

{% tab 'Scala 2 and 3' %}

```scala
def maximum[A: Ord](xs: List[A]): A =
  xs.reduceLeft(max)
```

{% endtab %}

{% endtabs %}


A bound like `: Ord` on a type parameter `A` of a method or class indicates a context parameter with type `Ord[A]`.
Under the hood, the compiler transforms this syntax into the one shown in the Background section.

For more information about context bounds, see the [“What are context bounds?”]({% link _overviews/FAQ/index.md %}#what-are-context-bounds) section of the Scala FAQ.
