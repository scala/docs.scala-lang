---
layout: sip
disqus: true
title: SIP-11 String Interpolation
---
### Martin Odersky ###

## Motivation ##

The wish for string interpolation has come up frequently before. So far I have argued against adding this feature because the standard Java/Scala way of composing strings with "`+`" is not much longer. More precisely:

    "Bob is "+n+" years old"

is just one character longer than

    "Bob is \{n} years old"

However, this holds only if one writes no spaces around "`+`" in string composition, and few people do. If one follows the standard “space around operator” convention one gets

    "Bob is " + n + " years old"

which is 5 characters longer as well as being arguably less legible than the interpolation syntax. Plus, it’s much harder to get trailing and leading spaces right in this mode. 

Another advantage of string interpolation is that it can be extended to include format strings naturally. Notably I’d like to propose the following syntax

    "Success in \{x;2.2f} of all cases"

instead of the bulkier:

    "Success in " + (x formatted "%2.2f") + " of all cases"

The alternative of writing

    "Success in %2.2f of all cases" format x

works better but gets complicated when there are many embedded fields because they have to be matched by position to their format specifiers.

The alternative of writing

    "Success in \{x formatted "%2.2f"} of all cases"

Is longer, but still clean. However, I fear it will throw most editors into a highlighting fit because of the nested quote characters. So the proposed format syntax extension seems to be the only one which combines locality (format string next to formatted expression) with good usability in all other respects.

## Proposal ##

1. String literals (but not raw strings) allow a new escape:

    \{ Expr }

The text inside the braces can be an arbitary Scala expression of syntactic category Expr. Whitespace is allowed around Expr. The string literal

    "text1\{ expr }text2"

is equivalent to:

    (“text1” + (expr).unformatted + “text2”)

Here, unformatted is a new method in class StringAdd, defined as follows:

    def show: String = self.toString

### Note 1: ###
Methods in `StringAdd` are injected into every type via an implicit conversion in `Predef`. It’s perfectly possible to have types that implement these method themselves. In that case the type’s implementation will take precedence over the standard methods in `StringAdd`. This opens the possibility of defining unformatted yourself, as an alternative for the (usually lower-level) `toString` method.

2. The interpolation escape can be augmented by a format section, as in:

    \{ Expr;Fmt}

Here `Fmt` can be an arbitrary character sequence not containing whitespace, closing braces, closing quotes, or new line characters. An escape `\{ Expr;}` with an empty format string is equivalent to just `\{Expr}`. If fmt is non-empty, the expression

    "text1\{ expr ;fmt}text2"

is equivalent to:

    (“text1 + (expr).formatted(“%fmt”) + text2”)

(Here, `%fmt` means the concatenation of the `%` character and the characters in `fmt`.)

### Note 2 ###
`formatted` exists already as a method in `StringAdd`; it is injected into every type via an implicit conversion in `Predef`. `formatted` can also be defined directly in a type. This opens the possibility of user-definable format strings on a type-by-type basis. Of course, this is independent of the concrete syntax proposal here; the syntax proposal just makes it more convenient to use.

### Note 3 ### 
We should also consider splitting the functionality of `StringAdd` into `StringAdd`, with just the `+` method, and `StringFormat`, with show and `formatted`, with an implicit conversion from `Any` for each. The reason is that many people would like to disable `String +` but would like to keep show and `formatted`. They would then be able to do that using

    import Predef{any2stringadd => _, _}

## Syntax changes ##

The syntax of stringElement needs to be changed as follows:

    stringElement	::=  printableCharNoDoubleQuote
                   	 |   charEscapeSeq
    			 |   ‘\’ ‘{‘ Expr [‘;’ formatString] ‘}’
    formatString    ::=  {printableCharNoDoubleQuoteOrClosingBraceOrWhitespace}


