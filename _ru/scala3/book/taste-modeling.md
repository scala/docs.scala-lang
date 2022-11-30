---
layout: multipage-overview
title: Моделирование данных
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлено введение в моделирование данных в Scala 3.
language: ru
num: 9
previous-page: taste-control-structures
next-page: taste-methods
---


Scala поддерживает как функциональное программирование (ФП), так и объектно-ориентированное программирование (ООП), 
а также слияние этих двух парадигм. В этом разделе представлен краткий обзор моделирования данных в ООП и ФП.

## Моделирование данных в ООП

При написании кода в стиле ООП двумя вашими основными инструментами для инкапсуляции данных будут _трейты_ и _классы_.

### Трейты

Трейты Scala можно использовать как простые интерфейсы, 
но они также могут содержать абстрактные и конкретные методы и поля, а также параметры, как и классы. 
Они предоставляют вам отличный способ организовать поведение в небольшие модульные блоки. 
Позже, когда вы захотите создать конкретные реализации атрибутов и поведения, 
классы и объекты могут расширять трейты, смешивая столько трейтов, 
сколько необходимо для достижения желаемого поведения.

В качестве примера того, как использовать трейты в качестве интерфейсов, 
вот три трейта, которые определяют хорошо организованное и модульное поведение для животных, таких как собаки и кошки:

{% tabs traits class=tabs-scala-version %}
{% tab 'Scala 2' for=traits %}

```scala
trait Speaker {
  def speak(): String  // тело метода отсутствует, поэтому метод абстрактный
}

trait TailWagger {
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running")
}
```

{% endtab %}

{% tab 'Scala 3' for=traits %}

```scala
trait Speaker:
  def speak(): String  // тело метода отсутствует, поэтому метод абстрактный

trait TailWagger:
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")

trait Runner:
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running")
```

{% endtab %}
{% endtabs %}

Учитывая эти трейты, вот класс `Dog`, который их все расширяет, 
обеспечивая при этом поведение для абстрактного метода `speak`:

{% tabs traits-class class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-class %}

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner {
  def speak(): String = "Woof!"
}
```

{% endtab %}

{% tab 'Scala 3' for=traits-class %}

```scala
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
```

{% endtab %}
{% endtabs %}

Обратите внимание, как класс расширяет трейты с помощью ключевого слова `extends`.

Точно так же вот класс `Cat`, реализующий те же трейты, 
а также переопределяющий два конкретных метода, которые он наследует:

{% tabs traits-override class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-override %}

```scala
class Cat(name: String) extends Speaker with TailWagger with Runner {
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
}
```

{% endtab %}

{% tab 'Scala 3' for=traits-override %}

```scala
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
```

{% endtab %}
{% endtabs %}

Примеры ниже показывают, как используются эти классы:

{% tabs traits-use class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-use %}

```scala
val d = new Dog("Rover")
println(d.speak())      // печатает "Woof!"

val c = new Cat("Morris")
println(c.speak())      // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

{% endtab %}

{% tab 'Scala 3' for=traits-use %}

```scala
val d = Dog("Rover")
println(d.speak())      // печатает "Woof!"

val c = Cat("Morris")
println(c.speak())      // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

{% endtab %}
{% endtabs %}

Если этот код имеет смысл — отлично, вам удобно использовать трейты в качестве интерфейсов. 
Если нет, не волнуйтесь, они более подробно описаны в главе ["Моделирование предметной области"][data-1].


### Классы

Классы Scala используются в программировании в стиле ООП. 
Вот пример класса, который моделирует "человека". 
В ООП поля обычно изменяемы, поэтому оба, `firstName` и `lastName` объявлены как `var` параметры:

{% tabs class_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=class_1 %}

```scala
class Person(var firstName: String, var lastName: String) {
  def printFullName() = println(s"$firstName $lastName")
}

val p = new Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

{% endtab %}

{% tab 'Scala 3' for=class_1 %}

```scala
class Person(var firstName: String, var lastName: String):
  def printFullName() = println(s"$firstName $lastName")

val p = Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

{% endtab %}
{% endtabs %}

Обратите внимание, что объявление класса создает конструктор:

{% tabs class_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=class_2 %}

```scala
// код использует конструктор из объявления класса
val p = new Person("John", "Stephens")
```

{% endtab %}

{% tab 'Scala 3' for=class_2 %}

```scala
// код использует конструктор из объявления класса
val p = Person("John", "Stephens")
```

{% endtab %}
{% endtabs %}

Конструкторы и другие темы, связанные с классами, рассматриваются в главе ["Моделирование предметной области"][data-1].

## Моделирование данных в ФП

При написании кода в стиле ФП вы будете использовать следующие понятия:

- Алгебраические типы данных для определения данных.
- Трейты для функциональности данных.

### Перечисления и суммированные типы

Суммированные типы (_sum types_) — это один из способов моделирования алгебраических типов данных (ADT) в Scala.

Они используются, когда данные могут быть представлены с различными вариантами.

Например, у пиццы есть три основных атрибута:

- Размер корки
- Тип корки
- Начинки
- 
Они кратко смоделированы с помощью перечислений, 
которые представляют собой суммированные типы, содержащие только одноэлементные значения:

{% tabs enum_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_1 %}

В Scala 2 `sealed` классы и `case object` объединяются для определения перечисления:

```scala
sealed abstract class CrustSize
object CrustSize {
  case object Small extends CrustSize
  case object Medium extends CrustSize
  case object Large extends CrustSize
}

sealed abstract class CrustType
object CrustType {
  case object Thin extends CrustType
  case object Thick extends CrustType
  case object Regular extends CrustType
}

sealed abstract class Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping
}
```

{% endtab %}
{% tab 'Scala 3' for=enum_1 %}

Scala 3 предлагает конструкцию `enum` для определения перечислений:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

{% endtab %}
{% endtabs %}

Когда у вас есть перечисление, вы можете импортировать его элементы как обычные значения:

{% tabs enum_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_2 %}

```scala
import CrustSize._
val currentCrustSize = Small

// перечисления в сопоставлении с шаблоном
currentCrustSize match {
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")
}

// перечисления в операторе `if`
if (currentCrustSize == Small) println("Small crust size")
```

{% endtab %}
{% tab 'Scala 3' for=enum_2 %}

```scala
import CrustSize.*
val currentCrustSize = Small

// перечисления в сопоставлении с шаблоном
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")

// перечисления в операторе `if`
if currentCrustSize == Small then println("Small crust size")
```

{% endtab %}
{% endtabs %}

Вот еще один пример того, как создать суммированные типы с помощью Scala, 
это не будет называться перечислением, потому что у случая `Succ` есть параметры:

{% tabs enum_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_3 %}

```scala
sealed abstract class Nat
object Nat {
  case object Zero extends Nat
  case class Succ(pred: Nat) extends Nat
}
```

Суммированные типы подробно рассматриваются в разделе ["Моделирование предметной области"]({% link _overviews/scala3-book/domain-modeling-tools.md %}) этой книги.

{% endtab %}
{% tab 'Scala 3' for=enum_3 %}

```scala
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

Перечисления подробно рассматриваются в разделе ["Моделирование предметной области"]({% link _overviews/scala3-book/domain-modeling-tools.md %}) этой книги 
и в [справочной документации]({{ site.scala3ref }}/enums/enums.html).

{% endtab %}
{% endtabs %}

### Продуктовые типы

Тип продукта — это алгебраический тип данных (ADT), который имеет только одну форму, 
например, одноэлементный объект, представленный в Scala `case object`; 
или неизменяемая структура с доступными полями, представленная `case class`.

`case class` обладает всеми функциями класса, а также содержит встроенные дополнительные функции, 
которые делают его полезным для функционального программирования. 
Когда компилятор видит ключевое слово `case` перед `class`, то применяет следующие эффекты и преимущества:

- Параметры конструктора `case class` по умолчанию являются общедоступными полями `val`, поэтому поля неизменяемы, 
  а методы доступа генерируются для каждого параметра.
- Генерируется метод `unapply`, который позволяет использовать `case class` в выражениях match различными способами.
- В классе создается метод `copy`. Он позволяет создавать копии объекта без изменения исходного.
- Создаются методы `equals` и `hashCode` для реализации структурного равенства.
- Генерируется метод по умолчанию `toString`, полезный для отладки.

Вы _можете_ вручную добавить все эти методы в класс самостоятельно, 
но, поскольку эти функции так часто используются в функциональном программировании, 
использование case класса гораздо удобнее.

Этот код демонстрирует несколько функций `case class`:

{% tabs case-class %}
{% tab 'Scala 2 и 3' for=case-class %}

```scala
// определение case class
case class Person(
  name: String,
  vocation: String
)

// создание экземпляра case class
val p = Person("Reginald Kenneth Dwight", "Singer")

// полезный метод toString
p                // : Person = Person(Reginald Kenneth Dwight,Singer)

// можно получить доступ к неизменяемым полям
p.name           // "Reginald Kenneth Dwight"
p.name = "Joe"   // error: can’t reassign a val field

// при необходимости внести изменения используйте метод `copy`
// для “update as you copy”
val p2 = p.copy(name = "Elton John")
p2               // : Person = Person(Elton John,Singer)
```

{% endtab %}
{% endtabs %}

Дополнительные сведения о `case` классах см. в разделах ["Моделирование предметной области"][data-1].

[data-1]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
