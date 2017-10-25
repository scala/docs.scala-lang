---
layout: tour
title: Implicit Parameters

discourse: true

partof: scala-tour

num: 26
next-page: implicit-conversions
previous-page: self-types

redirect_from: "/tutorials/tour/implicit-parameters.html"
---

A method with _implicit parameters_ can be applied to arguments just like a normal method. In this case the implicit label has no effect. However, if such a method misses arguments for its implicit parameters, such arguments will be automatically provided.

The actual arguments that are eligible to be passed to an implicit parameter fall into two categories:

* First, eligible are all identifiers x that can be accessed at the point of the method call without a prefix and that denote an implicit definition or an implicit parameter.
* Second, eligible are also all members of companion modules of the implicit parameter's type that are labeled implicit.

In the following example we define a method `sum` which computes the sum of a list of elements using the monoid's `add` and `unit` operations. Please note that implicit values can not be top-level, they have to be members of a template.

```tut
abstract class SemiGroup[A] {
  def add(x: A, y: A): A
}
abstract class Monoid[A] extends SemiGroup[A] {
  def unit: A
}
object ImplicitTest extends App {
  implicit object StringMonoid extends Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  implicit object IntMonoid extends Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))

  println(sum(List(1, 2, 3)))       // uses IntMonoid implicitly
  println(sum(List("a", "b", "c"))) // uses StringMonoid implicitly
}
```

This example uses a structure from abstract algebra to show how implicit parameters work. A semigroup, modeled by `SemiGroup` here, is an algebraic structure on a set of `A` with an (associative) operation, called `add` here, that combines a pair of `A`s and returns another `A`.

A monoid, modeled by `Monoid` here, is a semigroup with a distinguished element of `A`, called `unit`, that when combined with any other element of `A` returns that other element again.

To show how implicit parameters work, we first define monoids `StringMonoid` and `IntMonoid` for strings and integers, respectively. The `implicit` keyword indicates that the corresponding object can be used implicitly, within this scope, as a parameter of a function marked implicit.

Method `sum` takes a `List[A]` and returns an `A`, which represents the result of applying the monoid operation successively across the whole list. Making the parameter `m` implicit here means we only have to provide the `xs` parameter at the call site, since if we have a `List[A]` we know what type `A` actually is and therefore what type `Monoid[A]` is needed. We can then implicitly find whichever `val` or `object` in the current scope also has that type and use that without needing to specify it explicitly.

Finally, we call `sum` twice, with only one parameter each time. Since the second parameter of `sum`, `m`, is implicit, its value is looked up in the current scope, based on the type of monoid required in each case, meaning both expressions can be fully evaluated.

Here is the output of the Scala program:

```
6
abc
```
