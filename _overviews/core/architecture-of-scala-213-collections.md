---
layout: singlepage-overview
title: The Architecture of Scala 2.13’s Collections

permalink: /overviews/core/:title.html
---

**Julien Richard-Foy**

This document describes the architecture of the Scala collections
framework in detail. Compared to
[the Collections Introduction]({{ site.baseurl }}/overviews/collections/introduction.html) you
will find out more about the internal workings of the framework. You
will also learn how this architecture helps you define your own
collections in a few lines of code, while reusing the overwhelming
part of collection functionality from the framework.

[The Collections API]({{ site.baseurl }}/overviews/collections/introduction.html)
contains a large number of collection
operations, which exist uniformly on many different collection
implementations. Implementing every collection operation anew for
every collection type would lead to an enormous amount of code, most
of which would be copied from somewhere else. Such code duplication
could lead to inconsistencies over time, when an operation is added or
modified in one part of the collection library but not in others. The
principal design objective of the collections framework is to
avoid any duplication, defining every operation in as few places as
possible. (Ideally, everything should be defined in one place only,
but there are a few exceptions where things needed to be redefined.)
The design approach was to implement most operations in collection
"templates" that can be flexibly inherited from individual base
classes and implementations.
 
More precisely, these templates address the following challenges:

- some transformation operations return the same concrete collection
  type (e.g. `filter`, called on a `List[Int]` returns a `List[Int]`),
- some transformation operations return the same concrete collection
  type with a different type of elements (e.g. `map`, called on a
  `List[Int]`, can return a `List[String]`),
- some collections have a single element type (e.g. `List[A]`), while
  some others have two (e.g. `Map[K, V]`),
- some operations on collections return a different concrete collection
  depending on the element type. For example, `map` called on a `Map`
  returns a `Map` if the mapping function returns a key-value pair, but
  otherwise returns an `Iterable`,
- transformation operations on some collections require additional
  implicit parameters (e.g. `map` on `SortedSet` takes an implicit
  `Ordering`),
- some collections are strict (e.g. `List`), while some others are
  non-strict (e.g. `View` and `LazyList`).
 
The following sections explain how the templates address these
challenges.

## Factoring out common operations ##

This section presents the variability found in collections, which has to
be abstracted over to define reusable operation implementations.

We can group collection operations into two categories:

- **transformation** operations, which return another collection (e.g.
  `map`, `filter`, `zip`, …),
- **reduction** operations, which return a single value (e.g. `isEmpty`,
  `foldLeft`, `find`, …).

Transformation operations are harder to implement in template traits
because we want them to return collection types that are unknown yet.
For instance, consider the signature of the `map` operation on `List[A]`
and `Vector[A]`:

~~~ scala
trait List[A] {
  def map[B](f: A => B): List[B]
}

trait Vector[A] {
  def map[B](f: A => B): Vector[B]
}
~~~

To generalize the type signature of `map` we have to abstract over
the resulting *collection type constructor*.

A slightly different example is `filter`. Consider its type signature on
`List[A]` and `Map[K, V]`:

~~~ scala
trait List[A] {
  def filter(p: A => Boolean): List[A]
}

trait Map[K, V] {
  def filter(p: ((K, V)) => Boolean): Map[K, V]
}
~~~

To generalize the type signature of `filter` we have to abstract
over the resulting *collection type*.

In summary, operations that change the elements type (`map`,
`flatMap`, `collect`, etc.) need to abstract over the resulting
collection type constructor, and operations that keep the same
elements type (`filter`, `take`, `drop`, etc.) need to abstract
over the resulting collection type.

## Abstracting over collection types ##

The template trait `IterableOps` implements the operations available
on the `Iterable[A]` collection type.

Here is the header of trait `IterableOps`:

~~~ scala
trait IterableOps[+A, +CC[_], +C] { … }
~~~

The type parameter `A` stands for the element type of the iterable,
the type parameter `CC` stands for the collection type constructor
and the type parameter `C` stands for the collection type.

This allows us to define the signature of `filter` and `map` like
so:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {
  def filter(p: A => Boolean): C = …
  def map[B](f: A => B): CC[B] = …
}
~~~

Leaf collection types appropriately instantiate the type
parameters. For instance, in the case of `List[A]` we want `CC` to
be `List` and `C` to be `List[A]`:

~~~ scala
trait List[+A] extends Iterable[A]
  with IterableOps[A, List, List[A]]
~~~

## Four branches of templates traits ##

The astute reader might have noticed that the given type signature
for the `map` operation doesn’t work with `Map` collections because
the `CC[_]` type parameter of the `IterableOps` trait takes one type
parameter whereas `Map[K, V]` takes two type parameters.

To support collection types constructors with two types parameters
we have another template trait named `MapOps`:

~~~ scala
trait MapOps[K, +V, +CC[_, _], +C] extends IterableOps[(K, V), Iterable, C] {
  def map[K2, V2](f: ((K, V)) => (K2, V2)): CC[K2, V2] = …
}
~~~ 

And then `Map[K, V]` can extend this trait and appropriately instantiate its
type parameters:

~~~ scala
trait Map[K, V] extends Iterable[(K, V)]
  with MapOps[K, V, Map, Map[K, V]]
~~~

Note that the `MapOps` trait inherits from `IterableOps` so that operations
defined in `IterableOps` are also available in `MapOps`. Also note that
the collection type constructor passed to the `IterableOps` trait is
`Iterable`. This means that `Map[K, V]` inherits two overloads of the `map`
operation:

~~~ scala
// from MapOps
def map[K2, V2](f: ((K, V)) => (K2, V2)): Map[K2, V2]

// from IterableOps
def map[B](f: ((K, V)) => B): Iterable[B]
~~~

At use-site, when you call the `map` operation, the compiler selects one of
the two overloads. If the function passed as argument to `map` returns a pair,
both functions are applicable. In this case, the version from `MapOps` is used
because it is more specific by the rules of overloading resolution, so the
resulting collection is a `Map`. If the argument function does not return a pair,
only the version defined in `IterableOps` is applicable. In this case, the
resulting collection is an `Iterable`. This is how we follow the
“same-result-type” principle: wherever possible a transformation method on a
collection yields a collection of the same type.

In summary, the fact that `Map` collection types take two type parameters makes
it impossible to unify their transformation operations with the ones from
`IterableOps`, hence the specialized `MapOps` template trait.

There is another situation where the type signatures of the transformation
operations defined in `IterableOps` don’t match the type signature of a
more concrete collection type: `SortedSet[A]`. In that case the type
signature of the `map` operation is the following:

~~~ scala
def map[B](f: A => B)(implicit ord: Ordering[B]): SortedSet[B]
~~~

The difference with the signature we have in `IterableOps` is that here
we need an implicit `Ordering` instance for the type of elements.

Like for `Map`, `SortedSet` needs a specialized template trait with
overloads for transformation operations:

~~~ scala
trait SortedSetOps[A, +CC[_], +C] extends IterableOps[A, Set, C] {

  def map[B](f: A => B)(implicit ord: Ordering[B]): CC[B] = …

}
~~~

And then collection types that inherit the `SortedSetOps` trait appropriately
instantiate its type parameters:

~~~ scala
trait SortedSet[A] extends SortedSetOps[A, SortedSet, SortedSet[A]]
~~~

Last, there is a fourth kind of collection that requires a specialized template
trait: `SortedMap[K, V]`. This type of collection has two type parameters and
needs an implicit ordering instance on the type of keys. Therefore we have a
`SortedMapOps` template trait that provides the appropriate overloads.

In total, we’ve seen that we have four branches of template traits:


  kind     |  not sorted   |  sorted
-----------|---------------|----------------
`CC[_]`    | `IterableOps` | `SortedSetOps`
`CC[_, _]` | `MapOps`      | `SortedMapOps`

Here is a diagram illustrating the architecture:

![]({{ site.baseurl }}/resources/images/collections-architecture.svg)

Template traits are in grey whereas collection types are in white.

## Strict and non-strict collections ##

Another difference that has been taken into account in the design of the
collections framework is the fact that some collection types eagerly
evaluate their elements (e.g. `List`, `Set`, etc.), whereas others
delay their evaluation until the element is effectively accessed (e.g.
`LazyList` and `View`). The former category of collections is said to
be “strict”, whereas the latter is said to be “non-strict”.

Thus, the default implementation of transformation operations must
preserve the “strictness” of the concrete collection type that inherits
these implementations. For instance, we want the default `map` implementation
to be non-strict when inherited by a `View`, and strict when inherited
by a `List`.

To achieve that, operations are, by default, implemented in terms of a
non-strict `View`. For the record, a `View` “describes” an operation applied
to a collection but does not evaluate its result until the `View` is
effectively traversed. Here is the (simplified) definition of `View`:

~~~ scala
trait View[+A] extends Iterable[A] with IterableOps[A, View, View[A]] {
  def iterator: Iterator[A]
}
~~~

A `View` is an `Iterable` that has only one abstract method returning
an `Iterator` for traversing its elements. The `View` elements are
evaluated only when its `Iterator` is traversed.

## Operations implementation ##

Now that we are more familiar with the hierarchy of the template traits, we can have
a look at the actual implementation of some operations. Consider for instance the
implementations of `filter` and `map`:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {

  def filter(pred: A => Boolean): C =
    fromSpecific(new View.Filter(this, pred))

  def map[B](f: A => B): CC[B] = 
    from(new View.Map(this, f))

  protected def fromSpecific(coll: IterableOnce[A]): C
  protected def from[E](it: IterableOnce[E]): CC[E]
}
~~~

Let’s detail the implementation of `filter`, step by step:

- the instantiation of `View.Filter` creates a (non-strict) `View` that filters the elements
  of the underlying collection ;
- the call to `fromSpecific` turns the `View` into a concrete
  collection `C`. The implementation of `fromSpecific` is left to
  concrete collections: they can decide to evaluate in a strict or non-strict way
  the elements resulting from the operation.

The implementation of `map` is similar, except that instead of using
`fromSpecific` it uses `from` which takes as parameter an
iterable whose element type `E` is arbitrary.

Actually, the `from` operation is not defined directly in `IterableOps` but is accessed via
an (abstract) `iterableFactory` member:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {

  def iterableFactory: IterableFactory[CC]
  
  def map[B](f: A => B): CC[B] = 
    iterableFactory.from(new View.Map(this, f))  

}
~~~

This `iterableFactory` member is implemented by concrete collections and typically
refer to their companion object, which provides factory methods to create concrete
collection instances. Here is an excerpt of the definition of `IterableFactory`:

~~~ scala
trait IterableFactory[+CC[_]] {
  def from[A](source: IterableOnce[A]): CC[A]
}
~~~

Last but not least, as explained in the above sections, since we have four branches
of template traits, we have four corresponding branches of factories. For instance,
here are the relevant parts of code of the `map` operation implementation in `MapOps`:

~~~ scala
trait MapOps[K, +V, +CC[_, _], +C]
  extends IterableOps[(K, V), Iterable, C] {

  def map[K2, V2](f: ((K, V)) => (K2, V2)): CC[K2, V2] =
    mapFactory.from(new View.Map(this, f))

  // Similar to iterableFactory, but for Map collection types
  def mapFactory: MapFactory[CC]

}

trait MapFactory[+CC[_, _]] {
  def from[K, V](it: IterableOnce[(K, V)]): CC[K, V]
}
~~~

## When a strict evaluation is preferable (or unavoidable) ##

In the previous sections we explained that the “strictness” of concrete collections
should be preserved by default operation implementations. However in some cases this
leads to less efficient implementations. For instance, `partition` has to perform
two traversals of the underlying collection. In some other case (e.g. `groupBy`) it
is simply not possible to implement the operation without evaluating the collection
elements.

For those cases, we also provide ways to implement operations in a strict mode.
The pattern is different: instead of being based on a `View`, it is based on a
`Builder`. Here is an outline of the `Builder` trait:

~~~ scala
package scala.collection.mutable

trait Builder[-A, +C] {
  def addOne(elem: A): this.type
  def result(): C
}
~~~

Builders are generic in both the element type `A` and the type of collection they
return, `C`.
You can add an element `x` to a builder `b` with `b.addOne(x)` (or `b += x`). The
`result()` method returns a collection from a builder.

By symmetry with `fromSpecificIterable` and `fromIterable`, template traits provide
ways to get a builder resulting in a collection with the same type of elements, and
to get a builder resulting in a collection of the same type but with a different
type of elements. The following code shows the relevant parts of `IterableOps` and
`IterableFactory` to build collections in both strict and non-strict modes:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {
  def iterableFactory: IterableFactory[CC]
  protected def fromSpecific(coll: IterableOnce[A]): C
  protected def newSpecificBuilder: Builder[A, C]
}

trait IterableFactory[+CC[_]] {
  def from[A](source: IterableOnce[A]): CC[A]
  def newBuilder[A]: Builder[A, CC[A]]
}
~~~

Note that, in general, an operation that doesn’t *have to* be strict should
be implemented in a non-strict mode, otherwise it would lead to surprising
behaviour when used on a non-strict concrete collection (you can read more
about that statement in
[this article](https://www.scala-lang.org/blog/2017/11/28/view-based-collections.html)).
That being said,
the strict mode is often more efficient. This is why we provide template
traits whose operation implementations have been overridden to take
advantage of strict builders. The name of these template traits always
starts with `StrictOptimized`. You should use such a template trait for
your custom collection if it is a strict collection.

## Summary ##

This document explains that:
- collection operations are implemented in template traits suffixed
  with `Ops` (e.g. `IterableOps[A, CC[_], C]`),
- these template traits abstract over the type of collection elements (`A`),
  the type constructor of returned collections (`CC`) and the type of
  returned collections (`C`),
- there are four branches of template traits (`IterableOps`, `MapOps`,
  `SortedSetOps` and `SortedMapOps`),
- some transformation operations (e.g. `map`) are overloaded to return
  different result types according to their arguments type,
- the logic of transformation operations is primarily implemented in
  views but there are specialized versions of template traits
  (prefixed with `StrictOptimized`) that override these operations
  to use a builder based approach.

You now have all the required knowledge to implement
[custom collection types]({{ site.baseurl }}/overviews/core/custom-collections.html).

### Acknowledgement ###

This page contains material adapted from the book
[Programming in Scala](https://www.artima.com/shop/programming_in_scala) by
Odersky, Spoon and Venners. We thank Artima for graciously agreeing to its
publication.
