---
layout: tutorial
title: Polymorphic Methods

disqus: true

tutorial: scala-tour
num: 21
---

Methods in Scala can be parameterized with both values and types. Like on the class level, value parameters are enclosed in a pair of parentheses, while type parameters are declared within a pair of brackets.

Here is an example:

    object PolyTest extends App {
      def dup[T](x: T, n: Int): List[T] =
        if (n == 0)
          Nil
        else
          x :: dup(x, n - 1)

      println(dup[Int](3, 4))
      println(dup("three", 3))
    }

Method `dup` in object `PolyTest` is parameterized with type `T` and with the value parameters `x: T` and `n: Int`. When method `dup` is called, the programmer provides the required parameters _(see line 8 in the program above)_, but as line 9 in the program above shows, the programmer is not required to give actual type parameters explicitly. The type system of Scala can infer such types. This is done by looking at the types of the given value parameters and at the context where the method is called.

Please note that the trait `App` is designed for writing short test programs, but should be avoided for production code (for Scala versions 2.8.x and earlier) as it may affect the ability of the JVM to optimize the resulting code; please use `def main()` instead.
