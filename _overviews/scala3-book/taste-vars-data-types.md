---
title: Variables and Data Types
type: section
description: This section demonstrates val and var variables, and some common Scala data types.
languages: [zh-cn]
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

{% tabs var-express-1 %}
{% tab 'Scala 2 and 3' %}

```scala
// immutable
val a = 0

// mutable
var b = 1
```
{% endtab %}
{% endtabs %}

In an application, a `val` can’t be reassigned.
You’ll cause a compiler error if you try to reassign one:

{% tabs var-express-2 %}
{% tab 'Scala 2 and 3' %}

```scala
val msg = "Hello, world"
msg = "Aloha"   // "reassignment to val" error; this won’t compile
```
{% endtab %}
{% endtabs %}

Conversely, a `var` can be reassigned:

{% tabs var-express-3 %}
{% tab 'Scala 2 and 3' %}

```scala
var msg = "Hello, world"
msg = "Aloha"   // this compiles because a var can be reassigned
```
{% endtab %}
{% endtabs %}

## Declaring variable types

When you create a variable you can explicitly declare its type, or let the compiler infer the type:

{% tabs var-express-4 %}
{% tab 'Scala 2 and 3' %}

```scala
val x: Int = 1   // explicit
val x = 1        // implicit; the compiler infers the type
```
{% endtab %}
{% endtabs %}

The second form is known as _type inference_, and it’s a great way to help keep this type of code concise.
The Scala compiler can usually infer the data type for you, as shown in the output of these REPL examples:

{% tabs var-express-5 %}
{% tab 'Scala 2 and 3' %}

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1, 2, 3)
val nums: List[Int] = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

You can always explicitly declare a variable’s type if you prefer, but in simple assignments like these it isn’t necessary:

{% tabs var-express-6 %}
{% tab 'Scala 2 and 3' %}

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = Person("Richard")
```
{% endtab %}
{% endtabs %}

Notice that with this approach, the code feels more verbose than necessary.

{% comment %}
TODO: Jonathan had an early comment on the text below: “While it might feel like this, I would be afraid that people automatically assume from this statement that everything is always boxed.” Suggestion on how to change this?
{% endcomment %}

## Built-in data types

Scala comes with the standard numeric data types you’d expect, and they’re all full-blown instances of classes.
In Scala, everything is an object.

These examples show how to declare variables of the numeric types:

{% tabs var-express-7 %}
{% tab 'Scala 2 and 3' %}

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```
{% endtab %}
{% endtabs %}

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

{% tabs var-express-8 %}
{% tab 'Scala 2 and 3' %}

```scala
val i = 123   // defaults to Int
val j = 1.0   // defaults to Double
```
{% endtab %}
{% endtabs %}

In your code you can also append the characters `L`, `D`, and `F` (and their lowercase equivalents) to numbers to specify that they are `Long`, `Double`, or `Float` values:

{% tabs var-express-9 %}
{% tab 'Scala 2 and 3' %}

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```
{% endtab %}
{% endtabs %}

When you need really large numbers, use the `BigInt` and `BigDecimal` types:

{% tabs var-express-10 %}
{% tab 'Scala 2 and 3' %}

```scala
var a = BigInt(1_234_567_890_987_654_321L)
var b = BigDecimal(123_456.789)
```
{% endtab %}
{% endtabs %}

Where `Double` and `Float` are approximate decimal numbers, `BigDecimal` is used for precise arithmetic.

Scala also has `String` and `Char` data types:

{% tabs var-express-11 %}
{% tab 'Scala 2 and 3' %}

```scala
val name = "Bill"   // String
val c = 'a'         // Char
```
{% endtab %}
{% endtabs %}

### Strings

Scala strings are similar to Java strings, but they have two great additional features:

- They support string interpolation
- It’s easy to create multiline strings

#### String interpolation

String interpolation provides a very readable way to use variables inside strings.
For instance, given these three variables:

{% tabs var-express-12 %}
{% tab 'Scala 2 and 3' %}

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```
{% endtab %}
{% endtabs %}

You can combine those variables in a string like this:

{% tabs var-express-13 %}
{% tab 'Scala 2 and 3' %}

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```
{% endtab %}
{% endtabs %}

Just precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string.

To embed arbitrary expressions inside a string, enclose them in curly braces:

{% tabs var-express-14 %}
{% tab 'Scala 2 and 3' %}

``` scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"

val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
```
{% endtab %}
{% endtabs %}

The `s` that you place before the string is just one possible interpolator.
If you use an `f` instead of an `s`, you can use `printf`-style formatting syntax in the string.
Furthermore, a string interpolator is just a special method and it is possible to define your own.
For instance, some database libraries define the very powerful `sql` interpolator.

#### Multiline strings

Multiline strings are created by including the string inside three double-quotes:

{% tabs var-express-15 %}
{% tab 'Scala 2 and 3' %}

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```
{% endtab %}
{% endtabs %}

> For more details on string interpolators and multiline strings, see the [“First Look at Types” chapter][first-look].

[first-look]: {% link _overviews/scala3-book/first-look-at-types.md %}
