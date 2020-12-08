---
layout: tour
title: Вариантность

discourse: true

partof: scala-tour

num: 19
language: ru
next-page: upper-type-bounds
previous-page: generic-classes

---

Вариантность (Variances) - это указание определенной специфики взаимосвязи между связанными типам. Scala поддерживает вариантную аннотацию типов у [обобщенных классов](generic-classes.html), что позволяет им быть ковариантными, контрвариантными или инвариантными (если нет никакого указание на вариантность). Использование вариантности в системе типов позволяет устанавливать понятные взаимосвязи между сложными типами, в то время как отсутствие вариантности может ограничить повторное использование абстракции класса.

```scala mdoc
class Foo[+A] // ковариантный класс
class Bar[-A] // контрвариантный класс
class Baz[A]  // инвариантными класс
```

### Ковариантность

Параметр типа `A` обобщенного класса можно сделать ковариантным с помощью аннотации `+A`. Для некоторого класса `List[+A]`, указание `A` в виде коварианта подразумевает, что для двух типов `A` и `B`, где `A` является подтипом `B`, `List[A]` представляет собой подтип `List[B]`. Что позволяет нам создавать очень полезные и интуитивно понятные взаимоотношения между типами с использованием обобщений (generics).

Рассмотрим простую структуру классов:

```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```

И `Cat` (кошка) и `Dog`(собака) являются подтипами `Animal`(животное). Стандартная библиотека Scala имеет обобщенный неизменяемый тип `List[+A]`, где параметр типа `A` является ковариантным. Это означает, что `List[Cat]` - это  `List[Animal]`, а `List[Dog]` - это также `List[Animal]`. Интуитивно понятно, что список кошек и список собак - это список животных и вы должны быть в состоянии заменить любого из них на `List[Animal]`.

В следующем примере метод `printAnimalNames` принимает в качестве аргумента список животных и выводит их имена в новой строке. Если бы `List[A]` не был ковариантным, последние два вызова метода не компилировались бы, что сильно ограничило бы полезность метода `printAnimalNames`.

```scala mdoc
object CovarianceTest extends App {
  def printAnimalNames(animals: List[Animal]): Unit = {
    animals.foreach { animal =>
      println(animal.name)
    }
  }

  val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
  val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

  printAnimalNames(cats)
  // Whiskers
  // Tom

  printAnimalNames(dogs)
  // Fido
  // Rex
}
```

### Контрвариантность

Параметр типа `A` обобщенного класса можно сделать контрвариантным с помощью аннотации `-A`. Это создает схожее, но противоположное ковариантным, взаимоотношения между типом параметра и подтипами класса. То есть, для некого класса `Writer[-A]`, указание `A` контрвариантным подразумевает, что для двух типов `A` и `B` где `A` является подтипом `B`, `Writer[B]` является подтипом `Writer[A]`.

Рассмотрим классы `Cat`, `Dog`, и `Animal`, описанные выше для следующего примера:

```scala mdoc
abstract class Printer[-A] {
  def print(value: A): Unit
}
```

`Printer[A]` - это простой класс, который знает, как распечатать некоторый тип `A`. Давайте определим подклассы для конкретных типов:

```scala mdoc
class AnimalPrinter extends Printer[Animal] {
  def print(animal: Animal): Unit =
    println("The animal's name is: " + animal.name)
}

class CatPrinter extends Printer[Cat] {
  def print(cat: Cat): Unit =
    println("The cat's name is: " + cat.name)
}
```

Если `Printer[Cat]` знает, как распечатать любой класс `Cat` в консоли, а `Printer[Animal]` знает, как распечатать любое `Animal` в консоли, то разумно если `Printer[Animal]` также знает, как распечатать любое `Cat`. Обратного отношения нет, потому что `Printer[Cat]` не знает, как распечатать любой `Animal` в консоли. Чтоб иметь возможность заменить `Printer[Cat]` на `Printer[Animal]`, необходимо `Printer[A]` сделать контрвариантным.

```scala mdoc
object ContravarianceTest extends App {
  val myCat: Cat = Cat("Boots")

  def printMyCat(printer: Printer[Cat]): Unit = {
    printer.print(myCat)
  }

  val catPrinter: Printer[Cat] = new CatPrinter
  val animalPrinter: Printer[Animal] = new AnimalPrinter

  printMyCat(catPrinter)
  printMyCat(animalPrinter)
}
```

Результатом работы этой программы будет:

```
The cat's name is: Boots
The animal's name is: Boots
```

### Инвариантность

Обобщенные классы в Scala по умолчанию являются инвариантными. Это означает, что они не являются ни ковариантными, ни контрвариантными друг другу. В контексте следующего примера класс `Container` является инвариантным. Между `Container[Cat]` и `Container[Animal]`, нет ни прямой, ни обратной взаимосвязи.

```scala mdoc
class Container[A](value: A) {
  private var _value: A = value
  def getValue: A = _value
  def setValue(value: A): Unit = {
    _value = value
  }
}
```

Может показаться что `Container[Cat]` должен также являться и `Container[Animal]`, но позволить мутабельному обобщенному классу быть ковариантным было бы небезопасно.  В данном примере очень важно, чтобы `Container` был инвариантным. Предположим, что `Container` на самом деле был ковариантным, что-то вроде этого могло случиться:

```
val catContainer: Container[Cat] = new Container(Cat("Felix"))
val animalContainer: Container[Animal] = catContainer
animalContainer.setValue(Dog("Spot"))
val cat: Cat = catContainer.getValue // Ой, мы бы закончили присвоением собаки к коту.
```

К счастью, компилятор остановит нас прежде, чем мы зайдем так далеко.

### Другие Примеры

Другим примером, который может помочь понять вариантность, является трейт `Function1[-T, +R]` из стандартной библиотеки Scala. `Function1` представляет собой функцию с одним параметром, где первый тип `T` представляет собой тип параметра, а второй тип `R` представляет собой тип результата. Функция `Function1` является контрвариантной в рамках типа принимаемого аргумента, а ковариантной - в рамках возвращаемого типа. Для этого примера мы будем использовать явное обозначение типа `A =>B` чтоб продемонстрировать `Function1[A, B]`.

Рассмотрим схожий пример `Cat`, `Dog`, `Animal` в той же взаимосвязи что и раньше, плюс следующее:

```scala mdoc
abstract class SmallAnimal extends Animal
case class Mouse(name: String) extends SmallAnimal
```

Предположим, мы работаем с функциями, которые принимают типы животных и возвращают типы еды, которую они едят. Если мы хотим `Cat => SmallAnimal` (потому что кошки едят маленьких животных), но вместо этого мы получим функцию `Animal => Mouse`, то наша программа все равно будет работать. Интуитивно функция `Animal => Mouse` все равно будет принимать `Cat` в качестве аргумента, тк `Cat` является `Animal`, и возвращать `Mouse` - который также является и `SmallAnimal`. Поскольку мы можем безопасно заменить первое вторым, можно сказать, что `Animal => Mouse` аналогично `Cat => SmallAnimal`.

### Сравнение с другими языками

В языках, похожих на Scala, разные способы поддержи вариантности. Например, указания вариантности в Scala очень похожи на то, как это делается в C#, где такие указания добавляются при объявлении абстракции класса (вариантность при объявлении). Однако в Java, указание вариантности задается непосредственно при использовании абстракции класса (вариантность при использовании).
