---
type: section
layout: multipage-overview
title: The Set Class
description: This page provides examples of the Scala 'Set' class, including how to add and remove elements from a Set, and iterate over Set elements.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 33
outof: 54
previous-page: map-class
next-page: anonymous-functions
---


The [Scala Set class]({{site.baseurl}}/overviews/collections-2.13/sets.html) is an iterable collection with no duplicate elements.

Scala has both mutable and immutable `Set` classes. In this lesson we’ll show how to use the *mutable* class.



## Adding elements to a Set

To use a mutable `Set`, first import it:

```scala
val set = scala.collection.mutable.Set[Int]()
```

You add elements to a mutable `Set` with the `+=`, `++=`, and `add` methods. Here are a few examples:

```scala
set += 1
set += 2 += 3
set ++= Vector(4, 5)
```

The REPL shows how these examples work:

```scala
scala> val set = scala.collection.mutable.Set[Int]()
val set: scala.collection.mutable.Set[Int] = Set()

scala> set += 1
val res0: scala.collection.mutable.Set[Int] = Set(1)

scala> set += 2 += 3
val res1: scala.collection.mutable.Set[Int] = Set(1, 2, 3)

scala> set ++= Vector(4, 5)
val res2: scala.collection.mutable.Set[Int] = Set(1, 5, 2, 3, 4)
```

Notice that if you try to add a value to a set that’s already in it, the attempt is quietly ignored:

```scala
scala> set += 2
val res3: scala.collection.mutable.Set[Int] = Set(1, 5, 2, 3, 4)
```

`Set` also has an `add` method that returns `true` if an element is added to a set, and `false` if it wasn’t added. The REPL shows how it works:

```scala
scala> set.add(6)
res4: Boolean = true

scala> set.add(5)
res5: Boolean = false
```



## Deleting elements from a Set

You remove elements from a set using the `-=` and `--=` methods, as shown in the following examples:

```scala
scala> val set = scala.collection.mutable.Set(1, 2, 3, 4, 5)
set: scala.collection.mutable.Set[Int] = Set(2, 1, 4, 3, 5)

// one element
scala> set -= 1
res0: scala.collection.mutable.Set[Int] = Set(2, 4, 3, 5)

// two or more elements (-= has a varargs field)
scala> set -= (2, 3)
res1: scala.collection.mutable.Set[Int] = Set(4, 5)

// multiple elements defined in another sequence
scala> set --= Array(4,5)
res2: scala.collection.mutable.Set[Int] = Set()
```

There are more methods for working with sets, including `clear` and `remove`, as shown in these examples:

```scala
scala> val set = scala.collection.mutable.Set(1, 2, 3, 4, 5)
set: scala.collection.mutable.Set[Int] = Set(2, 1, 4, 3, 5)

// clear
scala> set.clear()

scala> set
res0: scala.collection.mutable.Set[Int] = Set()

// remove
scala> val set = scala.collection.mutable.Set(1, 2, 3, 4, 5)
set: scala.collection.mutable.Set[Int] = Set(2, 1, 4, 3, 5)

scala> set.remove(2)
res1: Boolean = true

scala> set
res2: scala.collection.mutable.Set[Int] = Set(1, 4, 3, 5)

scala> set.remove(40)
res3: Boolean = false
```



## More Sets

Scala has several more `Set` classes, including `SortedSet`, `LinkedHashSet`, and more. Please see the [Set class documentation]({{site.baseurl}}/overviews/collections-2.13/sets.html) for more details on those classes.








