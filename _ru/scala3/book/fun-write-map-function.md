---
layout: multipage-overview
title: Собственный map
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице описано, как создать свой собственный метод map
language: ru
num: 33
previous-page: fun-hofs
next-page: fun-write-method-returns-function
---


Теперь, когда известно, как писать собственные функции высшего порядка, рассмотрим более реальный пример.

Представим, что у класса `List` нет метода `map`, и есть необходимость его написать. 
Первым шагом при создании функций является точное определение проблемы. 
Сосредоточившись только на `List[Int]`, получаем:

> Необходимо написать метод `map`, который можно использовать для применения функции к каждому элементу в `List[Int]`, 
> возвращая преобразованные элементы в виде нового списка.

Учитывая это утверждение, начнем писать сигнатуру метода. 
Во-первых, известно, что функция должна приниматься в качестве параметра, 
и эта функция должна преобразовать `Int` в какой-то общий тип `A`, поэтому получаем:

{% tabs map-accept-func-definition %}
{% tab 'Scala 2 и 3' %}
```scala
def map(f: (Int) => A)
```
{% endtab %}
{% endtabs %}

Синтаксис использования универсального типа требует объявления этого символа типа перед списком параметров, 
поэтому добавляем объявление типа:

{% tabs map-type-symbol-definition %}
{% tab 'Scala 2 и 3' %}
```scala
def map[A](f: (Int) => A)
```
{% endtab %}
{% endtabs %}

Далее известно, что `map` также должен принимать `List[Int]`:

{% tabs map-list-int-param-definition %}
{% tab 'Scala 2 и 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int])
```
{% endtab %}
{% endtabs %}

Наконец, также известно, что `map` возвращает преобразованный список, содержащий элементы универсального типа `A`:

{% tabs map-with-return-type-definition %}
{% tab 'Scala 2 и 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] = ???
```
{% endtab %}
{% endtabs %}

Теперь все, что нужно сделать, это написать тело метода. 
Метод `map` применяет заданную им функцию к каждому элементу в заданном списке для создания нового преобразованного списка. 
Один из способов сделать это - использовать выражение `for`:

{% tabs for-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}

`for` выражения зачастую делают код удивительно простым, и в данном случае - это все тело метода.

Объединив `for` с сигнатурой метода, получим автономный метод `map`, который работает с `List[Int]`:

{% tabs map-function class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}


### Обобщим метод map

Обратим внимание, что выражение `for` не делает ничего, что зависит от типа `Int` внутри списка. 
Следовательно, можно заменить `Int` в сигнатуре типа параметром универсального типа `B`:

{% tabs map-function-full-generic class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def map[A, B](f: (B) => A, xs: List[B]): List[A] =
  for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def map[A, B](f: (B) => A, xs: List[B]): List[A] =
  for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}

Получился метод `map`, который работает с любым списком.

Демонстрация работы получившегося `map`:

{% tabs map-use-example %}
{% tab 'Scala 2 и 3' %}
```scala
def double(i : Int): Int = i * 2
map(double, List(1, 2, 3))            // List(2, 4, 6)

def strlen(s: String): Int = s.length
map(strlen, List("a", "bb", "ccc"))   // List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

Теперь, когда рассмотрены методы, принимающие функции в качестве входных параметров, перейдем к методам, возвращающим функции.
