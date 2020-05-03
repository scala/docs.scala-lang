---
layout: multipage-overview
title: Trait Iterable
partof: collections-213
overview-name: Collections

num: 4
previous-page: overview
next-page: seqs

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

At the top of the collection hierarchy is trait `Iterable`. All methods in this trait are defined in terms of an abstract method, `iterator`, which yields the collection's elements one by one.

    def iterator: Iterator[A]

Collection classes that implement `Iterable` just need to define this method; all other methods can be inherited from `Iterable`.

`Iterable` also defines many concrete methods, which are all listed in the following table. These methods fall into the following categories:

* **Addition**, `concat`, which appends two collections together, or appends all elements of an iterator to a collection.
* **Map** operations `map`, `flatMap`, and `collect`, which produce a new collection by applying some function to collection elements.
* **Conversions** `to`, `toList`, `toVector`, `toMap`, `toSet`, `toSeq`, `toIndexedSeq`, `toBuffer`, `toArray` which turn an `Iterable` collection into something more specific. If the destination is a mutable collection(`to(collection.mutable.X)`, `toArray`, `toBuffer`), a new collection is created by copying the original elements. All these conversions return their receiver argument unchanged if the run-time type of the collection already matches the demanded collection type. For instance, applying `toList` to a list will yield the list itself.
* **Copying operations**  `copyToArray`. As its name implies, this copies collection elements to an array.
* **Size info** operations `isEmpty`, `nonEmpty`, `size`, `knownSize`, `sizeIs`. The number of elements of a collections can require a traversal in some cases (e.g. `List`). In other cases the collection can have an infinite number of elements (e.g. `LazyList.from(1)`).
* **Element retrieval** operations `head`, `last`, `headOption`, `lastOption`, and `find`. These select the first or last element of a collection, or else the first element matching a condition. Note, however, that not all collections have a well-defined meaning of what "first" and "last" means. For instance, a hash set might store elements according to their hash keys, which might change from run to run. In that case, the "first" element of a hash set could also be different for every run of a program. A collection is _ordered_ if it always yields its elements in the same order. Most collections are ordered, but some (_e.g._ hash sets) are not-- dropping the ordering gives a little bit of extra efficiency. Ordering is often essential to give reproducible tests and to help in debugging. That's why Scala collections give ordered alternatives for all collection types. For instance, the ordered alternative for `HashSet` is `LinkedHashSet`.
* **Sub-collection retrieval operations** `tail`, `init`, `slice`, `take`, `drop`, `takeWhile`, `dropWhile`, `filter`, `filterNot`, `withFilter`. These all return some sub-collection identified by an index range or some predicate.
* **Subdivision operations** `splitAt`, `span`, `partition`, `partitionMap`, `groupBy`, `groupMap`, `groupMapReduce`, which split the elements of this collection into several sub-collections.
* **Element tests** `exists`, `forall`, `count` which test collection elements with a given predicate.
* **Folds** `foldLeft`, `foldRight`, `reduceLeft`, `reduceRight` which apply a binary operation to successive elements.
* **Specific folds** `sum`, `product`, `min`, `max`, which work on collections of specific types (numeric or comparable).
* **String** operations `mkString`, `addString`, `className`, which give alternative ways of converting a collection to a string.
* **View** operation: A view is a collection that's evaluated lazily. You'll learn more about views in [later](views.html).

Two more methods exist in `Iterable` that return iterators: `grouped` and `sliding`. These iterators, however, do not return single elements but whole subsequences of elements of the original collection. The maximal size of these subsequences is given as an argument to these methods. The `grouped` method returns its elements in "chunked" increments, where `sliding` yields a sliding "window" over the elements. The difference between the two should become clear by looking at the following REPL interaction:

    scala> val xs = List(1, 2, 3, 4, 5)
    xs: List[Int] = List(1, 2, 3, 4, 5)
    scala> val git = xs grouped 3
    git: Iterator[List[Int]] = non-empty iterator
    scala> git.next()
    res3: List[Int] = List(1, 2, 3)
    scala> git.next()
    res4: List[Int] = List(4, 5)
    scala> val sit = xs sliding 3
    sit: Iterator[List[Int]] = non-empty iterator
    scala> sit.next()
    res5: List[Int] = List(1, 2, 3)
    scala> sit.next()
    res6: List[Int] = List(2, 3, 4)
    scala> sit.next()
    res7: List[Int] = List(3, 4, 5)

### Operations in Class Iterable ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Abstract Method:**     |						     |
|  `xs.iterator`	    |An `iterator` that yields every element in `xs`.|
|  **Other Iterators:**     |						     |
|  `xs foreach f`	    |Executes function `f` for every element of `xs`.|
|  `xs grouped size`   	    |An iterator that yields fixed-sized "chunks" of this collection.|
|  `xs sliding size`   	    |An iterator that yields a sliding fixed-sized window of elements in this collection.|
|  **Addition:**     	    |						     |
|  `xs concat ys`<br>(or `xs ++ ys`)	    |A collection consisting of the elements of both `xs` and `ys`. `ys` is a [IterableOnce](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/IterableOnce.html) collection, i.e., either an [Iterable](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterable.html) or an [Iterator](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html).|
|  **Maps:**     	    |						     |
|  `xs map f`		    |The collection obtained from applying the function f to every element in `xs`.|
|  `xs flatMap f`	    |The collection obtained from applying the collection-valued function `f` to every element in `xs` and concatenating the results.|
|  `xs collect f`	    |The collection obtained from applying the partial function `f` to every element in `xs` for which it is defined and collecting the results.|
|  **Conversions:**         |						     |
|  `xs.to(SortedSet)`       | Generic conversion operation that takes a collection factory as parameter. |
|  `xs.toList`	    	    |Converts the collection to a list.		     |
|  `xs.toVector`          |Converts the collection to a vector.	     |
|  `xs.toMap`	    	    |Converts the collection of key/value pairs to a map. If the collection does not have pairs as elements, calling this operation results in a static type error.|
|  `xs.toSet`	    	    |Converts the collection to a set.		     |
|  `xs.toSeq`	    	    |Converts the collection to a sequence.	     |
|  `xs.toIndexedSeq`   	    |Converts the collection to an indexed sequence. |
|  `xs.toBuffer`        |Converts the collection to a buffer.	     |
|  `xs.toArray`	    	    |Converts the collection to an array.	     |
|  **Copying:**             |						     |
|  `xs copyToArray(arr, s, n)`|Copies at most `n` elements of the collection to array `arr` starting at index `s`. The last two arguments are optional.|
|  **Size info:**           |						     |
|  `xs.isEmpty`	    	    |Tests whether the collection is empty.	     |
|  `xs.nonEmpty`    	    |Tests whether the collection contains elements. |
|  `xs.size`	    	    |The number of elements in the collection.	     |
|  `xs.knownSize`	    	    |The number of elements, if this one takes constant time to compute, otherwise `-1`.	     |
|  `xs.sizeCompare(ys)`	    |Returns a negative value if `xs` is shorter than the `ys` collection, a positive value if it is longer, and `0` if they have the same size. Works even if the collection is infinite, for example `LazyList.from(1) sizeCompare List(1, 2)` returns a positive value.	     |
|  `xs.sizeCompare(n)`	    |Returns a negative value if `xs` is shorter than `n`, a positive value if it is longer, and `0` if it is of size `n`. Works even if the collection is infinite, for example `LazyList.from(1) sizeCompare 42` returns a positive value.	     |
|  `xs.sizeIs < 42`, `xs.sizeIs != 42`, etc.  |Provides a more convenient syntax for `xs.sizeCompare(42) < 0`, `xs.sizeCompare(42) != 0`, etc., respectively.|
|  **Element Retrieval:**   |						     |
|  `xs.head`	    	    |The first element of the collection (or, some element, if no order is defined).|
|  `xs.headOption`	    |The first element of `xs` in an option value, or None if `xs` is empty.|
|  `xs.last`	    	    |The last element of the collection (or, some element, if no order is defined).|
|  `xs.lastOption`	    |The last element of `xs` in an option value, or None if `xs` is empty.|
|  `xs find p`	    	    |An option containing the first element in `xs` that satisfies `p`, or `None` if no element qualifies.|
|  **Subcollections:**      |						     |
|  `xs.tail`	    	    |The rest of the collection except `xs.head`.    |
|  `xs.init`	    	    |The rest of the collection except `xs.last`.    |
|  `xs.slice(from, to)`    |A collection consisting of elements in some index range of `xs` (from `from` up to, and excluding `to`).|
|  `xs take n`	    	    |A collection consisting of the first `n` elements of `xs` (or, some arbitrary `n` elements, if no order is defined).|
|  `xs drop n`	    	    |The rest of the collection except `xs take n`.|
|  `xs takeWhile p`	    |The longest prefix of elements in the collection that all satisfy `p`.|
|  `xs dropWhile p`	    |The collection without the longest prefix of elements that all satisfy `p`.|
|  `xs takeRight n`	    |A collection consisting of the last `n` elements of `xs` (or, some arbitrary `n` elements, if no order is defined).|
|  `xs dropRight n`	    |The rest of the collection except `xs takeRight n`.|
|  `xs filter p`	    |The collection consisting of those elements of xs that satisfy the predicate `p`.|
|  `xs withFilter p`	    |A non-strict filter of this collection. Subsequent calls to `map`, `flatMap`, `foreach`, and `withFilter` will only apply to those elements of `xs` for which the condition `p` is true.|
|  `xs filterNot p`	    |The collection consisting of those elements of `xs` that do not satisfy the predicate `p`.|
|  **Subdivisions:**        |						     |
|  `xs splitAt n`	    |Split `xs` at a position, giving the pair of collections `(xs take n, xs drop n)`.|
|  `xs span p`	    	    |Split `xs` according to a predicate, giving the pair of collections `(xs takeWhile p, xs.dropWhile p)`.|
|  `xs partition p`	    |Split `xs` into a pair of collections; one with elements that satisfy the predicate `p`, the other with elements that do not, giving the pair of collections `(xs filter p, xs.filterNot p)`|
|  `xs groupBy f`	    |Partition `xs` into a map of collections according to a discriminator function `f`.|
|  `xs.groupMap(f)(g)`|Partition `xs` into a map of collections according to a discriminator function `f`, and applies the transformation function `g` to each element in a group.|
|  `xs.groupMapReduce(f)(g)(h)`|Partition `xs` according to a discriminator function `f`, and then combine the results of applying the function `g` to each element in a group using the `h` function.|
|  **Element Conditions:**  |						     |
|  `xs forall p`	    |A boolean indicating whether the predicate `p` holds for all elements of `xs`.|
|  `xs exists p`	    |A boolean indicating whether the predicate `p` holds for some element in `xs`.|
|  `xs count p`	    	    |The number of elements in `xs` that satisfy the predicate `p`.|
|  **Folds:** 		    |						     |
|  `xs.foldLeft(z)(op)`	    |Apply binary operation `op` between successive elements of `xs`, going left to right and starting with `z`.|
|  `xs.foldRight(z)(op)`	    |Apply binary operation `op` between successive elements of `xs`, going right to left and ending with `z`.|
|  `xs reduceLeft op`	    |Apply binary operation `op` between successive elements of non-empty collection `xs`, going left to right.|
|  `xs reduceRight op`	    |Apply binary operation `op` between successive elements of non-empty collection `xs`, going right to left.|
|  **Specific Folds:**      |						     |
|  `xs.sum`	    	    |The sum of the numeric element values of collection `xs`.|
|  `xs.product`	    	    |The product of the numeric element values of collection `xs`.|
|  `xs.min`	    	    |The minimum of the ordered element values of collection `xs`.|
|  `xs.max`	    	    |The maximum of the ordered element values of collection `xs`.|
|  `xs.minOption`	    |Like `min` but returns `None` if `xs` is empty.|
|  `xs.maxOption`	    |Like `max` but returns `None` if `xs` is empty.|
|  **Strings:**             |						     |
|  `xs.addString(b, start, sep, end)`|Adds a string to `StringBuilder` `b` that shows all elements of `xs` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional.|
|  `xs.mkString(start, sep, end)`|Converts the collection to a string that shows all elements of `xs` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional.|
|  `xs.stringPrefix`	    |The collection name at the beginning of the string returned from `xs.toString`.|
|  **Zippers:** 	    |						     |
|  `xs zip ys`	    	    |A collection of pairs of corresponding elements from `xs` and `ys`.|
|  `xs.zipAll(ys, x, y)`   |A collection of pairs of corresponding elements from `xs` and `ys`, where the shorter sequence is extended to match the longer one by appending elements `x` or `y`.|
|  `xs.zipWithIndex`	    |An collection of pairs of elements from `xs` with their indices.|
|  **Views:**               |						     |
|  `xs.view`	    	    |Produces a view over `xs`.|

In the inheritance hierarchy below `Iterable` you find three traits: [Seq](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Seq.html), [Set](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Set.html), and [Map](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Map.html). `Seq` and `Map` implement the [PartialFunction](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/PartialFunction.html) trait with its `apply` and `isDefinedAt` methods, each implemented differently. `Set` gets its `apply` method from [SetOps](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/SetOps.html).

For sequences, `apply` is positional indexing, where elements are always numbered from `0`. That is, `Seq(1, 2, 3)(1)` gives `2`. For sets, `apply` is a membership test. For instance, `Set('a', 'b', 'c')('b')` gives `true` whereas `Set()('a')` gives `false`. Finally for maps, `apply` is a selection. For instance, `Map('a' -> 1, 'b' -> 10, 'c' -> 100)('b')` gives `10`.

In the following, we will explain each of the three kinds of collections in more detail.
