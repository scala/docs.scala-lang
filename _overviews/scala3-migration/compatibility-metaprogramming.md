---
title: Metaprogramming
type: section
description: This section discuss the metaprogramming transition 
num: 5
previous-page: compatibility-runtime
next-page: tooling-tour
---

A call to a macro method is executed during the compiler phase called macro expansion to generate a part of the program---an abstract syntax tree.

The Scala 2.13 macro API is closely tied to the Scala 2.13 compiler internals.
Therefore it is not possible for the Scala 3 compiler to expand any Scala 2.13 macro.

In contrast, Scala 3 introduces a new principled approach of metaprogramming that is designed for stability.
Scala 3 macros, and inline methods in general, will be compatible with future versions of the Scala 3 compiler.
While this is an uncontested improvement, it also means that all Scala 2.13 macros have to be rewritten from the ground up, using the new metaprogramming features.

## Macro Dependencies

A Scala 3 module can depend on a Scala 2.13 artifact even if it contains a macro definition but the compiler will not be able to expand its macros.
When you try to, it simply returns an error.

{% highlight text %}
 -- Error: /src/main/scala/example/Example.scala:10:45 
 10 |  val documentFormat = Json.format[Document]
    |                            ^
    |Scala 2 macro cannot be used in Scala 3. See https://nightly.scala-lang.org/docs/reference/dropped-features/macros.html
    |To turn this error into a warning, pass -Xignore-scala2-macros to the compiler
{% endhighlight %}

Let's note that using `-Xignore-scala2-macros` is helpful to type check the code but it produces incomplete class files.

When this error appears in your project, you have eventually no other choice than upgrading to a Scala 3-compiled version of the macro artifact.

## Porting the Macro Ecosystem

While being experimental, the Scala community has largely adopted the Scala 2 macro feature in multiple ways: code generation, optimizations, ergonomic DSLs...

A large part of the ecosystem now depends on Scala 2.13 macros defined in external libraries.
Identifying and porting those libraries is key to move the ecosystem forward.

A migration status of many open-source macro libraries is available in [this page](https://scalacenter.github.io/scala-3-migration-guide/docs/macros/macro-libraries.html).

## Rewriting a Macro

The new metaprogramming features are completely different from Scala 2.
They are comprised of:
- [Inline Methods][inline]
- [Compile-time operations][compiletime]
- [Macros][macros]
- [Quoted code][quotes]
- [Reflection over Abstract Syntax Trees (AST)][reflection]

Before getting deep into reimplementing a macro you should ask yourself:
- Can I use `inline` and the `scala.compiletime` operations to reimplement my logic?
- Can I use the simpler and safer expression-based macros?
- Do I really need to access the AST?
- Can I use a [match type]({{ site.scala3ref }}/new-types/match-types.html) as return type?

You can learn all the new metaprogramming concepts by reading the [Macros in Scala 3][scala3-macros] tutorial.

## Cross-building a Macro Library

You have written a wonderful macro library and you would like it to be available in Scala 2.13 and Scala 3.
There are two different approaches, the traditional cross-building technique and the more flexible macro mixing technique.

The benefit of macro mixing is that consumers who take advantage of the `-Ytasty-reader` option can still use your macros.

You can learn about them by reading these tutorials:
- [Cross-Building a Macro Library](tutorial-macro-cross-building.html)
- [Mixing Scala 2.13 and Scala 3 Macros](tutorial-macro-mixing.html)

## Additional Resources

Blog posts and talks:
- [Macros: The Plan For Scala 3](https://www.scala-lang.org/blog/2018/04/30/in-a-nutshell.html)
- [Scala Days - Metaprogramming in Dotty](https://www.youtube.com/watch?v=ZfDS_gJyPTc)

Early-adopter projects:
- [XML Interpolator](https://github.com/dotty-staging/xml-interpolator/tree/master)
- [Shapeless 3](https://github.com/dotty-staging/shapeless/tree/shapeless-3)

[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
[scala3-macros]: {% link _overviews/scala3-macros/tutorial/index.md %}
