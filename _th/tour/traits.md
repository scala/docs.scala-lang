---
layout: tour
title: Traits
partof: scala-tour

num: 5

language: th

next-page: tuples
previous-page: classes
---

Trait ใช้เพื่อแชร์ interface และ field ระหว่างคลาส มันจะเหมือนกับ interface ใน Java 8
คลาส และ object สามารถขยาย trait ได้แต่ trait ไม่สามารถ instant เป็น object และไม่สามารถมี parameter ได้

## การกำหนด trait
วิธีที่ง่ายที่สุดในการกำหนด trait คือการประกาศด้วย keyword `trait` และ indentifier:

```scala mdoc
trait HairColor
```
trait จะมีประโยชน์อย่างยิ่งด้วยการเป็น generic type และเป็น abstract method
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

การขยาย `trait Iterator[A]` ต้องการ type `A` และ implementation ของ method `hasNext` และ `next`

## การใช้ traits
ใช้ keyword `extends` เพื่อขยาย trait ดังนั้นจะ implement abstract member ใดๆ ของ trait โดยใช้ keyword `override`:
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
คลาส `IntIterator` นี้รับค่า parameter `to` เป็น upper bound มัน `extends Iterator[Int]` ซึ่งหมายความว่า method `next` จะต้อง return เป็น Int

## Subtyping
ในเมื่อ trait ที่ให้มานั้น required, subtype ของ trait สามารถถูกใช้แทนที่ได้
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
animals.foreach(pet => println(pet.name))  // พิมพ์ Harry Sally
```
`trait Pet` มี abstract field `name` ซึ่ง implement โดย Cat และ Dog ใน constructor ของมัน 
ในบรรทัดสุดท้าย เราเรียก `pet.name` ซึ่งจะต้องถูก implement แล้วใน subtype ใดๆ ของ trait `Pet`
