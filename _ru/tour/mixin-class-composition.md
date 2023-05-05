---
layout: tour
title: Композиция классов с примесями
partof: scala-tour
num: 7
language: ru
next-page: higher-order-functions
previous-page: tuples
prerequisite-knowledge: inheritance, traits, abstract-classes, unified-types
---

Примеси (Mixin) - это трейты, которые используются для создания класса.

{% tabs mixin-first-exemple class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-first-exemple %}

```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "I'm an instance of class B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```

У класса `D` есть суперкласс `B` и трейт `C`.
Классы могут иметь только один суперкласс, но много трейтов (используя ключевое слово `extends` и `with` соответственно).
Трейты и суперкласс могут иметь один и тот же супертип.

{% endtab %}

{% tab 'Scala 3' for=mixin-first-exemple %}

```scala
abstract class A:
  val message: String
class B extends A:
  val message = "I'm an instance of class B"
trait C extends A:
  def loudMessage = message.toUpperCase()
class D extends B, C

val d = D()
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```

У класса `D` есть суперкласс `B` и трейт `C`.
Классы могут иметь только один суперкласс, но много трейтов
(используя ключевое слово `extends` и разделитель `,` соответственно).
Трейты и суперкласс могут иметь один и тот же супертип.

{% endtab %}

{% endtabs %}

Теперь давайте рассмотрим более интересный пример, начиная с абстрактного класса:

{% tabs mixin-abstract-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-abstract-iterator %}

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

{% endtab %}

{% tab 'Scala 3' for=mixin-abstract-iterator %}

```scala
abstract class AbsIterator:
  type T
  def hasNext: Boolean
  def next(): T
```

{% endtab %}

{% endtabs %}

Класс имеет абстрактный тип `T` и методы стандартного итератора.

Далее создаем конкретную реализацию класса (все абстрактные члены `T`, `hasNext`, и `next` должны быть реализованы):

{% tabs mixin-concrete-string-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-concrete-string-iterator %}

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```

{% endtab %}

{% tab 'Scala 3' for=mixin-concrete-string-iterator %}

```scala
class StringIterator(s: String) extends AbsIterator:
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() =
    val ch = s charAt i
    i += 1
    ch
```

{% endtab %}

{% endtabs %}

`StringIterator` принимает `String` и может быть использован для обхода по строке (например, чтоб проверить содержит ли строка определенный символ).

Теперь давайте создадим трейт который тоже наследуется от `AbsIterator`.

{% tabs mixin-extended-abstract-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-extended-abstract-iterator %}

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```

У этого трейта реализован метод `foreach`, который постоянно вызывает переданную ему функцию `f: T => Unit`
на каждом новом элементе (`next()`) до тех пор пока в итераторе содержатся элементы (`while (hasNext)`).
Поскольку `RichIterator` - это трейт, ему не нужно реализовывать элементы абстрактного класса `AbsIterator`.

{% endtab %}

{% tab 'Scala 3' for=mixin-extended-abstract-iterator %}

```scala
trait RichIterator extends AbsIterator:
  def foreach(f: T => Unit): Unit = while hasNext do f(next())
```

У этого трейта реализован метод `foreach`, который постоянно вызывает переданную ему функцию `f: T => Unit`
на каждом новом элементе (`next()`) до тех пор пока в итераторе содержатся элементы (`while hasNext`).
Поскольку `RichIterator` - это трейт, ему не нужно реализовывать элементы абстрактного класса `AbsIterator`.

{% endtab %}

{% endtabs %}

Мы бы хотели объединить функциональность `StringIterator` и `RichIterator` в один класс.

{% tabs mixin-combination-class class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-combination-class %}

```scala mdoc
class RichStringIter extends StringIterator("Scala") with RichIterator
val richStringIter = new RichStringIter
richStringIter.foreach(println)
```

{% endtab %}

{% tab 'Scala 3' for=mixin-combination-class %}

```scala
class RichStringIter extends StringIterator("Scala"), RichIterator
val richStringIter = RichStringIter()
richStringIter.foreach(println)
```

{% endtab %}

{% endtabs %}

Новый класс `RichStringIter` включает `StringIterator` как суперкласс и `RichIterator` как примесь.

Используя только одиночное наследование мы бы не смогли добиться того же уровня гибкости.
