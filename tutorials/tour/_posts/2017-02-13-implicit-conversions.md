---
layout: tutorial
title: Implicit Conversions

discourse: true

tutorial: scala-tour
categories: tour
num: 27
next-page: polymorphic-methods
previous-page: implicit-parameters
---

An implicit conversion from type `S` to type `T` is defined by an implicit value which has function type `S => T`, or by an implicit method convertible to a value of that type.

Implicit conversions are applied in two situations:

* If an expression `e` is of type `S`, and `S` does not conform to the expression's expected type `T`.
* In a selection `e.m` with `e` of type `S`, if the selector `m` does not denote a member of `S`.

In the first case, a conversion `c` is searched for which is applicable to `e` and whose result type conforms to `T`.
In the second case, a conversion `c` is searched for which is applicable to `e` and whose result contains a member named `m`.

The following operation on the two lists xs and ys of type `List[Int]` is legal:

```
xs <= ys
```

assuming the implicit methods `list2ordered` and `int2ordered` defined below are in scope:

```
implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { /* .. */ }

implicit def int2ordered(x: Int): Ordered[Int] =
  new Ordered[Int] { /* .. */ }
```

The implicitly imported object `scala.Predef` declares several predefined types (e.g. `Pair`) and methods (e.g. `assert`) but also several implicit conversions.

For example, when calling a Java method that expects a `java.lang.Integer`, you are free to pass it a `scala.Int` instead. That's because Predef includes the following implicit conversions:

```tut
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

Because implicit conversions can have pitfalls if used indiscriminately the compiler warns when compiling the implicit conversion definition.

To turn off the warnings take either of these actions:

* Import `scala.language.implicitConversions` into the scope of the implicit conversion definition
* Invoke the compiler with `-language:implicitConversions`

No warning is emitted when the conversion is applied by the compiler.
