---
layout: tour
title: Funkcje zagnieżdżone

discourse: false

partof: scala-tour

num: 9
language: pl
next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

Scala pozwala na zagnieżdżanie definicji funkcji.
Poniższy obiekt określa funkcję `factorial`, która oblicza silnię dla danej liczby:

{% scalafiddle %}
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
{% endscalafiddle %}

Wynik działania powyższego programu:

```
Factorial of 2: 2
Factorial of 3: 6
```
