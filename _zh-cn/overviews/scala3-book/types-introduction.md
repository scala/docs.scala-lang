---
title: 类型和类型系统
type: chapter
description: This chapter provides an introduction to Scala 3 types and the type system.
num: 47
previous-page: fp-summary
next-page: types-inferred

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 是一种独特的语言，因为它是静态类型的，但通常_感觉_它灵活和动态。
例如，由于类型推断，您可以编写这样的代码而无需显式指定变量类型：

```scala
val a = 1
val b = 2.0
val c = "Hi!"
```

这使代码感觉是动态类型的。
并且由于新特性，例如 Scala 3 中的 [联合类型][union-types]，您还可以编写如下代码，非常简洁地表达出期望哪些值作为参数，哪些值作为返回的类型：

```scala
def isTruthy(a: Boolean | Int | String): Boolean = ???
def dogCatOrWhatever(): Dog | Plant | Car | Sun = ???
```

正如例子所暗示的，当使用联合类型时，这些类型不必共享一个公共层次结构，您仍然可以接受它们作为参数或从方法中返回它们。

如果您是应用程序开发人员，您将每天使用类型推断和每周使用泛型等功能。
当您阅读 Scaladoc 中的类和方法时，您还需要对_可变的(variance)_有所了解。
希望您会发现使用类型可以相当简单，而且使用类型可以为库开发人员提供了很多表达能力、灵活性和控制力。

## 类型的好处

静态类型的编程语言提供了许多好处，包括：

- 帮助提供强大的 IDE 支持
- 在编译时消除许多类的潜在错误
- 协助重构
- 提供强大的文档，因为它经过类型检查，所以不会过时

## Scala 类型系统的特性介绍

鉴于此简要介绍，以下部分将概述 Scala 类型系统的特性。

[union-types]: {% link _zh-cn/overviews/scala3-book/types-union.md %}
