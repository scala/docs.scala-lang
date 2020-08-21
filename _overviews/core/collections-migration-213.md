---
layout: singlepage-overview
title: Migrating a Project to Scala 2.13's Collections
permalink: /overviews/core/:title.html
---

This document describes the main changes for collection users that migrate to Scala 2.13 and shows
how to cross-build projects with Scala 2.11 / 2.12 and 2.13.

For an in-depth overview of the Scala 2.13 collections library, see the [collections guide]({{ site.baseurl }}/overviews/collections-2.13/introduction.html). The implementation details of the 2.13 collections are explained in the document [the architecture of Scala collections]({{ site.baseurl }}/overviews/core/architecture-of-scala-213-collections.html).

The most important changes in the Scala 2.13 collections library are:
  - `scala.Seq[+A]` is now an alias for `scala.collection.immutable.Seq[A]` (instead of `scala.collection.Seq[A]`). Note that this also changes the type of Scala varargs methods.
  - `scala.IndexedSeq[+A]` is now an alias for `scala.collection.immutable.IndexedSeq[A]` (instead of `scala.collection.IndexedSeq[A]`).
  - Transformation methods no longer have an implicit `CanBuildFrom` parameter. This makes the library easier to understand (in source code, Scaladoc, and IDE code completion). It also makes compiling user code more efficient.
  - The type hierarchy is simplified. `Traversable` no longer exists, only `Iterable`.
  - The `to[Collection]` method was replaced by the `to(Collection)` method.
  - Views have been vastly simplified and work reliably now. They no longer extend their corresponding collection type, for example, an `IndexedSeqView` no longer extends `IndexedSeq`.
  - `collection.breakOut` no longer exists, use `.view` and `.to(Collection)` instead.
  - Immutable hash sets and hash maps have a new implementation (`ChampHashSet` and `ChampHashMap`, based on the ["CHAMP" encoding](https://michael.steindorfer.name/publications/oopsla15.pdf)).
  - New collection types:
    - `immutable.ArraySeq` is an effectively immutable sequence that wraps an array
    - `immutable.LazyList` is a linked list that is lazy in its state, i.e., whether it's empty or non-empty. This allows creating a `LazyList` without evaluating the `head` element. `immutable.Stream`, which has a strict `head` and a lazy `tail`, is deprecated.
  - Deprecated collections were removed (`MutableList`, `immutable.Stack`, others)
  - Parallel collections are now in a separate hierarchy in a [separate module](https://github.com/scala/scala-parallel-collections).
  - The `scala.jdk.StreamConverters` object provides extension methods to create (sequential or parallel) Java 8 streams for Scala collections.

## Tools for migrating and cross-building

The [scala-collection-compat](https://github.com/scala/scala-collection-compat) is a library released for 2.11, 2.12 and 2.13 that provides some of the new APIs from Scala 2.13 for the older versions. This simplifies cross-building projects.

The module also provides [migration rules](https://github.com/scala/scala-collection-compat#migration-tool) for [scalafix](https://scalacenter.github.io/scalafix/docs/users/installation.html) that can update a project's source code to work with the 2.13 collections library.

## scala.Seq, varargs and scala.IndexedSeq migration

In Scala 2.13 `scala.Seq[+A]` is an alias for `scala.collection.immutable.Seq[A]`, instead of `scala.collection.Seq[A]`, and `scala.IndexedSeq[+A]` is an alias for `scala.collection.immutable.IndexedSeq[A]`. These changes require some planning depending on how your code is going to be used.

The change in definition of `scala.Seq` also has the effect of making the type of varargs parameters immutable sequences, due to [SLS 6.6][], so in
a method such as `orderFood(xs: _*)` the varargs parameter `xs` must be an immutable sequence.

[SLS 6.6]: https://www.scala-lang.org/files/archive/spec/2.12/06-expressions.html#function-applications

Therefore any method signature in Scala 2.13 which includes `scala.Seq`, varargs, or `scala.IndexedSeq` is going
to have a breaking change in API semantics (as the immutable sequence types require more &mdash; immutability &mdash; than the
not-immutable types).  For example, users of a method like `def orderFood(order: Seq[Order]): Seq[Food]` would
previously have been able to pass in an `ArrayBuffer` of `Order`, but cannot in 2.13.

### Migrating varargs

The change for varargs is unavoidable, as you cannot change the type used at definition site.  The options
available for migrating the usage sites are the following:

- change the value to already be an immutable sequence, which allows for direct varargs usage: `xs: _*`,
- change the value to be an immutable sequence on the fly by calling `.toSeq`: `xs.toSeq: _*`, which will only
    copy data if the sequence wasn't already immutable
- use `scala.collection.immutable.ArraySeq.unsafeWrapArray` to wrap your array and avoid copying, but see its
  scaladoc

### Option 1: migrate back to scala.collection.Seq

The first, in some ways simplest, migration strategy for all non-varargs usages of `scala.Seq` is to replace
them with `scala.collection.Seq` (and require users to call `.toSeq` or `unsafeWrapArray` when passing such
sequences to varargs methods).

We recommend using `import scala.collection`/`import scala.collection.immutable` and
`collection.Seq`/`immutable.Seq`.

We recommend against using `import scala.collection.Seq`, which shadows the automatically imported `scala.Seq`,
because even if it's a oneline change it causes name confusion.  For code generation or macros the safest option
is using the fully-qualified `_root_.scala.collection.Seq`.

As an example, the migration would look something like this:

~~~ scala
import scala.collection

object FoodToGo {
  def orderFood(order: collection.Seq[Order]): collection.Seq[Food]
}
~~~

However users of this code in Scala 2.13 would also have to migrate, as the result type is source-incompatible
with any `scala.Seq` (or just `Seq`) usage in their code:

~~~ scala
val food: Seq[Food] = FoodToGo.orderFood(order) // won't compile
~~~

The simplest workaround is to ask your users to call `.toSeq` on the result which will return an immutable Seq,
and only copy data if the sequence wasn't immutable:

~~~ scala
val food: Seq[Food] = FoodToGo.orderFood(order).toSeq // add .toSeq
~~~

### Option 2: use scala.collection.Seq for parameters and scala.collection.immutable.Seq for result types

The second, intermediate, migration strategy would be to change all methods to accept not-immutable Seq but
return immutable Seq, following the [robustness principle][] (also known as "Postel's law"):

[robustness principle]: https://en.wikipedia.org/wiki/Robustness_principle

~~~ scala
import scala.collection
import scala.collection.immutable

object FoodToGo {
  def orderFood(order: collection.Seq[Order]): immutable.Seq[Food]
}
~~~

### Option 3: use immutable sequences

The third migration strategy is to change your API to use immutable sequences for both parameter and result
types.  When cross-building your library for Scala 2.12 and 2.13 this could either mean:

- continuing to use `scala.Seq` which means it stays source and binary-compatible in 2.12, but would have to
    have immutable sequence semantics (but that might already be the case).
- switch to explicitly using immutable Seq in both Scala 2.12 and 2.13, which means breaking source, binary and
    (possibly) semantic compatibility in 2.12:

~~~ scala
import scala.collection.immutable

object FoodToGo {
  def orderFood(order: immutable.Seq[Order]): immutable.Seq[Food]
}
~~~

### Shadowing scala.Seq and scala.IndexedSeq

You maybe be interested in entirely banning plain `Seq` usage.  You can use the compiler to do so by declaring
your own package-level (and package private) `Seq` type which will mask `scala.Seq`.

~~~ scala
package example

import scala.annotation.compileTimeOnly

/**
  * In Scala 2.13, `scala.Seq` changed from aliasing `scala.collection.Seq` to aliasing
  * `scala.collection.immutable.Seq`.  In this code base usage of unqualified `Seq` is banned: use
  * `immutable.Seq` or `collection.Seq` instead.
  *
  * import scala.collection
  * import scala.collection.immutable
  *
  * This `Seq` trait is a dummy type to prevent the use of `Seq`.
  */
@compileTimeOnly("Use immutable.Seq or collection.Seq")
private[example] trait Seq[A1]

/**
  * In Scala 2.13, `scala.IndexedSeq` changed from aliasing `scala.collection.IndexedSeq` to aliasing
  * `scala.collection.immutable.IndexedSeq`.  In this code base usage of unqualified `IndexedSeq` is
  * banned: use `immutable.IndexedSeq` or `collection.IndexedSeq`.
  *
  * import scala.collection
  * import scala.collection.immutable
  *
  * This `IndexedSeq` trait is a dummy type to prevent the use of `IndexedSeq`.
  */
@compileTimeOnly("Use immutable.IndexedSeq or collection.IndexedSeq")
private[example] trait IndexedSeq[A1]
~~~

This might be useful during the migration to catch usages of unqualified `Seq` and `IndexedSeq`.

## What are the breaking changes?

The following table summarizes the breaking changes. The "Automatic Migration Rule" column gives the name of the migration rule that can be used to automatically update old code to the new expected form.

<div style="overflow:auto;" markdown="block">

| Description | Old Code | New Code | Automatic Migration Rule |
| ----------- | -------- | -------- | ------------------------ |
| Method `to[C[_]]` has been removed (it might be reintroduced but deprecated, though) | `xs.to[List]` | `xs.to(List)` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `mapValues` and `filterKeys` now return a `MapView` instead of a `Map` | `kvs.mapValues(f)` | `kvs.mapValues(f).toMap` | `RoughlyMapValues` |
| `Iterable` no longer has a `sameElements` operation | `xs1.sameElements(xs2)` | `xs1.iterator.sameElements(xs2)` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `collection.breakOut` no longer exists | `val xs: List[Int] = ys.map(f)(collection.breakOut)` | `val xs = ys.iterator.map(f).to(List)` | `Collection213Upgrade` |
| `zip` on `Map[K, V]` now returns an `Iterable` | `map.zip(iterable)` | `map.zip(iterable).toMap` | `Collection213Experimental` |
| `ArrayBuilder.make` does not accept parens anymore | `ArrayBuilder.make[Int]()` | `ArrayBuilder.make[Int]` | `Collection213Upgrade`, `Collections213CrossCompat` |

</div>

Some classes have been removed, made private or have no equivalent in the new design:

- `ArrayStack`
- `mutable.FlatHashTable`
- `mutable.HashTable`
- `History`
- `Immutable`
- `IndexedSeqOptimized`
- `LazyBuilder`
- `mutable.LinearSeq`
- `LinkedEntry`
- `MapBuilder`
- `Mutable`
- `MutableList`
- `Publisher`
- `ResizableArray`
- `RevertibleHistory`
- `SeqForwarder`
- `SetBuilder`
- `Sizing`
- `SliceInterval`
- `StackBuilder`
- `StreamView`
- `Subscriber`
- `Undoable`
- `WrappedArrayBuilder`

Other notable changes are:

  - `Iterable.partition` invokes `iterator` twice on non-strict collections and assumes it gets two iterators over the same elements. Strict subclasses override `partition` do perform only a single traversal
  - Equality between collections is not anymore defined at the level of `Iterable`. It is defined separately in the `Set`, `Seq` and `Map` branches. Another consequence is that `Iterable` does not anymore have a `canEqual` method.
  - The new collections makes more use of overloading. You can find more information about the motivation
    behind this choice [here](https://scala-lang.org/blog/2017/05/30/tribulations-canbuildfrom.html). For instance, `Map.map` is overloaded:

        scala> Map(1 -> "a").map
          def map[B](f: ((Int, String)) => B): scala.collection.immutable.Iterable[B]
          def map[K2, V2](f: ((Int, String)) => (K2, V2)): scala.collection.immutable.Map[K2,V2]

    Type inference has been improved so that `Map(1 -> "a").map(x => (x._1 + 1, x._2))` works, the compiler can infer the parameter type for the function literal. However, using a method reference in 2.13.0-M4 (improvement are on the way for 2.13.0) does not work, and an explicit eta-expansion is necessary:

        scala> def f(t: (Int, String)) = (t._1 + 1, t._2)
        scala> Map(1 -> "a").map(f)
                                ^
              error: missing argument list for method f
              Unapplied methods are only converted to functions when a function type is expected.
              You can make this conversion explicit by writing `f _` or `f(_)` instead of `f`.
        scala> Map(1 -> "a").map(f _)
        res10: scala.collection.immutable.Map[Int,String] = ChampHashMap(2 -> a)
  - `View`s have been completely redesigned and we expect their usage to have a more predictable evaluation model.
    You can read more about the new design [here](https://scala-lang.org/blog/2017/11/28/view-based-collections.html).
  - `mutable.ArraySeq` (which wraps an `Array[AnyRef]` in 2.12, meaning that primitives were boxed in the array) can now wrap boxed and unboxed arrays. `mutable.ArraySeq` in 2.13 is in fact equivalent to `WrappedArray` in 2.12, there are specialized subclasses for primitive arrays. Note that a `mutable.ArraySeq` can be used either way for primitive arrays (TODO: document how). `WrappedArray` is deprecated.
  - There is no "default" `Factory` (previously known as `[A, C] => CanBuildFrom[Nothing, A, C]`): use `Factory[A, Vector[A]]` explicitly instead.
 - `Array.deep` has been removed.
 
## Breaking changes with old syntax still supported

The following table lists the changes that continue to work with a deprecation warning.

<div style="overflow:auto;" markdown="block">

| Description | Old Code | New Code | Automatic Migration Rule |
| ----------- | -------- | -------- | ------------------------ |
| `collection.Set/Map` no longer have `+` and `-` operations | `xs + 1 - 2` | `xs ++ Set(1) -- Set(2)` | `Collection213Experimental` |
| `collection.Map` no longer have `--` operation | `map -- keys` | `map.to(immutable.Map) -- keys` | |
| `immutable.Set/Map`: the `+` operation no longer has an overload accepting multiple values | `Set(1) + (2, 3)` | `Set(1) + 2 + 3` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `mutable.Map` no longer have an `updated` method | `mutable.Map(1 -> 2).updated(1, 3)` | `mutable.Map(1 -> 2).clone() += 1 -> 3` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `mutable.Set/Map` no longer have a `+` operation | `mutable.Set(1) + 2` | `mutable.Set(1).clone() += 2` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `SortedSet`: the `to`, `until` and `from` methods are now called `rangeTo`, `rangeUntil` and `rangeFrom`, respectively | `xs.until(42)` | `xs.rangeUntil(42)` |  |
| `Traversable` and `TraversableOnce` are replaced with `Iterable` and `IterableOnce`, respectively | `def f(xs: Traversable[Int]): Unit` | `def f(xs: Iterable[Int]): Unit` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `Stream` is replaced with `LazyList` | `Stream.from(1)` | `LazyList.from(1)` | `Collection213Roughly` |
| `Seq#union` is replaced with `concat` | `xs.union(ys)` | `xs.concat(ys)` | |
| `Stream#append` is replaced with `lazyAppendAll` | `xs.append(ys)` | `xs.lazyAppendedAll(ys)` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `IterableOnce#toIterator` is replaced with `IterableOnce#iterator` | `xs.toIterator` | `xs.iterator` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `copyToBuffer` has been deprecated | `xs.copyToBuffer(buffer)` | `buffer ++= xs` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `TupleNZipped` has been replaced with `LazyZipN` | `(xs, ys).zipped` | `xs.lazyZip(ys)` | `Collection213Upgrade` |
| `retain` has been renamed to `filterInPlace` | `xs.retain(f)` | `xs.filterInPlace(f.tupled)` | `Collection213Upgrade` |
| `:/` and `/:` operators have been deprecated | `(xs :\ y)(f)` | `xs.foldRight(y)(f)` | `Collection213Upgrade`, `Collections213CrossCompat` |
| `companion` operation has been renamed to `iterableFactory` | `xs.companion` | `xs.iterableFactory` |  |

</div>

## Deprecated things in 2.12 that have been removed in 2.13

- `collection.JavaConversions`. Use `scala.jdk.CollectionConverters` instead. Previous advice was to use `collection.JavaConverters` which is now deprecated ;
- `collection.mutable.MutableList` (was not deprecated in 2.12 but was considered to be an implementation detail for implementing other collections). Use an `ArrayDeque` or `mutable.ListBuffer` instead, or a `List` and a `var` ;
- `collection.immutable.Stack`. Use a `List` instead ;
- `StackProxy`, `MapProxy`, `SetProxy`, `SeqProxy`, etc. No replacement ;
- `SynchronizedMap`, `SynchronizedBuffer`, etc. Use `java.util.concurrent` instead ;

## Are there new collection types?

`scala.collection.immutable.ArraySeq` is an immutable sequence backed by an array. It is used to pass varargs parameters.

The [`scala-collection-contrib`](https://github.com/scala/scala-collection-contrib) module provides decorators enriching the collections with new operations. You can
think of this artifact as an incubator: if we get evidence that these operations should be part of the core,
we might eventually move them.

The following collections are provided:

- `MultiSet` (both mutable and immutable)
- `SortedMultiSet` (both mutable and immutable)
- `MultiDict` (both mutable and immutable)
- `SortedMultiDict` (both mutable and immutable)

## Are there new operations on collections?

The following new partitioning operations are available:

~~~ scala
def groupMap[K, B](key: A => K)(f: A => B): Map[K, CC[B]] // (Where `CC` can be `List`, for instance)
def groupMapReduce[K, B](key: A => K)(f: A => B)(g: (B, B) => B): Map[K, B]
~~~

`groupMap` is equivalent to `groupBy(key).mapValues(_.map(f))`.

`groupMapReduce` is equivalent to `groupBy(key).mapValues(_.map(f).reduce(g))`.

Mutable collections now have transformation operations that modify the collection in place:

~~~ scala
def mapInPlace(f: A => A): this.type
def flatMapInPlace(f: A => IterableOnce[A]): this.type
def filterInPlace(p: A => Boolean): this.type
def patchInPlace(from: Int, patch: scala.collection.Seq[A], replaced: Int): this.type
~~~

Other new operations are `distinctBy` and `partitionMap`

~~~ scala
def distinctBy[B](f: A => B): C // `C` can be `List[Int]`, for instance
def partitionMap[A1, A2](f: A => Either[A1, A2]): (CC[A1], CC[A2]) // `CC` can be `List`, for instance
~~~

Last, additional operations are provided by the `scala-collection-contrib` module. You can
think of this artifact as an incubator: if we get evidence that these operations should be part of the core,
we might eventually move them.

The new operations are provided via an implicit enrichment. You need to add the following import to make them
available:

~~~ scala
import strawman.collection.decorators._
~~~

The following operations are provided:

- `Seq`
    - `intersperse`
- `Map`
    - `zipByKey` / `join` / `zipByKeyWith`
    - `mergeByKey` / `fullOuterJoin` / `mergeByKeyWith` / `leftOuterJoin` / `rightOuterJoin`

## Are there new implementations of existing collection types (changes in performance characteristics)?

The default `Set` and `Map` are backed by a `ChampHashSet` and a `ChampHashMap`, respectively. The performance characteristics are the same but the
operation implementations are faster. These data structures also have a lower memory footprint.

`mutable.Queue` and `mutable.Stack` now use `mutable.ArrayDeque`. This data structure supports constant time index access, and amortized constant time
insert and remove operations.

## How do I cross-build my project against Scala 2.12 and Scala 2.13?

Most usages of collections are compatible and can cross-compile 2.12 and 2.13 (at the cost of some warnings, sometimes).

If you cannot get your code to cross-compile, there are various solutions:
  - You can use the [`scala-collection-compat`](https://github.com/scala/scala-collection-compat) library, which makes some of 2.13's APIs available to 2.11 and 2.12. This solution does not always work, for example if your library implements custom collection types.
  - You can maintain a separate branch with the changes for 2.13 and publish releases for 2.13 from this branch.
  - You can put source files that don't cross-compile in separate directories and configure sbt to assemble the sources according to the Scala version (see also the examples below):

        // Adds a `src/main/scala-2.13+` source directory for Scala 2.13 and newer
        // and a `src/main/scala-2.13-` source directory for Scala version older than 2.13
        unmanagedSourceDirectories in Compile += {
          val sourceDir = (sourceDirectory in Compile).value
          CrossVersion.partialVersion(scalaVersion.value) match {
            case Some((2, n)) if n >= 13 => sourceDir / "scala-2.13+"
            case _                       => sourceDir / "scala-2.13-"
          }
        }

Examples of libraries that cross-compile with separate source directories:
  - https://github.com/scala/scala-parser-combinators/pull/152
  - https://github.com/scala/scala-xml/pull/222
  - Some other examples are listed here: https://github.com/scala/community-builds/issues/710

# Collection Implementers

To learn about differences when implementing custom collection types or operations, see the following documents:
  - [The architecture of Scala collections]({{ site.baseurl }}/overviews/core/architecture-of-scala-213-collections.html)
  - [Implementing custom collections]({{ site.baseurl }}/overviews/core/custom-collections.html)
  - [Adding custom collection operations]({{ site.baseurl }}/overviews/core/custom-collection-operations.html)
