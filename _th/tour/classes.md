---
layout: tour
title: คลาส
partof: scala-tour

num: 4

language: th

next-page: traits
previous-page: unified-types
---

คลาสใน Scala เป็นพิมพ์เขียวสำหรับสร้าง object ในคลาสสามารถมี method, value, ตัวแปร, type, object, 
trait และคลาส ซึ่งเรียกรวมๆ กันว่า _members_ หรือ _สมาชิก_ ของคลาส type, object และ trait จะกล่าวถึงภายหลัง

## การกำหนดคลาส
วิธีการที่ง่ายที่สุดในการกำหนดคลาสด้วยการใช้ keyword `class` และ
identifier ชื่อของคลาสควรจะขึ้นต้นด้วยตัวพิมพ์ใหญ่
```scala mdoc
class User

val user1 = new User
```
keyword `new` ใช้เพื่อสร้าง instance ของคลาส `User` มี constructor เริ่มต้นซึ่งไม่รับค่า argument เพราะว่าไม่ได้กำหนด constructor ไว้ตอนประกาสคลาส 

อย่างไรก็ตาม, เราอาจจะมี constructor และ body ของคลาส
ตัวอย่างดังนี้ เป็นการประกาศคลาสสำหรับจุด (point):

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // พิมพ์ (2, 3)
```

คลาส `Point` นี้มีสมาชิก 4 ตัว คือ ตัวแปร `x` และ `y` และ method `move` และ `toString`
ไม่เหมือนภาษาอื่นๆ, ซึ่ง constructor หลักจะอยู่ใน class signature `(var x: Int, var y: Int)` 
method `move` รับ argument ชนิดตัวเลข 2 ตัว และ return เป็นค่า Unit `()` ซึ่งไม่มีค่า
จะมีผลลัพธ์คลายกับ `void` ในภาษาที่เหมือน Java, `toString` ในทางกลับกัน ไม่รับ argument ใดๆ แต่ return เป็นค่า `String` ซึ่งแทนที่ method `toString` จาก [`AnyRef`](unified-types.html) โดยจะมี keyword `override`

## Constructors

​Constructor สามารถมี parameter ตัวเลือกได้ โดยกำหนดค่าเริ่มต้นดังนี้:

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x and y are both set to 0
val point1 = new Point(1)
println(point1.x)  // พิมพ์ 1

```

ในคลาส `Point` ดังกล่าว `x` และ `y` มีค่าเริ่มต้นเป็น `0` ดังนั้นเราสามาถไม่ใส่ argument ก็ได้
อย่างไรก็ตาม เพราะว่า constructor อ่าน argument จากซ้ายไปขวา ถ้าเราต้องการใส่ค่าใน `y` ไปในคลาส
เราจำเป็นต้องระบุชื่อของ parameter ด้วย
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // พิมพ์ 2
```

นี้เป็นวิธีปฏิบัติที่ดีเพื่อจะทำให้โค้ดชัดเจนมากขึ้น

## Private Members และ Getter/Setter
สมาชิกของคลาสจะเป็น public โดยค่าเริ่มต้น ใช้ access modifier `private` 
เพื่อซ่อนสมาชิกนั้นจากภายนอกของคลาส
```scala mdoc:reset
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // พิมพ์คำเตือน warning
```
คลาส `Point` เวอร์ชันนี้ ข้อมูลจะถูกเก็บไว้ในตัวแปรชนิด private ที่ชื่อว่า `_x` และ `_y` และมี method ที่ชื่อว่า `def x` และ `def y` ทีจะใช้ในการเข้าถึงข้อมูล private เป็น getter, `def x_=` และ `def y=` 
เป็น method สำหรับตรวจสอบข้อมูลและ setting ค่าของตัวแปร `_x` และ `_y` 
สังเกตว่า syntax พิเศษนี้สำหรับ setter: คือ method ที่ตามด้วย `_=` ไปยังตัวระบุของ setter และ parameter ตามหลังมา

constructor หลักกำหนด parameter ด้วย `val` และ `var` เป็น public อย่างไรก็ตามเพราะว่า `val` เป็นตัวแปรที่เปลี่ยนแปลงไม่ได้ (immutable) เราไม่สามารถเขียบแบบนี้ได้
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- ตรงนี้ไม่ compile
```

parameter ที่ไม่มี `val` หรือ `var` เป็นค่า private จะมองเห็นได้เพียงข้างในคลาส
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- ตรงนี้ไม่ compile
```
