---
layout: singlepage-overview
title: The Architecture of Scala Collections

partof: collections-architecture

languages: [zh-cn]

permalink: /overviews/core/:title.html
---

**Martin Odersky, Lex Spoon and Julien Richard-Foy**

These pages describe the architecture of the Scala collections
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
classes and implementations. The following pages explain these
templates and other classes and traits that constitute the "building
blocks" of the framework, as well as the construction principles they
support.

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

### Abstracting over collection types ###

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

And then leaf collection types appropriately instantiate the type
parameters. For instance, in the case of `List[A]` we want `CC` to
be `List` and `C` to be `List[A]`:

~~~ scala
trait List[+A] extends Iterable[A]
  with IterableOps[A, List, List[A]]
~~~

### Four branches of templates traits ###

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

At use-site, if you call the `map` operation, the overloading resolution rules
first try the definition that comes from `MapOps` (because `MapOps` is more
specific than `IterableOps`), which returns a `Map`, but if it doesn’t type
check (in case the return type of the function passed to the `map` call is not
a pair), it fallbacks to the definition from `IterableOps`, which returns an
`Iterable`. This is how we follow the “same-result-type” principle: wherever
possible a transformation method on a collection yields a collection of the
same type.

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
===========|===============|===============
`CC[_]`    | `IterableOps` | `SortedSetOps`
`CC[_, _]` | `MapOps`      | `SortedMapOps`

Here is a diagram illustrating the architecture:

![]({{ site.baseurl }}/resources/images/collections-architecture.svg)

Template traits are in grey whereas collection types are in white.

### Strict and non-strict collections ###

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

### Operations implementation ###

Now that we are more familiar with the structure of the template traits, we can have
a look at the actual implementation of some operations. Consider for instance the
implementations of `filter` and `map`:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {

  def filter(pred: A => Boolean): C =
    fromSpecificIterable(View.Filter(toIterable, pred))

  def map[B](f: A => B): CC[B] = 
    fromIterable(View.Map(toIterable, f))

  def toIterable: Iterable[A]
  protected def fromSpecificIterable(coll: Iterable[A]): C
  protected def fromIterable[E](it: Iterable[E]): CC[E]
}
~~~

Let’s detail the implementation of `filter`, step by step:

- `toIterable` turns the `IterableOps` instance into an `Iterable`. This operation is
  a no-op when it is effectively called on an `Iterable` instance (it is possible to
  create an `IterableOps` instance that does not inherit from `Iterable` but that’s out
  of the scope of this document) ;
- the call to `View.Filter` creates a (non-strict) `View` that filters the elements
  of the underling collection ;
- finally, the call to `fromSpecificIterable` turns the `View` into a concrete
  collection `C`. The implementation of `fromSpecificIterable` is left to
  concrete collections: they can decide to evaluate in a strict or non-strict way
  the elements resulting from the operation.

The implementation of `map` is similar, excepted that instead of using
`fromSpecificIterable` it uses `fromIterable` which takes as parameter an
iterable whose element type is arbitrary.

Actually, `fromIterable` is not abstract in `IterableOps`: it delegates to an
`iterableFactory` member (which is abstract):

~~~ scala
trait IterableOps[+A, +CC[_], +C] {

  protected def fromIterable[E](it: Iterable[E]): CC[E] =
    iterableFactory.from(it)

  def iterableFactory: IterableFactory[CC]

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
here are the relevant parts of code of the `map` operation implementation in `Map`:

~~~ scala
trait MapOps[K, +V, +CC[_, _], +C]
  extends IterableOps[(K, V), Iterable, C] {

  def map[K2, V2](f: ((K, V)) => (K2, V2)): CC[K2, V2] =
    mapFromIterable(View.Map(toIterable, f))

  // Similar to fromIterable, but returns a Map collection type
  protected def mapFromIterable[K2, V2](it: Iterable[(K2, V2)]): CC[K2, V2] =
    mapFactory.from(it)

  def mapFactory: MapFactory[CC]

}

trait MapFactory[+CC[_, _]] {
  def from[K, V](it: IterableOnce[(K, V)]): CC[K, V]
}
~~~

### When a strict evaluation is preferable (or unavoidable) ###

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
  def add(elem: A): this.type
  def result(): C
}
~~~

Builders are generic in both the element type `A` and the type of collection they
return, `C`.
You can add an element `x` to a builder `b` with `b.add(x)` (or `b += x`). The
`result()` method returns a collection from a builder.

By symmetry with `fromSpecificIterable` and `fromIterable`, template traits provide
ways to get a builder resulting in a collection with the same type of elements, and
to get a builder resulting in a collection of the same type but with a different
type of elements. The following code shows the relevant parts of `IterableOps` and
`IterableFactory` to build collections in both strict and non-strict modes:

~~~ scala
trait IterableOps[+A, +CC[_], +C] {
  def iterableFactory: IterableFactory[CC]
  protected def fromSpecificIterable(coll: Iterable[A]): C
  protected def newSpecificBuilder(): Builder[A, C]
}

trait IterableFactory[+CC[_]] {
  def from[A](source: IterableOnce[A]): CC[A]
  def newBuilder[A](): Builder[A, CC[A]]
}
~~~

Note that, in general, an operation that doesn’t *have to* be strict should
be implemented in a non-strict mode, otherwise it would lead to surprising
behaviour when used on a non-strict concrete collection. That being said,
the strict mode is often more efficient. This is why we provide template
traits whose operation implementations have been overridden to take
advantage of strict builders. The name of these template traits always
starts with `StrictOptimized`. You should use such a template trait for
your custom collection if it is a strict collection.

## Integrating a new collection: capped sequence ##

What needs to be done if you want to integrate a new collection class,
so that it can profit from all predefined operations with the right
types? In the next few sections you’ll be walked through three examples
that do this, namely capped sequences, sequences of RNA
bases and prefix maps implemented with Patricia tries.

Say you want to create a collection containing *at most* `n` elements:
if more elements are added then the first elements are removed. Such a
collection can be efficiently implemented using an `Array` with a fixed
capacity: random access and element insertion are O(1) operations.

The first task is to find the supertype of our collection: is it
`Seq`, `Set`, `Map` or just `Iterable`? In our case, it is tempting
to choose `Seq` because our collection can contain duplicates and
iteration order is determined by insertion order. However, some
properties of `Seq` are not satisfied:

~~~ scala
(xs ++ ys).size == xs.size + ys.size
~~~

Consequently, the only sensible choice as a base collection type
is `Iterable`.

### First version of `Capped` class ###

~~~ scala
import scala.collection._

class Capped1[A] private (val capacity: Int, val length: Int, offset: Int, elems: Array[Any])
  extends immutable.Iterable[A] { self =>

  def this(capacity: Int) =
    this(capacity, length = 0, offset = 0, elems = Array.ofDim(capacity))

  def appended[B >: A](elem: B): Capped1[B] = {
    val newElems = Array.ofDim[Any](capacity)
    Array.copy(elems, 0, newElems, 0, capacity)
    val (newOffset, newLength) =
      if (length == capacity) {
        newElems(offset) = elem
        ((offset + 1) % capacity, length)
      } else {
        newElems(length) = elem
        (offset, length + 1)
      }
    new Capped1[B](capacity, newLength, newOffset, newElems)
  }

  @`inline` def :+ [B >: A](elem: B): Capped1[B] = appended(elem)

  def apply(i: Int): A = elems((i + offset) % capacity).asInstanceOf[A]

  def iterator: Iterator[A] = new AbstractIterator[A] {
    private var current = 0
    def hasNext = current < self.length
    def next(): A = {
      val elem = self(current)
      current += 1
      elem
    }
  }

  def iterableFactory: IterableFactory[immutable.Iterable] = immutable.Iterable
  protected[this] def fromSpecificIterable(coll: Iterable[A]): immutable.Iterable[A] = iterableFactory.from(coll)
  protected[this] def newSpecificBuilder(): Builder[A, immutable.Iterable[A]] = iterableFactory.newBuilder()

}
~~~

The above listing presents the first version of our capped collection
implementation. It will be refined later. The class `Capped1` has a
private constructor that takes the collection capacity, length,
offset (first element index) and the underlying array as parameters.
The public constructor takes only the capacity of the collection. It
sets the length and offset to 0, and uses an empty array of elements.

The `appended` method defines how elements can be appended to a given
`Capped1` collection: it creates a new underlying array of elements,
copies the current elements and adds the new element. As long as the
number of elements does not exceed the `capacity`, the new element
is appended after the previous elements. However, as soon as the
maximal capacity has been reached, the new element replaces the first
element of the collection (at `offset` index).

The `apply` method implements indexed access: it translates the given
index into its corresponding index in the underlying array by adding
the `offset`.

These two methods, `appended` and `apply`, implement the specific
behavior of the `Capped1` collection type. In addition to them, we have
to implement a few methods to make the generic collection operations
work on `Capped` collections:

- `length`, automatically implemented by the parametric field of the
  same name,
- `iterator` (used by reduction operations such as `foldLeft` or
  `count`), implemented by using indexed access,
- `iterableFactory` (used by transformation operations such as `map`
   or `flatMap`), implemented by delegating to the `immutable.Iterable`
   object,
- `fromSpecifiIterable` and `newSpecificBuilder` (used by
   transformation operations such as `take` or `filter`).

Here are some interactions with the `Capped1` collection:

~~~ scala
scala> new Capped1(capacity = 4)
res0: Capped1[Nothing] = Capped1()

scala> res0 :+ 1 :+ 2 :+ 3
res1: Capped1[Int] = Capped1(1, 2, 3)

scala> res1.length
res2: Int = 3

scala> res1.lastOption
res3: Option[Int] = Some(3)

scala> res1 :+ 4 :+ 5 :+ 6
res4: Capped1[Int] = Capped1(3, 4, 5, 6)

scala> res4.take(3)
res5: collection.immutable.Iterable[Int] = List(3, 4, 5)
~~~

You can see that if we try to grow the collection with more than four
elements, the first elements are dropped (see `res4`). The operations
behave as expected except for the last one: after calling `take` we
get back a `List` instead of the expected `Capped1` collection. This
is because all that was done in class
[`Capped1`](#first-version-of-capped-class) was making `Capped1` extend
`immutable.Iterable`. This class, on the other hand, has a `take` method
that returns an `immutable.Iterable`, and that’s implemented in terms of
`immutable.Iterable`’s default implementation, `List`. So, that’s what
you were seeing on the last line of the previous interaction.

Now that you understand why things are the way they are, the next
question should be what needs to be done to change them? One way to do
this would be to override the `take` method in class `Capped1`, maybe like
this:

    def take(count: Int): Capped1 = …

This would do the job for `take`. But what about `drop`, or `filter`, or
`init`? In fact there are over fifty methods on sequences that return
again a sequence. For consistency, all of these would have to be
overridden. This looks less and less like an attractive
option. Fortunately, there is a much easier way to achieve the same
effect, as shown in the next section.

### Second version of `Capped` class ###

~~~ scala
class Capped2[A] private (val capacity: Int, val length: Int, offset: Int, elems: Array[Any])
  extends immutable.Iterable[A]
    with IterableOps[A, Capped2, Capped2[A]] { self =>

  def this(capacity: Int) = // as before

  def appended[B >: A](elem: B): Capped2[B] = // as before
  @`inline` def :+ [B >: A](elem: B): Capped2[B] = // as before
  def apply(i: Int): A = // as before

  def iterator: Iterator[A] = // as before

  val iterableFactory: IterableFactory[Capped2] = new Capped2Factory(capacity)
  protected[this] def fromSpecificIterable(coll: Iterable[A]): Capped2[A] = iterableFactory.from(coll)
  protected[this] def newSpecificBuilder(): Builder[A, Capped2[A]] = iterableFactory.newBuilder()

}

class Capped2Factory(capacity: Int) extends IterableFactory[Capped2] {

  def from[A](source: IterableOnce[A]): Capped2[A] =
    (newBuilder[A]() ++= source).result()

  def empty[A]: Capped2[A] = new Capped2[A](capacity)

  def newBuilder[A](): Builder[A, Capped2[A]] =
    new ImmutableBuilder[A, Capped2[A]](empty) {
      def add(elem: A): this.type = { elems = elems :+ elem; this }
    }
}
~~~

The Capped class needs to inherit not only from `Iterable`, but also
from its implementation trait `IterableOps`. This is shown in the
above listing of class `Capped2`. The new implementation differs
from the previous one in only two aspects. First, class `Capped2`
now also extends `IterableOps[A, Capped2, Capped2[A]]`. Second, its
collection construction methods (`fromSpecificIterable` and
`newSpecificBuilder`) now return a `Capped2`. As explained in the
previous sections, the `IterableOps` trait implements all concrete
methods of `Iterable` in an extensible way. For instance, the
return type of methods like `take`, `drop`, `filter` or `init`
is the third type parameter passed to class `IterableOps`, i.e.,
in class `Capped2`, it is `Capped2[A]`. Similarly, the return
type of methods like `map`, `flatMap` or `concat` is defined
by the second type parameter passed to class `IterableOps`,
i.e., in class `Capped2`, it is `Capped2` itself.

To construct a `Capped2`, the `fromSpecificIterable` and
`newSpecificBuilder` implementations
delegate to an instance of the `Capped2Factory` class. This class
provides convenient factory methods to build collections. Eventually,
these methods delegate to `empty`, which builds an empty `Capped2`
instance, and `newBuilder`, which uses the `appended` operation
to grow a `Capped2` collection.

With the refined implementation of the [`Capped2` class](#second-version-of-capped-class),
the transformation operations work now as expected, and the
`Capped2Factory` class provides seamless conversions from other collections:

~~~ scala
scala> object Capped extends Capped2Factory(capacity = 4)
defined object Capped

scala> Capped(1, 2, 3)
res0: Capped2[Int] = Capped2(1, 2, 3)

scala> res0.take(2)
res1: Capped2[Int] = Capped2(1, 2)

scala> res0.filter(x => x % 2 == 1)
res2: Capped2[Int] = Capped2(1, 3)

scala> res0.map(x => x * x)
res3: Capped2[Int] = Capped2(1, 4, 9)

scala> List(1, 2, 3, 4, 5).to(Capped)
res4: mycollections.Capped2[Int] = Capped2(2, 3, 4, 5)
~~~

This implementation now behaves correctly, but we can still improve
a few things. Since our collection is strict, we can take advantage
of strict implementations for transformation operations.

### Final version of `Capped` class ###

~~~ scala
final class Capped[A] private (val capacity: Int, val length: Int, offset: Int, elems: Array[Any])
  extends immutable.Iterable[A]
    with IterableOps[A, Capped, Capped[A]]
    with StrictOptimizedIterableOps[A, Capped, Capped[A]] { self =>

  def this(capacity: Int) =
    this(capacity, length = 0, offset = 0, elems = Array.ofDim(capacity))

  def appended[B >: A](elem: B): Capped[B] = {
    val newElems = Array.ofDim[Any](capacity)
    Array.copy(elems, 0, newElems, 0, capacity)
    val (newOffset, newLength) =
      if (length == capacity) {
        newElems(offset) = elem
        ((offset + 1) % capacity, length)
      } else {
        newElems(length) = elem
        (offset, length + 1)
      }
    new Capped[B](capacity, newLength, newOffset, newElems)
  }

  @`inline` def :+ [B >: A](elem: B): Capped[B] = appended(elem)

  def apply(i: Int): A = elems((i + offset) % capacity).asInstanceOf[A]

  def iterator: Iterator[A] = view.iterator

  override def view: IndexedView[A] = new IndexedView[A] {
    def length: Int = self.length
    def apply(i: Int): A = self(i)
  }

  override def knownSize: Int = length

  val iterableFactory: IterableFactory[Capped] = new CappedFactory(capacity)
  protected[this] def fromSpecificIterable(coll: Iterable[A]): Capped[A] = iterableFactory.from(coll)
  protected[this] def newSpecificBuilder(): Builder[A, Capped[A]] = iterableFactory.newBuilder()

}

class CappedFactory(capacity: Int) extends IterableFactory[Capped] {

  def from[A](source: IterableOnce[A]): Capped[A] =
    source match {
      case cs: Capped[A] if cs.capacity == capacity => cs
      case _ => (newBuilder[A]() ++= source).result()
    }

  def empty[A]: Capped[A] = new Capped[A](capacity)

  def newBuilder[A](): Builder[A, Capped[A]] =
    new ImmutableBuilder[A, Capped[A]](empty) {
      def add(elem: A): this.type = { elems = elems :+ elem; this }
    }

}
~~~

That is it. The final [`Capped` class](#final-version-of-capped-class):

- extends the `StrictOptimizedIterableOps` trait, which overrides all
  transformation operations to take advantage of strict builders,
- overrides a few operations for performance: the `view` now uses
  indexed access, and the `iterator` delegates to the view. The
  `knownSize` operation is also overridden because the size is always
  known.

Its implementation requires a little bit of protocol. In essence, you
have to inherit from the `Ops` template trait in addition to just
inheriting from a collection type, and then implement the abstract
methods required by transformation operations.

## Integrating a new collection: RNA sequences ##

To start with the second example, we define the four RNA Bases:

    abstract class Base
    case object A extends Base
    case object U extends Base
    case object G extends Base
    case object C extends Base

    object Base {
      val fromInt: Int => Base = Array(A, U, G, C)
      val toInt: Base => Int = Map(A -> 0, U -> 1, G -> 2, C -> 3)
    }

Say you want to create a new sequence type for RNA strands, which are
sequences of bases A (adenine), U (uracil), G (guanine), and C
(cytosine). The definitions for bases are easily set up as shown in the
listing of RNA bases above.

Every base is defined as a case object that inherits from a common
abstract class `Base`. The `Base` class has a companion object that
defines two functions that map between bases and the integers 0 to 3.
You can see in the examples two different ways to use collections
to implement these functions. The `toInt` function is implemented as a
`Map` from `Base` values to integers. The reverse function, `fromInt`, is
implemented as an array. This makes use of the fact that both maps and
arrays *are* functions because they inherit from the `Function1` trait.

The next task is to define a class for strands of RNA. Conceptually, a
strand of RNA is simply a `Seq[Base]`. However, RNA strands can get
quite long, so it makes sense to invest some work in a compact
representation. Because there are only four bases, a base can be
identified with two bits, and you can therefore store sixteen bases as
two-bit values in an integer. The idea, then, is to construct a
specialized subclass of `Seq[Base]`, which uses this packed
representation.

### First version of RNA strands class ###

    import collection.immutable.{ IndexedSeq, IndexedSeqOps }

    final class RNA1 private (
      val groups: Array[Int],
      val length: Int
    ) extends IndexedSeq[Base]
      with IndexedSeqOps[Base, IndexedSeq, RNA1] {

      import RNA1._

      def apply(idx: Int): Base = {
        if (idx < 0 || length <= idx)
          throw new IndexOutOfBoundsException
        Base.fromInt(groups(idx / N) >> (idx % N * S) & M)
      }

      def iterableFactory: SeqFactory[IndexedSeq] = IndexedSeq
      protected[this] def fromSpecificIterable(coll: Iterable[Base]): RNA1 =
        fromSeq(coll.toSeq)
      protected[this] def newSpecificBuilder(): Builder[Base, RNA1] =
        iterableFactory.newBuilder[Base]().mapResult(fromSeq)
    }

    object RNA1 {

      // Number of bits necessary to represent group
      private val S = 2            

      // Number of groups that fit in an Int
      private val N = 32 / S       

      // Bitmask to isolate a group
      private val M = (1 << S) - 1

      def fromSeq(buf: Seq[Base]): RNA1 = {
        val groups = new Array[Int]((buf.length + N - 1) / N)
        for (i <- 0 until buf.length)
          groups(i / N) |= Base.toInt(buf(i)) << (i % N * S)
        new RNA1(groups, buf.length)
      }

      def apply(bases: Base*) = fromSeq(bases)
    }

The [RNA strands class listing](#first-version-of-rna-strands-class) above
presents the first version of this
class. The class `RNA1` has a constructor that
takes an array of `Int`s as its first argument. This array contains the
packed RNA data, with sixteen bases in each element, except for the
last array element, which might be partially filled. The second
argument, `length`, specifies the total number of bases on the array
(and in the sequence). Class `RNA1` extends `IndexedSeq[Base]` and
`IndexedSeqOps[Base, IndexedSeq, RNA1]`. These traits define the following
abstract methods:

- `length`, automatically implemented by defining a parametric field of
  the same name,
- `apply` (indexing method), implemented by first extracting an integer value
  from the `groups` array, then extracting the correct two-bit number from that
  integer using right shift (`>>`) and mask (`&`). The private constants `S`,
  `N`, and `M` come from the `RNA1` companion object. `S` specifies the size of
  each packet (i.e., two); `N` specifies the number of two-bit packets per
  integer; and `M` is a bit mask that isolates the lowest `S` bits in a
  word,
- `iterableFactory` (used by transformation operations), implemented
  by delegating to the `IndexedSeq` companion object,
- `fromSpecificIterable`, implemented by the `fromSeq` method of the `RNA1`
  companion object,
- `newSpecificBuilder`, implemented by using the default `IndexedSeq` builder
  and transforming its result into an `RNA1` with the `mapResult` method.

Note that the constructor of class `RNA1` is `private`. This means that
clients cannot create `RNA1` sequences by calling `new`, which makes
sense, because it hides the representation of `RNA1` sequences in terms
of packed arrays from the user. If clients cannot see what the
representation details of RNA sequences are, it becomes possible to
change these representation details at any point in the future without
affecting client code. In other words, this design achieves a good
decoupling of the interface of RNA sequences and its
implementation. However, if constructing an RNA sequence with `new` is
impossible, there must be some other way to create new RNA sequences,
else the whole class would be rather useless. In fact there are two
alternatives for RNA sequence creation, both provided by the `RNA1`
companion object. The first way is method `fromSeq`, which converts a
given sequence of bases (i.e., a value of type `Seq[Base]`) into an
instance of class `RNA1`. The `fromSeq` method does this by packing all
the bases contained in its argument sequence into an array, then
calling `RNA1`'s private constructor with that array and the length of
the original sequence as arguments. This makes use of the fact that a
private constructor of a class is visible in the class's companion
object.

The second way to create an `RNA1` value is provided by the `apply` method
in the `RNA1` object. It takes a variable number of `Base` arguments and
simply forwards them as a sequence to `fromSeq`. Here are the two
creation schemes in action:

    scala> val xs = List(A, G, U, A)
    xs: List[Base] = List(A, G, U, A)

    scala> RNA1.fromSeq(xs)
    res1: RNA1 = RNA1(A, G, U, A)

    scala> val rna1 = RNA1(A, U, G, G, C)
    rna1: RNA1 = RNA1(A, U, G, G, C)

Also note that the type parameters of the `IndexedSeqOps` trait that
we inherit from are: `Base`, `IndexedSeq` and `RNA1`. The first one
stands for the type of elements, the second one stands for the
type constructor used by transformation operations that return
a collection with a different type of elements, and the third one
stands for the type used by transformation operations that return
a collection with the same type of elements. In our case, it is
worth noting that the second one is `IndexedSeq` whereas the
third one is `RNA1`. This means that operations like `map` or
`flatMap` return an `IndexedSeq`, whereas operations like `take` or
`filter` return an `RNA1`.

Here is an example showing the usage of `take` and `filter`:

    scala> rna1.take(3)
    res5: RNA1 = RNA1(A, U, G)

    scala> rna1.filter(_ != U)
    res6: RNA1 = RNA1(A, G, G, C)

### Dealing with map and friends ###

However, transformation operations that return a collection with a
different element type always return an `IndexedSeq`.

How should these
methods be adapted to RNA strands? The desired behavior would be to get
back an RNA strand when mapping bases to bases or appending two RNA strands
with `++`:

    scala> val rna = RNA(A, U, G, G, C)
    rna: RNA = RNA(A, U, G, G, C)

    scala> rna map { case A => U case b => b }
    res7: RNA = RNA(U, U, G, G, C)

    scala> rna ++ rna
    res8: RNA = RNA(A, U, G, G, C, A, U, G, G, C)

On the other hand, mapping bases to some other type over an RNA strand
cannot yield another RNA strand because the new elements have the
wrong type. It has to yield a sequence instead. In the same vein
appending elements that are not of type `Base` to an RNA strand can
yield a general sequence, but it cannot yield another RNA strand.

    scala> rna map Base.toInt
    res2: IndexedSeq[Int] = Vector(0, 1, 2, 2, 3)

    scala> rna ++ List("missing", "data")
    res3: IndexedSeq[java.lang.Object] =
      Vector(A, U, G, G, C, missing, data)

This is what you'd expect in the ideal case. But this is not what the
[`RNA1` class](#first-version-of-rna-strands-class) provides. In fact, all
examples will return instances of `Vector`, not just the last two. If you run
the first three commands above with instances of this class you obtain:

    scala> val rna1 = RNA1(A, U, G, G, C)
    rna1: RNA1 = RNA1(A, U, G, G, C)

    scala> rna1 map { case A => U case b => b }
    res0: IndexedSeq[Base] = Vector(U, U, G, G, C)

    scala> rna1 ++ rna1
    res1: IndexedSeq[Base] = Vector(A, U, G, G, C, A, U, G, G, C)

So the result of `map` and `++` is never an RNA strand, even if the
element type of the generated collection is `Base`. To see how to do
better, it pays to have a close look at the signature of the `map`
method (or of `++`, which has a similar signature). The `map` method is
originally defined in class `scala.collection.IterableOps` with the
following signature:

    def map[B](f: A => B): CC[B]

Here `A` is the type of elements of the collection, and `CC` is the type
constructor passed as a second parameter to the `IterableOps` trait.

In our `RNA1` implementation, this `CC` type constructor is `IndexedSeq`,
this is why we always get a `Vector` as a result.

### Second version of RNA strands class ###

    final class RNA2 private (val groups: Array[Int], val length: Int)
      extends IndexedSeq[Base] with IndexedSeqOps[Base, IndexedSeq, RNA2] {

      import RNA2._

      def apply(idx: Int): Base = // as before
      def iterableFactory: SeqFactory[IndexedSeq] = // as before
      protected[this] def fromSpecificIterable(coll: Iterable[Base]): RNA2 = // as before
      protected[this] def newSpecificBuilder(): Builder[Base, RNA2] = // as before
      
      // Overloading of `appended`, `prepended`, `appendedAll`,
      // `prependedAll`, `map` and `flatMap` to return an `RNA2`
      // when possible
      def appended(base: Base): RNA2 =
        fromSpecificIterable(View.Append(this, base))
      def appendedAll(suffix: Iterable[Base]): RNA2 =
        fromSpecificIterable(View.Concat(this, suffix))
      def prepended(base: Base): RNA2 = 
        fromSpecificIterable(View.Prepend(base, this))
      def prependedAll(prefix: Iterable[Base]): RNA2 =
        fromSpecificIterable(View.Concat(prefix, this))
      def map(f: Base => Base): RNA2 =
        fromSpecificIterable(View.Map(this, f))
      def flatMap(f: Base => IterableOnce[Base]): RNA2 =
        fromSpecificIterable(View.FlatMap(this, f))
    }

To address this shortcoming, you need to overload the methods that
return an `IndexedSeq[B]` for the case where `B` is known to be `Base`,
to return an `RNA2` instead.

Compared to [class `RNA1`](#first-version-of-rna-strands-class)
we added overloads for methods `appended`, `appendedAll`, `prepended`,
`prependedAll`, `map` and `flatMap`.

This implementation now behaves correctly, but we can still improve a few things. Since our
collection is strict, we could take advantage of strict builders in transformation operations.
Also, if we try to convert an `Iterable[Base]` into an `RNA2` it fails:

~~~
scala> val bases: Iterable[Base] = List(A, U, C, C)
bases: Iterable[Base] = List(A, U, C, C)

scala> bases.to(RNA2)
                ^
       error: type mismatch;
        found   : RNA2.type
        required: scala.collection.Factory[Base,?]
~~~

### Final version of RNA strands class ###

~~~ scala
final class RNA private (
  val groups: Array[Int],
  val length: Int
) extends IndexedSeq[Base]
    with IndexedSeqOps[Base, IndexedSeq, RNA]
    with StrictOptimizedSeqOps[Base, IndexedSeq, RNA] { rna =>

  import RNA._

  // Mandatory implementation of `apply` in `IndexedSeqOps`
  def apply(idx: Int): Base = {
    if (idx < 0 || length <= idx)
      throw new IndexOutOfBoundsException
    Base.fromInt(groups(idx / N) >> (idx % N * S) & M)
  }

  // Mandatory implementation of `iterableFactory`,
  // `fromSpecificIterable` and `newSpecificBuilder`,
  // from `IterableOps`
  def iterableFactory: SeqFactory[IndexedSeq] = IndexedSeq
  protected[this] def fromSpecificIterable(coll: Iterable[Base]): RNA =
    RNA.fromSpecific(coll)
  protected[this] def newSpecificBuilder(): Builder[Base, RNA] =
    RNA.newBuilder()

  // Overloading of `appended`, `prepended`, `appendedAll`, `prependedAll`,
  // `map` and `flatMap` to return an `RNA` when possible
  def appended(base: Base): RNA = 
    (newSpecificBuilder() ++= this += base).result()
  def appendedAll(suffix: Iterable[Base]): RNA =
    (newSpecificBuilder() ++= this ++= suffix).result()
  def prepended(base: Base): RNA = 
    (newSpecificBuilder() += base ++= this).result()
  def prependedAll(prefix: Iterable[Base]): RNA =
    (newSpecificBuilder() ++= prefix ++= this).result()
  def map(f: Base => Base): RNA = {
    var b = newSpecificBuilder()
    for (base <- this) {
      b += f(base)
    }
    b.result()
  }
  def flatMap(f: Base => IterableOnce[Base]): RNA = {
    var b = newSpecificBuilder()
    for (base <- this) {
      b ++= f(base)
    }
    b.result()
  }

  // Optional re-implementation of iterator,
  // to make it more efficient.
  override def iterator: Iterator[Base] = new AbstractIterator[Base] {
    private var i = 0
    private var b = 0
    def hasNext: Boolean = i < rna.length
    def next(): Base = {
      b = if (i % N == 0) groups(i / N) else b >>> S
      i += 1
      Base.fromInt(b & M)
    }
  }

}

object RNA extends SpecificIterableFactory[Base, RNA] {

  private val S = 2            // number of bits in group
  private val M = (1 << S) - 1 // bitmask to isolate a group
  private val N = 32 / S       // number of groups in an Int

  def fromSeq(buf: Seq[Base]): RNA = {
    val groups = new Array[Int]((buf.length + N - 1) / N)
    for (i <- 0 until buf.length)
      groups(i / N) |= Base.toInt(buf(i)) << (i % N * S)
    new RNA(groups, buf.length)
  }

  // Mandatory factory methods: `empty`, `newBuilder`
  // and `fromSpecific`
  def empty: RNA = fromSeq(Seq.empty)

  def newBuilder(): Builder[Base, RNA] =
    ArrayBuffer.newBuilder[Base]().mapResult(fromSeq)

  def fromSpecific(it: IterableOnce[Base]): RNA = it match {
    case seq: Seq[Base] => fromSeq(seq)
    case _ => fromSeq(ArrayBuffer.from(it))
  }
}
~~~

The final [`RNA` class](#final-version-of-rna-strands-class):

- extends the `StrictOptimizedSeqOps` trait, which overrides all transformation
  operations to take advantage of strict builders,
- uses a strict mode for overloads of transformation operations that return
  an `RNA`,
- has a companion object that extends `SpecificFactory[Base, RNA]`, which makes
  it possible to use it as a parameter of a `to` call (to convert any collection
  of bases to an `RNA`),
- moves the `newSpecificBuilder` and `fromSpecificIterable` implementations
  to the companion object.

The discussion so far centered on the minimal amount of definitions
needed to define new sequences with methods that obey certain
types. But in practice you might also want to add new functionality to
your sequences or to override existing methods for better
efficiency. An example of this is the overridden `iterator` method in
class `RNA`. `iterator` is an important method in its own right because it
implements loops over collections. Furthermore, many other collection
methods are implemented in terms of `iterator`. So it makes sense to
invest some effort optimizing the method's implementation. The
standard implementation of `iterator` in `IndexedSeq` will simply select
every `i`'th element of the collection using `apply`, where `i` ranges from
0 to the collection's length minus one. So this standard
implementation selects an array element and unpacks a base from it
once for every element in an RNA strand. The overriding `iterator` in
class `RNA` is smarter than that. For every selected array element it
immediately applies the given function to all bases contained in
it. So the effort for array selection and bit unpacking is much
reduced.

## Integrating a new prefix map ##

As a third example you'll learn how to integrate a new kind of map
into the collection framework. The idea is to implement a mutable map
with `String` as the type of keys by a "Patricia trie". The term
*Patricia* is in fact an abbreviation for "Practical Algorithm to
Retrieve Information Coded in Alphanumeric" and *trie* comes from
re*trie*val (a trie is also called a radix tree or prefix tree).
The idea is to store a set or a map as a tree where subsequent
characters in a search key
uniquely determine a path through the tree. For instance a Patricia trie
storing the strings "abc", "abd", "al", "all" and "xy" would look
like this:

A sample patricia trie:
<img src="{{ site.baseurl }}/resources/images/patricia.png" width="550">

To find the node corresponding to the string "abc" in this trie,
simply follow the subtree labeled "a", proceed from there to the
subtree labelled "b", to finally reach its subtree labelled "c". If
the Patricia trie is used as a map, the value that's associated with a
key is stored in the nodes that can be reached by the key. If it is a
set, you simply store a marker saying that the node is present in the
set.

Patricia tries support very efficient lookups and updates. Another
nice feature is that they support selecting a subcollection by giving
a prefix. For instance, in the patricia tree above you can obtain the
sub-collection of all keys that start with an "a" simply by following
the "a" link from the root of the tree.

Based on these ideas we will now walk you through the implementation
of a map that's implemented as a Patricia trie. We call the map a
`PrefixMap`, which means that it provides a method `withPrefix` that
selects a submap of all keys starting with a given prefix. We'll first
define a prefix map with the keys shown in the running example:

    scala> val m = PrefixMap("abc" -> 0, "abd" -> 1, "al" -> 2,
      "all" -> 3, "xy" -> 4)
    m: PrefixMap[Int] = Map((abc,0), (abd,1), (al,2), (all,3), (xy,4))

Then calling `withPrefix` on `m` will yield another prefix map:

    scala> m withPrefix "a"
    res14: PrefixMap[Int] = Map((bc,0), (bd,1), (l,2), (ll,3))

### Patricia trie implementation ###

~~~ scala
import scala.collection._
import scala.collection.mutable.{ GrowableBuilder, Builder }

class PrefixMap[A]
  extends mutable.Map[String, A]
    with mutable.MapOps[String, A, mutable.Map, PrefixMap[A]]
    with StrictOptimizedIterableOps[(String, A), mutable.Iterable, PrefixMap[A]] {

  var suffixes: immutable.Map[Char, PrefixMap[A]] = immutable.Map.empty
  var value: Option[A] = None

  def get(s: String): Option[A] =
    if (s.isEmpty) value
    else suffixes get (s(0)) flatMap (_.get(s substring 1))

  def withPrefix(s: String): PrefixMap[A] =
    if (s.isEmpty) this
    else {
      val leading = s(0)
      suffixes get leading match {
        case None =>
          suffixes = suffixes + (leading -> empty)
        case _ =>
      }
      suffixes(leading) withPrefix (s substring 1)
    }

  def iterator: Iterator[(String, A)] =
    (for (v <- value.iterator) yield ("", v)) ++
      (for ((chr, m) <- suffixes.iterator;
            (s, v) <- m.iterator) yield (chr +: s, v))

  def add(kv: (String, A)): this.type = {
    withPrefix(kv._1).value = Some(kv._2)
    this
  }

  def subtract(s: String): this.type  = {
    if (s.isEmpty) { val prev = value; value = None; prev }
    else suffixes get (s(0)) flatMap (_.remove(s substring 1))
    this
  }

  def empty = new PrefixMap[A]

  // Overloading of transformation methods that should return a PrefixMap
  def map[B](f: ((String, A)) => (String, B)): PrefixMap[B] = PrefixMap.from(View.Map(this, f))
  def flatMap[B](f: ((String, A)) => IterableOnce[(String, B)]): PrefixMap[B] = PrefixMap.from(View.FlatMap(this, f))

  // Override concat method to refine its return type
  override def concat[B >: A](suffix: Iterable[(String, B)]): PrefixMap[B] = PrefixMap.from(View.Concat(this, suffix))

  // Members declared in scala.collection.mutable.Clearable
  def clear(): Unit = suffixes = immutable.Map.empty
  // Members declared in scala.collection.IterableOps
  protected[this] def fromSpecificIterable(coll: Iterable[(String, A)]): PrefixMap[A] = PrefixMap.from(coll)
  protected[this] def newSpecificBuilder(): Builder[(String, A), PrefixMap[A]] = PrefixMap.newBuilder()
  // Members declared in scala.collection.MapOps
  def mapFactory: MapFactory[mutable.Map] = mutable.Map
  protected[this] def mapFromIterable[K2, V2](it: Iterable[(K2, V2)]): mutable.Map[K2,V2] = mapFactory.from(it)
}

object PrefixMap {
  def empty[A] = new PrefixMap[A]

  def from[A](source: IterableOnce[(String, A)]): PrefixMap[A] =
    source match {
      case pm: PrefixMap[A] => pm
      case _ => (newBuilder() ++= source).result()
    }

  def apply[A](kvs: (String, A)*): PrefixMap[A] = from(kvs)

  def newBuilder[A](): Builder[(String, A), PrefixMap[A]] =
    new GrowableBuilder[(String, A), PrefixMap[A]](empty)

  implicit def toFactory[A](self: this.type): Factory[(String, A), PrefixMap[A]] =
    new Factory[(String, A), PrefixMap[A]] {
      def fromSpecific(it: IterableOnce[(String, A)]): PrefixMap[A] = self.from(it)
      def newBuilder(): Builder[(String, A), PrefixMap[A]] = self.newBuilder()
    }

}
~~~

The previous listing shows the definition of `PrefixMap`. The map has
keys of type `String` and the values are of parametric type `A`. It extends
`mutable.Map[String, A]` and `mutable.MapOps[String, A, mutable.Map, PrefixMap[A]]`.
You have seen this pattern already for sequences in the
RNA strand example; then as now inheriting an implementation class
such as `MapOps` serves to get the right result type for
transformations such as `filter`.

A prefix map node has two mutable fields: `suffixes` and `value`. The
`value` field contains an optional value that's associated with the
node. It is initialized to `None`. The `suffixes` field contains a map
from characters to `PrefixMap` values. It is initialized to the empty
map.

You might ask why we picked an immutable map as the implementation
type for `suffixes`? Would not a mutable map have been more standard,
since `PrefixMap` as a whole is also mutable? The answer is that
immutable maps that contain only a few elements are very efficient in
both space and execution time. For instance, maps that contain fewer
than 5 elements are represented as a single object. By contrast, the
standard mutable map is a `HashMap`, which typically occupies around 80
bytes, even if it is empty. So if small collections are common, it's
better to pick immutable over mutable. In the case of Patricia tries,
we'd expect that most nodes except the ones at the very top of the
tree would contain only a few successors. So storing these successors
in an immutable map is likely to be more efficient.

Now have a look at the first method that needs to be implemented for a
map: `get`. The algorithm is as follows: To get the value associated
with the empty string in a prefix map, simply select the optional
`value` stored in the root of the tree (the current map).
Otherwise, if the key string is
not empty, try to select the submap corresponding to the first
character of the string. If that yields a map, follow up by looking up
the remainder of the key string after its first character in that
map. If the selection fails, the key is not stored in the map, so
return with `None`. The combined selection over an option value `opt` is
elegantly expressed using `opt.flatMap(x => f(x))`. When applied to an
optional value that is `None`, it returns `None`. Otherwise `opt` is
`Some(x)` and the function `f` is applied to the encapsulated value `x`,
yielding a new option, which is returned by the flatmap.

The next two methods to implement for a mutable map are `+=` and `-=`. In
the implementation of `PrefixMap`, these are defined in terms of two
other methods: `add` and `subtract`.

The `subtract` method is very similar to `get`, except that before returning
any associated value, the field containing that value is set to
`None`. The `add` method first calls `withPrefix` to navigate to the tree
node that needs to be updated, then sets the `value` field of that node
to the given value. The `withPrefix` method navigates through the tree,
creating sub-maps as necessary if some prefix of characters is not yet
contained as a path in the tree.

The last abstract method to implement for a mutable map is
`iterator`. This method needs to produce an iterator that yields all
key/value pairs stored in the map. For any given prefix map this
iterator is composed of the following parts: First, if the map
contains a defined value, `Some(x)`, in the `value` field at its root,
then `("", x)` is the first element returned from the
iterator. Furthermore, the iterator needs to traverse the iterators of
all submaps stored in the `suffixes` field, but it needs to add a
character in front of every key string returned by those
iterators. More precisely, if `m` is the submap reached from the root
through a character `chr`, and `(s, v)` is an element returned from
`m.iterator`, then the root's iterator will return `(chr +: s, v)`
instead. This logic is implemented quite concisely as a concatenation
of two `for` expressions in the implementation of the `iterator` method in
`PrefixMap`. The first `for` expression iterates over `value.iterator`. This
makes use of the fact that `Option` values define an iterator method
that returns either no element, if the option value is `None`, or
exactly one element `x`, if the option value is `Some(x)`.

However, in all these cases, to build the right kind of colletion
you need to start with an empty collection of that kind. This is
provided by the `empty` method, which is the last method defined in
`PrefixMap`. This method simply returns a fresh `PrefixMap`.

We'll now turn to the companion object `PrefixMap`. In fact it is not
strictly necessary to define this companion object, as class `PrefixMap`
can stand well on its own. The main purpose of object `PrefixMap` is to
define some convenience factory methods. It also defines an implicit
`Factory` for a better interoperability with other collections.

The two convenience methods are `empty` and `apply`. The same methods are
present for all other collections in Scala's collection framework so
it makes sense to define them here, too. With the two methods, you can
write `PrefixMap` literals like you do for any other collection:

    scala> PrefixMap("hello" -> 5, "hi" -> 2)
    res0: PrefixMap[Int] = Map(hello -> 5, hi -> 2)

    scala> PrefixMap.empty[String]
    res2: PrefixMap[String] = Map()

## Summary ##

To summarize, if you want to fully integrate a new collection class
into the framework you need to pay attention to the following points:

1. Decide whether the collection should be mutable or immutable.
2. Pick the right base traits for the collection.
3. Inherit from the right implementation trait to implement most
   collection operations.

You have now seen how Scala's collections are built and how you can
add new kinds of collections. Because of Scala's rich support for
abstraction, each new collection type has a large number of
methods without having to reimplement them all over again.

### Acknowledgement ###

These pages contain material adapted from the 2nd edition of
[Programming in Scala](http://www.artima.com/shop/programming_in_scala) by
Odersky, Spoon and Venners. We thank Artima for graciously agreeing to its
publication.
