---
title: Finding the Cause of an Issue
type: section
description: This page describes navigating around the Scala 3 compiler.
num: 6
previous-page: procedures-reproduce
next-page: procedures-areas
---

In this section, we will answer questions such as:
- where does the error happen in a codebase?
- where is a particular object created?
- where is a particular value assigned to a variable?

> You may be able to quickly find the source responsible for an issue by consulting [common issue locations][areas]

## Increasing Logging Output
Sometimes we can detect erroneous states producing an error by analysing logging output that is not
normally visible:

- general logging within a phase can be enabled with the `-Ylog` compiler flag, such as
  - `-Ylog:<phase1>,<phase2>,...` for individual phases
  - `-Ylog:all` for all phases.
- Additionally, various parts of the compiler have specialised logging objects, defined in [Printers].
  Change any of the printers of interest from `noPrinter` to `default` and increase output specialised
  to that domain.

## Navigating to Where an Error is Generated

Add the `-Ydebug-error` compiler flag, e.g. `scala3/scalac -Ydebug-error Test.scala`.
This flag forces a stack trace to be printed each time an error happens, from the site where it occurred.

Analysing the trace will give you a clue about the objects involved in producing the error.

## Where was a particular object created?

This question arises, e.g., if you realised there's an object on the error site that shouldn't be there, most probably causing the error. So, in attempt to rectify the offending object, you want to know where it was created.

We will do this by injecting a *tracer* into the class of an instance in question.
A tracer is the following variable:
```scala
val tracer = Thread.currentThread.getStackTrace.mkString("\n")
```
When placed as a top-level definition at a class, it will contain a stack trace pointing at where exactly
its particular instance was created. This is because, as a top-level `val`, it will be evaluated on
construction of the instance in question.

Once you've injected a tracer into a class, you can `println` that tracer from the error site or
other site you've found the object in question.

### Procedure

1.  Determine the type of the object in question. You can use one of the following techniques to do so:
     - Use an IDE to get the type of an expression, or save the expression to a `val`
       and see its inferred type.
     - Use `println` to print the object or use `getClass` on that object.
2.  Locate the type definition for the type of that object.
3.  Add a field `val tracer = Thread.currentThread.getStackTrace.mkString("\n")` to that type definition.
4.  `println(x.tracer)` (where `x` is the name of the object in question) from the original site where you
    encountered the object. This will give you the stack trace pointing to the place where the
    constructor of that object was invoked.

### Trace a Tree Creation Site

A special case of finding an object's creation site is for a Tree, this is supported directly in the compiler,
as trees have an associated unique ID:

1. Run the compiler with `-Xprint:<phase-name>` and `-Yshow-tree-ids` flags. You should see the tree in question
   be printed, alongside its ID. You'll see something like `println#223("Hello World"#37)`.
2. Copy the ID of the desired tree.
3. Run the compiler with `-Ydebug-tree-with-id <tree-id>` flag. The compiler will print a stack trace pointing to the creation site of the tree the ID provided.

## Where was a particular value assigned to a variable?

Say you have a certain [type][types] assigned to a [Denotation] and you would like to know why it is that
specific type. The type of a denotation is defined by `var myInfo: Type`, and can be assigned multiple times.
In this case, knowing the creation site of that `Type`, as described above, is not useful; instead, we need to
know the *assignment* (not *creation*) site.

This is done similarly to how you trace the creation site. Conceptually, you need to create a proxy for that variable that will log every write operation to it. Practically, if you are trying to trace the assignments to a variable `myInfo` of type `Type`, first, rename it to `myInfo_debug`. Then, insert the following at the same level as that variable:

```scala
var tracer = "",
def myInfo: Type = myInfo_debug,
def myInfo_=(x: Type) = { tracer = Thread.currentThread.getStackTrace.mkString("\n"); myInfo_debug = x }
```

[Printers]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/config/Printers.scala
[areas]: {% link _overviews/scala3-contribution/procedures-areas.md %}
[Denotation]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Denotations.scala
[types]: {% link _overviews/scala3-contribution/arch-types.md %}
