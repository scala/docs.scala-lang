---
title: Runtime
type: section
description: This section describes the run-time characteristics of a Scala 3 program.
num: 4
previous-page: compatibility-classpath
next-page: compatibility-metaprogramming
---

Scala 2.13 and Scala 3 share the same Application Binary Interface (ABI).

> The ABI is the representation of Scala code in bytecode or Scala.js IR.
> It determines the run-time behavior of Scala programs.

Compiling the same source code with Scala 2.13 and Scala 3 produces very similar bytecodes.
The difference being that some features have changed, for instance the initialization of lazy vals has been improved. 

Sharing the ABI also ensures that Scala 2.13 and Scala 3 class files can be loaded by the same JVM class loader.
Similarly, that Scala 2.13 and Scala 3 `sjsir` files can be linked together by the Scala.js linker.

Furthermore it relieves us from surprising behaviors at runtime.
It makes the migration from Scala 2.13 to Scala 3 very safe in terms of run-time crashes and performance.

At first sight the run-time characteristics of a Scala program is neither better nor worse in Scala 3 compare to Scala 2.13.
However some new features will help you optimize your program:
- [Opaque Type Aliases](http://nightly.scala-lang.org/docs/reference/other-new-features/opaques.html)
- [Inline Methods](http://nightly.scala-lang.org/docs/reference/metaprogramming/inline.html)
- [@threadUnsafe annotation](http://nightly.scala-lang.org/docs/reference/other-new-features/threadUnsafe-annotation.html)
