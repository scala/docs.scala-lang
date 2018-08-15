---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Brendan O'Connor
about: ขอบคุณ <a href="http://brenocon.com/">Brendan O'Connor</a>, สำหรับ cheatsheet นี้มีวัตถุประสงค์เพื่ออ้างอิงอย่างง่ายสำหรับโครงสร้างประโยคของ Scala, Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

language: "th"
---

###### Contributed by {{ page.by }}

{{ page.about }}

|  <span id="variables" class="h2">ตัวแปร</span>                                                                     |                      |
|  `var x = 5`                                                                                                      |  ค่าตัวแปร             |
|  <span class="label success">Good</span><br> `val x = 5`<br> <span class="label important">Bad</span><br> `x=6`   |  ค่าคงที่               |
|  `var x: Double = 5`                                                                                              |  type ที่ชัดเจน         |
|  <span id="functions" class="h2">ฟังก์ชัน</span>                                                                 |                      |
|  <span class="label success">Good</span><br> `def f(x: Int) = { x*x }`<br> <span class="label important">Bad</span><br> `def f(x: Int)   { x*x }`   |  กำหนดฟังก์ชัน <br> ซ้อนความผิดพลาด : ไม่มีการ return Unit ของฟังก์ชัน;<br> เป็นสาเหตุให้เกิดข้อผิดพลาดได้ |
|  <span class="label success">Good</span><br> `def f(x: Any) = println(x)`<br> <span class="label important">Bad</span><br> `def f(x) = println(x)`  |  กำหนดฟังก์ชัน <br> ไวยกรณ์ผิดพลาด : จำเป็นต้องกำหนดค่าสำหรับทุกๆ arg |
|  `type R = Double`                                                                                       |  นามแฝงของ type                                                               |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  call-by-value <br> call-by-name (lazy parameters)                |
|  `(x:R) => x*x`                                                                                          |  ฟังก์ชันที่ไม่ระบุชื่อ                                                                |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  ฟังก์ชันที่ไม่ระบุชื่อ : ตำแหน่งของขีดล่างตรงกับตำแหน่งของ arg  |
|  `(1 to 5).map( x => x*x )`                                                                              |  ฟังก์ชันที่ไม่ระบุชื่อ : เพื่อใช้ arg สองครั้งต้องตั้งชื่อ |
|  <span class="label success">Good</span><br> `(1 to 5).map(2*)`<br> <span class="label important">Bad</span><br> `(1 to 5).map(*2)` |  ฟังก์ชันที่ไม่ระบุชื่อ : เชื่อม infix method ใช้  `2*_`. แทน  |
|  `(1 to 5).map { x => val y=x*2; println(y); y }`                                                        |  ฟังก์ชันที่ไม่ระบุชื่อ : block style จะ return ส่วนสุดท้าย |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  ฟังก์ชันที่ไม่ระบุชื่อ : pipeline style. (หรือวงเล็บด้วย). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  ฟังก์ชันที่ไม่ระบุชื่อ : เพื่อส่งค่าหลาย block จะต้องใส่วงเล็บด้านนอก |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  currying, ไวยกรณ์ที่ชัดเจน |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  currying, ไวยกรณ์ที่ชัดเจน |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  currying, ไวยกรณ์ sugar, แต่ในกรณีนี้  |
|  `val normer = zscore(7, 0.4) _`                                                                         |  จะต้องต่อท้ายด้วยขีดล่างเพื่อเอาบางส่วน, เวอร์ชัน sugar เท่านั้น |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  type ทั่วไป  |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  ฝัง sugar  |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  ตัวแปรที่มีความยาว  |
|  <span id="packages" class="h2">แพคเกจ</span>                                                            |                 |
|  `import scala.collection._`                                                                             |  import ทั้งหมด   |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  เลือก import  |
|  `import scala.collection.{Vector => Vec28}`                                                             |  เปลี่ยนชื่อ import  |
|  `import java.util.{Date => _, _}`                                                                       |  import ทั้งหมดจาก java.util ยกเว้น Date  |
|  `package pkg` ที่เริ่มต้นของไฟล์ <br> `package pkg { ... }`                                                   |  ประกาศแพคเกจ  |
|  <span id="data_structures" class="h2">โครงสร้างข้อมูล</span>                                               |               |
|  `(1,2,3)`                                                                                               |  การเขียน tuple  |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  การผูกโครงสร้างข้อมูลใหม่ : ด้วยรูปแบบการจับคู่  |
|  <span class="label important">Bad</span><br>`var x,y,z = (1,2,3)`                                       |  ซ้อนความผิดพลาด : เป็นการแทนค่าทั้ง tuple |
|  `var xs = List(1,2,3)`                                                                                  |  list (แก้ไขไม่ได้) |
|  `xs(2)`                                                                                                 |  ระบุตำแหน่งด้วยวงเล็บ  |
|  `1 :: List(2,3)`                                                                                        |   |
|  `1 to 5` _เหมือนกับ_ `1 until 6` <br> `1 to 10 by 2`                                                      |  ระยะ sugar |
|  `()` _(วงเล็บว่าง)_                                                                                       |  สมาชิกเดียวของ Unit type (เหมือน void ใน C++/Java) |
|  <span id="control_constructs" class="h2">โครงสร้างควบคุม</span>                                           |                  |
|  `if (check) happy else sad`                                                                             |  เงื่อนไข |
|  `if (check) happy` _เหมือนกับ_ <br> `if (check) happy else ()`                                            |  เงื่อนไข sugar |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  ทำซ้ำ while |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  ทำซ้ำ do while |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  หยุด [(slides)](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21) |
|  `for (x <- xs if x%2 == 0) yield x*10` <br> _เหมือนกับ_ <br>`xs.filter(_%2 == 0).map(_*10)`               |  ทำความเข้าใจ for : filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` <br> _เหมือนกับ_ <br>`(xs zip ys) map { case (x,y) => x*y }`         |  ทำความเข้าใจ for : การเชื่อมโยงโครงสร้างใหม่ |
|  `for (x <- xs; y <- ys) yield x*y` <br>  _เหมือนกับ_ <br>`xs flatMap {x => ys map {y => x*y}}`            |  ทำความเข้าใจ for : ข้ามผลคูณ |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`            |  ทำความเข้าใจ for : คำอธิบายประเภทจำเป็น  [sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  ทำความเข้าใจ for : ทำซ้ำโดยรวมขอบเขตบน |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  ทำความเข้าใจ for : ทำซ้ำโดยละเว้นขอบเขตบน |
|  <span id="pattern_matching" class="h2">จับคู่รูปแบบ</span>                                                  |                 |
|  <span class="label success">Good</span><br> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Bad</span><br> `(xs zip ys) map( (x,y) => x*y )` |  ใช้ case ใน arg ของฟังก์ชันสำหรับ จับคู่รูปแบบ (pattern maching) |
|  <span class="label important">Bad</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}`     |  "v42" ถูกตีความว่าเป็นชื่อที่ตรงกับค่า Int และพิมพ์ "42" |
|  <span class="label success">Good</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`    |  "v42" กับ backticks ถูกตีความว่าเป็น v42 val ที่มีอยู่และ<br>พิมพ์ "Not 42" |
|  <span class="label success">Good</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  UppercaseVal ถือว่าเป็น val ที่มีอยู่ไม่ใช่ตัวแปรรูปแบบใหม่<br> เพราะมันเริ่มต้นด้วยตัวอักษรตัวพิมพ์ใหญ่ ดังนั้นค่าที่มีอยู่ใน <br>UppercaseVal จะถูกตรวจสอบเทียบกับ 3 และพิมพ์ "Not 42" |
|  <span id="object_orientation" class="h2">การใช้งาน object</span>                                         |                 |
|  `class C(x: R)` _เหมือนกับ_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  ตัวสร้างพารามิเตอร์ - x มีเฉพาะในคลาส body เท่านั้น |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  ตัวสร้างพารามิเตอร์ - กำหนดสมาชิกสาธารณะโดยอัตโนมัติ |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`| ตัวสร้างเป็นคลาส body<br> ประกาศเป็นสมาชิกสาธารณะ<br> ประกาศสมาชิก get ค่าได้ แต่ set ค่าไม่ได้<br> ประกาศเป็นสมาชิกส่วนตัว<br> ตัวสร้างอื่นๆ |
|  `new{ ... }`                                                                                            |  คลาสที่ไม่ระบุตัวตน |
|  `abstract class D { ... }`                                                                              |  กำหนดคลาสนามธรรม (ไม่สามารถสร้างได้) |
|  `class C extends D { ... }`                                                                             |  กำหนดคลาสที่สืบทอดมา |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  การสืบทอดและตัวสร้างพารามิเตอร์ (สิ่งที่อยากได้:<br> โดยอัตโนมัติจะส่งพารามิเตอร์ขึ้นโดยอัตโนมัติ) |
|  `object O extends D { ... }`                                                                            |  กำหนด singleton (เหมือนโมดูล) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  traits<br> อินเตอร์เฟซที่มีการดำเนินการ ไม่มีพารามิเตอร์ของตัวสร้าง mixin-able |
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  หลาย traits |
|  `class C extends D { override def f = ...}`	                                                           |  ต้องประกาศ method override |
|  `new java.io.File("f")`                   	                                                             |  สร้าง object |
|  <span class="label important">Bad</span><br> `new List[Int]`<br> <span class="label success">Good</span><br> `List(1,2,3)` |  ชนิดความผิดพลาด: ชนิดนามธรรม<br> แทนที่, ธรรมเนียม: factory ที่เรียกได้เงาสะท้อนของ type |
|  `classOf[String]`                                                                                       |  ดูข้อมูลของคลาส |
|  `x.isInstanceOf[String]`                                                                                |  เช็ค type (ขณะ runtime) |
|  `x.asInstanceOf[String]`                                                                                |  แปลง type (ขณะ runtime) |
|  `x: String`                                                                                             |  ascription (ขณะ compile time) |

