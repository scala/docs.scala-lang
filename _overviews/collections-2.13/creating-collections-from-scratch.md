---
layout: multipage-overview
title: Creating Collections From Scratch
partof: collections-213
overview-name: Collections

num: 16
previous-page: iterators
next-page: conversions-between-java-and-scala-collections

permalink: /overviews/collections-2.13/:title.html
---

You have syntax `List(1, 2, 3)` to create a list of three integers and `Map('A' -> 1, 'C' -> 2)` to create a map with two bindings. This is actually a universal feature of Scala collections. You can take any collection name and follow it by a list of elements in parentheses. The result will be a new collection with the given elements. Here are some more examples:

    Iterable()                // An empty collection
    List()                    // The empty list
    List(1.0, 2.0)            // A list with elements 1.0, 2.0
    Vector(1.0, 2.0)          // A vector with elements 1.0, 2.0
    Iterator(1, 2, 3)         // An iterator returning three integers.
    Set(dog, cat, bird)       // A set of three animals
    HashSet(dog, cat, bird)   // A hash set of the same animals
    Map('a' -> 7, 'b' -> 0)   // A map from characters to integers

"Under the covers" each of the above lines is a call to the `apply` method of some object. For instance, the third line above expands to

    List.apply(1.0, 2.0)

So this is a call to the `apply` method of the companion object of the `List` class. That method takes an arbitrary number of arguments and constructs a list from them. Every collection class in the Scala library has a companion object with such an `apply` method. It does not matter whether the collection class represents a concrete implementation, like `List`, `LazyList` or `Vector`, or whether it is an abstract base class such as `Seq`, `Set` or `Iterable`. In the latter case, calling apply will produce some default implementation of the abstract base class. Examples:

    scala> List(1, 2, 3)
    res17: List[Int] = List(1, 2, 3)
    scala> Iterable(1, 2, 3)
    res18: Iterable[Int] = List(1, 2, 3)
    scala> mutable.Iterable(1, 2, 3)
    res19: scala.collection.mutable.Iterable[Int] = ArrayBuffer(1, 2, 3)

Besides `apply`, every collection companion object also defines a member `empty`, which returns an empty collection. So instead of `List()` you could write `List.empty`, instead of `Map()`, `Map.empty`, and so on.

The operations provided by collection companion objects are summarized in the following table. In short, there's

* `concat`, which concatenates an arbitrary number of collections together,
* `fill` and `tabulate`, which generate single or multi-dimensional collections of given dimensions initialized by some expression or tabulating function,
* `range`, which generates integer collections with some constant step length, and
* `iterate` and `unfold`, which generates the collection resulting from repeated application of a function to a start element or state.

### Factory Methods for Sequences

| WHAT IT IS  	  	        | WHAT IT DOES				     |
| ------       	       	    | ------					     |
|  `C.empty`         	    | The empty collection. |
|  `C(x, y, z)`      	    | A collection consisting of elements `x, y, z`. |
|  `C.concat(xs, ys, zs)`   | The collection obtained by concatenating the elements of `xs, ys, zs`. |
|  `C.fill(n){e}`      	    | A collection of length `n` where each element is computed by expression `e`. |
|  `C.fill(m, n){e}`        | A collection of collections of dimension `m×n` where each element is computed by expression `e`. (exists also in higher dimensions). |
|  `C.tabulate(n){f}`       | A collection of length `n` where the element at each index i is computed by `f(i)`. |
|  `C.tabulate(m, n){f}`    | A collection of collections of dimension `m×n` where the element at each index `(i, j)` is computed by `f(i, j)`. (exists also in higher dimensions). |
|  `C.range(start, end)`    | The collection of integers `start` ... `end-1`. |
|  `C.range(start, end, step)`| The collection of integers starting with `start` and progressing by `step` increments up to, and excluding, the `end` value. |
|  `C.iterate(x, n)(f)`     | The collection of length `n` with elements `x`, `f(x)`, `f(f(x))`, ... |
|  `C.unfold(init)(f)`      | A collection that uses a function `f` to compute its next element and state, starting from the `init` state.|
