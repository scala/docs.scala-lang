---
title: Compatibility Reference
type: chapter
description: This chapter describes the compatibility between Scala 2.13 and Scala 3.
num: 1
previous-page:
next-page: compatibility-source
---

Scala 3 is a game changer in terms of compatibility in the Scala ecosystem that will greatly improve the day-to-day experience of every Scala programmer.
This new compatibility era starts with the migration.

Moving from Scala 2 to Scala 3 is a big leap forward.
Scala 3 is a shiny new compiler, built upon a complete redesign of the core foundations of the language.
Yet we claim the migration will not be harder than before, when we moved from Scala 2.12 to Scala 2.13.

It will even be simpler in some respects, thanks to the interoperability between Scala 2.13 and Scala 3.

This chapter details the level of compatibility between the two versions at the different stages of the program.
This is where you will find answers to the following questions:

**[Source Level](compatibility-source.html)**
- Is Scala 3 a different language?
- How hard is it to translate a Scala 2.13 project into Scala 3?

**[Classpath Level](compatibility-classpath.html)**
- Can we use a Scala 2.13 library in Scala 3?
- Inversely, can we use a Scala 3 library in Scala 2.13?

**[Runtime](compatibility-runtime.html)**
- Is it safe to deploy a Scala 3 program in a production environment?
- How fast are Scala 3 programs compared to Scala 2.13?

**[Metaprogramming](compatibility-metaprogramming.html)**
- Will my Scala 2.13 project be affected by the replacement of the Scala 2 macro feature?
- How can I port my Scala 2.13 macro library to Scala 3?
