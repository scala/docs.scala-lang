---
title: 方法 
type: chapter
description: This section introduces methods in Scala 3.
languages:[en, ru]
num: 23
previous-page: domain-modeling-fp
next-page: methods-most

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


在 Scala 2 中，_方法_可以在类、traits、对象、样例类和样例对象中定义。
但它变得更好了：在Scala 3中，可以在这些结构的_外部_定义方法；我们说它们是“顶级”定义，因为它们没有嵌套在另一个定义中。
简而言之，现在可以在任何地方定义方法。

方法的许多功能将在下一节中演示。
由于 `main` 方法需要更多的解释，因此后面有单独部分对其进行描述。
