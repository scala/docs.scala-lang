---
layout: sip
disqus: true
title: SIP-20 Fixing Either
---

**By: Rob Dickens**

This proposal is the sole initiative of the author, based on his
attempts, [first][enhance] to understand why `scala.Either` is not
more widely used, and to enhance it, [and then][fix] to try to fix
it. It is also being made in the light of two mailing-list debates
which have taken place - one about [right-biasing Either][debate1],
which was inconclusive, and a subsequent one about [fixing
Either][debate2].

## Motivation ##

The above findings point to the following three reasons why `Either` is being
eschewed in favour of alternatives:

1. `for` comprehensions involving `Either` behave oddly.

2. The alternatives are simpler to use, by virtue of their being 'biased'
   towards one of their possible result types. In the case of
   `Either`, it is necessary to specify which of the two types (`Left`
   or `Right`) should have its value passed to `foreach`, `map` or
   `flatMap`.

3. The alternative may offer 'added value', such as `scalaz.Validation`'s
   ability to accumulate failures.

The current SIP is a proposal to address 1. and 2. only.

## Part 1: Eliminating odd behaviour in for-comprehensions ##

Two examples of odd behaviour have been encountered. Firstly,
definitions are not supported (as first reported [here][report]),

    for {
      b <- gt0(a).right
    //  ^
    // error: value foreach is not a member of
    // Product with Serializable with Either[String,(Int, Int)]
      c = b + 1
    } ... // do something with c

and secondly (as reported [here][fix]), `if` cannot be used together
with multiple generators and `yield`:

    for {
      b <- gt0(a).right
      c <- gt1(b).right
    //  ^
    // error: type mismatch;
    // found   : Option[Either[Nothing,Int]]
    // required: Either[?,?]
      if c > 0
    } yield c

The lack of support for definitions was traced to the fact that the
`map` method of LeftProjection and RightProjection returns an
`Either`, which does not have a `foreach`, or `map` method itself.

The proposed solution is the one proposed [here][fix], whereby the
`map` method of `LeftProjection` returns another `LeftProjection`, and
that of `RightProjection` returns another `RightProjection`.

Also, and as a conseqence, the respective `flatMap` methods must be
changed by substituting the respective projection in place of
`Either`.

Since the above changes may not be made by simply deprecating the old
versions and adding the new, it will be necessary to deprecate and
replace `LeftProjection` and `RightProjection` themselves, and therefore also
`Either`'s `left` and `right` methods.

The proposed alternatives are `LeftProj` and `RightProj`, as returned
by `lp` and `rp`.

Therefore, in the case of `LeftProj`,

    def map[X](f: A => X) = e match {
      case Left(a) => Left(f(a))
      case Right(b) => Right(b)
    }

becomes

    def map[X](f: A => X): LeftProj[X, B] = e match {
      case Left(a) => LeftProj(Left(f(a)))
      case Right(b) => LeftProj(Right(b))
    }

and

    def flatMap[BB >: B, X](f: A => Either[X, BB]) = e match {
      case Left(a) => f(a)
      case Right(b) => Right(b)
    }

becomes

    def flatMap[BB >: B, X](f: A => LeftProj[X, BB]): LeftProj[X, BB] = e match {
      case Left(a) => f(a)
      case Right(b) => LeftProj(Right(b))
    }

Note that `.e` must be appended to the value the for-comprehension then
yields, in order to obtain the corresponding value of `Either`.

Regarding the second example of odd behaviour, involving if, this was
traced to the fact that the filter method (of `LeftProjection` and
`RightProjection`) returns an `Option` instead of the respective
projection.

Considering that an `Either` must be (by definition) either a `Left`
or a `Right` (and not empty), it is proposed that `LeftProj` and
`RightProj` should not have a `filter` (or `withFilter`) method at
all.

Note that this means that


## Part 2: Simplifying use in for-comprehensions by *adding* right-biased capability ##

Returning an `Either` means that definitions in `for` comprehensions
are not supported, since `Either` does not have a `map` method (as
pointed out in this [bug report][report]). Instead, it is proposed
that `map` should return a `Left-/RightProjection`, which does have the
requisite method.

Since `yield` would then also produce a `Left-/RightProjection`, `.e`
will need to be appended in order to obtain the `Either`.

## Part 2: filter should be removed (outright) ##

Filtering is not appropriate here, since an empty result is not
appropriate - either it's a `LeftProjection` or it's a
`RightProjection`.

If the value in the, say, `Right` instance is to be subject to a
condition, then it should first be lifted into a `scala.Option`, using
an `R => Option[R]` (for use with `map`) or an `Option` inside a
`RightProjection`, using an `R => RightProjection[L, Option[R]]` (for
use with `flatMap`), so as to retain the ability to deal with a
`Left` result.

  [enhance]: http://robsscala.blogspot.co.uk/2012/04/validation-without-scalaz.html
  [fix]:
  http://robsscala.blogspot.co.uk/2012/05/fixing-scalaeither-leftrightmap-returns.html
  [debate1]:
  https://groups.google.com/group/scala-debate/browse_thread/thread/2bac2fe8aa6124ad?hl=en
  [debate2]:
  https://groups.google.com/forum/?fromgroups#!topic/scala-debate/XlN-oqbslS0
  [report]: https://issues.scala-lang.org/browse/SI-5793
