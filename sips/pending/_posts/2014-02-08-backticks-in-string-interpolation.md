
---
layout: sip
disqus: true
title: SIP-23 Backticks in String Interpolation
---

**Kevin Wright**

## Motivation ##

Currently, string interpolation allows two "styles" for specifying items to be interpolated.  The full form is:

    s"I have substituted ${expression} into this String"

And the short form:

    s"I have substituted $identifier into this String"

Where `identifier` is only permitted to consist of alphanumeric characters in SIP-11.

In practice, `identifier` must start with a letter, but can contain letters, numbers, or underscores for subsequent characters; as per the definition of an Identifier in the language spec:

    op ::= opchar {opchar}
    varid ::= lower idrest
    plainid ::= upper idrest
              | varid
              | op
    id ::= plainid
         | ‘`’ stringLit ‘`’
    idrest ::= {letter | digit} [‘_’ op]

However... The language specification allows for two additional forms of identifier that are denied from short-form string interpolation.

Operator form:

    val :+: = "hello world"

and string-literal form, denoted by backticks:

    val n = 22
    val `a..n` = 'a' until ('a'+n) mkString ", "

String-literal form is of special interest for interpolation, as it allows domain-specific identifiers that are particularly
suited to areas such as code generation, quasiquoting and markup languages.

To use such identifiers, it becomes necessary to use backticks within full-form interpolation. e.g:

    s"implicit def hlistTupler${arity}[${`A..N`}] : Aux[${`A::N`}, ${`(A..N)`}] = ..."

Compare this to equivalent code if backticks were available to use directly in short-form interpolation:

    s"implicit def hlistTupler$`arity`[$`A..N`] : Aux[$`A::N`, $`(A..N)`] = ..."

Note the additional benefit of being able to use backquotes in a sample such as:

    val qual = "some"
    s"I am $`qual`body"

Where short form is invalid because there's no non-alphanumeric character to delimit the identifier from subsequent text:

    s"I am $qualbody" //invalid
    s"I am ${qual}body" //current solution, but less readable than backticks


## Proposal ##

Allow backtick-denoted identifiers when using short-form string interpolation, as per:

    s"implicit def hlistTupler$`arity`[$`A..N`] : Aux[$`A::N`, $`(A..N)`] = ..."
    s"I am $`qual`body"

Permitting any characters within the two delimiting backticks, as per the language specification.

## Enhanced proposal ##

Allow backtick-denoted identifiers in string interpolation, *without requiring the `$` prefix*. Owing to backward-compatibility, this could only occur at a major version:

    s"implicit def hlistTupler`arity`[`A..N`] : Aux[`A::N`, `(A..N)`] = ..."
    s"I am `qual`body"

As is the norm with escape characters, doubling the backtick would allow it to appear as a literal character in the resuling string.

## Syntax changes ##

The escaping syntax within processed strings (for the non-enhanced proposal) needs to be changed as follows:

    SimpleExpr1  ::= … | processedStringLiteral
    processedStringLiteral
             ::= alphaid‘"’ {printableChar \ (‘"’ | ‘$’) | escape} ‘"’ 
              |  alphaid ‘"""’ {[‘"’] [‘"’] char \ (‘"’ | ‘$’) | escape} {‘"’} ‘"""’
    escape   ::= ‘$$’ 
              |  ‘$’ letter { letter | digit } 
              |  ‘$’ ‘`’ stringLit ‘`’
              |  ‘$’BlockExpr
    alphaid  ::=  upper idrest
              |  varid
