---
layout: style-guide
title: Method Invocation

partof: style
overview-name: "Style Guide"

num: 8

previous-page: control-structures
next-page: files
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

## Arity-1 (Infix Notation)

Scala has a special punctuation-free syntax for invoking methods of arity-1
(one argument). This should generally be avoided, but with the following
exceptions for operators and higher-order functions. In these cases it should
only be used for purely-functional methods (methods with no side-effects).

    // recommended
    names.mkString(",")

    // also sometimes seen; controversial
    names mkString ","

    // wrong - has side-effects
    javaList add item

### Symbolic Methods/Operators

Symbolic methods (operators) should always be invoked using infix notation with
spaces separating the target, the operator, and the parameter:

    // right!
    "daniel" + " " + "spiewak"
    a + b

    // wrong!
    "daniel"+" "+"spiewak"
    a+b
    a.+(b)

For the most part, this idiom follows Java and Haskell syntactic conventions. A
gray area is short, operator-like methods like `max`, especially if commutative:

    // fairly common
    a max b

Symbolic methods which take more than one parameter (they do exist!)
may still be invoked using infix notation, delimited by spaces:

    foo ** (bar, baz)

Such methods are fairly rare, however, and should normally be avoided during API
design. For example, the use of the `/:` and `:\` methods should be avoided in
preference to their better-known names, `foldLeft` and `foldRight`.

### Higher-Order Functions

As noted, methods which take functions as parameters (such as `map` or
`foreach`) should be invoked using infix notation. It is also *possible* to
invoke such methods in the following way:

    // wrong!
    names.map { _.toUpperCase }

This style is *not* the accepted standard! The reason to avoid this style is for
situations where more than one invocation must be chained together:

    // wrong!
    names.map { _.toUpperCase }.filter { _.length > 5 }

    // right!
    names map { _.toUpperCase } filter { _.length > 5 }

Both of these work, but the former can easily lead to confusion. The
sub-expression `{ _.toUpperCase }.filter` when taken in isolation looks like we
are invoking the `filter` method on a function value. However, we are actually
invoking `filter` on the result of the `map` method, which takes the function
value as a parameter.
