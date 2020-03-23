---
type: section
layout: multipage-overview
title: The List Class
description: This page provides examples of the Scala List class, including how to add and remove elements from a List.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 30
outof: 54
previous-page: arraybuffer-examples
next-page: vector-class
---

[The List class](https://www.scala-lang.org/api/current/scala/collection/immutable/List.html) is a linear, immutable sequence. All this means is that it’s a linked-list that you can’t modify. Any time you want to add or remove `List` elements, you create a new `List` from an existing `List`.


## Creating Lists

This is how you create an initial `List`:

```scala
val ints = List(1, 2, 3)
val names = List("Joel", "Chris", "Ed")
```

You can also declare the `List`’s type, if you prefer, though it generally isn’t necessary:

```scala
val ints: List[Int] = List(1, 2, 3)
val names: List[String] = List("Joel", "Chris", "Ed")
```



## Adding elements to a List

Because `List` is immutable, you can’t add new elements to it. Instead you create a new list by prepending or appending elements to an existing `List`. For instance, given this `List`:

```scala
val a = List(1,2,3)
```

You *prepend* elements to a `List` like this:

```scala
val b = 0 +: a
```

and this:

```scala
val b = List(-1, 0) ++: a
```

The REPL shows how this works:

```scala
scala> val b = 0 +: a
b: List[Int] = List(0, 1, 2, 3)

scala> val b = List(-1, 0) ++: a
b: List[Int] = List(-1, 0, 1, 2, 3)
```

You can also *append* elements to a `List`, but because `List` is a singly-linked list, you should really only prepend elements to it; appending elements to it is a relatively slow operation, especially when you work with large sequences.

>Tip: If you want to prepend and append elements to an immutable sequence, use `Vector` instead.

Because `List` is a linked-list class, you shouldn’t try to access the elements of large lists by their index value. For instance, if you have a `List` with one million elements in it, accessing an element like `myList(999999)` will take a long time. If you want to access elements like this, use a `Vector` or `ArrayBuffer` instead.



## How to remember the method names

These days, IDEs help us out tremendously, but one way to remember those method names is to think that the `:` character represents the side that the sequence is on, so when you use `+:` you know that the list needs to be on the right, like this:

```scala
0 +: a
```

Similarly, when you use `:+` you know the list needs to be on the left:

```scala
a :+ 4
```

There are more technical ways to think about this, this can be a simple way to remember the method names.

One good thing about these method names: they’re consistent. The same method names are used with other immutable sequence classes, such as `Seq` and `Vector`.



## How to loop over lists

We showed how to loop over lists earlier in this book, but it’s worth showing the syntax again. Given a `List` like this:

```scala
val names = List("Joel", "Chris", "Ed")
```

you can print each string like this:

```scala
for (name <- names) println(name)
```

This is what it looks like in the REPL:

```scala
scala> for (name <- names) println(name)
Joel
Chris
Ed
```

A great thing about this approach is that it works with all sequence classes, including `ArrayBuffer`, `List`, `Seq`, `Vector`, etc.



## A little bit of history

If you’re interested in a little bit of history, the `List` class is very similar to the `List` class from the Lisp programming language. Indeed, in addition to creating a `List` like this:

```scala
val ints = List(1, 2, 3)
```

you can also create the exact same list this way:

```scala
val list = 1 :: 2 :: 3 :: Nil
```

The REPL shows how this works:

```scala
scala> val list = 1 :: 2 :: 3 :: Nil
list: List[Int] = List(1, 2, 3)
```

This works because a `List` is a singly-linked list that ends with the `Nil` element.












