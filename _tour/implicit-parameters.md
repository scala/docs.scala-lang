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

A method can have an _implicit_ parameter list, marked by the _implicit_ keyword at the start of the parameter list. If the parameters in that parameter list are not passed as usual, scala will look if it can get an implicit value of the correct type, and if it can, pass it automatically.

The places scala will look for these parameters fall into two categories:

* First, eligible are all identifiers that can be accessed at the point of the method call without a prefix and that denote an implicit definition or an implicit parameter.
* Second, eligible are also all members of companion objects of the implicit parameter's type that are labeled implicit.

In the following example we define a method `sum` which computes the sum of a list of elements using the monoid's `add` and `unit` operations. Please note that implicit values can not be top-level.

```tut
abstract class Monoid[A] {
  def add(x: A, y: A): A
  def unit: A
}

object ImplicitTest {
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
    
  def main(args: Array[String]): Unit = {
    println(sum(List(1, 2, 3)))       // uses IntMonoid implicitly
    println(sum(List("a", "b", "c"))) // uses StringMonoid implicitly
  }
}
```

`Monoid` defines an operation called `add` here, that combines a pair of `A`s and returns another `A`, together with an operation called `unit` that is able to create some (specific) `A`.

To show how implicit parameters work, we first define monoids `StringMonoid` and `IntMonoid` for strings and integers, respectively. The `implicit` keyword indicates that the corresponding object can be used implicitly.

The method `sum` takes a `List[A]` and returns an `A`, which takes the initial `A` from `unit`, and combines each next `A` in the list to that with the `add` method. Making the parameter `m` implicit here means we only have to provide the `xs` parameter when we call the method if scala can find a an implict `Monoid[A]` to use for the implicit `m` parameter.

In our `main` method we call `sum` twice, and only provide the `xs` parameter. Scala will now look for an implicit in the scope mentioned above. The first call to `sum` passes a `List[Int]` for `xs`, which means that `A` is `Int`. The implicit parameter list with `m` is left out, so scala will look for an implicit of type `Monoid[Int]`. The first lookup rule reads

> First, eligible are all identifiers that can be accessed at the point of the method call without a prefix and that denote an implicit definition or an implicit parameter.

`IntMonoid` is an identifier, it can be accessed directly in `main`, and it is an implicit definition. It is also of the correct type, so it's passed to the sum method automatically.

The second call to `sum` passes a `List[String]`, which means that `A` is `String`. Implicit lookup will go the same way as with `Int`, but will this time find `StringMonoid`, and passes that automatically as `m`.

The program will output
```
6
abc
```
