---
layout: overview-large
title: What are Scala context and view bounds?

disqus: true

partof: FAQ
num: 3
---

What is a View Bound?
---------------------

A _view bound_ was a mechanism introduced in Scala to enable the use of some
type `A` _as if_ it were some type `B`. The typical syntax is this:

    def f[A <% B](a: A) = a.bMethod

In other words, `A` should have an implicit conversion to `B` available, so
that one can call `B` methods on an object of type `A`. The most common usage
of view bounds in the standard library (before Scala 2.8.0, anyway), is with
`Ordered`, like this:

    def f[A <% Ordered[A]](a: A, b: A) = if (a < b) a else b

Because one can convert `A` into an `Ordered[A]`, and because `Ordered[A]`
defines the method `<(other: A): Boolean`, I can use the expression `a < b`.

What is a Context Bound?
------------------------

Context bounds were introduced in Scala 2.8.0, and are typically used with the
so-called _type class pattern_, a pattern of code that emulates the
functionality provided by Haskell type classes, though in a more verbose
manner.

While a view bound can be used with simple types (for example, `A <% String`),
a context bound requires a _parameterized type_, such as `Ordered[A]` above,
but unlike `String`. 

A context bound describes an implicit _value_, instead of view bound's implicit
_conversion_. It is used to declare that for some type `A`, there is an
implicit value of type `B[A]` available. The syntax goes like this:

    def f[A : B](a: A) = g(a) // where g requires an implicit value of type B[A]

This is more confusing than the view bound because it is not immediately clear
how to use it. The common example of usage in Scala is this:

    def f[A : ClassManifest](n: Int) = new Array[A](n)

An `Array` initialization on a parameterized type requires a `ClassManifest` to
be available, for arcane reasons related to type erasure and the non-erasure
nature of arrays.

Another very common example in the library is a bit more complex:

    def f[A : Ordering](a: A, b: A) = implicitly[Ordering[A]].compare(a, b)

Here, `implicitly` is used to retrive the implicit value we want, one of type
`Ordering[A]`, which class defines the method `compare(a: A, b: A): Int`.

We'll see another way of doing this below.

How are View Bounds and Context Bounds implemented?
---------------------------------------------------

It shouldn't be surprising that both view bounds and context bounds are
implemented with implicit parameters, given their definition. Actually, the
syntax I showed are syntactic sugars for what really happens. See below how
they de-sugar:

    def f[A <% B](a: A) = a.bMethod
    def f[A](a: A)(implicit ev: A => B) = a.bMethod

    def g[A : B](a: A) = h(a)
    def g[A](a: A)(implicit ev: B[A]) = h(a)

So, naturally, one can write them in their full syntax, which is specially
useful for context bounds:

    def f[A](a: A, b: A)(implicit ord: Ordering[A]) = ord.compare(a, b)

What are View Bounds used for?
------------------------------

View bounds are used mostly to take advantage of the _pimp my library_ pattern,
through which one "adds" methods to an existing class, in situations where you
want to return the original type somehow. If you do not need to return that
type in any way, then you do not need a view bound.

The classic example of view bound usage is handling `Ordered`. Note that `Int`
is not `Ordered`, for example, though there is an implicit conversion. The
example previously given needs a view bound because it returns the
non-converted type:

    def f[A <% Ordered[A]](a: A, b: A): A = if (a < b) a else b

This example won't work without view bounds. However, if I were to return
another type, then I don't need a view bound anymore:

    def f[A](a: Ordered[A], b: A): Boolean = a < b

The conversion here (if needed) happens before I pass the parameter to `f`, so
`f` doesn't need to know about it.

Besides `Ordered`, the most common usage from the library is handling `String`
and `Array`, which are Java classes, like they were Scala collections. For
example:

    def f[CC <% Traversable[_]](a: CC, b: CC): CC = if (a.size < b.size) a else b

If one tried to do this without view bounds, the return type of a `String`
would be a `WrappedString` (Scala 2.8), and similarly for `Array`.

The same thing happens even if the type is only used as a type parameter of the
return type:

    def f[A <% Ordered[A]](xs: A*): Seq[A] = xs.toSeq.sorted

What are Context Bounds used for?
---------------------------------

Context bounds are mainly used in what has become known as _typeclass pattern_,
as a reference to Haskell's type classes. Basically, this pattern implements an
alternative to inheritance by making functionality available through a sort of
implicit adapter pattern.

The classic example is Scala 2.8's `Ordering`, which replaced `Ordered`
throughout Scala's library. The usage is:

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
mentioned before, there's the `ClassManifest` usage, which is required to
initialize new arrays without concrete types.

The context bound with the typeclass pattern is much more likely to be used by
your own classes, as they enable separation of concerns, whereas view bounds
can be avoided in your own code by good design (it is used mostly to get around
someone else's design).

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

