---
layout: overview-large
title: Iterators

disqus: true

partof: collections
num: 15
languages: [ko, ja, zh-cn]
---

An iterator is not a collection, but rather a way to access the elements of a collection one by one. The two basic operations on an iterator `it` are `next` and `hasNext`. A call to `it.next()` will return the next element of the iterator and advance the state of the iterator. Calling `next` again on the same iterator will then yield the element one beyond the one returned previously. If there are no more elements to return, a call to `next` will throw a `NoSuchElementException`. You can find out whether there are more elements to return using [Iterator](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html)'s `hasNext` method.

The most straightforward way to "step through" all the elements returned by an iterator `it` uses a while-loop:

    while (it.hasNext)
      println(it.next())

Iterators in Scala also provide analogues of most of the methods that you find in the `Traversable`, `Iterable` and `Seq` classes. For instance, they provide a `foreach` method which executes a given procedure on each element returned by an iterator. Using `foreach`, the loop above could be abbreviated to:

    it foreach println

As always, for-expressions can be used as an alternate syntax for expressions involving `foreach`, `map`, `withFilter`, and `flatMap`, so yet another way to print all elements returned by an iterator would be:

    for (elem <- it) println(elem)

There's an important difference between the foreach method on iterators and the same method on traversable collections: When called on an iterator, `foreach` will leave the iterator at its end when it is done. So calling `next` again on the same iterator will fail with a `NoSuchElementException`. By contrast, when called on a collection, `foreach` leaves the number of elements in the collection unchanged (unless the passed function adds to removes elements, but this is discouraged, because it may lead to surprising results).

The other operations that Iterator has in common with `Traversable` have the same property. For instance, iterators provide a `map` method, which returns a new iterator:

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it.map(_.length)
    res1: Iterator[Int] = non-empty iterator
    scala> res1 foreach println
    1
    6
    2
    5
    scala> it.next()
    java.util.NoSuchElementException: next on empty iterator

As you can see, after the call to `it.map`, the `it` iterator has advanced to its end.

Another example is the `dropWhile` method, which can be used to find the first elements of an iterator that has a certain property. For instance, to find the first word in the iterator above that has at least two characters you could write:

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it dropWhile (_.length < 2)
    res4: Iterator[java.lang.String] = non-empty iterator
    scala> it.next()
    res5: java.lang.String = number

Note again that `it` was changed by the call to `dropWhile`: it now points to the second word "number" in the list.
In fact, `it` and the result `res4` returned by `dropWhile` will return exactly the same sequence of elements.

One way to circumvent this behavior is to `duplicate` the underlying iterator instead of calling methods on it directly.
The _two_ iterators that result will each return exactly the same elements as the underlying iterator `it`:

    scala> val (words, ns) = Iterator("a", "number", "of", "words").duplicate
    words: Iterator[String] = non-empty iterator
    ns: Iterator[String] = non-empty iterator

    scala> val shorts = words.filter(_.length < 3).toList
    shorts: List[String] = List(a, of)

    scala> val count = ns.map(_.length).sum
    count: Int = 14

The two iterators work independently: advancing one does not affect the other, so that each can be
destructively modified by invoking arbitrary methods. This creates the illusion of iterating over
the elements twice, but the effect is achieved through internal buffering.
As usual, the underlying iterator `it` cannot be used directly and must be discarded.

In summary, iterators behave like collections _if one never accesses an iterator again after invoking a method on it_. The Scala collection libraries make this explicit with an abstraction [TraversableOnce](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/TraversableOnce.html), which is a common superclass of [Traversable](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Traversable.html) and [Iterator](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html). As the name implies, `TraversableOnce` objects can be traversed using `foreach` but the state of that object after the traversal is not specified. If the `TraversableOnce` object is in fact an `Iterator`, it will be at its end after the traversal, but if it is a `Traversable`, it will still exist as before. A common use case of `TraversableOnce` is as an argument type for methods that can take either an iterator or a traversable as argument. An example is the appending method `++` in class `Traversable`. It takes a `TraversableOnce` parameter, so you can append elements coming from either an iterator or a traversable collection.

All operations on iterators are summarized below.

### Operations in class Iterator

| WHAT IT IS  	  	        | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  **Abstract Methods:**    |						         |
|  `it.next()`      	    | Returns next element on iterator and advances past it. |
|  `it.hasNext`  	        | Returns `true` if `it` can return another element. |
|  **Variations:**          |						         |
|  `it.buffered`      	    | A buffered iterator returning all elements of `it`. |
|  `it grouped size`      	| An iterator that yields the elements returned by `it` in fixed-sized sequence "chunks". |
|  `xs sliding size`      	| An iterator that yields the elements returned by `it` in sequences representing a sliding fixed-sized window. |
|  **Duplication:**         |						         |
|  `it.duplicate`           | A pair of iterators that each independently return all elements of `it`. |
|  **Additions:**           |						         |
|  `it ++ jt`               | An iterator returning all elements returned by iterator `it`, followed by all elements returned by iterator `jt`. |
|  `it padTo (len, x)`      | The iterator that first returns all elements of `it` and then follows that by copies of `x` until length `len` elements are returned overall. |
|  **Maps:**                |						         |
|  `it map f`               | The iterator obtained from applying the function `f` to every element returned from `it`. |
|  `it flatMap f`           | The iterator obtained from applying the iterator-valued function f to every element in `it` and appending the results. |
|  `it collect f`           | The iterator obtained from applying the partial function `f` to every element in `it` for which it is defined and collecting the results. |
|  **Conversions:**         |						         |
|  `it.toArray`             | Collects the elements returned by `it` in an array. |
|  `it.toList`              | Collects the elements returned by `it` in a list. |
|  `it.toIterable`          | Collects the elements returned by `it` in an iterable. |
|  `it.toSeq`               | Collects the elements returned by `it` in a sequence. |
|  `it.toIndexedSeq`        | Collects the elements returned by `it` in an indexed sequence. |
|  `it.toStream`            | Collects the elements returned by `it` in a stream. |
|  `it.toSet`               | Collects the elements returned by `it` in a set. |
|  `it.toMap`               | Collects the key/value pairs returned by `it` in a map. |
|  **Copying:**              |						         |
|  `it copyToBuffer buf`    | Copies all elements returned by `it` to buffer `buf`. |
|  `it copyToArray(arr, s, n)`| Copies at most `n` elements returned by `it` to array `arr` starting at index `s`. The last two arguments are optional. |
|  **Size Info:**           |						         |
|  `it.isEmpty`             | Test whether the iterator is empty (opposite of `hasNext`). |
|  `it.nonEmpty`            | Test whether the collection contains elements (alias of `hasNext`). |
|  `it.size`                | The number of elements returned by `it`. Note: `it` will be at its end after this operation! |
|  `it.length`              | Same as `it.size`. |
|  `it.hasDefiniteSize`     | Returns `true` if `it` is known to return finitely many elements (by default the same as `isEmpty`). |
|  **Element Retrieval Index Search:**|						         |
|  `it find p`              | An option containing the first element returned by `it` that satisfies `p`, or `None` is no element qualifies. Note: The iterator advances to after the element, or, if none is found, to the end. |
|  `it indexOf x`           | The index of the first element returned by `it` that equals `x`. Note: The iterator advances past the position of this element. |
|  `it indexWhere p`        | The index of the first element returned by `it` that satisfies `p`. Note: The iterator advances past the position of this element. |
|  **Subiterators:**        |						         |
|  `it take n`              | An iterator returning of the first `n` elements of `it`. Note: it will advance to the position after the `n`'th element, or to its end, if it contains less than `n` elements. |
|  `it drop n`              | The iterator that starts with the `(n+1)`'th element of `it`. Note: `it` will advance to the same position. |
|  `it slice (m,n)`         | The iterator that returns a slice of the elements returned from it, starting with the `m`'th element and ending before the `n`'th element. |
|  `it takeWhile p`         | An iterator returning elements from `it` as long as condition `p` is true. |
|  `it dropWhile p`         | An iterator skipping elements from `it` as long as condition `p` is `true`, and returning the remainder. |
|  `it filter p`            | An iterator returning all elements from `it` that satisfy the condition `p`. |
|  `it withFilter p`        | Same as `it` filter `p`. Needed so that iterators can be used in for-expressions. |
|  `it filterNot p`         | An iterator returning all elements from `it` that do not satisfy the condition `p`. |
|  **Subdivisions:**        |						         |
|  `it partition p`         | Splits `it` into a pair of two iterators: one returning all elements from `it` that satisfy the predicate `p`, the other returning all elements from `it` that do not. |
|  `it span p`              | Splits `it` into a pair of two iterators: one returning all elements of the prefix of `it` that satisfy the predicate `p`, the other returning all remaining elements of `it`. |
|  **Element Conditions:**  |						         |
|  `it forall p`            | A boolean indicating whether the predicate p holds for all elements returned by `it`. |
|  `it exists p`            | A boolean indicating whether the predicate p holds for some element in `it`. |
|  `it count p`             | The number of elements in `it` that satisfy the predicate `p`. |
|  **Folds:**               |						         |
|  `it.foldLeft(z)(op)`     | Apply binary operation `op` between successive elements returned by `it`, going left to right and starting with `z`. |
|  `it.foldRight(z)(op)`    | Apply binary operation `op` between successive elements returned by `it`, going right to left and starting with `z`. |
|  `it reduceLeft op`       | Apply binary operation `op` between successive elements returned by non-empty iterator `it`, going left to right. |
|  `it reduceRight op`      | Apply binary operation `op` between successive elements returned by non-empty iterator `it`, going right to left. |
|  **Specific Folds:**      |						         |
|  `it.sum`                 | The sum of the numeric element values returned by iterator `it`. |
|  `it.product`             | The product of the numeric element values returned by iterator `it`. |
|  `it.min`                 | The minimum of the ordered element values returned by iterator `it`. |
|  `it.max`                 | The maximum of the ordered element values returned by iterator `it`. |
|  **Zippers:**             |						         |
|  `it zip jt`              | An iterator of pairs of corresponding elements returned from iterators `it` and `jt`. |
|  `it zipAll (jt, x, y)`   | An iterator of pairs of corresponding elements returned from iterators `it` and `jt`, where the shorter iterator is extended to match the longer one by appending elements `x` or `y`. |
|  `it.zipWithIndex`        | An iterator of pairs of elements returned from `it` with their indices. |
|  **Update:**              |						         |
|  `it patch (i, jt, r)`    | The iterator resulting from `it` by replacing `r` elements starting with `i` by the patch iterator `jt`. |
|  **Comparison:**          |						         |
|  `it sameElements jt`     | A test whether iterators it and `jt` return the same elements in the same order. Note: Using the iterators after this operation is undefined and subject to change. |
|  **Strings:**             |						         |
|  `it addString (b, start, sep, end)`| Adds a string to `StringBuilder` `b` which shows all elements returned by `it` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional. |
|  `it mkString (start, sep, end)` | Converts the collection to a string which shows all elements returned by `it` between separators `sep` enclosed in strings `start` and `end`. `start`, `sep`, `end` are all optional. |

### Buffered iterators

Sometimes you want an iterator that can "look ahead", so that you can inspect the next element to be returned without advancing past that element. Consider for instance, the task to skip leading empty strings from an iterator that returns a sequence of strings. You might be tempted to write the following


    def skipEmptyWordsNOT(it: Iterator[String]) =
      while (it.next().isEmpty) {}

But looking at this code more closely, it's clear that this is wrong: The code will indeed skip leading empty strings, but it will also advance `it` past the first non-empty string!

The solution to this problem is to use a buffered iterator. Class [BufferedIterator](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/BufferedIterator.html) is a subclass of [Iterator](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html), which provides one extra method, `head`. Calling `head` on a buffered iterator will return its first element but will not advance the iterator. Using a buffered iterator, skipping empty words can be written as follows.

    def skipEmptyWords(it: BufferedIterator[String]) =
      while (it.head.isEmpty) { it.next() }

Every iterator can be converted to a buffered iterator by calling its `buffered` method. Here's an example:

    scala> val it = Iterator(1, 2, 3, 4)
    it: Iterator[Int] = non-empty iterator
    scala> val bit = it.buffered
    bit: scala.collection.BufferedIterator[Int] = non-empty iterator
    scala> bit.head
    res10: Int = 1
    scala> bit.next()
    res11: Int = 1
    scala> bit.next()
    res12: Int = 2
    scala> bit.optionHead
    res13: Option[Int] = Some(3)

Note that calling `head` on the buffered iterator `bit` does not advance it. Therefore, the subsequent call `bit.next()` returns the same value as `bit.head`.

As usual, the underlying iterator must not be used directly and must be discarded.

The buffered iterator only buffers the next element when `head` is invoked. Other derived iterators,
such as those produced by `duplicate` and `partition`, may buffer arbitrary subsequences of the
underlying iterator. But iterators can be efficiently joined by adding them together with `++`:

    scala> def collapse(it: Iterator[Int]) = if (!it.hasNext) Iterator.empty else {
         | var head = it.next
         | val rest = if (head == 0) it.dropWhile(_ == 0) else it
         | Iterator.single(head) ++ rest
         | }
    collapse: (it: Iterator[Int])Iterator[Int]

    scala> def collapse(it: Iterator[Int]) = {
         | val (zeros, rest) = it.span(_ == 0)
         | zeros.take(1) ++ rest
         | }
    collapse: (it: Iterator[Int])Iterator[Int]

    scala> collapse(Iterator(0, 0, 0, 1, 2, 3, 4)).toList
    res14: List[Int] = List(0, 1, 2, 3, 4)

In the second version of `collapse`, the unconsumed zeros are buffered internally.
In the first version, any leading zeros are dropped and the desired result constructed
as a concatenated iterator, which simply calls its two constituent iterators in turn.
