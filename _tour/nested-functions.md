---
layout: tour
title: Nested Methods

discourse: true

partof: scala-tour

num: 9
next-page: multiple-parameter-lists
previous-page: higher-order-functions

redirect_from: "/tutorials/tour/nested-functions.html"
---

In Scala it is possible to nest method definitions. The following object provides a `factorial` method for computing the factorial of a given number:

```tut
 def factorial(x: Int): Int = {
    def fact(x: Int, accumulator: Int): Int = {
      if (x <= 1) accumulator
      else fact(x - 1, x * accumulator)
    }  
    fact(x, 1)
 }

 println("Factorial of 2: " + factorial(2))
 println("Factorial of 3: " + factorial(3))
```

The output of this program is:

```
Factorial of 2: 2
Factorial of 3: 6
```
