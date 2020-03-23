---
type: section
layout: multipage-overview
title: The ArrayBuffer Class
description: This page provides examples of how to use the Scala ArrayBuffer class, including adding and removing elements.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 29
outof: 54
previous-page: collections-101
next-page: list-class
---


If you’re an OOP developer coming to Scala from Java, the `ArrayBuffer` class will probably be most comfortable for you, so we’ll demonstrate it first. It’s a *mutable* sequence, so you can use its methods to modify its contents, and those methods are similar to methods on Java sequences.

To use an `ArrayBuffer` you must first import it:

```scala
import scala.collection.mutable.ArrayBuffer
```

After it’s imported into the local scope, you create an empty `ArrayBuffer` like this:

```scala
val ints = ArrayBuffer[Int]()
val names = ArrayBuffer[String]()
```

Once you have an `ArrayBuffer` you add elements to it in a variety of ways:

```scala
val ints = ArrayBuffer[Int]()
ints += 1
ints += 2
```

The REPL shows how `+=` works:

```scala
scala> ints += 1
res0: ints.type = ArrayBuffer(1)

scala> ints += 2
res1: ints.type = ArrayBuffer(1, 2)
```

That’s just one way create an `ArrayBuffer` and add elements to it. You can also create an `ArrayBuffer` with initial elements like this:

```scala
val nums = ArrayBuffer(1, 2, 3)
```

Here are a few ways you can add more elements to this `ArrayBuffer`:

```scala
// add one element
nums += 4

// add multiple elements
nums += 5 += 6

// add multiple elements from another collection
nums ++= List(7, 8, 9)
```

You remove elements from an `ArrayBuffer` with the `-=` and `--=` methods:

```scala
// remove one element
nums -= 9

// remove multiple elements
nums -= 7 -= 8

// remove multiple elements using another collection
nums --= Array(5, 6)
```

Here’s what all of those examples look like in the REPL:

```scala
scala> import scala.collection.mutable.ArrayBuffer

scala> val nums = ArrayBuffer(1, 2, 3)
val nums: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3)

scala> nums += 4
val res0: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4)

scala> nums += 5 += 6
val res1: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4, 5, 6)

scala> nums ++= List(7, 8, 9)
val res2: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8, 9)

scala> nums -= 9
val res3: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8)

scala> nums -= 7 -= 8
val res4: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4, 5, 6)

scala> nums --= Array(5, 6)
val res5: ArrayBuffer[Int] = ArrayBuffer(1, 2, 3, 4)
```



## More ways to work with `ArrayBuffer`

As a brief overview, here are several methods you can use with an `ArrayBuffer`:

```scala
val a = ArrayBuffer(1, 2, 3)         // ArrayBuffer(1, 2, 3)
a.append(4)                          // ArrayBuffer(1, 2, 3, 4)
a.append(5, 6)                       // ArrayBuffer(1, 2, 3, 4, 5, 6)
a.appendAll(Seq(7,8))                // ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8)
a.clear                              // ArrayBuffer()

val a = ArrayBuffer(9, 10)           // ArrayBuffer(9, 10)
a.insert(0, 8)                       // ArrayBuffer(8, 9, 10)
a.insertAll(0, Vector(4, 5, 6, 7))   // ArrayBuffer(4, 5, 6, 7, 8, 9, 10)
a.prepend(3)                         // ArrayBuffer(3, 4, 5, 6, 7, 8, 9, 10)
a.prepend(1, 2)                      // ArrayBuffer(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
a.prependAll(Array(0))               // ArrayBuffer(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

val a = ArrayBuffer.range('a', 'h')  // ArrayBuffer(a, b, c, d, e, f, g)
a.remove(0)                          // ArrayBuffer(b, c, d, e, f, g)
a.remove(2, 3)                       // ArrayBuffer(b, c, g)

val a = ArrayBuffer.range('a', 'h')  // ArrayBuffer(a, b, c, d, e, f, g)
a.trimStart(2)                       // ArrayBuffer(c, d, e, f, g)
a.trimEnd(2)                         // ArrayBuffer(c, d, e)
```









