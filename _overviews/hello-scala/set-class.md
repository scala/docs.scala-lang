---
layout: multipage-overview
title: The Set Class
description: This page provides examples of the Scala 'Set' class, including how to add and remove elements from a Set, and iterate over Set elements.
partof: hello_scala
overview-name: Hello, Scala
num: 33
---


A [Scala Set class](https://docs.scala-lang.org/overviews/collections/sets.html) is an iterable collection with no duplicate elements.

Scala has both mutable and immutable `Set` classes. In this lesson I’ll show how to use the *mutable* class.



## Adding elements to a Set

To use a mutable `Set`, first import it:

```scala
val set = scala.collection.mutable.Set[Int]()
```

You add elements to a mutable `Set` with the `+=`, `++=`, and `add` methods. Here are a few examples:

```scala
set += 1
set += (2, 3)
set += 2
set ++= Vector(4, 5)
```

The REPL shows how these examples work:

```scala
scala> set += 1
res0: scala.collection.mutable.Set[Int] = Set(1)

scala> set += (2, 3)
res1: scala.collection.mutable.Set[Int] = Set(1, 2, 3)

scala> set += 2
res2: scala.collection.mutable.Set[Int] = Set(1, 2, 3)

scala> set ++= Vector(4, 5)
res3: scala.collection.mutable.Set[Int] = Set(1, 5, 2, 3, 4)
```

Notice that the second time I try to add the value 2 to the set, the attempt is quietly ignored.

The `add` method is unique in that it returns `true` if an element is added to a set, and `false` if it wasn’t added. The REPL shows how it works:

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

// two or more elements (-= has a varags field)
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
scala> set.clear

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

Scala has several more `Set` classes, including `SortedSet`, `LinkedHashSet`, and more. Please see the [Scala Set class documentation](https://docs.scala-lang.org/overviews/collections/sets.html) for more details on those classes.





