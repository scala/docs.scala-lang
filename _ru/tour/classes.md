---
layout: tour
title: Классы

discourse: true

partof: scala-tour

num: 4
language: ru
next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures

---

Классы в Scala являются шаблонами для создания объектов. Они могут содержать методы, константы, переменные, типы, объекты, трейты и классы, которые в совокупности называются _членами_. Типы, объекты и трейты будут рассмотрены позже в ходе нашего обзора.

## Объявление класса
Минимальное объявление класса - это просто ключевое слово `class` и название. Имена классов должны быть написаны с заглавной буквы.
```tut
class User

val user1 = new User
```
Ключевое слово `new` используется для создания экземпляра класса. `User` имеет конструктор по умолчанию, который не принимает аргументов, так как конструктор не был определен. Однако обычно хочется чтоб был конструктор и тело класса. Пример объявления класса Point приведен ниже:

```tut
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // prints (2, 3)
```

В этом классе у `Point` есть четыре члена: переменные `x` и `y` и методы `move` и `toString`.
В отличие от многих других языков, основной конструктор находится в сигнатуре класса `(var x: Int, var y: Int)`. Метод `move` принимает два целочисленных аргумента и возвращает значение Unit `()`, которое не содержит никакой информации. Это примерно соответствует `void` в Java-подобных языках. С другой стороны, `toString` не принимает никаких аргументов, а возвращает значение `String`. Поскольку `toString` переопределяет `toString` из [`AnyRef`](unified-types.html), он помечается ключевым словом `override`.

## Конструкторы

Конструкторы могут иметь необязательные параметры, указывая их значения по умолчанию как в примере:

```tut
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x и y оба равны 0
val point1 = new Point(1)
println(point1.x)  // выводит 1

```

В этой версии класса `Point`, `x` и `y` имеют значение по умолчанию `0`, поэтому аргументов не требуется. Однако, поскольку конструктор считывает аргументы слева направо, если вы просто хотите передать значение `y`, вам нужно будет назвать завадаемый параметр.
```
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // выводит 2
```

Что также является хорошей практикой для повышения ясности кода.

## Закрытые члены и синтаксис Геттер/Сеттер (получатель/установщик значений)
По умолчанию члены класса являются публичными. Используйте модификатор `private`, чтобы закрыть к ним внешний доступ.
```tut
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // выводит предупреждение (printWarning)
```
В данной версии класса `Point` данные хранятся в приватных переменных `_x` и `_y`. Существуют методы `def x` и `def y` для доступа к приватным данным. Методы `def x_=` и `def y_=` (сеттеры) предназначены для проверки и установки значения `_x` и `_y`. Обратите внимание на специальный синтаксис для сеттеров: метод  `_=` применяется к имени геттера.

Первичные параметры конструктора с параметрами `val` и `var` являются общедоступными. Однако, поскольку `val` - это константа, то нельзя писать следующее.
```
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- не компилируется
```

Параметры без `val` или `var` являются приватными значениями, видимыми только внутри класса.
```
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- не компилируется
```
