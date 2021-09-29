---
title: Cheatsheets
type: section
description: This page describes a cheatsheet for working with the Scala 3 compiler.
num: 4
previous-page: procedures-intro
next-page: procedures-reproduce
---

This page is a quick-reference guide for common tasks while working with the compiler.
For more in-depth explainations, see the rest of this chapter.

## sbt Commands

The following commands can be run within `sbt` in the dotty directory.

| Command                            | Description                                                      |
|------------------------------------|------------------------------------------------------------------|
| `scala3-bootstrapped/test`         | Run all tests for Scala 3                                        |
| `scala3-bootstrapped/publishLocal` | Build Scala 3 for use in local projects                          |
| `scala3/scalac local/Foo.scala`    | Compile the given file – path relative to the dotty directory.   |
| `scala3/scala Foo`                 | Run class `Foo` with dotty directory on the classpath            |
| `repl`                             | Start a REPL with the bootstrapped compiler                      |
| `testCompilation tests/pos`        | Run test suites on files in the `tests/pos` directory.           |
| <code>testOnly<br/>dotty.tools.dotc.CompilationTests<br/>-- *pos</code> | Run test `pos` from `CompilationTests` suite. |
| <code>scala3-compiler/Test/runMain<br/>dotty.tools.printTypes</code> | Print types underlying representation |
| <code>scala3/scalac -print-tasty<br/>local/out/Foo.tasty</code> | Print the TASTy of top-level class `Foo` |

## Shell Commands

| Command                              | Description                                                      |
|--------------------------------------|------------------------------------------------------------------|
| `rm -rv *.tasty *.class out || true` | clean all compiled artifacts, from root dotty directory          |

<!-- Todo: add cheatsheet for compiler flags, and places to go in code for certain issues -->
