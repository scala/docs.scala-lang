---
title: Inspection
type: section
description: This page describes the high level architecture for the Scala 3 compiler.
num: 6
previous-page: procedures-navigation
next-page: procedures-efficiency
---

## Inspecting variables in-place

Frequently you need to know what a particular variable's value is. The most robust way to get this info is good old `println`.

When printing a variable, it's always a good idea to call `show` on that variable: `println(x.show)`. `show` is defined on many types and returns a human-readable string. So, if called e.g. on a tree, you'll get the code that tree signifies as opposed to the bare AST.

Sometimes you need to print flags. Flags is a metadata attached to trees containing information such as whether a class is abstract, comes from Java, what modifiers a variable has (private, protected etc) and so on. Flags are stored in a single `Long` value each bit of which represents whether a particular flag is set.

To print flags, you can use the `flagsString` method, e.g. `println(x.flagsString)`.

## Obtaining debug output from the compiler

There are many compiler options that provide verbose debug output when compiling a file. You can find the full list in [ScalaSettings.scala](https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/config/ScalaSettings.scala) file. One particularly useful one is `-Xprint:<phase-name>` or `-Xprint:all`. It prints trees after a given phase or after all phases. The way the compiler works is that it parses your code into ASTs and then pipes those trees through several dozen phases. Each phase transforms the trees in a certain way. This flag allows you to see exactly how.
