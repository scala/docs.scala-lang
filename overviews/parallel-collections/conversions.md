---
layout: overview-large
title: Parallel Collection Conversions

disqus: true

partof: parallel-collections
num: 2
---

**Aleksandar Prokopec**


## Converting between sequential and parallel collections

Every sequential collection can be converted to its parallel variant
using the `par` method. Certain sequential collection have their
direct parallel counterparts. For these collections the conversion is
efficient - it occurs in constant time, since both the sequential and
the parallel collection have the same data-structural representation
(one exception are mutable hash maps and hash sets which are slightly
more expensive to convert the first time `par` is called, but
subsequent invocations of `par` take constant time). It should be
noted that for mutable collections, changes in the sequential collection are
visible in its parallel counterpart if they share the underlying data-structure.

| sequential    | parallel       |
| ------------- | -------------- |
| **mutable**   |                |
| `Array`       | `ParArray`     |
| `HashMap`     | `ParHashMap`   |
| `HashSet`     | `ParHashSet`   |
| `Ctrie`       | `ParCtrie`     |
| **immutable** |                |
| `Vector`      | `ParVector`    |
| `Range`       | `ParRange`     |
| `HashMap`     | `ParHashMap`   |
| `HashSet`     | `ParHashSet`   |

Other collections, such as lists, queues or streams, are inherently
sequential in the sense that the elements must be accessed in
one after the other. These collections are converted to their parallel
variants by copying the elements into a similar parallel collection.
For example, a functional list is converted into a standard immutable
parallel sequence, which is a parallel vector.

Every parallel collection can be converted to its sequential variant
using the `seq` method. Converting a parallel collection to a
sequential collection is always efficient - it takes constant
time. Calling `seq` on a mutable parallel collection yields a
sequential collection which is backed by the same store - updates to
one collection will be visible in the other one.


## Converting between different collection types

Orthogonal to converting between sequential and parallel collections,
collections can be converted between different collection types. For
example, while calling `toSeq` converts a sequential set to a
sequential sequence, calling `toSeq` on a parallel set converts it to
a parallel sequence. The general rule is that if there is a
parallel version of `X`, then the `toX` method converts the collection
into a `ParX` collection.

Here is a summary of all conversion methods:

| method         | return type    |
| -------------- | -------------- |
| `toArray`      | `Array`        |
| `toList`       | `List`         |
| `toIndexedSeq` | `IndexedSeq`   |
| `toStream`     | `Stream`       |
| `toIterator`   | `Iterator`     |
| `toBuffer`     | `Buffer`       |
| `toTraversable`| `GenTraverable`|
| `toIterable`   | `ParIterable`  |
| `toSeq`        | `ParSeq`       |
| `toSet`        | `ParSet`       |
| `toMap`        | `ParMap`       |

   

