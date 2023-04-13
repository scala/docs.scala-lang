---
title: Cheatsheets
type: section
description: This page describes a cheatsheet for working with the Scala 3 compiler.
num: 4
previous-page: procedures-intro
next-page: procedures-reproduce
---

This page is a quick-reference guide for common tasks while working with the compiler.
For more in-depth explanations, see the rest of this chapter.

## sbt Commands

The following commands can be run within `sbt` in the dotty directory:

| Commands                                                            | Description                                                                                                                    |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `testCompilation sample`                                            |  In all test suites, run test files containing the word `sample` in their title.                                               |
| `scala3/scalac`                                                     |  Run the compiler directly, with any current changes.                                                                          |
| `scala3/scala`                                                      |  Run the main method of a given class name.                                                                                    |
| `repl`                                                              |  Start a REPL with the bootstrapped compiler.                                                                                  |
| `testOnly *CompilationTests -- *pos`                                |  Run test `pos` from the compilation test suite.                                                                               |
| `scala3-compiler/Test/runMain dotty.tools.printTypes`               |  Print types underlying representation                                                                                         |
| `scala3/scalac -print-tasty Foo.tasty`                              |  Print the TASTy of top-level class `Foo`                                                                                      |
| `scala3-bootstrapped/test`                                          |  Run all tests for Scala 3. (Slow, recommended for CI only)                                                                    |
| `scala3-bootstrapped/publishLocal`                                  |  Build Scala 3 locally. (Use to debug a specific project)                                                                      |
| `scalac ../issues/Playground.scala`                                 |  Compile the given file – path relative to the Dotty directory. Output the compiled class files to the Dotty directory itself. |

## Shell Commands

| Command                              | Description                                                      |
|--------------------------------------|------------------------------------------------------------------|
| `rm -rv *.tasty *.class out || true` | clean all compiled artifacts, from root dotty directory          |

<!-- Todo: add cheatsheet for compiler flags, and places to go in code for certain issues -->
