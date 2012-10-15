---
layout: overview-large
title: Architecture

partof: reflection
num: 6
---

===TreeCreator===
A mirror-aware factory for trees.

In the reflection API, artifacts are specific to universes and
symbolic references used in artifacts (e.g. `scala.Int`) are resolved by mirrors.

Therefore to build a tree one needs to know a universe that the tree is going to be bound to
and a mirror that is going to resolve symbolic references (e.g. to determine that `scala.Int`
points to a core class `Int` from scala-library.jar).

`TreeCreator` implements this notion by providing a standalone tree factory.

This is immediately useful for reification. When the compiler reifies an expression,
the end result needs to make sense in any mirror. That's because the compiler knows
the universe it's reifying an expression into (specified by the target of the `reify` call),
but it cannot know in advance the mirror to instantiate the result in (e.g. on JVM
it doesn't know what classloader use to resolve symbolic names in the reifee).

Due to a typechecker restriction (no eta-expansion for dependent method types),
`TreeCreator` can't have a functional type, so it's implemented as class with an apply method.

===TypeCreator===
A mirror-aware factory for types.

In the reflection API, artifacts are specific to universes and
symbolic references used in artifacts (e.g. `scala.Int`) are resolved by mirrors.

Therefore to build a type one needs to know a universe that the type is going to be bound to
and a mirror that is going to resolve symbolic references (e.g. to determine that `scala.Int`
points to a core class `Int` from scala-library.jar).

`TypeCreator` implements this notion by providing a standalone type factory.

This is immediately useful for type tags. When the compiler creates a type tag,
the end result needs to make sense in any mirror. That's because the compiler knows
the universe it's creating a type tag for (since `TypeTag` is path-dependent on a universe),
but it cannot know in advance the mirror to instantiate the result in (e.g. on JVM
it doesn't know what classloader use to resolve symbolic names in the type tag).

Due to a typechecker restriction (no eta-expansion for dependent method types),
`TypeCreator` can't have a functional type, so it's implemented as class with an apply method.


<!-- From scala.reflect.api.Universe
* Each of these types are defined in their own enclosing traits, which are ultimately all inherited by class
 * [[scala.reflect.api.Universe Universe]]. The main universe defines a minimal interface to the above types.
 * Universes that provide additional functionality such as deeper introspection or runtime code generation,
 * are defined in packages [[scala.reflect.macros]] and `scala.tools.reflect`.
 *
 * The cake pattern employed here requires to write certain Scala idioms with more indirections that usual.
 * What follows is a description of these indirections, which will help to navigate the Scaladocs easily.
 *
 * For instance, consider the base type of all abstract syntax trees: [[scala.reflect.api.Trees#Tree]].
 * This type is not a class but is abstract and has an upper bound of [[scala.reflect.api.Trees#TreeApi]],
 * which is a class defining the minimal base interface for all trees.
 *
 * For a more interesting tree type, consider [[scala.reflect.api.Trees#If]] representing if-expressions.
 * It is defined next to a value `If` of type [[scala.reflect.api.Trees#IfExtractor]].
 * This value serves as the companion object defining a factory method `apply` and a corresponding `unapply`
 * for pattern matching.
 *
 * {{{
 * import scala.reflect.runtime.universe._
 * val cond = reify{ condition }.tree // <- just some tree representing a condition
 * val body = Literal(Constant(1))
 * val other = Literal(Constant(2))
 * val iftree = If(cond,body,other)
 * }}}
 *
 * is equivalent to
 *
 * {{{
 * import scala.reflect.runtime.universe._
 * val iftree = reify{ if( condition ) 1 else 2 }.tree
 * }}}
 *
 * and can be pattern matched as
 *
 * {{{
 * iftree match { case If(cond,body,other) => ... }
 * }}}
 *
 * Moreover, there is an implicit value [[scala.reflect.api.Trees#IfTag]] of type
 * `ClassTag[If]` that is used by the Scala compiler so that we can indeed pattern match on `If`:
 * {{{
 *   iftree match { case _:If => ... }
 * }}}
 * Without the given implicit value, this pattern match would raise an "unchecked" warning at compile time
 * since `If` is an abstract type that gets erased at runtime. See [[scala.reflect.ClassTag]] for details.
 *
 * To summarize: each tree type `X` (and similarly for other types such as `Type` or `Symbol`) is represented
 * by an abstract type `X`, optionally together with a class `XApi` that defines `X`'s' interface.
 * `X`'s companion object, if it exists, is represented by a value `X` that is of type `XExtractor`.
 * Moreover, for each type `X`, there is a value `XTag` of type `ClassTag[X]` that allows to pattern match on `X`.
 -->