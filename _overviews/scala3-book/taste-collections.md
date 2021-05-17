---
title: Collections
type: section
description: This page provides a high-level overview of the main features of the Scala 3 programming language.
num: 13
previous-page: taste-objects
next-page: taste-contextual-abstractions
---



The Scala library has a rich set of collection classes, and those classes have a rich set of methods.
Collections classes are available in both immutable and mutable forms.



## Creating lists

To give you a taste of how these work, here are some examples that use the `List` class, which is an immutable, linked-list class.
These examples show different ways to create a populated `List`:

```scala
val a = List(1, 2, 3)           // a: List[Int] = List(1, 2, 3)

// Range methods
val b = (1 to 5).toList         // b: List[Int] = List(1, 2, 3, 4, 5)
val c = (1 to 10 by 2).toList   // c: List[Int] = List(1, 3, 5, 7, 9)
val e = (1 until 5).toList      // e: List[Int] = List(1, 2, 3, 4)
val f = List.range(1, 5)        // f: List[Int] = List(1, 2, 3, 4)
val g = List.range(1, 10, 3)    // g: List[Int] = List(1, 4, 7)
```



## `List` methods

Once you have a populated list, the following examples show some of the methods you can call on it.
Notice that these are all functional methods, meaning that they don’t mutate the collection they’re called on, but instead return a new collection with the updated elements.
The result that’s returned by each expression is shown in the comment on each line:

```scala
// a sample list
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.drop(2)                             // List(30, 40, 10)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeWhile(_ < 30)                   // List(10, 20)

// flatten
val a = List(List(1,2), List(3,4))
a.flatten                             // List(1, 2, 3, 4)

// map, flatMap
val nums = List("one", "two")
nums.map(_.toUpperCase)               // List("ONE", "TWO")
nums.flatMap(_.toUpperCase)           // List('O', 'N', 'E', 'T', 'W', 'O')
```

These examples show how the “fold” and “reduce” methods are used to sum the values in a sequence of integers:

```scala
val firstTen = (1 to 10).toList            // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

firstTen.reduce(_ + _)                     // 55
firstTen.reduceLeft(_ + _)                 // 55
firstTen.fold(100)(_ + _)                  // 155 (100 is a “seed” value)
firstTen.foldLeft(100)(_ + _)              // 155
```

There are many more methods available to Scala collections classes, and they’re demonstrated in the [Collections chapter][collections], and in the [API Documentation][api].



## Tuples

The Scala _tuple_ is a type that lets you easily put a collection of different types in the same container.
For example, given this `Person` case class:

```scala
case class Person(name: String)
```

This is how you create a tuple that contains an `Int`, a `String`, and a custom `Person` value:

```scala
val t = (11, "eleven", Person("Eleven"))
```

Once you have a tuple, you can access its values by binding them to variables, or access them by number:

```scala
t._1   // 11
t._2   // "eleven"
t._3   // Person("Eleven")
```

You can also use this _extractor_ approach to assign the tuple fields to variable names:

```scala
val (num, str, person) = t

// result:
// val num: Int = 11
// val str: String = eleven
// val person: Person = Person(Eleven)
```

Tuples are nice for those times when you want to put a collection of heterogeneous types in a little collection-like structure.
See the [Reference documentation][reference] for more tuple details.




[collections]: {% link _overviews/scala3-book/collections-intro.md %}
[api]: https://dotty.epfl.ch/api/index.html
[reference]: {{ site.scala3ref }}/overview.html
