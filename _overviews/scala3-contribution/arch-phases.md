---
title: Compiler Phases
type: section
description: This page describes the phases for the Scala 3 compiler.
num: 11
previous-page: arch-lifecycle
next-page: arch-types
---

As described in the [compiler overview][1], `dotc` is divided into a list of [phases][Phase],
specified in the [Compiler] class.

#### Printing the phases of the Compiler

a flattened list of all the phases can be displayed by invoking
the compiler with the `-Xshow-phases` flag:
```
$ scalac -Xshow-phases
```

## Phase Groups

In class [Compiler] we can access the list of phases with the method `phases`:

```scala
def phases: List[List[Phase]] =
  frontendPhases ::: picklerPhases ::: transformPhases ::: backendPhases
```

We see that phases are actually grouped into sublists, given by the signature
`List[List[Phase]]`; that is, each sublist forms a phase group that is then *fused* into a
single tree traversal when a [Run] is executed.

Phase fusion allows each phase of a group to be small and modular,
(each performing a single function), while reducing the number of tree traversals
and increasing performance.

Phases are able to be grouped together if they inherit from [MiniPhase].

## Phase Categories

*TODO: edit*

Phases fall into four categories:

* Frontend phases: `Frontend`, `PostTyper` and `Pickler`. `FrontEnd` parses the
  source programs and generates untyped abstract syntax trees, which are then
  typechecked and transformed into typed abstract syntax trees.  `PostTyper`
  performs checks and cleanups that require a fully typed program. In
  particular, it

    - creates super accessors representing `super` calls in traits
    - creates implementations of synthetic (compiler-implemented) methods
    - avoids storing parameters passed unchanged from subclass to superclass in
      duplicate fields.

  Finally `Pickler` serializes the typed syntax trees produced by the frontend
  as TASTY data structures.

* High-level transformations: All phases from `FirstTransform` to `Erasure`.
  Most of these phases transform syntax trees, expanding high-level constructs
  to more primitive ones. The last phase in the group, `Erasure` translates all
  types into types supported directly by the JVM. To do this, it performs
  another type checking pass, but using the rules of the JVM's type system
  instead of Scala's.

* Low-level transformations: All phases from `ElimErasedValueType` to
  `CollectSuperCalls`. These further transform trees until they are essentially a
  structured version of Java bytecode.

* Code generators: These map the transformed trees to Java classfiles or
  .sjsir files.

[1]: {% link _overviews/scala3-contribution/arch-lifecycle.md %}/#phases
[Compiler]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Compiler.scala
[Phase]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Phases.scala
[MiniPhase]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/transform/MegaPhase.scala
[Run]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Run.scala
