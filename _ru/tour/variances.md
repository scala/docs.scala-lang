---
layout: tour
title: Вариантность
partof: scala-tour
num: 19
language: ru
next-page: upper-type-bounds
previous-page: generic-classes
---

Вариантность (Variances) - это указание определенной специфики взаимосвязи между связанными типами.
Scala поддерживает вариантную аннотацию типов у [обобщенных классов](generic-classes.html),
что позволяет им быть ковариантными, контрвариантными или инвариантными (если нет никакого указания на вариантность).
Использование вариантности в системе типов позволяет устанавливать понятные взаимосвязи между сложными типами,
в то время как отсутствие вариантности может ограничить повторное использование абстракции класса.

{% tabs variances_1 %}
{% tab 'Scala 2 и 3' for=variances_1 %}

```scala mdoc
class Foo[+A] // ковариантный класс
class Bar[-A] // контравариантный класс
class Baz[A]  // инвариантный класс
```

{% endtab %}
{% endtabs %}

### Инвариантность

По умолчанию параметры типа в Scala инвариантны: отношения подтипа между параметрами типа не отражаются в параметризованном типе.
Чтобы понять, почему это работает именно так, рассмотрим простой параметризованный тип, изменяемый контейнер.

{% tabs invariance_1 %}
{% tab 'Scala 2 и 3' for=invariance_1 %}

```scala mdoc
class Box[A](var content: A)
```

{% endtab %}
{% endtabs %}

Мы собираемся поместить в него значения типа `Animal` (животное). Этот тип определяется следующим образом:

{% tabs invariance_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=invariance_2 %}

```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```

{% endtab %}
{% tab 'Scala 3' for=invariance_2 %}

```scala
abstract class Animal:
  def name: String

case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```

{% endtab %}
{% endtabs %}

Можно сказать, что `Cat` (кот) - это подтип `Animal`, `Dog` (собака) - также подтип `Animal`.
Это означает, что следующее допустимо и пройдет проверку типов:

{% tabs invariance_3 %}
{% tab 'Scala 2 и 3' for=invariance_3 %}

```scala mdoc
val myAnimal: Animal = Cat("Felix")
```

{% endtab %}
{% endtabs %}

А контейнеры?
Является ли `Box[Cat]` подтипом `Box[Animal]`, как `Cat` подтип `Animal`?
На первый взгляд может показаться, что это правдоподобно,
но если мы попытаемся это сделать, компилятор сообщит об ошибке:

{% tabs invariance_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=invariance_4 %}

```scala mdoc:fail
val myCatBox: Box[Cat] = new Box[Cat](Cat("Felix"))
val myAnimalBox: Box[Animal] = myCatBox // не компилируется
val myAnimal: Animal = myAnimalBox.content
```

{% endtab %}
{% tab 'Scala 3' for=invariance_4 %}

```scala
val myCatBox: Box[Cat] = Box[Cat](Cat("Felix"))
val myAnimalBox: Box[Animal] = myCatBox // не компилируется
val myAnimal: Animal = myAnimalBox.content
```

{% endtab %}
{% endtabs %}

Почему это может быть проблемой?
Мы можем достать из контейнера кота, и это все еще животное, не так ли? Ну да.
Но это не все, что мы можем сделать. Мы также можем заменить в контейнере кота другим животным.

{% tabs invariance_5 %}
{% tab 'Scala 2 и 3' for=invariance_5 %}

```scala
  myAnimalBox.content = Dog("Fido")
```

{% endtab %}
{% endtabs %}

Теперь в контейнере для животных есть собака.
Все в порядке, вы можете поместить собак в контейнеры для животных, потому что собаки — это животные.
Но наш контейнер для животных — это контейнер для котов! Нельзя поместить собаку в контейнер с котом.
Если бы мы могли, а затем попытались достать кота из нашего кошачьего контейнера,
он оказался бы собакой, нарушающей целостность типа.

{% tabs invariance_6 %}
{% tab 'Scala 2 и 3' for=invariance_6 %}

```scala
  val myCat: Cat = myCatBox.content // myCat стал бы собакой Fido!
```

{% endtab %}
{% endtabs %}

Из этого мы должны сделать вывод, что между `Box[Cat]` и `Box[Animal]` не может быть отношения подтипа,
хотя между `Cat` и `Animal` это отношение есть.

### Ковариантность

Проблема, с которой мы столкнулись выше, заключается в том,
что, поскольку мы можем поместить собаку в контейнер для животных,
контейнер для кошек не может быть контейнером для животных.

Но что, если мы не сможем поместить собаку в контейнер?
Тогда мы бы могли просто вернуть нашего кота, и это не проблема, чтобы можно было следовать отношениям подтипа.
Оказывается, это действительно то, что мы можем сделать.

{% tabs covariance_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=covariance_1 %}

```scala mdoc
class ImmutableBox[+A](val content: A)
val catbox: ImmutableBox[Cat] = new ImmutableBox[Cat](Cat("Felix"))
val animalBox: ImmutableBox[Animal] = catbox // теперь код компилируется
```

{% endtab %}
{% tab 'Scala 3' for=covariance_1 %}

```scala
class ImmutableBox[+A](val content: A)
val catbox: ImmutableBox[Cat] = ImmutableBox[Cat](Cat("Felix"))
val animalBox: ImmutableBox[Animal] = catbox // теперь код компилируется
```

{% endtab %}
{% endtabs %}

Мы говорим, что `ImmutableBox` _ковариантен_ в `A` - на это указывает `+` перед `A`.

Более формально это дает нам следующее отношение:
если задано некоторое `class Cov[+T]`, то если `A` является подтипом `B`, то `Cov[A]` является подтипом `Cov[B]`.
Это позволяет создавать очень полезные и интуитивно понятные отношения подтипов с помощью обобщения.

В следующем менее надуманном примере метод `printAnimalNames` принимает список животных в качестве аргумента
и печатает их имена с новой строки.
Если бы `List[A]` не был бы ковариантным, последние два вызова метода не компилировались бы,
что сильно ограничивало бы полезность метода `printAnimalNames`.

{% tabs covariance_2 %}
{% tab 'Scala 2 и 3' for=covariance_2 %}

```scala mdoc
def printAnimalNames(animals: List[Animal]): Unit =
  animals.foreach {
    animal => println(animal.name)
  }

val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

// печатает: "Whiskers", "Tom"
printAnimalNames(cats)

// печатает: "Fido", "Rex"
printAnimalNames(dogs)
```

{% endtab %}
{% endtabs %}

### Контрвариантность

Мы видели, что можем достичь ковариантности, убедившись, что не сможем поместить что-то в ковариантный тип, а только что-то получить.
Что, если бы у нас было наоборот, что-то, что можно положить, но нельзя вынуть?
Такая ситуация возникает, если у нас есть что-то вроде сериализатора, который принимает значения типа `A`
и преобразует их в сериализованный формат.

{% tabs contravariance_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=contravariance_1 %}

```scala mdoc
abstract class Serializer[-A] {
  def serialize(a: A): String
}

val animalSerializer: Serializer[Animal] = new Serializer[Animal] {
  def serialize(animal: Animal): String = s"""{ "name": "${animal.name}" }"""
}
val catSerializer: Serializer[Cat] = animalSerializer
catSerializer.serialize(Cat("Felix"))
```

{% endtab %}
{% tab 'Scala 3' for=contravariance_1 %}

```scala
abstract class Serializer[-A]:
  def serialize(a: A): String

val animalSerializer: Serializer[Animal] = Serializer[Animal]():
  def serialize(animal: Animal): String = s"""{ "name": "${animal.name}" }"""

val catSerializer: Serializer[Cat] = animalSerializer
catSerializer.serialize(Cat("Felix"))
```

{% endtab %}
{% endtabs %}

Мы говорим, что `Serializer` _контравариантен_ в `A`, и на это указывает `-` перед `A`.
Более общий сериализатор является подтипом более конкретного сериализатора.

Более формально это дает нам обратное отношение: если задано некоторое `class Contra[-T]`,
то если `A` является подтипом `B`, `Contra[B]` является подтипом `Contra[A]`.

### Неизменность и вариантность

Неизменяемость является важной частью проектного решения, связанного с использованием вариантности.
Например, коллекции Scala систематически различают [изменяемые и неизменяемые коллекции](https://docs.scala-lang.org/ru/overviews/collections-2.13/overview.html).
Основная проблема заключается в том, что ковариантная изменяемая коллекция может нарушить безопасность типов.
Вот почему `List` - ковариантная коллекция, а `scala.collection.mutable.ListBuffer` - инвариантная коллекция.
`List` - это коллекция в `package scala.collection.immutable`, поэтому она гарантированно будет неизменяемой для всех.
Принимая во внимание, что `ListBuffer` изменяем, то есть вы можете обновлять, добавлять или удалять элементы `ListBuffer`.

Чтобы проиллюстрировать проблему ковариантности и изменчивости, предположим,
что `ListBuffer` ковариантен, тогда следующий проблемный пример скомпилируется (на самом деле он не компилируется):

{% tabs immutability_and_variance_2 %}
{% tab 'Scala 2 и 3' %}

```scala mdoc:fail
import scala.collection.mutable.ListBuffer

val bufInt: ListBuffer[Int] = ListBuffer[Int](1,2,3)
val bufAny: ListBuffer[Any] = bufInt
bufAny(0) = "Hello"
val firstElem: Int = bufInt(0)
```

{% endtab %}
{% endtabs %}

Если бы приведенный выше код был бы возможен, то вычисление `firstElem` завершилась бы ошибкой с `ClassCastException`,
потому что `bufInt(0)` теперь содержит `String`, а не `Int`.

Инвариантность `ListBuffer` означает, что `ListBuffer[Int]` не является подтипом `ListBuffer[Any]`,
несмотря на то, что `Int` является подтипом `Any`,
и поэтому `bufInt` не может быть присвоен в качестве значения `bufAny`.

### Сравнение с другими языками

В языках, похожих на Scala, разные способы поддержки вариантности.
Например, указания вариантности в Scala очень похожи на то, как это делается в C#,
где такие указания добавляются при объявлении абстракции класса (вариантность при объявлении).
Однако в Java, указание вариантности задается непосредственно при использовании абстракции класса (вариантность при использовании).

Тенденция Scala к неизменяемым типам делает ковариантные и контравариантные типы более распространенными,
чем в других языках, поскольку изменяемый универсальный тип должен быть инвариантным.
