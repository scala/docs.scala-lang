---
layout: singlepage-overview
title: Migrating a Project to Scala 2.13's Collections
permalink: /overviews/core/:title.html
---

This document describes the main changes for collection users that migrate to Scala 2.13 and shows
how to cross-build projects with Scala 2.11 / 2.12 and 2.13.

For an in-depth overview of the Scala 2.13 collections library, see the [collections guide]({{ site.baseurl }}/overviews/collections-2.13/introduction.html). The implementation details of the 2.13 collections are explained in the document [the architecture of Scala collections]({{ site.baseurl }}/overviews/core/architecture-of-scala-213-collections.html).

## What are the major changes?

See the list at the top of the [2.13.0-M4 release notes](https://github.com/scala/scala/releases/tag/v2.13.0-M4).

## What are the breaking changes?

The following table summarizes the breaking changes:

| Description | Old Code | New Code | Automatic Migration Rule |
| ----------- | -------- | -------- | ------------------------ |
| Method `to[C[_]]` has been removed (it might be reintroduced but deprecated, though) | `xs.to[List]` | `xs.to(List)` | `NewCollections`, `CrossCompat` |
| `mutable.Map` no longer have an `updated` method | `mutable.Map(1 -> 2).updated(1, 3)` | `mutable.Map(1 -> 2).clone() += 1 -> 3` | `NewCollections`, `CrossCompat` |
| `mapValues` and `filterKeys` now return a `MapView` instead of a `Map` | `kvs.mapValues(f)` | `kvs.mapValues(f).toMap` | `RoughlyMapValues` |
| `Iterable` no longer has a `sameElements` operation | `xs1.sameElements(xs2)` | `xs1.iterator.sameElements(xs2)` | `NewCollections`, `CrossCompat` |
| `collection.breakOut` no longer exists | `val xs: List[Int] = ys.map(f)(collection.breakOut)` | `val xs = ys.iterator.map(f).to(List)` | `NewCollections` |
| `zip` on `Map[K, V]` now returns an `Iterable` | `map.zip(iterable)` | `map.zip(iterable).toMap` | `Experimental` |
| `ArrayBuilder.make` does not accept parens anymore | `ArrayBuilder.make[Int]()` | `ArrayBuilder.make[Int]` | `NewCollections`, `CrossCompat` |

The “Automatic Migration Rule” column gives the name of the migration rule that can be used to automatically update old code to the new expected form. See https://github.com/scala/scala-collection-compat/ for more
details on how to use it.

Some classes have been removed, made private or have no equivalent in the new design:

- `ArrayStack`,
- `mutable.FlatHashTable`,
- `mutable.HashTable`,
- `History`,
- `Immutable`,
- `IndexedSeqOptimized`,
- `LazyBuilder`,
- `mutable.LinearSeq`,
- `LinkedEntry`,
- `MapBuilder`,
- `Mutable`,
- `MutableList`,
- `Publisher`,
- `ResizableArray`,
- `RevertibleHistory`,
- `SeqForwarder`,
- `SetBuilder`,
- `Sizing`,
- `SliceInterval`,
- `StackBuilder`,
- `StreamView`,
- `Subscriber`,
- `Undoable`,
- `WrappedArrayBuilder`.

Other notable changes are:

  - `Iterable.partition` invokes `iterator` twice on non-strict collections and assumes it gets two iterators over the same elements. Strict subclasses override `partition` do perform only a single traversal
  - `scala.Seq[+A]` is now `scala.collection.immutable.Seq[A]` (this also affects varargs methods).
  - Equality between collections is not anymore defined at the level of `Iterable`. It is defined separately in the `Set`, `Seq` and `Map` branches. Another consequence is that `Iterable` does not anymore have a `canEqual` method.
  - The new collections makes more use of overloading. You can find more information about the motivation
    behind this choice [here](http://scala-lang.org/blog/2017/05/30/tribulations-canbuildfrom.html). For instance, `Map.map` is overloaded:

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
    You can read more about the new design [here](http://scala-lang.org/blog/2017/11/28/view-based-collections.html).
  - `mutable.ArraySeq` (which wraps an `Array[AnyRef]` in 2.12, meaning that primitives were boxed in the array) can now wrap boxed and unboxed arrays. `mutable.ArraySeq` in 2.13 is in fact equivalent to `WrappedArray` in 2.12, there are specialized subclasses for primitive arrays. Note that a `mutable.ArraySeq` can be used either way for primitive arrays (TODO: document how). `WrappedArray` is deprecated.
  - There is no “default” `Factory` (previously known as `[A, C] => CanBuildFrom[Nothing, A, C]`): use `Factory[A, Vector[A]]` explicitly instead.

## Breaking changes with old syntax still supported

The following table lists the changes that continue to work with a deprecation warning.

| Description | Old Code | New Code | Automatic Migration Rule |
| ----------- | -------- | -------- | ------------------------ |
| `collection.Set/Map` no longer have `+` and `-` operations | `xs + 1 - 2` | `xs ++ Set(1) -- Set(2)` | `Experimental` |
| `collection.Map` no longer have `--` operation | `map -- keys` | `map.to(immutable.Map) -- keys` | |
| `immutable.Set/Map`: the `+` operation no longer has an overload accepting multiple values | `Set(1) + (2, 3)` | `Set(1) + 2 + 3` | `NewCollections`, `CrossCompat` |
| `mutable.Set/Map` no longer have a `+` operation | `mutable.Set(1) + 2` | `mutable.Set(1).clone() += 2` | `NewCollections`, `CrossCompat` |
| `SortedSet`: the `to`, `until` and `from` methods are now called `rangeTo`, `rangeUntil` and `rangeFrom`, respectively | `xs.until(42)` | `xs.rangeUntil(42)` |  |
| `Traversable` and `TraversableOnce` are replaced with `Iterable` and `IterableOnce`, respectively | `def f(xs: Traversable[Int]): Unit` | `def f(xs: Iterable[Int]): Unit` | `NewCollections`, `CrossCompat` |
| `Stream` is replaced with `LazyList` | `Stream.from(1)` | `LazyList.from(1)` | `RoughlyStreamToLazyList` |
| `Seq#union` is replaced with `concat` | `xs.union(ys)` | `xs.concat(ys)` | |
| `Stream#append` is replaced with `lazyAppendAll` | `xs.append(ys)` | `xs.lazyAppendedAll(ys)` | `NewCollections`, `CrossCompat` |
| `IterableOnce#toIterator` is replaced with `IterableOnce#iterator` | `xs.toIterator` | `xs.iterator` | `NewCollections`, `CrossCompat` |
| `copyToBuffer` has been deprecated | `xs.copyToBuffer(buffer)` | `buffer ++= xs` | `NewCollections`, `CrossCompat` |
| `TupleNZipped` has been replaced with `LazyZipN` | `(xs, ys).zipped` | `xs.lazyZip(ys)` | `NewCollections` |
| `retain` has been renamed to `filterInPlace` | `xs.retain(f)` | `xs.filterInPlace(f.tupled)` | `NewCollections` |
| `:/` and `/:` operators have been deprecated | `(xs :\ y)(f)` | `xs.foldRight(y)(f)` | `NewCollections`, `CrossCompat` |
| `companion` operation has been renamed to `iterableFactory` | `xs.companion` | `xs.iterableFactory` |  |
 
## Deprecated things in 2.12 that have been removed in 2.13

- `collection.convert.JavaConversions`. Use `collection.convert.JavaConverters` instead ;
- `collection.mutable.MutableList` (was not deprecated in 2.12 but was considered to be an implementation detail for implementing other collections). Use an `ArrayDeque` instead, or a `List` and a `var` ;
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

Another new operation is `distinctBy`:

~~~ scala
def distinctBy[B](f: A => B): C // (Where `C` can be `List[Int]`, for instance)
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

  - You can use the [`scala-collection-compat`](https://github.com/scala/scala-collection-compat) library, which makes some of 2.13's APIs available to 2.11 and 2.12. This solution does not always work, for example if your library implements custom collection types.

Note that the `scala-collection-compat` library has not fully stabilized yet. We expect that new, binary incompatible versions of this library will be published (for 2.11, 2.12) until Scala 2.13 is getting close to its final state. Therefore you might want to avoid adding a dependency on that library to your 2.11 / 2.12 artifacts for the time being.

Examples of libraries that cross-compile with separate source directories:
  - https://github.com/scala/scala-parser-combinators/pull/152
  - https://github.com/scala/scala-xml/pull/222
  - Some other examples are listed here: https://github.com/scala/community-builds/issues/710

# Collection Implementers

## `CanBuildFrom` no longer exists - what were its uses and how can they be replaced?

`CanBuildFrom` was used to:
  - generically implement transformation operations whose return type could
    vary according to the type of collection elements (ie mapping a `Char` to a `Char` in a `String`
    returns a `String`, but mapping a `Char` to an `Int` returns a `IndexedSeq[Int]`),
  - abstract over the arity of collection type constructors (ie `List[_]` vs `Map[_, _]`),
  - abstract over implicit parameters required to perform a transformation operations (ie mapping an `A` to a `B` in `SortedSet[A]`
    requires an implicit `Ordering[B]` to return a `SortedSet[B]`),
  - provide type-driven builders to implement generic transformation methods (eg `Future.traverse`).

The first three points are now handled using overloading. This means that `Map[K, V]` has two overloads of `map`,
one that takes a `(K, V) => (K', V')` mapping function and returns a `Map[K', V']`, and one that takes a
`(K, V) => A` mapping function and returns an `Iterable[A]`.

You can find more information about the design [here](http://scala-lang.org/blog/2017/05/30/tribulations-canbuildfrom.html).

To address the last point, there is a `BuildFrom` typeclass that works exactly like the former `CanBuildFrom`. See the next section
for examples of use.

## How can I write generic extension methods?

Depending on the level of desired genericity, several solutions can apply, with different complexity.

### Write an operation that can consume any collection

Take an `IterableOnce[A]` as parameter, or an `Iterable[A]` if you need more than one
traversals:

~~~ scala
implicit class SumByOperation[A](coll: IterableOnce[A]) {
  def sumBy[B](f: A => B)(implicit num: Numeric[B]): B = {
    val it = coll.iterator
    var result = f(it.next())
    while (it.hasNext()) {
      result = num.plus(result, it.next())
    }
    result
  }
}
~~~

### Write an operation that returns another collection

Use `BuildFrom`:

~~~ scala
def optionSequence[CC[X] <: Iterable[X], A, To](xs: CC[Option[A]])(implicit bf: BuildFrom[CC[Option[A]], A, To]): Option[To] =
  xs.foldLeft[Option[Builder[A, To]]](Some(bf.newBuilder(xs))) {
    case (Some(builder), Some(a)) => Some(builder += a)
    case _ => None
  }.map(_.result())
~~~

The `optionSequence` operation can be used on any collection (but not on an `Array` or a `String`):

~~~
scala> optionSequence(List[Option[Int]](Some(1), Some(2), Some(3)))
res1: Option[List[Int]] = Some(List(1, 2, 3))

scala> optionSequence(Set[Option[(Int, String)]](Some(1 -> "foo"), Some(2 -> "bar")))(TreeMap) // Force the result type
res4: Option[scala.collection.immutable.TreeMap[Int,String]] = Some(TreeMap(1 -> foo, 2 -> bar))
~~~

### Write an operation that can also be applied to a `View`, an `Array` or `String`

For more advanced cases, or if your operation should also work with `Array`s, `String`s and `View`s,
the pattern given in the previous section is not enough.

The [`scala-collection-contrib`](https://github.com/scala/scala-collection-contrib) module
provides a more advanced machinery that handles that:

~~~ scala
class IntersperseOperation[C, S <: HasSeqOps[C]](coll: C)(implicit val seq: S) {
  def intersperse[B >: seq.A, That](sep: B)(implicit bf: BuildFrom[C, B, That]): That =
    bf.fromSpecificIterable(coll)(new View.Intersperse(seq(coll), sep)) // (Assume that there is a `View.Intersperse` implemented somewhere)
}

implicit def IntersperseOperation[C](coll: C)(implicit seq: HasSeqOps[C]): SeqDecorator[C, seq.type] =
    new IntersperseOperation(coll)(seq)
~~~

This pattern makes the `intersperse` operation available to any `Seq` _like_ type (eg. a `SeqView`, an `Array` or a `String`).

## How do I integrate my collection in the new design?

See the [online documentation](https://docs.scala-lang.org/overviews/core/custom-collections.html)

The API of the template traits has changed:
- they used to be suffixed by “Like” (e.g. `SeqLike`), whereas they are now suffixed by “Ops” (e.g. `SeqOps`),
- they used to abstract over the collection type of transformation operations, they now abstract over both
  the collection type and the collection type constructor: `SeqLike[+A, +Repr]` has been replaced with
  `SeqOps[+A, +CC[_], +C]`.

## Which methods should I overload to support the “same result type” principle?

You want to add overloads to specialize a transformation operations such that they return a more specific result. Examples are:
- `map`, on `StringOps`, when the mapping function returns a `Char`, should return a `String` (instead of an `IndexedSeq`),
- `map`, on `Map`, when the mapping function returns a pair, should return a `Map` (instead of an `Iterable`),
- `map`, on `SortedSet`, when an implicit `Ordering` is available for the resulting element type, should return a
`SortedSet` (instead of a `Set`).

The following table lists transformation operations that might return a too wide type. You might want to overload
these operations to return a more specific type.

 Collection    | Operations
---------------|--------------
`Iterable`     | `map`, `flatMap`, `collect`, `scanLeft`, `scanRight`, `groupMap`, `concat`, `zip`, `zipWithIndex`, `zipAll`, `unzip`
`Seq`          | `prepended`, `appended`, `prependedAll`, `appendedAll`, `padTo`, `patch`
`immutable.Seq`| `updated`
`SortedSet`    | `map`, `flatMap`, `collect`, `zip`
`Map`          | `map`, `flatMap`, `collect`, `concat`
`immutable.Map`| `updated`, `transform`
`SortedMap`    | `map`, `flatMap`, `collect`, `concat`
`immutable.SortedMap` | `updated`
