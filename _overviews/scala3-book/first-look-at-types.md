---
title: A First Look at Types
type: chapter
description: This page provides a brief introduction to Scala's built-in data types, including Int, Double, String, Long, Any, AnyRef, Nothing, and Null.
languages: [ru, zh-cn]
num: 17
previous-page: taste-summary
next-page: string-interpolation
---


## All values have a type

In Scala, all values have a type, including numerical values and functions.
The diagram below illustrates a subset of the type hierarchy.

<a href="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg" alt="Scala 3 Type Hierarchy"></a>

## Scala type hierarchy

`Any` is the supertype of all types, also called the **top type**.
It defines certain universal methods such as `equals`, `hashCode`, and `toString`.

The top-type `Any` has a subtype [`Matchable`][matchable], which is used to mark all types that we can perform pattern matching on. It is important to guarantee a property call _"parametricity"_.
We will not go into details here, but in summary, it means that we cannot pattern match on values of type `Any`, but only on values that are a subtype of `Matchable`.
The [reference documentation][matchable] contains more information about `Matchable`.

`Matchable` has two important subtypes: `AnyVal` and `AnyRef`.

*`AnyVal`* represents value types.
There are a couple of predefined value types, and they are non-nullable: `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit`, and `Boolean`.
`Unit` is a value type which carries no meaningful information.
There is exactly one instance of `Unit` which we can refer to as: `()`.

*`AnyRef`* represents reference types.
All non-value types are defined as reference types.
Every user-defined type in Scala is a subtype of `AnyRef`.
If Scala is used in the context of a Java runtime environment, `AnyRef` corresponds to `java.lang.Object`.

In statement-based languages, `void` is used for methods that don’t return anything.
If you write methods in Scala that have no return value, such as the following method, `Unit` is used for the same purpose:

{% tabs unit %}
{% tab 'Scala 2 and 3' for=unit %}
```scala
def printIt(a: Any): Unit = println(a)
```
{% endtab %}
{% endtabs %}

Here’s an example that demonstrates that strings, integers, characters, boolean values, and functions are all instances of `Any` and can be treated just like every other object:

{% tabs any %}
{% tab 'Scala 2 and 3' for=any %}
```scala
val list: List[Any] = List(
  "a string",
  732,  // an integer
  'c',  // a character
  '\'', // a character with a backslash escape
  true, // a boolean value
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```
{% endtab %}
{% endtabs %}

The code defines a value `list` of type `List[Any]`.
The list is initialized with elements of various types, but each is an instance of `scala.Any`, so we can add them to the list.

Here’s the output of the program:

```
a string
732
c
'
true
<function>
```

## Scala’s “value types”

As shown above, Scala’s numeric types extend `AnyVal`, and they’re all full-blown objects.
These examples show how to declare variables of these numeric types:

{% tabs anyval %}
{% tab 'Scala 2 and 3' for=anyval %}
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

In the first four examples, if you don’t explicitly specify a type, the number `1` will default to an `Int`, so if you want one of the other data types---`Byte`, `Long`, or `Short`---you need to explicitly declare those types, as shown.
Numbers with a decimal (like 2.0) will default to a `Double`, so if you want a `Float` you need to declare a `Float`, as shown in the last example.

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

{% tabs anynum %}
{% tab 'Scala 2 and 3' for=anynum %}
```scala
val i = 123   // defaults to Int
val x = 1.0   // defaults to Double
```
{% endtab %}
{% endtabs %}

In your code you can also append the characters `L`, `D`, and `F` (and their lowercase equivalents) to numbers to specify that they are `Long`, `Double`, or `Float` values:

{% tabs type-post %}
{% tab 'Scala 2 and 3' for=type-post %}
```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = -3.3F    // val z: Float = -3.3
```

You may also use hexadecimal notation to format integer numbers (normally `Int`, but which also support the
`L` suffix to specify that they are `Long`):

```scala
val a = 0xACE    // val a: Int = 2766
val b = 0xfd_3aL // val b: Long = 64826
```

Scala supports many different ways to format the same floating point number, e.g.
```scala
val q = .25      // val q: Double = 0.25
val r = 2.5e-1   // val r: Double = 0.25
val s = .0025e2F // val s: Float = 0.25
```
{% endtab %}
{% endtabs %}

Scala also has `String` and `Char` types, which you can generally declare with the implicit form:

{% tabs type-string %}
{% tab 'Scala 2 and 3' for=type-string %}
```scala
val s = "Bill"
val c = 'a'
```
{% endtab %}
{% endtabs %}

As shown, enclose strings in double-quotes---or triple-quotes for multiline strings---and enclose a character in single-quotes.

Those data types and their ranges are:

| Data Type | Possible Values                                                                                  |
|-----------|--------------------------------------------------------------------------------------------------|
| Boolean   | `true` or `false`                                                                                |
| Byte      | 8-bit signed two’s complement integer (-2^7 to 2^7-1, inclusive)<br/>-128 to 127                 |
| Short     | 16-bit signed two’s complement integer (-2^15 to 2^15-1, inclusive)<br/>-32,768 to 32,767        |
| Int       | 32-bit two’s complement integer (-2^31 to 2^31-1, inclusive)<br/>-2,147,483,648 to 2,147,483,647 |
| Long      | 64-bit two’s complement integer (-2^63 to 2^63-1, inclusive)<br/>(-2^63 to 2^63-1, inclusive)    |
| Float     | 32-bit IEEE 754 single-precision float<br/>1.40129846432481707e-45 to 3.40282346638528860e+38    |
| Double    | 64-bit IEEE 754 double-precision float<br/>4.94065645841246544e-324 to 1.79769313486231570e+308  |
| Char      | 16-bit unsigned Unicode character (0 to 2^16-1, inclusive)<br/>0 to 65,535                       |
| String    | a sequence of `Char`                                                                             |

## Strings

Scala strings are similar to Java strings though unlike Java (at least before Java 15),
it's easy to create multiline strings with triple quotes:

{% tabs string-mlines1 %}
{% tab 'Scala 2 and 3' for=string-mlines1 %}
```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```
{% endtab %}
{% endtabs %}

One drawback of this basic approach is that the lines after the first line are indented, and look like this:

{% tabs string-mlines2 %}
{% tab 'Scala 2 and 3' for=string-mlines2 %}
```scala
"The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."
```
{% endtab %}
{% endtabs %}

When spacing is important, put a `|` symbol in front of all lines after the first line, and call the `stripMargin` method after the string:

{% tabs string-mlines3 %}
{% tab 'Scala 2 and 3' for=string-mlines3 %}
```scala
val quote = """The essence of Scala:
               |Fusion of functional and object-oriented
               |programming in a typed setting.""".stripMargin
```
{% endtab %}
{% endtabs %}

Now all of the lines are left-justified inside the string:

{% tabs string-mlines4 %}
{% tab 'Scala 2 and 3' for=string-mlines4 %}
```scala
"The essence of Scala:
Fusion of functional and object-oriented
programming in a typed setting."
```
{% endtab %}
{% endtabs %}

Scala strings also support powerful string interpolation methods, which we'll talk about
in the [next chapter][string-interpolation].

## `BigInt` and `BigDecimal`

When you need really large numbers, use the `BigInt` and `BigDecimal` types:

{% tabs type-bigint %}
{% tab 'Scala 2 and 3' for=type-bigint %}
```scala
val a = BigInt(1_234_567_890_987_654_321L)
val b = BigDecimal(123_456.789)
```
{% endtab %}
{% endtabs %}

Where `Double` and `Float` are approximate decimal numbers, `BigDecimal` is used for precise arithmetic, such as when working with currency.

A great thing about `BigInt` and `BigDecimal` is that they support all the operators you’re used to using with numeric types:

{% tabs type-bigint2 %}
{% tab 'Scala 2 and 3' for=type-bigint2 %}
```scala
val b = BigInt(1234567890)   // scala.math.BigInt = 1234567890
val c = b + b                // scala.math.BigInt = 2469135780
val d = b * b                // scala.math.BigInt = 1524157875019052100
```
{% endtab %}
{% endtabs %}

## Type casting

Value types can be cast in the following way:
<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

For example:

{% tabs cast1 %}
{% tab 'Scala 2 and 3' for=cast1 %}
```scala
val b: Byte = 127
val i: Int = b  // 127

val face: Char = '☺'
val number: Int = face  // 9786
```
{% endtab %}
{% endtabs %}

You can only cast to a type if there is no loss of information. Otherwise, you need to be explicit about the cast:

{% tabs cast2 %}
{% tab 'Scala 2 and 3' for=cast2 %}
```scala
val x: Long = 987654321
val y: Float = x.toFloat  // 9.8765434E8 (note that `.toFloat` is required because the cast results in precision loss)
val z: Long = y  // Error
```
{% endtab %}
{% endtabs %}

You can also cast a reference type to a subtype.
This will be covered later in the tour.

## `Nothing` and `null`

`Nothing` is a subtype of all types, also called the **bottom type**.
There is no value that has the type `Nothing`.
A common use is to signal non-termination, such as a thrown exception, program exit, or an infinite loop---i.e., it is the type of an expression which does not evaluate to a value, or a method that does not return normally.

`Null` is a subtype of all reference types (i.e. any subtype of `AnyRef`).
It has a single value identified by the keyword literal `null`.
Currently, the usage of `null` is considered bad practice. It should be used mostly for interoperability with other JVM languages. An opt-in compiler option changes the status of `Null` to fix the caveats related to its usage. This option might become the default in a future version of Scala. You can learn more about it [here][safe-null].

In the meantime, `null` should almost never be used in Scala code.
Alternatives to `null` are discussed in the [Functional Programming chapter][fp] of this book, and the [API documentation][option-api].

[reference]: {{ site.scala3ref }}/overview.html
[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
[fp]: {% link _overviews/scala3-book/fp-intro.md %}
[string-interpolation]: {% link _overviews/scala3-book/string-interpolation.md %}
[option-api]: https://scala-lang.org/api/3.x/scala/Option.html
[safe-null]: {{ site.scala3ref }}/experimental/explicit-nulls.html
