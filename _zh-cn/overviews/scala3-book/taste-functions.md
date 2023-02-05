---
title: 头等函数
type: section
description: This page provides an introduction to functions in Scala 3.
language: zh-cn
num: 11
previous-page: taste-methods
next-page: taste-objects

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala具有函数式编程语言中您期望的大多数功能，包括：

- Lambdas（匿名函数）
- 高阶函数 （HOFs）
- 标准库中的不可变集合

Lambdas（也称为 _匿名函数_）是保持代码简洁但可读性的重要组成部分。

`List` 类的 `map` 方法是高阶函数的典型示例---一个将函数作为参数的函数。

这两个示例是等效的，并演示如何通过将 lambda 传递到 `map` 方法中，将列表中的每个数字乘以 `2`：


{% tabs function_1 %}
{% tab 'Scala 2 and 3' for=function_1 %}

```scala
val a = List(1, 2, 3).map(i => i * 2)   // List(2,4,6)
val b = List(1, 2, 3).map(_ * 2)        // List(2,4,6)
```

{% endtab %}
{% endtabs %}

这些示例也等效于以下代码，该代码使用 `double` 方法而不是lambda：

{% tabs function_2 %}
{% tab 'Scala 2 and 3' for=function_2 %}

```scala
def double(i: Int): Int = i * 2

val a = List(1, 2, 3).map(i => double(i))   // List(2,4,6)
val b = List(1, 2, 3).map(double)           // List(2,4,6)
```

{% endtab %}
{% endtabs %}

> 如果您以前从未见过 `map` 方法，它会将给定的函数应用于列表中的每个元素，从而生成一个包含结果值的新列表。

将 lambda 传递给集合类上的高阶函数（如 `List`）是 Scala 体验的一部分，您每天都会这样做。

## 不可变集合

当您使用不可变集合（如 `List`，`Vector`）以及不可变的 `Map` 和 `Set` 类时，重要的是要知道这些函数不会改变它们被调用的集合；相反，它们返回包含更新数据的新集合。
因此，以“流式”的风格将它们链接在一起以解决问题也很常见。

例如，此示例演示如何对一个集合进行两次筛选，然后将其余集合中的每个元素乘某个数：

{% tabs function_3 %}
{% tab 'Scala 2 and 3' for=function_3 %}

```scala
// a sample list
val nums = (1 to 10).toList   // List(1,2,3,4,5,6,7,8,9,10)

// methods can be chained together as needed
val x = nums.filter(_ > 3)
            .filter(_ < 7)
            .map(_ * 10)

// result: x == List(40, 50, 60)
```

{% endtab %}
{% endtabs %}

除了在整个标准库中使用的高阶函数外，您还可以[创建自己的][higher-order] 高阶函数。

[higher-order]: {% link _zh-cn/overviews/scala3-book/fun-hofs.md %}
