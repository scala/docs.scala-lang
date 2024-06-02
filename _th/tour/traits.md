---
layout: tour
title: Traits
partof: scala-tour

num: 5

language: th

next-page: tuples
previous-page: classes
---

Trait ใช้เพื่อแชร์ interface และ field ระหว่างคลาส มันจะคล้ายกับ interface ใน Java 8
คลาส และ object สามารถ extend trait ได้ แต่ trait ไม่สามารถสร้างเป็น object ได้ ดังนั้น trait จึงไม่สามารถมี parameter เช่นเดียวกับคลาส

## การกำหนด trait

วิธีที่ง่ายที่สุดในการกำหนด trait คือการประกาศด้วย keyword `trait` และ indentifier:

{% tabs trait-hair-color %} {% tab 'Scala 2 and 3' for=trait-hair-color %}

```scala mdoc
trait HairColor
```

{% endtab %} {% endtabs %}

trait จะมีประโยชน์อย่างยิ่งด้วยการเป็น generic type และเป็น abstract method

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

การขยาย (extend) `trait Iterator[A]` ต้องการ type `A` และ implementation ของ method `hasNext` และ `next`

## การใช้ traits

ใช้ keyword `extends` เพื่อขยาย trait จากนั้นให้ implement abstract member ใดๆ ของ trait โดยใช้ keyword `override`:

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
  override def next(): Int =  {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
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
iterator.next()  // returns 0
iterator.next()  // returns 1
```

{% endtab %}

{% endtabs %}

คลาส `IntIterator` นี้รับค่า parameter `to` เพื่อกำหนดค่าสูงสุด (upper bound) โดยที่คลาส `IntIterator` ได้ extend จาก `Iterator[Int]` ดังนั้น method `next` จะต้อง return ค่าเป็น Int

## Subtyping

ในเมื่อ trait ที่ให้มานั้น required, subtype ของ trait สามารถถูกใช้แทนที่ได้

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
animals.foreach(pet => println(pet.name))  // แสดงค่า Harry Sally
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
animals.foreach(pet => println(pet.name))  // แสดงค่า Harry Sally
```

{% endtab %}

{% endtabs %}

`trait Pet` มี abstract field `name` ซึ่ง implement ด้วย Cat และ Dog ใน constructor ของมัน
ในบรรทัดสุดท้าย เราเรียกใช้ `pet.name` ซึ่งใน subtype ใดๆ ของ trait `Pet` (ในที่นี้คือ `Cat`, และ `Dog`) ได้ implement field `name` ไว้แล้ว
