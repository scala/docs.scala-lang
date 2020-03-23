---
type: section
layout: multipage-overview
title: A Few Built-In Types
description: A brief introduction to Scala's built-in types.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 10
outof: 54
previous-page: type-is-optional
next-page: two-notes-about-strings
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

Those data types and their ranges are:

| Data Type     | Possible Values |
| ------------- | --------------- |
| Boolean       | `true` or `false` |
| Byte          | 8-bit signed two’s complement integer (-2^7 to 2^7-1, inclusive)<br/>-128 to 127   |
| Short         | 16-bit signed two’s complement integer (-2^15 to 2^15-1, inclusive)<br/>-32,768 to 32,767 
| Int           | 32-bit two’s complement integer (-2^31 to 2^31-1, inclusive)<br/>-2,147,483,648 to 2,147,483,647 | 
| Long          | 64-bit two’s complement integer (-2^63 to 2^63-1, inclusive)<br/>(-2^63 to 2^63-1, inclusive)   |
| Float         | 32-bit IEEE 754 single-precision float<br/>1.40129846432481707e-45 to 3.40282346638528860e+38 |
| Double        | 64-bit IEEE 754 double-precision float<br/>4.94065645841246544e-324d to 1.79769313486231570e+308d |
| Char          | 16-bit unsigned Unicode character (0 to 2^16-1, inclusive)<br/>0 to 65,535 |
| String        | a sequence of `Char` |



## BigInt and BigDecimal

For large numbers Scala also includes the types `BigInt` and `BigDecimal`:

```scala
var b = BigInt(1234567890)
var b = BigDecimal(123456.789)
```

A great thing about `BigInt` and `BigDecimal` is that they support all the operators you’re used to using with numeric types:

```scala
scala> var b = BigInt(1234567890)
b: scala.math.BigInt = 1234567890

scala> b + b
res0: scala.math.BigInt = 2469135780

scala> b * b
res1: scala.math.BigInt = 1524157875019052100

scala> b += 1

scala> println(b)
1234567891
```


## String and Char

Scala also has `String` and `Char` data types, which you can generally declare with the implicit form:

```scala
val name = "Bill"
val c = 'a'
```

Though once again, you can use the explicit form, if you prefer:

```scala
val name: String = "Bill"
val c: Char = 'a'
```

As shown, enclose strings in double-quotes and a character in single-quotes.







