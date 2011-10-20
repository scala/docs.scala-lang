---
layout: overview
title: Scala's Collections Library
disqus: true
---

**Martin Odersky, and Lex Spoon**
  
In the eyes of many, the new collections framework is the most significant
change in the Scala 2.8 release. Scala had collections before (and in fact the new
framework is largely compatible with them). But it's only 2.8 that
provides a common, uniform, and all-encompassing framework for
collection types.

Even though the additions to collections are subtle at first glance,
the changes they can provoke in your programming style can be
profound.  In fact, quite often it's as if you work on a higher-level
with the basic building blocks of a program being whole collections
instead of their elements. This new style of programming requires some
adaptation. Fortunately, the adaptation is helped by several nice
properties of the new Scala collections. They are easy to use,
concise, safe, fast, universal.

**Easy to use:** A small vocabulary of 20-50 methods is
enough to solve most collection problems in a couple of operations. No
need to wrap your head around complicated looping structures or
recursions. Persistent collections and side-effect-free operations mean
that you need not worry about accidentally corrupting existing
collections with new data.  Interference between iterators and
collection updates is eliminated.

**Concise:** You can achieve with a single word what used to
take one or several loops. You can express functional operations with
lightweight syntax and combine operations effortlessly, so that the result
feels like a custom algebra.  

**Safe:** This one has to be experienced to sink in. The
statically typed and functional nature of Scala's collections means
that the overwhelming majority of errors you might make are caught at
compile-time. The reason is that (1) the collection operations
themselves are heavily used and therefore well
tested. (2) the usages of the collection operation make inputs and
output explicit as function parameters and results. (3) These explicit
inputs and outputs are subject to static type checking. The bottom line
is that the large majority of misuses will manifest themselves as type
errors. It's not at all uncommon to have programs of several hundred
lines run at first try.

**Fast:** Collection operations are tuned and optimized in the
libraries. As a result, using collections is typically quite
efficient. You might be able to do a little bit better with carefully
hand-tuned data structures and operations, but you might also do a lot
worse by making some suboptimal implementation decisions along the
way.  What's more, collections have been recently adapted to parallel
execution on multi-cores. Parallel collections support the same
operations as sequential ones, so no new operations need to be learned
and no code needs to be rewritten. You can turn a sequential collection into a
parallel one simply by invoking the `par` method.

**Universal:** Collections provide the same operations on
any type where it makes sense to do so. So you can achieve a lot with
a fairly small vocabulary of operations. For instance, a string is
conceptually a sequence of characters. Consequently, in Scala
collections, strings support all sequence operations. The same holds
for arrays.

**Example:** Here's one line of code that demonstrates many of the 
advantages of Scala's collections.

    val (minors, adults) = people partition (_.age < 18)

It's immediately clear what this operation does: It partitions a
collection of `people` into `minors` and `adults` depending on
their age. Because the `partition` method is defined in the root
collection type `TraversableLike`, this code works for any kind of
collection, including arrays. The resulting `minors` and `adults`
collections will be of the same type as the `people` collection.

This code is much more concise than the one to three loops required for
traditional collection processing (three loops for an array, because
the intermediate results need to be buffered somewhere else).  Once
you have learned the basic collection vocabulary you will also find
writing this code is much easier and safer than writing explicit
loops. Furthermore, the `partition` operation is quite fast, and will
get even faster on parallel collections on multi-cores.  (Parallel
collections have been released
as part of Scala 2.9.)

This document provides an in depth discussion of the APIs of the
Scala collections classes from a user perspective.  They take you on
a tour of all the fundamental classes and the methods they define.


## Mutable and Immutable Collections ##

Scala collections systematically distinguish between mutable and
immutable collections. A _mutable_ collection can be updated or
extended in place. This means you can change, add, or remove elements
of a collection as a side effect. _Immutable_ collections, by
contrast, never change. You have still operations that simulate
additions, removals, or updates, but those operations will in each
case return a new collection and leave the old collection unchanged.

All collection classes are found in the package `scala.collection` or
one of its sub-packages `mutable`, `immutable`, and `generic`.  Most
collection classes needed by client code exist in three variants,
which are located in packages `scala.collection`,
`scala.collection.immutable`, and `scala.collection.mutable`,
respectively.  Each variant has different characteristics with respect
to mutability.

A collection in package `scala.collection.immutable` is guaranteed to
be immutable for everyone. Such a collection will never change after
it is created.  Therefore, you can rely on the fact that accessing the
same collection value repeatedly at different points in time will
always yield a collection with the same elements.

A collection in package `scala.collection.mutable` is known to have
some operations that change the collection in place. So dealing with
mutable collection means you need to understand which code changes
which collection when.

A collection in package `scala.collection` can be either mutable or
immutable. For instance, [collection.IndexedSeq\[T\]](http://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html)
is a superclass of both [collection.immutable.IndexedSeq\[T\]](http://www.scala-lang.org/api/current/scala/collection/immutable/IndexedSeq.html)
and
[collection.mutable.IndexedSeq\[T\]](http://www.scala-lang.org/api/current/scala/collection/mutable/IndexedSeq.html)
Generally, the root collections in
package `scala.collection` define the same interface as the immutable
collections, and the mutable collections in package
`scala.collection.mutable` typically add some side-effecting
modification operations to this immutable interface.

The difference between root collections and immutable collections is
that clients of an immutable collection have a guarantee that nobody
can mutate the collection, whereas clients of a root collection only
promise not to change the collection themselves. Even though the
static type of such a collection provides no operations for modifying
the collection, it might still be possible that the run-time type is a
mutable collection which can be changed by other clients.

By default, Scala always picks immutable collections. For instance, if
you just write `Set` without any prefix or without having imported
`Set` from somewhere, you get an immutable set, and if you write
`Iterable` you get an immutable iterable collection, because these
are the default bindings imported from the `scala` package. To get
the mutable default versions, you need to write explicitly
`collection.mutable.Set`, or `collection.mutable.Iterable`.

A useful convention if you want to use both mutable and immutable
versions of collections is to import just the package
`collection.mutable`.

    import scala.collection.mutable

Then a word like `Set` without a prefix still refers to an an immutable collection,
whereas `mutable.Set` refers to the mutable counterpart. 

The last package in the collection hierarchy is `collection.generic`. This
package contains building blocks for implementing
collections. Typically, collection classes defer the implementations
of some of their operations to classes in `generic`. Users of the
collection framework on the other hand should need to refer to
classes in `generic` only in exceptional circumstances.

For convenience and backwards compatibility some important types have
aliases in the `scala` package, so you can use them by their simple
names without needing an import. An example is the `List` type, which
can be accessed alternatively as 

    scala.collection.immutable.List   // that's where it is defined
    scala.List                        // via the alias in the  scala package
    List                              // because  scala._ 
                                      // is always automatically imported

Other types so aliased are 
[Traversable](http://www.scala-lang.org/api/current/scala/collection/Traversable.html), [Iterable](http://www.scala-lang.org/api/current/scala/collection/Iterable.html), [Seq](http://www.scala-lang.org/api/current/scala/collection/Seq.html), [IndexedSeq](http://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html), [Iterator](http://www.scala-lang.org/api/current/scala/collection/Iterator.html), [Stream](http://www.scala-lang.org/api/current/scala/collection/immutable/Stream.html), [Vector](http://www.scala-lang.org/api/current/scala/collection/immutable/Vector.html), [StringBuilder](http://www.scala-lang.org/api/current/scala/collection/mutable/StringBuilder.html), and [Range](http://www.scala-lang.org/api/current/scala/collection/immutable/Range.html).

The following figure shows all collections in package
`scala.collection`.  These are all high-level abstract classes or traits, which
generally have mutable as well as immutable implementations. 

[<img src="{{ site.baseurl }}/resources/images/collections.png" width="550">]({{ site.baseurl }}/resources/images/collections.png)

The following figure shows all collections in package `scala.collection.immutable`.

[<img src="{{ site.baseurl }}/resources/images/collections.immutable.png" width="550">]({{ site.baseurl }}/resources/images/collections.immutable.png)

And the following figure shows all collections in package `scala.collection.mutable`.

[<img src="{{ site.baseurl }}/resources/images/collections.mutable.png" width="550">]({{ site.baseurl }}/resources/images/collections.mutable.png)

(All three figures were generated by Matthias at decodified.com).

## An Overview of the Collections API ##

The most important collection classes are shown in the figure above. There is quite a bit of commonality shared by all these classes. For instance, every kind of collection can be created by the same uniform syntax, writing the collection class name followed by its elements:

    Traversable(1, 2, 3)
    Iterable("x", "y", "z")
    Map("x" -> 24, "y" -> 25, "z" -> 26)
    Set(Color.red, Color.green, Color.blue)
    SortedSet("hello", "world")
    Buffer(x, y, z)
    IndexedSeq(1.0, 2.0)
    LinearSeq(a, b, c)

The same principle also applies for specific collection implementations, such as:

    List(1, 2, 3)
    HashMap("x" -> 24, "y" -> 25, "z" -> 26)

All these collections get displayed with `toString` in the same way they are written above.

All collections support the API provided by `Traversable`, but specialize types wherever this makes sense. For instance the `map` method in class `Traversable` returns another `Traversable` as its result. But this result type is overridden in subclasses. For instance, calling `map` on a `List` yields again a `List`, calling it on a `Set` yields again a `Set` and so on.

    scala> List(1, 2, 3) map (_ + 1) 
    res0: List[Int] = List(2, 3, 4)
    scala> Set(1, 2, 3) map (_ * 2)
    res0: Set[Int] = Set(2, 4, 6)

This behavior which is implemented everywhere in the collections libraries is called the _uniform return type principle_.

Most of the classes in the collections hierarchy exist in three variants: root, mutable, and immutable. The only exception is the Buffer trait which only exists as a mutable collection.

In the following, we will review these classes one by one.

## Trait Traversable ##

At the top of the collection hierarchy is trait `Traversable`. Its only abstract operation is `foreach`:

    def foreach[U](f: Elem => U) 

Collection classes that implement `Traversable` just need to define this method; all other methods can be inherited from `Traverable`.

The `foreach` method is meant to traverse all elements of the collection, and apply the given operation, f, to each element. The type of the operation is `Elem => U`, where `Elem` is the type of the collection's elements and `U` is an arbitrary result type. The invocation of `f` is done for its side effect only; in fact any function result of f is discarded by `foreach`.

`Traversable` also defines many concrete methods, which are all listed in The following table. These methods fall into the following categories:

* **Addition**, `++`, which appends two traversables together, or appends all elements of an iterator to a traversable.
* **Map** operations `map`, `flatMap`, and `collect`, which produce a new collection by applying some function to collection elements.
* **Conversions** `toArray`, `toList`, `toIterable`, `toSeq`, `toIndexedSeq`, `toStream`, `toSet`, `toMap`, which turn a `Traversable` collection into something more specific. All these conversions return their receiver argument unchanged if the run-time type of the collection already matches the demanded collection type. For instance, applying `toList` to a list will yield the list itself.
* **Copying operations** `copyToBuffer` and `copyToArray`. As their names imply, these copy collection elements to a buffer or array, respectively.
* **Size info** operations `isEmpty`, `nonEmpty`, `size`, and `hasDefiniteSize`: Traversable collections can be finite or infinite. An example of an infinite traversable collection is the stream of natural numbers `Stream.from(0)`. The method `hasDefiniteSize` indicates whether a collection is possibly infinite. If `hasDefiniteSize` returns true, the collection is certainly finite. If it returns false, the collection has not been not fully elaborated yet, so it might be infinite or finite.
* **Element retrieval** operations `head`, `last`, `headOption`, `lastOption`, and `find`. These select the first or last element of a collection, or else the first element matching a condition. Note, however, that not all collections have a well-defined meaning of what "first" and "last" means. For instance, a hash set might store elements according to their hash keys, which might change from run to run. In that case, the "first" element of a hash set could also be different for every run of a program. A collection is _ordered_ if it always yields its elements in the same order. Most collections are ordered, but some (_e.g._ hash sets) are not-- dropping the ordering gives a little bit of extra efficiency. Ordering is often essential to give reproducible tests and to help in debugging. That's why Scala collections give ordered alternatives for all collection types. For instance, the ordered alternative for `HashSet` is `LinkedHashSet`.
* **Sub-collection retrieval operations** `tail`, `init`, `slice`, `take`, `drop`, `takeWhile`, `dropWhile`, `filter`, `filterNot`, `withFilter`. These all return some sub-collection identified by an index range or some predicate.
* **Subdivision operations** `splitAt`, `span`, `partition`, `groupBy`, which split the elements of this collection into several sub-collections.
* **Element tests** `exists`, `forall`, `count` which test collection elements with a given predicate.
* **Folds** `foldLeft`, `foldRight`, `/:`, `:\`, `reduceLeft`, `reduceRight` which apply a binary operation to successive elements.
* **Specific folds** `sum`, `product`, `min`, `max`, which work on collections of specific types (numeric or comparable).
* **String** operations `mkString`, `addString`, `stringPrefix`, which give alternative ways of converting a collection to a string.
* **View** operations, consisting of two overloaded variants of the `view` method. A view is a collection that's evaluated lazily. You'll learn more about views in [later](#Views).

### Operations in Class Traversable ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Abstract Method:**     |						     |
|  `xs foreach f`	    |Executes function `f` for every element of `xs`.|
|  **Addition:**     	    |						     |
|  `xs ++ ys`	    	    |A collection consisting of the elements of both `xs` and `ys`. `ys` is a [TraversableOnce](http://www.scala-lang.org/api/current/scala/collection/TraversableOnce.html) collection, i.e., either a [Traversable](http://www.scala-lang.org/api/current/scala/collection/Traversable.html) or an [Iterator](http://www.scala-lang.org/api/current/scala/collection/Iterator.html).|
|  **Maps:**     	    |						     |
|  `xs map f`		    |The collection obtained from applying the function f to every element in `xs`.|
|  `xs flatMap f`	    |The collection obtained from applying the collection-valued function `f` to every element in `xs` and concatenating the results.|
|  `xs collect f`	    |The collection obtained from applying the partial function `f` to every element in `xs` for which it is defined and collecting the results.|
|  **Conversions:**         |						     |
|  `xs.toArray`	    	    |Converts the collection to an array.	     |
|  `xs.toList`	    	    |Converts the collection to a list.		     |
|  `xs.toIterable`    	    |Converts the collection to an iterable.	     |
|  `xs.toSeq`	    	    |Converts the collection to a sequence.	     |
|  `xs.toIndexedSeq`   	    |Converts the collection to an indexed sequence. |
|  `xs.toStream`    	    |Converts the collection to a lazily computed stream.|
|  `xs.toSet`	    	    |Converts the collection to a set.		     |
|  `xs.toMap`	    	    |Converts the collection of key/value pairs to a map. If the collection does not have pairs as elements, calling this operation results in a static type error.|
|  **Copying:**             |						     |
|  `xs copyToBuffer buf`    |Copies all elements of the collection to buffer `buf`.|
|  `xs copyToArray(arr, s, n)`|Copies at most `n` elements of the collection to array `arr` starting at index `s`. The last two arguments are optional.|
|  **Size info:**           |						     |
|  `xs.isEmpty`	    	    |Tests whether the collection is empty.	     |
|  `xs.nonEmpty`    	    |Tests whether the collection contains elements. |
|  `xs.size`	    	    |The number of elements in the collection.	     |
|  `xs.hasDefiniteSize`	    |True if `xs` is known to have finite size.	     |
|  **Element Retrieval:**   |						     |
|  `xs.head`	    	    |The first element of the collection (or, some element, if no order is defined).|
|  `xs.headOption`	    |The first element of `xs` in an option value, or None if `xs` is empty.|
|  `xs.last`	    	    |The last element of the collection (or, some element, if no order is defined).|
|  `xs.lastOption`	    |The last element of `xs` in an option value, or None if `xs` is empty.|
|  `xs find p`	    	    |An option containing the first element in `xs` that satisfies `p`, or `None` is no element qualifies.|
|  **Subcollections:**      |						     |
|  `xs.tail`	    	    |The rest of the collection except `xs.head`.    |
|  `xs.init`	    	    |The rest of the collection except `xs.last`.    |
|  `xs slice (from, to)`    |A collection consisting of elements in some index range of `xs` (from `from` up to, and excluding `to`).|
|  `xs take n`	    	    |A collection consisting of the first `n` elements of `xs` (or, some arbitrary `n` elements, if no order is defined).|
|  `xs drop n`	    	    |The rest of the collection except `xs take n`.|
|  `xs takeWhile p`	    |The longest prefix of elements in the collection that all satisfy `p`.|
|  `xs dropWhile p`	    |The collection without the longest prefix of elements that all satisfy `p`.|
|  `xs filter p`	    |The collection consisting of those elements of xs that satisfy the predicate `p`.|
|  `xs withFilter p`	    |A non-strict filter of this collection. Subsequent calls to `map`, `flatMap`, `foreach`, and `withFilter` will only apply to those elements of `xs` for which the condition `p` is true.|
|  `xs filterNot p`	    |The collection consisting of those elements of `xs` that do not satisfy the predicate `p`.|
|  **Subdivisions:**        |						     |
|  `xs splitAt n`	    |Split `xs` at a position, giving the pair of collections `(xs take n, xs drop n)`.|
|  `xs span p`	    	    |Split `xs` according to a predicate, giving the pair of collections `(xs takeWhile p, xs.dropWhile p)`.|
|  `xs partition p`	    |Split `xs` into a pair of two collections; one with elements that satisfy the predicate `p`, the other with elements that do not, giving the pair of collections `(xs filter p, xs.filterNot p)`|
|  `xs groupBy f`	    |Partition `xs` into a map of collections according to a discriminator function `f`.|
|  **Element Conditions:**  |						     |
|  `xs forall p`	    |A boolean indicating whether the predicate `p` holds for all elements of `xs`.|
|  `xs exists p`	    |A boolean indicating whether the predicate `p` holds for some element in `xs`.|
|  `xs count p`	    	    |The number of elements in `xs` that satisfy the predicate `p`.|
|  **Folds:** 		    |						     |
|  `(z /: xs)(op)`	    |Apply binary operation `op` between successive elements of `xs`, going left to right and starting with `z`.|
|  `(xs :\ z)(op)`	    |Apply binary operation `op` between successive elements of `xs`, going right to left and starting with `z`.|
|  `xs.foldLeft(z)(op)`	    |Same as `(z /: xs)(op)`.|
|  `xs.foldRight(z)(op)`    |Same as `(xs :\ z)(op)`.|
|  `xs reduceLeft op`	    |Apply binary operation `op` between successive elements of non-empty collection `xs`, going left to right.|
|  `xs reduceRight op`	    |Apply binary operation `op` between successive elements of non-empty collection `xs`, going right to left.|
|  **Specific Folds:**      |						     |
|  `xs.sum`	    	    |The sum of the numeric element values of collection `xs`.|
|  `xs.product`	    	    |The product of the numeric element values of collection `xs`.|
|  `xs.min`	    	    |The minimum of the ordered element values of collection `xs`.|
|  `xs.max`	    	    |The maximum of the ordered element values of collection `xs`.|
|  **Strings:**             |						     |
|  `xs addString (b, start, sep, end)`|Adds a string to `StringBuilder` `b` that shows all elements of `xs` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional.|
|  `xs mkString (start, sep, end)`|Converts the collection to a string that shows all elements of `xs` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional.|
|  `xs.stringPrefix`	    |The collection name at the beginning of the string returned from `xs.toString`.|
|  **Views:**               |						     |
|  `xs.view`	    	    |Produces a view over `xs`.|
|  `xs view (from, to)`     |Produces a view that represents the elements in some index range of `xs`.|

## Trait Iterable ##

The next trait from the top in the collections hierarchy is `Iterable`. All methods in this trait are defined in terms of an an abstract method, `iterator`, which yields the collection's elements one by one. The `foreach` method from trait `Traversable` is implemented in `Iterable` in terms of `iterator`. Here is the actual implementation:

    def foreach[U](f: Elem => U): Unit = {
      val it = iterator
      while (it.hasNext) f(it.next())
    } 

Quite a few subclasses of `Iterable` override this standard implementation of foreach in `Iterable`, because they can provide a more efficient implementation. Remember that `foreach` is the basis of the implementation of all operations in `Traversable`, so its performance matters.

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

Trait `Iterable` also adds some other methods to `Traversable` that can be implemented efficiently only if an iterator is available. They are summarized in the following table.

### Operations in Class Iterable ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Abstract Method:**     |						     |
|  `xs.iterator`	    |An `iterator` that yields every element in `xs`, in the same order as `foreach` traverses elements.|
|  **Other Iterators:**     |						     |
|  `xs grouped size`   	    |An iterator that yields fixed-sized "chunks" of this collection.|
|  `xs sliding size`   	    |An iterator that yields a sliding fixed-sized window of elements in this collection.|
|  **Subcollections:** 	    |						     |
|  `xs takeRight n`	    |A collection consisting of the last `n` elements of `xs` (or, some arbitrary `n` elements, if no order is defined).|
|  `xs dropRight n`	    |The rest of the collection except `xs takeRight n`.|
|  **Zippers:** 	    |						     |
|  `xs zip ys`	    	    |An iterable of pairs of corresponding elements from `xs` and `ys`.|
|  `xs zipAll (ys, x, y)`   |An iterable of pairs of corresponding elements from `xs` and `ys`, where the shorter sequence is extended to match the longer one by appending elements `x` or `y`.|
|  `xs.zipWithIndex`	    |An iterable of pairs of elements from `xs` with their indices.|
|  **Comparison:** 	    |						     |
|  `xs sameElements ys`	    |A test whether `xs` and `ys` contain the same elements in the same order|

In the inheritance hierarchy below Iterable you find three traits: [Seq](http://www.scala-lang.org/docu/files/collections-api/collections_5.html), [Set](http://www.scala-lang.org/docu/files/collections-api/collections_7.html), and [Map](http://www.scala-lang.org/docu/files/collections-api/collections_10.html). A common aspect of these three traits is that they all implement the [PartialFunction](http://www.scala-lang.org/api/current/scala/PartialFunction.html) trait with its `apply` and `isDefinedAt` methods. However, the way each trait implements [PartialFunction](http://www.scala-lang.org/api/current/scala/PartialFunction.html) differs.

For sequences, `apply` is positional indexing, where elements are always numbered from `0`. That is, `Seq(1, 2, 3)(1)` gives `2`. For sets, `apply` is a membership test. For instance, `Set('a', 'b', 'c')('b')` gives `true` whereas `Set()('a')` gives `false`. Finally for maps, `apply` is a selection. For instance, `Map('a' -> 1, 'b' -> 10, 'c' -> 100)('b')` gives `10`.

In the following, we will explain each of the three kinds of collections in more detail.

## The sequence traits Seq, IndexedSeq, and LinearSeq ##

The [Seq](http://www.scala-lang.org/api/current/scala/collection/Seq.html) trait represents sequences. A sequence is a kind of iterable that has a `length` and whose elements have fixed index positions, starting from `0`.

The operations on sequences, summarized in the table below, fall into the following categories:

* **Indexing and length** operations `apply`, `isDefinedAt`, `length`, `indices`, and `lengthCompare`. For a `Seq`, the `apply` operation means indexing; hence a sequence of type `Seq[T]` is a partial function that takes an `Int` argument (an index) and which yields a sequence element of type `T`. In other words `Seq[T]` extends `PartialFunction[Int, T]`. The elements of a sequence are indexed from zero up to the `length` of the sequence minus one. The `length` method on sequences is an alias of the `size` method of general collections. The `lengthCompare` method allows you to compare the lengths of two sequences even if one of the sequences has infinite length.
* **Index search operations** `indexOf`, `lastIndexOf`, `indexofSlice`, `lastIndexOfSlice`, `indexWhere`, `lastIndexWhere`, `segmentLength`, `prefixLength`, which return the index of an element equal to a given value or matching some predicate.
* **Addition operations** `+:`, `:+`, `padTo`, which return new sequences obtained by adding elements at the front or the end of a sequence.
* **Update operations** `updated`, `patch`, which return a new sequence obtained by replacing some elements of the original sequence.
* **Sorting operations** `sorted`, `sortWith`, `sortBy`, which sort sequence elements according to various criteria.
* **Reversal operations** `reverse`, `reverseIterator`, `reverseMap`, which yield or process sequence elements in reverse order.
* **Comparisons** `startsWith`, `endsWith`, `contains`, `containsSlice`, `corresponds`, which relate two sequences or search an element in a sequence.
* **Multiset** operations `intersect`, `diff`, `union`, `distinct`, which perform set-like operations on the elements of two sequences or remove duplicates.

If a sequence is mutable, it offers in addition a side-effecting `update` method, which lets sequence elements be updated. As always in Scala, syntax like `seq(idx) = elem` is just a shorthand for `seq.update(idx, elem)`, so `update` gives convenient assignment syntax for free. Note the difference between `update` and `updated`. `update` changes a sequence element in place, and is only available for mutable sequences. `updated` is available for all sequences and always returns a new sequence instead of modifying the original.

### Operations in Class Seq ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Indexing and Length:** |						     |
|  `xs(i)`    	  	    |(or, written out, `xs apply i`). The element of `xs` at index `i`.|
|  `xs isDefinedAt i`	    |Tests whether `i` is contained in `xs.indices`.|
|  `xs.length`	    	    |The length of the sequence (same as `size`).|
|  `xs.lengthCompare ys`    |Returns `-1` if `xs` is shorter than `ys`, `+1` if it is longer, and `0` is they have the same length. Works even if one if the sequences is infinite.|
|  `xs.indices`	     	    |The index range of `xs`, extending from `0` to `xs.length - 1`.|
|  **Index Search:**        |						     |
|  `xs indexOf x`   	    |The index of the first element in `xs` equal to `x` (several variants exist).|
|  `xs lastIndexOf x`       |The index of the last element in `xs` equal to `x` (several variants exist).|
|  `xs indexOfSlice ys`     |The first index of `xs` such that successive elements starting from that index form the sequence `ys`.|
|  `xs lastIndexOfSlice ys` |The last index of `xs` such that successive elements starting from that index form the sequence `ys`.|
|  `xs indexWhere p`   	    |The index of the first element in xs that satisfies `p` (several variants exist).|
|  `xs segmentLength (p, i)`|The length of the longest uninterrupted segment of elements in `xs`, starting with `xs(i)`, that all satisfy the predicate `p`.|
|  `xs prefixLength p` 	    |The length of the longest prefix of elements in `xs` that all satisfy the predicate `p`.|
|  **Additions:** 	    |						     |
|  `x +: xs` 	    	    |A new sequence that consists of `x` prepended to `xs`.|
|  `xs :+ x` 	    	    |A new sequence that consists of `x` appended to `xs`.|
|  `xs padTo (len, x)` 	    |The sequence resulting from appending the value `x` to `xs` until length `len` is reached.|
|  **Updates:** 	    |						     |
|  `xs patch (i, ys, r)`    |The sequence resulting from replacing `r` elements of `xs` starting with `i` by the patch `ys`.|
|  `xs updated (i, x)`      |A copy of `xs` with the element at index `i` replaced by `x`.|
|  `xs(i) = x`	    	    |(or, written out, `xs.update(i, x)`, only available for `mutable.Seq`s). Changes the element of `xs` at index `i` to `y`.|
|  **Sorting:** 	    |						     |
|  `xs.sorted`	            |A new sequence obtained by sorting the elements of `xs` using the standard ordering of the element type of `xs`.|
|  `xs sortWith lt`	    |A new sequence obtained by sorting the elements of `xs` using `lt` as comparison operation.|
|  `xs sortBy f`	    |A new sequence obtained by sorting the elements of `xs`. Comparison between two elements proceeds by mapping the function `f` over both and comparing the results.|
|  **Reversals:** 	    |						     |
|  `xs.reverse`	            |A sequence with the elements of `xs` in reverse order.|
|  `xs.reverseIterator`	    |An iterator yielding all the elements of `xs` in reverse order.|
|  `xs reverseMap f`	    |A sequence obtained by mapping `f` over the elements of `xs` in reverse order.|
|  **Comparisons:** 	    |						     |
|  `xs startsWith ys`	    |Tests whether `xs` starts with sequence `ys` (several variants exist).|
|  `xs endsWith ys`	    |Tests whether `xs` ends with sequence `ys` (several variants exist).|
|  `xs contains x`	    |Tests whether `xs` has an element equal to `x`.|
|  `xs containsSlice ys`    |Tests whether `xs` has a contiguous subsequence equal to `ys`.|
|  `(xs corresponds ys)(p)` |Tests whether corresponding elements of `xs` and `ys` satisfy the binary predicate `p`.|
|  **Multiset Operations:** |						     |
|  `xs intersect ys`	    |The multi-set intersection of sequences `xs` and `ys` that preserves the order of elements in `xs`.|
|  `xs diff ys`	    	    |The multi-set difference of sequences `xs` and `ys` that preserves the order of elements in `xs`.|
|  `xs union ys`	    |Multiset union; same as `xs ++ ys`.|
|  `xs.distinct`	    |A subsequence of `xs` that contains no duplicated element.|

Trait [Seq](http://www.scala-lang.org/api/current/scala/collection/Seq.html) has two subtraits [LinearSeq](http://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html), and [IndexedSeq](http://www.scala-lang.org/api/current/scala/collection/IndexedSeq.html). These do not add any new operations, but each offers different performance characteristics: A linear sequence has efficient `head` and `tail` operations, whereas an indexed sequence has efficient `apply`, `length`, and (if mutable) `update` operations. Frequently used linear sequences are `scala.collection.immutable.List` and `scala.collection.immutable.Stream`. Frequently used indexed sequences are `scala.Array` and `scala.collection.mutable.ArrayBuffer`. The `Vector` class provides an interesting compromise between indexed and linear access. It has both effectively constant time indexing overhead and constant time linear access overhead. Because of this, vectors are a good foundation for mixed access patterns where both indexed and linear accesses are used. You'll learn more on vectors [later](#vectors).

## Sets ##

`Set`s are `Iterable`s that contain no duplicate elements. The operations on sets are summarized in the following table for general sets and in the table after that for mutable sets. They fall into the following categories:

* **Tests** `contains`, `apply`, `subsetOf`. The `contains` method asks whether a set contains a given element. The `apply` method for a set is the same as `contains`, so `set(elem)` is the same as `set contains elem`. That means sets can also be used as test functions that return true for the elements they contain. 

For example


    val fruit = Set("apple", "orange", "peach", "banana")
    fruit: scala.collection.immutable.Set[java.lang.String] = 
    Set(apple, orange, peach, banana)
    scala> fruit("peach")
    res0: Boolean = true
    scala> fruit("potato")
    res1: Boolean = false


* **Additions** `+` and `++`, which add one or more elements to a set, yielding a new set.
* **Removals** `-`, `--`, which remove one or more elements from a set, yielding a new set.
* **Set operations** for union, intersection, and set difference. Each of these operations exists in two forms: alphabetic and symbolic. The alphabetic versions are `intersect`, `union`, and `diff`, whereas the symbolic versions are `&`, `|`, and `&~`. In fact, the `++` that Set inherits from `Traversable` can be seen as yet another alias of `union` or `|`, except that `++` takes a `Traversable` argument whereas `union` and `|` take sets.

### Operations in Class Set ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Tests:**               |						     |
|  `xs contains x`  	    |Tests whether `x` is an element of `xs`.        |
|  `xs(x)`        	    |Same as `xs contains x`.                        |
|  `xs subsetOf ys`  	    |Tests whether `xs` is a subset of `ys`.         |
|  **Additions:**           |						     |
|  `xs + x`                 |The set containing all elements of `xs` as well as `x`.|
|  `xs + (x, y, z)`         |The set containing all elements of `xs` as well as the given additional elements.|
|  `xs ++ ys`  	            |The set containing all elements of `xs` as well as all elements of `ys`.|
|  **Tests:**               |						     |
|  `xs - x`  	            |The set containing all elements of `xs` except `x`.|
|  `xs - (x, y, z)`         |The set containing all elements of `xs` except the given elements.|
|  `xs -- ys`  	            |The set containing all elements of `xs` except the elements of `ys`.|
|  `xs.empty`  	            |An empty set of the same class as `xs`.         |
|  **Binary Operations:**   |						     |
|  `xs & ys`  	            |The set intersection of `xs` and `ys`.          |
|  `xs intersect ys`        |Same as `xs & ys`.                              |
|  `xs | ys`  	            |The set union of `xs` and `ys`.                 |
|  `xs union ys`  	    |Same as `xs | ys`.                              |
|  `xs &~ ys`  	            |The set difference of `xs` and `ys`.            |
|  `xs diff ys`  	    |Same as `xs &~ ys`.                             |

Mutable sets offer in addition methods to add, remove, or update elements, which are summarized in below.

### Operations in Class mutable.Set ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Additions:**           |						     |
|  `xs += x`  	            |Adds element `x` to set `xs` as a side effect and returns `xs` itself.|
|  `xs += (x, y, z)`        |Adds the given elements to set `xs` as a side effect and returns `xs` itself.|
|  `xs ++= ys`  	    |Adds all elements in `ys` to set `xs` as a side effect and returns `xs` itself.|
|  `xs add x`  	            |Adds element `x` to `xs` and returns `true` if `x` was not previously contained in the set, `false` if it was.|
|  **Removals:**            |						     |
|  `xs -= x`  	            |Removes element `x` from set `xs` as a side effect and returns `xs` itself.|
|  `xs -= (x, y, z)`  	    |Removes the given elements from set `xs` as a side effect and returns `xs` itself.|
|  `xs --= ys`  	    |Removes all elements in `ys` from set `xs` as a side effect and returns `xs` itself.|
|  `xs remove x`  	    |Removes element `x` from `xs` and returns `true` if `x` was previously contained in the set, `false` if it was not.|
|  `xs retain p`  	    |Keeps only those elements in `xs` that satisfy predicate `p`.|
|  `xs.clear()`  	    |Removes all elements from `xs`.|
|  **Update:**              |						     |
|  `xs(x) = b`  	    |(or, written out, `xs.update(x, b)`). If boolean argument `b` is `true`, adds `x` to `xs`, otherwise removes `x` from `xs`.|
|  **Cloning:**             |						     |
|  `xs.clone`  	            |A new mutable set with the same elements as `xs`.|

Just like an immutable set, a mutable set offers the `+` and `++` operations for element additions and the `-` and `--` operations for element removals. But these are less often used for mutable sets since they involve copying the set. As a more efficient alternative, mutable sets offer the update methods `+=` and `-=`. The operation `s += elem` adds `elem` to the set `s` as a side effect, and returns the mutated set as a result. Likewise, `s -= elem` removes `elem` from the set, and returns the mutated set as a result. Besides `+=` and `-=` there are also the bulk operations `++=` and `--=` which add or remove all elements of a traversable or an iterator.

The choice of the method names `+=` and `-=` means that very similar code can work with either mutable or immutable sets. Consider first the following REPL dialogue which uses an immutable set `s`:

    scala> var s = Set(1, 2, 3)
    s: scala.collection.immutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    scala> s -= 2
    scala> s
    res2: scala.collection.immutable.Set[Int] = Set(1, 3, 4)

We used `+=` and `-=` on a `var` of type `immutable.Set`. A statement such as `s += 4` is an abbreviation for `s = s + 4`. So this invokes the addition method `+` on the set `s` and then assigns the result back to the `s` variable. Consider now an analogous interaction with a mutable set.


    scala> val s = collection.mutable.Set(1, 2, 3)
    s: scala.collection.mutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    res3: s.type = Set(1, 4, 2, 3)
    scala> s -= 2
    res4: s.type = Set(1, 4, 3)

The end effect is very similar to the previous interaction; we start with a `Set(1, 2, 3)` end end up with a `Set(1, 3, 4)`. However, even though the statements look the same as before, they do something different. `s += 4` now invokes the `+=` method on the mutable set value `s`, changing the set in place. Likewise, `s -= 2` now invokes the `-=` method on the same set.

Comparing the two interactions shows an important principle. You often can replace a mutable collection stored in a `val` by an immutable collection stored in a `var`, and _vice versa_. This works at least as long as there are no alias references to the collection through which one can observe whether it was updated in place or whether a new collection was created.

Mutable sets also provide add and remove as variants of `+=` and `-=`. The difference is that `add` and `remove` return a Boolean result indicating whether the operation had an effect on the set.

The current default implementation of a mutable set uses a hashtable to store the set's elements. The default implementation of an immutable set uses a representation that adapts to the number of elements of the set. An empty set is represented by just a singleton object. Sets of sizes up to four are represented by a single object that stores all elements as fields. Beyond that size, immutable sets are implemented as [hash tries](#hash-tries).

A consequence of these representation choices is that, for sets of small sizes (say up to 4), immutable sets are usually more compact and also more efficient than mutable sets. So, if you expect the size of a set to be small, try making it immutable.

Two subtraits of sets are `SortedSet` and `BitSet`.

### Sorted Sets ###

A [SortedSet](http://www.scala-lang.org/api/current/scala/collection/SortedSet.html) is a set that produces its elements (using `iterator` or `foreach`) in a given ordering (which can be freely chosen at the time the set is created). The default representation of a [SortedSet](http://www.scala-lang.org/api/current/scala/collection/SortedSet.html) is an ordered binary tree which maintains the invariant that all elements in the left subtree of a node are smaller than all elements in the right subtree. That way, a simple in order traversal can return all tree elements in increasing order. Scala's class [immutable.TreeSet](http://www.scala-lang.org/api/current/scala/collection/immutable/TreeSet.html) uses a _red-black_ tree implementation to maintain this ordering invariant and at the same time keep the tree _balanced_-- meaning that all paths from the root of the tree to a leaf have lengths that differ only by at most one element.

To create an empty [TreeSet](http://www.scala-lang.org/api/current/scala/collection/immutable/TreeSet.html), you could first specify the desired ordering:

    scala> val myOrdering = Ordering.fromLessThan[String](_ > _)
    myOrdering: scala.math.Ordering[String] = ...

Then, to create an empty tree set with that ordering, use:

    scala> TreeSet.empty(myOrdering)
    res1: scala.collection.immutable.TreeSet[String] = TreeSet()

Or you can leave out the ordering argument but give an element type or the empty set. In that case, the default ordering on the element type will be used.

    scala> TreeSet.empty[String]
    res2: scala.collection.immutable.TreeSet[String] = TreeSet()

If you create new sets from a tree-set (for instance by concatenation or filtering) they will keep the same ordering as the original set. For instance,

scala> res2 + ("one", "two", "three", "four")
res3: scala.collection.immutable.TreeSet[String] = TreeSet(four, one, three, two)

Sorted sets also support ranges of elements. For instance, the `range` method returns all elements from a starting element up to, but excluding, and end element. Or, the `from` method returns all elements greater or equal than a starting element in the set's ordering. The result of calls to both methods is again a sorted set. Examples:

    scala> res3 range ("one", "two")
    res4: scala.collection.immutable.TreeSet[String] = TreeSet(one, three)
    scala> res3 from "three"
    res5: scala.collection.immutable.TreeSet[String] = TreeSet(three, two)


### Bitsets ###

Bitsets are sets of non-negative integer elements that are implemented in one or more words of packed bits. The internal representation of a [BitSet](http://www.scala-lang.org/api/current/scala/collection/BitSet.html) uses an array of `Long`s. The first `Long` covers elements from 0 to 63, the second from 64 to 127, and so on (Immutable bitsets of elements in the range of 0 to 127 optimize the array away and store the bits directly in a one or two `Long` fields.) For every  `Long`, each of its 64 bits is set to 1 if the corresponding element is contained in the set, and is unset otherwise. It follows that the size of a bitset depends on the largest integer that's stored in it. If `N` is that largest integer, then the size of the set is `N/64` `Long` words, or `N/8` bytes, plus a small number of extra bytes for status information.

Bitsets are hence more compact than other sets if they contain many small elements. Another advantage of bitsets is that operations such as membership test with `contains`, or element addition and removal with `+=` and `-=` are all extremely efficient.


## Maps ##

A [Map](http://www.scala-lang.org/api/current/scala/collection/Map.html) is an [Iterable](http://www.scala-lang.org/api/current/scala/collection/Iterable.html) consisting of pairs of keys and values (also named _mappings_ or _associations_). Scala's [Predef](http://www.scala-lang.org/api/current/scala/Predef$.html) class offers an implicit conversion that lets you write `key -> value` as an alternate syntax for the pair `(key, value)`. For instance `Map("x" -> 24, "y" -> 25, "z" -> 26)` means exactly the same as `Map(("x", 24), ("y", 25), ("z", 26))`, but reads better.

The fundamental operations on maps are similar to those on sets. They are summarized in the following table and fall into the following categories:

* **Lookup** operations `apply`, `get`, `getOrElse`, `contains`, and `isDefinedAt`. These turn maps into partial functions from keys to values. The fundamental lookup method for a map is: `def get(key): Option[Value]`. The operation "`m get key`" tests whether the map contains an association for the given `key`. If so, it returns the associated value in a `Some`. If no key is defined in the map, `get` returns `None`. Maps also define an `apply` method that returns the value associated with a given key directly, without wrapping it in an `Option`. If the key is not defined in the map, an exception is raised.
* **Additions and updates** `+`, `++`, `updated`, which let you add new bindings to a map or change existing bindings.
* **Removals** `-`, `--`, which remove bindings from a map.
* **Subcollection producers** `keys`, `keySet`, `keysIterator`, `values`, `valuesIterator`, which return a map's keys and values separately in various forms.
* **Transformations** `filterKeys` and `mapValues`, which produce a new map by filtering and transforming bindings of an existing map.

### Operations in Class Map ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Lookups:**             |						     |
|  `ms get k`  	            |The value associated with key `k` in map `ms` as an option, `None` if not found.|
|  `ms(k)`  	            |(or, written out, `ms apply k`) The value associated with key `k` in map `ms`, or exception if not found.|
|  `ms getOrElse (k, d)`    |The value associated with key `k` in map `ms`, or the default value `d` if not found.|
|  `ms contains k`  	    |Tests whether `ms` contains a mapping for key `k`.|
|  `ms isDefinedAt k`  	    |Same as `contains`.                             |    
| **Additions and Updates:**|						     |
|  `ms - k`  	            |The map containing all mappings of `ms` except for any mapping of key `k`.|  
|  `ms - (k, 1, m)`  	    |The map containing all mappings of `ms` except for any mapping with the given keys.|    
|  `ms -- ks`  	            |The map containing all mappings of `ms` except for any mapping with a key in `ks`.|    
|   **Subcollections:**     |						     |
|  `ms.keys`  	            |An iterable containing each key in `ms`.        |
|  `ms.keySet`              |A set containing each key in `ms`.              |
|  `ms.keyIterator`         |An iterator yielding each key in `ms`.          |
|  `ms.values`      	    |An iterable containing each value associated with a key in `ms`.|
|  `ms.valuesIterator`      |An iterator yielding each value associated with a key in `ms`.|
|   **Transformation:**     |						     |
|  `ms filterKeys p`        |A map view containing only those mappings in `ms` where the key satisfies predicate `p`.|
|  `ms mapValues f`         |A map view resulting from applying function `f` to each value associated with a key in `ms`.|

Mutable maps support in addition the operations summarized in the following table.


### Operations in Class mutable.Map ###

| WHAT IT IS  	  	    | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Additions and Updates:**|						     |
|  `ms(k) = v`              |(Or, written out, `ms.update(x, v)`). Adds mapping from key `k` to value `v` to map ms as a side effect, overwriting any previous mapping of `k`.|
|  `ms += (k -> v)`         |Adds mapping from key `k` to value `v` to map `ms` as a side effect and returns `ms` itself.|
|  `ms += (k -> v, l -> w)` |Adds the given mappings to `ms` as a side effect and returns `ms` itself.|
|  `ms ++= kvs`             |Adds all mappings in `kvs` to `ms` as a side effect and returns `ms` itself.|
|  `ms put (k, v)`          |Adds mapping from key `k` to value `v` to `ms` and returns any value previously associated with `k` as an option.|
|  `ms getOrElseUpdate (k, d)`|If key `k` is defined in map `ms`, return its associated value. Otherwise, update `ms` with the mapping `k -> d` and return `d`.|
|  **Additions and Updates:**|						     |
|  `ms -= k`                |Removes mapping with key `k` from ms as a side effect and returns `ms` itself.|
|  `ms -= (k, l, m)`        |Removes mappings with the given keys from `ms` as a side effect and returns `ms` itself.|
|  `ms --= ks`              |Removes all keys in `ks` from `ms` as a side effect and returns `ms` itself.|
|  `ms remove k`            |Removes any mapping with key `k` from `ms` and returns any value previously associated with `k` as an option.|
|  `ms retain p`            |Keeps only those mappings in `ms` that have a key satisfying predicate `p`.|
|  `ms.clear()`             |Removes all mappings from `ms`.                 |
|  **Transformation:**      |						     |
|  `ms transform f`         |Transforms all associated values in map `ms` with function `f`.|
|  **Cloning:**             |						     |
|  `ms.clone`               |Returns a new mutable map with the same mappings as `ms`.|

The addition and removal operations for maps mirror those for sets. As is the for sets, mutable maps also support the non-destructive addition operations `+`, `-`, and `updated`, but they are used less frequently because they involve a copying of the mutable map. Instead, a mutable map `m` is usually updated "in place", using the two variants `m(key) = value` or `m += (key -> value)`. There are is also the variant `m put (key, value)`, which returns an `Option` value that contains the value previously associated with `key`, or `None` if the `key` did not exist in the map before.

The `getOrElseUpdate` is useful for accessing maps that act as caches. Say you have an expensive computation triggered by invoking a function `f`:

    scala> def f(x: String) = { 
           println("taking my time."); sleep(100)
           x.reverse }
    f: (x: String)String

Assume further that `f` has no side-effects, so invoking it again with the same argument will always yield the same result. In that case you could save time by storing previously computed bindings of argument and results of `f` in a map and only computing the result of `f` if a result of an argument was not found there. One could say the map is a _cache_ for the computations of the function `f`.

    val cache = collection.mutable.Map[String, String]()
    cache: scala.collection.mutable.Map[String,String] = Map()

You can now create a more efficient caching version of the `f` function:

    scala> def cachedF(s: String) = cache.getOrElseUpdate(s, f(s))
    cachedF: (s: String)String
    scala> cachedF("abc")
    taking my time.
    res3: String = cba
    scala> cachedF("abc")
    res4: String = cba

Note that the second argument to `getOrElseUpdate` is "by-name", so the computation of `f("abc")` above is only performed if `getOrElseUpdate` requires the value of its second argument, which is precisely if its first argument is not found in the `cache` map. You could also have implemented `cachedF` directly, using just basic map operations, but it would take more code to do so:

    def cachedF(arg: String) = cache get arg match {
      case Some(result) => result
      case None => 
        val result = f(x)
        cache(arg) = result
        result
    }

### Synchronized Sets and Maps ###

To get a thread-safe mutable map, you can mix the `SynchronizedMap` trait trait into whatever particular map implementation you desire. For example, you can mix `SynchronizedMap` into `HashMap`, as shown in the code below. This example begins with an import of two traits, `Map` and `SynchronizedMap`, and one class, `HashMap`, from package `scala.collection.mutable`. The rest of the example is the definition of singleton object `MapMaker`, which declares one method, `makeMap`. The `makeMap` method declares its result type to be a mutable map of string keys to string values.

      import scala.collection.mutable.{Map,
          SynchronizedMap, HashMap}
      object MapMaker {
        def makeMap: Map[String, String] = {
            new HashMap[String, String] with
                SynchronizedMap[String, String] {
              override def default(key: String) =
                "Why do you want to know?"
            }
        }
      }

<center>Mixing in the `SynchronizedMap` trait.</center>

The first statement inside the body of `makeMap` constructs a new mutable `HashMap` that mixes in the `SynchronizedMap` trait:

    new HashMap[String, String] with
      SynchronizedMap[String, String]

Given this code, the Scala compiler will generate a synthetic subclass of `HashMap` that mixes in `SynchronizedMap`, and create (and return) an instance of it. This synthetic class will also override a method named `default`, because of this code:

    override def default(key: String) =
      "Why do you want to know?"

If you ask a map to give you the value for a particular key, but it doesn't have a mapping for that key, you'll by default get a `NoSuchElementException`. If you define a new map class and override the `default` method, however, your new map will return the value returned by `default` when queried with a non-existent key. Thus, the synthetic `HashMap` subclass generated by the compiler from the code in the synchronized map code will return the somewhat curt response string, `"Why do you want to know?"`, when queried with a non-existent key.

Because the mutable map returned by the `makeMap` method mixes in the `SynchronizedMap` trait, it can be used by multiple threads at once. Each access to the map will be synchronized. Here's an example of the map being used, by one thread, in the interpreter:

    scala> val capital = MapMaker.makeMap  
    capital: scala.collection.mutable.Map[String,String] = Map()
    scala> capital ++ List("US" -> "Washington",
            "Paris" -> "France", "Japan" -> "Tokyo")
    res0: scala.collection.mutable.Map[String,String] =
      Map(Paris -> France, US -> Washington, Japan -> Tokyo)
    scala> capital("Japan")
    res1: String = Tokyo
    scala> capital("New Zealand")
    res2: String = Why do you want to know?
    scala> capital += ("New Zealand" -> "Wellington")
    scala> capital("New Zealand")                    
    res3: String = Wellington

You can create synchronized sets similarly to the way you create synchronized maps. For example, you could create a synchronized `HashSet` by mixing in the `SynchronizedSet` trait, like this:

    import scala.collection.mutable
    val synchroSet =
      new mutable.HashSet[Int] with
          mutable.SynchronizedSet[Int]

Finally, if you are thinking of using synchronized collections, you may also wish to consider the concurrent collections of `java.util.concurrent` instead.














