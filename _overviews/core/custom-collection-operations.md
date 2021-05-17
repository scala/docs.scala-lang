---
layout: singlepage-overview
title: Adding Custom Collection Operations (Scala 2.13)
permalink: /overviews/core/:title.html
---

**Julien Richard-Foy**

This guide shows how to write operations that can be applied to any collection type and return the same
collection type, and how to write operations that can be parameterized by the type of collection to build.
It is recommended to first read the article about the
[architecture of the collections]({{ site.baseurl }}/overviews/core/architecture-of-scala-213-collections.html).

The following sections present how to **consume**, **produce** and **transform** any collection type.

## Consuming any collection

In a first section we show how to write a method consuming any collection instance that is part of the
[collection hierarchy](/overviews/collections/overview.html). We show in a second section how to
support *collection-like* types such as `String` and `Array` (which don’t extend `IterableOnce`).

### Consuming any *actual* collection

Let’s start with the simplest case: consuming any collection.
You don’t need to know the precise type of the collection,
but just that it *is* a collection. This can be achieved by taking an `IterableOnce[A]`
as parameter, or an `Iterable[A]` if you need more than one traversal.

For instance, say we want to implement a `sumBy` operation that sums the elements of a
collection after they have been transformed by a function:

~~~ scala
case class User(name: String, age: Int)

val users = Seq(User("Alice", 22), User("Bob", 20))

println(users.sumBy(_.age)) // “42”
~~~

We can define the `sumBy` operation as an extension method, using an
[implicit class](/overviews/core/implicit-classes.html), so that it can be called like a method:

~~~ scala
import scala.collection.IterableOnce

implicit class SumByOperation[A](coll: IterableOnce[A]) {
  def sumBy[B](f: A => B)(implicit num: Numeric[B]): B = {
    val it = coll.iterator
    var result = f(it.next())
    while (it.hasNext) {
      result = num.plus(result, f(it.next()))
    }
    result
  }
}
~~~

Unfortunately, this extension method does not work with values of type `String` and not
even with `Array`. This is because these types are not part of the Scala collections
hierarchy. They can be converted to proper collection types, though, but the extension method
will not work directly on `String` and `Array` because that would require applying two implicit
conversions in a row.

### Consuming any type that is *like* a collection

If we want the `sumBy` to work on any type that is *like* a collection, such as `String`
and `Array`, we have to add another indirection level:

~~~ scala
import scala.collection.generic.IsIterable

class SumByOperation[A](coll: IterableOnce[A]) {
  def sumBy[B](f: A => B)(implicit num: Numeric[B]): B = ... // same as before
}

implicit def SumByOperation[Repr](coll: Repr)(implicit it: IsIterable[Repr]): SumByOperation[it.A] =
  new SumByOperation[it.A](it(coll))
~~~

The type `IsIterable[Repr]` has implicit instances for all types `Repr` that can be converted
to `IterableOps[A, Iterable, C]` (for some element type `A` and some collection type `C`). There are
instances for actual collection types and also for `String` and `Array`.

### Consuming a more specific collection than `Iterable`

In some cases we want (or need) the receiver of the operation to be more specific than `Iterable`.
For instance, some operations make sense only on `Seq` but not on `Set`.

In such a case, again, the most straightforward solution would be to take as parameter a `Seq` instead
of an `Iterable` or an `IterableOnce`, but this would work only with *actual* `Seq` values. If you want
to support `String` and `Array` values you have to use `IsSeq` instead. `IsSeq` is similar to
`IsIterable` but provides a conversion to `SeqOps[A, Iterable, C]` (for some types `A` and `C`).

Using `IsSeq` is also required to make your operation work on `SeqView` values, because `SeqView`
does not extend `Seq`. Similarly, there is an `IsMap` type that makes operations work with
both `Map` and `MapView` values.

## Producing any collection

This situation happens when a library provides an operation that produces a collection while leaving the
choice of the precise collection type to the user.

For instance, consider a type class `Gen[A]`, whose instances define how to produce values of type `A`.
Such a type class is typically used to create arbitrary test data.
Our goal is to define a `collection` operation that generates arbitrary collections containing arbitrary
values. Here is an example of use of `collection`:

~~~
scala> collection[List, Int].get
res0: List[Int] = List(606179450, -1479909815, 2107368132, 332900044, 1833159330, -406467525, 646515139, -575698977, -784473478, -1663770602)

scala> collection[LazyList, Boolean].get
res1: LazyList[Boolean] = LazyList(_, ?)

scala> collection[Set, Int].get
res2: Set[Int] = HashSet(-1775377531, -1376640531, -1009522404, 526943297, 1431886606, -1486861391)
~~~

A very basic definition of `Gen[A]` could be the following:

```scala mdoc
trait Gen[A] {
  /** Get a generated value of type `A` */
  def get: A
}
```

And the following instances can be defined:

```scala mdoc
import scala.util.Random

object Gen {

  /** Generator of `Int` values */
  implicit def int: Gen[Int] =
    new Gen[Int] { def get: Int = Random.nextInt() }

  /** Generator of `Boolean` values */
  implicit def boolean: Gen[Boolean] =
    new Gen[Boolean] { def get: Boolean = Random.nextBoolean() }

  /** Given a generator of `A` values, provides a generator of `List[A]` values */
  implicit def list[A](implicit genA: Gen[A]): Gen[List[A]] =
    new Gen[List[A]] {
      def get: List[A] =
        if (Random.nextInt(100) < 10) Nil
        else genA.get :: get
    }

}
```

The last definition (`list`) generates a value of type `List[A]` given a generator
of values of type `A`. We could implement a generator of `Vector[A]` or `Set[A]` as
well, but their implementations would be very similar.

Instead, we want to abstract over the type of the generated collection so that users
can decide which collection type they want to produce.

To achieve that we have to use `scala.collection.Factory`:

~~~ scala
trait Factory[-A, +C] {

  /** @return A collection of type `C` containing the same elements
    *         as the source collection `it`.
    * @param it Source collection
    */
  def fromSpecific(it: IterableOnce[A]): C

  /** Get a Builder for the collection. For non-strict collection
    * types this will use an intermediate buffer.
    * Building collections with `fromSpecific` is preferred
    * because it can be lazy for lazy collections.
    */
  def newBuilder: Builder[A, C]
}
~~~

The `Factory[A, C]` trait provides two ways of building a collection `C` from
elements of type `A`:
 
- `fromSpecific`, converts a source collection of `A` to a collection `C`,
- `newBuilder`, provides a `Builder[A, C]`.

The difference between these two methods is that the former does not necessarily
evaluate the elements of the source collection. It can produce a non-strict
collection type (such as `LazyList`) that does not evaluate its elements unless
it is traversed. On the other hand, the builder-based way of constructing the
collection necessarily evaluates the elements of the resulting collection.
In practice, it is recommended to [not eagerly evaluate the elements of the collection](/overviews/core/architecture-of-scala-213-collections.html#when-a-strict-evaluation-is-preferable-or-unavoidable).

Finally, here is how we can implement a generator of arbitrary collection types:

~~~ scala
import scala.collection.Factory

implicit def collection[CC[_], A](implicit
  genA: Gen[A],
  factory: Factory[A, CC[A]]
): Gen[CC[A]] =
  new Gen[CC[A]] {
    def get: CC[A] = {
      val lazyElements =
        LazyList.unfold(()) { _ =>
          if (Random.nextInt(100) < 10) None
          else Some((genA.get, ()))
        }
      factory.fromSpecific(lazyElements)
    }
  }
~~~

The implementation uses a lazy source collection of a random size (`lazyElements`).
Then it calls the `fromSpecific` method of the `Factory` to build the collection
expected by the user.

## Transforming any collection

Transforming collections consists in both consuming and producing collections. This is achieved by
combining the techniques described in the previous sections.

For instance, we want to implement an `intersperse` operation that can be applied to
any sequence and returns a sequence with a new element inserted between each element of the
source sequence:

~~~ scala
List(1, 2, 3).intersperse(0) == List(1, 0, 2, 0, 3)
"foo".intersperse(' ') == "f o o"
~~~

When we call it on a `List`, we want to get back another `List`, and when we call it on
a `String` we want to get back another `String`, and so on.

Building on what we’ve learned from the previous sections, we can start defining an extension method
using `IsSeq` and producing a collection by using an implicit `Factory`:

~~~ scala
import scala.collection.{ AbstractIterator, AbstractView, Factory, SeqOps }
import scala.collection.generic.IsSeq

class IntersperseOperation[A](seqOps: SeqOps[A, Iterable, _]) {
  def intersperse[B >: A, That](sep: B)(implicit factory: Factory[B, That]): That =
    factory.fromSpecific(new AbstractView[B] {
      def iterator = new AbstractIterator[B] {
        val it = seqOps.iterator
        var intersperseNext = false
        def hasNext = intersperseNext || it.hasNext
        def next() = {
          val elem = if (intersperseNext) sep else it.next()
          intersperseNext = !intersperseNext && it.hasNext
          elem
        }
      }
    })
}

implicit def IntersperseOperation[Repr](coll: Repr)(implicit seq: IsSeq[Repr]): IntersperseOperation[seq.A] =
  new IntersperseOperation(seq(coll))
~~~

However, if we try it we get the following behaviour:

~~~
scala> List(1, 2, 3).intersperse(0)
res0: Array[Int] = Array(1, 0, 2, 0, 3)
~~~

We get back an `Array` although the source collection was a `List`! Indeed, there is
nothing that constrains the result type of `intersperse` to depend on the receiver type.

To produce a collection whose type depends on a source collection, we have to use
`scala.collection.BuildFrom` (formerly known as `CanBuildFrom`) instead of `Factory`.
`BuildFrom` is defined as follows:

~~~ scala
trait BuildFrom[-From, -A, +C] {
  /** @return a collection of type `C` containing the same elements
    * (of type `A`) as the source collection `it`.
    */
  def fromSpecific(from: From)(it: IterableOnce[A]): C

  /** @return a Builder for the collection type `C`, containing
    * elements of type `A`.
    */
  def newBuilder(from: From): Builder[A, C]
}
~~~

`BuildFrom` has similar operations to `Factory`, but they take an additional `from`
parameter. Before explaining how implicit instances of `BuildFrom` are resolved, let’s first have
a look at how you can use it. Here is the implementation of `intersperse` based on `BuildFrom`:

~~~ scala
import scala.collection.{ AbstractView, BuildFrom }
import scala.collection.generic.IsSeq

class IntersperseOperation[Repr, S <: IsSeq[Repr]](coll: Repr, seq: S) {
  def intersperse[B >: seq.A, That](sep: B)(implicit bf: BuildFrom[Repr, B, That]): That = {
    val seqOps = seq(coll)
    bf.fromSpecific(coll)(new AbstractView[B] {
      // same as before
    })
  }
}

implicit def IntersperseOperation[Repr](coll: Repr)(implicit seq: IsSeq[Repr]): IntersperseOperation[Repr, seq.type] =
  new IntersperseOperation(coll, seq)
~~~

Note that we track the type of the receiver collection `Repr` in the `IntersperseOperation`
class. Now, consider what happens when we write the following expression:

~~~ scala
List(1, 2, 3).intersperse(0)
~~~

An implicit parameter of type `BuildFrom[Repr, B, That]` has to be resolved by the compiler.
The type `Repr` is constrained by the receiver type (here, `List[Int]`) and the type `B` is
inferred by the value passed as a separator (here, `Int`). Finally, the type of the collection
to produce, `That` is fixed by the resolution of the `BuildFrom` parameter. In our case,
there is a `BuildFrom[List[Int], Int, List[Int]]` instance that fixes the result type to
be `List[Int]`.

## Summary

- To consume any collection, take an `IterableOnce` (or something more specific such as `Iterable`, `Seq`, etc.)
  as parameter,
  - To also support `String`, `Array` and `View`, use `IsIterable`,
- To produce a collection given its type, use a `Factory`,
- To produce a collection based on the type of a source collection and the type of elements of the collection
  to produce, use `BuildFrom`.
