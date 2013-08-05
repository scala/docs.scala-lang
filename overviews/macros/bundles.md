---
layout: overview-large
title: Macro Bundles

disqus: true

partof: macros
num: 3
outof: 11
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Macro bundles are shipped with the recent milestone builds of Scala 2.11, starting from 2.11.0-M4. They are not available in Scala 2.10.x or in macro paradise. Follow the instructions at [http://www.scala-lang.org/download/](http://www.scala-lang.org/download/) to download and use the latest milestone of 2.11.

## Macro bundles

Currently, in Scala 2.10.x, macro implementations are represented with functions. Once the compiler sees an application of a macro definition,
it calls the macro implementation - as simple as that. However practice shows that just functions are often not enough due to the
following reasons:

1. Being limited to functions makes modularizing complex macros awkward. It's quite typical to see macro logic concentrate in helper
traits outside macro implementations, turning implementations into trivial wrappers, which just instantiate and call helpers.

2. Moreover, since macro parameters are path-dependent on the macro context, [special incantations](/overviews/macros/overview.html#writing_bigger_macros) are required to wire implementations and helpers together.

Macro bundles provide a solution to these problems by allowing macro implementations to be declared in traits, which extend
`scala.reflect.macros.Macro`. This base trait predefines the `c: Context` variable, relieving macro implementations from having
to declare it in their signatures, which simplifies modularization. Later on `Macro` could come with preloaded callback methods
such as, for example, `onInfer`.

    trait Macro {
      val c: Context
    }

Referencing macro implementations defined in bundles works in the same way as with impls defined in objects. You specify a bundle name
and then select a method from it, providing type arguments if necessary.

    import scala.reflect.macros.Context
    import scala.reflect.macros.Macro

    trait Impl extends Macro {
      def mono = c.literalUnit
      def poly[T: c.WeakTypeTag] = c.literal(c.weakTypeOf[T].toString)
    }

    object Macros {
      def mono = macro Impl.mono
      def poly[T] = macro Impl.poly[T]
    }
