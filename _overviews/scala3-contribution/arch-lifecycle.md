---
title: Compiler Overview
type: section
description: This page describes the high level architecture for the Scala 3 compiler.
num: 3
previous-page: arch-intro
next-page: arch-phases
---

As mentioned in [what is a compiler?][1] `dotc` produces programs that can run on your machine,
first by verifying its input is a valid Scala program, and then transforming it into a
representation that can run on one of Scala's target platforms.

## Intoducing the Compiler's Lifecycle

More precisely, `dotc` divides its work into [runs][2] and [phases][3]. A run is a complete iteration
of a [compiler][4]'s phases over a list of input sources, where a compiler is an ordered collection of phases, responsible for making new runs. During a run, a phase is applied to each [compilation unit][5] before progressing to the next phase. Compilation units are the abstraction over the compiler's state associated with each source file [Read more about a compiler's lifecyle][6]

[1]: {% link _overviews/scala3-contribution/contribution-intro.md %}/#what-is-a-compiler
[2]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Run.scala
[3]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Phases.scala
[4]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Compiler.scala
[5]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/CompilationUnit.scala
[6]: {% link _overviews/scala3-contribution/arch-time.md %}
