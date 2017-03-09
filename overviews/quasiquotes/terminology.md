---
layout: overview-large
title: Terminology summary 

disqus: true

partof: quasiquotes
num: 12
outof: 13
languages: [ko]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

* **Quasiquote** (not quasi-quote) can refer to either quasiquote library or any usage of one it's [interpolators](/overviews/quasiquotes/intro.html#interpolators). The name is not hyphenated for sake of consistency with implementations of the same concept in other languages (e.g. [Scheme and Racket](http://docs.racket-lang.org/reference/quasiquote.html), [Haskell](http://www.haskell.org/haskellwiki/Quasiquotation))
* **Tree** or **AST** (Abstract Syntax Tree) is representation of Scala program or a part of it through means of Scala reflection API's Tree type.
* **Tree construction** refers to usages of quasiquotes as expressions to represent creation of new tree values.
* **Tree deconstruction** refers to usages of quasiquotes as patterns to structurally tear trees apart.
* **Unquoting** is a way of either putting thing in or extracting things out of quasiquote. Can be performed with `$` syntax within a quasiquote.
* **Unquote splicing** (or just splicing) is another form of unquoting that flattens contents of the unquotee into a tree. Can be performed with either `..$` or `...$` syntax.
* **Rank** is a degree of flattenning of unquotee: `rank($) == 0`, `rank(..$) == 1`, `rank(...$) == 2`.
* [**Lifting**](/overviews/quasiquotes/lifting.html) is a way to unquote non-tree values and transform them into trees with the help of Liftable typeclass.
* [**Unlifting**](/overviews/quasiquotes/unlifting.html) is a way to unquote non-tree values out of quasiquote patterns with the help of Unliftable typeclass.

