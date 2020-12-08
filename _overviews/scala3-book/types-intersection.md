---
title: Intersection Types
type: section
description: This section introduces and demonstrates intersection types in Scala 3.
num: 17
previous-page: types-generics
next-page: types-union
---


Used on types, the `&` operator creates an intersection type. The type `A & B` represents values that are of the type `A` and `B` at the same time. For instance, this example uses the type `Resettable & Growable[String]`:

```scala
trait Resettable:
  def reset(): Unit

trait Growable[B]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]) =
  x.reset()
  x.add("first")
```

In the method `f` in this example, the parameter `x` is required to be *both* a `Resettable` and a `Growable[String]`.

The members of an intersection type `A & B` are all the members of `A` and all the members of `B`. Therefore, as shown, `Resettable & Growable[String]` has member methods `reset` and `add`.

>Note that `&` is _commutative_: `A & B` is the same type as `B & A`.




{% comment %}
This section is good, but maybe too much detail for an overview.

If a member appears in both `A` and `B`, its type in `A & B` is the intersection of its type in `A` and its type in `B`. For instance, assume the definitions:

```scala
trait A {
  def children: List[A]
}
trait B {
  def children: List[B]
}
val x: A & B = new C
val ys: List[A & B] = x.children
```

The type of `children` in `A & B` is the intersection of `children`'s type in `A` and its type in `B`, which is `List[A] & List[B]`. This can be further simplified to `List[A & B]` because `List` is covariant.

One might wonder how the compiler could come up with a definition for `children` of type `List[A & B]` since what is given are `children` definitions of type `List[A]` and `List[B]`. The answer is the compiler does not need to. `A & B` is just a type that represents a set of requirements for values of the type. At the point where a value is _constructed_, one must make sure that all inherited members are correctly defined. So if one defines a class `C` that inherits `A` and `B`, one needs to give at that point a definition of a `children` method with the required type.

```scala
class C extends A with B {
  def children: List[A & B] = ???
}
```
{% endcomment %}




