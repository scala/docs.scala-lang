---
layout: singlepage-overview
title: Scala FAQ
permalink: /tutorials/FAQ/index.html
redirect_from:
  - "/tutorials/FAQ/breakout.html"
  - "/tutorials/FAQ/chaining-implicits.html"
  - "/tutorials/FAQ/collections.html"
  - "/tutorials/FAQ/context-bounds.html"
  - "/tutorials/FAQ/finding-implicits.html"
  - "/tutorials/FAQ/finding-symbols.html"
  - "/tutorials/FAQ/stream-view.html"
  - "/tutorials/FAQ/yield.html"
---

Frequently asked questions, with _brief_ answers and/or links to
longer answers.

This list only includes questions that _actually_ come up over and
over again in Scala chat rooms and forums.

## General questions

### Where can I ask Scala questions?

See our [Community page](https://scala-lang.org/community/).

### What's a good book about Scala?

Our [Books page](https://docs.scala-lang.org/books.html) lists some
especially popular, well-known books.

We don't have a list of all the Scala books that
are out there; there are many.

You can go on the \#scala-users room [on
Discord](https://discord.com/invite/scala) or another community forum and
ask for book recommendations. You'll get more helpful
answers if you provide some information about your background and your
reasons for wanting to learn Scala.

### What's a good video course about Scala?

Our [Online Courses page](https://docs.scala-lang.org/online-courses.html)
lists some especially popular, well-known courses.

As with books, you can go on the \#scala-users room [on
Discord](https://discord.com/invite/scala) or another community forum and
ask for online course recommendations. You'll get more helpful
answers if you provide some information about your background and your
reasons for wanting to learn Scala.

### Should I learn Scala 2, or Scala 3?

Don't sweat the decision too much.  You can't go far wrong either
way. It isn't that hard to switch later, in either direction.

Regardless, you should choose Scala 3 unless you have a specific reason
to need 2. Scala 3 is the future, and it's the best version for
falling in love with the language and everything it has to offer.
Scala 3 has plenty of books, plenty of libraries, and high quality
tooling.

That said, many Scala jobs are still Scala 2 jobs. In most cases, the
cause of that is simply inertia, especially at large shops. (But it can
sometimes be due to availability of specific libraries.)

### Where are Scala jobs advertised?

This is addressed on our [Community page](https://scala-lang.org/community/#scala-jobs).

In short, the only officially sanctioned place is the \#jobs channel
[on Discord](https://discord.com/invite/scala).

### Who's behind Scala?

This is answered [on the Governance page](https://www.scala-lang.org/governance/).

### Can I use the Scala logo?

See [scala/scala-lang#1040](https://github.com/scala/scala-lang/issues/1040).

## Technical questions

### What IDEs are available for Scala?

See [this doc page](https://docs.scala-lang.org/getting-started/scala-ides.html).

### What compiler flags are recommended?

The list of available options is
[here](https://docs.scala-lang.org/overviews/compiler-options/index.html).

What flags people choose varies widely from shop to shop and from
individual to individual.  `-Xlint` is valuable to enable.  Some brave
people enable `-Werror` (formerly `-Xfatal-warnings`) to make warnings
fatal.

[sbt-tpolecat](https://github.com/typelevel/sbt-tpolecat) is an
opinionated sbt plugin that sets many options automatically, depending
on Scala version; you can see
[here](https://github.com/typelevel/sbt-tpolecat/blob/main/plugin/src/main/scala/io/github/davidgregory084/TpolecatPlugin.scala)
what it sets.  Some choices it makes are oriented towards
pure-functional programmers.

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

### I want Scala 2.13 (or some other version); why does sbt say it's using Scala 2.12?

sbt 1.x always uses Scala 2.12 to compile build definitions.
Your sbt 1.x build definition is always a Scala 2.12 program.

Regardless, in your `build.sbt`, you can set `scalaVersion` to whichever
available distribution you want and your program code will be compiled with that version.

### I want Scala 3. Why does `versionNumberString` say I'm on 2.13?

To aid migration, Scala 3 currently uses the Scala 2.13 library as-is,
with only minor supplements.  That's why `versionString` and
`versionNumberString` report that Scala 2 is in use:

```
Welcome to Scala 3.3.4 (17.0.3, Java OpenJDK 64-Bit Server VM).
Type in expressions for evaluation. Or try :help.

scala> util.Properties.versionNumberString
val res0: String = 2.13.15
```

Note that even the latest Scala 3 version might not use the very
latest Scala 2 standard library, since the 3 and 2 release schedules
aren't coordinated.

So how do you ask for the Scala 3 version number? Scala 3 offers
`dotty.tools.dotc.config.Properties.versionNumberString`, but only if
you have scala3-compiler on the classpath. So that works in the Scala 3
REPL, but won't work in typical Scala 3 application code.

For an alternative way to detect the Scala 3 version, see
[this gist](https://gist.github.com/romanowski/de14691cab7340134e197419bc48919a).

There is a proposal to provide something easier at [scala/scala3#22144](https://github.com/scala/scala3/issues/22144).

### Why is my (abstract or overridden) `val` null?

<!-- this is left over from a previous version of the FAQ.
so, grandfathering this in, but I suggest we not host any further FAQ
answers here, I think it's better to provide only short answers and
links. if something needs more space to explain, there should be
official documentation that addresses it, not just an FAQ answer -->

See [this]({{ site.baseurl }}/tutorials/FAQ/initialization-order.html).

### Which type of collection should I choose?

See the [Scala 2.13 Collections Guide](https://docs.scala-lang.org/overviews/collections-2.13/introduction.html).

### What are context bounds?

It's syntactic sugar for a context parameter (an `implicit` parameter in Scala 2, or a `using` parameter in Scala 3).

More details in this [section of the Scala 3 Book](https://docs.scala-lang.org/scala3/book/ca-context-bounds.html) and this [Stack Overflow answer](https://stackoverflow.com/a/4467012).

### How does `for / yield` work?

It is syntactic sugar for nested `map`, `flatMap`, and `withFilter` calls.

For an in-depth explanation
see this [Stack Overflow answer](https://stackoverflow.com/a/1059501).

### What is the difference between view, stream and iterator?

[Answer on Stack Overflow](https://stackoverflow.com/a/5159356).

### What does `_` mean?

Many things really, depending on the context.
[This answer on Stack Overflow](https://stackoverflow.com/a/8001065/4111404)
has a good summary of all the meanings it has.

Note that, even if the specific meaning is different,
according to the situation, it usually means _"anything"_.

### Why doesn't my function literal with `_` in it work?

Not all function literals (aka lambdas) can be expressed with the `_`
syntax.

Every occurrence of `_` introduces a new variable.  So `_ + _` means
`(x, y) => x + y`, not `x => x + x`.  The latter function cannot be
written using the `_` syntax.

Also, the scope of `_` is always the smallest enclosing expression.
The scope is determined purely syntactically, during parsing, without
regard to types. So for example, `foo(_ + 1)` always means `foo(x =>
x + 1)`; it never means `x => foo(x + 1)`.  The latter function cannot
be written using the `_` syntax.

See also [SLS 6.23.2](https://scala-lang.org/files/archive/spec/2.13/06-expressions.html#placeholder-syntax-for-anonymous-functions).

### Why couldn't Scala infer the correct type in my code?

It is difficult to generalize about type inference, because various features of the language
affect how your code is construed. There may be several ways to rewrite your code to make
the types fall out naturally.

The most straightforward workaround is to supply explicit types in your code.

That may involve specifying an explicit type to a definition, or a type argument to a method.

Type inference is greatly improved in Scala 3. If Scala 2 doesn't compile your code, it's worth trying with Scala 3.

Sometimes, using multiple parameter lists helps inference, as explained in [this section of the language tour](https://docs.scala-lang.org/tour/multiple-parameter-lists.html#drive-type-inference).

For common questions about type inference involving `toSet`, see the discussions on [this ticket](https://github.com/scala/bug/issues/7743) and a related [Q&A](https://stackoverflow.com/questions/5544536/in-scala-2-type-inference-fails-on-set-made-with-toset).

### Can I chain or nest implicit conversions?

Not really, but you can [make it work](https://stackoverflow.com/a/5332804).

However, note that implicit conversions are, in general,
[discouraged](https://contributors.scala-lang.org/t/can-we-wean-scala-off-implicit-conversions/4388).

### Where does Scala look for implicits?

See this [answer on Stack Overflow](https://stackoverflow.com/a/5598107).

### Why do primitive type parameters erase to `Object`?

So for example, a `List[Int]` in Scala code will appear to Java as a
`List[Object]`.  The Java type system doesn't allow primitive types to
appear as type parameters, but couldn't they appear as their boxed
equivalents, such as `List[java.lang.Integer]`?

One would hope so, but doing it that way was tried, and it proved impossible.
[This SO question](https://stackoverflow.com/questions/11167430/why-are-primitive-types-such-as-int-erased-to-object-in-scala)
sadly lacks a concise explanation, but it does link to past discussions.

### What's the difference between methods and functions?

For example, how does a method such as:

    def square(x: Int): Int = x * x

differ from a function value such as:

    val square: Int => Int = x => x * x

For **Scala 2**, there is a [complete answer on Stack Overflow](https://stackoverflow.com/a/2530007/4111404)
and a [summary with practical differences](https://tpolecat.github.io/2014/06/09/methods-functions.html).

In **Scala 3**, the differences are fewer.
[Context functions]({{ site.scala3ref }}/contextual/context-functions.html)
accept given parameters and
[polymorphic functions]({{ site.scala3ref }}/new-types/polymorphic-function-types.html)
have type parameters.

It's standard to use methods most of the time,
except when a function value is actually needed.
[Eta-expansion](https://stackoverflow.com/questions/39445018/what-is-the-eta-expansion-in-scala),
converts methods to functions when needed.
For example, a method such as `map` expects a function,
but even if you `def square` as shown above, you can
still `xs.map(square)`.

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

### Should I declare my parameterless method with or without parentheses?

In other words, should one write `def foo()` or just `def foo`?

Answer: by convention, the former is used to indicate that a method
has side effects.

For more details, see the Scala Style Guide, [here](https://docs.scala-lang.org/style/naming-conventions.html#parentheses).

### How can a method in a superclass return a value of the “current” type?

Using `this.type` will only work if you are returning `this` itself.
`this.type` means "the singleton type of this instance". Only `this`
itself has the type `this.type`; other instances of the same class do
not.

What does work for returning other values of the same type?

Possible solutions include F-bounded polymorphism _(familiar to Java
programmers)_, type members, and the [typeclass
pattern](http://tpolecat.github.io/2013/10/12/typeclass.html).

This [blog post](http://tpolecat.github.io/2015/04/29/f-bounds.html)
argues against F-bounds and in favor of typeclasses;
see also [this Stack Overflow post](https://stackoverflow.com/questions/59813323/advantages-of-f-bounded-polymorphism-over-typeclass-for-return-current-type-prob) for some counterpoint.

### What does `<:<` mean?

It's a "type constraint", and it comes from the standard library,
not from the language itself.
See [this blog post](https://blog.bruchez.name/2015/11/generalized-type-constraints-in-scala.html).

### I dislike requiring callers to wrap optional arguments in `Some(...)`; is there a better way?

Not really. See [this answer on Stack Overflow](https://stackoverflow.com/a/65256691/4111404).

### Why is `implicit val` usually recommended over `implicit object`?

The latter has a singleton type, which is too specific.
See [answer on Stack Overflow](https://stackoverflow.com/a/65258340/4111404).

### I got a `StackOverflowError` while compiling my code. Is it a compiler bug?

It might be.

To find out, try giving the compiler more stack and see if the
error goes away.

It's possible for the compiler to run out of stack when compiling some
kinds of heavily nested code. The JVM's default stack size is rather
small, so this can happen sooner than you might expect.

The stack size can be changed by passing `-Xss...` at JVM startup, for
example `-Xss16M`.  How to do this depends on what IDE and/or build
tool you are using.  For sbt, add it to `.jvmopts`.

If the stack overflow doesn't go away no matter how much stack you
give the compiler, then it's a compiler bug. Please report it on the
[Scala 2 bug tracker](https://github.com/scala/bug/issues) or [Scala 3
bug tracker](https://github.com/scala/scala3/issues), but check
first if it's a duplicate of an existing ticket.

### I set a setting in sbt but nothing happened. Why?

There could be a lot of reasons.  An extremely common one, that
almost everyone runs into sooner or later, is that you have a bare
setting in a multi-project build.

For example, if you add this to your `build.sbt`:

    scalaVersion := "2.13.18"

that's a "bare" setting, and you might expect it to apply build-wide.
But it doesn't. _It only applies to the root project._

In many cases one should instead write:

    ThisBuild / scalaVersion := "2.13.18"

Other possibilities include:

* the common settings pattern, where you put shared settings
  in a `val`, typically named `commonSettings`, and then
  `.settings(commonSettings)` in every project you want to
  apply to them to.
* in interactive usage only, `set every`

Here's some further reading:

* [documentation on multi-project builds](https://www.scala-sbt.org/1.x/docs/Multi-Project.html#ThisBuild)
* [issue about bare settings](https://github.com/sbt/sbt/issues/6217)
