---
layout: multipage-overview
title: Macro Annotations
partof: macros
overview-name: Macros

num: 10

languages: [ja]
permalink: /overviews/macros/:title.html
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

Macro annotations are available in Scala 2.13 with the `-Ymacro-annotations` flag, and with the macro paradise plugin from Scala 2.10.x to Scala 2.12.x.
Follow the instructions at the ["Macro Paradise"](paradise.html) page to download and use our compiler plugin if using
those older Scala versions.

Note that the macro paradise plugin is needed both to compile and to expand macro annotations,
which means that your users will have to also add macro paradise to their builds in order to use your macro annotations.
However, after macro annotations expand, the resulting code will no longer have any references to macro paradise
and won't require its presence at compile-time or at runtime.

## Walkthrough

Macro annotations bring textual abstraction to the level of definitions. Annotating any top-level or nested definition with something
that Scala recognizes as a macro will let it expand, possibly into multiple members. Unlike in the previous versions of macro paradise,
macro annotations in 2.0 are done right in the sense that they: 1) apply not just to classes and objects, but to arbitrary definitions,
2) allow expansions of classes to modify or even create companion objects.
This opens a number of new possibilities in code generation land.

In this walkthrough we will write a silly, but very useful macro that does nothing except for logging the annottees.
As a first step, we define an annotation that inherits `StaticAnnotation` and defines a `macroTransform` macro
(the name `macroTransform` and the signature `annottees: Any*` of that macro are important as they tell the macro engine
that the enclosing annotation is a macro annotation).

    import scala.annotation.{StaticAnnotation, compileTimeOnly}
    import scala.language.experimental.macros
    import scala.reflect.macros.whitebox

    @compileTimeOnly("enable macro paradise to expand macro annotations")
    class identity extends StaticAnnotation {
      def macroTransform(annottees: Any*): Any = macro ???
    }

First of all, note the `@compileTimeOnly` annotation. It is not mandatory, but is recommended to avoid confusion.
Macro annotations look like normal annotations to the vanilla Scala compiler, so if you forget to enable the macro paradise
plugin in your build, your annotations will silently fail to expand. The `@compileTimeOnly` annotation makes sure that
no reference to the underlying definition is present in the program code after typer, so it will prevent the aforementioned
situation from happening.

Now, the `macroTransform` macro is supposed to take a list of untyped annottees (in the signature their type is represented as `Any`
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

    import scala.annotation.{StaticAnnotation, compileTimeOnly}
    import scala.language.experimental.macros
    import scala.reflect.macros.whitebox

    @compileTimeOnly("enable macro paradise to expand macro annotations")
    class identity extends StaticAnnotation {
      def macroTransform(annottees: Any*): Any = macro identityMacro.impl
    }

    object identityMacro {
      def impl(c: whitebox.Context)(annottees: c.Expr[Any]*): c.Expr[Any] = {
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

## Blackbox vs whitebox

Macro annotations must be [whitebox]({{ site.baseurl }}/overviews/macros/blackbox-whitebox.html).
If you declare a macro annotation as [blackbox]({{ site.baseurl }}/overviews/macros/blackbox-whitebox.html), it will not work.
