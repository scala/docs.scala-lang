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

