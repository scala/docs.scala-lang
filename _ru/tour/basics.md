---
layout: tour
title: Основы

discourse: true

partof: scala-tour

num: 2
language: ru
next-page: unified-types
previous-page: tour-of-scala

---

На этой странице мы расскажем об основах Scala.

## Попробовать Scala в браузере.

Вы можете запустить Scala в браузере с помощью ScalaFiddle.

1. Зайдите на [https://scalafiddle.io](https://scalafiddle.io).
2. Вставьте `println("Hello, world!")` в левую панель.
3. Нажмите кнопку "Run". Вывод отобразится в правой панели.

Это простой способ поэкспериментировать со Scala кодом без всяких настроек.

Большинство примеров кода в этой документации также интегрированы с ScalaFiddle, 
поэтому вы можете непосредственно поэкспериментировать с ними, просто нажав кнопку Run.

## Выражения

Выражения - это вычислимые утверждения.
```
1 + 1
```
Вы можете выводить результаты выражений используя `println`.

{% scalafiddle %}
```tut
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Значения

Результаты выражений можно назвать с помощью ключевого слова `val`.

```tut
val x = 1 + 1
println(x) // 2
```

Названные результаты, такие как `x` в примере, называются значениями. 
Вызов значения не приводит к его повторному вычислению.

Значения константны и не могут быть переназначены.

```tut:fail
x = 3 // Не компилируется.
```

Типы значений могут быть выведены автоматически, но вы также можете явно указать тип, как показано ниже:

```tut
val x: Int = 1 + 1
```

Обратите внимание, что объявление типа `Int` происходит после идентификатора `x`, следующим за `:`.  

### Переменные

Переменные похожи на значения константы, за исключением того, что их можно переназначить заново. Вы можете объявить переменную с помощью ключевого слова `var`.

```tut
var x = 1 + 1
x = 3 // Компилируется потому что "x" объявлен с ключевым словом "var".
println(x * x) // 9
```

Как и в случае со значениями, вы можете явно указать тип, если хотите:

```tut
var x: Int = 1 + 1
```


## Блоки

Вы можете комбинировать выражения, окружая их `{}`. Мы называем это блоком.

Результат последнего выражения в блоке - будет результатом всего блока в целом.

```tut
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Функции

Функции - это выражения, которые принимают параметры.

Вы можете определить анонимную функцию (т.е. без имени), которая возвращает переданное число прибавив к нему еденицу:

```tut
(x: Int) => x + 1
```

Слева от `=>` находится список параметров. Справа - выражение, связанное с параметрами.

Вы также можете назвать функции.

{% scalafiddle %}
```tut
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Функции могут принимать множество параметров.

{% scalafiddle %}
```tut
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Или вообще не принимать никаких параметров.

```tut
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Методы

Методы выглядят и ведут себя очень похоже на функции, но между ними есть несколько принципиальных различий.

Методы задаются ключевым словом `def`.  За `def` следует имя, список параметров, возвращаемый тип и тело.

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Обратите внимание, как объявлен возвращаемый тип сразу _после_ списка параметров и двоеточия `: Int`.

Методы могут принимать несколько списков параметров.

{% scalafiddle %}
```tut
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

Или вообще ни одного списка параметров.

```tut
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

Есть некоторые отличия от функций, но пока что их можно рассматривать как нечто похожее.

Методы также могут иметь многострочные выражения.
```tut
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
```
Последнее выражениее в теле становится возвращаемым значением метода. (У Scala есть ключевое слово `return` , но оно практически не используется.)

## Классы

Вы можете объявлять классы используя ключевое слово `class`, за которым следует его имя и параметры конструктора.

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
Возвращаемый тип метода `greet` это `Unit`, используется тогда, когда не имеет смысла что-либо возвращать. Аналогично `void` в Java и C. (Поскольку каждое выражение Scala должно иметь какое-то значение, поэтому, при оттуствии возвращающегося значения, возвращается одиночка (сингэлтон) типа Unit. Явным образом его можно задаеть как `()`, он не несет какой-либо информации.)

Вы можете создать экземпляр класса используя ключевое слово `new`.

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Позже мы рассмотрим классы [подробнее](classes.html).

## Классы образцы (Case Class)

В Scala есть специальный тип класса, который называется классом образцом (case class). По умолчанию такие классы неизменны и сравниваются по значению из конструктора. Вы можете объявлять классы образцы с помощью ключевых слов `case class`.

```tut
case class Point(x: Int, y: Int)
```

Можно создавать экземпляры класса образца без использования ключевого слова `new`.

```tut
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Они сравниваются по значению.

```tut
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) и Point(1,2) одни и теже.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) и Point(2,2) разные.
```

Есть еще куча вещей которые мы бы хотели рассказать про классы образцы, мы уверены, что вы влюбитесь в них! Обязательно рассмотрим их подробнее немного [позже](case-classes.html).

## Объекты

Объекты задаются и существуют в единственным экземпляре. Вы можете думать о них как об одиночках своего собственного класса.

Вы можете задать объекты при помощи ключевого слова `object`.

```tut
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Вы можете сразу получить доступ к объекту, ссылаясь на его имя.

```tut
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Позже рассмотрим объекты более [подробно](singleton-objects.html).

## Трейты

Трейты - как типы описывают харрактеристики классов, в нем могут объявляться определенные поля и методы. Трейты можно комбинировать.

Объявить трейт можно с помощью ключевого слова `trait`.

```tut
trait Greeter {
  def greet(name: String): Unit
}
```

Трейты также могут иметь реализации методов и полей, которые предполагается использовать умолчанию.

{% scalafiddle %}
```tut
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Вы можете наследовать свойства трейтов используя ключевое словом `extends` и переопределять реализацию с помощью ключевого слова `override`.

```tut
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
{% endscalafiddle %}

Здесь `DefaultGreeter` наследуется только от одиного трейта, но можно наследоваться от нескольких.

Позже мы рассмотрим трейты [подробнее](traits.html).

## Главный метод

Главный метод является отправной точкой в программе. 
Для Виртуальной Java Машины требуется, чтобы главный метод назывался `main` и принимал один аргумент, массив строк.

Используя объект, можно задать главный метод следующим образом:

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
