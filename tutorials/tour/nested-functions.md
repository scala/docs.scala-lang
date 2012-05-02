---
layout: tutorial
title: Nested Functions

disqus: true

tutorial: scala-tour
num: 13
---

In Scala it is possible to nest function definitions. The following object provides a `filter` function for extracting values from a list of integers that are below a threshold value:

    object FilterTest extends App {
      def filter(xs: List[Int], threshold: Int) = {
        def process(ys: List[Int]): List[Int] =
          if (ys.isEmpty) ys
          else if (ys.head < threshold) ys.head :: process(ys.tail)
          else process(ys.tail)
        process(xs)
      }
      println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
    }

_Note: the nested function `process` refers to variable `threshold` defined in the outer scope as a parameter value of `filter`._

The output of this program is:

    List(1,2,3,4)
