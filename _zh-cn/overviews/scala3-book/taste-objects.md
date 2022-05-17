---
title: Singleton Objects
type: section
description: This section provides an introduction to the use of singleton objects in Scala 3.
num: 12
previous-page: taste-functions
next-page: taste-collections
---


在 Scala 中，`object` 关键字创建一个单例对象。
换句话说，对象定义了一个只有一个实例的类。

对象有多种用途：

- 它们用于创建实用程序方法的集合。
- _伴随对象_ 与一个类同名二者在同一个文件里。
  在此情况下，该类也称为 _伴随类_。
- 它们用于实现 traits，再用 traits 来创建 _模块_。

## “实用工具”方法

因为 `object` 是单例，所以它的方法可以像 Java 类中的 `static` 方法一样被访问。
例如，此 `StringUtils` 对象包含一个与字符串相关的方法的小型集合：

```scala
object StringUtils:
  def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
```

由于 `StringUtils` 是一个单例，因此可以直接在对象上调用其方法：

```scala
val x = StringUtils.isNullOrEmpty("")    // true
val x = StringUtils.isNullOrEmpty("a")   // false
```

## 伴随对象

伴随类或对象可以访问其伙伴的私有成员。
对不特定于伴随类实例的方法和值使用伴随对象。

此示例演示了伴随类中的 `area` 方法如何访问其伴随对象中的私有 `calculateArea` 方法：

```scala
import scala.math.*

class Circle(radius: Double):
  import Circle.*
  def area: Double = calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double =
    Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area   // Double = 78.53981633974483
```

## 从 traits 创建模块

对象还可用于实现创建模块的 trait。
这种技术需要两个traits，并将它们结合起来创建一个具体的 `object`：

```scala
trait AddService:
  def add(a: Int, b: Int) = a + b

trait MultiplyService:
  def multiply(a: Int, b: Int) = a * b

// implement those traits as a concrete object
object MathService extends AddService, MultiplyService

// use the object
import MathService.*
println(add(1,1))        // 2
println(multiply(2,2))   // 4
```

{% comment %}
NOTE: I don’t know if this is worth keeping, but I’m leaving it here as a comment for now.

> You may read that objects are used to _reify_ traits into modules.
> _Reify_ means, “to take an abstract concept and turn it into something concrete.” This is what happens in these examples, but “implement” is a more familiar word for most people than “reify.”
{% endcomment %}


