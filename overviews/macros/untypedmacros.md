---
layout: overview-large
title: Untyped Macros

disqus: true
languages: [ko, ja]
---
<span class="label important" style="float: right;">OBSOLETE</span>

**Eugene Burmako**

Untyped macros used to be available in previous versions of ["Macro Paradise"](/overviews/macros/paradise.html),
but are not supported anymore in macro paradise 2.0.
Visit [the paradise 2.0 announcement](http://scalamacros.org/news/2013/08/05/macro-paradise-2.0.0-snapshot.html)
for an explanation and suggested migration strategy.

## Intuition

Being statically typed is great, but sometimes that is too much of a burden. Take for example, the latest experiment of Alois Cochard with
implementing enums using type macros - the so called [Enum Paradise](https://github.com/aloiscochard/enum-paradise). Here's how Alois has
to write his type macro, which synthesizes an enumeration module from a lightweight spec:

    object Days extends Enum('Monday, 'Tuesday, 'Wednesday...)

Instead of using clean identifier names, e.g. `Monday` or `Friday`, we have to quote those names, so that the typechecker doesn't complain
about non-existent identifiers. What a bummer - in the `Enum` macro we want to introduce new bindings, not to look up for existing ones,
but the compiler won't let us, because it thinks it needs to typecheck everything that goes into the macro.

Let's take a look at how the `Enum` macro is implemented by inspecting the signatures of its macro definition and implementation. There we can
see that the macro definition signature says `symbol: Symbol*`, forcing the compiler to typecheck the corresponding argument:

    type Enum(symbol: Symbol*) = macro Macros.enum
    object Macros {
      def enum(c: Context)(symbol: c.Expr[Symbol]*): c.Tree = ...
    }

Untyped macros provide a notation and a mechanism to tell the compiler that you know better how to typecheck given arguments of your macro.
To do that, simply replace macro definition parameter types with underscores and macro implementation parameter types with `c.Tree`:

    type Enum(symbol: _*) = macro Macros.enum
    object Macros {
      def enum(c: Context)(symbol: c.Tree*): c.Tree = ...
    }

## Details

The cease-typechecking underscore can be used in exactly three places in Scala programs: 1) as a parameter type in a macro,
2) as a vararg parameter type in a macro, 3) as a return type of a macro. Usages outside macros or as parts of complex types won't work.
The former will lead to a compile error, the latter, as in e.g. `List[_]`, will produce existential types as usual.

Note that untyped macros enable extractor macros: [SI-5903](https://issues.scala-lang.org/browse/SI-5903). In 2.10.x, it is possible
to declare `unapply` or `unapplySeq` as macros, but usability of such macros is extremely limited as described in the discussion
of the linked JIRA issue. Untyped macros make the full power of textual abstraction available in pattern matching. The
[test/files/run/macro-expand-unapply-c](https://github.com/scalamacros/kepler/tree/paradise/macros211/test/files/run/macro-expand-unapply-c)
unit test provides details on this matter.

If a macro has one or more untyped parameters, then when typing its expansions, the typechecker will do nothing to its arguments
and will pass them to the macro untyped. Even if some of the parameters do have type annotations, they will currently be ignored. This
is something we plan on improving: [SI-6971](https://issues.scala-lang.org/browse/SI-6971). Since arguments aren't typechecked, you
also won't having implicits resolved and type arguments inferred (however, you can do both with `c.typeCheck` and `c.inferImplicitValue`).

Explicitly provided type arguments will be passed to the macro as is. If type arguments aren't provided, they will be inferred as much as
possible without typechecking the value arguments and passed to the macro in that state. Note that type arguments still get typechecked, but
this restriction might also be lifted in the future: [SI-6972](https://issues.scala-lang.org/browse/SI-6972).

If a def macro has untyped return type, then the first of the two typechecks employed after its expansion will be omitted. A refresher:
the first typecheck of a def macro expansion is performed against the return type of its definitions, the second typecheck is performed
against the expected type of the expandee. More information can be found at Stack Overflow: [Static return type of Scala macros](http://stackoverflow.com/questions/13669974/static-return-type-of-scala-macros). Type macros never underwent the first typecheck, so
nothing changes for them (and you won't be able to specify any return type for a type macro to begin with).

Finally the untyped macros patch enables using `c.Tree` instead of `c.Expr[T]` everywhere in signatures of macro implementations.
Both for parameters and return types, all four combinations of untyped/typed in macro def and tree/expr in macro impl are supported.
Check our unit tests for more information: [test/files/run/macro-untyped-conformance](https://github.com/scalamacros/kepler/blob/b55bda4860a205c88e9ae27015cf2d6563cc241d/test/files/run/macro-untyped-conformance/Impls_Macros_1.scala).
