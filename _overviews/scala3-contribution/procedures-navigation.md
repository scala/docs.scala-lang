---
title: Navigation
type: section
description: This page describes the high level architecture for the Scala 3 compiler.
num: 5
previous-page: procedures-reproduce
next-page: procedures-inspection
---

Navigation answers the questions such as: where does the error happen in a codebase? Where is a particular object created? Where is a particular value assigned to a variable?

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

This can be done by injecting a *tracer* into the class of an instance in question. A tracer is the following variable: `val tracer = Thread.currentThread.getStackTrace.mkString("\n")`. When placed as a top-level definition at a class, it will contain a stack trace pointing at where exactly its particular instance was created. This is because, as a top-level `val`, it will be evaluated on construction of the instance in question.

Once you've injected a tracer into a class, you can `println` that tracer from the error site or other site you've found the object in question.

### Procedure

1. Determine the type of the object in question. You can use one of the following techniques to do so:
    - Use your Metals-integrated IDE to determine the type
    - Use `println` to print the object or `getClass` of that object
    - Look at the context of where you encountered that object
2. Locate the type definition of the type of that object
3. Add a top-level definition `val tracer = Thread.currentThread.getStackTrace.mkString("\n")` to that type definition.
4. `println(x.tracer)` (where `x` is the name of the object in question) from the original site where you encountered the object. This will give you the stack trace pointing to the place where the constructor of that object was invoked.

## Where was a particular value assigned to a variable?

Say you have a certain type assigned to a denotation and you would like to know why the denotation was typed that way. A type in the denotation is a `var myInfo: Type` so you can't just trace the creation site of that `Type` as was described before. You want to know the *assignment*, not *creation*, site.

This is done similarly to how you trace the creation site. Conceptually, you need to create a proxy for that variable that will log every write operation to it. Practically, if you are trying to trace the assignments to a variable `myInfo` of type `Type`, first, rename it to `myInfo_debug`. Then, insert the following at the same level as that variable:

```scala
var tracer = "",
def myInfo: Type = myInfo_debug,
def myInfo_=(x: Type) = { tracer = Thread.currentThread.getStackTrace.mkString("\n"); myInfo_debug = x }
```

The procedure for figuring out an assignment site to a variable is the same as figuring out the creation site, except for the step (2) where you do as described in this section.

[Printers]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/config/Printers.scala
