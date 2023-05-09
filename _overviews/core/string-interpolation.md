---
layout: singlepage-overview
title: String Interpolation
partof: string-interpolation

languages: [es, ja, zh-cn]

permalink: /overviews/core/:title.html
---

**Josh Suereth**

## Introduction

Starting in Scala 2.10.0, Scala offers a new mechanism to create strings from your data:  String Interpolation.
String Interpolation allows users to embed variable references directly in *processed* string literals.  Here's an example:

{% tabs example-1 %}
{% tab 'Scala 2 and 3' for=example-1 %}
    val name = "James"
    println(s"Hello, $name")  // Hello, James
{% endtab %}
{% endtabs %}

In the above, the literal `s"Hello, $name"` is a *processed* string literal.  This means that the compiler does some additional
work to this literal.  A processed string literal is denoted by a set of characters preceding the `"`. String interpolation
was introduced by [SIP-11](https://docs.scala-lang.org/sips/pending/string-interpolation.html), which contains all details of the implementation.

## Usage

Scala provides three string interpolation methods out of the box:  `s`, `f` and `raw`.

### The `s` String Interpolator

Prepending `s` to any string literal allows the usage of variables directly in the string. You've already seen an example here:

{% tabs example-2 %}
{% tab 'Scala 2 and 3' for=example-2 %}
    val name = "James"
    println(s"Hello, $name")  // Hello, James
{% endtab %}
{% endtabs %}

Here `$name` is nested inside an `s` processed string.  The `s` interpolator knows to insert the value of the `name` variable at this location
in the string, resulting in the string `Hello, James`.  With the `s` interpolator, any name that is in scope can be used within a string.

String interpolators can also take arbitrary expressions. For example:

{% tabs example-3 %}
{% tab 'Scala 2 and 3' for=example-3 %}
    println(s"1 + 1 = ${1 + 1}")
{% endtab %}
{% endtabs %}

will print the string `1 + 1 = 2`.  Any arbitrary expression can be embedded in `${}`.

For some special characters, it is necessary to escape them when embedded within a string.
To represent an actual dollar sign you can double it `$$`, like here:

{% tabs example-4 %}
{% tab 'Scala 2 and 3' for=example-4 %}
    println(s"New offers starting at $$14.99")
{% endtab %}
{% endtabs %}

which will print the string `New offers starting at $14.99`.

Double quotes also need to be escaped. This can be done by using triple quotes as shown:

{% tabs example-5 %}
{% tab 'Scala 2 and 3' for=example-5 %}
    val person = """{"name":"James"}"""
{% endtab %}
{% endtabs %}

which will produce the string `{"name":"James"}` when printed.

### The `f` Interpolator

Prepending `f` to any string literal allows the creation of simple formatted strings, similar to `printf` in other languages.  When using the `f`
interpolator, all variable references should be followed by a `printf`-style format string, like `%d`.   Let's look at an example:

{% tabs example-6 %}
{% tab 'Scala 2 and 3' for=example-6 %}
    val height = 1.9d
    val name = "James"
    println(f"$name%s is $height%2.2f meters tall")  // James is 1.90 meters tall
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
[Formatter javadoc](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#detail).   If there is no `%` character after a variable
definition a formatter of `%s` (`String`) is assumed.

### The `raw` Interpolator

The raw interpolator is similar to the `s` interpolator except that it performs no escaping of literals within the string.  Here's an example processed string:

{% tabs example-7 %}
{% tab 'Scala 2 and 3' for=example-7 %}
    scala> s"a\nb"
    res0: String =
    a
    b
{% endtab %}
{% endtabs %}

Here the `s` string interpolator replaced the characters `\n` with a return character.   The `raw` interpolator will not do that.

{% tabs example-8 %}
{% tab 'Scala 2 and 3' for=example-8 %}
    scala> raw"a\nb"
    res1: String = a\nb
{% endtab %}
{% endtabs %}

The raw interpolator is useful when you want to avoid having expressions like `\n` turn into a return character.

In addition to the three default string interpolators, users can define their own.

## Advanced Usage

In Scala, all processed string literals are simple code transformations.   Anytime the compiler encounters a string literal of the form:

{% tabs example-9 %}
{% tab 'Scala 2 and 3' for=example-9 %}
    id"string content"
{% endtab %}
{% endtabs %}

it transforms it into a method call (`id`) on an instance of [StringContext](https://www.scala-lang.org/api/current/scala/StringContext.html).
This method can also be available on implicit scope.
To define our own string interpolation, we need to create an implicit class (Scala 2) or an `extension` method (Scala 3) that adds a new method to `StringContext`.
Here's an example:

{% tabs json-definition-and-usage class=tabs-scala-version %}

{% tab 'Scala 2' for=json-definition-and-usage %}
```scala
// Note: We extends AnyVal to prevent runtime instantiation.  See
// value class guide for more info.
implicit class JsonHelper(val sc: StringContext) extends AnyVal {
  def json(args: Any*): JSONObject = sys.error("TODO - IMPLEMENT")
}

def giveMeSomeJson(x: JSONObject): Unit = ...

giveMeSomeJson(json"{ name: $name, id: $id }")
```
{% endtab %}

{% tab 'Scala 3' for=json-definition-and-usage %}
```scala
extension (sc: StringContext)
  def json(args: Any*): JSONObject = sys.error("TODO - IMPLEMENT")

def giveMeSomeJson(x: JSONObject): Unit = ...

giveMeSomeJson(json"{ name: $name, id: $id }")
```
{% endtab %}

{% endtabs %}

In this example, we're attempting to create a JSON literal syntax using string interpolation.   The `JsonHelper` implicit class must be in scope to use this syntax, and the json method would need a complete implementation.   However, the result of such a formatted string literal would not be a string, but a `JSONObject`.

When the compiler encounters the literal `json"{ name: $name, id: $id }"` it rewrites it to the following expression:

{% tabs extension-desugaring class=tabs-scala-version %}

{% tab 'Scala 2' for=extension-desugaring %}
```scala
new StringContext("{ name: ", ", id: ", " }").json(name, id)
```

The implicit class is then used to rewrite it to the following:

```scala
new JsonHelper(new StringContext("{ name: ", ", id: ", " }")).json(name, id)
```
{% endtab %}

{% tab 'Scala 3' for=extension-desugaring %}
```scala
StringContext("{ name: ", ", id: ", " }").json(name, id)
```
{% endtab %}

{% endtabs %}

So, the `json` method has access to the raw pieces of strings and each expression as a value.   A simplified (buggy) implementation of this method could be:

{% tabs json-fake-implementation class=tabs-scala-version %}

{% tab 'Scala 2' for=json-fake-implementation %}
```scala
implicit class JsonHelper(val sc: StringContext) extends AnyVal {
  def json(args: Any*): JSONObject = {
    val strings = sc.parts.iterator
    val expressions = args.iterator
    val buf = new StringBuilder(strings.next())
    while (strings.hasNext) {
      buf.append(expressions.next())
      buf.append(strings.next())
    }
    parseJson(buf)
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=json-fake-implementation %}
```scala
extension (sc: StringContext)
  def json(args: Any*): JSONObject =
    val strings = sc.parts.iterator
    val expressions = args.iterator
    val buf = new StringBuilder(strings.next())
    while strings.hasNext do
      buf.append(expressions.next())
      buf.append(strings.next())
    parseJson(buf)
```
{% endtab %}

{% endtabs %}

Each of the string portions of the processed string are exposed in the `StringContext`'s `parts` member.  Each of the expression values is passed into the `json` method's `args` parameter.   The `json` method takes this and generates a big string which it then parses into JSON.   A more sophisticated implementation could avoid having to generate this string and simply construct the JSON directly from the raw strings and expression values.
