---
title: Contextual Abstractions
type: chapter
description: This chapter provides an introduction to the Scala 3 concept of Contextual Abstractions.
num: 58
previous-page: types-others
next-page: ca-given-using-clauses
---


## Background

Implicits in Scala 2 were a major distinguishing design feature.
They are *the* fundamental way to abstract over context.
They represent a unified paradigm with a great variety of use cases, among them:

- Implementing type classes
- Establishing context
- Dependency injection
- Expressing capabilities
- Computing new types, and proving relationships between them

Since then, other languages have followed suit, e.g., Rust’s traits or Swift’s protocol extensions.
Design proposals are also on the table for Kotlin as compile time dependency resolution, for C# as Shapes and Extensions or for F# as Traits.
Implicits are also a common feature of theorem provers such as Coq or Agda.

Even though these designs use different terminology, they’re all variants of the core idea of *term inference*:
Given a type, the compiler synthesizes a “canonical” term that has that type.


## Redesign

Scala 3 includes a redesign of contextual abstractions in Scala.
While these concepts were gradually “discovered” in Scala 2, they’re now well known and understood, and the redesign takes advantage of that knowledge.

The design of Scala 3 focuses on **intent** rather than **mechanism**.
Instead of offering one very powerful feature of implicits, Scala 3 offers several use-case oriented features:

- **Abtracting over contextual information**.
  [Using clauses][givens] allow programmers to abstract over information that is available in the calling context and should be passed implicitly.
  As an improvement over Scala 2 implicits, using clauses can be specified by type, freeing function signatures from term variable names that are never explicitly referred to.

- **Providing Type-class instances**.
  [Given instances][type-classes] allow programmers to define the _canonical value_ of a certain type.
  This makes programming with type-classes more straightforward without leaking implementation details.

- **Retroactively extending classes**.
  In Scala 2, extension methods had to be encoded using implicit conversions or implicit classes.
  In contrast, in Scala 3 [extension methods][extension-methods] are now directly built into the language, leading to better error messages and improved type inference.

- **Viewing one type as another**.
  Implicit conversion have been [redesigned][implicit-conversions] from the ground up as instances of a type-class `Conversion`.

- **Higher-order contextual abstractions**.
  The _all-new_ feature of [context functions][contextual-functions] makes contextual abstractions a first-class citizen.
  They are an important tool for library authors and allow to express concise domain specific languages.

- **Actionable feedback from the compiler**.
  In case an implicit parameter can not be resolved by the compiler, it now provides you [import suggestions](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html) that may fix the problem.


## Benefits

These changes in Scala 3 achieve a better separation of term inference from the rest of the language:

- There’s a single way to define givens
- There’s a single way to introduce implicit parameters and arguments
- There’s a separate way to [import givens][given-imports] that does not allow them to hide in a sea of normal imports
- There’s a single way to define an [implicit conversion][implicit-conversions], which is clearly marked as such, and does not require special syntax

Benefits of these changes include:

- The new design thus avoids feature interactions and makes the language more consistent
- It makes implicits easier to learn and harder to abuse
- It greatly improves the clarity of the 95% of Scala programs that use implicits
- It has the potential to enable term inference in a principled way that is also accessible and friendly

This chapter introduces many of these new features in the following sections.

[givens]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[given-imports]: {% link _overviews/scala3-book/ca-given-imports.md %}
[implicit-conversions]: {% link _overviews/scala3-book/ca-implicit-conversions.md %}
[extension-methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[context-bounds]: {% link _overviews/scala3-book/ca-context-bounds.md %}
[type-classes]: {% link _overviews/scala3-book/ca-type-classes.md %}
[equality]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[contextual-functions]: {% link _overviews/scala3-book/types-dependent-function.md %}
