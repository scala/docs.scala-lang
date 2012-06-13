---
layout: sip
disqus: true
title: SIP-20 Fixing Either's Left/RightProjection
---

**By: Rob Dickens**

This proposal is the sole initiative of the author, based on his
attempts, [first][enhance] to understand why `scala.Either` is not more widely
used, and to enhance it, [and then][fix] to try to fix it. It is also being
made in the light of this [debate][debate] which discussed possible changes and
alternatives to the class.

## Motivation ##

The above points to the following three reasons why Either is being
eschewed in favour of alternatives:

1. `for` comprehensions involving `Either` have unexpected limitations
   and behave in a non-standard way.

2. The alternatives are simpler to use, by virtue of being 'biased'
   towards one of their possible result types. In the case of
   `Either`, it is necessary to specify which of the two types (Left
   or Right) should have its value passed to `foreach`, `map` or
   `flatMap`.

3. The alternative may offer 'added value', such as `scalaz.Validation`'s
   ability to accumulate failures.

The current SIP is a proposal to address 1. only, and retain the
ability to choose from which side the value passed to `foreach`,
etc. will be taken. This is on the grounds that,

* there might be valid use-cases which require the ability to choose

* it addresses 1. while leaving the way open to address 2. and 3. in
  the future, whether by making `Either` biased, or by introducing a
  biased alternative to go along side it.

The proposed solution to 1. is the one advocated by the above
[fix][fix], and involves two changes to Either's Left/RightProject
classes.

## Part 1: map should return a Left/RightProjection instead of an Either ##

Returning an `Either` means that definitions in `for` comprehensions are
not supported, since `Either` does not have a `map` method. Instead,
`map` should return a `Left/RightProjection`, which does have a `map` method,
together with a `foreach` and `flatMap`.

Since `yield` would then produce a `Left/RightProjection`, `.e` will
need to be appended in order to obtain the `Either`.

## Part 2: filter should be removed outright ##

Filtering is not appropriate here, since an empty result is not
appropriate here - either it's a `LeftProjection` or it's a
`RightProjection`.

If the value in the, say, `Right` instance is to be subject to a
condition, then it should first be lifted into a `scala.Option`, using
an `R => Option[R]` (for use with `map`) or an `Option` inside a
`RightProjection`, using an `R => RightProjection[L, Option[R]]` (for
use with `flatMap`), so as to retain the opportunity of handling a
`Left` result.

The presence of the current `filter: Option[Either[...]]` has
the following negative consequences:

* compiler warning that there is no `withFilter`

* the fact that it returns an Option as opposed to a
  Left-/RightProjection is unexpected, and leads to a compilation
  error if `if` is used after two generators

* the opportunity to handle the other projection is lost.

Note that simply deprecating `filter` will not be enough to prevent it
being used in `for` comprehensions.

  [enhance]: http://robsscala.blogspot.co.uk/2012/04/validation-without-scalaz.html
  [fix]:
  http://robsscala.blogspot.co.uk/2012/05/fixing-scalaeither-leftrightmap-returns.html
  [debate]:
  https://groups.google.com/group/scala-debate/browse_thread/thread/2bac2fe8aa6124ad?hl=en
