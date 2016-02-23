---
layout: tutorial
title: Polymorphic Methods

disqus: true

tutorial: scala-tour
num: 27

tutorial-next: local-type-inference
tutorial-previous: implicit-conversions
---

Methods in Scala can be parameterized with both values and types. Like on the class level, value parameters are enclosed in a pair of parentheses, while type parameters are declared within a pair of brackets.

Here is an example:

    def dup[T](x: T, n: Int): List[T] =
      if (n == 0)
        Nil
      else
        x :: dup(x, n - 1)

    println(dup[Int](3, 4))
    println(dup("three", 3))

Method `dup` is parameterized with type `T` and with the value parameters `x: T` and `n: Int`. In the first call to `dup`, the programmer provides the required parameters, but as the following line shows, the programmer is not required to give actual type parameters explicitly. The type system of Scala can infer such types. This is done by looking at the types of the given value parameters and at the context where the method is called.
