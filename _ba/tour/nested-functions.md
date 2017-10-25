---
layout: tour
title: Ugniježdene metode
language: ba

discourse: true

partof: scala-tour

num: 9
next-page: currying
previous-page: higher-order-functions

redirect_from: "/tutorials/tour/nested-functions.html"
---

U Scali je moguće ugnježdavati definicije metode.
Sljedeći objekt sadrži metodu `factorial` za računanje faktorijela datog broja:

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

Izlaz ovog programa je:

```
Factorial of 2: 2
Factorial of 3: 6
```

