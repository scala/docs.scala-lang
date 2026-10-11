---
title: Macro Libraries
type: chapter
description: Using and porting Scala 2 macro libraries
num: 7
previous-page: scala3-migrate
next-page: macro-cross-building
redirect_from:
  - /scala3/guides/migration/compatibility-metaprogramming.html
---

The Scala 2.13 macro API is closely tied to the Scala 2.13 compiler internals.
Therefore the Scala 3 compiler cannot expand Scala 2.13 macros.

## Macro Dependencies

A Scala 3 module can depend on a Scala 2.13 artifact that contains macro definitions, but the compiler cannot expand those macros.
Calling one is an error:

{% highlight text %}
 -- Error: /src/main/scala/example/Example.scala:10:45
 10 |  val documentFormat = Json.format[Document]
    |                            ^
    |Scala 2 macro cannot be used in Scala 3. See https://docs.scala-lang.org/scala3/reference/dropped-features/macros.html
    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

When the macro provides an implicit value, the error does not mention macros: it says the implicit was not found.
Examples are shapeless `Lazy` (used by circe-generic's `deriveEncoder`) and scalactic `Position` (used by ScalaTest's `assert`).

`-Xignore-scala2-macros` lets the code type check, but the macro calls throw an exception at run time.

The solution is to use a version of the library that is published for Scala 3.

## Porting a Macro Library

Scala 3 macros are written from scratch, using the new metaprogramming features: inline methods, compile-time operations, quoted code and reflection.
The [Macros in Scala 3][scala3-macros] tutorial explains them.

To publish a macro library for both Scala 2.13 and Scala 3, there are two techniques:
- [Cross-Building a Macro Library](macro-cross-building.html): publish two artifacts, `_2.13` and `_3`.
- [Mixing Scala 2.13 and Scala 3 Macros](macro-mixing.html): publish a single Scala 3 artifact that contains both macro implementations, so that Scala 2.13 consumers using `-Ytasty-reader` can also use the macros.

[scala3-macros]: {% link _overviews/scala3-macros/tutorial/index.md %}
