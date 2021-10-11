---
title: Time in the Compiler
type: section
description: This page describes the concepts of time in the Scala 3 compiler.
num: 17
previous-page: arch-types
next-page: arch-symbols
---

In the [compiler overview][lifecycle] section, we saw that `dotc` is an interactive compiler,
and so can answer questions about entities as they come into existance and change throughout time,
for example:
- which new definitions were added in a REPL session?
- which definitions were replaced in an incremental build?
- how are definitions simplified as they are adapted to the runtime system?

## Hours, Minutes, and Periods

For the compiler to be able to resolve the above temporal questions, and more, it maintains
a concept of time. Additionally, because interactions are frequent, it is important to
persist knowledge of entities between interactions, allowing the compiler to remain performant;
knowing about time allows the compiler to efficiently mark entities as being outdated.

Conceptually, `dotc` works like a clock, where its minutes are represented by [phases],
and its hours by [runs]. Like a clock, each run passes once each of its phases have completed
sequentially, and then a new run can begin. Phases are further grouped into [periods], where
during a period certain entities of the compiler remain stable.

## Time Travelling

During a run, each phase can rewrite the world as the compiler sees it, for example:
- to transform trees,
- to gradually simplify type from Scala types to JVM types,
- to move definitions out of inner scopes to outer ones, fitting the JVM's model,
- and so on.

Because definitions can [change over time][dynamic], various artifacts associated with them
are stored non-destructively, and views of the definition created earlier, or later
in the compiler can be accessed by using the `atPhase` method, defined in [Contexts].

[runs]: https://github.com/lampepfl/dotty/blob/a527f3b1e49c0d48148ccfb2eb52e3302fc4a349/compiler/src/dotty/tools/dotc/Run.scala
[periods]: https://github.com/lampepfl/dotty/blob/a527f3b1e49c0d48148ccfb2eb52e3302fc4a349/compiler/src/dotty/tools/dotc/core/Periods.scala
[lifecycle]: {% link _overviews/scala3-contribution/arch-lifecycle.md %}
[phases]: {% link _overviews/scala3-contribution/arch-phases.md %}
[dynamic]: {% link _overviews/scala3-contribution/arch-symbols.md %}#definitions-are-dynamic
[Contexts]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Contexts.scala
