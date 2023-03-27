---
layout: multipage-overview
title: Инструменты
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе представлено введение в доступные инструменты моделирования предметной области в Scala 3, включая классы, трейты, перечисления и многое другое.
language: ru
num: 20
previous-page: domain-modeling-intro
next-page: domain-modeling-oop
---


Scala предоставляет множество различных конструкций для моделирования предметной области:

- Классы
- Объекты
- Сопутствующие объекты
- Трейты
- Абстрактные классы
- Перечисления <span class="tag tag-inline">только в Scala 3</span>
- Case классы
- Case объекты

В этом разделе кратко представлена каждая из этих языковых конструкций.


## Классы

Как и в других языках, _класс_ в Scala — это шаблон для создания экземпляров объекта. 
Вот несколько примеров классов:

{% tabs class_1 %}
{% tab 'Scala 2 и 3' %}

```scala
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

{% endtab %}
{% endtabs %}

Эти примеры показывают, что в Scala есть очень легкий способ объявления классов.

Все параметры в примерах наших классов определены как `var` поля, а значит, они изменяемы: их можно читать, а также изменять. 
Если вы хотите, чтобы они были неизменяемыми — только для чтения — создайте их как `val` поля или используйте case класс.

До Scala 3 для создания нового экземпляра класса использовалось ключевое слово `new`:

{% tabs class_2 %}
{% tab 'Scala 2 и 3' %}

```scala
val p = new Person("Robert Allen Zimmerman", "Harmonica Player")
//      ---
```

{% endtab %}
{% endtabs %}

Однако с [универсальными apply методами][creator] в Scala 3 этого больше не требуется: <span class="tag tag-inline">только в Scala 3</span>.

{% tabs class_3 %}
{% tab 'Только в Scala 3' %}

```scala
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

{% endtab %}
{% endtabs %}

Если у вас есть экземпляр класса, такой как `p`, то вы можете получить доступ к полям экземпляра, 
которые в этом примере являются параметрами конструктора:

{% tabs class_4 %}
{% tab 'Scala 2 и 3' %}

```scala
p.name       // "Robert Allen Zimmerman"
p.vocation   // "Harmonica Player"
```

{% endtab %}
{% endtabs %}

Как уже упоминалось, все эти параметры были созданы как `var` поля, поэтому они изменяемые:

{% tabs class_5 %}
{% tab 'Scala 2 и 3' %}

```scala
p.name = "Bob Dylan"
p.vocation = "Musician"
```

{% endtab %}
{% endtabs %}

### Поля и методы

Классы также могут содержать методы и дополнительные поля, не являющиеся частью конструкторов. 
Они определены в теле класса. 
Тело инициализируется как часть конструктора по умолчанию:

{% tabs method class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Person(var firstName: String, var lastName: String) {

  println("initialization begins")
  val fullName = firstName + " " + lastName

  // метод класса
  def printFullName: Unit =
    // обращение к полю `fullName`, определенному выше
    println(fullName)

  printFullName
  println("initialization ends")
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Person(var firstName: String, var lastName: String):

  println("initialization begins")
  val fullName = firstName + " " + lastName

  // метод класса
  def printFullName: Unit =
    // обращение к полю `fullName`, определенному выше
    println(fullName)

  printFullName
  println("initialization ends")
```

{% endtab %}
{% endtabs %}

Следующая сессия REPL показывает, как создать новый экземпляр `Person` с этим классом:

{% tabs demo-person class=tabs-scala-version %}
{% tab 'Scala 2' %}
````scala
scala> val john = new Person("John", "Doe")
initialization begins
John Doe
initialization ends
val john: Person = Person@55d8f6bb

scala> john.printFullName
John Doe
````
{% endtab %}
{% tab 'Scala 3' %}
````scala
scala> val john = Person("John", "Doe")
initialization begins
John Doe
initialization ends
val john: Person = Person@55d8f6bb

scala> john.printFullName
John Doe
````
{% endtab %}
{% endtabs %}

Классы также могут расширять трейты и абстрактные классы, которые мы рассмотрим в специальных разделах ниже.

### Значения параметров по умолчанию

В качестве беглого взгляда на некоторые другие функции, 
параметры конструктора класса также могут иметь значения по умолчанию:

{% tabs default-values_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Socket(val timeout: Int = 5_000, val linger: Int = 5_000) {
  override def toString = s"timeout: $timeout, linger: $linger"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Socket(val timeout: Int = 5_000, val linger: Int = 5_000):
  override def toString = s"timeout: $timeout, linger: $linger"
```

{% endtab %}
{% endtabs %}

Отличительной особенностью этой функции является то, что она позволяет потребителям вашего кода 
создавать классы различными способами, как если бы у класса были альтернативные конструкторы:

{% tabs default-values_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val s = new Socket()                  // timeout: 5000, linger: 5000
val s = new Socket(2_500)             // timeout: 2500, linger: 5000
val s = new Socket(10_000, 10_000)    // timeout: 10000, linger: 10000
val s = new Socket(timeout = 10_000)  // timeout: 10000, linger: 5000
val s = new Socket(linger = 10_000)   // timeout: 5000, linger: 10000
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val s = Socket()                  // timeout: 5000, linger: 5000
val s = Socket(2_500)             // timeout: 2500, linger: 5000
val s = Socket(10_000, 10_000)    // timeout: 10000, linger: 10000
val s = Socket(timeout = 10_000)  // timeout: 10000, linger: 5000
val s = Socket(linger = 10_000)   // timeout: 5000, linger: 10000
```

{% endtab %}
{% endtabs %}

При создании нового экземпляра класса вы также можете использовать именованные параметры. 
Это особенно полезно, когда несколько параметров имеют одинаковый тип, как показано в этом сравнении:

{% tabs default-values_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
// пример 1
val s = new Socket(10_000, 10_000)

// пример 2
val s = new Socket(
  timeout = 10_000,
  linger = 10_000
)
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
// пример 1
val s = Socket(10_000, 10_000)

// пример 2
val s = Socket(
  timeout = 10_000,
  linger = 10_000
)
```

{% endtab %}
{% endtabs %}

### Вспомогательные конструкторы

Вы можете определить класс с несколькими конструкторами, 
чтобы клиенты вашего класса могли создавать его различными способами. 
Например, предположим, что вам нужно написать код для моделирования студентов в системе приема в колледж. 
При анализе требований вы увидели, что необходимо создавать экземпляр `Student` тремя способами:

- С именем и государственным удостоверением личности, когда они впервые начинают процесс приема
- С именем, государственным удостоверением личности и дополнительной датой подачи заявки, когда они подают заявку
- С именем, государственным удостоверением личности и студенческим билетом после того, как они будут приняты

Один из способов справиться с этой ситуацией в стиле ООП - с помощью нижеследующего кода:

{% tabs structor_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import java.time._

// [1] основной конструктор
class Student(
  var name: String,
  var govtId: String
) {
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  // [2] конструктор для студента, подавшего заявку
  def this(
    name: String,
    govtId: String,
    applicationDate: LocalDate
  ) = {
    this(name, govtId)
    _applicationDate = Some(applicationDate)
  }

  // [3] конструктор, когда учащийся принят и теперь имеет студенческий билет
  def this(
    name: String,
    govtId: String,
    studentId: Int
  ) = {
    this(name, govtId)
    _studentId = studentId
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
import java.time.*

// [1] основной конструктор
class Student(
  var name: String,
  var govtId: String
):
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  // [2] конструктор для студента, подавшего заявку
  def this(
    name: String,
    govtId: String,
    applicationDate: LocalDate
  ) =
    this(name, govtId)
    _applicationDate = Some(applicationDate)

  // [3] конструктор, когда учащийся принят и теперь имеет студенческий билет
  def this(
    name: String,
    govtId: String,
    studentId: Int
  ) =
    this(name, govtId)
    _studentId = studentId
```

{% endtab %}
{% endtabs %}

Класс содержит три конструктора, обозначенных комментариями в коде:

1. Первичный конструктор, заданный `name` и `govtId` в определении класса
2. Вспомогательный конструктор с параметрами `name`, `govtId` и `applicationDate`
3. Другой вспомогательный конструктор с параметрами `name`, `govtId` и `studentId`

Эти конструкторы можно вызывать следующим образом:

{% tabs structor_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val s1 = new Student("Mary", "123")
val s2 = new Student("Mary", "123", LocalDate.now)
val s3 = new Student("Mary", "123", 456)
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
val s1 = Student("Mary", "123")
val s2 = Student("Mary", "123", LocalDate.now)
val s3 = Student("Mary", "123", 456)
```

{% endtab %}
{% endtabs %}

Хотя этот метод можно использовать, имейте в виду, что параметры конструктора также могут иметь значения по умолчанию, 
из-за чего создается впечатление, что класс содержит несколько конструкторов. 
Это показано в предыдущем примере `Socket`.

## Объекты

Объект — это класс, который имеет ровно один экземпляр. 
Инициализируется он лениво, тогда, когда на его элементы ссылаются, подобно `lazy val`. 
Объекты в Scala позволяют группировать методы и поля в одном пространстве имен, аналогично тому, 
как вы используете `static` члены в классе в Java, Javascript (ES6) или `@staticmethod` в Python.

Объявление `object` аналогично объявлению `class`. 
Вот пример объекта “строковые утилиты”, который содержит набор методов для работы со строками:

{% tabs object_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object StringUtils {
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
object StringUtils:
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
```

{% endtab %}
{% endtabs %}

Мы можем использовать объект следующим образом:

{% tabs object_2 %}
{% tab 'Scala 2 и 3' %}

```scala
StringUtils.truncate("Chuck Bartowski", 5)  // "Chuck"
```

{% endtab %}
{% endtabs %}

Импорт в Scala очень гибкий и позволяет импортировать _все_ члены объекта:

{% tabs object_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import StringUtils._
truncate("Chuck Bartowski", 5)       // "Chuck"
containsWhitespace("Sarah Walker")   // true
isNullOrEmpty("John Casey")          // false
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
import StringUtils.*
truncate("Chuck Bartowski", 5)       // "Chuck"
containsWhitespace("Sarah Walker")   // true
isNullOrEmpty("John Casey")          // false
```

{% endtab %}
{% endtabs %}

или только _некоторые_:

{% tabs object_4 %}
{% tab 'Scala 2 и 3' %}

```scala
import StringUtils.{truncate, containsWhitespace}
truncate("Charles Carmichael", 7)       // "Charles"
containsWhitespace("Captain Awesome")   // true
isNullOrEmpty("Morgan Grimes")          // Not found: isNullOrEmpty (error)
```

{% endtab %}
{% endtabs %}

Объекты также могут содержать поля, доступ к которым также осуществляется как к статическим элементам:

{% tabs object_5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object MathConstants {
  val PI = 3.14159
  val E = 2.71828
}

println(MathConstants.PI)   // 3.14159
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
object MathConstants:
  val PI = 3.14159
  val E = 2.71828

println(MathConstants.PI)   // 3.14159
```

{% endtab %}
{% endtabs %}

## Сопутствующие объекты

Объект `object`, имеющий то же имя, что и класс, и объявленный в том же файле, что и класс, 
называется _"сопутствующим объектом"_. Точно так же соответствующий класс называется сопутствующим классом объекта. 
Сопутствующие класс или объект могут получить доступ к закрытым членам своего “соседа”.

Сопутствующие объекты используются для методов и значений, не относящихся к экземплярам сопутствующего класса. 
Например, в следующем примере у класса `Circle` есть элемент с именем `area`, специфичный для каждого экземпляра, 
а у его сопутствующего объекта есть метод с именем `calculateArea`, 
который (а) не специфичен для экземпляра и (б) доступен для каждого экземпляра:

{% tabs companion class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import scala.math._

class Circle(val radius: Double) {
  def area: Double = Circle.calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = new Circle(5.0)
circle1.area
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
import scala.math.*

class Circle(val radius: Double):
  def area: Double = Circle.calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area
```

{% endtab %}
{% endtabs %}

В этом примере метод `area`, доступный для каждого экземпляра `Circle`, 
использует метод `calculateArea`, определенный в сопутствующем объекте. 
Кроме того, поскольку `calculateArea` является приватным, к нему нельзя получить доступ с помощью другого кода, 
но, как показано, его могут видеть экземпляры класса `Circle`.

### Другие виды использования сопутствующих объектов

Сопутствующие объекты могут использоваться для нескольких целей:

- их можно использовать для группировки “статических” методов в пространстве имен, как в примере выше
  - эти методы могут быть `public` или `private`
  - если бы `calculateArea` был `public`, к нему можно было бы получить доступ из любого места как `Circle.calculateArea`
- они могут содержать методы `apply`, которые — благодаря некоторому синтаксическому сахару — 
  работают как фабричные методы для создания новых экземпляров
- они могут содержать методы `unapply`, которые используются для деконструкции объектов, например, с помощью сопоставления с шаблоном

Вот краткий обзор того, как методы `apply` можно использовать в качестве фабричных методов для создания новых объектов:

{% tabs companion-use class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Person {
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"
}

object Person {
  // фабричный метод с одним аргументом
  def apply(name: String): Person = {
    var p = new Person
    p.name = name
    p
  }

  // фабричный метод с двумя аргументами
  def apply(name: String, age: Int): Person = {
    var p = new Person
    p.name = name
    p.age = age
    p
  }
}

val joe = Person("Joe")
val fred = Person("Fred", 29)

//val joe: Person = Joe is 0 years old
//val fred: Person = Fred is 29 years old
```

Метод `unapply` здесь не рассматривается, но описан в [Спецификации языка](https://scala-lang.org/files/archive/spec/2.13/08-pattern-matching.html#extractor-patterns).

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Person:
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"

object Person:

  // фабричный метод с одним аргументом
  def apply(name: String): Person =
    var p = new Person
    p.name = name
    p

  // фабричный метод с двумя аргументами
  def apply(name: String, age: Int): Person =
    var p = new Person
    p.name = name
    p.age = age
    p

end Person

val joe = Person("Joe")
val fred = Person("Fred", 29)

//val joe: Person = Joe is 0 years old
//val fred: Person = Fred is 29 years old
```

Метод `unapply` здесь не рассматривается, но описан в [справочной документации]({{ site.scala3ref }}/changed-features/pattern-matching.html).

{% endtab %}
{% endtabs %}

## Трейты

Если провести аналогию с Java, то Scala `trait` похож на интерфейс в Java 8+.
Trait-ы могут содержать:

- абстрактные методы и поля
- конкретные методы и поля

В базовом использовании `trait` может использоваться как интерфейс, определяющий только абстрактные члены, 
которые будут реализованы другими классами:

{% tabs traits_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Employee {
  def id: Int
  def firstName: String
  def lastName: String
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String
```

{% endtab %}
{% endtabs %}

Однако трейты также могут содержать конкретные члены. 
Например, следующий трейт определяет два абстрактных члена — `numLegs` и `walk()` — 
а также имеет конкретную реализацию метода `stop()`:

{% tabs traits_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait HasLegs {
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```

{% endtab %}
{% endtabs %}

Вот еще один трейт с абстрактным членом и двумя конкретными реализациями:

{% tabs traits_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait HasTail {
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait HasTail:
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
```

{% endtab %}
{% endtabs %}

Обратите внимание, что каждый трейт обрабатывает только очень специфичные атрибуты и поведение: 
`HasLegs` имеет дело только с "лапами", а `HasTail` имеет дело только с функциональностью, связанной с хвостом. 
Трейты позволяют создавать такие небольшие модули.

Позже в вашем коде классы могут смешивать несколько трейтов для создания более крупных компонентов:

{% tabs traits_4 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class IrishSetter(name: String) extends HasLegs with HasTail {
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class IrishSetter(name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

{% endtab %}
{% endtabs %}

Обратите внимание, что класс `IrishSetter` реализует абстрактные члены, определенные в `HasLegs` и `HasTail`. 
Теперь вы можете создавать новые экземпляры `IrishSetter`:

{% tabs traits_5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val d = new IrishSetter("Big Red")   // "Big Red is a Dog"
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val d = IrishSetter("Big Red")   // "Big Red is a Dog"
```

{% endtab %}
{% endtabs %}

Это всего лишь пример того, чего можно добиться с помощью trait-ов. 
Дополнительные сведения см. в остальных уроках по моделированию.

## Абстрактные классы

Когда необходимо написать класс, но известно, что в нем будут абстрактные члены, можно создать либо `trait`, либо абстрактный класс. 
В большинстве случаев желательно использовать `trait`, но исторически сложилось так, что было две ситуации, 
когда предпочтительнее использование абстрактного класса:

- необходимо создать базовый класс, который принимает аргументы конструктора
- код будет вызван из Java-кода

### Базовый класс, который принимает аргументы конструктора

До Scala 3, когда базовому классу нужно было принимать аргументы конструктора, он объявлялся как `abstract class`:

{% tabs abstract_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
abstract class Pet(name: String) {
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"
}

class Dog(name: String, var age: Int) extends Pet(name) {
  val greeting = "Woof"
}

val d = new Dog("Fido", 1)
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
abstract class Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

{% endtab %}
{% endtabs %}

<h4>Параметры в trait <span class="tag tag-inline">только в Scala 3</span></h4>

Однако в Scala 3 трейты теперь могут иметь [параметры][trait-params], 
так что теперь вы можете использовать трейты в той же ситуации:

{% tabs abstract_2 %}

{% tab 'Только в Scala 3' %}

```scala
trait Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

{% endtab %}
{% endtabs %}

Trait-ы более гибки в составлении, потому что можно смешивать (наследовать) несколько trait-ов, но только один класс. 
В большинстве случаев trait-ы следует предпочитать классам и абстрактным классам. 
Правило выбора состоит в том, чтобы использовать классы всякий раз, когда необходимо создавать экземпляры определенного типа, 
и trait-ы, когда желательно разложить и повторно использовать поведение.

<h2>Перечисления <span class="tag tag-inline">только в Scala 3</span></h2>

Перечисление (_an enumeration_) может быть использовано для определения типа, 
состоящего из конечного набора именованных значений (в разделе, посвященном [моделированию ФП][fp-modeling], 
будут показаны дополнительные возможности перечислений). 
Базовые перечисления используются для определения наборов констант, 
таких как месяцы в году, дни в неделе, направления, такие как север/юг/восток/запад, и многое другое.

В качестве примера, рассмотрим перечисления, определяющие наборы атрибутов, связанных с пиццами:

{% tabs enum_1 %}
{% tab 'Только в Scala 3' %}

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

Для использования в коде в первую очередь перечисление нужно импортировать, а затем - использовать:

{% tabs enum_2 %}
{% tab 'Только в Scala 3' %}

```scala
import CrustSize.*
val currentCrustSize = Small
```

{% endtab %}
{% endtabs %}

Значения перечислений можно сравнивать (`==`) и использовать в сопоставлении:

{% tabs enum_3 %}
{% tab 'Только в Scala 3' %}

```scala
// if/then
if currentCrustSize == Large then
  println("You get a prize!")

// match
currentCrustSize match
  case Small => println("small")
  case Medium => println("medium")
  case Large => println("large")
```

{% endtab %}
{% endtabs %}

### Дополнительные функции перечисления

Перечисления также могут быть параметризованы:

{% tabs enum_4 %}
{% tab 'Только в Scala 3' %}

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

{% endtab %}
{% endtabs %}

И они также могут содержать элементы (например, поля и методы):

{% tabs enum_5 %}
{% tab 'Только в Scala 3' %}

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =
    otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // далее идут остальные планеты ...
```

{% endtab %}
{% endtabs %}

### Совместимость с перечислениями Java

Если вы хотите использовать перечисления, определенные в Scala, как перечисления Java, 
то можете сделать это, расширив класс `java.lang.Enum` (импортированный по умолчанию) следующим образом:

{% tabs enum_6 %}
{% tab 'Только в Scala 3' %}

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

{% endtab %}
{% endtabs %}

Параметр типа берется из определения Java `enum` и должен совпадать с типом перечисления. 
Нет необходимости предоставлять аргументы конструктора (как определено в документации Java API) для `java.lang.Enum`
при его расширении — компилятор генерирует их автоматически.

После такого определения `Color` вы можете использовать его так же, как перечисление Java:

````
scala> Color.Red.compareTo(Color.Green)
val res0: Int = -1
````

В разделе об [алгебраических типах данных][adts] и [справочной документации][ref-enums] перечисления рассматриваются более подробно.

## Case class-ы

Case class используются для моделирования неизменяемых структур данных. 
Возьмем следующий пример:

{% tabs case-classes_1 %}
{% tab 'Scala 2 и 3' %}

```scala:
case class Person(name: String, relation: String)
```

{% endtab %}
{% endtabs %}

Поскольку мы объявляем `Person` как `case class`, поля `name` и `relation` по умолчанию общедоступны и неизменяемы. 
Мы можем создавать экземпляры case классов следующим образом:

{% tabs case-classes_2 %}
{% tab 'Scala 2 и 3' %}

```scala
val christina = Person("Christina", "niece")
```

{% endtab %}
{% endtabs %}

Обратите внимание, что поля не могут быть изменены:

{% tabs case-classes_3 %}
{% tab 'Scala 2 и 3' %}

```scala
christina.name = "Fred"   // ошибка: reassignment to val
```

{% endtab %}
{% endtabs %}

Поскольку предполагается, что поля case класса неизменяемы, 
компилятор Scala может сгенерировать для вас множество полезных методов:

- Генерируется метод `unapply`, позволяющий выполнять сопоставление с образцом case класса (то есть `case Person(n, r) => ...`).
- В классе генерируется метод `copy`, полезный для создания модифицированных копий экземпляра.
- Генерируются методы `equals` и `hashCode`, использующие структурное равенство, 
  что позволяет использовать экземпляры case классов в `Map`-ах.
- Генерируется дефолтный метод `toString`, полезный для отладки.

Эти дополнительные функции показаны в следующем примере:

{% tabs case-classes_4 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
// Case class-ы можно использовать в качестве шаблонов
christina match {
  case Person(n, r) => println("name is " + n)
}

// для вас генерируются методы `equals` и `hashCode`
val hannah = Person("Hannah", "niece")
christina == hannah       // false

// метод `toString`
println(christina)        // Person(Christina,niece)

// встроенный метод `copy`
case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
// в результате:
// cubs2016: BaseballTeam = BaseballTeam(Chicago Cubs,2016)

```

{% endtab %}

{% tab 'Scala 3' %}

```scala
// Case class-ы можно использовать в качестве шаблонов
christina match
  case Person(n, r) => println("name is " + n)

// для вас генерируются методы `equals` и `hashCode`
val hannah = Person("Hannah", "niece")
christina == hannah       // false

// метод `toString`
println(christina)        // Person(Christina,niece)

// встроенный метод `copy`
case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
// в результате:
// cubs2016: BaseballTeam = BaseballTeam(Chicago Cubs,2016)
```

{% endtab %}
{% endtabs %}

### Поддержка функционального программирования

Как уже упоминалось ранее, case class-ы поддерживают функциональное программирование (ФП):

- ФП избегает изменения структур данных. 
  Поэтому поля конструктора по умолчанию имеют значение `val`. 
  Поскольку экземпляры case class не могут быть изменены, ими можно легко делиться, не опасаясь мутаций или условий гонки.
- вместо изменения экземпляра можно использовать метод `copy` в качестве шаблона для создания нового (потенциально измененного) экземпляра. 
  Этот процесс можно назвать “обновлением по мере копирования”.
- наличие автоматически сгенерированного метода `unapply` позволяет использовать case class в сопоставлении шаблонов.

## Case object-ы

Case object-ы относятся к объектам так же, как case class-ы относятся к классам: 
они предоставляют ряд автоматически генерируемых методов, чтобы сделать их более мощными. 
Case object-ы особенно полезны тогда, когда необходим одноэлементный объект, 
который нуждается в небольшой дополнительной функциональности, 
например, для использования с сопоставлением шаблонов в выражениях `match`.

Case object-ы полезны, когда необходимо передавать неизменяемые сообщения. 
Например, представим проект музыкального проигрывателя, и создадим набор команд или сообщений:

{% tabs case-objects_1 %}
{% tab 'Scala 2 и 3' %}

```scala
sealed trait Message
case class PlaySong(name: String) extends Message
case class IncreaseVolume(amount: Int) extends Message
case class DecreaseVolume(amount: Int) extends Message
case object StopPlaying extends Message
```

{% endtab %}
{% endtabs %}

Затем в других частях кода можно написать методы, которые используют сопоставление с образцом 
для обработки входящего сообщения 
(при условии, что методы `playSong`, `changeVolume` и `stopPlayingSong` определены где-то еще):

{% tabs case-objects_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
def handleMessages(message: Message): Unit = message match {
  case PlaySong(name)         => playSong(name)
  case IncreaseVolume(amount) => changeVolume(amount)
  case DecreaseVolume(amount) => changeVolume(-amount)
  case StopPlaying            => stopPlayingSong()
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
def handleMessages(message: Message): Unit = message match
  case PlaySong(name)         => playSong(name)
  case IncreaseVolume(amount) => changeVolume(amount)
  case DecreaseVolume(amount) => changeVolume(-amount)
  case StopPlaying            => stopPlayingSong()
```

{% endtab %}
{% endtabs %}

[ref-enums]: {{ site.scala3ref }}/enums/enums.html
[adts]: {% link _overviews/scala3-book/types-adts-gadts.md %}
[fp-modeling]: {% link _overviews/scala3-book/domain-modeling-fp.md %}
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[unapply]: {{ site.scala3ref }}/changed-features/pattern-matching.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
