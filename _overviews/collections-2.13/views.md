---
layout: multipage-overview
title: Views
partof: collections-213
overview-name: Collections

num: 14
previous-page: equality
next-page: iterators

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

Collections have quite a few methods that construct new collections. Examples are `map`, `filter` or `++`. We call such methods *transformers* because they take at least one collection as their receiver object and produce another collection as their result.

There are two principal ways to implement transformers. One is _strict_, that is a new collection with all its elements is constructed as a result of the transformer. The other is non-strict or _lazy_, that is one constructs only a proxy for the result collection, and its elements get constructed only as one demands them.

As an example of a non-strict transformer consider the following implementation of a lazy map operation:

    def lazyMap[T, U](iter: Iterable[T], f: T => U) = new Iterable[U] {
      def iterator = iter.iterator map f
    }

Note that `lazyMap` constructs a new `Iterable` without stepping through all elements of the given collection `coll`. The given function `f` is instead applied to the elements of the new collection's `iterator` as they are demanded.

Scala collections are by default strict in all their transformers, except for `LazyList`, which implements all its transformer methods lazily. However, there is a systematic way to turn every collection into a lazy one and _vice versa_, which is based on collection views. A _view_ is a special kind of collection that represents some base collection, but implements all transformers lazily.

To go from a collection to its view, you can use the `view` method on the collection. If `xs` is some collection, then `xs.view` is the same collection, but with all transformers implemented lazily. To get back from a view to a strict collection, you can use the `to` conversion operation with a strict collection factory as parameter (e.g. `xs.view.to(List)`).

Let's see an example. Say you have a vector of Ints over which you want to map two functions in succession:

    scala> val v = Vector(1 to 10: _*)
    v: scala.collection.immutable.Vector[Int] =
       Vector(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    scala> v map (_ + 1) map (_ * 2)
    res5: scala.collection.immutable.Vector[Int] =
       Vector(4, 6, 8, 10, 12, 14, 16, 18, 20, 22)

In the last statement, the expression `v map (_ + 1)` constructs a new vector which is then transformed into a third vector by the second call to `map (_ * 2)`. In many situations, constructing the intermediate result from the first call to map is a bit wasteful. In the example above, it would be faster to do a single map with the composition of the two functions `(_ + 1)` and `(_ * 2)`. If you have the two functions available in the same place you can do this by hand. But quite often, successive transformations of a data structure are done in different program modules. Fusing those transformations would then undermine modularity. A more general way to avoid the intermediate results is by turning the vector first into a view, then applying all transformations to the view, and finally forcing the view to a vector:

    scala> (v.view map (_ + 1) map (_ * 2)).to(Vector)
    res12: scala.collection.immutable.Vector[Int] =
       Vector(4, 6, 8, 10, 12, 14, 16, 18, 20, 22)  

Let's do this sequence of operations again, one by one:

    scala> val vv = v.view
    vv: scala.collection.IndexedSeqView[Int] = IndexedSeqView(<not computed>)

The application `v.view` gives you an `IndexedSeqView[Int]`, i.e. a lazily evaluated `IndexedSeq[Int]`. Like with `LazyList`,
the `toString` operation of views does not force the view elements, that’s why the content of `vv` is shown as `IndexedSeqView(<not computed>)`.

Applying the first `map` to the view gives:

    scala> vv map (_ + 1)
    res13: scala.collection.IndexedSeqView[Int] = IndexedSeqView(<not computed>)

The result of the `map` is another `IndexedSeqView[Int]` value. This is in essence a wrapper that *records* the fact that a `map` with function `(_ + 1)` needs to be applied on the vector `v`. It does not apply that map until the view is forced, however. Let's now apply the second `map` to the last result.

    scala> res13 map (_ * 2)
    res14: scala.collection.IndexedSeqView[Int] = IndexedSeqView(<not computed>)

Finally, forcing the last result gives:

    scala> res14.to(Vector)
    res15: scala.collection.immutable.Vector[Int] =
       Vector(4, 6, 8, 10, 12, 14, 16, 18, 20, 22)

Both stored functions get applied as part of the execution of the `to` operation and a new vector is constructed. That way, no intermediate data structure is needed.

In general, transformation operations applied to views never build a new data structure, and accessing the elements of a view
effectively traverses as few elements as possible of the underlying data structure. Therefore, views have the following
properties: (1) transformers have a `O(1)` complexity, and (2) element access operations have the same
complexity of the underlying data structure (for instance, indexed access on an `IndexedSeqView` is constant, otherwise
it is linear).

There are a few exceptions to these rules, though. For instance, the `sorted` operation can not satisfy both
properties. Indeed, the whole underlying collection has to be traversed in order to find its minimum element. On one
hand, if that traversal happened at the time `sorted` was called, then the first property would be violated (`sorted`
would not be lazy on views), on the other hand, if that traversal happened at the time the resulting view elements were
accessed, then the second property would be violated. For such operations, we decided to violate the first property.
These operations are documented as “always forcing the collection elements”.

The main reason for using views is performance. You have seen that by switching a collection to a view the construction of intermediate results can be avoided. These savings can be quite important. As another example, consider the problem of finding the first palindrome in a list of words. A palindrome is a word which reads backwards the same as forwards. Here are the necessary definitions:

    def isPalindrome(x: String) = x == x.reverse
    def findPalindrome(s: Seq[String]) = s find isPalindrome

Now, assume you have a very long sequence words and you want to find a palindrome in the first million words of that sequence. Can you re-use the definition of `findPalindrome`? Of course, you could write:

    findPalindrome(words take 1000000)

This nicely separates the two aspects of taking the first million words of a sequence and finding a palindrome in it. But the downside is that it always constructs an intermediary sequence consisting of one million words, even if the first word of that sequence is already a palindrome. So potentially, 999'999 words are copied into the intermediary result without being inspected at all afterwards. Many programmers would give up here and write their own specialized version of finding palindromes in some given prefix of an argument sequence. But with views, you don't have to. Simply write:

    findPalindrome(words.view take 1000000)

This has the same nice separation of concerns, but instead of a sequence of a million elements it will only construct a single lightweight view object. This way, you do not need to choose between performance and modularity.

After having seen all these nifty uses of views you might wonder why have strict collections at all? One reason is that performance comparisons do not always favor lazy over strict collections. For smaller collection sizes the added overhead of forming and applying closures in views is often greater than the gain from avoiding the intermediary data structures. A probably more important reason is that evaluation in views can be very confusing if the delayed operations have side effects.

Here's an example which bit a few users of versions of Scala before 2.8. In these versions the `Range` type was lazy, so it behaved in effect like a view. People were trying to create a number of actors like this:

    val actors = for (i <- 1 to 10) yield actor { ... }

They were surprised that none of the actors was executing afterwards, even though the actor method should create and start an actor from the code that's enclosed in the braces following it. To explain why nothing happened, remember that the for expression above is equivalent to an application of map:

    val actors = (1 to 10) map (i => actor { ... })

Since previously the range produced by `(1 to 10)` behaved like a view, the result of the map was again a view. That is, no element was computed, and, consequently, no actor was created! Actors would have been created by forcing the range of the whole expression, but it's far from obvious that this is what was required to make the actors do their work.

To avoid surprises like this, the current Scala collections library has more regular rules. All collections except lazy lists and views are strict. The only way to go from a strict to a lazy collection is via the `view` method. The only way to go back is via `to`. So the `actors` definition above would now behave as expected in that it would create and start 10 actors. To get back the surprising previous behavior, you'd have to add an explicit `view` method call:

    val actors = for (i <- (1 to 10).view) yield actor { ... }

In summary, views are a powerful tool to reconcile concerns of efficiency with concerns of modularity. But in order not to be entangled in aspects of delayed evaluation, you should restrict views to purely functional code where collection transformations do not have side effects. What's best avoided is a mixture of views and operations that create new collections while also having side effects.
