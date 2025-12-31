---
title: 字符串插值
type: chapter
description: This page provides more information about creating strings and using 字符串插值.
language: zh-cn
num: 18
previous-page: first-look-at-types
next-page: control-structures
redirect_from:
  - /zh-cn/overviews/core/string-interpolation.html

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

## 介绍

字符串插值提供了一种在字符串中使用变量的方法。
比如：

{% tabs example-1 %}
{% tab 'Scala 2 and 3' for=example-1 %}
```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```
{% endtab %}
{% endtabs %}

字符串插值由在字符串引号前面的 `s` 和任何有前缀 `$` 的变量组成。

### 其它插值

把 `s` 放在字符串前，只是 Scala 提供的插值的一种可能。

Scala 内置三种字符串插值方法： `s`, `f` 和 `raw`.
进一步，字符串插值器只是一种特殊的方法，所以你也可以定义自己的插值器。例如，
有些数据库的函数库定义了 `sql` 插值器，这个插值器可以返回数据库查询。

## `s` 插值器 (`s`-字符串)

在任何字符串字面量加上 `s` 前缀，就可以让你在字符串中直接使用变量。你已经在这里见过这个例子：

{% tabs example-2 %}
{% tab 'Scala 2 and 3' for=example-2 %}
```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```
{% endtab %}
{% endtabs %}

这里字符串中的 `$name` 和 `$age` 占位符相应地被调用 `name.toString` 和 `age.toString` 的结果所替换。
`s`-字符串可以获取当前作用域的所有变量。

虽然这看着很明显，但它很重要，需要在这指出来，字符串插值在普通字符串字面量中_不_起作用：

{% tabs example-3 %}
{% tab 'Scala 2 and 3' for=example-3 %}
```scala
val name = "James"
val age = 30
println("$name is $age years old")   // "$name is $age years old"
```
{% endtab %}
{% endtabs %}

字符串插值器可以使用任何表达式。例如：

{% tabs example-4 %}
{% tab 'Scala 2 and 3' for=example-4 %}
```scala
println(s"2 + 2 = ${2 + 2}")   // "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // "x.abs = 1"
```
{% endtab %}
{% endtabs %}

任何表达式可以嵌入 `${}` 中.

有些特殊字符在嵌入到字符串内时需要转义。
当需要显示真实的美元符号时，你可以把美元符号双写 `$$`, 像这样：

{% tabs example-5 %}
{% tab 'Scala 2 and 3' for=example-5 %}
```scala
println(s"New offers starting at $$14.99")   // "New offers starting at $14.99"
```
{% endtab %}
{% endtabs %}

双引号一样需要转义。这个可以使用三引号来达到，如下：

{% tabs example-6 %}
{% tab 'Scala 2 and 3' for=example-6 %}
```scala
println(s"""{"name":"James"}""")     // `{"name":"James"}`
```
{% endtab %}
{% endtabs %}

最后，可以在所有多行字符串内插值

{% tabs example-7 %}
{% tab 'Scala 2 and 3' for=example-7 %}
```scala
println(s"""name: "$name",
           |age: $age""".stripMargin)
```

This will print as follows:

```
name: "James"
age: 30
```
{% endtab %}
{% endtabs %}

## `f` 插值器 (`f`-字符串)

在任何字符串字面量加上 `f` 前缀，允许你创建简单的格式化字符串，像其它语言中的 `printf`。当使用 `f` 插值器时，
所有变量的引用应该遵循 `printf` 风格的格式化字符串，像 `%d`。让我们看以下例子：

{% tabs example-8 %}
{% tab 'Scala 2 and 3' for=example-8 %}
```scala
val height = 1.9d
val name = "James"
println(f"$name%s is $height%2.2f meters tall")  // "James is 1.90 meters tall"
```
{% endtab %}
{% endtabs %}

`f` 插值器是类型安全的。如果你尝试把一个双精度数传递给一个只能处理整数的格式化字符串，编译器会发出一个错误信息。
例如：

{% tabs f-interpolator-error class=tabs-scala-version %}

{% tab 'Scala 2' for=f-interpolator-error %}
```scala
val height: Double = 1.9d

scala> f"$height%4d"
<console>:9: error: type mismatch;
  found   : Double
  required: Int
            f"$height%4d"
              ^
```
{% endtab %}

{% tab 'Scala 3' for=f-interpolator-error %}
```scala
val height: Double = 1.9d

scala> f"$height%4d"
-- Error: ----------------------------------------------------------------------
1 |f"$height%4d"
  |   ^^^^^^
  |   Found: (height : Double), Required: Int, Long, Byte, Short, BigInt
1 error found

```
{% endtab %}
{% endtabs %}

`f` 插值器使用来自 Java 的字符串格式化工具。格式化允许在 `%` 字符后，在[Formatter javadoc][java-format-docs] 中有说明。
如果没有 `%` 字符在变量之后，那么 `%s` (`String`) 作为缺省的格式化工具。

最后，像在 Java 里，使用 `%%` 来让 `%` 字符出现在输出字符中：

{% tabs literal-percent %}
{% tab 'Scala 2 and 3' for=literal-percent %}
```scala
println(f"3/19 is less than 20%%")  // "3/19 is less than 20%"
```
{% endtab %}
{% endtabs %}

### `raw` 插值器

raw 插值器 和 `s` 插值器很像，除了它不动字符串内的转义符。这里有一个处理字符串的例子：

{% tabs example-9 %}
{% tab 'Scala 2 and 3' for=example-9 %}
```scala
scala> s"a\nb"
res0: String =
a
b
```
{% endtab %}
{% endtabs %}

这里 `s` 字符串插值器把 `\n` 替换成回车字符。`raw` 插值器不会做那些。

{% tabs example-10 %}
{% tab 'Scala 2 and 3' for=example-10 %}
```scala
scala> raw"a\nb"
res1: String = a\nb
```
{% endtab %}
{% endtabs %}

当你希望避免像 `\n` 这样的表达式转义成回车符，raw 插值器会有用。

除了这三种自带的字符串插值器外，你还可以定义自己的插值器。

## 高级用法

字面量 `s"Hi $name"` 被 Scala 当成 _过程_ 字符串字面量来进行分析。
这意味着编译器对这个字面量额外做了一些工作。具体的处理后的字符串
和字符串插入器可以在 [SIP-11][sip-11] 中找到描述，但这里用一个快速的例子来展示它
是如何工作的。

### 定制插值器

在 Scala 中，所有被处理过的字符串字面量都是简单的代码转换。任何时候当编译器遇到
形式如下，处理过的字符串字面量时：

{% tabs example-11 %}
{% tab 'Scala 2 and 3' for=example-11 %}
```scala
id"string content"
```
{% endtab %}
{% endtabs %}

编译器把这段代码转换成 在 [StringContext](https://www.scala-lang.org/api/current/scala/StringContext.html) 实例之上调用 (`id`) 方法.
该方法也在隐式作用域有效。
为了定义我们自己的字符串插值器，我们需要创建一个 implicit class (Scala 2) 或者一个 `extension` 方法（Scala 3）方法，这样可以把新方法添加到 `StringContext` 中。

作为一个小例子，让我们假定 `Point` 类，并假定我们想创建一个定制化的插值器，它把 `p"a,b"` into a 转换成 `Point` 对象。

{% tabs custom-interpolator-1 %}
{% tab 'Scala 2 and 3' for=custom-interpolator-1 %}
```scala
case class Point(x: Double, y: Double)

val pt = p"1,-2"     // Point(1.0,-2.0)
```
{% endtab %}
{% endtabs %}

我们首先实现一个如下的 `StringContext` 扩展来创建一个定制的 `p`-插值器：

{% tabs custom-interpolator-2 class=tabs-scala-version %}

{% tab 'Scala 2' for=custom-interpolator-2 %}
```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Any*): Point = ???
}
```

**注意：** 在 Scala 2.x 中重要的一点是继承自 `AnyVal` ，从而防止运行时对每个插值器进行实例化。
更多内容见 [值类][value-classes] 文档。

{% endtab %}

{% tab 'Scala 3' for=custom-interpolator-2 %}
```scala
extension (sc: StringContext)
  def p(args: Any*): Point = ???
```
{% endtab %}

{% endtabs %}

一旦这个扩展在作用域，当 Scala 编译器遇到 `p"some string"` 时，它将
`some string` 中每一个嵌入到字符串中的变量转换为字符串和表达式参数。

例如 `p"1, $someVar"` 将转变成：

{% tabs extension-desugaring class=tabs-scala-version %}

{% tab 'Scala 2' for=extension-desugaring %}
```scala
new StringContext("1, ", "").p(someVar)
```

隐式类将用来重写成以下的样子：

```scala
new PointHelper(new StringContext("1, ", "")).p(someVar)
```
{% endtab %}

{% tab 'Scala 3' for=extension-desugaring %}
```scala
StringContext("1, ","").p(someVar)
```

{% endtab %}

{% endtabs %}

作为结果，每一个处理过的字符串片段都暴露在 `StringContext.parts` 成员内，而在字符串中的任何
表达式的值都传递给该方法的 `args` 参数。

### 实现的例子

我们这个天真的 Point 插值器方法的实现看着像以下的代码，
但是更复杂的方法可能会用更加精确的控制用于处理字符串 `parts` 和 表达式 `args`,
这样可以替代目前重用 `s`-插值器。

{% tabs naive-implementation class=tabs-scala-version %}

{% tab 'Scala 2' for=naive-implementation %}
```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Double*): Point = {
    // reuse the `s`-interpolator and then split on ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }
}

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```
{% endtab %}

{% tab 'Scala 3' for=naive-implementation %}
```scala
extension (sc: StringContext)
  def p(args: Double*): Point = {
    // reuse the `s`-interpolator and then split on ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```
{% endtab %}
{% endtabs %}

虽然字符串插值器刚开始是用来创建某种字符串形式，但使用上面的定制插值器可以有强大的句法简写，
并且社区已经制造了一些语法便捷的用途，如 ANSI 终端颜色扩展，可执行 SQL 查询，神奇的 
`$"identifier"` 表达，还有更多其它的。

[java-format-docs]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#detail
[value-classes]: {% link _overviews/core/value-classes.md %}
[sip-11]: {% link _sips/sips/011-string-interpolation.md %}
