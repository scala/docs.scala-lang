---
layout: sip
number: 74
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
shipped: 3.10.0
title: Allow Partial Function Literals to be defined with Parentheses
---

**By: Li Haoyi**

## History

| Date          | Version            |
|---------------|--------------------|
| Aug 22nd 2025 | Initial Draft      |

## Summary

This proposal is to allow parens `(...)` to be used instead of curly braces `{...}`
when defining partial functions which have only one `case`:


```scala
Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a) // 3
```

Currently this syntax is disallowed:

```scala
scala> Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a)
-- [E018] Syntax Error: --------------------------------------------------------
1 |Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a)
  |                            ^^^^
  |                            expression expected but case found
  |
  | longer explanation available when compiling with `-explain`
```

Partial functions with multiple `case` blocks should also be allowed to use parentheses
:


```scala
Seq((1, 2), (3, 4)).collect(
  case (a, b) if b > 2 => a
  case _ => ???
)
```


Multi-line `case` blocks should work with parens as well, just like multi-line function
literals without `case` already work:

```scala
Seq((1, 2), (3, 4)).collect(
  case (a, b) =>
    println(b)
    a
)

// This already works today
Seq((1, 2), (3, 4)).collect(
  (a, b) =>
    println(b)  
    a
)
```

Partial function literals should also be allowed to be defined without parentheses for
single-line scenarios such as:

```scala
val partial: PartialFunction[(Int, Int), Int] = case (a, b) if b > 2 => a
```

This delimiter-less syntax is similar to what is already allowed today in `catch` blocks:

```scala
try ???
catch case e: Exception => ???
```


### Out of Scope

For now, we do not allow parentheses to be used in `match` statements:

```scala
(1, 2) match (
  case (a, b) if b > 2 => a
  case _ => ???
)
```

And we do not allow parentheses for multi-`case` single-line partial functions:

```scala
Seq((1, 2), (3, 4)).collect{ case (a, b) if b > 2 => a case (a, b) if a > 2 => b }
Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a case (a, b) if a > 2 => b)
Seq((1, 2), (3, 4)).collect(
  case (a, b) if b > 2 => a
  case (a, b) if a > 2 => b
)
```

These could be added in future, but for now we left them out as they are edge cases
that are not core to this proposal

## Motivation

With Scala 3's [Optional Braces](https://docs.scala-lang.org/scala3/reference/other-new-features/indentation.html),
and [SIP-44's Fewer Braces](https://docs.scala-lang.org/sips/fewer-braces.html), single-line
partial functions are one of the only remaining places where curly braces are mandatory in Scala
syntax.

```scala
// No way to write this without curlies
Seq((1, 2), (3, 4)).collect{ case (a, b) if b > 2 => a } 
```
Needing to swap between parens and curlies also adds friction of converting a function to 
a partial function, which happens frequently:

```scala
Seq((1, 2), (3, 4)).map((a, b) => a) // OK
Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a) // BAD
Seq((1, 2), (3, 4)).collect{ case (a, b) if b > 2 => a } // OK
```

This also currently causes visual messiness in method call chains where some single-line 
methods use parens and others use curlies:

```scala
Seq((1, 2), (3, 4), (5, 6))
  .filter(_._1 < 5) // PARENS
  .collect{ case (a, b) if b > 2 => a } // CURLIES
  .reduce(_ + _) // PARENS
```

In the syntax of other expressions, curly braces are only
necessary to define "blocks" with multiple statements: `if`-`else`, `try`-`catch`-`finally`,
`for`-`yield`, `do`-`while`, method calls like `foo()` etc. all allow you to replace curly braces
with parentheses or elide them altogether using indentation.
This is unlike other languages like Java that mandate curly braces in these syntactic constructs.
Furthermore, in most expressions, Optional Braces means you do not have to write the curlies
if you do not want to.

This proposal brings partial functions in-line with the rest of Scala syntax, with the curly
braces only being mandatory for multi-statement blocks, and made optional with Scala 3's
Optional Braces. With this proposal, curly braces are _only_ for opening multi-statement blocks,
_always_ in places that can be replaced by indentation-based blocks if the user wants to do so.
They are no longer also incidentally tied to partial-function syntax as they were before.

With this change, all the snippets below are now valid: we can see how the syntax of `()`, `{}`,
or `.collect:` followed by indentation is now fully orthogonal to the partial function `case` 
expression within them, resulting in a much more regular syntax than before when parentheses
were prohibited but the other syntaxes worked.

```scala
Seq((1, 2), (3, 4)).collect(case (a, b) if b > 2 => a)
Seq((1, 2), (3, 4)).collect { case (a, b) if b > 2 => a }
Seq((1, 2), (3, 4)).collect: 
  case (a, b) if b > 2 => a

Seq((1, 2), (3, 4)).collect( 
  case (a, b) if b > 2 => a
  case (a, b) if a > 2 => b
)

Seq((1, 2), (3, 4)).collect {
  case (a, b) if b > 2 => a
  case (a, b) if a > 2 => b
}

Seq((1, 2), (3, 4)).collect: 
  case (a, b) if b > 2 => a
  case (a, b) if a > 2 => b

Seq((1, 2), (3, 4)).collect(
  case (a, b) =>
    println(b)
    a
)

Seq((1, 2), (3, 4)).map((a, b) => a)
Seq((1, 2), (3, 4)).map { (a, b) => a }
Seq((1, 2), (3, 4)).map:
  (a, b) => a
Seq((1, 2), (3, 4)).map:
  (a, b) =>
    println(b)
    a

Seq((1, 2), (3, 4)).collect(
  case (a, b) if b > 2 =>
    println(b)
    a
)
```
