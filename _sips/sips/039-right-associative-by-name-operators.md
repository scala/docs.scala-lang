---
layout: sip
number: 39
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/right-associative-by-name-operators.html
stage: completed
status: shipped
title: Right-Associative By-Name Operators
---

> This proposal has been implemented in Scala 2.13.0 and Scala 3.0.0.

**By: Stefan Zeiger**

## History

| Date          | Version       |
|---------------|---------------|
| Jul 12th 2017 | Initial Draft |

## Motivation

Scala allows the definition of right-associative by-name operators but the desugaring, as
currently defined, forces the arguments, thus effectively making them by-value. This has
been recognized as a [bug](https://github.com/scala/bug/issues/1980) since 2009.

## Motivating Examples

Apart from the examples mentioned in and linked to [scala/bug#1980](https://github.com/scala/bug/issues/1980),
this has recently come up as a [problem for the collections library redesign](https://github.com/scala/collection-strawman/issues/127)
for Scala 2.13.

Scala 2.12 has a `Stream` type with a lazy tail and a strict head element. Thanks to a clever
[hack](https://github.com/scala/scala/blob/9ab72a204ff3070ffabc3c06f3d381999da43fcd/src/library/scala/collection/immutable/Stream.scala#L1115-L1133)
right-associative by-name operators can work well enough for `Stream`:

    scala> def f(i: Int) = { println("Generating "+i); i }
    f: (i: Int)Int

    scala> f(1) #:: f(2) #:: f(3) #:: Stream.empty
    Generating 1
    res0: scala.collection.immutable.Stream[Int] = Stream(1, ?)

The `LazyList` type proposed for the new collections library is supposed to be lazy in the head and tail.
This cannot be supported with the existing hack (which always forces the first element in the chain), so we need
a proper fix at the language level.

## Design

The desugaring of binary operators is currently defined in the spec as:

> A left-associative binary
> operation `e1 op e2` is interpreted as `e1.op(e2)`. If `op` is
> right-associative, the same operation is interpreted as
> `{ val x=e1; e2.op(x) }`, where `x` is a fresh name.

It should be changed to:

> A left-associative binary
> operation `e1 op e2` is interpreted as `e1.op(e2)`. If `op` is
> right-associative and its parameter is passed by name, the same operation is interpreted as
> `e2.op(e1)`. If `op` is right-associative and its parameter is passed by value,
> it is interpreted as `{ val x=e1; e2.op(x) }`, where `x` is a fresh name.

This means that all by-value parameters are still forced from left to right but by-name
parameters are not forced anymore. They now behave the same way in operator syntax as they
would when using standard method call syntax.

## Implementation

A complete implementation for Scala 2.13 is provided in [scala/scala#5969](https://github.com/scala/scala/pull/5969).

## Counter-Examples

No change of type inference semantics is implied by the new desugaring. In particular, all parameters to
right-associative operators are still type-checked without an expected type in the current implementation.

It may be desirable to use an expected type, like for a method call, but that is orthogonal to this proposal
and would necessarily apply equally to by-name and by-value parameters. In the case of overloaded
operators it cannot be determined whether the parameter is by-name or by-value without type-checking the
argument first.

## Drawbacks

- This constitutes a silent change in semantics for existing code. Since the current semantics are essentially
  broken the likelihood of affecting existing code negatively are low.

- Macros and tooling that works at the Scala AST level may need to be adapted to the new desugaring. This is also
  unlikely because the new desugaring produces currently legal Scala code that could have been manually written in
  the same way.

## Alternatives

As mentioned above, the current `Stream`
[hack](https://github.com/scala/scala/blob/9ab72a204ff3070ffabc3c06f3d381999da43fcd/src/library/scala/collection/immutable/Stream.scala#L1115-L1133)
can work around this problem in some cases but not all.
