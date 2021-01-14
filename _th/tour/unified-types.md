---
layout: tour
title: ชนิดข้อมูล
partof: scala-tour

num: 3

language: th

next-page: classes
previous-page: basics
---

ใน Scala, value ทั้งหมดมี type รวมทั้ง value ที่เป็นตัวเลขและ function ในแผนภาพด้านล่างแสดงให้เห็นโครงสร้างของ type ใน Scala

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="Scala Type Hierarchy"></a>

## โครงสร้างของ Type ใน Scala ##

[`Any`](https://www.scala-lang.org/api/2.12.1/scala/Any.html) เป็น supertype ของ type ทั้งหมด และยังเรียกว่า type บนสุด มันจะกำหนด method ที่ใช้งานร่วมกันอย่างเช่น `equals`, `hashCode` และ `toString` ซึ่ง `Any` มี subclass โดยตรง 2 subclass คือ `AnyVal` และ `AnyRef`

`AnyVal` แทน value type หรือชนิดข้อมูลที่มีค่า ซึ่งมี 9 value type และเป็นค่าที่ไม่สามารถเป็น null (non-nullable): `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit` และ `Boolean` ซึ่ง `Unit` เป็น value type ที่แทนค่าที่ไม่มีข้อมูล โดยที่มีหนึ่งค่า instance ของ `Unit` ซึ่งสามารถประกาศด้วย `()` ทุก function จำเป็นต้องมีการ return บางสิ่งบางอย่าง ซึ่งก็ `Unit` ก็เป็นค่าที่ใช้เป็น return type

`AnyREf` แทน reference type หรือชนิดข้อมูลที่ใช้อ้างอิง ทั้งหมดของ type ที่ไม่มี value จะเป็น reference type ทุกๆ type ที่ผู้ใช้งานกำหนด (user-defined) ใน Scal เป็น subtype ของ `AnyRef` ใน Scala ถูกใช้ในบริบทของ Java runtime environment ซึ่ง `AnyRef` จะสอดคล้องกับ `java.lang.Object` ใน Java

นี่เป็นตัวอย่างที่แสดงให้เห็นการใช้งาน string, integer, charecter, boolean value และ function เป็น object ทั้งหมดที่เหมือนกับ obejct อื่น:

```scala mdoc
val list: List[Any] = List(
  "a string",
  732,  // an integer
  'c',  // a character
  true, // a boolean value
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```

จะกำหนดตัวแปร `list` ของ type `List[Any]` ซึ่งเป็น list ที่สร้างขึ้นด้วยองค์ประกอบของหลายๆ type แต่ว่าทั้งหมดจะเป็น instance ของ `scala.Any` ดังนั้นเราสามารถเพิ่มมันเข้าไปใน list ได้

นี่เป็น output ของโปรแกรม:

```
a string
732
c
true
<function>
```

## การแปลง Type
Value type สามารถแปลได้ด้วยวิธีดังนี้:
<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

ตัวอย่างเช่น:

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (หมายเหตุว่าค่าความละเอียดจะสูญหายไปในกรณีนี้)

val face: Char = '☺'
val number: Int = face  // 9786
```

การแปลงค่าทิศทางเดียว ซึ่งตังอย่างเหล่านี้จะไม่ compile และจะฟ้อง error:

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // ไม่เป็นไปตามที่ต้องการ
```

เราสามารถแปลง reference type ไปเป็น subtype ได้ โดยจะครอบคลุมในภายหลัง

## Nothing และ Null
`Nothing` เป็น subtype ของ value type ทั้งหมด และยังเรียกว่าเป็น type ล่างสุด ค่าที่ไม่มีค่าจะเป็น type `Nothing` ส่วนมากจะใช้ในกรณี single non-termination อย่างเช่น throw exception, program exit หรือ infinite loop (นั้นคือ มันเป็น type ของ expression ที่ไม่มีการประเมินค่าของ value หรือ method ที่ไม่มีการ return ค่าในแบบปรกติ)

`Null` เป็น subtype ของ reference type ทั้งหมด (นั้นคือ เป็น subtype ของ AnyRef) มันมีการระบุ value เดียวด้วย keyword `null` ซึ่ง `Null` ใช้ส่วนใหญ่สำหรับการทำงานร่วมกันกับภาษา JVM และไม่ควรใช้ในโค้ดของ Scala เราจะครอบคลุมวิธีการอื่นแทน `null` ในภายหลัง
