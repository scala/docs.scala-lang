---
layout: tour
title: Операторы
partof: scala-tour
num: 30
language: ru
next-page: by-name-parameters
previous-page: type-inference
prerequisite-knowledge: case-classes
---

В Скале операторы - это обычные методы. В качестве _инфиксного оператора_ может быть использован любой метод с одним параметром. Например, `+` может вызываться с использованием точки:

{% tabs operators_1 %}
{% tab 'Scala 2 и 3' for=operators_1 %}

```
10.+(1)
```

{% endtab %}
{% endtabs %}

Однако легче воспринимать код, когда такие методы записаны как инфиксный оператор:

{% tabs operators_2 %}
{% tab 'Scala 2 и 3' for=operators_2 %}

```
10 + 1
```

{% endtab %}
{% endtabs %}

## Создание и использование операторов

В качестве оператора можно использовать любой допустимый символ. Включая имена на подобии `add` или символ (символы) типа `+`.

{% tabs operators_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=operators_3 %}

```scala mdoc
case class Vec(x: Double, y: Double) {
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)
}

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```

{% endtab %}
{% tab 'Scala 3' for=operators_3 %}

```scala
case class Vec(x: Double, y: Double):
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```

{% endtab %}
{% endtabs %}

У класса Vec есть метод `+`, который мы использовали для добавления `vector1` и `vector2`. Используя круглые скобки, можно строить сложные выражения с читаемым синтаксисом. Пример создания класса `MyBool`, которое включает в себя методы `and` и `or`

{% tabs operators_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=operators_4 %}

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

{% endtab %}
{% tab 'Scala 3' for=operators_4 %}

```scala
case class MyBool(x: Boolean):
  def and(that: MyBool): MyBool = if x then that else this
  def or(that: MyBool): MyBool = if x then this else that
  def negate: MyBool = MyBool(!x)
```

{% endtab %}
{% endtabs %}

Теперь можно использовать операторы `and` и `or` в качестве инфиксных операторов:

{% tabs operators_5 %}
{% tab 'Scala 2 и 3' for=operators_5 %}

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

{% endtab %}
{% endtabs %}

Это помогает сделать объявление `xor` более читабельным.

## Порядок очередности

Когда выражение использует несколько операторов, операторы оцениваются на основе приоритета первого символа. Таблица приоритетов символов:

```
(символы которых нет снизу)
* / %
+ -
:
= !
< >
&
^
|
(буквы, $, _)
```

Такой приоритет распространяется на любые функции, которые вы задаете. Например, следующее выражение:

{% tabs operators_7 %}
{% tab 'Scala 2 и 3' for=operators_7 %}

```
a + b ^? c ?^ d less a ==> b | c
```

{% endtab %}
{% endtabs %}

эквивалентно

{% tabs operators_8 %}
{% tab 'Scala 2 и 3' for=operators_8 %}

```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```

{% endtab %}
{% endtabs %}

`?^` имеет высший приоритет, потому что начинается с символа `?`. Второй по старшинству приоритет имеет `+`, за которым следуют `==>`, `^?`, `|`, и `less`.
