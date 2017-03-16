---
layout: tutorial
title: Nested Methods

disqus: true

tutorial: scala-tour
categories: tour
num: 9
next-page: currying
previous-page: higher-order-functions
---

In Scala it is possible to nest function definitions. The following object provides a `factorial` function for computing the factorial of a given number:

```tut
object FactorialTest extends App {
  def factorial(x: Int): Int = {
    def fact(x: Int, accumulator: Int): Int = {
      if (x <= 1) accumulator
      else fact(x - 1, x * accumulator)
    }  
    fact(x, 1)
  }
  println("Factorial of 2: " + factorial(2))
  println("Factorial of 3: " + factorial(3))
}
```

_Note: the nested function `fact` refers to variable `x` defined in the outer scope as a parameter value of `factorial`._

The output of this program is:

```
Factorial of 2: 2
Factorial of 3: 6
```
