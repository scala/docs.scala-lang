---
layout: sip
title: SIP-12 - Uncluttering Scala’s syntax for control structures.

vote-status: rejected
vote-text: The committee votes unanimously to reject the change. The conclusion is that there is not a clear benefit for it and the required invested time and efforts would be too high. For more explanation, read the <a href=minutes/2016-08-16-sip-10th-august-minutes.html>minutes</a>.
permalink: /sips/:title.html
redirect_from: /sips/pending/uncluttering-control.html
---

**By: Martin Odersky**

## Motivation ##

The more Scala code I write the more I get tripped up by the need to write conditions in  if-then-else expressions and other control constructs in parentheses. I normally would not advocate syntax changes at this level, except that this has been the single syntax decision that feels worse for me the longer I use it.

## Part 1: if ##

Having to write parentheses is an unfortunate inheritance from C via Java. It makes code more cluttered than it could be. In C/C++/Java this was no big deal, but because Scala is much cleaner syntactically than these languages it starts to stick out like a sore thumb. This in particular because only one form of `if` comes with parentheses; if you use an if as a filter in a for expression or as a guard in a pattern, no parentheses are required.

So, here is the proposal (for Scala 2.10):

1. Introduce a new keyword, `then`.

2.  Allow the following alternative syntax form:

        if expression then expression [else expression]

3.  At some point in the future (there’s no rush) we could deprecate the form

        if (expression) expression else expression

    and then remove it.


Once we have dealt with if, we should do the same thing with while, do-while and for.

## Part 2: do-while ##

do-while is easy. Simply do the following:

1.  Allow

        do expression while expression

    as syntax (i.e. drop the required parentheses around the condition).

While loops and for loops are more tricky.

## Part 3: while ##

For while loops:

1. Allow

        while expression do expression

    as syntax.We then have to deal with an ambiguity: What should we do with

        while (expression1) do expression2 while (expression3)

    ? I.e. a `do-while` loop inside an old-style `while` loop? Here’s a possible migration strategy.

2.  In Scala 2.10:  Introduce

        while expression1 do expression2

    where `expression1` is not allowed to have parentheses at the outermost level (there’s no need to have them anyway). Also, emit a deprecation warning if the compiler comes across a do-while nested directly in an old-style while:

        while (expression1) do expression2 while expression3

    To write a `do-while` inside a `while` loop you will need braces, like this:

        while (expression1) { do expression2 while epression3 }

3.  In Scala 2.11: Disallow

        while (expression1) do expression2 while expression3

4.  In Scala 2.12: Drop the restriction introduced in 2.10. Conditions in a `while-do` can now be arbitrary expressions including with parentheses at the outside.

## Part 4: for ##

For-loops and for expressions can be handled similarly:

1.  Allow

        for enumerators yield expression

    as syntax. Enumerators are treated as if they were in  braces, i.e. newlines can separate generators without the need for additional semicolons.

2.  Allow

        for enumerators do expression

    as syntax. Treat `do-while` ambiguities as in the case for `while`.

3.  At some point in the future: deprecate, and then drop the syntax

        for (enumerators) expression
        for {enumerators} expression
        for (enumerators) yield expression
        for {enumerators} yield expression

## Examples ##

Here are some examples of expressions enabled by the changes.

    if x < y then x else y

    while x >= y do x /= 2

    for x <- 1 to 10; y <- 1 to 10 do println(x * y)

    for
      x <- 0 until N
      y <- 0 until N
      if isPrime(x + y)
    yield (x, y)

## Discussion ##

The new syntax removes more cases than it introduces. It also removes several hard to remember and non-orthogonal rules where you need parentheses, where you can have braces, and what the difference is. It thus makes the language simpler, more regular, and more pleasant to use. Some tricky situations with migration can be dealt with; and should apply anyway only in rare cases.
