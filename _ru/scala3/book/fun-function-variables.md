---
layout: multipage-overview
title: Параметры функции
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице показано, как использовать параметры функции в Scala.
language: ru
num: 29
previous-page: fun-anonymous-functions
next-page: fun-eta-expansion
---


Вернемся к примеру из предыдущего раздела:

{% tabs fun-function-variables-1 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

Анонимной функцией является следующая часть:

{% tabs fun-function-variables-2 %}
{% tab 'Scala 2 и 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

Причина, по которой она называется _анонимной_ (_anonymous_), заключается в том, 
что она не присваивается переменной и, следовательно, не имеет имени.

Однако анонимная функция, также известная как _функциональный литерал_ (_function literal_), 
может быть назначена переменной для создания _функциональной переменной_ (_function variable_):

{% tabs fun-function-variables-3 %}
{% tab 'Scala 2 и 3' %}
```scala
val double = (i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

Код выше создает функциональную переменную с именем `double`. 
В этом выражении исходный литерал функции находится справа от символа `=`:

{% tabs fun-function-variables-4 %}
{% tab 'Scala 2 и 3' %}
```scala
val double = (i: Int) => i * 2
             -----------------
```
{% endtab %}
{% endtabs %}

, а новое имя переменной - слева: 

{% tabs fun-function-variables-5 %}
{% tab 'Scala 2 и 3' %}
```scala
val double = (i: Int) => i * 2
    ------
```
{% endtab %}
{% endtabs %}

список параметров функции подчеркнут:

{% tabs fun-function-variables-6 %}
{% tab 'Scala 2 и 3' %}
```scala
val double = (i: Int) => i * 2
             --------
```
{% endtab %}
{% endtabs %}

Как и список параметров для метода, список параметров функции означает, 
что функция `double` принимает один параметр с типом `Int` и именем `i`. 
Как можно видеть ниже, `double` имеет тип `Int => Int`, 
что означает, что он принимает один параметр `Int` и возвращает `Int`:

{% tabs fun-function-variables-7 %}
{% tab 'Scala 2 и 3' %}
```scala
scala> val double = (i: Int) => i * 2
val double: Int => Int = ...
```
{% endtab %}
{% endtabs %}


### Вызов функции

Функция `double` может быть вызвана так:

{% tabs fun-function-variables-8 %}
{% tab 'Scala 2 и 3' %}
```scala
val x = double(2)   // 4
```
{% endtab %}
{% endtabs %}

`double` также можно передать в вызов `map`:

{% tabs fun-function-variables-9 %}
{% tab 'Scala 2 и 3' %}
```scala
List(1, 2, 3).map(double)   // List(2, 4, 6)
```
{% endtab %}
{% endtabs %}

Кроме того, когда есть другие функции типа `Int => Int`:

{% tabs fun-function-variables-10 %}
{% tab 'Scala 2 и 3' %}
```scala
val triple = (i: Int) => i * 3
```
{% endtab %}
{% endtabs %}

можно сохранить их в `List` или `Map`:

{% tabs fun-function-variables-11 %}
{% tab 'Scala 2 и 3' %}
```scala
val functionList = List(double, triple)

val functionMap = Map(
  "2x" -> double,
  "3x" -> triple
)
```
{% endtab %}
{% endtabs %}

Если вы вставите эти выражения в REPL, то увидите, что они имеют следующие типы:

{% tabs fun-function-variables-12 %}
{% tab 'Scala 2 и 3' %}
````
// список, содержащий функции типа `Int => Int`
functionList: List[Int => Int]

// Map, ключи которой имеют тип `String`,
// а значения имеют тип `Int => Int`
functionMap: Map[String, Int => Int]
````
{% endtab %}
{% endtabs %}



## Ключевые моменты

Ключевыми моментами здесь являются:

- чтобы создать функциональную переменную, достаточно присвоить имя переменной функциональному литералу
- когда есть функция, с ней можно обращаться как с любой другой переменной, то есть как со `String` или `Int` переменной

А благодаря улучшенной функциональности [Eta Expansion][eta_expansion] в Scala 3 с _методами_ можно обращаться точно так же.

[eta_expansion]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
