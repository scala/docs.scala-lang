---
type: section
layout: multipage-overview
title: Two Notes About Strings
description: This page shares two important notes about strings in Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 11
outof: 54
previous-page: built-in-types
next-page: command-line-io
---


Scala strings have a lot of nice features, but we want to take a moment to highlight two features that we’ll use in the rest of this book. The first feature is that Scala has a nice, Ruby-like way to merge multiple strings. Given these three variables:

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

you can append them together like this, if you want to:

```scala
val name = firstName + " " + mi + " " + lastName
```

However, Scala provides this more convenient form:

```scala
val name = s"$firstName $mi $lastName"
```

This form creates a very readable way to print strings that contain variables:

```scala
println(s"Name: $firstName $mi $lastName")
```

As shown, all you have to do is to precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string. This feature is known as *string interpolation*.


### More features

String interpolation in Scala provides many more features. For example, you can also enclose your variable names inside curly braces:

```scala
println(s"Name: ${firstName} ${mi} ${lastName}")
```

For some people that’s easier to read, but an even more important benefit is that you can put expressions inside the braces, as shown in this REPL example:

```scala
scala> println(s"1+1 = ${1+1}")
1+1 = 2
```

A few other benefits of string interpolation are:

- You can precede strings with the letter `f`, which lets you use *printf* style formatting inside strings
- The `raw` interpolator performs no escaping of literals (such as `\n`) within the string
- You can create your own string interpolators

See the [string interpolation documentation]({{site.baseurl}}/overviews/core/string-interpolation.html) for more details.



## Multiline strings

A second great feature of Scala strings is that you can create multiline strings by including the string inside three double-quotes:

```scala
val speech = """Four score and
               seven years ago
               our fathers ..."""
```

That’s very helpful for when you need to work with multiline strings. One drawback of this basic approach is that lines after the first line are indented, as you can see in the REPL:

```scala
scala> val speech = """Four score and
     |                seven years ago
     |                our fathers ..."""
speech: String =
Four score and
                   seven years ago
                   our fathers ...
```

A simple way to fix this problem is to put a `|` symbol in front of all lines after the first line, and call the `stripMargin` method after the string:

```scala
val speech = """Four score and
               |seven years ago
               |our fathers ...""".stripMargin
```

The REPL shows that when you do this, all of the lines are left-justified:

```scala
scala> val speech = """Four score and
     |                |seven years ago
     |                |our fathers ...""".stripMargin
speech: String =
Four score and
seven years ago
our fathers ...
```

Because this is what you generally want, this is a common way to create multiline strings.



