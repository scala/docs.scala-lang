---
title: 函数变量
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
languages:[en, ru]
num: 29
previous-page: fun-anonymous-functions
next-page: fun-eta-expansion

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


从上一节回到这个例子：

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

我们注意到这部分表达式是一个匿名函数：

```scala
(i: Int) => i * 2
```

它被称为 *匿名* 的原因是它没有分配给变量，因此没有名称。

但是，可以将匿名函数（也称为*函数字面量*）分配给变量以创建*函数变量*：

```scala
val double = (i: Int) => i * 2
```

这将创建一个名为 `double` 的函数变量。
在这个表达式中，原始函数字面量在 `=` 符号的右侧：

```scala
val double = (i: Int) => i * 2
             -----------------
```

新变量名在左侧：

```scala
val double = (i: Int) => i * 2
    ------
```

并且函数的参数列表在此处加下划线：

```scala
val double = (i: Int) => i * 2
             --------
```

就像方法的参数列表一样，这意味着 `double` 函数有一个参数，一个名为 `i` 的 `Int`。
你可以在 REPL 中看到 `double` 的类型为 `Int => Int`，这意味着它接受一个 `Int` 参数并返回一个 `Int`：

```scala
scala> val double = (i: Int) => i * 2
val double: Int => Int = ...
```

### 调用函数

现在你可以像这样调用`double`函数：

```scala
val x = double(2)   // 4
```

您还可以将 `double` 传递给 `map` 调用：

```scala
List(1, 2, 3).map(double)   // List(2, 4, 6)
```

此外，当您有 `Int => Int` 类型的其他函数时：

```scala
val triple = (i: Int) => i * 3
```

您可以将它们存储在 `List` 或 `Map` 中：

```scala
val functionList = List(double, triple)

val functionMap = Map(
  "2x" -> double,
  "3x" -> triple
)
```

如果将这些表达式粘贴到 REPL 中，您会看到它们具有以下类型：

````
// a List that contains functions of the type `Int => Int`
functionList: List[Int => Int]

// a Map whose keys have the type `String`, and whose
// values have the type `Int => Int`
functionMap: Map[String, Int => Int]
````

## 关键点

这里的重要部分是：

- 要创建函数变量，只需将变量名分配给函数字面量
- 一旦你有了一个函数，你可以像对待任何其他变量一样对待它，即像一个`String`或`Int`变量

并且由于 Scala 3 中改进的 [Eta Expansion][eta_expansion] 函数式，您可以以相同的方式处理 *方法*。

[eta_expansion]: {% link _zh-cn/overviews/scala3-book/fun-eta-expansion.md %}
