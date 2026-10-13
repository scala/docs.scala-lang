---
layout: tour
title: Nested Methods
partof: scala-tour

num: 11

language: fr

next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

En Scala il est possible d'empiler les définitions de méthode. L'objet suivant fourni une méthode `factorial` pour calculer la factorielle d'un nombre donnée :

{% scalafiddle %}
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
{% endscalafiddle %}

La sortie de ce programme est :

```
Factorial of 2: 2
Factorial of 3: 6
```
