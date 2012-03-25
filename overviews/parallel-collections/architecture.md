---
layout: overview-large
title: Architecture of the Parallel Collections Library

disqus: true

partof: parallel-collections
num: 5
---

Like the normal, sequential collections library, Scala's parallel collections
library contains a large number of collection operations which exist uniformly
on many different parallel collection implementations. And like the normal,
sequential collections library, Scala's parallel collections library seeks to
prevent code duplication by likewise implementing most operations in terms of
parallel collection "templates" which need only be defined once and can be
flexibly inherited by many different parallel collection implementations.

The benefits of this approach are greatly eased **maintenance** and
**extensibility**. In the case of maintenance-- by having a single
implementation of a parallel collections operation inherited by all parallel
collections, maintenance becomes easier and more robust; bug fixes propagate
down the class hierarchy, rather than needing implementations to be
duplicated. For the same reasons, the entire library becomes easier to
extend-- new collection classes can simply inherit most of their operations.

## Core Abstractions

The aforementioned "template" traits implement most parallel operations in
terms of two core abstractions-- `Splitter`s and `Combiner`s.

### Splitters

The job of a `Splitter`, as its name suggests, is to split a parallel
collection into a non-trival partition of its elements. The basic idea is to
split the collection into smaller parts until they are small enough to be
operated on sequentially.

Interestingly, `Splitter`s are implemented as `Iterator`s, meaning that apart
from splitting, they are also used by the framework to traverse a given
parallel collection. What's more, as a type of `Iterator`, a `Splitter` can be
`split` further into additional `Splitter`s which each traverse over disjoint
subsets of elements of the whole parallel collection. Typically, this `split`
operation is repeated recursively until the size of the split partitions is
sufficiently small.

### Combiners



## Hierarchy

