---
layout: overview-large
title: Implicit Macros

disqus: true

partof: macros
num: 6
outof: 13
languages: [ko, ja]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Implicit macros are shipped as an experimental feature of Scala since version 2.10.0, including the upcoming 2.11.0,
but require a critical bugfix in 2.10.2 to become fully operational. Implicit macros do not need macro paradise to work,
neither in 2.10.x, nor in 2.11.

An extension to implicit macros,
called fundep materialization, is unavailable in 2.10.0 through 2.10.4, but has been implemented in
[macro paradise](/overviews/macros/paradise.html), Scala 2.10.5 and Scala 2.11.x.
Note that in 2.10.0 through 2.10.4, expansion of fundep materializer macros requires macro paradise,
which means that your users will have to add macro paradise to their builds in order to use your fundep materializers.
However, after fundep materializers expand, the resulting code will no longer have any references to macro paradise
and won't require its presence at compile-time or at runtime. Also note that in 2.10.5, expansion of
fundep materializer macros can happen without macro paradise, but then your users will have to enable
the <code>-Yfundep-materialization</code> compiler flag.

## Implicit macros

### Type classes

The example below defines the `Showable` type class, which abstracts over a prettyprinting strategy.
The accompanying `show` method takes two parameters: an explicit one, the target, and an implicit one,
which carries the instance of `Showable`.

    trait Showable[T] { def show(x: T): String }
    def show[T](x: T)(implicit s: Showable[T]) = s.show(x)

After being declared like that, `show` can be called with only the target provided, and `scalac`
will try to infer the corresponding type class instance from the scope of the call site based
on the type of the target. If there is a matching implicit value in scope, it will be inferred
and compilation will succeed, otherwise a compilation error will occur.

    implicit object IntShowable extends Showable[Int] {
      def show(x: Int) = x.toString
    }
    show(42) // "42"
    show("42") // compilation error

### Proliferation of boilerplate

One of the well-known problems with type classes, in general and in particular in Scala,
is that instance definitions for similar types are frequently very similar, which leads to
proliferation of boilerplate code.

For example, for a lot of objects prettyprinting means printing the name of their class
and the names and values of the fields. Even though this and similar recipes are very concise,
in practice it is often impossible to implement them concisely, so the programmer is forced
to repeat himself over and over again.

    class C(x: Int)
    implicit def cShowable = new Showable[C] {
      def show(c: C) = "C(" + c.x + ")"
    }

    class D(x: Int)
    implicit def dShowable = new Showable[D] {
      def show(d: D) = "D(" + d.x + ")"
    }

This very use case can be implemented with runtime reflection,
but oftentimes reflection is either too imprecise because of erasure or
too slow because of the overhead it imposes.

There also exist generic programming approaches based on type-level programming, for example,
[the `TypeClass` type class technique](http://typelevel.org/blog/2013/06/24/deriving-instances-1.html) introduced by Lars Hupel,
but they also suffer a performance hit in comparison with manually written type class instances.

### Implicit materializers

With implicit macros it becomes possible to eliminate the boilerplate by completely removing
the need to manually define type class instances, without sacrificing performance.

    trait Showable[T] { def show(x: T): String }
    object Showable {
      implicit def materializeShowable[T]: Showable[T] = macro ...
    }

Instead of writing multiple instance definitions, the programmer defines a single `materializeShowable` macro
in the companion object of the `Showable` type class. Members of a companion object belong to implicit scope
of an associated type class, which means that in cases when the programmer does not provide an explicit instance of `Showable`,
the materializer will be called. Upon being invoked, the materializer can acquire a representation of `T` and
generate the appropriate instance of the `Showable` type class.

A nice thing about implicit macros is that they seamlessly meld into the pre-existing infrastructure of implicit search.
Such standard features of Scala implicits as multi-parametricity and overlapping instances are available to
implicit macros without any special effort from the programmer. For example, it is possible to define a non-macro
prettyprinter for lists of prettyprintable elements and have it transparently integrated with the macro-based materializer.

    implicit def listShowable[T](implicit s: Showable[T]) =
      new Showable[List[T]] {
        def show(x: List[T]) = { x.map(s.show).mkString("List(", ", ", ")")
      }
    }
    show(List(42)) // prints: List(42)

In this case, the required instance `Showable[Int]` would be generated by the materializing macro defined above.
Thus, by making macros implicit, they can be used to automate the materialization of type class instances,
while at the same time seamlessly integrating with non-macro implicits.

## Fundep materialization

### Problem statement

The use case, which gave birth to fundep materializers, was provided by Miles Sabin and his [shapeless](https://github.com/milessabin/shapeless) library. In the old version of shapeless, before 2.0.0, Miles has defined the `Iso` trait,
which represents isomorphisms between types. `Iso` can be used to map case classes to tuples and vice versa
(actually, shapeless used Iso's to convert between case classes and HLists, but for simplicity let's use tuples).

    trait Iso[T, U] {
      def to(t: T) : U
      def from(u: U) : T
    }

    case class Foo(i: Int, s: String, b: Boolean)
    def conv[C, L](c: C)(implicit iso: Iso[C, L]): L = iso.to(c)

    val tp  = conv(Foo(23, "foo", true))
    tp: (Int, String, Boolean)
    tp == (23, "foo", true)

If we try to write an implicit materializer for `Iso`, we will run into a wall.
When typechecking applications of methods like `conv`, scalac has to infer the type argument `L`,
which it has no clue about (and that's no wonder, since this is domain-specific knowledge). As a result, when we define an implicit
macro, which synthesizes `Iso[C, L]`, scalac will helpfully infer `L` as `Nothing` before expanding the macro and then everything will crumble.

### Proposed solution

As demonstrated by [https://github.com/scala/scala/pull/2499](https://github.com/scala/scala/pull/2499), the solution to the outlined
problem is extremely simple and elegant.

In 2.10 we don't allow macro applications to expand until all their type arguments are inferred. However we don't have to do that.
The typechecker can infer as much as it possibly can (e.g. in the running example `C` will be inferred to `Foo` and
`L` will remain uninferred) and then stop. After that we expand the macro and then proceed with type inference using the type of the
expansion to help the typechecker with previously undetermined type arguments. This is how it's implemented in Scala 2.11.0.

An illustration of this technique in action can be found in our [files/run/t5923c](https://github.com/scala/scala/tree/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923c) tests.
Note how simple everything is. The `materializeIso` implicit macro just takes its first type argument and uses it to produce an expansion.
We don't need to make sense of the second type argument (which isn't inferred yet), we don't need to interact with type inference -
everything happens automatically.

Please note that there is [a funny caveat](https://github.com/scala/scala/blob/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923a/Macros_1.scala) with Nothings that we plan to address later.

## Blackbox vs whitebox

Vanilla materializers (covered in the first part of this document) can be both [blackbox](/overviews/macros/blackbox-whitebox.html) and [whitebox](/overviews/macros/blackbox-whitebox.html).

There is a noticeable distinction between blackbox and whitebox materializers. An error in an expansion of a blackbox implicit macro (e.g. an explicit <code>c.abort</code> call or an expansion typecheck error) will produce a compilation error. An error in an expansion of a whitebox implicit macro will just remove the macro from the list of implicit candidates in the current implicit search, without ever reporting an actual error to the user. This creates a trade-off: blackbox implicit macros feature better error reporting, while whitebox implicit macros are more flexible, being able to dynamically turn themselves off when necessary.

Fundep materializers must be whitebox. If you declare a fundep materializer as blackbox, it will not work.
