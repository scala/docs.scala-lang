---
title: Source Level
type: section
description: This section describes the level of compatibility between Scala 2.13 and Scala 3 sources.
num: 2
previous-page: compatibility-intro
next-page: compatibility-classpath
---

Scala 3 is an improved version of the Scala 2 language.

Despite the new syntax, a very large subset of the Scala 2.13 language is still valid.
Not all of it though, some constructs have been simplified, restricted or dropped altogether.
However those decisions were made for good reasons and by taking care that a good workaround is possible.

In general there is a straightforward cross-compiling solution to every incompatibility, so that the migration from Scala 2.13 to Scala 3 is easy and smooth.
You can find a corpus of incompatibilities in the [Incompatibility Table](incompatibility-table.html).

There is an exception though, which is the new metaprogramming framework that replaces the Scala 2 experimental macros.
Further explanations are given at the end of this chapter in the [Metaprogramming](compatibility-metaprogramming.html) section.

Metaprogramming aside, a Scala 2.13 source code can rather easily be ported to Scala 3.
Once done, you will be able to use the new powerful features of Scala 3, which have no equivalent in Scala 2.
The downside is those sources cannot be compiled with Scala 2.13 anymore.
But amazingly, this new Scala 3 artifact can be consumed as a dependency in Scala 2.13.

As we will see in more detail, it permits backward and forward compatibility.
This is a breakthrough in the history of the Scala programming language.
