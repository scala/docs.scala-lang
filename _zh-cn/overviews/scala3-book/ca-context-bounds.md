---
title: 上下文绑定
type: section
description: This page demonstrates Context Bounds in Scala 3.
language: zh-cn
num: 61
previous-page: ca-context-parameters
next-page: ca-given-imports

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


在许多情况下，[上下文参数]({% link _overviews/scala3-book/ca-context-parameters.md %}#context-parameters) 的名称不必显式提及，因为它仅在编译器为其他上下文参数合成实参的时候用到。
在这种情况下，您不必定义参数名称，只需提供参数类型即可。

## 背景

例如，假设一个 `maxElement` 方法返回一个集合里的最大值：

{% tabs context-bounds-max-named-param class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(ord))
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def maxElement[A](as: List[A])(using ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(using ord))
```
{% endtab %}
{% endtabs %}

上面这个 `maxElement` 方法只接受一个类型为 `Ord[A]` 的 _上下文参数_ 并将其作为实参传给 `max` 方法。

完整起见，以下是 `max` 和 `Ord` 的定义（注意，在实践中我们会使用 `List` 中已有的 `max` 方法 ，
但我们为了说明目的而编造了这个例子）：

{% tabs context-bounds-max-ord class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
/** Defines how to compare values of type `A` */
trait Ord[A] {
  def greaterThan(a1: A, a2: A): Boolean
}

/** Returns the maximum of two values */
def max[A](a1: A, a2: A)(implicit ord: Ord[A]): A =
  if (ord.greaterThan(a1, a2)) a1 else a2
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
/** Defines how to compare values of type `A` */
trait Ord[A]:
  def greaterThan(a1: A, a2: A): Boolean

/** Returns the maximum of two values */
def max[A](a1: A, a2: A)(using ord: Ord[A]): A =
  if ord.greaterThan(a1, a2) then a1 else a2
```
{% endtab %}
{% endtabs %}

`max` 方法用了类型为 `Ord[A]` 的上下文参数, 就像 `maxElement` 方法一样。

## 省略上下文参数

因为 `ord` 是 `max` 方法的上下文参数，当我们调用方法 `max` 时， 编译器可以在 `maxElement` 的实现中为我们提供它：

{% tabs context-bounds-context class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _))
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def maxElement[A](as: List[A])(using Ord[A]): A =
  as.reduceLeft(max(_, _))
```

注意，因为我们不用显示传递给 `max` 方法，我们可以在 `maxElement` 定义里不命名。
这是 _匿名上下文参数_ 。
{% endtab %}
{% endtabs %}

## 上下文绑定

鉴于此背景，_上下文绑定_ 是一种简写语法，用于表达“依赖于类型参数的上下文参数”模式。

使用上下文绑定，`maximum` 方法可以这样写：

{% tabs context-bounds-max-rewritten %}
{% tab 'Scala 2 and 3' %}
```scala
def maxElement[A: Ord](as: List[A]): A =
  as.reduceLeft(max(_, _))
```
{% endtab %}
{% endtabs %}

方法或类的类型参数 `A`，有类似 `:Ord` 的绑定，它表示有 `Ord[A]` 的上下文参数。
在后台，编译器将此语法转换为“背景”部分中显示的语法。

有关上下文绑定的更多信息，请参阅 Scala 常见问题解答的 [“什么是上下文绑定？”](https://docs.scala-lang.org/tutorials/FAQ/context-bounds.html) 部分。
