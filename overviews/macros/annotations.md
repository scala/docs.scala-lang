---
layout: overview-large
title: Macro Annotations

disqus: true

partof: macros
num: 9
outof: 12
languages: [ja]
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

Macro annotations are only available in Scala 2.10 with the macro paradise plugin.
Their inclusion in Scala 2.11 is not planned, but it will possibly happen in Scala 2.12.
Follow the instructions at the ["Macro Paradise"](/overviews/macros/paradise.html) page to download and use our compiler plugin.

Note that macro paradise is needed both to compile and to expand macro annotations,
which means that your users will have to also add macro paradise to their builds in order to use your macro annotations.
However, after macro annotations expand, the resulting code will no longer have any references to macro paradise
and won't require its presence at compile-time or at runtime.

## Call for feedback

This implementation of macro annotations is experimental (hence the snapshot suffix in the current `2.0.0-SNAPSHOT` version
of macro-paradise) and exists to provide a preview and initiate a discussion that will culminate in submitting
a Scala improvement proposal for Scala 2.11 or 2.12. Please check whether it handles your code generation needs,
so that I can refine it appropriately. If something doesn't work, let me know <a href="https://twitter.com/#!/xeno_by">on Twitter</a>.

## Walkthrough

Macro annotations bring textual abstraction to the level of definitions. Annotating any top-level or nested definition with something
that Scala recognizes as a macro will let it expand, possibly into multiple members. Unlike in the previous versions of macro paradise,
macro annotations in 2.0 are done right in the sense that they: 1) apply not just to classes and objects, but to arbitrary definitions,
2) allow expansions of classes to modify or even create companion objects.
This opens a number of new possibilities in code generation land.

In this walkthrough we will write a silly, but very useful macro that does nothing except for logging the annottees.
As a first step, we define an annotation that inherits `StaticAnnotation` and defines a `macroTransform` macro.
(Note the triple question mark body of the macro. Did you know that you can do that starting from 2.10.2?)

    import scala.reflect.macros.Context
    import scala.language.experimental.macros
    import scala.annotation.StaticAnnotation

    class identity extends StaticAnnotation {
      def macroTransform(annottees: Any*) = macro ???
    }

The `macroTransform` macro is supposed to take a list of untyped annottees (in the signature their type is represented as `Any`
for the lack of better notion in Scala) and produce one or several results (a single result can be returned as is, multiple
results have to be wrapped in a `Block` for the lack of better notion in the reflection API).

At this point you might be wondering. A single annottee and a single result is understandable, but what is the many-to-many
mapping supposed to mean? There are several rules guiding the process:

1. If a class is annotated and it has a companion, then both are passed into the macro. (But not vice versa - if an object
   is annotated and it has a companion class, only the object itself is expanded).
1. If a parameter of a class, method or type member is annotated, then it expands its owner. First comes the annottee,
   then the owner and then its companion as specified by the previous rule.
1. Annottees can expand into whatever number of trees of any flavor, and the compiler will then transparently
   replace the input trees of the macro with its output trees.
1. If a class expands into both a class and a module having the same name, they become companions.
   This way it is possible to generate a companion object for a class even if that companion was not declared explicitly.
1. Top-level expansions must retain the number of annottees, their flavors and their names, with the only exception
   that a class might expand into a same-named class plus a same-named module, in which case they automatically become
   companions as per previous rule.

Here's a possible implementation of the `identity` annotation macro. The logic is a bit complicated, because it needs to
take into account the cases when `@identity` is applied to a value or type parameter. Excuse us for a low-tech solution,
but we haven't encapsulated this boilerplate in a helper, because compiler plugins cannot easily change the standard library.
(By the way, this boilerplate can be abstracted away by a suitable annotation macro, and we'll probably provide such a macro
at a later point in the future).

    object identityMacro {
      def impl(c: Context)(annottees: c.Expr[Any]*): c.Expr[Any] = {
        import c.universe._
        val inputs = annottees.map(_.tree).toList
        val (annottee, expandees) = inputs match {
          case (param: ValDef) :: (rest @ (_ :: _)) => (param, rest)
          case (param: TypeDef) :: (rest @ (_ :: _)) => (param, rest)
          case _ => (EmptyTree, inputs)
        }
        println((annottee, expandees))
        val outputs = expandees
        c.Expr[Any](Block(outputs, Literal(Constant(()))))
      }
    }

| Example code                                              | Printout                                                        |
|-----------------------------------------------------------|-----------------------------------------------------------------|
| `@identity class C`                                       | `(<empty>, List(class C))`                                      |
| `@identity class D; object D`                             | `(<empty>, List(class D, object D))`                            |
| `class E; @identity object E`                             | `(<empty>, List(object E))`                                    |
| `def twice[@identity T]`<br/>`(@identity x: Int) = x * 2` | `(type T, List(def twice))`<br/>`(val x: Int, List(def twice))` |

In the spirit of Scala macros, macro annotations are as untyped as possible to stay flexible and
as typed as possible to remain useful. On the one hand, macro annottees are untyped, so that we can change their signatures (e.g. lists
of class members). But on the other hand, the thing about all flavors of Scala macros is integration with the typechecker, and
macro annotations are not an exceptions. During expansion we can have all the type information that's possible to have
(e.g. we can reflect against the surrounding program or perform type checks / implicit lookups in the enclosing context).
