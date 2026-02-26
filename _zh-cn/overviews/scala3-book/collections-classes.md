---
title: 集合类型
type: section
description: This page introduces the common Scala 3 collections types and some of their methods.
language: zh-cn
num: 38
previous-page: collections-intro
next-page: collections-methods

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

{% comment %}
TODO: mention Array, ArrayDeque, ListBuffer, Queue, Stack, StringBuilder?
LATER: note that methods like `+`, `++`, etc., are aliases for other methods
LATER: add links to the Scaladoc for the major types shown here
{% endcomment %}

本页演示了常见的 Scala 3 集合及其附带的方法。
Scala 提供了丰富的集合类型，但您可以从其中的几个开始，然后根据需要使用其他的。
同样，每种集合类型都有数十种方法可以让您的生活更轻松，但您可以从其中的少数几个开始使用，就可以有很多收获。

因此，本节介绍并演示了在开始时，需要使用的最常见的类型和方法。
当您需要更大的灵活性时，请参阅本节末尾的这些页面以获取更多细节。

## 三大类集合

从高层次看 Scala 集合，有三个主要类别可供选择：

- **序列** 是元素的顺序集合，可以是*有索引的*（如数组）或*线性的*（如链表）
- **映射** 包含键/值对的集合，例如 Java `Map`、Python 字典或 Ruby `Hash`
- **集合（Set）** 是无重复元素的无序集合

所有这些都是基本类型，并且具有用于特定目的的子类型，例如并发、缓存和流式传输。
除了这三个主要类别之外，还有其他有用的集合类型，包括范围、堆栈和队列。

### 集合层次结构

作为简要概述，接下来的三个图显示了 Scala 集合中类和 trait 的层次结构。

第一张图显示了*scala.collection*包中的集合类型。
这些都是高级抽象类或 traits，它们通常有*不可变*和*可变*的实现。

![一般集合层次结构][collections1]

此图显示包 _scala.collection.immutable_ 中的所有集合：

![不可变集合层次结构][collections2]

此图显示包 _scala.collection.mutable_ 中的所有集合：

![可变集合层次结构][collections3]

在查看了所有集合类型的详细视图后，以下部分将介绍一些经常使用的常见类型。

{% comment %}
NOTE: those images come from this page: https://docs.scala-lang.org/overviews/collections-2.13/overview.html
{% endcomment %}

## 常用集合

您经常使用的主要集合是：

| 集合类型      | 不可变   | 可变     | 说明                                                                 |
| ------------- | -------- | -------- | -------------------------------------------------------------------- |
| `List`        | &#10003; |          | 线性（链表）、不可变序列                                             |
| `Vector`      | &#10003; |          | 一个索引的、不可变的序列                                             |
| `LazyList`    | &#10003; |          | 一个惰性不可变链表，它的元素仅在需要时才计算；适用于大型或无限序列。 |
| `ArrayBuffer` |          | &#10003; | 可变索引序列的首选类型                                               |
| `ListBuffer`  |          | &#10003; | 当你想要一个可变的 `List` 时使用；通常转换为“列表”                   |
| `Map`         | &#10003; | &#10003; | 由键和值对组成的可迭代集合。                                         |
| `Set`         | &#10003; | &#10003; | 没有重复元素的可迭代集合                                             |

如图所示，`Map` 和 `Set` 有不可变和可变版本。

以下部分演示了每种类型的基础知识。

> 在 Scala 中，_缓冲_——例如 `ArrayBuffer` 和 `ListBuffer`——是一个可以增长和缩小的序列。

### 关于不可变集合的说明

在接下来的部分中，无论何时使用*不可变*这个词，都可以安全地假设该类型旨在用于*函数式编程*(FP) 风格。
使用这些类型，您无需修改 ​​ 集合；您将函数式方法应用于该集合以创建新的结果。

## 选择序列

选择*序列* -- 一个顺序集合元素时 -- 您有两个主要决定：

- 是否应该对序列进行索引（如数组），允许快速访问任何元素，还是应该将其实现为线性链表？
- 你想要一个可变的还是不可变的集合？

此处显示了推荐的通用顺序集合，用于可变/不可变和索引/线性组合：

| 类型/类别    | 不可变   | 可变          |
| ------------ | -------- | ------------- |
| 索引         | `Vector` | `ArrayBuffer` |
| 线性（链表） | `List`   | `ListBuffer`  |

例如，如果您需要一个不可变的索引集合，通常您应该使用 `Vector`。
相反，如果您需要一个可变的索引集合，请使用 `ArrayBuffer`。

> `List` 和 `Vector` 在以函数式风格编写代码时经常使用。
> `ArrayBuffer` 通常在以命令式风格编写代码时使用。
> `ListBuffer` 用于混合样式时，例如构建列表。

接下来的几节简要介绍了 `List`、`Vector` 和 `ArrayBuffer` 类型。

## `List`

[列表类型](https://www.scala-lang.org/api/current/scala/collection/immutable/List.html) 是一个线性的、不可变的序列。
这只是意味着它是一个您无法修改的链表。
任何时候你想添加或删除 `List` 元素，你都可以从现有的 `List` 中创建一个新的 `List`。

### 创建列表

这是创建初始“列表”的方式：

{% tabs list-creation %}
{% tab 'Scala 2 and 3' %}

```scala
val ints = List(1, 2, 3)
val names = List("Joel", "Chris", "Ed")

// another way to construct a List
val namesAgain = "Joel" :: "Chris" :: "Ed" :: Nil
```

{% endtab %}
{% endtabs %}

如果您愿意，也可以声明 `List` 的类型，但通常不是必需的：

{% tabs list-type %}
{% tab 'Scala 2 and 3' %}

```scala
val ints: List[Int] = List(1, 2, 3)
val names: List[String] = List("Joel", "Chris", "Ed")
```

{% endtab %}
{% endtabs %}

一个例外是集合中有混合类型时。在这种情况下，您可能需要明确指定其类型：

{% tabs list-mixed-types class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val things: List[Any] = List(1, "two", 3.0)
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
val things: List[String | Int | Double] = List(1, "two", 3.0) // with union types
val thingsAny: List[Any] = List(1, "two", 3.0)                // with any
```

{% endtab %}
{% endtabs %}

### 将元素添加到列表

因为 `List` 是不可变的，所以你不能向它添加新元素。
相反，您可以通过将元素添加到现有 `List` 来创建新列表。
例如，给定这个 `List`：

{% tabs adding-elements-init %}
{% tab 'Scala 2 and 3' %}

```scala
val a = List(1, 2, 3)
```

{% endtab %}
{% endtabs %}

使用 `List` 时，用 `::` 来*附加*一个元素，用 `:::` 把另一个 `List` 插在这个 `List` 之前，如下所示：

{% tabs adding-elements-example %}
{% tab 'Scala 2 and 3' %}

```scala
val b = 0 :: a // List(0, 1, 2, 3)
val c = List(-1, 0) ::: a // List(-1, 0, 1, 2, 3)
```

{% endtab %}
{% endtabs %}

你也可以在 `List` 中添加元素，但是因为 `List` 是一个单链表，你通常应该只在它前面添加元素；
在它的后面添加元素是一个相对较慢的操作，尤其是在处理大型序列时。

> 提示：如果您想将元素添加到不可变序列的前面或者后面时，请改用 `Vector`。

因为 `List` 是一个链表，你不应该尝试通过索引值来访问大列表的元素。
例如，如果您有一个包含一百万个元素的 `List` ，则访问像 `myList(999_999)` 这样的元素将花费相对较长的时间，因为该请求必须遍历所有这些元素。
如果您有一个大型集合并希望通过索引访问元素，请改用 `Vector` 或 `ArrayBuffer`。

### 如何记住方法名

现在 IDE 为我们提供了极大的帮助，但是记住这些方法名称的一种方法是，认为 `:` 字符代表序列所在的一侧，因此当您使用 `+:` 时，您知道列表需要在右边，像这样：

{% tabs list-prepending %}
{% tab 'Scala 2 and 3' %}

```scala
0 +： a
```

{% endtab %}
{% endtabs %}

同样，当您使用 `:+` 时，您知道列表需要在左侧：

{% tabs list-appending %}
{% tab 'Scala 2 and 3' %}

```scala
a ：+ 4
```

{% endtab %}
{% endtabs %}

有更多的技术方法可以考虑这一点，但这可能是记住方法名称的有用方法。

{% comment %}
LATER: Add a discussion of `:` on method names, right-associativity, and infix operators.
{% endcomment %}

此外，这些符号方法名称的一个好处是它们是一致的。
相同的方法名称用于其他不可变序列，例如 `Seq` 和 `Vector`。
如果您愿意，还可以使用非符号方法名称来附加元素和在头部插入元素。

### 如何遍历列表

给定一个名称 `List`：

{% tabs list-loop-init %}
{% tab 'Scala 2 and 3' %}

```scala
val names = List("Joel", "Chris", "Ed")
```

{% endtab %}
{% endtabs %}

您可以像这样打印每个字符串：

{% tabs list-loop-example class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
for (name <- names) println(name)
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
for name <- names do println(name)
```

{% endtab %}
{% endtabs %}

这是它在 REPL 中的样子：

{% tabs list-loop-repl class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
scala> for (name <- names) println(name)
Joel
Chris
Ed
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
scala> for name <-names do println(name)
Joel
Chris
Ed
```

{% endtab %}
{% endtabs %}

将 `for` 循环与集合一起使用的一个好处是 Scala 是一致的，并且相同的方法适用于所有序列，包括 `Array`、`ArrayBuffer`、`List`、`Seq`、`Vector`、`Map` ，`Set` 等。

### 一点历史

对于那些对历史感兴趣的人，Scala `List` 类似于 [Lisp 编程语言](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>) 中的 `List`，它是最初于 1958 年确定的。
实际上，除了像这样创建一个 `List` 之外：

{% tabs list-history-init %}
{% tab 'Scala 2 and 3' %}

```scala
val ints = List(1, 2, 3)
```

{% endtab %}
{% endtabs %}

您也可以通过这种方式创建完全相同的列表：

{% tabs list-history-init2 %}
{% tab 'Scala 2 and 3' %}

```scala
val list = 1 :: 2 :: 3 :: Nil
```

{% endtab %}
{% endtabs %}

REPL 展示了它是如何工作的：

{% tabs list-history-repl %}
{% tab 'Scala 2 and 3' %}

```scala
scala> val list = 1 :: 2 :: 3 :: Nil
list: List[Int] = List(1, 2, 3)
```

{% endtab %}
{% endtabs %}

这是因为 `List` 是一个以 `Nil` 元素结尾的单链表，而 `::` 是一个 `List` 方法，其工作方式类似于 Lisp 的“cons”运算符。

### 旁白：LazyList

Scala 集合还包括一个 [LazyList](https://www.scala-lang.org/api/current/scala/collection/immutable/LazyList.html)，它是一个 *惰性*不可变链表。
它被称为“惰性”——或非严格——因为它仅在需要时计算其元素。

你可以看到 REPL 中的 `LazyList` 有多懒惰：

{% tabs lazylist-example %}
{% tab 'Scala 2 and 3' %}

```scala
val x = LazyList.range(1, Int.MaxValue)
x.take(1)      // LazyList(<not computed>)
x.take(5)      // LazyList(<not computed>)
x.map(_ + 1)   // LazyList(<not computed>)
```

{% endtab %}
{% endtabs %}

在所有这些例子中，什么都没有发生。
事实上，除非你强迫它发生，否则什么都不会发生，例如通过调用它的 `foreach` 方法：

{% tabs lazylist-evaluation-example %}
{% tab 'Scala 2 and 3' %}

```scala
scala> x.take(1).foreach(println)
1
```

{% endtab %}
{% endtabs %}

有关严格和非严格的用途、好处和缺点的更多信息严格（惰性）集合，请参阅 [Scala 2.13 集合的架构][strict] 页面上的“严格”和“非严格”讨论。

<!--
Given that definition, collections can also be thought of in terms of being strict or lazy. In a _strict_ collection, memory for the elements is allocated immediately, and all of its elements are immediately evaluated when a transformer method is invoked. In a _lazy_ collection, memory for the elements is not allocated immediately, and transformer methods do not construct new elements until they are demanded.
-->

## 向量

[向量](https://www.scala-lang.org/api/current/scala/collection/immutable/Vector.html) 是一个索引的、不可变的序列。
描述的“索引”部分意味着它提供了在有效恒定时间内随机访问和更新向量，因此您可以通过索引值快速访问 `Vector` 元素，例如访问 `listOfPeople(123_456_789)` 。

一般来说，除了 (a) `Vector` 有索引而 `List` 没有索引，以及 (b) `List` 有 `::` 方法这两个不同外，这两种类型的工作方式相同，所以我们将快速过一下示例。

以下是创建“向量”的几种方法：

{% tabs vector-creation %}
{% tab 'Scala 2 and 3' %}

```scala
val nums = Vector(1, 2, 3, 4, 5)

val strings = Vector("one", "two")

case class Person(name: String)
val people = Vector(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```

{% endtab %}
{% endtabs %}

因为 `Vector` 是不可变的，所以你不能向它添加新元素。
相反，您通过将元素附加或插入头部到现有的 `Vector`，从而创建新序列。
这些示例展示了如何将元素*附加*到 `Vector`：

{% tabs vector-appending %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Vector(1,2,3)         // Vector(1, 2, 3)
val b = a :+ 4                // Vector(1, 2, 3, 4)
val c = a ++ Vector(4, 5)     // Vector(1, 2, 3, 4, 5)
```

{% endtab %}
{% endtabs %}

这就是你*插入头部*元素的方式：

{% tabs vector-prepending %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Vector(1,2,3)         // Vector(1, 2, 3)
val b = 0 +: a                // Vector(0, 1, 2, 3)
val c = Vector(-1, 0) ++: a   // Vector(-1, 0, 1, 2, 3)
```

{% endtab %}
{% endtabs %}

除了快速的随机访问和更新之外，`Vector` 还提供了快速的追加和前置时间，因此您可以根据需要使用这些功能。

> 请参阅 [集合性能特性](https://docs.scala-lang.org/overviews/collections-2.13/performance-characteristics.html) 了解有关 `Vector` 和其他集合的性能详细信息。

最后，您可以在 `for` 循环中使用 `Vector`，就像 `List`、`ArrayBuffer` 或任何其他序列一样：

{% tabs vector-loop class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
scala> val names = Vector("Joel", "Chris", "Ed")
val names: Vector[String] = Vector(Joel, Chris, Ed)

scala> for (name <- names) println(name)
Joel
Chris
Ed
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
scala> val names = Vector("Joel", "Chris", "Ed")
val names: Vector[String] = Vector(Joel, Chris, Ed)

scala> for name <- names do println(name)
Joel
Chris
Ed
```

{% endtab %}
{% endtabs %}

## 数组缓冲区

当您在 Scala 应用程序中需要一个通用的、可变的索引序列时，请使用 `ArrayBuffer`。
它是可变的，所以你可以改变它的元素，也可以调整它的大小。
因为它是索引的，所以元素的随机访问很快。

### 创建一个数组缓冲区

要使用 `ArrayBuffer`，首先导入它：

{% tabs arraybuffer-import %}
{% tab 'Scala 2 and 3' %}

```scala
import scala.collection.mutable.ArrayBuffer
```

{% endtab %}
{% endtabs %}

如果您需要从一个空的 `ArrayBuffer` 开始，只需指定其类型：

{% tabs arraybuffer-creation %}
{% tab 'Scala 2 and 3' %}

```scala
var strings = ArrayBuffer[String]()
var ints = ArrayBuffer[Int]()
var people = ArrayBuffer[Person]()
```

{% endtab %}
{% endtabs %}

如果您知道 `ArrayBuffer` 最终需要的大致大小，则可以使用初始大小创建它：

{% tabs list-creation-with-size %}
{% tab 'Scala 2 and 3' %}

```scala
// ready to hold 100,000 ints
val buf = new ArrayBuffer[Int](100_000)
```

{% endtab %}
{% endtabs %}

要创建具有初始元素的新 `ArrayBuffer`，只需指定其初始元素，就像 `List` 或 `Vector` 一样：

{% tabs arraybuffer-init %}
{% tab 'Scala 2 and 3' %}

```scala
val nums = ArrayBuffer(1, 2, 3)
val people = ArrayBuffer(
  Person("Bert"),
  Person("Ernie"),
  Person("Grover")
)
```

{% endtab %}
{% endtabs %}

### 将元素添加到数组缓冲区

使用 `+=` 和 `++=` 方法将新元素附加到 `ArrayBuffer`。
或者，如果您更喜欢具有文本名称的方法，您也可以使用 `append`、`appendAll`、`insert`、`insertAll`、`prepend` 和 `prependAll`。

以下是 `+=` 和 `++=` 的一些示例：

{% tabs arraybuffer-add %}
{% tab 'Scala 2 and 3' %}

```scala
val nums = ArrayBuffer(1, 2, 3)   // ArrayBuffer(1, 2, 3)
nums += 4                         // ArrayBuffer(1, 2, 3, 4)
nums ++= List(5, 6)               // ArrayBuffer(1, 2, 3, 4, 5, 6)
```

{% endtab %}
{% endtabs %}

### 从数组缓冲区中移除元素

`ArrayBuffer` 是可变的，所以它有 `-=`、`--=`、`clear`、`remove` 等方法。
这些示例演示了 `-=` 和 `--=` 方法：

{% tabs arraybuffer-remove %}
{% tab 'Scala 2 and 3' %}

```scala
val a = ArrayBuffer.range('a', 'h')   // ArrayBuffer(a, b, c, d, e, f, g)
a -= 'a'                              // ArrayBuffer(b, c, d, e, f, g)
a --= Seq('b', 'c')                   // ArrayBuffer(d, e, f, g)
a --= Set('d', 'e')                   // ArrayBuffer(f, g)
```

{% endtab %}
{% endtabs %}

### 更新数组缓冲区元素

通过重新分配所需元素或使用 `update` 方法来更新 `ArrayBuffer` 中的元素：

{% tabs arraybuffer-update %}
{% tab 'Scala 2 and 3' %}

```scala
val a = ArrayBuffer.range(1,5)        // ArrayBuffer(1, 2, 3, 4)
a(2) = 50                             // ArrayBuffer(1, 2, 50, 4)
a.update(0, 10)                       // ArrayBuffer(10, 2, 50, 4)
```

{% endtab %}
{% endtabs %}

## 映射

`Map` 是由键值对组成的可迭代集合。
Scala 有可变和不可变的 `Map` 类型，本节演示如何使用*不可变* `Map`。

### 创建不可变映射

像这样创建一个不可变的`Map`：

{% tabs map-init %}
{% tab 'Scala 2 and 3' %}

```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)
```

{% endtab %}
{% endtabs %}

一旦你有了一个`Map`，你可以像这样在`for`循环中遍历它的元素：

{% tabs map-loop class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
for ((k, v) <- states)  println(s"key: $k, value: $v")
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
for (k, v) <- states do println(s"key: $k, value: $v")
```

{% endtab %}
{% endtabs %}

REPL 展示了它是如何工作的：

{% tabs map-repl class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
scala> for ((k, v) <- states)  println(s"key: $k, value: $v")
key: AK, value: Alaska
key: AL, value: Alabama
key: AZ, value: Arizona
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
scala> for (k, v) <- states do println(s"key: $k, value: $v")
key: AK, value: Alaska
key: AL, value: Alabama
key: AZ, value: Arizona
```

{% endtab %}
{% endtabs %}

### 访问映射元素

通过在括号中指定所需的键值来访问映射元素：

{% tabs map-access-element %}
{% tab 'Scala 2 and 3' %}

```scala
val ak = states("AK") // ak: String = Alaska
val al = states("AL") // al: String = Alabama
```

{% endtab %}
{% endtabs %}

在实践中，您还将使用诸如 `keys`、`keySet`、`keysIterator`、`for` 循环之类的方法以及 `map` 之类的高阶函数来处理 `Map` 键和值。

### 向映射添加元素

使用 `+` 和 `++` 将元素添加到不可变映射中，记住将结果分配给新变量：

{% tabs map-add-element %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Map(1 -> "one")    // a: Map(1 -> one)
val b = a + (2 -> "two")   // b: Map(1 -> one, 2 -> two)
val c = b ++ Seq(
  3 -> "three",
  4 -> "four"
)
// c: Map(1 -> one, 2 -> two, 3 -> three, 4 -> four)
```

{% endtab %}
{% endtabs %}

### 从映射中删除元素

使用 `-` 或 `--` 和要删除的键值从不可变映射中删除元素，记住将结果分配给新变量：

{% tabs map-remove-element %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three",
  4 -> "four"
)

val b = a - 4       // b: Map(1 -> one, 2 -> two, 3 -> three)
val c = a - 4 - 3   // c: Map(1 -> one, 2 -> two)
```

{% endtab %}
{% endtabs %}

### 更新映射元素

要更新不可变映射中的元素，请在将结果分配给新变量时使用 `updated` 方法（或 `+` 运算符）：

{% tabs map-update-element %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Map(
  1 -> "one",
  2 -> "two",
  3 -> "three"
)

val b = a.updated(3, "THREE!")   // b: Map(1 -> one, 2 -> two, 3 -> THREE!)
val c = a + (2 -> "TWO...")      // c: Map(1 -> one, 2 -> TWO..., 3 -> three)
```

{% endtab %}
{% endtabs %}

### 遍历映射

如前所述，这是使用 `for` 循环手动遍历映射中元素的常用方法：

{% tabs map-traverse class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)

for ((k, v) <- states) println(s"key: $k, value: $v")
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama",
  "AZ" -> "Arizona"
)

for (k, v) <- states do println(s"key: $k, value: $v")
```

{% endtab %}
{% endtabs %}

话虽如此，有*许多*方法可以使用映射中的键和值。
常见的 `Map` 方法包括 `foreach`、`map`、`keys` 和 `values`。

Scala 有许多更专业的`Map` 类型，包括`CollisionProofHashMap`、`HashMap`、`LinkedHashMap`、`ListMap`、`SortedMap`、`TreeMap`、`WeakHashMap` 等等。

## 使用集合

Scala [集合]({{site.baseurl}}/overviews/collections-2.13/sets.html) 是一个没有重复元素的可迭代集合。

Scala 有可变和不可变的 `Set` 类型。
本节演示*不可变* `Set`。

### 创建一个集合

像这样创建新的空集：

{% tabs set-creation %}
{% tab 'Scala 2 and 3' %}

```scala
val nums = Set[Int]()
val letters = Set[Char]()
```

{% endtab %}
{% endtabs %}

使用初始数据创建集合，如下：

{% tabs set-init %}
{% tab 'Scala 2 and 3' %}

```scala
val nums = Set(1, 2, 3, 3, 3)           // Set(1, 2, 3)
val letters = Set('a', 'b', 'c', 'c')   // Set('a', 'b', 'c')
```

{% endtab %}
{% endtabs %}

### 向集合中添加元素

使用 `+` 和 `++` 将元素添加到不可变的 `Set`，记住将结果分配给一个新变量：

{% tabs set-add-element %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Set(1, 2)                // Set(1, 2)
val b = a + 3                    // Set(1, 2, 3)
val c = b ++ Seq(4, 1, 5, 5)     // HashSet(5, 1, 2, 3, 4)
```

{% endtab %}
{% endtabs %}

请注意，当您尝试添加重复元素时，它们会被悄悄删除。

另请注意，元素的迭代顺序是任意的。

### 从集合中删除元素

使用 `-` 和 `--` 从不可变集合中删除元素，再次将结果分配给新变量：

{% tabs set-remove-element %}
{% tab 'Scala 2 and 3' %}

```scala
val a = Set(1, 2, 3, 4, 5)   // HashSet(5, 1, 2, 3, 4)
val b = a - 5                // HashSet(1, 2, 3, 4)
val c = b -- Seq(3, 4)       // HashSet(1, 2)
```

{% endtab %}
{% endtabs %}

## 范围

Scala `Range` 通常用于填充数据结构和迭代 `for` 循环。
这些 REPL 示例演示了如何创建范围：

{% comment %}
LATER: the dotty repl currently shows results differently
{% endcomment %}

{% tabs range-init %}
{% tab 'Scala 2 and 3' %}

```scala
1 to 5         // Range(1, 2, 3, 4, 5)
1 until 5      // Range(1, 2, 3, 4)
1 to 10 by 2   // Range(1, 3, 5, 7, 9)
'a' to 'c'     // NumericRange(a, b, c)
```

{% endtab %}
{% endtabs %}

您可以使用范围来填充集合：

{% tabs range-conversion %}
{% tab 'Scala 2 and 3' %}

```scala
val x = (1 to 5).toList     // List(1, 2, 3, 4, 5)
val x = (1 to 5).toBuffer   // ArrayBuffer(1, 2, 3, 4, 5)
```

{% endtab %}
{% endtabs %}

它们也用于 `for` 循环：

{% tabs range-iteration class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
scala> for (i <- 1 to 3) println(i)
1
2
3
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
scala> for i <- 1 to 3 do println(i)
1
2
3
```

{% endtab %}
{% endtabs %}

还有 `range` 方法：

{% tabs range-methods %}
{% tab 'Scala 2 and 3' %}

```scala
Vector.range(1, 5)       // Vector(1, 2, 3, 4)
List.range(1, 10, 2)     // List(1, 3, 5, 7, 9)
Set.range(1, 10)         // HashSet(5, 1, 6, 9, 2, 7, 3, 8, 4)
```

{% endtab %}
{% endtabs %}

当您运行测试时，范围对于生成 ​​ 测试集合也很有用：

{% tabs range-tests %}
{% tab 'Scala 2 and 3' %}

```scala
val evens = (0 to 10 by 2).toList     // List(0, 2, 4, 6, 8, 10)
val odds = (1 to 10 by 2).toList      // List(1, 3, 5, 7, 9)
val doubles = (1 to 5).map(_ * 2.0)   // Vector(2.0, 4.0, 6.0, 8.0, 10.0)

// create a Map
val map = (1 to 3).map(e => (e,s"$e")).toMap
    // map: Map[Int, String] = Map(1 -> "1", 2 -> "2", 3 -> "3")
```

{% endtab %}
{% endtabs %}

## 更多细节

当您需要特定集合更多的信息，请参阅以下资源：

- [具体的不可变集合类](https://docs.scala-lang.org/overviews/collections-2.13/concrete-immutable-collection-classes.html)
- [具体的可变集合类](https://docs.scala-lang.org/overviews/collections-2.13/concrete-mutable-collection-classes.html)
- [集合是如何构造的？ 我应该选择哪一个？](https://docs.scala-lang.org/tutorials/FAQ/collections.html)

[strict]: {% link _overviews/core/architecture-of-scala-213-collections.md %}
[collections1]: /resources/images/tour/collections-diagram-213.svg
[collections2]: /resources/images/tour/collections-immutable-diagram-213.svg
[collections3]: /resources/images/tour/collections-mutable-diagram-213.svg
