---
layout: tour
title: Traits
partof: scala-tour

num: 5

language: th

next-page: tuples
previous-page: classes
topics: traits
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects
---

Trait ใช้เพื่อแชร์ interface และ field ระหว่างคลาส โดยที่ trait จะคล้ายกับ interface ใน Java 8\
คลาส และ object สามารถ extend trait ได้ แต่เราไม่สามารถสร้าง object จาก trait ได้\
ดังนั้น trait จึงไม่สามารถมี parameter เช่นเดียวกับที่คลาสมี

## การกำหนด Trait

วิธีที่ง่ายที่สุดในการกำหนด trait คือการประกาศด้วย keyword `trait` และ indentifier:

{% tabs trait-hair-color %}
{% tab 'Scala 2 and 3' for=trait-hair-color %}

```scala mdoc
trait HairColor
```

{% endtab %}
{% endtabs %}

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

การขยาย (extend) `trait Iterator[A]` ต้องมี implementation ของ method `hasNext` และ `next` ของ type `A`

## การใช้งาน Trait

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

คลาส `IntIterator` นี้รับค่า parameter `to` เพื่อกำหนดค่าสูงสุด (upper bound) โดยที่คลาส `IntIterator` ได้ extend จาก `Iterator[Int]`\
ดังนั้น method `next` จะต้อง return ค่าเป็น Int

## การใช้ Subtype

เมื่อจำเป็นต้องใช้ trait ใดๆ เราสามารถใช้ subtype (คลาสใดก็ตาม ที่ extend มาจาก trait นั้นๆ) แทนได้

> ***Note by Thai translator:***\
> "เมื่อจำเป็นต้องใช้ trait ใดๆ" ในที่นี้ น่าจะหมายถึงเรามีการระบุไว้ว่า parameter ที่ได้ระบุ type เป็น trait\
> ดังนั้นเราสามารถใช้ **subtype ใดๆ ที่ implement จาก trait นั้นๆ ได้**
>
> **ลองพิจารณา code นี้:**
>
> ```scala
>  val dog = new Dog("Harry") // คลาส `Dog` เป็น subtype ของ trait `Pet`
>
>  // parameter `pet` มี type เป็น trait `Pet`
>  def getPetName(pet: Pet): String = pet.name
>
>  getPetName(dog)
> ```
>
> ถ้าอิงจากตัวอย่างจาก code block ด้านล่าง เราจะเห็นได้ว่า code ด้านบน\
> เราส่งตัวแปร `dog` ซึ่งเป็น instance ของคลาส `Dog` ไปให้ function `getPetName`\
> โดยที่คลาส `Dog` ก็เป็น subtype ของ trait `Pet` อีกทีหนึ่ง

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

`trait Pet` มี abstract field `name` ซึ่ง implement ไว้ใน constructor ของคลาส `Cat` และ `Dog`\
ในบรรทัดสุดท้าย เราเรียกใช้ `pet.name` ซึ่งได้มีการ implement `name` ไว้ใน subtype ใดๆ ของ trait `Pet` แล้ว

## แหล่งข้อมูลเพิ่มเติม

* Learn more about traits in the [Scala Book](/scala3/book/domain-modeling-tools.html#traits)
* Use traits to define [Enum](/scala3/book/domain-modeling-fp.html#modeling-the-data)
