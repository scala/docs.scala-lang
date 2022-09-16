---
layout: tour
title: Nested Methods
partof: scala-tour

num: 11
next-page: multiple-parameter-lists
previous-page: higher-order-functions

redirect_from: "/tutorials/tour/nested-functions.html"
---

In Scala it is possible to nest method definitions. The following object provides a `factorial` method for computing the factorial of a given number:

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

The output of this program is:

{% tabs Nested_functions_result %}

{% tab 'Scala 2 and 3' for=Nested_functions_result %}
```
Factorial of 2: 2
Factorial of 3: 6
```
{% endtab %}

{% endtabs %}
