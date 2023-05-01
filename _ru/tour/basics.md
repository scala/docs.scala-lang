---
layout: tour
title: Основы
partof: scala-tour
num: 2
language: ru
next-page: unified-types
previous-page: tour-of-scala
---

На этой странице мы расскажем об основах Scala.

## Попробовать Scala в браузере.

Вы можете запустить Scala в браузере с помощью Scastie.

1. Зайдите на [Scastie](https://scastie.scala-lang.org/).
2. Вставьте `println("Hello, world!")` в левую панель.
3. Нажмите кнопку "Run". Вывод отобразится в правой панели.

Это простой способ поэкспериментировать со Scala кодом без всяких настроек.

Большинство примеров кода в этой документации также интегрированы с Scastie,
поэтому вы можете поэкспериментировать с ними, просто нажав кнопку Run.

## Выражения

Выражения — это вычислимые утверждения.

{% tabs expression %}
{% tab 'Scala 2 и 3' for=expression %}
```scala mdoc
1 + 1
```
{% endtab %}
{% endtabs %}

Вы можете выводить результаты выражений, используя `println`.

{% tabs println %}
{% tab 'Scala 2 и 3' for=println %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endtab %}
{% endtabs %}

### Значения

Результаты выражений можно присваивать именам с помощью ключевого слова `val`.

{% tabs val %}
{% tab 'Scala 2 и 3' for=val %}
```scala mdoc
val x = 1 + 1
println(x) // 2
```
{% endtab %}
{% endtabs %}

Названные результаты, такие как `x` в примере, называются значениями.
Вызов значения не приводит к его повторному вычислению.

Значения не изменяемы и не могут быть переназначены.

{% tabs val-error %}
{% tab 'Scala 2 и 3' for=val-error %}
```scala mdoc:fail
x = 3 // Не компилируется.
```
{% endtab %}
{% endtabs %}

Типы значений могут быть выведены автоматически, но можно и явно указать тип, как показано ниже:

{% tabs type-inference %}
{% tab 'Scala 2 и 3' for=type-inference %}
```scala mdoc:nest
val x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}

Обратите внимание, что объявление типа `Int` происходит после идентификатора `x`, следующим за `:`.

### Переменные

Переменные похожи на значения константы, за исключением того, что их можно присваивать заново. Вы можете объявить переменную с помощью ключевого слова `var`.

{% tabs var %}
{% tab 'Scala 2 и 3' for=var %}
```scala mdoc:nest
var x = 1 + 1
x = 3 // Компилируется потому что "x" объявлен с ключевым словом "var".
println(x * x) // 9
```
{% endtab %}
{% endtabs %}

Как и в случае со значениями, вы можете явно указать тип, если захотите:

{% tabs type-inference-2 %}
{% tab 'Scala 2 и 3' for=type-inference-2 %}
```scala mdoc:nest
var x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}

## Блоки

Вы можете комбинировать выражения, окружая их `{}`. Мы называем это блоком.

Результат последнего выражения в блоке будет результатом всего блока в целом.

{% tabs blocks %}
{% tab 'Scala 2 и 3' for=blocks %}
```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```
{% endtab %}
{% endtabs %}

## Функции

Функции — это выражения, которые принимают параметры.

Вы можете определить анонимную функцию (т.е. без имени), которая возвращает переданное число, прибавив к нему единицу:

{% tabs anonymous-function %}
{% tab 'Scala 2 и 3' for=anonymous-function %}
```scala mdoc
(x: Int) => x + 1
```
{% endtab %}
{% endtabs %}

Слева от `=>` находится список параметров. Справа — выражение, связанное с параметрами.

Вы также можете назвать функции.

{% tabs named-function %}
{% tab 'Scala 2 и 3' for=named-function %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endtab %}
{% endtabs %}

Функции могут принимать множество параметров.

{% tabs multiple-parameters %}
{% tab 'Scala 2 и 3' for=multiple-parameters %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Или вообще не принимать никаких параметров.

{% tabs no-parameters %}
{% tab 'Scala 2 и 3' for=no-parameters %}
```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```
{% endtab %}
{% endtabs %}

## Методы

Методы выглядят и ведут себя очень похоже на функции, но между ними есть несколько принципиальных различий.

Методы задаются ключевым словом `def`.  За `def` следует имя, список параметров, возвращаемый тип и тело.

{% tabs method %}
{% tab 'Scala 2 и 3' for=method %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Обратите внимание, как объявлен возвращаемый тип сразу _после_ списка параметров и двоеточия `: Int`.

Методы могут принимать несколько списков параметров.

{% tabs multiple-parameter-lists %}
{% tab 'Scala 2 и 3' for=multiple-parameter-lists %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endtab %}
{% endtabs %}

Или вообще ни одного списка параметров.

{% tabs no-parameter-lists %}
{% tab 'Scala 2 и 3' for=no-parameter-lists %}
```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
{% endtab %}
{% endtabs %}

Есть некоторые отличия от функций, но пока что их можно рассматривать как нечто похожее.

Методы также могут иметь многострочные выражения.


{% tabs get-square-string class=tabs-scala-version %}

{% tab 'Scala 2' for=get-square-string %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% tab 'Scala 3' for=get-square-string %}
```scala mdoc
def getSquareString(input: Double): String =
  val square = input * input
  square.toString

println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% endtabs %}

Последнее выражение в теле становится возвращаемым значением метода (у Scala есть ключевое слово `return`, но оно практически не используется).

## Классы

Вы можете объявлять классы используя ключевое слово `class`, за которым следует его имя и параметры конструктора.

{% tabs greeter-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-definition %}
```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-definition %}
```scala mdoc
class Greeter(prefix: String, suffix: String):
  def greet(name: String): Unit =
    println(prefix + name + suffix)
```
{% endtab %}

{% endtabs %}

Возвращаемый тип метода `greet` это `Unit`, используется тогда, когда не имеет смысла что-либо возвращать. Аналогично `void` в Java и C. Поскольку каждое выражение Scala должно иметь какое-то значение, то при отсутствии возвращающегося значения возвращается экземпляр типа Unit. Явным образом его можно задать как `()`, он не несет какой-либо информации.

Вы можете создать экземпляр класса, используя ключевое слово `new`.


{% tabs greeter-usage class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-usage %}
```scala mdoc:nest
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% tab 'Scala 3' for=greeter-usage %}
```scala mdoc:nest
val greeter = Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% endtabs %}

Позже мы рассмотрим классы [подробнее](classes.html).

## Классы-образцы (Case Class)

В Scala есть специальный тип класса, который называется классом-образцом (case class). По умолчанию такие классы неизменны и сравниваются по значению из конструктора. Вы можете объявлять классы-образцы с помощью ключевых слов `case class`.

{% tabs case-class-definition %}
{% tab 'Scala 2 и 3' for=case-class-definition %}
```scala mdoc
case class Point(x: Int, y: Int)
```
{% endtab %}
{% endtabs %}

Можно создавать экземпляры класса-образца без использования ключевого слова `new`.

{% tabs case-class-creation %}
{% tab 'Scala 2 и 3' for=case-class-creation %}
```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```
{% endtab %}
{% endtabs %}

Они сравниваются по значению.


{% tabs compare-case-class-equality class=tabs-scala-version %}

{% tab 'Scala 2' for=compare-case-class-equality %}
```scala mdoc
if (point == anotherPoint) {
  println(s"$point and $anotherPoint are the same.")
} else {
  println(s"$point and $anotherPoint are different.")
} // Point(1,2) и Point(1,2) одни и те же.

if (point == yetAnotherPoint) {
  println(s"$point and $yetAnotherPoint are the same.")
} else {
  println(s"$point and $yetAnotherPoint are different.")
} // Point(1,2) и Point(2,2) разные.
```
{% endtab %}

{% tab 'Scala 3' for=compare-case-class-equality %}
```scala mdoc
if point == anotherPoint then
  println(s"$point and $anotherPoint are the same.")
else
  println(s"$point and $anotherPoint are different.")
// Point(1,2) и Point(1,2) одни и те же.

if point == yetAnotherPoint then
  println(s"$point and $yetAnotherPoint are the same.")
else
  println(s"$point and $yetAnotherPoint are different.")
// Point(1,2) и Point(2,2) разные.
```
{% endtab %}

{% endtabs %}

Есть еще много деталей, которые мы бы хотели рассказать про классы-образцы; мы уверены, что вы влюбитесь в них! Обязательно рассмотрим их [позже](case-classes.html).

## Объекты

Объекты задаются и существуют в единственном экземпляре. Вы можете думать о них как об одиночках (синглтонах) своего собственного класса.

Вы можете задать объекты при помощи ключевого слова `object`.


{% tabs id-factory-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=id-factory-definition %}
```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=id-factory-definition %}
```scala mdoc
object IdFactory:
  private var counter = 0
  def create(): Int =
    counter += 1
    counter
```
{% endtab %}

{% endtabs %}

Вы можете сразу получить доступ к объекту, ссылаясь на его имя.

{% tabs id-factory-usage %}
{% tab 'Scala 2 и 3' for=id-factory-usage %}
```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```
{% endtab %}
{% endtabs %}

Позже мы рассмотрим объекты [подробнее](singleton-objects.html).

## Трейты

Трейты — как типы описывают характеристики классов, в нем могут объявляться определенные поля и методы. Трейты можно комбинировать.

Объявить трейт можно с помощью ключевого слова `trait`.

{% tabs greeter-trait-def class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def %}
```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def %}
```scala mdoc:nest
trait Greeter:
  def greet(name: String): Unit
```
{% endtab %}

{% endtabs %}

Трейты также могут иметь реализации методов и полей, которые предполагается использовать умолчанию.

{% tabs greeter-trait-def-impl class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def-impl %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def-impl %}
```scala mdoc:reset
trait Greeter:
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
```
{% endtab %}

{% endtabs %}

Вы можете наследовать свойства трейтов, используя ключевое слово `extends` и переопределять реализацию с помощью ключевого слова `override`.


{% tabs greeter-implementations class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-implementations %}
```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endtab %}

{% tab 'Scala 3' for=greeter-implementations %}
```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter:
  override def greet(name: String): Unit =
    println(prefix + name + postfix)

val greeter = DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endtab %}

{% endtabs %}

Здесь `DefaultGreeter` наследуется только от одного трейта, но можно наследоваться от нескольких.

Позже мы рассмотрим трейты [подробнее](traits.html).

## Главный метод

Главный метод является отправной точкой в программе.
Для Виртуальной Машины Java требуется, чтобы главный метод назывался `main` и принимал один аргумент, массив строк.

Используя объект, можно задать главный метод следующим образом:

{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}

In Scala 2 you must define a main method manually. Using an object, you can define the main method as follows:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}

In Scala 3, with the `@main` annotation, a main method is automatically generated from a method as follows:

```scala mdoc
@main def hello() = println("Hello, Scala developer!")
```
{% endtab %}

{% endtabs %}
