---
layout: singlepage-overview
title: Error Formatting
---

# Introduction

Scala provides advanced mechanisms for formatting type errors and inspecting
implicit resolution failures.

These features are available in **Scala 2.13.6 and later**, and are also
supported in **Scala 3**, where they continue to evolve. Some options may have
different defaults or slightly different behavior between Scala 2 and Scala 3.
It is based on the compiler plugin [splain](https://github.com/tek/splain).

This tool abstracts several classes of compiler errors with simple data types
that can be processed by a few built-in routines as well as
[user-provided analyzer plugins](/overviews/plugins/index.html).

The most significant feature is the illustration of chains of implicit instances
that allows a user to determine the root cause of an implicit error:

![implicits](/resources/img/implicits-circe.jpg)

# Basic Configuration

- `-Vimplicits` enables printing of implicit chains
- `-Vtype-diffs` enables colored diffs for found/required errors

## Additional Configuration

`-Vimplicits-verbose-tree` shows the implicits between the error site and the
root cause, see [#implicit-resolution-chains].

`-Vimplicits-max-refined` reduces the verbosity of refined types, see
[#truncating-refined-types].

# Features

The error formatting engine provides the following enhancements:

## Infix Types

Instead of `shapeless.::[A, HNil]`, prints `A :: HNil`.

## Found/Required Types

Rather than printing up to four types, only the dealiased types are shown as a colored diff:

![foundreq](/resources/img/foundreq.jpg)

## Implicit Resolution Chains

When an implicit is not found, only the outermost error at the invocation point is printed by the regular error
reporter.
Previously, the flag `-Xlog-implicits` caused the compiler to print all information about processed implicits, but the
output was highly verbose and contained all invalid implicits for parameters that have been resolved successfully.
The flag has been renamed to `-Vimplicits` and prints a compact list of all involved implicit instances.
`-Xlog-implicits` will continue to work as a deprecated alias.

![compact](/resources/img/implicits-compact.jpg)

Here, `!I` stands for _could not find implicit value_, the name of the implicit
parameter is in yellow, and its type in green.

If the parameter `-Vimplicits-verbose-tree` is given, all intermediate implicits will be
printed, potentially spanning tens of lines.
An example of this is the circe error at the top of the page.

For comparison, this is the regular compiler output for this case:

```
[error] /path/Example.scala:20:5: could not find implicit value for parameter a: io.circe.Decoder[A]
[error]   A.fun
[error]     ^
```

## Infix Type and Type Argument Line Breaking

Types longer than 79 characters will be split into multiple lines:

```
implicit error;
!I e: String
f invalid because
!I impPar4: List[
  (
    VeryLongTypeName ::::
    VeryLongTypeName ::::
    VeryLongTypeName ::::
    VeryLongTypeName
  )
  ::::
  (Short :::: Short) ::::
  (
    VeryLongTypeName ::::
    VeryLongTypeName ::::
    VeryLongTypeName ::::
    VeryLongTypeName
  )
  ::::
  VeryLongTypeName ::::
  VeryLongTypeName ::::
  VeryLongTypeName ::::
  VeryLongTypeName
]
```

## Truncating Refined Types

Refined types, like `T { type A = X; type B = Y }`, can get rather long and clutter up error messages.
The option `-Vimplicits-max-refined` controls how many characters the refinement may take up before it gets displayed as
`T {...}`.
The default is to display the unabridged type.
