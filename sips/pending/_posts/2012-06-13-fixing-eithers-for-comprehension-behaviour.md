---
layout: sip
disqus: true
title: SIP-20 Fixing Either's for-comprehension behaviour
---

**By: Rob Dickens**

## Motivation ##

There is [evidence][evidence] to suggest that `scala.Either` is being
eschewed in favour of alternatives such as Scalaz's `Validation`
class. Based on this, together with a subsequent study which resulted in
[this suggestion][suggestion], the following three reasons may be
considered likely.

1. The alternatives are simpler to use, since they are 'biased'
   towards one of their two possible types of result - in the case of
   `Either`, it is necessary to specify that it's the `Left` (or
   `Right`) instance whose value will be passed to `foreach`, `map` or
   `flatMap`.

2. `for` comprehensions involving `Either` do not always behave as
   expected!

3. The alternative may offer 'added value', such as `Validation`'s
   ability to accumulate failures.

The current SIP is a proposal to address reason 2. only. (It may also
be considered a proposal to leave `Either` unbiased, on the grounds that
its name does not imply any bias towards either of it's subtypes.)

The aforementioned study traced the unexpected behaviour in
`for` comprehensions to two specific aspects of the API of `Either`'s
`Left/RightProjection` inner classes, and the two corrections that were
[suggested][suggestion] are now being proposed here.

## 1. map should return a Left/RightProjection instead of an Either ##

Returning an `Either` means that definitions in `for` comprehensions are
not supported, since `Either` does not have a `map` method. Instead,
`map` should return a `Left/RightProjection`, which does have a `map` method,
together with a `foreach` and `flatMap`.

## 2. filter should be removed ##

This is not appropriate, since an empty result is not appropriate here
- either it's a `Left` or it's a `Right`.

If the, say, `Right` value in question is to be subject to a
condition, then it should first be transformed into a `scala.Option`,
using an `R => Option[R]` (for use with `map`) or `R => Either[L,
Option[R]]` (for use with `flatMap`), so as to retain the opportunity of
handling a `Left` result.

  [evidence]: http://robsscala.blogspot.co.uk/2012/04/validation-without-scalaz.html
  [suggestion]:
  http://robsscala.blogspot.co.uk/2012/05/fixing-scalaeither-leftrightmap-returns.html
