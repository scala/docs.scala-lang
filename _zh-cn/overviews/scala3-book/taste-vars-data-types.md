---
title: 变量和数据类型
type: section
description: This section demonstrates val and var variables, and some common Scala data types.
num: 7
previous-page: taste-repl
next-page: taste-control-structures

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---



本节介绍 Scala 变量和数据类型。

## 两种类型的变量

当你在 Scala 中创建一个新变量时，你声明该变量是不可变的还是可变的：

<table>
   <thead>
     <tr>
       <th>变量类型</th>
       <th>说明</th>
     </tr>
   </thead>
   <tbody>
     <tr>
       <td valign="top"><code>val</code></td>
       <td valign="top">创建一个<em>不可变</em>变量——类似于 Java 中的 <code>final</code>。 您应该始终使用 <code>val</code> 创建一个变量，除非有理由使用可变变量。</td>
     </tr>
     <tr>
       <td><code>var</code></td>
       <td>创建一个<em>可变</em>变量，并且只应在变量的内容随时间变化时使用。</td>
     </tr>
   </tbody>
</table>

这些示例展示了如何创建 `val` 和 `var` 变量：

```scala
// immutable
val a = 0

// mutable
var b = 1
```

在应用程序中，不能重新给一个 `val` 变量赋值。
如果您尝试重新赋值一个 `val` 变量，将导致编译器错误：

```scala
val msg = "Hello, world"
msg = "Aloha"   // "reassignment to val" error; this won’t compile
```

相反，可以重新分配一个 `var` 变量：

```scala
var msg = "Hello, world"
msg = "Aloha" // 因为可以重新分配 var，所以可以编译
```

## 声明变量类型

创建变量时，您可以显式声明其类型，或让编译器推断类型：

```scala
val x: Int = 1   // 显式
val x = 1        // 隐式的；编译器推断类型
```

第二种形式称为 _类型推断_，它是帮助保持此类代码简洁的好方法。
Scala 编译器通常可以为您推断数据类型，如以下 REPL 示例的输出所示：

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1, 2, 3)
val nums: List[Int] = List(1, 2, 3)
```

如果您愿意，您始终可以显式声明变量的类型，但在像这样的简单赋值中，不须要这样：

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = Person("Richard")
```

请注意，使用这种方法会感觉代码太啰嗦。

{% comment %}
TODO: Jonathan had an early comment on the text below: “While it might feel like this, I would be afraid that people automatically assume from this statement that everything is always boxed.” Suggestion on how to change this?
{% endcomment %}

## 内置数据类型

Scala 带有你所期望的标准数值数据类型，它们都是类的成熟（full-blown）实例。
在 Scala 中，一切都是对象。

这些示例展示了如何声明数值类型的变量：

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

因为 `Int` 和 `Double` 是默认的数字类型，所以您通常创建它们而不显式声明数据类型：

```scala
val i = 123   // 默认为 Int
val j = 1.0   // 默认为 Double
```

在您的代码中，您还可以将字符 `L`、`D` 和 `F`（或者它们对应的小写字母）加到数字后面以指定它们是 `Long`、`Double` 或 `Float` 值：

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```

当您需要非常大的数字时，请使用 `BigInt` 和 `BigDecimal` 类型：

```scala
var a = BigInt(1_234_567_890_987_654_321L)
var b = BigDecimal(123_456.789)
```

其中 `Double` 和 `Float` 是近似十进制数，`BigDecimal` 用于精确算术。

Scala 还有 `String` 和 `Char` 数据类型：

```scala
val name = "Bill"   // String
val c = 'a'         // Char
```

### 字符串

Scala 字符串类似于 Java 字符串，但它们有两个很棒的附加特性：

- 他们支持字符串插值
- 创建多行字符串很容易

#### 字符串插值

字符串插值提供了一种非常易读的方式在字符串中使用变量。
例如，给定这三个变量：

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

您可以将这些变量组合在一个字符串中，如下所示：

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```

只需在字符串前面加上字母 `s`，然后在字符串中的变量名之前放置一个 `$` 符号。

要将任意表达式嵌入字符串中，请将它们括在花括号中：

``` scala
println(s"2 + 2 = ${2 + 2}") // 打印 "2 + 2 = 4"

val x = -1
println(s"x.abs = ${x.abs}") // 打印 "x.abs = 1"
```

放在字符串前面的 `s` 只是一种可能的插值器。
如果使用 `f` 而不是 `s`，则可以在字符串中使用 `printf` 样式的格式化语法。
此外，字符串插值器只是一种特殊方法，可以定义自己的方法。
例如，有一些数据库方向的类库定义了非常强大的 `sql` 插值器。

#### 多行字符串

多行字符串是通过将字符串包含在三个双引号内来创建的：

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```

> 有关字符串插值器和多行字符串的更多详细信息，请参阅[“First Look at Types”章节][first-look]。

[first-look]: {% link _zh-cn/overviews/scala3-book/first-look-at-types.md %}
