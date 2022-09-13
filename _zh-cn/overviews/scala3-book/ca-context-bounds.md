---
title: 上下文绑定
type: section
description: This page demonstrates Context Bounds in Scala 3.
num: 61
previous-page: types-type-classes
next-page: ca-given-imports
---


{% comment %}
- TODO: define "context parameter"
- TODO: define "synthesized" and "synthesized arguments"
{% endcomment %}


在许多情况下，_上下文参数_的名称不必明确提及，因为它仅由编译器在其他上下文参数的合成参数中使用。
在这种情况下，您不必定义参数名称，只需提供参数类型即可。

## 背景

例如，这个 `maximum` 方法接受 `Ord` 类型的_上下文参数_，只是将它作为参数传递给 `max`：

```scala
def maximum[A](xs: List[A])(using ord: Ord[A]): A =
  xs.reduceLeft(max(ord))
```

在该代码中，参数名称 `ord` 实际上不是必需的；它可以作为推断参数传递给 `max`，因此您只需声明 `maximum` 使用的类型 `Ord[A]` 而不必给它命名：

```scala
def maximum[A](xs: List[A])(using Ord[A]): A =
  xs.reduceLeft(max)
```

## 上下文绑定

鉴于此背景，_上下文绑定_是一种简写语法，用于表达“依赖于类型参数的上下文参数”模式。

使用上下文绑定，`maximum` 方法可以这样写：

```scala
def maximum[A: Ord](xs: List[A]): A = xs.reduceLeft(max)
```

方法或类的类型参数 `A`，有类似 `:Ord` 的绑定，它表示有 `Ord[A]` 的上下文参数。

有关上下文绑定的更多信息，请参阅 Scala 常见问题解答的 [“什么是上下文绑定？”](https://docs.scala-lang.org/tutorials/FAQ/context-bounds.html) 部分。
