---
layout: tour
title: Трейты
partof: scala-tour
num: 5
language: ru
next-page: tuples
previous-page: named-arguments
topics: traits
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects
---

Трейты (Traits) используются, чтобы обмениваться между классами информацией о структуре и полях. Они похожи на интерфейсы из Java 8. Классы и объекты могут расширять трейты, но трейты не могут быть созданы и поэтому не имеют параметров.

## Объявление трейта

Минимальное объявление трейта - это просто ключевое слово `trait` и его имя:

{% tabs trait-hair-color %}
{% tab 'Scala 2 и 3' for=trait-hair-color %}

```scala mdoc
trait HairColor
```

{% endtab %}
{% endtabs %}

Трейты наиболее полезны в качестве обобщенного типа с абстрактными методами.

{% tabs trait-iterator-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-iterator-definition %}

```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

{% endtab %}

{% tab 'Scala 3' for=trait-iterator-definition %}

```scala
trait Iterator[A]:
  def hasNext: Boolean
  def next(): A
```

{% endtab %}

{% endtabs %}

При наследовании от трейта `Iterator[A]` требует указание типа `A` а также реализация методов `hasNext` и `next`.

## Использование трейтов

Чтобы использовать трейты, необходимо наследовать класс от него, используя ключевое слово `extends`. Затем необходимо реализовать все абстрактные члены трейта, используя ключевое слово `override`:

{% tabs trait-intiterator-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-intiterator-definition %}

```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int = {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}

val iterator = new IntIterator(10)
iterator.next()  // вернет 0
iterator.next()  // вернет 1
```

{% endtab %}

{% tab 'Scala 3' for=trait-intiterator-definition %}

```scala
trait Iterator[A]:
  def hasNext: Boolean
  def next(): A

class IntIterator(to: Int) extends Iterator[Int]:
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int =
    if hasNext then
      val t = current
      current += 1
      t
    else
      0
end IntIterator

val iterator = new IntIterator(10)
iterator.next()  // вернет 0
iterator.next()  // вернет 1
```

{% endtab %}

{% endtabs %}

Этот класс `IntIterator` использует параметр `to` в качестве верхней границы. Он наследуется от `Iterator[Int]`, что означает, что метод `next` должен возвращать Int.

## Подтипы

Туда, где требуется определенный тип трейта, мы можем передавать любой наследованный от требуемого трейта класс

{% tabs trait-pet-example class=tabs-scala-version %}

{% tab 'Scala 2' for=trait-pet-example %}

```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // выведет "Harry" и "Sally"
```

{% endtab %}

{% tab 'Scala 3' for=trait-pet-example %}

```scala
import scala.collection.mutable.ArrayBuffer

trait Pet:
  val name: String

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = Dog("Harry")
val cat = Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // выведет "Harry" и "Sally"
```

{% endtab %}

{% endtabs %}

У трейта `Pet` есть абстрактное поле `name`, которое реализовано в классах `Cat` and `Dog`. В последней строке мы вызываем `pet.name`, который должен быть реализован в любом подтипе, унаследованном от трейта `Pet`.

## Дополнительные ресурсы

- Узнайте больше о трейтах в [Scala Book](/ru/scala3/book/domain-modeling-tools.html#трейты)
- Использование трейтов для определения [Enum](/ru/scala3/book/domain-modeling-fp.html#моделирование-данных)
