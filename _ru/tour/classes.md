---
layout: tour
title: Классы
partof: scala-tour
num: 4
language: ru
next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures
---

Классы в Scala являются основами для создания объектов. Они могут содержать методы, константы, переменные, типы, объекты, трейты и классы, которые в совокупности называются _членами_. Типы, объекты и трейты будут рассмотрены позже в ходе нашего обзора.

## Объявление класса
Минимальное объявление класса - это просто ключевое слово `class` и его имя. Имена классов должны быть написаны с заглавной буквы.


{% tabs class-minimal-user class=tabs-scala-version %}

{% tab 'Scala 2' for=class-minimal-user %}
```scala mdoc
class User

val user1 = new User
```

Ключевое слово `new` используется для создания экземпляра класса.
{% endtab %}

{% tab 'Scala 3' for=class-minimal-user %}
```scala
class User

val user1 = User()
```

Чтобы создать экземпляр класса, мы вызываем его как функцию: `User()`.
Также можно явно использовать ключевое слово `new`: `new User()` - хотя обычно это опускается.
{% endtab %}

{% endtabs %}


`User` имеет конструктор по умолчанию, который не принимает аргументов, так как конструктор не был определен. Однако обычно используется и конструктор, и тело класса. Пример объявления класса Point приведен ниже:


{% tabs class-point-example class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-example %}
```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
println(point1.x)  // выводит 2
println(point1)    // выводит (2, 3)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-example %}
```scala
class Point(var x: Int, var y: Int):

  def move(dx: Int, dy: Int): Unit =
    x = x + dx
    y = y + dy

  override def toString: String =
    s"($x, $y)"
end Point

val point1 = Point(2, 3)
println(point1.x)  // выводит 2
println(point1)    // выводит (2, 3)
```
{% endtab %}

{% endtabs %}

В этом классе у `Point` есть четыре члена: переменные `x` и `y` и методы `move` и `toString`.
В отличие от многих других языков, основной конструктор находится в сигнатуре класса `(var x: Int, var y: Int)`. Метод `move` принимает два целочисленных аргумента и возвращает значение Unit `()` - это пустое множество, которое не содержит никакой информации. Примерно соответствует `void` в Java-подобных языках. С другой стороны, `toString` не принимает никаких аргументов, а возвращает значение `String`. Поскольку `toString` переопределяет `toString` из [`AnyRef`](unified-types.html), он помечается ключевым словом `override`.

## Конструкторы

Конструкторы могут иметь необязательные параметры, если указать их значения по умолчанию как в примере:


{% tabs class-point-with-default-values class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-with-default-values %}
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point    // x и y оба равны 0
val point1 = new Point(1) // x равен 1, а y равен 0
println(point1)           // выводит (1, 0)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-with-default-values %}
```scala
class Point(var x: Int = 0, var y: Int = 0)

val origin = Point()  // x и y оба равны 0
val point1 = Point(1) // x равен 1, а y равен 0
println(point1)       // выводит (1, 0)
```
{% endtab %}

{% endtabs %}


В этой версии класса `Point`, `x` и `y` имеют значение по умолчанию `0`, поэтому аргументов не требуется. Однако, поскольку конструктор считывает аргументы слева направо, если вы просто хотите передать значение `y`, то вам нужно будет указать задаваемый параметр.

{% tabs class-point-named-argument class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-named-argument %}
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y = 2)
println(point2)               // выводит (0, 2)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-named-argument %}
```scala
class Point(var x: Int = 0, var y: Int = 0)
val point2 = Point(y = 2)
println(point2)           // выводит (0, 2)
```
{% endtab %}

{% endtabs %}

Что также является хорошей практикой для повышения ясности кода.

## Скрытые члены и синтаксис Геттер/Сеттер (получатель/установщик значений)
По умолчанию члены класса являются открытыми для внешнего доступа (публичными). Используйте модификатор `private`, чтобы скрыть их от внешнего доступа.


{% tabs class-point-private-getter-setter class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-private-getter-setter %}
```scala mdoc:reset
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x: Int = _x
  def x_=(newValue: Int): Unit = {
    if (newValue < bound)
      _x = newValue
    else
      printWarning()
  }

  def y: Int = _y
  def y_=(newValue: Int): Unit = {
    if (newValue < bound)
      _y = newValue
    else
      printWarning()
  }

  private def printWarning(): Unit =
    println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // выводит предупреждение (printWarning)
```
{% endtab %}

{% tab 'Scala 3' for=class-point-private-getter-setter %}
```scala
class Point:
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x: Int = _x
  def x_=(newValue: Int): Unit =
    if newValue < bound then
      _x = newValue
    else
      printWarning()

  def y: Int = _y
  def y_=(newValue: Int): Unit =
    if newValue < bound then
      _y = newValue
    else
      printWarning()

  private def printWarning(): Unit =
    println("WARNING: Out of bounds")
end Point

val point1 = Point()
point1.x = 99
point1.y = 101 // выводит предупреждение (printWarning)
```
{% endtab %}

{% endtabs %}

В данной версии класса `Point` данные хранятся в скрытых переменных `_x` и `_y`. Существуют методы `def x` и `def y` для доступа к скрытым данным. Методы `def x_=` и `def y_=` (сеттеры) предназначены для проверки и установки значения `_x` и `_y`. Обратите внимание на специальный синтаксис для сеттеров: метод  `_=` применяется к имени геттера.

Первичные параметры конструктора с параметрами `val` и `var` являются общедоступными. Однако, поскольку `val` - это константа, то нельзя писать следующее.


{% tabs class-point-cannot-set-val class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-cannot-set-val %}
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- не компилируется
```
{% endtab %}

{% tab 'Scala 3' for=class-point-cannot-set-val %}
```scala
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
point.x = 3  // <-- не компилируется
```
{% endtab %}

{% endtabs %}

Параметры без `val` или `var` являются скрытыми от внешнего доступа и видимы только внутри класса.


{% tabs class-point-non-val-ctor-param class=tabs-scala-version %}

{% tab 'Scala 2' for=class-point-non-val-ctor-param %}
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- не компилируется
```
{% endtab %}

{% tab 'Scala 3' for=class-point-non-val-ctor-param %}
```scala
class Point(x: Int, y: Int)
val point = Point(1, 2)
point.x  // <-- не компилируется
```
{% endtab %}

{% endtabs %}