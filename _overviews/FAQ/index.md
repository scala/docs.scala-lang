---
layout: singlepage-overview
title: Scala FAQ
permalink: /tutorials/FAQ/index.html
redirect_from: "/tutorials/FAQ/breakout.html"
redirect_from: "/tutorials/FAQ/chaining-implicits.html"
redirect_from: "/tutorials/FAQ/collections.html"
redirect_from: "/tutorials/FAQ/context-bounds.html"
redirect_from: "/tutorials/FAQ/finding-implicits.html"
redirect_from: "/tutorials/FAQ/finding-symbols.html"
redirect_from: "/tutorials/FAQ/stream-view.html"
redirect_from: "/tutorials/FAQ/yield.html"
---

Frequently asked questions, with _brief_ answers and/or links to
longer answers.

This list only includes questions that _actually_ come up over and
over again in Scala chat rooms and forums.

## General questions

### Where can I ask Scala questions?

See our [Community page](https://scala-lang.org/community/).

### Should I learn Scala 2, or Scala 3?

The default choice remains Scala 2 for now.  Most Scala jobs are Scala
2 jobs; most Scala books and online learning materials cover Scala 2;
tooling and library support is strongest in Scala 2; and so on.

Scala 3.0 is planned for release in early 2021, and a number of
Scala 3 books will come out in 2021 as well.  In time, there will
be more and more Scala 3 jobs as well.

### What's a good book about Scala?

Our [Books page](https://docs.scala-lang.org/books.html) lists a few
especially popular, well-known books.

We don't have a list of all the Scala books that
are out there; there are many.

You can go on the [Scala room on
Gitter](https://gitter.im/scala/scala) or another community forum and
ask for book recommendations, but note that you'll get more helpful
answers if you provide some information about your background and your
reasons for wanting to learn Scala.

### How do I find what some symbol means or does?

A [Stack Overflow answer](https://stackoverflow.com/a/7890032) lays
out what the different kinds of symbol in Scala are and explains the
most commonly used symbols.

Scala allows symbolic method names.  So if you see a random-looking
operator like `>=@=>` in Scala code, it might simply be a method in
some library, rather than having any special meaning in the language
itself.

You can search for symbols on Google.  For example, if you want to
know what `<:<` means, searching for `scala <:<` works fine.  If you
get poor results, try surrounding the symbol with double quotes.

## Specific technical questions

### Why is my (abstract or overridden) `val` null?

<!-- this is left over from a previous version of the FAQ.
so, grandfathering this in, but I suggest we not host any further FAQ
answers here, I think it's better to provide only short answers and
links. if something needs more space to explain, there should be
official documentation that addresses it, not just an FAQ answer -->

See [this]({{ site.baseurl }}/tutorials/FAQ/initialization-order.html).

### Which type of collection should I choose?

See the [Scala 2.13 Collections Guide](https://docs.scala-lang.org/overviews/collections-2.13/introduction.html).

### What are context bounds (`[T : Foo]`)?

Basically is sugar syntax for an `implicit` argument of type `Foo[T]`.

More deatils in this [Stack Overflow answer](https://stackoverflow.com/a/4467012).

### How does `for / yield` work?

In short it is sugar syntax for nested
`map`, `flatMap` & `withFilter` calls.

For an in-depth explanation
see this [Stack Overflow answer](https://stackoverflow.com/a/1059501).

### What is the difference between view, stream and iterator?

[Answer on Stack Overflow](https://stackoverflow.com/a/5159356).

### Can I chain or nest implicit conversions?

Not really, but you can [make it work](https://stackoverflow.com/a/5332804)
_(although implicit conversions are, in general, discouraged)_.

### Where does Scala look for implicits?

See this [answer on Stack Overflow](https://stackoverflow.com/a/5598107).

### Why do primitive type parameters erase to `Object`?

So for example, a `List[Int]` in Scala code will appear to Java as a
`List[Object]`.  The Java type system doesn't allow primitive types to
appear as type parameters, but couldn't they appear as their boxed
equivalents, such as `List[java.lang.Integer]`?

One would hope so, but doing it that way was tried and it proved impossible.
[This SO question](https://stackoverflow.com/questions/11167430/why-are-primitive-types-such-as-int-erased-to-object-in-scala)
sadly lacks a concise explanation, but it does link to past discussions.

### What's the difference between methods and functions?

For example, how does a method such as:

    def square(x: Int): Int = x * x

differ from a function value such as:

    val square: Int => Int = x => x * x

[Complete answer on Stack Overflow](https://stackoverflow.com/a/2530007/4111404).

[Summary with practical differences](https://tpolecat.github.io/2014/06/09/methods-functions.html).

### What's the difference between types and classes?

Types are primarily a compile-time concept. At compile time,
every expression is assigned a type by the compiler.

Classes are primarily a runtime concept and are platform-dependent.
At runtime on the JVM, every value is either a primitive value
or an instance of exactly one class.

Some type information exists only at compile time,
for multiple reasons, most notoriously
[type erasure](https://en.wikipedia.org/wiki/Type_erasure).

For an in-depth treatment of types vs. classes, see the blog post
["There are more types than classes"](https://typelevel.org/blog/2017/02/13/more-types-than-classes.html).

### How can a method in a superclass return a value of the “current” type?

Possible solutions include F-bounded polymorphism
_(familiar to Java programmers)_, type members,
and the [typeclass pattern](http://tpolecat.github.io/2013/10/12/typeclass.html).

This [blog post](http://tpolecat.github.io/2015/04/29/f-bounds.html)
argues against F-bounds and in favor of typeclasses.
Which is revisited with a discussion about the trade-offs of alternatives
in [this Stack Overflow post](https://stackoverflow.com/questions/59813323/advantages-of-f-bounded-polymorphism-over-typeclass-for-return-current-type-prob).

### What does `<:<` mean?

It's a "type constraint", and it comes from the standard library,
not from the language itself.
See [this blog post](https://blog.bruchez.name/2015/11/generalized-type-constraints-in-scala.html).

### I dislike requiring callers to wrap optional arguments in `Some(...)`; is there a better way?

Not really. See [this answer on Stack Overflow](https://stackoverflow.com/a/65256691/4111404).

### Why is `implicit val` usually recommended over `implicit object`?

The latter has a singleton type, which is too specific.
See [answer on Stack Overflow](https://stackoverflow.com/a/65258340/4111404).
