---
layout: multipage-overview
title: What are Scala context bounds?

discourse: true

overview-name: FAQ
partof: FAQ

num: 3
permalink: /tutorials/FAQ/:title.html
---

What is a Context Bound?
------------------------

Context bounds were introduced in Scala 2.8.0, and are typically used with the
so-called _type class pattern_, a pattern of code that emulates the
functionality provided by Haskell type classes, though in a more verbose
manner.

A context bound requires a _parameterized type_, such as `Ordered[A]`,
but unlike `String`.

A context bound describes an implicit _value_. It is used to declare that for
some type `A`, there is an
implicit value of type `B[A]` available. The syntax goes like this:

    def f[A : B](a: A) = g(a) // where g requires an implicit value of type B[A]

The common example of usage in Scala is this:

    def f[A : ClassTag](n: Int) = new Array[A](n)

An `Array` initialization on a parameterized type requires a `ClassTag` to
be available, for arcane reasons related to type erasure and the non-erasure
nature of arrays.

Another very common example in the library is a bit more complex:

    def f[A : Ordering](a: A, b: A) = implicitly[Ordering[A]].compare(a, b)

Here, `implicitly` is used to retrive the implicit value we want, one of type
`Ordering[A]`, which class defines the method `compare(a: A, b: A): Int`.

We'll see another way of doing this below.

How are Context Bounds implemented?
---------------------------------------------------

It shouldn't be surprising that context bounds are
implemented with implicit parameters, given their definition. Actually, the
syntax I showed are syntactic sugars for what really happens. See below how
they de-sugar:

    def g[A : B](a: A) = h(a)
    def g[A](a: A)(implicit ev: B[A]) = h(a)

So, naturally, one can write them in their full syntax, which is specially
useful for context bounds:

    def f[A](a: A, b: A)(implicit ord: Ordering[A]) = ord.compare(a, b)

What are Context Bounds used for?
---------------------------------

Context bounds are mainly used in what has become known as _typeclass pattern_,
as a reference to Haskell's type classes. Basically, this pattern implements an
alternative to inheritance by making functionality available through a sort of
implicit adapter pattern.

The classic example is Scala 2.8's `Ordering`. The usage is:

    def f[A : Ordering](a: A, b: A) = if (implicitly[Ordering[A]].lt(a, b)) a else b

Though you'll usually see that written like this:

    def f[A](a: A, b: A)(implicit ord: Ordering[A]) = {
        import ord._
        if (a < b) a else b
    }

Which take advantage of some implicit conversions inside `Ordering` that enable
the traditional operator style. Another example in Scala 2.8 is the `Numeric`:

    def f[A : Numeric](a: A, b: A) = implicitly[Numeric[A]].plus(a, b)

A more complex example is the new collection usage of `CanBuildFrom`, but
there's already a very long answer about that, so I'll avoid it here. And, as
mentioned before, there's the `ClassTag` usage, which is required to
initialize new arrays without concrete types.

Though it has been possible for a long time, the use of context bounds has
really taken off in 2010, and is now found to some degree in most of Scala's
most important libraries and frameworks. The most extreme example of its usage,
though, is the Scalaz library, which brings a lot of the power of Haskell to
Scala.  I recommend reading up on typeclass patterns to get more acquainted it
all the ways in which it can be used.

Related questions of interest:

* [A discussion on types, origin and precedence of implicits](finding-implicits.html)
* [Chaining implicits](chaining-implicits.html)

This answer was originally submitted in response to [this question on Stack Overflow][1].

  [1]: http://stackoverflow.com/q/4465948/53013
