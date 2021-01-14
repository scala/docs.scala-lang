---
title: Inferred Types
type: section
description: This section introduces and demonstrates inferred types in Scala 3
num: 48
previous-page: types-introduction
next-page: types-generics
---


As with other statically typed programming languages, in Scala you can _declare_ a type when creating a new variable:

```scala
val x: Int = 1
val x: Double = 1
```

In those examples the types are _explicitly_ declared to be `Int` and `Double`, respectively.
However, in Scala you generally don’t have to declare the type when defining value binders:

```scala
val a = 1
val b = List(1, 2, 3)
val m = Map(1 -> "one", 2 -> "two")
```

When you do this, Scala _infers_ the types, as shown in the following REPL interaction:

```scala
scala> val a = 1
val a: Int = 1

scala> val b = List(1, 2, 3)
val b: List[Int] = List(1, 2, 3)

scala> val m = Map(1 -> "one", 2 -> "two")
val m: Map[Int, String] = Map(1 -> one, 2 -> two)
```

Indeed, most variables are defined this way, and Scala’s ability to automatically infer types is one feature that makes it _feel_ like a dynamically typed language.
