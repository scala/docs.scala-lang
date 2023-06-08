---
layout: tour
title: Вложенные Методы
partof: scala-tour
num: 9
language: ru
next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

В Scala возможно объявление метода вкладывать в тело другого метода. Это реализовано в следующем примере, в котором метод `factorial` используется для вычисления факториала заданного числа:

{% tabs Nested_functions_definition class=tabs-scala-version %}

{% tab 'Scala 2' for=Nested_functions_definition %}

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

{% endtab %}

{% tab 'Scala 3' for=Nested_functions_definition %}

```scala
def factorial(x: Int): Int =
  def fact(x: Int, accumulator: Int): Int =
    if x <= 1 then accumulator
    else fact(x - 1, x * accumulator)
  fact(x, 1)

println("Factorial of 2: " + factorial(2))
println("Factorial of 3: " + factorial(3))

```

{% endtab %}

{% endtabs %}

{% tabs Nested_functions_result %}

{% tab 'Scala 2 и 3' for=Nested_functions_result %}

Результат выполнения программы:

```
Factorial of 2: 2
Factorial of 3: 6
```

{% endtab %}

{% endtabs %}
