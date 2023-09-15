---
layout: tour
title: Вызов по имени
partof: scala-tour
num: 31
language: ru
next-page: annotations
previous-page: operators
---

_Вызов параметров по имени_ - это когда значение параметра вычисляется только в момент вызова параметра. Этот способ противоположен _вызову по значению_. Чтоб вызов параметра был по имени, необходимо просто указать `=>` перед его типом.

{% tabs by-name-parameters_1 %}
{% tab 'Scala 2 и 3' for=by-name-parameters_1 %}

```scala mdoc
def calculate(input: => Int) = input * 37
```

{% endtab %}
{% endtabs %}

Преимущество вызова параметров по имени заключается в том, что они не вычисляются если не используются в теле функции. С другой стороны плюсы вызова параметров по значению в том, что они вычисляются только один раз.

Вот пример того, как мы можем реализовать условный цикл:

{% tabs by-name-parameters_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=by-name-parameters_2 %}

```scala mdoc
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // выведет 2 1
```

{% endtab %}
{% tab 'Scala 3' for=by-name-parameters_2 %}

```scala
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if condition then
    body
    whileLoop(condition)(body)

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // выведет 2 1
```

{% endtab %}
{% endtabs %}

Метод `whileLoop` использует несколько списков параметров - условие и тело цикла. Если `condition` является верным, выполняется `body`, а затем выполняется рекурсивный вызов whileLoop. Если `condition` является ложным, то тело никогда не вычисляется, тк у нас стоит `=>` перед типом `body`.

Теперь, когда мы передаем `i > 0` как наше условие `condition` и `println(i); i-= 1` как тело `body`, код ведет себя также как обычный цикл в большинстве языков программирования.

Такая возможность откладывать вычисления параметра до его использования может помочь повысить производительность, отсекая не нужные вычисления при определенных условиях.
