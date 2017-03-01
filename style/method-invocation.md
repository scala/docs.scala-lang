---
layout: overview-large
title: Method Invocation

partof: style-guide
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

### Suffix Notation

Scala allows methods of arity-0 to be invoked using suffix notation:

    names.toList

    // is the same as

    names toList // Unsafe, don't use!

This style is unsafe, and should not be used.  Since semicolons are
optional, the compiler will attempt to treat it as an infix method
if it can, potentially taking a term from the next line.  

    names toList
    val answer = 42        // will not compile!

This may result in unexpected compile errors at best, and happily
compiled faulty code at worst.  Although the syntax is used by some
DSLs, it should be considered deprecated, and avoided.

As of Scala 2.10, using suffix operator notation will result in a compiler warning.

## Arity-1

Scala has a special syntax for invoking methods of arity-1 (one
argument):

    names.mkString(",")

    // is the same as

    names mkString ","

This syntax is formally known as "infix notation". It should *only* be
used for purely-functional methods (methods with no side-effects) - such
as `mkString` -or methods which take functions as parameters - such as
`foreach`:

    // right!
    names foreach (n => println(n))
    names mkString ","
    optStr getOrElse "<empty>"

    // wrong!
    javaList add item

### Higher-Order Functions

As noted, methods which take functions as parameters (such as `map` or
`foreach`) should be invoked using infix notation. It is also *possible*
to invoke such methods in the following way:

    names.map (_.toUpperCase)     // wrong!

This style is *not* the accepted standard! The reason to avoid this
style is for situations where more than one invocation must be chained
together:

    // wrong!
    names.map (_.toUpperCase).filter (_.length > 5)

    // right!
    names map (_.toUpperCase) filter (_.length > 5)

Both of these work, but the former exploits an extremely unintuitive
wrinkle in Scala's grammar. The sub-expression
`(_.toUpperCase).filter` when taken in isolation looks for all the
world like we are invoking the `filter` method on a function value.
However, we are actually invoking `filter` on the result of the `map`
method, which takes the function value as a parameter. This syntax is
confusing and often discouraged in Ruby, but it is shunned outright in
Scala.

## Symbolic methods/Operators

Methods with symbolic names should *always* be invoked using infix
notation with spaces separating the target, the symbolic method and the
parameter:

    // right!
    "daniel" + " " + "Spiewak"

    // wrong!
    "daniel"+" "+"spiewak"

For the most part, this idiom follows Java and Haskell syntactic
conventions.

Symbolic methods which take more than one parameter (they do exist!)
should still be invoked using infix notation, delimited by spaces:

    foo ** (bar, baz)

Such methods are fairly rare, however, and should be avoided during API
design.

Finally, the use of the `/:` and `:\` should be avoided in preference to
the more explicit `foldLeft` and `foldRight` method of `Iterator`. The
right-associativity of the `/:` can lead to extremely confusing code, at
the benefit of saving a few characters.
