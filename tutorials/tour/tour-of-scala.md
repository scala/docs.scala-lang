---
layout: tutorial
title: Introduction

disqus: true

tutorial: scala-tour
num: 1
---

Scala is a modern multi-paradigm programming language designed to express common programming patterns in a concise, elegant, and type-safe way. It smoothly integrates features of object-oriented and functional languages.

## Scala is object-oriented ##
Scala is a pure object-oriented language in the sense that [every value is an object](unified-types.html). Types and behavior of objects are described by [classes](classes.html) and [traits](traits.html). Classes are extended by subclassing and a flexible [mixin-based composition](mixin-class-composition.html) mechanism as a clean replacement for multiple inheritance.

## Scala is functional ##
Scala is also a functional language in the sense that [every function is a value](unified-types.html). Scala provides a [lightweight syntax](anonymous-function-syntax.html) for defining anonymous functions, it supports [higher-order functions](higher-order-functions.html), it allows functions to be [nested](nested-functions.html), and supports [currying](currying.html). Scala's [case classes](case-classes.html) and its built-in support for [pattern matching](pattern-matching.html) model algebraic types used in many functional programming languages.

Furthermore, Scala's notion of pattern matching naturally extends to the [processing of XML data](xml-processing.html) with the help of [right-ignoring sequence patterns](regular-expression-patterns.html). In this context, [sequence comprehensions](sequence-comprehensions.html) are useful for formulating queries. These features make Scala ideal for developing applications like web services.

## Scala is statically typed ##
Scala is equipped with an expressive type system that enforces statically that abstractions are used in a safe and coherent manner. In particular, the type system supports:
* [generic classes](generic-classes.html)
* [variance annotations](variances.html)
* [upper](upper-type-bounds.html) and [lower](lower-type-bounds.html) type bounds,
* [inner classes](inner-classes.html) and [abstract types](abstract-types.html) as object members
* [compound types](compound-types.html)
* [explicitly typed self references](explicitly-typed-self-references.html)
* [views](views.html)
* [polymorphic methods](polymorphic-methods.html)

A [local type inference mechanism](local-type-inference.html) takes care that the user is not required to annotate the program with redundant type information. In combination, these features provide a powerful basis for the safe reuse of programming abstractions and for the type-safe extension of software.

## Scala is extensible ##

In practice, the development of domain-specific applications often requires domain-specific language extensions. Scala provides a unique combination of language mechanisms that make it easy to smoothly add new language constructs in form of libraries:
* any method may be used as an [infix or postfix operator](operators.html)
* [closures are constructed automatically depending on the expected type](automatic-closures.html) (target typing).

A joint use of both features facilitates the definition of new statements without extending the syntax and without using macro-like meta-programming facilities.

Scala interoperates with Java and .NET.
Scala is designed to interoperate well with the popular Java 2 Runtime Environment (JRE). In particular, the interaction with the mainstream object-oriented Java programming language is as smooth as possible. Scala has the same compilation model (separate compilation, dynamic class loading) like Java and allows access to thousands of existing high-quality libraries. Support for the .NET Framework (CLR) is also available.

Please continue to the next page to read more.
