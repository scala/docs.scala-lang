---
layout: tour
title: Named Arguments
partof: scala-tour

num: 32

language: th

next-page: packages-and-imports
previous-page: default-parameter-values
---

เมื่อเราเรียกใช้ method แล้วเราสามารถระบุชื่อ argument (label the argument) สำหรับ parameter ใดๆ ได้ดังนี้:

{% tabs named-arguments-when-good %}

{% tab 'Scala 2 and 3' for=named-arguments-when-good %}

```scala mdoc
def printName(first: String, last: String): Unit =
  println(s"$first $last")

printName("John", "Public")  // แสดงค่า "John Public"
printName(first = "John", last = "Public")  // แสดงค่า "John Public"
printName(last = "Public", first = "John")  // แสดงค่า "John Public"
printName("Elton", last = "John")  // แสดงค่า "Elton John"
```

{% endtab %}

{% endtabs %}

named argument นั้นมีประโยชน์เมื่อ parameter 2 ตัวมี type เดียวกัน\
ทำให้ argument ที่เราส่งไปให้ function อาจถูกสลับกันโดยไม่ได้ตั้งใจ

สังเกตว่าเราจะเขียน argument ที่ระบุชื่อในลำดับใดก็ได้\
แต่ถ้า argument ไม่ได้อยู่ในลำดับของ parameter ใน function จากซ้ายไปขวา แล้ว argument ที่เหลือจะต้องระบุชื่อทั้งหมด

ในตัวอย่างข้างล่างนี้ named argument ทำให้เราสามารถเว้น parameter `middle` ได้\
แต่ในกรณีที่เกิด error เนื่องจาก argument ตัวแรกอยู่นอกลำดับของ parameter (ตัวแรกไม่ใช่ parameter `first`)\
ดังนั้น เราจะต้องระบุชื่อ argument ตั้งแต่ตัวที่ 2 เป็นต้นไป

{% tabs named-arguments-when-error %}

{% tab 'Scala 2 and 3' for=named-arguments-when-error %}

```scala mdoc:fail
def printFullName(first: String, middle: String = "Q.", last: String): Unit =
  println(s"$first $middle $last")

printFullName(first = "John", last = "Public")  // แสดงค่า "John Q. Public"
printFullName("John", last = "Public")  // แสดงค่า "John Q. Public"
printFullName("John", middle = "Quincy", "Public")  // แสดงค่า "John Quincy Public"
printFullName(last = "Public", first = "John")  // แสดงค่า "John Q. Public"
printFullName(last = "Public", "John")  // error: positional after named argument
```

{% endtab %}

{% endtabs %}

เราสามารถใช้ Named Argument กับการเรียกใช้ method ของ Java ได้\
แต่ทำได้เฉพาะในกรณีที่ Java library นั้นถูกคอมไพล์ด้วยออพชั่น `-parameters` เท่านั้น
