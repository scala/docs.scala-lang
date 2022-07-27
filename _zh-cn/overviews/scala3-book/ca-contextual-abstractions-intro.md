---
title: 上下文抽象
type: chapter
description: This chapter provides an introduction to the Scala 3 concept of Contextual Abstractions.
num: 58
previous-page: types-others
next-page: ca-given-using-clauses
---


## 背景

隐式是Scala 2中的一个主要的设计特色。隐式是进行上下文抽象的基本方式。它们代表了具有多种用例的统一范式，其中包括：

- 实现类型类
- 建立上下文
- 依赖注入
- 表达能力
- 计算新类型，并证明它们之间的关系

此后，其他语言也纷纷效仿，例如 Rust 的 traits 或 Swift 的协议扩展。对于编译期的依赖解析方案，Kotlin 的设计方案也被提上日程，而对 C# 而言是 Shapes 和 Extensions 或对 F# 来说是 Traits。Implicits 也是 Coq 或 Agda 等定理证明器的共同特色。

尽管这些设计使用不同的术语，但它们都是*术语推理*核心思想的变体：
给定一个类型，编译器会合成一个具有该类型的“canonical”术语。

## 重新设计

Scala 3 重新设计了 Scala 中的上下文抽象。
虽然这些概念是在 Scala 2 中逐渐“发现”的，但它们现在已广为人知和理解，并且重新设计利用了这些知识。

Scala 3 的设计侧重于 **意图** 而不是 **机制**。
Scala 3 没有提供一个非常强大的隐式特性，而是提供了几个面向用例的特性：

- **抽象上下文信息**。
  [使用子句][givens] 允许程序员对调用上下文中可用的信息进行抽象，并且应该隐式传递。
  作为对 Scala 2 隐式的改进，可以按类型指定 using 子句，从而将函数签名从从未显式引用的术语变量名称中释放出来。

- **提供类型类实例**。
  [给定实例][type-classes]允许程序员定义某种类型的_规范值(canonical value)_。
  这使得使用类型类的编程更加简单，而不会泄露实现细节。

- **追溯扩展类**。
  在 Scala 2 中，扩展方法必须使用隐式转换或隐式类进行编码。
  相比之下，在 Scala 3 [扩展方法][extension-methods] 现在直接内置到语言中，产生了更好的错误消息和改进的类型推断。

- **将一种类型视为另一种类型**。
  隐式转换已从头开始[重新设计][implicit-conversions]，作为类型类 `Conversion` 的实例。

- **高阶上下文抽象**。
  [上下文函数][contextual-functions] 的_全新_特性使上下文抽象成为一等公民。
  它们是库作者的重要工具，可以表达简洁的领域特定语言。

- **来自编译器的可操作反馈**。
  如果编译器无法解析隐式参数，它现在会为您提供 [导入建议](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html) 来解决问题。

## 好处

Scala 3 中的这些更改实现了术语推理与语言其余部分的更好分离：

- 仅有一种定义 given 的方法
- 仅有一种方法可以引入隐式参数和自变量
- [导入 givens][given-imports] 仅有一种单独的方法，不允许它们隐藏在正常导入的海洋中
- 定义 [隐式转换][implicit-conversions] 的方法仅有一种，它被清楚地标记为这样，并且不需要特殊的语法

这些变化的好处包括：

- 新设计避免了特性交织，从而使语言更加一致
- 它使隐式更容易学习和更难滥用
- 它极大地提高了 95% 使用隐式的 Scala 程序的清晰度
- 它有可能以一种易于理解和友好的原则方式进行术语推理

本章将在以下各节中介绍其中的许多新功能。


[givens]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[given-imports]: {% link _overviews/scala3-book/ca-given-imports.md %}
[implicit-conversions]: {% link _overviews/scala3-book/ca-implicit-conversions.md %}
[extension-methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[context-bounds]: {% link _overviews/scala3-book/ca-context-bounds.md %}
[type-classes]: {% link _overviews/scala3-book/ca-type-classes.md %}
[equality]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[contextual-functions]: {% link _overviews/scala3-book/types-dependent-function.md %}
