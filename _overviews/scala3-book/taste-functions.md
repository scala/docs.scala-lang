---
title: First-Class Functions
type: section
description: This page provides an introduction to functions in Scala 3.
num: 11
previous-page: taste-methods
next-page: taste-objects
---



Scala has most features you’d expect in a functional programming language, including:

- Lambdas
- Higher-order functions (HOFs)
- Immutable collections in the standard library

Lambdas, also known as _anonymous functions_, are a big part of keeping your code concise but readable.

The `map` method of the `List` class is a typical example of a higher-order function---a function that takes a lambda as parameter.

These two examples are equivalent, and show how to multiply each number in a list by `2` by passing a lambda into the `map` method:

```scala
val a = List(1, 2, 3).map(i => i * 2)   // List(2,4,6)
val b = List(1, 2, 3).map(_ * 2)        // List(2,4,6)
```

Those examples are also equivalent to the following code, which uses a `double` method instead of a lambda:

```scala
def double(i: Int): Int = i * 2

val a = List(1, 2, 3).map(i => double(i))   // List(2,4,6)
val b = List(1, 2, 3).map(double)           // List(2,4,6)
```

> If you haven’t seen the `map` method before, it applies a given function to every element in a list, yielding a new list that contains the resulting values.

Passing lambdas to higher-order functions on collections classes (like `List`) is a part of the Scala experience, something you’ll do every day.



## Immutable collections

When you work with immutable collections like `List`, `Vector`, and the immutable `Map` and `Set` classes, it’s important to know that these functions don’t mutate the collection they’re called on; instead, they return a new collection with the updated data.
As a result, it’s also common to chain them together in a “fluent” style to solve problems.

For instance, this example shows how to filter a collection twice, and then multiply each element in the remaining collection:

```scala
// a sample list
val nums = (1 to 10).toList   // List(1,2,3,4,5,6,7,8,9,10)

// methods can be chained together as needed
val x = nums.filter(_ > 3)
            .filter(_ < 7)
            .map(_ * 10)

// result: x == List(40, 50, 60)
```

In addition to higher-order functions being used throughout the standard library, you can also [create your own][higher-order].



[higher-order]: {% link _overviews/scala3-book/fun-hofs.md %}
