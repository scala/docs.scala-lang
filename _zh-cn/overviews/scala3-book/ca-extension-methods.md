---
title: 扩展方法
type: section
description: This page demonstrates how Extension Methods work in Scala 3.
language: zh-cn
num: 60
previous-page: ca-contextual-abstractions-intro
next-page: ca-context-parameters

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

在 Scala 2 中，用 [implicit classes]({% link _overviews/core/implicit-classes.md %}) 可以得到类似的结果。

---

扩展方法允许您在定义类型后向类型添加方法，即它们允许您向封闭类添加新方法。
例如，假设其他人创建了一个 `Circle` 类：

{% tabs ext1 %}
{% tab 'Scala 2 and 3' %}
```scala
case class Circle(x: Double, y: Double, radius: Double)
```
{% endtab %}
{% endtabs %}

现在想象一下，你需要一个 `circumference` 方法，但是你不能修改它们的源代码。
在将术语推理的概念引入编程语言之前，您唯一能做的就是在单独的类或对象中编写一个方法，如下所示：

{% tabs ext2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
object CircleHelpers {
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object CircleHelpers:
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
```
{% endtab %}
{% endtabs %}

你可以像这样用该方法：

{% tabs ext3 %}
{% tab 'Scala 2 and 3' %}
```scala
val aCircle = Circle(2, 3, 5)

// without extension methods
CircleHelpers.circumference(aCircle)
```
{% endtab %}
{% endtabs %}

但是使用扩展方法，您可以创建一个 `circumference` 方法来处理 `Circle` 实例：

{% tabs ext4 %}
{% tab 'Scala 3 Only' %}
```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
```
{% endtab %}
{% endtabs %}

在这段代码中：

- 扩展方法 `circumference` 将添加到 `Circle` 类型里
- `c: Circle` 语法允许您在扩展方法中引用变量 `c`

然后在您的代码中使用 `circumference`，就像它最初是在 `Circle` 类中定义的一样：

{% tabs ext5 %}
{% tab 'Scala 3 Only' %}
```scala
aCircle.circumference
```
{% endtab %}
{% endtabs %}

### 导入扩展方法

想象一下，`circumference` 定义在`lib` 包中，你可以通过以下方式导入它

{% tabs ext6 %}
{% tab 'Scala 3 Only' %}
```scala
import lib.circumference

aCircle.circumference
```
{% endtab %}
{% endtabs %}

如果缺少导入，编译器还会通过显示详细的编译错误消息来支持您，如下所示：

```text
value circumference is not a member of Circle, but could be made available as an extension method.

The following import might fix the problem:

   import lib.circumference
```

## 讨论

`extension` 关键字声明您将要在括号中的类型上定义一个或多个扩展方法。
要在一个类型上定义多个扩展方法，请使用以下语法：

{% tabs ext7 %}
{% tab 'Scala 3 Only' %}
```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```
{% endtab %}
{% endtabs %}
