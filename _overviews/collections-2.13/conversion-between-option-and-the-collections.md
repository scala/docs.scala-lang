---
layout: multipage-overview
title: Conversion Between Option and the Collections
partof: collections-213
overview-name: Collections

num: 18
previous-page: conversions-between-java-and-scala-collections

permalink: /overviews/collections-2.13/:title.html
---
`Option` can be seen as a collection that has zero or exactly one element, and it provides a degree of interoperability with the collection types found in the package `scala.collection`. In particular, it implements the interface `IterableOnce`, which models the simplest form of collections: something that can be iterated over, at least once. However, `Option` does not implement the more comprehensive interface of `Iterable`. Indeed, we cannot provide a sensible implementation for the operation [`fromSpecific`](https://github.com/scala/scala/blob/6c68c2825e893bb71d6dc78465ac8c6f415cbd93/src/library/scala/collection/Iterable.scala#L173), which is supposed to create an `Option` from a collection of possibly more than one element. Starting from [Scala 2.13](https://github.com/scala/scala/pull/8038), `Option` was made an `IterableOnce` but not an `Iterable`.

Hence `Option` can be used everywhere an `IterableOnce` is expected, for example, when calling `flatMap` on a collection (or inside a for-comprehension)

```scala mdoc
for {
  a <- Set(1)
  b <- Option(41)
} yield (a + b)
// : Set[Int] = Set(42)
``` 

since the operation `flatMap` on the type `Set[Int]` takes a function returning an `IterableOnce`:

```
def flatMap[B](f: Int => IterableOnce[B]): Set[B]
```

Although `Option` does not extend `Iterable`, there exists an [implicit conversion](https://github.com/scala/scala/blob/6c68c2825e893bb71d6dc78465ac8c6f415cbd93/src/library/scala/Option.scala#L19) between `Option` and `Iterable`


```
implicit def option2Iterable[A](xo: Option[A]): Iterable[A]
```

so although `Option[A]` is not a full collection it can be _viewed_ as one. For example,

```scala mdoc
Some(42).drop(1)
// : Iterable[Int] = List()
```

expands to

```scala mdoc
Option.option2Iterable(Some(42)).drop(1)
// : Iterable[Int] = List()
```

because `drop` is not defined on `Option`. A downside of the above implicit conversion is that instead of getting back an `Option[A]` we are left with an `Iterable[A]`. For this reason, `Option`’s documentation carries the following note:

> Many of the methods in `Option` are duplicative with those in the `Iterable` hierarchy, but they are duplicated for a reason: the implicit conversion tends to leave one with an `Iterable` in situations where one could have retained an `Option`.
