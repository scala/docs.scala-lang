---
layout: tour
title: Ugniježdene metode
language: ba
partof: scala-tour

num: 9
next-page: multiple-parameter-lists
previous-page: higher-order-functions

---

U Scali je moguće ugnježdavati definicije metode.
Sljedeći objekt sadrži metodu `factorial` za računanje faktorijela datog broja:

```scala mdoc
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

