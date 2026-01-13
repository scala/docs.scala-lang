---
title: String Interpolation
type: chapter
description: This page provides more information about creating strings and using string interpolation.
languages: [ru, zh-cn]
num: 18
previous-page: first-look-at-types
next-page: control-structures
redirect_from:
  - /overviews/core/string-interpolation.html
---

## Introduction

String interpolation provides a way to use variables inside strings.
For instance:

{% tabs example-1 %}
{% tab 'Scala 2 and 3' for=example-1 %}
```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```
{% endtab %}
{% endtabs %}

Using string interpolation consists of putting an `s` in front of your string
quotes, and prefixing any variable names with a `$` symbol.

## String Interpolators

The `s` that you place before the string is just one possible interpolator that Scala
provides.

Scala provides three string interpolation methods out of the box:  `s`, `f` and `raw`.
Further, a string interpolator is just a special method, so it is possible to define your
own. For instance, some database libraries define a `sql` interpolator that returns a
database query.

### The `s` Interpolator (`s`-Strings)

Prepending `s` to any string literal allows the usage of variables directly in the string. You've already seen an example here:

{% tabs example-2 %}
{% tab 'Scala 2 and 3' for=example-2 %}
```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```
{% endtab %}
{% endtabs %}

Here, the `$name` and `$age` placeholders in the string are replaced by the results of
calling `name.toString` and `age.toString`, respectively. The `s`-String will have
access to all variables that are currently in scope.

While it may seem obvious, it's important to note here that string interpolation will _not_ happen in normal string literals:

{% tabs example-3 %}
{% tab 'Scala 2 and 3' for=example-3 %}
```scala
val name = "James"
val age = 30
println("$name is $age years old")   // "$name is $age years old"
```
{% endtab %}
{% endtabs %}

String interpolators can also take arbitrary expressions. For example:

{% tabs example-4 %}
{% tab 'Scala 2 and 3' for=example-4 %}
```scala
println(s"2 + 2 = ${2 + 2}")   // "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // "x.abs = 1"
```
{% endtab %}
{% endtabs %}

Any arbitrary expression can be embedded in `${}`.

For some special characters, it is necessary to escape them when embedded within a string.
To represent an actual dollar sign you can double it `$$`, like here:

{% tabs example-5 %}
{% tab 'Scala 2 and 3' for=example-5 %}
```scala
println(s"New offers starting at $$14.99")   // "New offers starting at $14.99"
```
{% endtab %}
{% endtabs %}

Double quotes also need to be escaped. This can be done by using triple quotes as shown:

{% tabs example-6 %}
{% tab 'Scala 2 and 3' for=example-6 %}
```scala
println(s"""{"name":"James"}""")     // `{"name":"James"}`
```
{% endtab %}
{% endtabs %}

Finally, all multi-line string literals can also be interpolated

{% tabs example-7 %}
{% tab 'Scala 2 and 3' for=example-7 %}
```scala
println(s"""name: "$name",
           |age: $age""".stripMargin)
```

This will print as follows:

```
name: "James"
age: 30
```
{% endtab %}
{% endtabs %}

### The `f` Interpolator (`f`-Strings)

Prepending `f` to any string literal allows the creation of simple formatted strings, similar to `printf` in other languages.  When using the `f`
interpolator, all variable references should be followed by a `printf`-style format string, like `%d`. Let's look at an example:

{% tabs example-8 %}
{% tab 'Scala 2 and 3' for=example-8 %}
```scala
val height = 1.9d
val name = "James"
println(f"$name%s is $height%2.2f meters tall")  // "James is 1.90 meters tall"
```
{% endtab %}
{% endtabs %}

The `f` interpolator is typesafe.  If you try to pass a format string that only works for integers but pass a double, the compiler will issue an
error.  For example:

{% tabs f-interpolator-error class=tabs-scala-version %}

{% tab 'Scala 2' for=f-interpolator-error %}
```scala
val height: Double = 1.9d

scala> f"$height%4d"
<console>:9: error: type mismatch;
  found   : Double
  required: Int
            f"$height%4d"
              ^
```
{% endtab %}

{% tab 'Scala 3' for=f-interpolator-error %}
```scala
val height: Double = 1.9d

scala> f"$height%4d"
-- Error: ----------------------------------------------------------------------
1 |f"$height%4d"
  |   ^^^^^^
  |   Found: (height : Double), Required: Int, Long, Byte, Short, BigInt
1 error found

```
{% endtab %}
{% endtabs %}

The `f` interpolator makes use of the string format utilities available from Java.   The formats allowed after the `%` character are outlined in the
[Formatter javadoc][java-format-docs]. If there is no `%` character after a variable
definition a formatter of `%s` (`String`) is assumed.

Finally, as in Java, use `%%` to get a literal `%` character in the output string:

{% tabs literal-percent %}
{% tab 'Scala 2 and 3' for=literal-percent %}
```scala
println(f"3/19 is less than 20%%")  // "3/19 is less than 20%"
```
{% endtab %}
{% endtabs %}

### The `raw` Interpolator

The raw interpolator is similar to the `s` interpolator except that it performs no escaping of literals within the string.  Here's an example processed string:

{% tabs example-9 %}
{% tab 'Scala 2 and 3' for=example-9 %}
```scala
scala> s"a\nb"
res0: String =
a
b
```
{% endtab %}
{% endtabs %}

Here the `s` string interpolator replaced the characters `\n` with a return character. The `raw` interpolator will not do that.

{% tabs example-10 %}
{% tab 'Scala 2 and 3' for=example-10 %}
```scala
scala> raw"a\nb"
res1: String = a\nb
```
{% endtab %}
{% endtabs %}

The raw interpolator is useful when you want to avoid having expressions like `\n` turn into a return character.

Furthermore, the raw interpolator allows the usage of variables, which are replaced with their value, just as the s interpolator.

{% tabs example-11 %}
{% tab 'Scala 2 and 3' for=example-11 %}
```scala
scala> val foo = 42
scala> raw"a\n$foo"
res1: String = a\n42
```
{% endtab %}
{% endtabs %}

## Advanced Usage

In addition to the three default string interpolators, users can define their own.

The literal `s"Hi $name"` is parsed by Scala as a _processed_ string literal.
This means that the compiler does some additional work to this literal. The specifics
of processed strings and string interpolation are described in [SIP-11][sip-11], but
here's a quick example to help illustrate how they work.

### Custom Interpolators

In Scala, all processed string literals are simple code transformations. Anytime the compiler encounters a processed string literal of the form:

{% tabs example-12 %}
{% tab 'Scala 2 and 3' for=example-12 %}
```scala
id"string content"
```
{% endtab %}
{% endtabs %}

it transforms it into a method call (`id(...)`) on an instance of [StringContext](https://www.scala-lang.org/api/current/scala/StringContext.html).
This method can also be available on implicit scope.
To define our own string interpolation, we need to create an implicit class (Scala 2) or an `extension` method (Scala 3) that adds a new method to `StringContext`.

As a trivial example, let's assume we have a simple `Point` class and want to create a custom interpolator that turns `p"a,b"` into a `Point` object.

{% tabs custom-interpolator-1 %}
{% tab 'Scala 2 and 3' for=custom-interpolator-1 %}
```scala
case class Point(x: Double, y: Double)

val pt = p"1,-2"     // Point(1.0,-2.0)
```
{% endtab %}
{% endtabs %}

We'd create a custom `p`-interpolator by first implementing a `StringContext` extension
with something like:

{% tabs custom-interpolator-2 class=tabs-scala-version %}

{% tab 'Scala 2' for=custom-interpolator-2 %}
```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Any*): Point = ???
}
```

**Note:** It's important to extend `AnyVal` in Scala 2.x to prevent runtime instantiation on each interpolation. See the [value class]({% link _overviews/core/value-classes.md %}) documentation for more.

{% endtab %}

{% tab 'Scala 3' for=custom-interpolator-2 %}
```scala
extension (sc: StringContext)
  def p(args: Any*): Point = ???
```
{% endtab %}

{% endtabs %}

Once this extension is in scope and the Scala compiler encounters `p"some string"`, it
will process `some string` to turn it into String tokens and expression arguments for
each embedded variable in the string.

For example, `p"1, $someVar"` would turn into:

{% tabs extension-desugaring class=tabs-scala-version %}

{% tab 'Scala 2' for=extension-desugaring %}
```scala
new StringContext("1, ", "").p(someVar)
```

The implicit class is then used to rewrite it to the following:

```scala
new PointHelper(new StringContext("1, ", "")).p(someVar)
```
{% endtab %}

{% tab 'Scala 3' for=extension-desugaring %}
```scala
StringContext("1, ","").p(someVar)
```
{% endtab %}

{% endtabs %}

As a result, each of the fragments of the processed String are exposed in the
`StringContext.parts` member, while any expressions values in the string are passed in
to the method's `args` parameter.


#### Example Implementation

A naive implementation of our Point interpolator method might look something like below,
though a more sophisticated method may choose to have more precise control over the
processing of the string `parts` and expression `args` instead of reusing the
`s`-Interpolator.

{% tabs naive-implementation class=tabs-scala-version %}

{% tab 'Scala 2' for=naive-implementation %}
```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Double*): Point = {
    // reuse the `s`-interpolator and then split on ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }
}

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```
{% endtab %}

{% tab 'Scala 3' for=naive-implementation %}
```scala
extension (sc: StringContext)
  def p(args: Double*): Point = {
    // reuse the `s`-interpolator and then split on ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```
{% endtab %}
{% endtabs %}

While string interpolators were originally used to create some form of a String, the use
of custom interpolators as above can allow for powerful syntactic shorthand, and the
community has already made swift use of this syntax for things like ANSI terminal color
expansion, executing SQL queries, magic `$"identifier"` representations, and many others.

### Pattern Matching

It is also possible to use string interpolation in patterns, for both built-in and user-defined interpolators:
{% tabs example-pat-match %}

{% tab 'Scala 2' for=example-pat-match %}
```scala
some_value match {
  case s"Hello, $name!" => // Executes for Strings which start with "Hello, " and end in "!"
  case p"$a, 0" => // Executes for example for Points whose second coordinate is 0
}
```
{% endtab %}

{% tab 'Scala 3' for=example-pat-match %}
```scala
some_value match
  case s"Hello, $name!" => // Executes for Strings which start with "Hello, " and end in "!"
  case p"$a, 0" => // Executes for example for Points whose second coordinate is 0
```
{% endtab %}

{% endtabs %}

Note however there are not extractors by default for the `f` and `raw` interpolators, so neither `case f"..."` nor `case raw"..."` will work.
(Unless a library provided them.)

Anytime the compiler encounters a processed string pattern of the form:

{% tabs example-pattern %}
{% tab 'Scala 2 and 3' for=example-pattern %}
```scala
id"string content"
```
{% endtab %}
{% endtabs %}

it transforms it into a pattern (`id(...)`) on an instance of [StringContext](https://www.scala-lang.org/api/current/scala/StringContext.html).
To define our own string interpolation, we need to create an implicit class (Scala 2) or a `Conversion` instance (Scala 3) that adds an extractor member to `StringContext`.

As an example, let's assume we have a `Point` class and want to create a custom pattern `p"$a,$b"` that extracts the coordinates of a `Point` object.

{% tabs custom-interpolator-1-pattern %}
{% tab 'Scala 2 and 3' for=custom-interpolator-1-pattern %}
```scala
case class Point(x: Double, y: Double)

val pt: Point = Point(1, 2)
pt match case p"$a,$b" => a + b // a = 1, b = 2
```
{% endtab %}
{% endtabs %}

We'd create a custom `p`-extractor which extracts two coordinates by first implementing a `StringContext` extension with something like:

{% tabs custom-interpolator-2-pattern class=tabs-scala-version %}

{% tab 'Scala 2' for=custom-interpolator-2-pattern %}
```scala
implicit class PointHelper(val sc: StringContext) {
  object p {
    def unapply(point: Point): Option[(Double, Double)] = ???
  }
}
```

**Note:** This time it's not possible to extend `AnyVal` since we add an object to it.

{% endtab %}

{% tab 'Scala 3' for=custom-interpolator-2-pattern %}
```scala
import scala.language.implicitConversions

given Conversion[StringContext, PointHelper] = sc => PointHelper(sc)

class PointHelper(val sc: StringContext):
  object p:
    def unapply(point: Point): Option[(Double, Double)] = ???
```

{% endtab %}

{% endtabs %}

Once this extension is in scope and the Scala compiler encounters a pattern `p"some string"`, it
will process `some string` to extract String tokens which lie between embedded patterns in the string.

For example, `point match case p"$a, $b"` would turn into:

{% tabs extension-desugaring-pattern class=tabs-scala-version %}

{% tab 'Scala 2' for=extension-desugaring-pattern %}
```scala
val someIdentifier = StringContext("",",","")
point match case someIdentifier.p(a, b)
```

Where `someIdentifier` is an identifier guaranteed not to clash with anything in scope, and thus cannot be interracted with.

The implicit class is then used to rewrite it to the following:

```scala
val someIdentifier = PointHelper(StringContext("",",",""))
point match case someIdentifier.p(a, b)
```
{% endtab %}

{% tab 'Scala 3' for=extension-desugaring-pattern %}
```scala
val someIdentifier = StringContext("",",","")
point match case someIdentifier.p(a, b)
```

Where `someIdentifier` is an identifier guaranteed not to clash with anything in scope, and thus cannot be interracted with.

Implicit conversion is then used to rewrite it to the following:

```scala
val someIdentifier = PointHelper(StringContext("",",",""))
point match case someIdentifier.p(a, b)
```
{% endtab %}

{% endtabs %}

As a result, each of the fragments of the processed String are exposed in the
`StringContext.parts` member, while the extractor `p` is used to extract the variables.

#### Example Implementation

An implementation of our Point string interpolator extractor might look something like below,
though a more sophisticated implementation may choose to handle more pattern diversitiy (for example `p"0, $b"`)
and/or stronger exhaustiveness guarantess.

{% tabs implementation-pattern class=tabs-scala-version %}

{% tab 'Scala 2' for=implementation-pattern %}
```scala
import scala.language.implicitConversions

case class Point(x: Double, y: Double)

implicit class PointHelper(val sc: StringContext) {
  object p {
    def unapply(point: Point): Option[(Double,Double)] = {
      sc.parts match {
      
        // if the pattern is p"$a,$b" or p"$a, $b" return the elements
        case Seq("", "," | ", ", "") =>
          Some((point.x, point.y))
        
        case _ =>
          throw IllegalArgumentException("The pattern is not well-formed")
      }
    }
  }
}


Point(2, 3) match {
//  case p"$x$y" => x + y // IllegalArgumentException: The pattern is not well-formed
  case p"$x,$y" => x + y
}
```
{% endtab %}

{% tab 'Scala 3' for=implementation-pattern %}
```scala
import scala.language.implicitConversions

case class Point(x: Double, y: Double)

given Conversion[StringContext, PointHelper] = sc => PointHelper(sc)

class PointHelper(val sc: StringContext):
  object p:
    def unapply(point: Point): Option[(Double,Double)] =
      sc.parts match
      
        // checks if the pattern is p"$a,$b" or p"$a, $b"
        case Seq("", "," | ", ", "") =>
          Some((point.x, point.y))
        
        case _ =>
          throw IllegalArgumentException("The pattern was not well-formed")

Point(2, 3) match
//  case p"$x$y" => x + y // IllegalArgumentException: The pattern was not well-formed
  case p"$x,$y" => x + y
```
{% endtab %}
{% endtabs %}

[java-format-docs]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#detail
[value-class]: {% link _overviews/core/value-classes.md %}
[sip-11]: {% link _sips/sips/011-string-interpolation.md %}
