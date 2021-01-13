---
type: chapter
title: Tutorial
description: A tutorial to cover all the features involved in writing macros in Scala 3.
num: 1

next-page: inline
---

## Introduction

This tutorial covers all the features involved in writing macros in Scala 3.

The metaprogramming API of Scala 3 is designed in layers to gradually
support different levels of use-cases. Each successive layer exposes additional
abstractions and offers more fine-grained control.

- As a starting point, the new [`inline` feature][inline] allows some abstractions (values and methods) to be marked as statically reducible.
  It provides the entry point for macros and other metaprogramming utilities.

- [Compile-time operations][compiletime] offer additional metaprogramming utilities that can be used within `inline` methods (for example to improve error reporting), without having to define a macro.

- Starting from `inline` methods, [macros][macros] are programs that explicitly operate on programs.

  - Macros can be defined in terms of a _high-level_ API of [quoted expressions][quotes], that admits simple construction and deconstruction of programs expressions.

  - Macros can also be defined in terms of a more _low-level_ API of [Reflection][reflection], that allows detailed inspection of programs.

> The tutorial uses the API of Scala 3.0.0-M3. The API had many small changes in this revision.

> 🚧 We are still in the process of writing the tutorial. You can [help us][contributing] 🚧

[contributing]: {% link scala3/contribute-to-docs.md %}
[compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[macros]: {% link _overviews/scala3-macros/tutorial/macros.md %}
[quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}
