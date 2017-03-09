---
layout: overview-large
title: Extractor Macros

disqus: true

partof: macros
num: 7
outof: 13
languages: [ko]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Extractor macros are a feature of Scala 2.11.x and Scala 2.12.x, enabled by name-based extractors introduced by Paul Phillips in Scala 2.11.0-M5. Extractor macros are not supported in Scala 2.10.x. They are also not supported in macro paradise for Scala 2.10.x.

## The pattern

In a nutshell, given an unapply method (for simplicity, in this
example the scrutinee is of a concrete type, but it's also possible
to have the extractor be polymorphic, as demonstrated in the tests):

    def unapply(x: SomeType) = ???

One can write a macro that generates extraction signatures for unapply
on per-call basis, using the target of the calls (`c.prefix`) and the type
of the scrutinee (that comes with `x`), and then communicate these signatures
to the typechecker.

For example, here's how one can define a macro that simply passes
the scrutinee back to the pattern match (for information on how to
express signatures that involve multiple extractees, visit
[scala/scala#2848](https://github.com/scala/scala/pull/2848)).

    def unapply(x: SomeType) = macro impl
    def impl(c: Context)(x: c.Tree) = {
      q"""
        new {
          class Match(x: SomeType) {
            def isEmpty = false
            def get = x
          }
          def unapply(x: SomeType) = new Match(x)
        }.unapply($x)
      """
    }

In addition to the matcher, which implements domain-specific
matching logic, there's quite a bit of boilerplate here, but
every part of it looks necessary to arrange a non-frustrating dialogue
with the typer. Maybe something better can be done in this department,
but I can't see how, without introducing modifications to the typechecker.

Even though the pattern uses structural types, somehow no reflective calls
are being generated (as verified by `-Xlog-reflective-calls` and then
by manual examination of the produced code). That's a mystery to me, but
that's also good news, since that means that extractor macros aren't
going to induce performance penalties.

Almost. Unfortunately, I couldn't turn matchers into value classes
because one can't declare value classes local. Nevertheless,
I'm leaving a canary in place ([neg/t5903e](https://github.com/scala/scala/blob/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/neg/t5903e/Macros_1.scala#L1)) that will let us know
once this restriction is lifted.

## Use cases

In particular, the pattern can be used to implement shapeshifting
pattern matchers for string interpolators without resorting to dirty
tricks. For example, quasiquote unapplications can be unhardcoded now:

    def doTypedApply(tree: Tree, fun0: Tree, args: List[Tree], ...) = {
      ...
      fun.tpe match {
        case ExtractorType(unapply) if mode.inPatternMode =>
          // this hardcode in Typers.scala is no longer necessary
          if (unapply == QuasiquoteClass_api_unapply) macroExpandUnapply(...)
          else doTypedUnapply(tree, fun0, fun, args, mode, pt)
      }
    }

Rough implementation strategy here would involve writing an extractor
macro that destructures `c.prefix`, analyzes parts of `StringContext` and
then generates an appropriate matcher as outlined above.

Follow our test cases at [run/t5903a](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903a),
[run/t5903b](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903b),
[run/t5903c](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903c),
[run/t5903d](https://github.com/scala/scala/tree/00624a39ed84c3fd245dd9df7454d4cec4399e13/test/files/run/t5903d) to see implementations
of this and other use cases for extractor macros.

## Blackbox vs whitebox

Extractor macros must be [whitebox](/overviews/macros/blackbox-whitebox.html).
If you declare an extractor macro as [blackbox](/overviews/macros/blackbox-whitebox.html), it will not work.
