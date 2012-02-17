---
layout: overview-large
title: Concrete Parallel Collection Classes

disqus: true

partof: parallel-collections
num: 2
---

**Aleksandar Prokopec**

## Parallel Array

A [ParArray](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/mutable/ParArray.html) sequence holds an linear, contiguous array of elements. This means that the elements can be accessed and updated efficiently through modifying the underlying array. Traversing the elements is also very efficient for this reason. Parallel arrays are like arrays in the sense that their size is constant.

    scala> val pa = scala.collection.parallel.mutable.ParArray.tabulate(1000)(x => 2 * x + 1)
    pa: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 3, 5, 7, 9, 11, 13,...
    scala> pa reduce (_ + _)
    res0: Int = 1000000
    scala> pa map (x => (x - 1) / 2)
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(0, 1, 2, 3, 4, 5, 6, 7,...

Internally, splitting a parallel array splitter amounts to creating two new splitters with their iteration indices updated. Combiners are slightly more involved. Since for most transformer methods (e.g. `flatMap`, `filter`, `takeWhile`, etc.) we don't know the number of elements (and hence, the array size) in advance, each combiner is essentially a variant of an array buffer with an amortized constant time `+=` operation. Different processors add elements to separate parallel array combiners, which are then combined by chaining their internal arrays. The underlying array is only allocated and filled in parallel after the total number of elements becomes known. For this reason, transformer methods are slightly more expensive than accessor methods. Also, note that the final array allocation proceeds sequentially on the JVM, so this can prove to be a sequential bottleneck if the mapping operation itself is very cheap.

By calling the `seq` method parallel arrays are converted to `ArraySeq` collections, which are their sequential counterparts. This conversion is efficient, and the `ArraySeq` is backed by the same underlying array as the parallel array it was obtained from.


## Parallel Vector

A [ParVector](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParVector.html) is an immutable sequence with a low-constant factor logarithmic access and update time.

    scala> val pv = scala.collection.parallel.immutable.ParVector.tabulate(1000)(x => x)
    pv: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,...
    scala> pv filter (_ % 2 == 0)
    res0: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 2, 4, 6, 8, 10, 12, 14, 16, 18,...

Immutable vectors are represented with 32-way trees, so splitters are split by assigning subtrees to each splitter. Combiners currently keep a vector of elements and are combined by lazily copying the elements. For this reason, transformer methods are less scalable than those of a parallel array. Once the vector concatenation operation becomes available in a future Scala release, combiners will be combined using concatenation and transformer methods will become much more efficient.

Parallel vector is a parallel counterpart of the sequential [Vector](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Vector.html), so conversion between the two takes constant time.


## ParRange

A [ParRange](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParRange.html) is an ordered sequence of elements equally spaced apart. A parallel range is created in a similar way as the sequential [Range](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Range.html):

    scala> 1 to 3 par
    res0: scala.collection.parallel.immutable.ParRange = ParRange(1, 2, 3)
    scala> 15 to 5 by -2 par
    res1: scala.collection.parallel.immutable.ParRange = ParRange(15, 13, 11, 9, 7, 5)

Just as sequential ranges have no builder, parallel ranges have no combiners. Mapping the elements of a parallel range produces a parallel vector. Sequential ranges and parallel ranges can be converted efficiently one from another using the `seq` and `par` methods.





mutable.ParHashMap - mutable.HashMap

mutable.ParHashSet - mutable.HashSet

immutable.ParHashMap - immutable.HashMap

immutable.ParHashSet - immutable.HashSet

ParCtrie - Ctrie


operation complexity table
