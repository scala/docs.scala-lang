---
title: 匿名函数
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
language: zh-cn
num: 29
previous-page: fun-intro
next-page: fun-function-variables

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

匿名函数（也称为 *lambda*）是作为参数传递给高阶函数的代码块。
维基百科将 [匿名函数](https://en.wikipedia.org/wiki/Anonymous_function) 定义为“未绑定到标识符的函数定义”。

例如，给定这样的列表：

{% tabs fun-anonymous-1 %}
{% tab 'Scala 2 and 3' %}
```scala
val ints = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

您可以通过使用 `List` 类 `map` 方法和自定义匿名函数将 `ints` 中的每个元素加倍来创建一个新列表：

{% tabs fun-anonymous-2 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)    // List(2, 4, 6)
```
{% endtab %}
{% endtabs %}

如注释所示，`doubledInts` 包含列表`List(2, 4, 6)`。
在该示例中，这部分代码是一个匿名函数：

{% tabs fun-anonymous-3 %}
{% tab 'Scala 2 and 3' %}
```scala
_ * 2
```
{% endtab %}
{% endtabs %}

这是“将给定元素乘以 2”的简写方式。

## 更长的形式

一旦你熟悉了 Scala，你就会一直使用这种形式来编写匿名函数，这些函数在函数的一个位置使用一个变量。
但如果你愿意，你也可以用更长的形式来写它们，所以除了写这段代码：

{% tabs fun-anonymous-4 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

您也可以使用以下形式编写它：

{% tabs fun-anonymous-5 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map((i) => i * 2)
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

所有这些行的含义完全相同：将 `ints` 中的每个元素加倍以创建一个新列表 `doubledInts`。
（稍后会解释每种形式的语法。）

如果您熟悉 Java，了解这些 `map` 示例与以下 Java 代码等价可能会有所帮助：

{% tabs fun-anonymous-5-b %}
{% tab 'Java' %}
```java
List<Integer> ints = List.of(1, 2, 3);
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```
{% endtab %}
{% endtabs %}

## 缩短匿名函数

当你想要明确时，你可以使用这个长格式编写一个匿名函数：

{% tabs fun-anonymous-6 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

该表达式中的匿名函数是这样的：

{% tabs fun-anonymous-7 %}
{% tab 'Scala 2 and 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

如果您不熟悉这种语法，将 `=>` 符号视为转换器会有所帮助，因为表达式使用 `=>` 符号右侧的算法（在这种情况下，一个将 `Int` 加倍的表达式）把符号左侧的参数列表（名为 `i`  的 `Int` 变量) *转换*为新结果。

### 缩短该表达式

这种长形式可以缩短，如以下步骤所示。
首先，这是最长和最明确的形式：

{% tabs fun-anonymous-8 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

因为 Scala 编译器可以从 `ints` 中的数据推断 `i` 是一个 `Int`，所以可以删除 `Int` 声明：

{% tabs fun-anonymous-9 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i) => i * 2)
```
{% endtab %}
{% endtabs %}

因为只有一个参数，所以不需要在参数 `i` 周围的括号：

{% tabs fun-anonymous-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

因为当参数在函数中只出现一次时，Scala 允许您使用 `_` 符号而不是变量名，所以代码可以进一步简化：

{% tabs fun-anonymous-11 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

### 变得更短

在其他示例中，您可以进一步简化匿名函数。
例如，从最显式的形式开始，您可以使用带有 `List` 类 `foreach` 方法的匿名函数打印 `ints` 中的每个元素：

{% tabs fun-anonymous-12 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach((i: Int) => println(i))
```
{% endtab %}
{% endtabs %}

和以前一样，不需要 `Int` 声明，因为只有一个参数，所以不需要 `i` 周围的括号：

{% tabs fun-anonymous-13 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(i => println(i))
```
{% endtab %}
{% endtabs %}

因为 `i` 在函数体中只使用一次，表达式可以进一步简化为 `_` 符号：

{% tabs fun-anonymous-14 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(println(_))
```
{% endtab %}
{% endtabs %}

最后，如果一个匿名函数由一个接受单个参数的方法调用组成，您不需要显式命名和指定参数，因此您最终可以只写方法的名称（此处为 `println`）：

{% tabs fun-anonymous-15 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(println)
```
{% endtab %}
{% endtabs %}

