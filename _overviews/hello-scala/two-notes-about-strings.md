---
layout: multipage-overview
title: Two Notes About Strings
description: This page shares two important notes about strings in Scala.
partof: hello_scala
overview-name: Hello, Scala
num: 11
---


Scala strings have a lot of nice features, but I want to take a moment to highlight two features that I’ll use in the rest of this book. The first feature is that Scala has a nice, Ruby-like way to merge multiple strings. Given these three variables:

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

This form creates a very readable way to print multiple strings:

```scala
val name = println(s"Name: $firstName $mi $lastName")
```

As shown, all you have to do to use this approach is to precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string. This feature is known as *string interpolation*.

>You can also precede strings with the letter `f`, which lets you use *printf* style formatting inside strings. See my [Scala string interpolation tutorial](https://alvinalexander.com/scala/string-interpolation-scala-2.10-embed-variables-in-strings#the-f-string-interpolator-printf-formatting) for more information.



## Multiline strings

A second great feature of Scala strings is that you can create multiline strings by including the string inside three parentheses:

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

There are many more cool things you can do with strings. See my [collection of over 100 Scala string examples](https://alvinalexander.com/scala/scala-string-examples-collection-cheat-sheet) for more details and examples.







