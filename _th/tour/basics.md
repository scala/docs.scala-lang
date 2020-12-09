---
layout: tour
title: พื้นฐาน
partof: scala-tour

num: 2
language: th

next-page: unified-types
previous-page: tour-of-scala
---

ในหน้านี้ เราจะครอบคลุมพื้นฐานของ Scala
In this page, we will cover basics of Scala.

## ทดลอง Scala ในเว็บบราวเซอร์

เราสามารถรัน Scala ในเว็บเบราว์เซอร์ด้วย ScalaFiddle

1. ไปที่ [https://scalafiddle.io](https://scalafiddle.io).
2. วาง `println("Hello, world!")` ในด้านซ้าย.
3. กดที่ปุ่ม "Run" . output จะแสดงในด้านขวา

ในขั้นตอนนี้ง่ายมาก ที่จะได้ประสบการณ์ของเรากับ Scala

หลายๆ โค้ดตัวอย่างในเอกสารนี้จะฝังใน ScalaFiddle ซึ่งคุณสามารถกดที่ปุ่ม Run เพื่อดูว่าโด้นนั้นๆ จะได้ผลลัพธ์อย่างไร

## Expressions

Expression หรือ นิพจน์ เป็นโค้ดที่ทำการคำนวนได้
```scala mdoc
1 + 1
```
เราสามารถแสดงผลลัพธ์ของ Expression ด้วยการใช้ `println`

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Values

เราสามารถตั้งชื่อของผลลัพธ์ของ expression ด้วย keyword `val`

```scala mdoc
val x = 1 + 1
println(x) // 2
```

ตั้งชื่อผลลัพธ์ อย่างเช่น `x` จะเรียก value การอ้างอิง value จะไม่มีการคำนวณอีกครั้ง

Value ไม่สามารถกำหนดค่าใหม่ได้

```scala mdoc:fail
x = 3 // ตรงนี้ไม่ compile.
```

type (ชนิด) ของ value สามารถ inferred (อนุมาน) ได้ แต่เราสามารถกำหนดชนิดของ type อย่างชัดเจนได้ แบบนี้

```scala mdoc:nest
val x: Int = 1 + 1
```

สังเกตว่า การประกาศชนิดของ type `Int` จะระบุหลังจาก indentifier `x` เราจำเป็นต้องมี `:`

### Variables

ตัวแปรเหมือนกับ value ยกเว้นแต่ว่าเราสามารถกำหนดค่าใหม่ได้ เราสามารถกำหนดตัวแปรด้วย keyword `var`

```scala mdoc:nest
var x = 1 + 1
x = 3 // ตรงนี้ compile เพราะว่า "x" ถูกประกาศด้วย keyword "var"
println(x * x) // 9
```

เราสามารถกำหนด type ได้ตามที่เราต้องการ:

```scala mdoc:nest
var x: Int = 1 + 1
```


## Blocks

เราสามารถรวมหลายๆ expression ไว้ด้วยกันด้วยการครอบด้วย `{}` เรียกมันว่า block

ผลลัพธ์ของ expression สุดท้ายใน block จะเป็นผลลัพธ์ของ block ทั้งหมดด้วย

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Functions

function เป็น expression ที่รับ parameter ได้

เราสามารถกำหนด anonymous function (เป็น function ที่ไม่มีชื่อ) ที่ return ค่าตัวเลขบวกหนึ่ง:

```scala mdoc
(x: Int) => x + 1
```

ในด้านซ้ายของ `=>` คือรายการของ parameter ในด้านขวาเป็น expression ที่นำ parameter มาใช้

เราสามารถตั้งชื่อของ function ได้ดังนี้

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

function สามารถรับ parameter ได้หลายตัว

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

หรือ เราจะไม่รับ parameter เลยก็ได้

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Methods

Method มีลักษณะเหมือนกับ function มาก แต่ว่าจะมีบางสิ่งที่แตกต่างกันระหว่าง method และ function

Method จะประกาศได้ด้วย keyword `def` ตามด้วยชื่อของ function, รายการ parameter, return type และ body ของ function

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

สังเกตว่า การ return type จะประกาศ _หลังจาก_ รายการ parameter และ colon `: Int`

Method ยังสามารถรับรายการ parameter ได้หลายรายการ

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

หรือ ไม่มีรายการ parameter เลยก็ได้ อย่างเช่น

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

และยังมีบางสิ่งที่แตกต่างกัน แต่ตอนนี้เราจะคิดว่า method มีความเหมือนกับ function

Method สามารถมี expression ได้หลายบรรทัด

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

expression สุดท้ายใน body เป็น expression ที่ return value ของ method (Scala ก็มี keyword `return` แต่ว่าไม่ค่อยได้ใช้)

## Classes

เราสามารถประกาศ class ได้ด้วย keyword `class` ตามด้วยชื่อของ class และ constructor parameters

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
return type ของ method `greet` เป็น `Unit` ซึ่งอาจจะกล่าวได้ว่าไม่มีการ return มันใช้เหมือน `void` ใน Java และ C (ความแตกต่างคือทุกๆ expression ของ Scala จำเป็นต้องมีค่า ซึ่งเป็น singleton vlaue จริงๆ ของ Unit เขียนด้วย () ซึ่งไม่มีข้อมูลใดๆ)

เราสามารถสร้าง instance ของ class ได้ด้วย keyword `new`

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

เราจะครอบคลุมเรื่องของ class ในเชิงลึก [ภายหลัง](classes.html)

## Case Classes

Scala มี type ชนิดพิเศษของ class เรียกว่า "case" class โดยเริ่มต้นแล้ว case class เป็นค่าที่เปลี่ยนแปลงไม่ได้ (immutable) และสามารถเปลียบเทียบด้วย value เราสามารถประกาศ case class ด้วย keyword `case class`

```scala mdoc
case class Point(x: Int, y: Int)
```

เราสามารถสร้าง instant ของ case class โดยไม่ต้องใช้ keyword `new`

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

และสามารถเปรียบเทียบค่าของ case class ได้

```scala mdoc
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) and Point(2,2) are different.
```

เป็นตัวอย่างการใช้งานของ case class ที่เราอยากจะแนะนำ และอยากให้คุณตกหลุมรักมัน เราจะครอบคลุมในเชิงชึกใน [ภายหลัง](case-classes.html)

## Objects

Object เป็น instance เดี่ยวของ definition ของมัน เราสามารถคิดว่ามันเป็น singleton ของ class ที่มันเป็นเจ้าของ

เราสามารถประกาศ object ได้ด้วย keyword `object`

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

เราสามารถเข้าถึง object ด้วยการอ้างอิงถึงชื่อของมัน

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

เราจะครอบคลุมในเชิงลึกใน [ภายหลัง](singleton-objects.html)

## Traits

Trait เป็น type ที่บรรจุ field และ method ที่แน่นอน เราสามารถรวม trait หลายๆ trait เข้าด้วยกันได้

เราสามารถประกาศ trait ได้ด้วย keyword `trait`

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

Trait สามารถมี default implementation ได้

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

เราสามารถขยาย traint ได้ด้วย keyword `extents` และ overrid implementation ด้วย keyword `override`

```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

จากตัวอย่างนี้ `defaultGreeter` ขยายเพียง trait เดียว แต่มันสามารถขยายหลาย trait

เราจะครอบคลุมในเชิงลึกใน [ภายหลัง](traits.html)

## Main Method

main method เป็น entry point หรือจุดเริ่มต้นของโปรแกรม ใน ​Java Virtual Machine 
ต้องการ main method ชื่อว่า `main` และสามารถรับ argument ที่เป็น array ของ string

ใช้ object เราสามารถประกาศ main method ได้ดังนี้:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
