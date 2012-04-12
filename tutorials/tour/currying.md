---
layout: tutorial
title: Currying

disqus: true

tutorial: scala-tour
num: 15
---

Methods may define multiple parameter lists. When a method is called with a fewer number of parameter lists, then this will yield a function taking the missing parameter lists as its arguments.

Here is an example:

    object CurryTest extends App {
    
      def filter(xs: List[Int], p: Int => Boolean): List[Int] =
        if (xs.isEmpty) xs
        else if (p(xs.head)) xs.head :: filter(xs.tail, p)
        else filter(xs.tail, p)
    
      def modN(n: Int)(x: Int) = ((x % n) == 0)
    
      val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
      println(filter(nums, modN(2)))
      println(filter(nums, modN(3)))
    }

_Note: method `modN` is partially applied in the two `filter` calls; i.e. only its first argument is actually applied. The term `modN(2)` yields a function of type `Int => Boolean` and is thus a possible candidate for the second argument of function `filter`._

Here's the output of the program above:

    List(2,4,6,8)
    List(3,6)
