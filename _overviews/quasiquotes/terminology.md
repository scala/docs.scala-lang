---
layout: multipage-overview
title: Terminology summary

discourse: true

partof: quasiquotes
overview-name: Quasiquotes

num: 12

permalink: /overviews/quasiquotes/:title.html
---
<span class="tag" style="float: right;">EXPERIMENTAL</span>

* **Quasiquote** (not quasi-quote) can refer to either the quasiquote library or any usage of one its [interpolators](intro.html#interpolators). The name is not hyphenated for the sake of consistency with implementations of the same concept in other languages (e.g. [Scheme and Racket](http://docs.racket-lang.org/reference/quasiquote.html), [Haskell](http://www.haskell.org/haskellwiki/Quasiquotation))
* **Tree** or **AST** (Abstract Syntax Tree) is a representation of a Scala program or a part of it through means of the Scala reflection API's Tree type.
* **Tree construction** refers to usages of quasiquotes as expressions to represent creation of new tree values.
* **Tree deconstruction** refers to usages of quasiquotes as patterns to structurally tear apart trees.
* **Unquoting** is a way of either putting things in or extracting things out of quasiquotes. Can be performed with `$` syntax within a quasiquote.
* **Unquote splicing** (or just splicing) is another form of unquoting that flattens contents of the unquotee into a tree. Can be performed with either `..$` or `...$` syntax.
* **Rank** is a degree of flattenning of unquotee: `rank($) == 0`, `rank(..$) == 1`, `rank(...$) == 2`.
* [**Lifting**](lifting.html) is a way to unquote non-tree values and transform them into trees with the help of the `Liftable` typeclass.
* [**Unlifting**](unlifting.html) is a way to unquote non-tree values out of quasiquote patterns with the help of the `Unliftable` typeclass.
