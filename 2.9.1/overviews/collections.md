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
|  **Subdivisions:**      |						     |




