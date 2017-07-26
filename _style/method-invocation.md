---
layout: style-guide
title: Method Invocation

partof: style
overview-name: "Style Guide"

num: 8

previous-page: control-structures
next-page: declarations
---

Generally speaking, method invocation in Scala follows Java conventions.
In other words, there should not be a space between the invocation
target and the dot (`.`), nor a space between the dot and the method
name, nor should there be any space between the method name and the
argument-delimiters (parentheses). Each argument should be separated by
a single space *following* the comma (`,`):

    foo(42, bar)
    target.foo(42, bar)
    target.foo()

As of version 2.8, Scala now has support for named parameters. Named
parameters in a method invocation should be treated as regular
parameters (spaced accordingly following the comma) with a space on
either side of the equals sign:

    foo(x = 6, y = 7)

While this style does create visual ambiguity with named parameters and
variable assignment, the alternative (no spacing around the equals sign)
results in code which can be very difficult to read, particularly for
non-trivial expressions for the actuals.

## Arity-0

Scala allows the omission of parentheses on methods of arity-0 (no
arguments):

    reply()

    // is the same as

    reply

However, this syntax should *only* be used when the method in question
has no side-effects (purely-functional). In other words, it would be
acceptable to omit parentheses when calling `queue.size`, but not when
calling `println()`. This convention mirrors the method declaration
convention given above.

Religiously observing this convention will *dramatically* improve code
readability and will make it much easier to understand at a glance the
most basic operation of any given method. Resist the urge to omit
parentheses simply to save two characters!

## Infix notation

Scala has a special punctuation-free syntax for invoking methods that
take one argument. Many Scala programmers use this notation for
symbolic-named methods:

    // recommended
    a + b

    // legal, but less readable
    a+b

    // legal, but definitely strange
    a.+(b)

but avoid it for almost all alphabetic-named methods:

    // recommended
    names.mkString(",")

    // also sometimes seen; controversial
    names mkString ","

A gray area is short, operator-like methods like `max`,
especially if commutative:

    // fairly common
    a max b

Symbolic methods which take more than one parameter (they do exist!)
may still be invoked using infix notation, delimited by spaces:

    foo ** (bar, baz)

Such methods are fairly rare, however, and should normally be avoided
during API design.  For example, the use of the `/:` and `:\` methods
should be avoided in preference to their better-known names,
`foldLeft` and `foldRight`.

## Postfix Notation

Scala allows methods that take no arguments to be invoked using postfix notation:

    // recommended
    names.toList

    // discourage
    names toList

This style is unsafe, and should not be used.  Since semicolons are
optional, the compiler will attempt to treat it as an infix method
if it can, potentially taking a term from the next line.

    names toList
    val answer = 42        // will not compile!

This may result in unexpected compile errors at best, and happily
compiled faulty code at worst.  Although the syntax is used by some
DSLs, it should be considered deprecated, and avoided.

Since Scala 2.10, using postfix operator notation will result in a
compiler warning.
