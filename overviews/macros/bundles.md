---
layout: overview-large
title: Macro Bundles

disqus: true

partof: macros
num: 6
outof: 6
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

Macro bundles and macro compilers are pre-release features included in so-called macro paradise, an experimental branch in the official Scala repository. Follow the instructions at the ["Macro Paradise"](/overviews/macros/paradise.html) page to download and use our nightly builds.

## Macro bundles

Currently, in Scala 2.10.0, macro implementations are represented with functions. Once the compiler sees an application of a macro definition,
it calls the macro implementation - as simple as that. However practice shows that just functions are often not enough due to the
following reasons:

1. Being limited to functions makes modularizing complex macros awkward. It's quite typical to see macro logic concentrate in helper
traits outside macro implementations, turning implementations into trivial wrappers, which just instantiate and call helpers.

2. Moreover, since macro parameters are path-dependent on the macro context, [special incantations](/overviews/macros/overview.html#writing_bigger_macros) are required to wire implementations and helpers together.

3. As macros evolved it [became apparent](https://twitter.com/milessabin/status/281379835773857792) that there should exist different
interfaces of communication between the compiler and macros. At the moment compiler can only expand macros, but what if it wanted to
ask a macro to help it with type inference?

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

## Macro compilers

When I was implementing macro bundles, it became apparent that the mechanism which links macro definitions with macro implementations
is too rigid. This mechanism simply used hardcoded logic in `scala/tools/nsc/typechecker/Macros.scala`, which takes the right-hand side
of a macro def, typechecks it as a reference to a static method and then uses that method as a corresponding macro implementation.

Now compilation of macro defs is extensible. Instead of using a hardcoded implementation to look up macro impls,
the macro engine performs an implicit search of a `MacroCompiler` in scope and then invokes its `resolveMacroImpl` method,
passing it the `DefDef` of a macro def and expecting a reference to a static method in return. Of course, `resolveMacroImpl`
should itself be a macro, namely [an untyped one](/overviews/macros/untypedmacros.md), for this to work.

    trait MacroCompiler {
      def resolveMacroImpl(macroDef: _): _ = macro ???
    }

Default instance of the type class, `Predef.DefaultMacroCompiler`, implements formerly hardcoded typechecking logic.
Alternative implementations could, for instance, provide lightweight syntax for macro defs, generating macro impls
on-the-fly using `c.introduceTopLevel`.
