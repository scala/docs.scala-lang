---
layout: multipage-overview
title: A Few Built-In Types
description: A brief introduction to Scala's built-in types.
partof: hello_scala
overview-name: Hello, Scala
num: 10
---


Scala comes with the standard numeric data types you’d expect. In Scala all of these data types are full-blown objects (not primitive data types).

These examples show how to declare variables of the basic numeric types:

```scala
val b: Byte = 1
val x: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

In the first four examples, if you don’t explicitly specify a type, the number `1` will default to an `Int`, so if you want one of the other data types — `Byte`, `Long`, or `Short` — you need to explicitly declare those types, as shown. Numbers with a decimal (like 2.0) will default to a `Double`, so if you want a `Float` you need to declare a `Float`, as shown in the last example.

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

```scala
val i = 123   // defaults to Int
val x = 1.0   // defaults to Double
```

The REPL shows that those examples default to `Int` and `Double`:

```scala
scala> val i = 123
i: Int = 123

scala> val x = 1.0
x: Double = 1.0
```

All of those data types have [the same data ranges](https://alvinalexander.com/scala/scala-data-types-bits-ranges-int-short-long-float-double) as their Java equivalents.



## BigInt and BigDecimal

For large numbers Scala also includes the types `BigInt` and `BigDecimal`:

```scala
var b = BigInt(1234567890)
var b = BigDecimal(123456.789)
```

Here’s a link for [more information about BigInt and BigDecimal](https://alvinalexander.com/scala/how-handle-very-large-numbers-scala-bigint-bigdecimal).



## String and Char

Scala also has `String` and `Char` data types, which I always declare with the implicit form:

```scala
val name = "Bill"
val c = 'a'
```

Though once again, you can use the explicit form, if you prefer:

```scala
val name: String = "Bill"
val c: Char = 'a'
```






