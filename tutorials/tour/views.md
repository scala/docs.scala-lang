---
layout: tutorial
title: Views

disqus: true

tutorial: scala-tour
num: 32
---

[Implicit parameters](implicit-parameters.html) and methods can also define implicit conversions called _views_. A view from type `S` to type `T` is defined by an implicit value which has function type `S => T`, or by an implicit method convertible to a value of that type.

Views are applied in two situations:
* If an expression `e` is of type `S`, and `S` does not conform to the expression's expected type `T`.
* In a selection `e.m` with `e` of type `T`, if the selector `m` does not denote a member of `T`.

In the first case, a view `v` is searched which is applicable to `e` and whose result type conforms to `T`. 
In the second case, a view `v` is searched which is applicable to `e` and whose result contains a member named `m`.

The following operation on the two lists xs and ys of type `List[Int]` is legal:

    xs <= ys

assuming the implicit methods `list2ordered` and `int2ordered` defined below are in scope:

    implicit def list2ordered[A](x: List[A])
        (implicit elem2ordered: a => Ordered[A]): Ordered[List[A]] =
      new Ordered[List[A]] { /* .. */ }
    
    implicit def int2ordered(x: Int): Ordered[Int] = 
      new Ordered[Int] { /* .. */ }
  
The `list2ordered` function can also be expressed with the use of a _view bound_ for a type parameter:

    implicit def list2ordered[A <% Ordered[A]](x: List[A]): Ordered[List[A]] = ...
  
The Scala compiler then generates code equivalent to the definition of `list2ordered` given above.

The implicitly imported object `scala.Predef` declares several predefined types (e.g. `Pair`) and methods (e.g. `assert`) but also several views. The following example gives an idea of the predefined view `charWrapper`:

    final class RichChar(c: Char) {
      def isDigit: Boolean = Character.isDigit(c)
      // isLetter, isWhitespace, etc.
    }
    object RichCharTest {
      implicit def charWrapper(c: char) = new RichChar(c)
      def main(args: Array[String]) {
        println('0'.isDigit)
      }
    }

