---
title: Compiler Overview
type: section
description: This page describes the lifecycle for the Scala 3 compiler.
num: 13
previous-page: arch-intro
next-page: arch-context
---

At a high level, `dotc` is an interactive compiler (see [what is a compiler?][whats-a-compiler]),
and can be invoked frequently, for example to answer questions for an IDE, provide REPL completions,
or to manage incremental builds and more. Each of these use cases requires a customised
workflow, but sharing a common core.

## Introducing the Compiler's Lifecycle

#### Core
Customisation is provided by extending the [Compiler] class, which maintains an ordered
list of [phases][Phases], and how to [run][Run] them. Each interaction with a compiler
creates a new run, which is a complete iteration of the compiler's phases over a list
of input sources. Each run has the capability to create new definitions or
invalidate older ones, and `dotc` can [track these changes over time][time].

#### Runs
During a run, the input sources are converted to [compilation units][CompilationUnit] (i.e. the abstraction of
compiler state associated with each input source); then iteratively: a single phase is applied to
every compilation unit before progressing to the next phase.

#### Phases
A phase is an abstract transformation over a compilation unit, it is usually responsible
for transforming the trees and types representing the code of a source file. Some phases of
the compiler are:
- `parser`, which converts text that matches Scala's
  [syntax] into abstract syntax trees, ASTs
- `typer`, which checks that trees conform to expected types
- `erasure`, which retypes a more simplified program into one that has the same types as the JVM.
- `genBCode`, the JVM backend, which converts erased compiler trees into Java bytecode format.

[You can read more about phases here][phase-categories].

#### Drivers

The core compiler also requires a lot of state to be initialised before use, such as [settings][ScalaSettings]
and the [Context][contexts]. For convenience, the [Driver] class contains high level functions for
configuring the compiler and invoking it programatically. The object [Main] inherits from `Driver`
and is invoked by the `scalac` script.

## Code Structure

The code of the compiler is found in the package [dotty.tools],
containing the following sub-packages:
```scala
tools // contains helpers and the `scala` generic runner
├── backend // Compiler backends (currently JVM and JS)
├── dotc // The main compiler, with subpackages:
│   ├── ast // Abstract syntax trees
│   ├── classpath
│   ├── config // Compiler configuration, settings, platform specific definitions.
│   ├── core // Core data structures and operations, with specific subpackages for:
│   │   ├── classfile // Reading of Java classfiles into core data structures
│   │   ├── tasty // Reading and writing of TASTY files to/from core data structures
│   │   └── unpickleScala2 // Reading of Scala2 symbol information into core data structures
│   ├── decompiler // pretty printing TASTY as code
│   ├── fromtasty // driver for recompilation from TASTY
│   ├── interactive // presentation compiler and code completions
│   ├── parsing // Scanner and parser
│   ├── plugins // compile plugin definitions
│   ├── printing // Pretty-printing trees, types and other data
│   ├── profile // internals for profiling the compiler
│   ├── quoted // internals for quoted reflection
│   ├── reporting // Reporting of error messages, warnings and other info.
│   ├── rewrites // Helpers for rewriting Scala 2's constructs into Scala 3's.
│   ├── sbt // Helpers for communicating with the Zinc compiler.
│   ├── semanticdb // Helpers for exporting semanticdb from trees.
│   ├── transform // Miniphases and helpers for tree transformations.
│   ├── typer // Type-checking
│   └── util // General purpose utility classes and modules.
├── io // Helper modules for file access and classpath handling.
├── repl // REPL driver and interaction with the terminal
├── runner // helpers for the `scala` generic runner script
└── scripting // scala runner for the -script argument
```

[whats-a-compiler]: {% link _overviews/scala3-contribution/contribution-intro.md %}#what-is-a-compiler
[Phases]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Phases.scala
[CompilationUnit]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/CompilationUnit.scala
[time]: {% link _overviews/scala3-contribution/arch-time.md %}
[dotty.tools]: https://github.com/lampepfl/dotty/tree/master/compiler/src/dotty/tools
[ScalaSettings]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/config/ScalaSettings.scala
[phase-categories]: {% link _overviews/scala3-contribution/arch-phases.md %}#phase-categories
[syntax]: {% link _scala3-reference/syntax.md %}
[Main]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Main.scala
[Driver]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Driver.scala
[Compiler]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Compiler.scala
[Run]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/Run.scala
[contexts]: {% link _overviews/scala3-contribution/arch-context.md %}
