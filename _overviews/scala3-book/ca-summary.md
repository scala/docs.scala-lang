---
title: Summary
type: section
description: This page provides a summary of the Contextual Abstractions lessons.
languages: [ru, zh-cn]
num: 67
previous-page: ca-implicit-conversions
next-page: concurrency
---

This chapter provides an introduction to most Contextual Abstractions topics, including:

- [Extension Methods]({% link _overviews/scala3-book/ca-extension-methods.md %})
- [Given Instances and Using Clauses]({% link _overviews/scala3-book/ca-context-parameters.md %})
- [Context Bounds]({% link _overviews/scala3-book/ca-context-bounds.md %})
- [Given Imports]({% link _overviews/scala3-book/ca-given-imports.md %})
- [Type Classes]({% link _overviews/scala3-book/ca-type-classes.md %})
- [Multiversal Equality]({% link _overviews/scala3-book/ca-multiversal-equality.md %})
- [Implicit Conversions]({% link _overviews/scala3-book/ca-implicit-conversions.md %})

These features are all variants of the core idea of **term inference**: given a type, the compiler synthesizes a “canonical” term that has that type.

A few more advanced topics aren’t covered here, including:

- Conditional Given Instances
- Type Class Derivation
- Context Functions
- By-Name Context Parameters
- Relationship with Scala 2 Implicits

Those topics are discussed in detail in the [Reference documentation][ref].


[ref]: {{ site.scala3ref }}/contextual
