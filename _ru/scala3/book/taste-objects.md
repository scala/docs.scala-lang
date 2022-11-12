---
layout: multipage-overview
title: Одноэлементные объекты
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: В этом разделе представлено введение в использование одноэлементных объектов в Scala 3.
language: ru
num: 12
previous-page: taste-functions
next-page: taste-collections
---


В Scala ключевое слово `object` создает объект Singleton (паттерн проектирования "Одиночка"). 
Другими словами, объект определяет класс, который имеет только один экземпляр.

Объекты имеют несколько применений:

- Они используются для создания коллекций служебных методов.
- _Сопутствующий объект_ — это объект с тем же именем, что и у класса, определенного в этом же файле. 
  В этой ситуации такой класс также называется _сопутствующим классом_.
- Они используются для реализации трейтов для создания _модулей_.


## “Полезные”  методы

Поскольку `object` является "одиночкой", к его методам можно обращаться так же, как к статичным методам в Java классе. 
Например, этот объект `StringUtils` содержит небольшой набор методов, связанных со строками:

{% tabs object_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=object_1 %}
```scala
object StringUtils {
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
}
```
{% endtab %}

{% tab 'Scala 3' for=object_1 %}
```scala
object StringUtils:
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
```
{% endtab %}
{% endtabs %}

Поскольку `StringUtils` - это "одиночка", его методы можно вызывать непосредственно для объекта:

{% tabs object_2 %}
{% tab 'Scala 2 and 3' for=object_2 %}
```scala
val x = StringUtils.isNullOrEmpty("")    // true
val x = StringUtils.isNullOrEmpty("a")   // false
```
{% endtab %}
{% endtabs %}

## Сопутствующие объекты

Сопутствующие класс или объект могут получить доступ к закрытым членам своего компаньона. 
Используйте сопутствующий объект для методов и значений, которые не относятся к экземплярам сопутствующего класса.

В этом примере показано, как метод `area` в сопутствующем классе 
может получить доступ к приватному методу `calculateArea` в своем сопутствующем объекте:

{% tabs object_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=object_3 %}
```scala
import scala.math._

class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double =
    Pi * pow(radius, 2.0)
}

val circle1 = new Circle(5.0)
circle1.area   // Double = 78.53981633974483
```
{% endtab %}

{% tab 'Scala 3' for=object_3 %}
```scala
import scala.math.*

class Circle(radius: Double):
  import Circle.*
  def area: Double = calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double =
    Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area   // Double = 78.53981633974483
```
{% endtab %}
{% endtabs %}

## Создание модулей из трейтов

Объекты также можно использовать для реализации трейтов для создания модулей. 
Эта техника берет две трейта и объединяет их для создания конкретного `object`-а:

{% tabs object_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=object_4 %}
```scala
trait AddService {
  def add(a: Int, b: Int) = a + b
}

trait MultiplyService {
  def multiply(a: Int, b: Int) = a * b
}

// реализация трейтов выше в качестве конкретного объекта
object MathService extends AddService with MultiplyService

// использование объекта
import MathService._
println(add(1,1))        // 2
println(multiply(2,2))   // 4
```
{% endtab %}

{% tab 'Scala 3' for=object_4 %}
```scala
trait AddService:
  def add(a: Int, b: Int) = a + b

trait MultiplyService:
  def multiply(a: Int, b: Int) = a * b

// реализация трейтов выше в качестве конкретного объекта
object MathService extends AddService, MultiplyService

// использование объекта
import MathService.*
println(add(1,1))        // 2
println(multiply(2,2))   // 4
```
{% endtab %}
{% endtabs %}
