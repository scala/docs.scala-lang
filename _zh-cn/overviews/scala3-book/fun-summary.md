---
title: 总结
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
num: 34
previous-page: fun-write-method-returns-function
next-page: packaging-imports

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


这是一个很长的章节，所以让我们回顾一下所涵盖的关键点。

我们通常这样定义高阶函数 (HOF)，它以其他函数作为输入参数或将函数作为其值。
在 Scala 中这是可能的，因为函数是一等值。

浏览这些部分，首先您会看到：

- 您可以将匿名函数编写为小代码片段
- 您可以将它们传递给集合类上的几十个 HOF（方法），即像 `filter`、`map` 等方法。
- 使用这些小代码片段和强大的 HOF，您只需少量代码即可创建大量的函数

在查看了匿名函数和 HOF 之后，您看到了：

- 函数变量只是绑定到变量的匿名函数

在了解如何成为 HOF 的*消费者*之后，您将了解如何成为 HOF 的*创造者*。
具体来说，您看到了：

- 如何编写将函数作为输入参数的方法
- 如何从方法中返回函数

本章的一个有益的副作用是您看到了许多关于如何为函数声明类型签名的示例。
这样做的好处是，您可以使用相同的语法来定义函数参数、匿名函数和函数变量，而且对于 `map`、`filter` 等高阶函数，阅读 Scaladoc 也变得更容易。

