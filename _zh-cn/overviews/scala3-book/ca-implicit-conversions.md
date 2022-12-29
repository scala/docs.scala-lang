---
title: 隐式转换
type: section
description: This page demonstrates how to implement Implicit Conversions in Scala 3.
languages:[en]
num: 66
previous-page: ca-multiversal-equality
next-page: ca-summary

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

隐式转换由 `scala.Conversion` 类的 `given` 实例定义。
例如，不考虑可能的转换错误，这段代码定义了从 `String` 到 `Int` 的隐式转换：

```scala
given Conversion[String, Int] with
  def apply(s: String): Int = Integer.parseInt(s)
```

使用别名可以更简洁地表示为：

```scala
given Conversion[String, Int] = Integer.parseInt(_)
```

使用这些转换中的任何一种，您现在可以在需要 `Int` 的地方使用 `String`：

```scala
import scala.language.implicitConversions

// a method that expects an Int
def plus1(i: Int) = i + 1

// pass it a String that converts to an Int
plus1("1")
```

> 注意开头的子句 `import scala.language.implicitConversions`，
> 在文件中启用隐式转换。

## 讨论

Predef 包包含“自动装箱”转换，将基本数字类型映射到 `java.lang.Number` 的子类。
例如，从 `Int` 到 `java.lang.Integer` 的转换可以定义如下： 

```scala
given int2Integer: Conversion[Int, java.lang.Integer] =
  java.lang.Integer.valueOf(_)
```
