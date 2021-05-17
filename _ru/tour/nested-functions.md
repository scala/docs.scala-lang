---
layout: tour
title: Вложенные Методы

discourse: true

partof: scala-tour

num: 9
language: ru
next-page: multiple-parameter-lists
previous-page: higher-order-functions

---

В Scala возможно объявление метода вкладывать в тело другого метода. Это реализовано в следующем примере, в котором метод `factorial` используется для вычисления факториала заданного числа:

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

Результат выполнения программы:

```
Factorial of 2: 2
Factorial of 3: 6
```
