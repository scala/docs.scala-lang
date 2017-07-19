---
layout: overview
title: Overview

discourse: true

partof: repl
num: 1
outof: 2
---

The Scala REPL is a tool (_scala_) for evaluating expressions in Scala.

The _scala_ command will execute a source script by wrapping it in a template and
then compiling and executing the resulting program.

In interactive mode, the REPL reads expressions at the prompt, wraps them in
an executable template, and then compiles and executes the result.

Previous results are automatically imported into the scope of the current
expression as required.

The REPL also provides some command facilities, described below.

An alternative REPL is available in [the Ammonite project](https://github.com/lihaoyi/Ammonite),
which also provides a richer shell environment.

Useful REPL features include:

  - the REPL's IMain is bound to `$intp`.
  - the REPL's last exception is bound to `lastException`.
  - use tab for completion.
  - use `//print<tab>` to show typed desugarings.
  - use `:help` for a list of commands.
  - use `:paste` to enter a class and object as companions.
  - use `:paste -raw` to disable code wrapping, to define a package.
  - use `:javap` to inspect class artifacts.
  - use `-Yrepl-outdir` to inspect class artifacts with external tools.
  - use `:power` to enter power mode and import compiler components.

Implementation notes:

  - user code can be wrapped in either an object (so that the code runs during class initialization)
    or a class (so that the code runs during instance construction). The switch is `-Yrepl-class-based`.

### Power Mode

`:power` mode imports identifiers from the interpreter's compiler.

That is analogous to importing from the runtime reflective context using `import reflect.runtime._, universe._`.

Power mode also offers some utility methods as documented in the welcome banner.

Its facilities can be witnessed using `:imports` or `-Xprint:parser`.

### Contributing to Scala REPL

The REPL source is part of the Scala project. Issues are tracked by the standard
mechanism for the project and pull requests are accepted at [the github repository](https://github.com/scala/scala).

