---
layout: tour
title: Introduction
partof: scala-tour

num: 1

next-page: basics

redirect_from: "/tutorials/tour/tour-of-scala.html"
redirect_from: "/tutorials/tour/anonymous-function-syntax.html"
redirect_from: "/tutorials/tour/explicitly-typed-self-references.html"
---

## Welcome to the tour
This tour contains bite-sized introductions to the most frequently used features
of Scala. It is intended for newcomers to the language.

This is just a brief tour, not a full language tutorial. If
you want a more detailed guide, consider obtaining [a book](/books.html) or consulting
[other resources](/learn.html).

## What is Scala?
Scala is a modern multi-paradigm programming language designed to express common programming patterns in a concise, elegant, and type-safe way. It seamlessly integrates features of object-oriented and functional languages.

## Scala is object-oriented ##
Scala is a pure object-oriented language in the sense that [every value is an object](unified-types.html). Types and behaviors of objects are described by [classes](classes.html) and [traits](traits.html). Classes can be extended by subclassing, and by using a flexible [mixin-based composition](mixin-class-composition.html) mechanism as a clean replacement for multiple inheritance.

## Scala is functional ##
Scala is also a functional language in the sense that [every function is a value](unified-types.html). Scala provides a [lightweight syntax](basics.html#functions) for defining anonymous functions, it supports [higher-order functions](higher-order-functions.html), it allows functions to be [nested](nested-functions.html), and it supports [currying](multiple-parameter-lists.html). Scala's [case classes](case-classes.html) and its built-in support for [pattern matching](pattern-matching.html) provide the functionality of algebraic types, which are used in many functional languages. [Singleton objects](singleton-objects.html) provide a convenient way to group functions that aren't members of a class.

Furthermore, Scala's notion of pattern matching naturally extends to the [processing of XML data](https://github.com/scala/scala-xml/wiki/XML-Processing) with the help of [right-ignoring sequence patterns](regular-expression-patterns.html), by way of general extension via [extractor objects](extractor-objects.html). In this context, [for comprehensions](for-comprehensions.html) are useful for formulating queries. These features make Scala ideal for developing applications like web services.

## Scala is statically typed ##
Scala's expressive type system enforces, at compile-time, that abstractions are used in a safe and coherent manner. In particular, the type system supports:

* [Generic classes](generic-classes.html)
* [Variance annotations](variances.html)
* [Upper](upper-type-bounds.html) and [lower](lower-type-bounds.html) type bounds
* [Inner classes](inner-classes.html) and [abstract type members](abstract-type-members.html) as object members
* [Compound types](compound-types.html)
* [Explicitly typed self references](self-types.html)
* [Implicit parameters](implicit-parameters.html) and [conversions](implicit-conversions.html)
* [Polymorphic methods](polymorphic-methods.html)

[Type inference](type-inference.html) means the user is not required to annotate code with redundant type information. In combination, these features provide a powerful basis for the safe reuse of programming abstractions and for the type-safe extension of software.

## Scala is extensible ##

In practice, the development of domain-specific applications often requires domain-specific language extensions. Scala provides a unique combination of language mechanisms that make it straightforward to add new language constructs in the form of libraries.

In many cases, this can be done without using meta-programming facilities such as macros. For example:

* [Implicit classes](/overviews/core/implicit-classes.html) allow adding extension methods to existing types.
* [String interpolation](/overviews/core/string-interpolation.html) is user-extensible with custom interpolators.

## Scala interoperates

Scala is designed to interoperate well with the popular Java Runtime Environment (JRE). In particular, the interaction with the mainstream object-oriented Java programming language is as seamless as possible. Newer Java features like SAMs, [lambdas](higher-order-functions.html), [annotations](annotations.html), and [generics](generic-classes.html) have direct analogues in Scala.

Those Scala features without Java analogues, such as [default](default-parameter-values.html) and [named parameters](named-arguments.html), compile as closely to Java as reasonably possible. Scala has the same compilation model (separate compilation, dynamic class loading) as Java and allows access to thousands of existing high-quality libraries.

## Enjoy the tour!

Please continue to the [next page](basics.html) to read more.
