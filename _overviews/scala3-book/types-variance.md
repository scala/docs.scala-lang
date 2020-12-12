---
title: Variance
type: section
description: This section introduces and demonstrates variance in Scala 3.
num: 44
previous-page: types-type-classes
next-page: types-opaque-types
---

*Variance* is a way to express how a parameterized type on a class, trait, or enum is allowed to vary. Variance is a complicated topic, but the five-minute explanation goes as follows.


## Rule 1: Use `+A` for immutable containers

If you’re creating a construct like an immutable container — such as a `List` or `Vector` — specify the container with the generic type `A` preceded by a `+` symbol:

```scala
class Container[+A]
```

This is exactly how `List` and `Vector` are defined:

```scala
sealed abstract class List[+A] ...
sealed abstract class Vector[+A] extends ...
```

This provides for maximum flexibility in how the container can later be used. For example, given this type hierarchy and list of cats:

```scala
sealed trait Pet:
    def name: String
    override def toString = name
class Dog(val name: String) extends Pet
class Cat(val name: String) extends Pet

val cats = List(Cat("Garfield"), Cat("Sylvester"))
```
<!-- val dogs = List(Dog("Fido"), Dog("Rover")) -->

You can assign a `List[Pet]` reference to the `List[Cat]`:

```scala
// this is allowed, it compiles
val pets: List[Pet] = cats
```

This works because the `+A` tells the compiler that a `List[Pet]` is allowed to contain a `List[Cat]`. This type of variance is allowed.

You know that this is allowed because `List` is immutable, and you can’t later do this:

```scala
// compiler error. you can’t mutate `pets`.
pets(0) = Dog("Balto")
```

Allowing this would be bad, because `pets` is a reference that points to `cats`, which has the type `List[Cat]`. This line of code attempts to put a `Dog` as the first element of `cats`. This can’t be allowed, so the compiler generates an error at this point.

However, note that these examples are allowed, a new `List[Pet]` is allowed to contain both `Cat` and `Dog` types:

```scala
val dogsAndCats: List[Pet] = dogs ++ cats
val pets: List[Pet] = cats.updated(0, Dog("Fido"))
```

### Summary

The compiler doesn’t know that `List` is immutable, but when you define it as `List[+A]`, it knows:

- You can’t point a `List[Pet]` reference at an *existing* `List[Cat]`
- That it’s safe for a *new* `List[Pet]` to contain both `Cat` and `Dog` types

Technically the type `+A` is known as a *covariant* type, which means that a collection that contains the type `A` is also allowed to contain subtypes of `A`, just as a new `List[Pet]` is allowed to contain both `Cat` and `Dog` types. You can say that types are allowed to vary in the direction of subtypes.



## Rule 2: Use `A` for mutable containers

Conversely, an `ArrayBuffer`, which is mutable, is defined with the type `A`, like this:

```scala
class ArrayBuffer[A] extends ...
```

Next, you can create an `ArrayBuffer` that contains the type `Cat`:

```scala
import scala.collection.mutable.ArrayBuffer
val cats = ArrayBuffer(Cat("Garfield"), Cat("Sylvester"))
```

However, now when you attempt to point an `ArrayBuffer[Pet]` at `cats`, the compiler doesn’t allow this:

```scala
// this won’t compile
val pets: ArrayBuffer[Pet] = cats
```

The compiler sees that `ArrayBuffer` is defined to take the type `A` — not `+A` — so it stops you here. The compiler doesn’t know that an `ArrayBuffer` is mutable, but it does know that the type `A` is not allowed to vary.

The issue is that if the compiler allows this step, you could now write code like this:

```scala
pets(0) = Dog("Balto")   // this won’t compile
```

In theory, if the compiler allowed the previous step, `pets` would be an `ArrayBuffer[Pet]` reference that points to an `ArrayBuffer[Cat]`; if any of these steps were allowed, you could put a `Dog` into an `ArrayBuffer[Cat]`. Because that can’t be allowed, the compiler stops you here:

```scala
// this won’t compile
val pets: ArrayBuffer[Pet] = cats
```

### Summary

The compiler doesn’t know that `ArrayBuffer` is mutable, but when you define it as `ArrayBuffer[A]`, it knows that it’s *not* safe for an `ArrayBuffer[Pet]` should not be allowed to contain the `Cat` and `Dog` types. The type `A` is not allowed to vary, and technically it’s known as an *invariant* type.



## Summary

As it’s written in the PDF, *Scala By Example*, in a purely functional world, you’d only use immutable collections like `List` and `Vector`, and all types could be considered covariant. However, in a world where mutability is allowed, you need to be able to express the concept of *variance*.

>Types can also be expressed as *contravariant* by marking them as `-A`. For instance, in Scala 2 the `Function1` trait is defined as `trait Function1[-T1, +R]`. This type is used much less often. You can find more details about it — along with more information about variance — in the Reference documentation.


