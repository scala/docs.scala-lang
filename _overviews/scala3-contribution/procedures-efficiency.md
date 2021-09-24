---
title: Getting Efficient
type: section
description: This page describes improving efficiency of debugging the Scala 3 compiler.
num: 8
previous-page: procedures-inspection
next-page: procedures-testing
---

At the Navigation and Inspections sections, we have covered some techniques of working with the compiler. One repeating theme is that there are certain things that need to be done repeatedly and a lot. These are, e.g.:

- Navigating stack frames
- Printing variables in certain ways
- Instrumenting variable definitions with tracers

These seemingly tiny and insignificant things take a lot of time. They also reduce productivity: if the cost (in terms of time and effort) of navigating to a stack frame is high, you'll think twice before doing so, and possibly miss valuable information.

So, if you're doing those things really frequently, it's a good idea to spend some time scripting your editor to allow you to do them fast. E.g. you can set up your editor to take you to a stack frame when you click it or create text editor macros to instrument variables for printing.

An example of how it is done for Sublime Text 3 is [here](https://github.com/anatoliykmetyuk/scala-debug-sublime).

True, it takes some time to script your editor, but if you spend a lot of time with issues, it pays off.
