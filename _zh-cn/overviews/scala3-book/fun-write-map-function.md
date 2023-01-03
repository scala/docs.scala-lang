---
title: 自定义 map 函数
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
language: zh-cn
num: 32
previous-page: fun-hofs
next-page: fun-write-method-returns-function

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


现在您已经了解了如何编写自己的高阶函数，让我们快速浏览一个更真实的示例。

想象一下，`List` 类没有自己的 `map` 方法，而您想编写自己的方法。
创建函数的第一步是准确地陈述问题。
只关注 `List[Int]`，你说：

> 我想编写一个 `map` 方法，该方法可用于将函数应用于给定的 `List[Int]` 中的每个元素，
> 并将转换后的元素作为新列表返回。

鉴于该声明，您开始编写方法签名。
首先，您知道您想接受一个函数作为参数，并且该函数应该将 `Int` 转换为某种通用类型 `A`，因此您编写：

```scala
def map(f: (Int) => A)
```

使用泛型类型的语法要求在参数列表之前声明该类型符号，因此您添加：

```scala
def map[A](f: (Int) => A)
```

接下来，您知道 `map` 也应该接受 `List[Int]`：

```scala
def map[A](f: (Int) => A, xs: List[Int])
```

最后，您还知道 `map` 返回一个转换后的 `List`，其中包含泛型类型 `A` 的元素：

```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] = ???
```

这负责方法签名。
现在您所要做的就是编写方法体。
`map` 方法将它赋予的函数应用于它赋予的列表中的每个元素，以生成一个新的、转换的列表。
一种方法是使用 `for` 表达式：

```scala
for x <- xs yield f(x)
```

`for` 表达式通常使代码出奇地简单，对于我们的目的，它最终成为整个方法体。

把它和方法签名放在一起，你现在有了一个独立的 `map` 方法，它与 `List[Int]` 一起工作：

```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for x <- xs yield f(x)
```

### 使其泛型化

作为奖励，请注意 `for` 表达式不做任何取决于 `List` 中的类型为 `Int` 的事情。
因此，您可以将类型签名中的 `Int` 替换为泛型类型参数 `B`：

```scala
def map[A, B](f: (B) => A, xs: List[B]): List[A] =
  for x <- xs yield f(x)
```

现在你有了一个适用于任何 `List` 的 `map` 方法。

这些示例表明 `map` 可以按需要工作：

```scala
def double(i : Int) = i * 2
map(double, List(1, 2, 3))            // List(2, 4, 6)

def strlen(s: String) = s.length
map(strlen, List("a", "bb", "ccc"))   // List(1, 2, 3)
```

现在您已经了解了如何编写接受函数作为输入参数的方法，让我们看看返回函数的方法。

