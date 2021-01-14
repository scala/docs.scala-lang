---
title: Context Bounds
type: section
description: This page demonstrates Context Bounds in Scala 3.
num: 61
previous-page: types-type-classes
next-page: ca-given-imports
---


{% comment %}
- TODO: define "context parameter"
- TODO: define "synthesized" and "synthesized arguments"
{% endcomment %}

In many situations the name of a _context parameter_ doesn’t have to be mentioned explicitly, since it’s only used in synthesized arguments for other context parameters.
In that case you don’t have to define a parameter name, and can just provide the parameter type.


## Background

For example, this `maximum` method takes a _context parameter_ of type `Ord`, only to pass it on as an argument to `max`:

```scala
def maximum[T](xs: List[A])(using ord: Ord[A]): A =
  xs.reduceLeft(max(ord))
```

In that code the parameter name `ord` isn’t actually required; it can be passed on as an inferred argument to `max`, so you just state that `maximum` uses the type `Ord[A]` without giving it a name:

```scala
def maximum[T](xs: List[A])(using Ord[A]): A =
  xs.reduceLeft(max)
```


## Context bounds

Given that background, a _context bound_ is a shorthand syntax for expressing the pattern of, “a context parameter that depends on a type parameter.”

Using a context bound, the `maximum` method can be written like this:

```scala
def maximum[A: Ord](xs: List[A]): A = xs.reduceLeft(max)
```

A bound like `: Ord` on a type parameter `A` of a method or class indicates a context parameter with `Ord[A]`.

For more information about context bounds, see the [“What are context bounds?”](https://docs.scala-lang.org/tutorials/FAQ/context-bounds.html) section of the Scala FAQ.
