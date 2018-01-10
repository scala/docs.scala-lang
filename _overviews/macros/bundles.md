---
layout: multipage-overview
title: Macro Bundles

discourse: true

partof: macros
overview-name: Macros

num: 5

languages: [ja]
permalink: /overviews/macros/:title.html
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Macro bundles are a feature of Scala 2.11.x and Scala 2.12.x. Macro bundles are not supported in Scala 2.10.x. They are also not supported in macro paradise for Scala 2.10.x.

## Macro bundles

In Scala 2.10.x, macro implementations are represented with functions. Once the compiler sees an application of a macro definition,
it calls the macro implementation - as simple as that. However practice shows that just functions are often not enough due to the
following reasons:

1. Being limited to functions makes modularizing complex macros awkward. It's quite typical to see macro logic concentrate in helper
traits outside macro implementations, turning implementations into trivial wrappers, which just instantiate and call helpers.

2. Moreover, since macro parameters are path-dependent on the macro context, [special incantations](overview.html#writing-bigger-macros) are required to wire implementations and helpers together.

Macro bundles provide a solution to these problems by allowing macro implementations to be declared in classes that take
`c: scala.reflect.macros.blackbox.Context` or `c: scala.reflect.macros.whitebox.Context` as their constructor parameters, relieving macro implementations from having
to declare the context in their signatures, which simplifies modularization. Referencing macro implementations defined in bundles
works in the same way as with impls defined in objects. You specify a bundle name and then select a method from it,
providing type arguments if necessary.

    import scala.reflect.macros.blackbox.Context

    class Impl(val c: Context) {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }

## Blackbox vs whitebox

Macro bundles can be used to implement both [blackbox]({{ site.baseurl }}/overviews/macros/blackbox-whitebox.html) and [whitebox]({{ site.baseurl }}/overviews/macros/blackbox-whitebox.html) macros. Give the macro bundle constructor parameter the type of `scala.reflect.macros.blackbox.Context` to define a blackbox macro and  the type of `scala.reflect.macros.whitebox.Context` to define a whitebox macro.
