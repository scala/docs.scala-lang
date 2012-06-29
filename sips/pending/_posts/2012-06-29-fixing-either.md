---
layout: sip
disqus: true
title: SIP-20 Fixing Either
---

**By: Rob Dickens**

This proposal is based on the author's attempts, [first][enhance] to
understand why `scala.Either` is not more widely used, and to enhance
it, and then ([here][fix] and [here][vs]) to try to fix it. It owes
much to two mailing-list debates which have taken
place - one (initiated by Jason Zaugg) about [right-biasing
Either][debate1], which was inconclusive, and a subsequent one about
[fixing Either][debate2].

## Motivation ##

The above findings point to the following three reasons why `Either` is being
eschewed in favour of alternatives:

1. `for` comprehensions involving `Either` behave oddly.

2. The alternatives are simpler to use, by virtue of their being
   'biased' towards one of their possible result types. In the case of
   `Either`, it is necessary to specify which of the two types (`Left`
   or `Right`) should have its value passed to the function passed to
   `foreach`, `map` or `flatMap`.

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

and secondly (as mentioned [here][fix]), `if` cannot be used together
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
`map` method of `LeftProjection` and `RightProjection` returns an
`Either`, which does not have a `foreach`, or `map` method itself.

The proposed solution is the one proposed [here][fix], whereby the
`map` method of `LeftProjection` (`RightProjection`) returns another
`LeftProjection` (`RightProjection`).

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

Note that `.e` must be appended to the value the `for` comprehension then
`yield`s, in order to obtain the corresponding `Either` value.

Regarding the second example of odd behaviour, involving `if`, this was
traced to the fact that the `filter` method (of `LeftProjection` and
`RightProjection`) returns an `Option` instead of the respective
projection.

The first solution considered was to introduce a third subtype,
equivalent to `Option`'s `None`, but this was later rejected on the
grounds that only two subtypes may exist - *either* `Left` or `Right`.

The second solution considered was to do away with `filter`
altogether, given that there must be *some* result (either `Left` or
`Right`). However, this would prevent the general use of `if` and
pattern-matching in `for` comprehensions involving (projections of)
`Either`.

Therefore, a third solution has been investigated, whereby `LeftProj`
(`RightProj`) has a `withFilter` method that returns a `LeftProj`
(`RightProj`) containing a `Right` (`Left`) if the predicate is
`false`, and where the contents of that `Right` (`Left`) is obtained
using an implicit conversion passed to the `withFilter` method in a
second parameter list:

    def withFilter[BB >: B](p: A => Boolean)
                           (implicit aToB: Right.Convert => BB): LeftProj[A, BB] = {
      val e2: Either[A, BB] = e match {
        case Left(a) => if (p(a)) Left(a) else Right(aToB(Right.Convert(a)))
        case Right(b) => Right(b)
      }
      LeftProj(e2)
    }

This solution therefore requires that an implicit conversion such as
the following be provided whenever the method is used, as is the case
when `if` or pattern-matching features in a `for` comprehension:

    implicit def f(convert: Right.Convert) = convert.any.toString

Note that `Convert` is a simple case class which serves to ensure that
the implicit conversion is properly targeted.

This third solution has been [shown][project] to work well, and is the one
proposed here.

## Part 2: Simplifying use in for-comprehensions by *adding* right-biased capability ##

It is proposed that the various methods required for supporting `for`
comprehensions be added to `Either` itself, and that only the value
contained in `Right` instances be passed to the functions passed to
those methods.

This would simplify the vast majority of use cases, and be in keeping
with the existing convention of using `for` comprehensions involving
the `RightProjection`:

    trait Eg {
      def f(a: Int): Either[String, Int]
    
      def unbiased_usage(a: Int) = {
        val rp = for {
          b <- f(a).rp
        } yield b
        rp.e
      }
    
      def rightBiased_usaged(a: Int) = for {
        b <- f(a)
      } yield b
    }

Finally, note that Part 2 does not render Part 1 redundant; although
`Either` would now have its own `map` method, this would only be
appropriate in `for` comprehensions involving the `RightProjection`,
but not the `LeftProjection`.

## Trial version ##

A trial verson of `Either` incorporating the proposed fixes,
and complete with test suites, is maintained [here][project].

  [enhance]: http://robsscala.blogspot.co.uk/2012/04/validation-without-scalaz.html
  [fix]:
  http://robsscala.blogspot.co.uk/2012/05/fixing-scalaeither-leftrightmap-returns.html
  [vs]:
  http://robsscala.blogspot.co.uk/2012/06/fixing-scalaeither-unbiased-vs-biased.html
  [debate1]:
  https://groups.google.com/group/scala-debate/browse_thread/thread/2bac2fe8aa6124ad?hl=en
  [debate2]:
  https://groups.google.com/forum/?fromgroups#!topic/scala-debate/XlN-oqbslS0
  [report]: https://issues.scala-lang.org/browse/SI-5793
  [project]: https://github.com/robcd/scala-either-proj-map-returns-proj/tree/add_right-bias_2-10_withFilter
