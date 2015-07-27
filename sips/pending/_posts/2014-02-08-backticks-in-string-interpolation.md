
---
layout: sip
disqus: true
title: SIP-24 Backticks in String Interpolation
---

**Kevin Wright**

## Motivation ##

Currently, string interpolation allows two "styles" for specifying items to be interpolated.  The full form is:

    s"I have substituted ${expression} into this String"

And the short form:

    s"I have substituted $identifier into this String"

Where `identifier` is specified in SIP-11 to consist of only alphanumeric characters.

The actual implementation uses the specification of `identifier` from the language spec, where it must start with a letter, but can then contain letters, numbers, or underscores for subsequent characters:

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

We therefore have the unfortunate and inconsistent situation that there are TWO permitted specifications for identifiers!  Those used in string interpolation and those used everywhere else.

So this is fine:

    val tpe = "abc"
    val str = s"I am a $tpe"

Whereas the following is invalid:

    val `type` = "abc"
    val str = s"I am a $`type`"

To use such identifiers, it becomes necessary to redundantly nest backticks within full-form interpolation.


The following examples are taken from the original use-case of boilerplate generation in Shapeless:
https://github.com/milessabin/shapeless/blob/master/project/Boilerplate.scala


Current usage:

    s"implicit def hlistTupler${arity}[${`A..N`}] : Aux[${`A::N`}, ${`(A..N)`}] = ..."

Compare this to equivalent code if backticks were available to use directly in short-form interpolation:

    s"implicit def hlistTupler$`arity`[$`A..N`] : Aux[$`A::N`, $`(A..N)`] = ..."

Note the additional benefit of being able to use backquotes in a sample such as:

    val qual = "some"
    s"I am $`qual`body"

Where short form is invalid because there's no non-alphanumeric character to delimit the identifier from subsequent text:

    s"I am $qualbody" //invalid
    s"I am ${qual}body" //current solution, but less readable than backticks
    s"I am $`qual`body" //with SIP proposal


## Proposal ##

Allow backtick-denoted identifiers when using short-form string interpolation, as per:

    s"implicit def hlistTupler$`arity`[$`A..N`] : Aux[$`A::N`, $`(A..N)`] = ..."
    s"I am $`qual`body"

Permitting any characters within the two delimiting backticks, as per the language specification.

This proposal doesn't break any compatibility, as the `` $` `` construct is currently an error within interpolated strings.

It doesn't go all the way to a full unification of the two identifier styles - as there's no way (and little need) to acommodate the operator form.  But it does remove at least one discrepancy.


## Syntax changes ##

The escaping syntax within processed strings needs to be changed as follows:

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


