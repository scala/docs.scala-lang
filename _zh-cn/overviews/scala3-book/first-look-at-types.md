---
title: 类型初探
type: chapter
description: This page provides a brief introduction to Scala's built-in data types, including Int, Double, String, Long, Any, AnyRef, Nothing, and Null.
language: zh-cn
num: 17
previous-page: taste-summary
next-page: control-structures

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


## 所有值都有一个类型

在 Scala 中，所有值都有一个类型，包括数值和函数。
下图展示了类型层次结构的一个子集。

<a href="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/scala3-book/hierarchy.svg" alt="Scala 3 Type Hierarchy"></a>

## Scala 类型层次结构

`Any` 是所有类型的超类型，也称为 **首类型**。
它定义了某些通用方法，例如 `equals` ， `hashCode` 和 `toString` 。

首类型 `Any` 有一个子类型 [`Matchable`][matchable]，它用于标记可以执行模式匹配的所有类型。
保证属性调用 _“参数化”_ 非常重要。
我们不会在这里详细介绍，但总而言之，这意味着我们不能对类型为 `Any` 的值进行模式匹配，而只能对 `Matchable` 的子类型的值进行模式匹配。
[参考文档][matchable]包含有关 `Matchable` 的更多信息。

`Matchable` 有两个重要的子类型： `AnyVal` 和 `AnyRef` 。

*`AnyVal`* 表示值类型。
有几个预定义的值类型，它们是不可为空的： `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit`, 和 `Boolean`。
`Unit` 是一种值类型，它不携带有意义的信息。
`Unit` 只有一个实例，我们可以将其称为：`()`。

*`AnyRef`* 表示引用类型。
所有非值类型都定义为引用类型。
Scala中的每个用户定义类型都是 `AnyRef` 的子类型。
如果在Java运行时环境的上下文中使用Scala，则 `AnyRef` 对应于 `java.lang.Object`。

在基于语句的编程语言中， `void` 用于没有返回值的方法。
如果您在Scala中编写没有返回值的方法，例如以下方法，则 `Unit` 用于相同的目的：

{% tabs unit %}
{% tab 'Scala 2 and 3' for=unit %}

```scala
def printIt(a: Any): Unit = println(a)
```

下面是一个示例，它演示了字符串、整数、字符、布尔值和函数都是 `Any` 的实例，可以像对待其他所有对象一样处理：

{% tabs any %}
{% tab 'Scala 2 and 3' for=any %}

```scala
val list: List[Any] = List(
  "a string",
  732,  // an integer
  'c',  // a character
  true, // a boolean value
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```

{% endtab %}
{% endtabs %}

该代码定义了一个类型为 `List[Any]` 的值 `list` 。
该列表使用各种类型的元素进行初始化，但每个元素都是 `scala.Any` 的实例，因此我们可以将它们添加到列表中。

下面是程序的输出：

```
a string
732
c
true
<function>
```

## Scala的“值类型”

如上所示，Scala的值类型扩展了 `AnyVal`，它们都是成熟的对象。
这些示例演示如何声明以下数值类型的变量：

{% tabs anyval %}
{% tab 'Scala 2 and 3' for=anyval %}

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

{% endtab %}
{% endtabs %}

在前四个示例中，如果未显式指定类型，则数字 `1` 将默认为 `Int` ，因此，如果需要其他数据类型之一 --- `Byte` 、`Long` 或 `Short` --- 则需要显式声明这些类型，如上面代码所示。
带有小数的数字（如2.0）将默认为 `Double` ，因此，如果您想要 `Float` ，则需要声明 `Float` ，如上一个示例所示。

由于 `Int` 和 `Double` 是默认数值类型，因此通常在不显式声明数据类型的情况下创建它们：

{% tabs anynum %}
{% tab 'Scala 2 and 3' for=anynum %}

```scala
val i = 123   // defaults to Int
val x = 1.0   // defaults to Double
```

{% endtab %}
{% endtabs %}

在代码中，您还可以将字符 `L` 、 `D` 和 `F` （及其小写等效项）加到数字末尾，以指定它们是 `Long`, `Double`, 或 `Float` 值：

{% tabs type-post %}
{% tab 'Scala 2 and 3' for=type-post %}

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```

{% endtab %}
{% endtabs %}

Scala还具有 `String` 和 `Char` 类型，通常可以使用隐式形式声明：

{% tabs type-string %}
{% tab 'Scala 2 and 3' for=type-string %}

```scala
val s = "Bill"
val c = 'a'
```

{% endtab %}
{% endtabs %}

如下面表格所示，将字符串括在双引号中 --- 或多行字符串括在三引号中 --- 或字符括在单引号中。

这些数据类型及其范围包括：

| 数据类型    | 可能的值 |
| ---------- | --------------- |
| Boolean    | `true` 或 `false` |
| Byte       | 8 位有符号二进制补码整数（-2^7 至 2^7-1,含）<br/>-128 至 127   |
| Short      | 16 位有符号二进制补码整数（-2^15 至 2^15-1,含）<br/>-32,768 至 32,767 |
| Int        | 32 位二进制补码整数（-2^31 至 2^31-1,含）<br/>-2,147,483,648 至 2,147,483,647 |
| Long       | 64 位 2 的补码整数（-2^63 到 2^63-1,含）<br/>（-2^63 到 2^63-1,包括） |
| Float      | 32 位 IEEE 754 单精度浮点数<br/>1.40129846432481707e-45 到 3.40282346638528860e+38 |
| Double     | 64 位 IEEE 754 双精度浮点数<br/>4.94065645841246544e-324 到 1.79769313486231570e+308 |
| Char       | 16 位无符号 Unicode 字符（0 到 2^16-1,含）<br/>0 到 65,535 |
| String     | 一个 `Char` 序列 |

## `BigInt` 和 `BigDecimal`

当您需要非常大的数字时，请使用 `BigInt` 和 `BigDecimal` 类型：

{% tabs type-bigint %}
{% tab 'Scala 2 and 3' for=type-bigint %}

```scala
val a = BigInt(1_234_567_890_987_654_321L)
val b = BigDecimal(123_456.789)
```

{% endtab %}
{% endtabs %}

其中 `Double` 和 `Float` 是近似的十进制数， `BigDecimal` 用于精确算术，例如在使用货币时。

`BigInt` 和 `BigDecimal` 的一个好处是，它们支持您习惯于用于数字类型的所有运算符：

{% tabs type-bigint2 %}
{% tab 'Scala 2 and 3' for=type-bigint2 %}

```scala
val b = BigInt(1234567890)   // scala.math.BigInt = 1234567890
val c = b + b                // scala.math.BigInt = 2469135780
val d = b * b                // scala.math.BigInt = 1524157875019052100
```

{% endtab %}
{% endtabs %}

## 关于字符串的两个注释

Scala字符串类似于Java字符串，但它们有两个很棒的附加特性：

- 它们支持字符串插值
- 创建多行字符串很容易

### 字符串插值

字符串插值提供了一种非常可读的方式在字符串中使用变量。
例如，给定以下三个变量：

{% tabs string-inside1 %}
{% tab 'Scala 2 and 3' for=string-inside1 %}

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

{% endtab %}
{% endtabs %}

你可以把那些变量组合成这样的字符串：

{% tabs string-inside2 %}
{% tab 'Scala 2 and 3' for=string-inside2 %}

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```

{% endtab %}
{% endtabs %}

只需在字符串前面加上字母 `s` ，然后在字符串内的变量名称之前放置一个 `$` 符号。

如果要在字符串中使用可能较大的表达式时，请将它们放在大括号中：

{% tabs string-inside3 %}
{% tab 'Scala 2 and 3' for=string-inside3 %}

```scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
```

{% endtab %}
{% endtabs %}

#### 其他插值器

放置在字符串前面的 `s` 只是一个可能的插值器。
如果使用 `f` 而不是 `s` ，则可以在字符串中使用 `printf` 样式的格式语法。
此外，字符串插值器只是一种特殊方法，可以定义自己的方法。
例如，一些数据库库定义了非常强大的 `sql` 插值器。

### 多行字符串

多行字符串是通过将字符串包含在三个双引号内来创建的：

{% tabs string-mlines1 %}
{% tab 'Scala 2 and 3' for=string-mlines1 %}

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```

{% endtab %}
{% endtabs %}

这种基本方法的一个缺点是，第一行之后的行是缩进的，如下所示：

{% tabs string-mlines2 %}
{% tab 'Scala 2 and 3' for=string-mlines2 %}

```scala
"The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."
```

{% endtab %}
{% endtabs %}

当间距很重要时，在第一行之后的所有行前面放一个 `|` 符号，并在字符串之后调用 `stripMargin` 方法：

{% tabs string-mlines3 %}
{% tab 'Scala 2 and 3' for=string-mlines3 %}

```scala
val quote = """The essence of Scala:
               |Fusion of functional and object-oriented
               |programming in a typed setting.""".stripMargin
```

{% endtab %}
{% endtabs %}

现在字符串里所有行都是左对齐了：

{% tabs string-mlines4 %}
{% tab 'Scala 2 and 3' for=string-mlines4 %}

```scala
"The essence of Scala:
Fusion of functional and object-oriented
programming in a typed setting."
```

{% endtab %}
{% endtabs %}

## 类型转换

可以通过以下方式强制转换值类型：

<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

例如：

{% tabs cast1 %}
{% tab 'Scala 2 and 3' for=cast1 %}

```scala
val b: Byte = 127
val i: Int = b  // 127

val face: Char = '☺'
val number: Int = face  // 9786
```

{% endtab %}
{% endtabs %}

只有在没有丢失信息的情况下，才能强制转换为类型。否则，您需要明确说明强制转换：

{% tabs cast2 %}
{% tab 'Scala 2 and 3' for=cast2 %}

```scala
val x: Long = 987654321
val y: Float = x.toFloat  // 9.8765434E8 (注意 `.toFloat` 是必须的，因为强制类型转换后的精度会损)
val z: Long = y  // Error
```

{% endtab %}
{% endtabs %}

还可以将引用类型强制转换为子类型。
这将在教程的后面部分介绍。

## `Nothing` 和 `null`

`Nothing` 是所有类型的子类型，也称为**底部类型**。
`Nothing` 类型是没有值的。
一个常见的用途是发出非终止信号，例如抛出异常，程序退出或无限循环---即，它是不计算为值的那种表达式，或者不正常返回的方法。

`Null` 是所有引用类型的子类型（即 `AnyRef` 的任何子类型）。
它具有由关键字面量 `null` 标识的单个值。
目前，使用 `null` 被认为是不好的做法。它应该主要用于与其他JVM语言的互操作性。选择加入编译器选项会更改 `Null` 状态，以修复与其用法相关的警告。此选项可能会成为将来版本的 Scala 中的默认值。你可以在[这里][safe-null]了解更多关于它的信息。

与此同时， `null` 几乎不应该在Scala代码中使用。
本书的[函数式编程章节][fp]和 [API文档][option-api]中讨论了 `null` 的替代方法。

[reference]: {{ site.scala3ref }}/overview.html
[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
[interpolation]: {% link _overviews/core/string-interpolation.md %}
[fp]: {% link _zh-cn/overviews/scala3-book/fp-intro.md %}
[option-api]: https://scala-lang.org/api/3.x/scala/Option.html
[safe-null]: {{ site.scala3ref }}/experimental/explicit-nulls.html
