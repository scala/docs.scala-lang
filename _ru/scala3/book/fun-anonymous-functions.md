---
layout: multipage-overview
title: Анонимные функции
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице показано, как использовать анонимные функции в Scala, включая примеры с функциями map и filter класса List.
language: ru
num: 28
previous-page: fun-intro
next-page: fun-function-variables
---

Анонимная функция, также известная как _лямбда_, представляет собой блок кода, 
который передается в качестве аргумента функции высшего порядка. 
Википедия определяет [анонимную функцию](https://en.wikipedia.org/wiki/Anonymous_function) 
как “определение функции, не привязанное к идентификатору”.

Например, возьмем коллекцию:

{% tabs fun-anonymous-1 %}
{% tab 'Scala 2 и 3' %}
```scala
val ints = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

Можно создать новый список, удвоив каждый элемент в целых числах, используя метод `map` класса `List` 
и свою пользовательскую анонимную функцию:

{% tabs fun-anonymous-2 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map(_ * 2)   // List(2, 4, 6)
```
{% endtab %}
{% endtabs %}

Как видно из комментария, `doubleInts` содержит список `List(2, 4, 6)`. 
В этом примере анонимной функцией является часть кода:

{% tabs fun-anonymous-3 %}
{% tab 'Scala 2 и 3' %}
```scala
_ * 2
```
{% endtab %}
{% endtabs %}

Это сокращенный способ сказать: “Умножить данный элемент на 2”.

## Более длинные формы

Когда вы освоитесь со Scala, то будете постоянно использовать эту форму для написания анонимных функций, 
использующих одну переменную в одном месте функции. 
Но при желании можете также написать их, используя более длинные формы, 
поэтому в дополнение к написанию этого кода:

{% tabs fun-anonymous-4 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

вы также можете написать его, используя такие формы:

{% tabs fun-anonymous-5 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map((i) => i * 2)
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

Все эти строки имеют одно и то же значение: удваивайте каждый элемент `ints`, чтобы создать новый список, `doubledInts` 
(синтаксис каждой формы объясняется ниже).

Если вы знакомы с Java, вам будет полезно узнать, что эти примеры `map` эквивалентны следующему Java коду:

{% tabs fun-anonymous-5-b %}
{% tab 'Java' %}
```java
List<Integer> ints = List.of(1, 2, 3);
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```
{% endtab %}
{% endtabs %}

## Сокращение анонимных функций

Если необходимо явно указать анонимную функцию, можно использовать следующую длинную форму:

{% tabs fun-anonymous-6 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

Анонимная функция в этом выражении такова:

{% tabs fun-anonymous-7 %}
{% tab 'Scala 2 и 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

Если незнаком данный синтаксис, то можно воспринимать символ `=>` как преобразователь, 
потому что выражение _преобразует_ список параметров в левой части символа (переменная `Int` с именем `i`) 
в новый результат, используя алгоритм справа от символа `=>` 
(в данном случае выражение, которое удваивает значение `Int`).


### Сокращение выражения

Эту длинную форму можно сократить, как будет показано в следующих шагах. 
Во-первых, вот снова самая длинная и явная форма:

{% tabs fun-anonymous-8 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

Поскольку компилятор Scala может сделать вывод из данных в `ints` о том, что `i` - это `Int`, 
`Int` объявление можно удалить:

{% tabs fun-anonymous-9 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map((i) => i * 2)
```
{% endtab %}
{% endtabs %}

Поскольку есть только один аргумент, круглые скобки вокруг параметра `i` не нужны:

{% tabs fun-anonymous-10 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

Поскольку Scala позволяет использовать символ `_` вместо имени переменной, 
когда параметр появляется в функции только один раз, код можно упростить еще больше:

{% tabs fun-anonymous-11 %}
{% tab 'Scala 2 и 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

### Ещё короче

В других примерах можно еще больше упростить анонимные функции. 
Например, начиная с самой явной формы, можно распечатать каждый элемент в `ints`, 
используя эту анонимную функцию с методом `foreach` класса `List`:

{% tabs fun-anonymous-12 %}
{% tab 'Scala 2 и 3' %}
```scala
ints.foreach((i: Int) => println(i))
```
{% endtab %}
{% endtabs %}

Как и раньше, объявление `Int` не требуется, а поскольку аргумент всего один, скобки вокруг `i` не нужны:

{% tabs fun-anonymous-13 %}
{% tab 'Scala 2 и 3' %}
```scala
ints.foreach(i => println(i))
```
{% endtab %}
{% endtabs %}

Поскольку `i` используется в теле функции только один раз, выражение можно еще больше упростить с помощью символа `_`:

{% tabs fun-anonymous-14 %}
{% tab 'Scala 2 и 3' %}
```scala
ints.foreach(println(_))
```
{% endtab %}
{% endtabs %}

Наконец, если анонимная функция состоит из одного вызова метода с одним аргументом, 
нет необходимости явно называть и указывать аргумент, 
можно написать только имя метода (здесь, `println`):

{% tabs fun-anonymous-15 %}
{% tab 'Scala 2 и 3' %}
```scala
ints.foreach(println)
```
{% endtab %}
{% endtabs %}
