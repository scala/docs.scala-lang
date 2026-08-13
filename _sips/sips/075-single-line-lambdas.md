---
layout: sip
number: 75
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
shipped: 3.10.0
presip-thread: https://contributors.scala-lang.org/t/pre-sip-allow-single-line-lambdas-after/7258
title: Allow single-line lambdas after `:`
---

**By: Martin Odersky**

## History

| Date          | Version                        |
|---------------|--------------------------------|
| Sep 21, 2025  | Initial Draft                  |
| Sep 25, 2025  | Curried Multi-Line Lambdas     |

## Summary

This proposal is to allow a lambda expression following a `:` on the same line.
Currently, we need a newline and indent after the arrow, e.g.
```scala
xs.map: x =>
  x + 1
```
We propose to also allow to write the lambda on a single line:
```scala
xs.map: x => x + 1
```

The lambda extends in this case to the end of the line.

## History
This feature has been demanded repeatedly since the colon-lambda syntax was introduced as part of [SIP 44](https://docs.scala-lang.org/sips/fewer-braces.html), for instance see a [recent thread in Scala Users](https://users.scala-lang.org/t/why-were-single-line-lambdas-removed/11980/6). The original SIP 44 did not include it, because the concern at the time was the feature as a whole would look too much like type ascription and single line lambdas after colon would make that worse. But the experience since SIP 44 shipped has shown that the concerns about confusion  with type ascriptions were largely overblown. So we now come back to the issue in a separate SIP.

## Motivation

The new behavior is more general and more intuitive. We can now state that a `:` means application if it is followed by an indented block or by a lambda.

The new behavior also makes refactoring easier. One often splits or combines lines when some code part changes in length. We can now do this for lambda arguments without having to switch between parentheses and `:`.

## Other Examples

The syntax works for all kinds of function literals. They can start with one or more parameters, or with type parameters, or they can be partial functions starting
with `case`.

```scala
Seq((1, 2), (3, 4)).map: (a, b) => a + b

Seq((1, 2), (3, 4)).map: (a: Int, b: Int) => a + b

Seq((1, 2), (3, 4)).collect: case (a, b) if b > 2 => a

(1, true).map: [T] => (x: T) => List(x)
```

The syntax does not work for function values that do not contain a `=>` or `?=>`. For instance the following are illegal.

```scala
Seq((1, 2), (3, 4)).map: _ + _ // error

Seq(1, 2, 3).map: plus1 // error
```

Single-line lambdas can not be nested.

## Detailed Spec

A `:` means application if it is followed by one of the following:

 1. a line end and an indented block,
 2. a parameter section, followed by `=>` or `?=>`, a line end and an indented block,
 3. a parameter section, followed by `=>` or `?=>` and an expression on a single line,
 4. a case clause, representing a single-case partial function.

(1) and (2) is the status quo, (3) and (4) are new.

**Restriction 1:** (3) and (4) do not apply in code that is immediately enclosed in parentheses (without being more closely enclosed in braces or indentation). This is to avoid an ambiguity with type ascription. For instance,
```scala
(
  x: Int => Int
)
```
still means type ascription, no interpretation as function application is attempted.

**Restriction 2:** Only one `:` meaning application is allowed per line. So the following would both be illegal:

```scala
  xs.map: x => x.toString + xs.dropWhile: y => y > 0  // error: syntax
  xs.map: x => x.toString + xs.dropWhile: y =>        // error: syntax
    y > 0
```
One would have to explicitly put braces or parentheses around the second lambda:
```scala
  xs.map: x => x.toString + xs.dropWhile(y => y > 0)
  xs.map: x => x.toString + xs.dropWhile { y =>
    y > 0
  }
```

## Curried Multi-Line Lambdas

Previously, we admitted only a single parameter section and an arrow before
an indented block. We now also admit multiple such sections. So the following
is now legal:

```scala
def fun(f: Int => Int => Int): Int = f(1)(2)

fun: (x: Int) => y =>
  x + y
```

In the detailed spec above, point (2) is modified as follows:

2. _one or more_ parameter sections, _each_ followed by `=>` or `?=>`, and finally a line end and an indented block.

## Compatibility

Because of the restriction mentioned above, the new scheme is fully compatible with
existing code. This is because type ascriptions with function types are currently only allowed when they are enclosed in parentheses.

The scheme is also already compatible with _SIP-XX - No-Curly Partial Functions and Matches_ since it allows case clauses after `:`, so single case clauses can appear syntactically in all contexts where lambdas can appear. In fact, one could envisage to merge the two SIPs into one.

## Implementation

An [implementation](https://github.com/scala/scala3/pull/23821) of the new rules supports this SIP as well as _SIP-XX - No-Curly Partial Functions and Matches_. The new behavior is enabled by a language import `language.experimental.relaxedLambdas`.

The implementation is quite straightforward. It does require a rich model of interaction between lexer and parser, but that model is already in place to support other constructs. The model is as follows:

In the Scala compiler, the lexer produces a stream of tokens that the parser consumes. The lexer can be seen as a pushdown automaton that maintains a stack of regions that record the environment of the current lexeme: whether it is enclosed in parentheses, brackets or braces, whether it is an indented block, or whether it is in the pattern of a case clause. There is a backchannel of information from parser to scanner where the parser can push a region on the stack.

With the new scheme we need to enter a "single-line-lambda" region after a `:`, provided the `:` is followed by something that looks like a parameter section and a `=>` or a `?=>`. Testing this condition can involve unlimited lookahead when a pair of matching parentheses enclosing a parameter section needs to be identified. If the test is positive, the parser instructs the lexer to create a new region representing a single line lambda. The region ends at the end of the line.

## Alternatives

Nested single-line lambdas could be disallowed if it is felt that they lead to unreadable code. This could be easily enforced by saying that single-line lambdas are not recognized in regions bounded by parentheses _or_ in regions representing single-line lambdas.

## Syntax Changes

```
ColonArgument  ::=  colon {LambdaStart}
                    indent (CaseClauses | Block) outdent
                 |  colon LambdaStart expr ENDlambda
                 |  colon ExprCaseClause
LambdaStart    ::=  FunParams (‘=>’ | ‘?=>’)
                 |  TypTypeParamClause ‘=>’```
```
Changes wrt existing syntax:

 - In the first clause of `ColonArgument`, `[LambdaStart]` is now `{LambdaStart}`.
 - The second and third alternatives of `ColonArgument` are new.

Notes:

 - Lexer inserts ENDlambda at the next EOL, before producing a NEWLINE.
 - The case does not apply if the directly enclosing region is bounded by parentheses `(` ... `)`.
