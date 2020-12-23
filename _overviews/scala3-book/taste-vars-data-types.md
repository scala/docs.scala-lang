---
title: Variables and Data Types
type: section
description: This section demonstrates val and var variables, and some common Scala data types.
num: 7
previous-page: taste-repl
next-page: taste-control-structures
---



This section provides a look at Scala variables and data types.


## Two types of variables

When you create a new variable in Scala, you declare whether the variable is immutable or mutable:

<table>
  <thead>
    <tr>
      <th>Variable Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top"><code>val</code></td>
      <td valign="top">Creates an <em>immutable</em> variable&mdash;like <code>final</code> in Java. You should always create a variable with <code>val</code>, unless there’s a reason you need a mutable variable.</td>
    </tr>
    <tr>
      <td><code>var</code></td>
      <td>Creates a <em>mutable</em> variable, and should only be used when a variable’s contents will change over time.</td>
    </tr>
  </tbody>
</table>

These examples show how to create `val` and `var` variables:

```scala
// immutable
val a = 0

// mutable
var b = 1
```

In an application, a `val` can’t be reassigned.
You’ll cause a compiler error if you try to reassign one:

```scala
val msg = "Hello, world"
msg = "Aloha"   // "reassignment to val" error; this won’t compile
```

Conversely, a `var` can be reassigned:

```scala
var msg = "Hello, world"
msg = "Aloha"   // this compiles because a var can be reassigned
```



## Declaring variable types

When you create a variable you can explicitly declare its type, or let the compiler infer the type:

```scala
val x: Int = 1   // explicit
val x = 1        // implicit; the compiler infers the type
```

The second form is known as _type inference_, and it’s a great way to help keep this type of code concise.
The Scala compiler can usually infer the data type for you, as shown in the output of these REPL examples:

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1, 2, 3)
val nums: List[Int] = List(1, 2, 3)
```

You can always explicitly declare a variable’s type if you prefer, but in simple assignments like these it isn’t necessary:

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = Person("Richard")
```

Notice that with this approach, the code feels more verbose than necessary.



{% comment %}
TODO: Jonathan had an early comment on the text below: “While it might feel like this, I would be afraid that people automatically assume from this statement that everything is always boxed.” Suggestion on how to change this?
{% endcomment %}

## Built-in data types

Scala comes with the standard numeric data types you’d expect, and they’re all full-blown instances of classes.
In Scala, everything is an object.

These examples show how to declare variables of the numeric types:

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

```scala
val i = 123   // defaults to Int
val j = 1.0   // defaults to Double
```

In your code you can also append the characters `L`, `D`, and `F` (and their lowercase equivalents) to numbers to specify that they are `Long`, `Double`, or `Float` values:

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```

When you need really large numbers, use the `BigInt` and `BigDecimal` types:

```scala
var a = BigInt(1_234_567_890_987_654_321L)
var b = BigDecimal(123_456.789)
```

Where `Double` and `Float` are approximate decimal numbers, `BigDecimal` is used for precise arithmetic.

Scala also has `String` and `Char` data types:

```scala
val name = "Bill"   // String
val c = 'a'         // Char
```


### Strings

Scala strings are similar to Java strings, but they have two great additional features:

- They support string interpolation
- It’s easy to create multiline strings

#### String interpolation

String interpolation provides a very readable way to use variables inside strings.
For instance, given these three variables:

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

You can combine those variables in a string like this:

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```

Just precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string.

To embed arbitrary expressions inside a string, enclose them in curly braces:

``` scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"

val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
```

The `s` that you place before the string is just one possible interpolator.
If you use an `f` instead of an `s`, you can use `printf`-style formatting syntax in the string.
Furthermore, a string interpolator is a just special method and it is possible to define your own.
For instance, some database libraries define the very powerful `sql` interpolator.

#### Multiline strings

Multiline strings are created by including the string inside three double-quotes:

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```

> For more details on string interpolators and multiline strings, see the [“First Look at Types” chapter][first-look].




[first-look]: {% link _overviews/scala3-book/first-look-at-types.md %}
