---
layout: multipage-overview
title: Concrete Mutable Collection Classes

discourse: true

partof: collections-213
overview-name: Collections

num: 9
previous-page: concrete-immutable-collection-classes
next-page: arrays

permalink: /overviews/collections-2.13/:title.html
---

You've now seen the most commonly used immutable collection classes that Scala provides in its standard library. Take a look now at the mutable collection classes.

## Array Buffers

An [ArrayBuffer](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayBuffer.html) buffer holds an array and a size. Most operations on an array buffer have the same speed as for an array, because the operations simply access and modify the underlying array. Additionally, array buffers can have data efficiently added to the end. Appending an item to an array buffer takes amortized constant time. Thus, array buffers are useful for efficiently building up a large collection whenever the new items are always added to the end.

    scala> val buf = scala.collection.mutable.ArrayBuffer.empty[Int]
    buf: scala.collection.mutable.ArrayBuffer[Int] = ArrayBuffer()
    scala> buf += 1
    res32: buf.type = ArrayBuffer(1)
    scala> buf += 10
    res33: buf.type = ArrayBuffer(1, 10)
    scala> buf.toArray
    res34: Array[Int] = Array(1, 10)

## List Buffers

A [ListBuffer](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ListBuffer.html) is like an array buffer except that it uses a linked list internally instead of an array. If you plan to convert the buffer to a list once it is built up, use a list buffer instead of an array buffer.

    scala> val buf = scala.collection.mutable.ListBuffer.empty[Int]
    buf: scala.collection.mutable.ListBuffer[Int] = ListBuffer()
    scala> buf += 1
    res35: buf.type = ListBuffer(1)
    scala> buf += 10
    res36: buf.type = ListBuffer(1, 10)
    scala> buf.toList
    res37: List[Int] = List(1, 10)

## StringBuilders

Just like an array buffer is useful for building arrays, and a list buffer is useful for building lists, a [StringBuilder](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/StringBuilder.html) is useful for building strings. String builders are so commonly used that they are already imported into the default namespace. Create them with a simple `new StringBuilder`, like this:

    scala> val buf = new StringBuilder
    buf: StringBuilder =
    scala> buf += 'a'
    res38: buf.type = a
    scala> buf ++= "bcdef"
    res39: buf.type = abcdef
    scala> buf.toString
    res41: String = abcdef

## ArrayDeque

An [ArrayDeque](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayDeque.html)
is a sequence that supports efficient addition of elements in the front and in the end.
It internally uses a resizable array.

If you need to append and prepend elements to a buffer, use an `ArrayDeque` instead of
an `ArrayBuffer`.

## Queues

Scala provides mutable queues in addition to immutable ones. You use a `mQueue` similarly to how you use an immutable one, but instead of `enqueue`, you use the `+=` and `++=` operators to append. Also, on a mutable queue, the `dequeue` method will just remove the head element from the queue and return it. Here's an example:

    scala> val queue = new scala.collection.mutable.Queue[String]
    queue: scala.collection.mutable.Queue[String] = Queue()
    scala> queue += "a"
    res10: queue.type = Queue(a)
    scala> queue ++= List("b", "c")
    res11: queue.type = Queue(a, b, c)
    scala> queue
    res12: scala.collection.mutable.Queue[String] = Queue(a, b, c)
    scala> queue.dequeue
    res13: String = a
    scala> queue
    res14: scala.collection.mutable.Queue[String] = Queue(b, c)

## Stacks

A stack implements a data structure which allows to store and retrieve objects in a last-in-first-out (LIFO) fashion.
It is supported by class [mutable.Stack](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/Stack.html).

    scala> val stack = new scala.collection.mutable.Stack[Int]           
    stack: scala.collection.mutable.Stack[Int] = Stack()
    scala> stack.push(1)
    res0: stack.type = Stack(1)
    scala> stack
    res1: scala.collection.mutable.Stack[Int] = Stack(1)
    scala> stack.push(2)
    res0: stack.type = Stack(1, 2)
    scala> stack
    res3: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.top
    res8: Int = 2
    scala> stack
    res9: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.pop    
    res10: Int = 2
    scala> stack    
    res11: scala.collection.mutable.Stack[Int] = Stack(1)

## Mutable ArraySeqs

Array sequences are mutable sequences of fixed size which store their elements internally in an `Array[Object]`. They are implemented in Scala by class [ArraySeq](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArraySeq.html).

You would typically use an `ArraySeq` if you want an array for its performance characteristics, but you also want to create generic instances of the sequence where you do not know the type of the elements and you do not have a `ClassTag` to provide it at run-time. These issues are explained in the section on [arrays]({{ site.baseurl }}/overviews/collections/arrays.html).

## Hash Tables

A hash table stores its elements in an underlying array, placing each item at a position in the array determined by the hash code of that item. Adding an element to a hash table takes only constant time, so long as there isn't already another element in the array that has the same hash code. Hash tables are thus very fast so long as the objects placed in them have a good distribution of hash codes. As a result, the default mutable map and set types in Scala are based on hash tables. You can access them also directly under the names [mutable.HashSet](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashSet.html) and [mutable.HashMap](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashMap.html).

Hash sets and maps are used just like any other set or map. Here are some simple examples:

    scala> val map = scala.collection.mutable.HashMap.empty[Int,String]
    map: scala.collection.mutable.HashMap[Int,String] = Map()
    scala> map += (1 -> "make a web site")
    res42: map.type = Map(1 -> make a web site)
    scala> map += (3 -> "profit!")
    res43: map.type = Map(1 -> make a web site, 3 -> profit!)
    scala> map(1)
    res44: String = make a web site
    scala> map contains 2
    res46: Boolean = false

Iteration over a hash table is not guaranteed to occur in any particular order. Iteration simply proceeds through the underlying array in whichever order it happens to be in. To get a guaranteed iteration order, use a _linked_ hash map or set instead of a regular one. A linked hash map or set is just like a regular hash map or set except that it also includes a linked list of the elements in the order they were added. Iteration over such a collection is always in the same order that the elements were initially added.

## Weak Hash Maps

A weak hash map is a special kind of hash map where the garbage collector does not follow links from the map to the keys stored in it. This means that a key and its associated value will disappear from the map if there is no other reference to that key. Weak hash maps are useful for tasks such as caching, where you want to re-use an expensive function's result if the function is called again on the same key. If keys and function results are stored in a regular hash map, the map could grow without bounds, and no key would ever become garbage. Using a weak hash map avoids this problem. As soon as a key object becomes unreachable, it's entry is removed from the weak hashmap. Weak hash maps in Scala are implemented by class [WeakHashMap](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/WeakHashMap.html) as a wrapper of an underlying Java implementation `java.util.WeakHashMap`.

## Concurrent Maps

A concurrent map can be accessed by several threads at once. In addition to the usual [Map](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Map.html) operations, it provides the following atomic operations:

### Operations in Class concurrent.Map

| WHAT IT IS  	  	            | WHAT IT DOES				     |
| ------       	       	        | ------					     |
|  `m.putIfAbsent(k, v)`  	    |Adds key/value binding `k -> v` unless `k` is already defined in `m`         |
|  `m.remove(k, v)`  	          |Removes entry for `k` if it is currently mapped to `v`.                      |
|  `m.replace(k, old, new)`  	  |Replaces value associated with key `k` to `new`, if it was previously bound to `old`. |
|  `m.replace (k, v)`  	        |Replaces value associated with key `k` to `v`, if it was previously bound to some value.|

`concurrent.Map` is a trait in the Scala collections library. Currently, it has two implementations. The first one is Java's `java.util.concurrent.ConcurrentMap`, which can be converted automatically into a Scala map using the [standard Java/Scala collection conversions]({{ site.baseurl }}/overviews/collections/conversions-between-java-and-scala-collections.html). The second implementation is [TrieMap](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/concurrent/TrieMap.html), which is a lock-free implementation of a hash array mapped trie.

## Mutable Bitsets

A mutable bit of type [mutable.BitSet](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/BitSet.html) set is just like an immutable one, except that it is modified in place. Mutable bit sets are slightly more efficient at updating than immutable ones, because they don't have to copy around `Long`s that haven't changed.

    scala> val bits = scala.collection.mutable.BitSet.empty
    bits: scala.collection.mutable.BitSet = BitSet()
    scala> bits += 1
    res49: bits.type = BitSet(1)
    scala> bits += 3
    res50: bits.type = BitSet(1, 3)
    scala> bits
    res51: scala.collection.mutable.BitSet = BitSet(1, 3)
