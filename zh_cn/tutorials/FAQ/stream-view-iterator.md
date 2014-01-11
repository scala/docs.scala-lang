---
layout: overview-large
title: What is the difference between view, stream and iterator?

disqus: true

partof: FAQ
num: 4
---
First, they are all _non-strict_. That has a particular mathematical meaning
related to functions, but, basically, means they are computed on-demand instead
of in advance.

`Stream` is a lazy list indeed. In fact, in Scala, a `Stream` is a `List` whose
`tail` is a `lazy val`. Once computed, a value stays computed and is reused.
Or, as you say, the values are cached.

An `Iterator` can only be used once because it is a _traversal pointer_  into a
collection, and not a collection in itself. What makes it special in Scala is
the fact that you can apply transformation such as `map` and `filter` and
simply get a new `Iterator` which will only apply these transformations when
you ask for the next element.

Scala used to provide iterators which could be reset, but that is very hard to
support in a general manner, and they didn't make version 2.8.0.

Views are meant to be viewed much like a database view. It is a series of
transformation which one applies to a collection to produce a "virtual"
collection. As you said, all transformations are re-applied each time you need
to fetch elements from it.

Both `Iterator` and views have excellent memory characteristics. `Stream` is
nice, but, in Scala, its main benefit is writing infinite sequences
(particularly sequences recursively defined). One _can_ avoid keeping all of
the `Stream` in memory, though, by making sure you don't keep a reference to
its `head` (for example, by using `def` instead of `val` to define the
`Stream`).

Because of the penalties incurred by views, one should usually `force` it after
applying the transformations, or keep it as a view if only few elements are
expected to ever be fetched, compared to the total size of the view.

This answer was originally submitted in response to [this question on Stack Overflow][1].

  [1]: http://stackoverflow.com/q/5159000/53013

