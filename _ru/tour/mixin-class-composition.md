---
layout: tour
title:  Композиция классов с примесями

discourse: true

partof: scala-tour

num: 7
language: ru
next-page: higher-order-functions
previous-page: tuples
prerequisite-knowledge: inheritance, traits, abstract-classes, unified-types

---
Примеси (Mixin) - это трейты, которые используются для создания класса.

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
У класса `D` есть суперкласс `B` и примесь `C`. Классы могут иметь только один суперкласс, но много примесей (используя ключевыое слово `extends` и `with` соответственно). Примеси и суперкласс могут иметь один и тот же супертип.

Теперь давайте рассмотрим более интересный пример, начиная с абстрактного класса:

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```
Класс имеет абстрактный тип `T` и методы стандартного итератора.

Далее создаем конкретную реализацию класса (все абстрактные члены `T`, `hasNext`, и `next` должны быть реализованы):

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
`StringIterator` принимает `String` и может быть использован для обхода по строке (например, чтоб проверить содержит ли строка определенный символ).

Теперь давайте создадим трейт который тоже наследуется от `AbsIterator`.

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```
У этого трейта реализован метод `foreach` который постоянно вызывает переданную ему функцию `f: T => Unit` на каждом новом элементе (`next()`) до тех пор пока в итераторе содержатся элементы (`while (hasNext)`). Поскольку `RichIterator` это трейт, ему не нужно реализовывать членов абстрактного класса `AbsIterator`.

Мы бы хотели объединить функциональность `StringIterator` и `RichIterator` в один класс. 

```scala mdoc
object StringIteratorTest extends App {
  class RichStringIter extends StringIterator("Scala") with RichIterator
  val richStringIter = new RichStringIter
  richStringIter foreach println
}
```
Новый класс `RichStringIter` включает `StringIterator` как суперкласс и `RichIterator` как примесь. 

Используя только одиночное наследование мы бы не могли добиться того же уровня гибкости. 
