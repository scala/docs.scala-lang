---
layout: tour
title: 单例对象
partof: scala-tour

num: 12

language: zh-cn

next-page: regular-expression-patterns
previous-page: pattern-matching
---

单例对象是一种特殊的类，有且只有一个实例。和惰性变量一样，单例对象是延迟创建的，当它第一次被使用时创建。

当对象定义于顶层时(即没有包含在其他类中)，单例对象只有一个实例。

当对象定义在一个类或方法中时，单例对象表现得和惰性变量一样。

# 定义一个单例对象
一个单例对象是就是一个值。单例对象的定义方式很像类，但是使用关键字 `object`：
```scala mdoc
object Box
```

下面例子中的单例对象包含一个方法：
```
package logging

object Logger {
  def info(message: String): Unit = println(s"INFO: $message")
}
```
方法 `info` 可以在程序中的任何地方被引用。像这样创建功能性方法是单例对象的一种常见用法。 

下面让我们来看看如何在另外一个包中使用 `info` 方法：

```
import logging.Logger.info

class Project(name: String, daysToComplete: Int)

class Test {
  val project1 = new Project("TPS Reports", 1)
  val project2 = new Project("Website redesign", 5)
  info("Created projects")  // Prints "INFO: Created projects"
}
```

因为 import 语句 `import logging.Logger.info`，方法 `info` 在此处是可见的。

import语句要求被导入的标识具有一个“稳定路径”，一个单例对象由于全局唯一，所以具有稳定路径。

注意：如果一个 `object` 没定义在顶层而是定义在另一个类或者单例对象中，那么这个单例对象和其他类普通成员一样是“路径相关的”。这意味着有两种行为，`class Milk` 和 `class OrangeJuice`，一个类成员 `object NutritionInfo` “依赖”于包装它的实例，要么是牛奶要么是橙汁。 `milk.NutritionInfo` 则完全不同于`oj.NutritionInfo`。

## 伴生对象

当一个单例对象和某个类共享一个名称时，这个单例对象称为 _伴生对象_。 同理，这个类被称为是这个单例对象的伴生类。类和它的伴生对象可以互相访问其私有成员。使用伴生对象来定义那些在伴生类中不依赖于实例化对象而存在的成员变量或者方法。
```
import scala.math._

case class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = Circle(5.0)

circle1.area
```

这里的 `class Circle` 有一个成员 `area` 是和具体的实例化对象相关的，单例对象 `object Circle` 包含一个方法 `calculateArea` ，它在每一个实例化对象中都是可见的。

伴生对象也可以包含工厂方法：
```scala mdoc
class Email(val username: String, val domainName: String)

object Email {
  def fromString(emailString: String): Option[Email] = {
    emailString.split('@') match {
      case Array(a, b) => Some(new Email(a, b))
      case _ => None
    }
  }
}

val scalaCenterEmail = Email.fromString("scala.center@epfl.ch")
scalaCenterEmail match {
  case Some(email) => println(
    s"""Registered an email
       |Username: ${email.username}
       |Domain name: ${email.domainName}
     """)
  case None => println("Error: could not parse email")
}
```
伴生对象 `object Email` 包含有一个工厂方法 `fromString` 用来根据一个 String 创建 `Email` 实例。在这里我们返回的是 `Option[Email]` 以防有语法分析错误。

注意：类和它的伴生对象必须定义在同一个源文件里。如果需要在 REPL 里定义类和其伴生对象，需要将它们定义在同一行或者进入 `:paste` 模式。

## Java 程序员的注意事项 ##

在 Java 中 `static` 成员对应于 Scala 中的伴生对象的普通成员。

在 Java 代码中调用伴生对象时，伴生对象的成员会被定义成伴生类中的 `static` 成员。这称为 _静态转发_。这种行为发生在当你自己没有定义一个伴生类时。
