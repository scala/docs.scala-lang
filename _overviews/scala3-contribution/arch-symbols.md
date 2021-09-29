---
title: Symbols
type: section
description: This page describes symbols in the Scala 3 compiler.
num: 17
previous-page: arch-time
next-page: arch-context
---

> (The following is work in progress), adapted from dotty.epfl.ch

## Symbols and SymDenotations

 - why symbols are not enough: their contents change all the time
 - reference: string + sig


`dotc` is different from most other compilers in that it is centered around the idea of
maintaining views of various artifacts associated with code. These views are indexed
by time.

A symbol refers to a definition in a source program. Traditionally,
compilers store context-dependent data in a _symbol table_. The
symbol then is the central reference to address context-dependent
data. But for the requirements of `dotc` it turns out that symbols are
both too little and too much for this task.

**Too little:** The attributes of a symbol depend on the phase. Examples:
Types are gradually simplified by several phases. Owners are changed
in phases `LambdaLift` (when methods are lifted out to an enclosing
class) and Flatten (when all classes are moved to top level). Names
are changed when private members need to be accessed from outside
their class (for instance from a nested class or a class implementing
a trait). So a functional compiler, a `Symbol` by itself met mean
much. Instead we are more interested in the attributes of a symbol at
a given phase.

**Too much:** If a symbol is used to refer to a definition in another
compilation unit, we get problems for incremental recompilation. The
unit containing the symbol might be changed and recompiled, which
might mean that the definition referred to by the symbol is deleted or
changed. This leads to the problem of stale symbols that refer to
definitions that no longer exist in this form. Scala 2 compiler tried to
address this problem by _rebinding_ symbols appearing in certain cross
module references, but it turned out to be too difficult to do this
reliably for all kinds of references. Scala 3 compiler attacks the problem at
the root instead. The fundamental problem is that symbols are too
specific to serve as a cross-module reference in a system with
incremental compilation. They refer to a particular definition, but
that definition may not persist unchanged after an edit.

`dotc` uses instead a different approach: A cross module reference is
always type, either a `TermRef` or `TypeRef`. A reference type contains
a prefix type and a name. The definition the type refers to is established
dynamically based on these fields.


<!-- a system where sources can be recompiled at any instance,

 the concept of a `Denotation`.

 Since definitions are transformed by phases, -->

## Symbols
`dotc/core/Symbols.scala`

Symbols are references to definitions (e.g. of variables, fields, classes). Symbols can be used to refer to definitions for which we don't have ASTs (for example, from the Java standard library).

`NoSymbol` is used to indicate the lack of a symbol.

Symbols uniquely identify definitions, but they don't say what the definitions *mean*. To understand the meaning of a symbol
we need to look at its *denotation* (spefically for symbols, a `SymDenotation`).

Symbols can not only represent terms, but also types (hence the `isTerm`/`isType` methods in the `Symbol` class).

## ClassSymbol

`ClassSymbol` represents either a `class`, or an `trait`, or an `object`. For example, an object
```scala
object O {
  val s = 1
}
```
is represented (after `Typer`) as
```scala
class O$ { this: O.type =>
  val s = 1
}
val O = new O$
```
where we have a type symbol for `class O$` and a term symbol for `val O`. Notice the use of the selftype `O.type` to indicate that `this` has a singleton type.


## SymDenotation
`dotc/core/SymDenotations.scala`

Symbols contain `SymDenotation`s. The denotation, in turn, refers to:

  * the source symbol (so the linkage is cyclic)
  * the "owner" of the symbol:
    - if the symbol is a variable, the owner is the enclosing method
    - if it's a field, the owner is the enclosing class
    - if it's a class, then the owner is the enclosing class
  * a set of flags that contain semantic information about the definition (e.g. whether it's a trait or mutable). Flags are defined in `Flags.scala`.
  * the type of the definition (through the `info` method)

## Denotation
[Comment with a few details:][Denotations2]

A `Denotation` is the result of a name lookup during a given period

* Most properties of symbols are now in the denotation (name, type, owner,
  etc.)
* Denotations usually have a reference to the selected symbol
* Denotations may be overloaded (`MultiDenotation`). In this case the symbol
  may be `NoSymbol` (the two variants have symbols).
* Non-overloaded denotations have an `info`

Denotations of methods have a [signature][Signature1], which
uniquely identifies overloaded methods.

### Denotation vs. SymDenotation
A `SymDenotation` is an extended denotation that has symbol-specific properties
(that may change over phases)
* `flags`
* `annotations`
* `info`

`SymDenotation` implements lazy types (similar to scalac). The type completer
assigns the denotation's `info`.

[Denotations2]: https://github.com/lampepfl/dotty/blob/a527f3b1e49c0d48148ccfb2eb52e3302fc4a349/compiler/src/dotty/tools/dotc/core/Denotations.scala#L77-L103
[Signature1]: https://github.com/lampepfl/dotty/blob/a527f3b1e49c0d48148ccfb2eb52e3302fc4a349/compiler/src/dotty/tools/dotc/core/Signature.scala#L9-L33
