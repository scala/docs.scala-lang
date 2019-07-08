---
layout: multipage-overview
title: The List Class
description: This page provides examples of the Scala List class, including how to add and remove elements from a List.
partof: hello_scala
overview-name: Hello, Scala
num: 30
---


`List` is a linear, immutable sequence. All this means is that it’s a linked-list that you can’t modify. Any time you want to add or remove `List` elements, you create a new `List` from an existing `List`.


## Creating Lists

This is how you create an initial `List`:

```scala
val ints = List(1, 2, 3)
val names = List("Joel", "Chris", "Ed")
```

You can also declare the `List`’s type, if you prefer:

```scala
val ints: List[Int] = List(1, 2, 3)
val names: List[String] = List("Joel", "Chris", "Ed")
```



## Adding elements to a List

Because `List` is immutable you can’t add new elements to it. Instead you create a new list by prepending or appending elements to an existing `List`. For instance, given this `List`:

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

You *append* elements to it while creating a new list like this:

```scala
val b = a :+ 4
```

and this:

```scala
val b = a ++ Vector(4, 5)
```

Again the REPL shows how this works:

```scala
scala> val a = List(1,2,3)
a: List[Int] = List(1, 2, 3)

scala> val b = a :+ 4
b: List[Int] = List(1, 2, 3, 4)

scala> val b = a ++ Vector(4, 5)
b: List[Int] = List(1, 2, 3, 4, 5)
```

Because `List` is a singly-linked list, you should really only *prepend* elements to it; appending elements to it is relatively slow, especially when you work with large sequences.

>If you want to prepend and append elements to an immutable sequence, use `Seq` instead.

Here’s a summary of those examples:

```scala
val a = List(1,2,3)

// prepend
val b = 0 +: a
val b = List(-1, 0) ++: a

// append
val b = a :+ 4
val b = a ++ Vector(4, 5)
```

>Because `List` is a linked-list class, you shouldn’t try to access the elements of large lists by their index value. For instance, if you have a `List` with one million elements in it, accessing an element like `myList(999999)` will take a long time. If you want to access elements like this, use a `Seq` or `ArrayBuffer` instead.



## How to remember the method names

One way I remember those method names is to think that the `:` character represents the side that the sequence is on, so when I use `+:` I know that the list needs to be on the right, like this:

```scala
0 +: a
```

and when I use `:+` I know the list needs to be on the left:

```scala
a :+ 4
```

There are more technical ways to think about this, but I find this to be a good way to remember the method names.

One good thing about these method names: They’re consistent. The same method names are used with other immutable sequence classes, such as `Seq` and `Vector`.



## How to loop over lists

I showed how to loop over lists earlier in this book, but it’s worth showing the syntax again. Given a `List` like this:

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

If you’re interested in a little bit of history, the `List` class is very similar to the `List` class from the Lisp programming language. Indeed, in addition to the way I showed how to create a `List` earlier, you can also create a `List` like this:

```scala
val list = 1 :: 2 :: 3 :: Nil
```

The REPL shows how this works:

```scala
scala> val list = 1 :: 2 :: 3 :: Nil
list: List[Int] = List(1, 2, 3)
```

This works because a `List` is a singly-linked list that ends with the `Nil` element.

>For much more information, see my book, *Functional Programming, Simplified*.



## See also

For more information on how to work with `List`s, see these resources:

- [How to merge Scala Lists](https://alvinalexander.com/scala/how-merge-scala-lists-concatenate)
- [Scala List class examples: range, fill, tabulate, appending, foreach, more ...](https://alvinalexander.com/scala/scala-list-class-examples)
- *Scala Cookbook*




