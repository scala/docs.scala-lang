---
type: section
layout: multipage-overview
title: The Vector Class
description: This page provides examples of the Scala 'Vector' class, including how to add and remove elements from a Vector.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 31
outof: 54
previous-page: list-class
next-page: map-class
---

[The Vector class](https://www.scala-lang.org/api/current/scala/collection/immutable/Vector.html) is an indexed, immutable sequence. The “indexed” part of the description means that you can access `Vector` elements very rapidly by their index value, such as accessing `listOfPeople(999999)`.

In general, except for the difference that `Vector` is indexed and `List` is not, the two classes work the same, so we’ll run through these examples quickly.

Here are a few ways you can create a `Vector`:

```scala
val nums = Vector(1, 2, 3, 4, 5)

val strings = Vector("one", "two")

val peeps = Vector(
    Person("Bert"),
    Person("Ernie"),
    Person("Grover")
)
```

Because `Vector` is immutable, you can’t add new elements to it. Instead you create a new sequence by appending or prepending elements to an existing `Vector`. For instance, given this `Vector`:

```scala
val a = Vector(1,2,3)
```

you *append* elements like this:

```scala
val b = a :+ 4
```

and this:

```scala
val b = a ++ Vector(4, 5)
```

The REPL shows how this works:

```scala
scala> val a = Vector(1,2,3)
a: Vector[Int] = Vector(1, 2, 3)

scala> val b = a :+ 4
b: Vector[Int] = Vector(1, 2, 3, 4)

scala> val b = a ++ Vector(4, 5)
b: Vector[Int] = Vector(1, 2, 3, 4, 5)
```

You can also *prepend* elements like this:

```scala
val b = 0 +: a
```

and this:

```scala
val b = Vector(-1, 0) ++: a
```

Once again the REPL shows how this works:

```scala
scala> val b = 0 +: a
b: Vector[Int] = Vector(0, 1, 2, 3)

scala> val b = Vector(-1, 0) ++: a
b: Vector[Int] = Vector(-1, 0, 1, 2, 3)
```

Because `Vector` is not a linked-list (like `List`), you can prepend and append elements to it, and the speed of both approaches should be similar.

Finally, you loop over elements in a `Vector` just like you do with an `ArrayBuffer` or `List`:

```scala
scala> val names = Vector("Joel", "Chris", "Ed")
val names: Vector[String] = Vector(Joel, Chris, Ed)

scala> for (name <- names) println(name)
Joel
Chris
Ed
```








