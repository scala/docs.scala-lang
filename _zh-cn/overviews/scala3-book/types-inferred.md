---
title: 类型推断
type: section
description: This section introduces and demonstrates inferred types in Scala 3
language: zh-cn
num: 48
previous-page: types-introduction
next-page: types-generics

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


与其他静态类型编程语言一样，在 Scala 中，您可以在创建新变量时_声明_类型：

{% tabs xy %}
{% tab 'Scala 2 and 3' %}
```scala
val x: Int = 1
val y: Double = 1
```
{% endtab %}
{% endtabs %}

在这些示例中，类型分别_明确地_声明为 `Int` 和 `Double` 。
但是，在 Scala 中，您通常不必在定义值绑定器时声明类型：

{% tabs abm %}
{% tab 'Scala 2 and 3' %}
```scala
val a = 1
val b = List(1, 2, 3)
val m = Map(1 -> "one", 2 -> "two")
```
{% endtab %}
{% endtabs %}

当你这样做时，Scala _推断_类型，如下面的 REPL 交互所示：

{% tabs abm2 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> val a = 1
val a: Int = 1

scala> val b = List(1, 2, 3)
val b: List[Int] = List(1, 2, 3)

scala> val m = Map(1 -> "one", 2 -> "two")
val m: Map[Int, String] = Map(1 -> one, 2 -> two)
```
{% endtab %}
{% endtabs %}

事实上，大多数变量都是这样定义的，而 Scala 自动推断类型的能力是使它_感觉_像一种动态类型语言的一个特性。
