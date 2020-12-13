---
title: Contextual Abstractions
type: chapter
description: This chapter provides an introduction to the Scala 3 concept of Contextual Abstractions.
num: 56
previous-page: types-others
next-page: ca-given-using-clauses
---


<!-- TODO: Personally, I’m not comfortable with terms like “contextual abstractions” and “context parameters”. (For instance, in my original Dotty notes I have the question, “What is a context parameter?”) I’d like to add some definitions of the main concepts/terms, either here or in the sections where they are used.
-->

## Background

Implicits in Scala 2 were a major distinguishing design feature. They are *the* fundamental way to abstract over context. They represent a unified paradigm with a great variety of use cases, among them:

- Implementing type classes
- Establishing context
- Dependency injection
- Expressing capabilities
- Computing new types, and proving relationships between them

Since then, other languages have followed suit, e.g., Rust’s traits or Swift’s protocol extensions. Design proposals are also on the table for Kotlin as compile time dependency resolution, for C# as Shapes and Extensions or for F# as Traits. Implicits are also a common feature of theorem provers such as Coq or Agda.

Even though these designs use different terminology, they’re all variants of the core idea of *term inference*: Given a type, the compiler synthesizes a “canonical” term that has that type. Scala embodies the idea in a purer form than most other languages: An implicit parameter directly leads to an inferred argument term that could also be written down explicitly.


## Redesign

Scala 3 includes a redesign of contextual abstractions in Scala. While these concepts were gradually “discovered” in Scala 2, they’re now well known and understood, and the redesign takes advantage of that knowledge.

Scala 3 introduces four fundamental changes:

<!-- TODO: link Using Clauses to its subsection -->

- [Given Instances](ca-02-given-using-clauses.md) are a new way to define terms that can be synthesized. If you used implicit definitions in Scala 2, *givens* replace those, and represent a single way to define terms that can be synthesized for types.
- [Using Clauses](ca-02-given-using-clauses.md) are the new syntax for implicit parameters and their arguments. They unambiguously align parameters and arguments, and let you have several `using` clauses in a definition.
- [Given Imports](ca-04-given-imports.md) are a new class of `import` selectors that import givens and nothing else. This lets you make it more clear where `given` instances in a scope are coming from.
- [Implicit Conversions](ca-08-implicit-conversions.md) are now expressed as `given` instances of a standard `Conversion` class. All other forms of implicit conversions will be phased out.

This chapter also contains sections that describe other language features related to *contextual abstraction*. These are:

- [Context Bounds](ca-03-context-bounds.md), which carry over unchanged from Scala 2.
- [Extension Methods](ca-05-extension-methods.md) replace implicit classes in a way that integrates better with type classes.
- [Implementing Type Classes](ca-06-type-classes.md) shows an example of how type classes are implemented with the new language constructs.
- [Multiversal Equality](ca-07-multiversal-equality.md) introduces a special type class to support type safe equality.



## Benefits

These changes in Scala 3 achieve a better separation of term inference from the rest of the language:

- There’s a single way to define givens
- There’s a single way to introduce implicit parameters and arguments
- There’s a separate way to import givens that does not allow them to hide in a sea of normal imports
- There’s a single way to define an implicit conversion, which is clearly marked as such, and does not require special syntax

Benefits of these changes include:

- The new design thus avoids feature interactions and makes the language more consistent
- It makes implicits easier to learn and harder to abuse
- It greatly improves the clarity of the 95% of Scala programs that use implicits
- It has the potential to enable term inference in a principled way that is also accessible and friendly

This chapter introduces many of these new features in the following sections.



