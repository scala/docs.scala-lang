---
layout: inner-page-documentation
title: Documentation
permalink: /documentation/
redirect_from:
  - /what-is-scala/
includeTOC: true

# Content masthead links
links:
  - title: "Getting Started"
    description: "Install Scala on your computer and start writing some Scala code!"
    icon: "fa fa-rocket"
    link: /documentation/getting-started/
  - title: "Tour of Scala"
    description: "Get an introduction to some of the core language concepts."
    icon: "fa fa-flag"
    link: http://docs.scala-lang.org/tutorials/tour/tour-of-scala.html
  - title: "Guides"
    description: "Access detailed documentation on important language features."
    icon: "fa fa-file-text"
    link: http://docs.scala-lang.org/guides.html
  - title: "Reference"
    description: "Search the API, read the language spec, and the glossary"
    icon: "fa fa-database"
    link: /documentation/reference.html
  - title: "Learning Resources"
    description: "Books and online exercises"
    icon: "fa fa-book"
    link: /documentation/learn.html

---

# What is Scala?

## A Scalable language

Scala is an acronym for "Scalable Language". This means that
Scala grows with you. You can play with it by typing one-line
expressions and observing the results.  But you can also rely on it
for large mission critical systems, as many companies, including
Twitter, LinkedIn, or Intel do.

To some, Scala feels like a scripting language. Its syntax is concise
and low ceremony; its types get out of the way because the compiler
can infer them.  There's a REPL and IDE worksheets for quick
feedback. Developers like it so much that Scala won the ScriptBowl
contest at the 2012 JavaOne conference.

At the same time, Scala is the preferred workhorse language for many
mission critical server systems. The generated code is on a par with
Java's and its precise typing means that many problems are caught at
compile-time rather than after deployment.

At the root, the language's scalability is the result of a careful
integration of object-oriented and functional language concepts.

## Object-Oriented

Scala is a pure-bred object-oriented language. Conceptually, every
value is an object and every operation is a method-call. The language
supports advanced component architectures through classes and traits.

Many traditional design patterns in other languages are already
natively supported. For instance, singletons are supported through
object definitions and visitors are supported through pattern
matching. Using implicit classes, Scala even allows you to add new operations
to existing classes, no matter whether they come from Scala or Java!

## Functional

Even though its syntax is fairly conventional, Scala is also a
full-blown functional language. It has everything you would expect,
including first-class functions, a library with efficient immutable
data structures, and a general preference of immutability
over mutation.

Unlike with many traditional functional languages, Scala allows a
gradual, easy migration to a more functional style. You can start to
use it as a "Java without semicolons". Over time, you can progress to
gradually eliminate mutable state in your applications, phasing in
safe functional composition patterns instead. As Scala programmers we
believe that this progression is often a good idea. At the same time,
Scala is not opinionated; you can use it with any style you prefer.

## Seamless Java Interop

Scala runs on the JVM. Java and Scala classes can be freely mixed, no
matter whether they reside in different projects or in the same. They can
even mutually refer to each other, the Scala compiler contains a
subset of a Java compiler to make sense of such recursive
dependencies.

Java libraries, frameworks and tools are all available. Build tools
like ant or maven, IDEs like Eclipse, IntelliJ, or Netbeans,
frameworks like Spring or Hibernate all work seamlessly with Scala.
Scala runs on all common JVMs and also on Android.

The Scala community is an important part of the Java
ecosystem. Popular Scala frameworks, including Akka, Finagle, and the
Play web framework include dual APIs for Java and Scala.

## Functions are Objects

Scala's approach is to develop a small set of core constructs that can
be combined in flexible ways. This applies also to its object-oriented
and functional natures. Features from both sides are unified to a
degree where Functional and Object-oriented can be seen as two sides
of the same coin.

Some examples: Functions in Scala are objects. The function type is
just a regular class. The algebraic data types found in languages such
as Haskell, F# or ML are modelled in Scala as class
hierarchies. Pattern matching is possible over arbitrary classes.

## Future-Proof

Scala particularly shines when it comes to scalable server software
that makes use of concurrent and synchronous processing, parallel
utilization of multiple cores, and distributed processing in the
cloud.

Its functional nature makes it easier to write safe and performant
multi-threaded code. There's typically less reliance on mutable state
and Scala's futures and actors provide powerful tools for organizing
concurrent system at a high-level of abstraction.

## Fun

Maybe most important is that programming in Scala tends to be very
enjoyable.  No boilerplate, rapid iteration, but at the same time the
safety of a strong static type system. As [Graham Tackley from the
Guardian says](http://www.infoq.com/articles/guardian_scala): *"We've found that Scala has enabled us to deliver
things faster with less code. It's reinvigorated the team."*

If you haven't yet, try it out! [Here are some resources to get
started](./documentation).
