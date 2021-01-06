---
title: Variance
type: section
description: This section introduces and demonstrates variance in Scala 3.
num: 53
previous-page: types-adts-gadts
next-page: types-opaque-types
---

Type parameter _variance_ controls the subtyping of parameterized types (like classes or traits).

To explain variance, let us assume the following type definitions:
```scala
trait Item { def productNumber: String }
trait Buyable extends Item { def price: Int }
trait Book extends Buyable { def isbn: String }
```

Let us also assume the following parameterized types:
```scala
// an example of an invariant type
trait Pipeline[T]:
  def process(t: T): T

// an example of an covariant type
trait Producer[+T]:
  def make: T

// an example of an contravariant type
trait Consumer[-T]:
  def take(t: T): Unit
```
In general there are three modes of variance:

- **invariant**---the default, written like `Pipeline[T]`
- **covariant**---annotated with a `+`, such as `Producer[+T]`
- **contravariant**---annotated with a `-`, like in `Consumer[-T]`

We will now go into detail on what this annotation means and why we use it.

### Invariant Types
By default, types like `Pipeline` are invariant in their type argument (`T` in this case).
This means that types like `Pipeline[Item]`, `Pipeline[Buyable]`, and `Pipeline[Item]` are in _no subtyping relationship_ to each other.

And rightfully so! Assume the following method that consumes two values of type `Pipeline[Buyable]`, and passes its argument `b` to one of them, based on the price:

```scala
def oneOf(
  p1: Pipeline[Buyable],
  p2: Pipeline[Buyable],
  b: Buyable
): Buyable =
  val b1 = p1.process(b)
  val b2 = p2.process(b)
  if b1.price < b2.price then b1 else b2
```
Now, recall that we have the following _subtyping relationship_ between our types:
```scala
Book <: Buyable <: Item
```
We cannot pass a `Pipeline[Book]` to the method `oneOf` because in its implementation, we call `p1` and `p2` with a value of type `Buyable`.
A `Pipeline[Book]` expects a `Book`, which can potentially cause a runtime error.

We cannot pass a `Pipeline[Item]` because calling `process` on it only promises to return an `Item`; however, we are supposed to return a `Buyable`.

#### Why Invariant?
In fact, type `Pipeline` needs to be invariant since it uses its type parameter `T` _both_ as an argument _and_ as a return type.
For the same reason, some types in the Scala collection library---like `Array` or `Set`---are also _invariant_.


### Covariant Types
In contrast to `Pipeline`, which is invariant, the type `Producer` is marked as **covariant** by prefixing the type parameter with a `+`.
This is valid, since the type parameter is only used in a _return position_.

Marking it as covariant means that we can pass (or return) a `Producer[Book]` where a `Producer[Buyable]` is expected.
And in fact, this is sound: The type of `Producer[Buyable].make` only promises to _return_ a `Buyable`.
As a caller of `make`, we will be happy to also accept a `Book`, which is a subtype of `Buyable`---that is, it is _at least_ a `Buyable`.

This is illustrated by the following example, where the function `makeTwo` expects a `Producer[Buyable]`:
```scala
def makeTwo(p: Producer[Buyable]): Int =
  p.make.price + p.make.price
```
It is perfectly fine to pass a producer for books:
```
val bookProducer: Producer[Book] = ???
makeTwo(bookProducer)
```
The call to `price` within `makeTwo` is still valid also for books.


#### Covariant Types for Immutable Containers
You will encounter covariant types a lot when dealing with immutable containers, like those that can be found in the standard library (such as `List`, `Seq`, `Vector`, etc.).

For example, `List` and `Vector` are approximately defined as:

```scala
class List[+A] ...
class Vector[+A] ...
```

This way, you can use a `List[Book]` where a `List[Buyable]` is expected.
This also intuitively makes sense: If you are expecting a collection of things that can be bought, it should be fine to give you a collection of books.
They have an additional ISBN method in our example, but you are free to ignore these additional capabilities.


### Contravariant Types
In contrast to the type `Producer`, which is marked as covariant, the type `Consumer` is marked as **contravariant** by prefixing the type parameter with a `-`.
This is valid, since the type parameter is only used in an _argument position_.

Marking it as contravariant means that we can pass (or return) a `Producer[Item]` where a `Producer[Buyable]` is expected.
That is, we have the subtyping relationship `Producer[Item] <: Producer[Buyable]`.
Remember, for type `Consumer`, it was the other way around, and we had `Consumer[Buyable] <: Consumer[Item]`.

And in fact, this is sound: The type of `Producer[Buyable].make` only promises us to _return_ a `Buyable`.
As a caller of `make`, we will be happy to also accept a `Book`, which is a subtype of `Buyable`---that is, it is _at least_ a `Buyable`.


#### Contravariant Types for Consumers
Contravariant types are much less common than covariant types.
As in our example, you can think of them as “consumers.” The most important type that you might come across that is marked contravariant is the one of functions:

```scala
trait Function[-A, +B]:
  def apply(a: A): B
```
Its argument type `A` is marked as contravariant `A`---it consumes values of type `A`.
In contrast, its result type `B` is marked as covariant---it produces values of type `B`.

Here are some examples that illustrate the subtyping relationships induced by variance annotations on functions:

```scala
val f: Function[Buyable, Buyable] = b => b

// OK to return a Buyable where a Item is expected
val g: Function[Buyable, Item] = f

// OK to provide a Book where a Buyable is expected
val h: Function[Book, Buyable] = g
```

## Summary
In this section, we have encountered three different kinds of variance:

- **Producers** are typically covariant, and mark their type parameter with `+`.
  This also holds for immutable collections.
- **Consumers** are typically contravariant, and mark their type parameter with `-`.
- Types that are **both** producers and consumers have to be invariant, and do not require any marking on their type parameter.
  Immutable collections like `Array` fall into this category.
