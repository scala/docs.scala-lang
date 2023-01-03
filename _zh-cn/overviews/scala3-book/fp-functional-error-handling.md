---
title: 函数式错误处理
type: section
description: This section provides an introduction to functional error handling in Scala 3.
language: zh-cn
num: 45
previous-page: fp-functions-are-values
next-page: fp-summary

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


函数式编程就像写一系列代数方程，因为代数没有空值或抛出异常，所以你不用在 FP 中使用这些特性。
这带来了一个有趣的问题：在 OOP 代码中通常可能使用空值或异常的情况下，您会怎么做？

Scala 的解决方案是使用类似 `Option`/`Some`/`None` 类的结构。
本课介绍如何使用这些技术。

在我们开始之前有两个注意事项：

- `Some` 和 `None` 类是 `Option` 的子类。
- 下面的文字一般只指“`Option`”或“`Option`类”，而不是重复说“`Option`/`Some`/`None`”。

## 第一个例子

虽然第一个示例不处理空值，但它是引入 `Option` 类的好方法，所以我们将从它开始。

想象一下，您想编写一个方法，可以轻松地将字符串转换为整数值，并且您想要一种优雅的方法来处理异常，这个是异常是该方法获取类似“Hello”而不是“1”的字符串时引发的。
对这种方法的初步猜测可能如下所示：

```scala
def makeInt(s: String): Int =
  try
    Integer.parseInt(s.trim)
  catch
    case e: Exception => 0
```

如果转换成功，则此方法返回正确的 `Int` 值，但如果失败，则该方法返回 `0`。
出于某些目的，这可能是可以的，但它并不准确。
例如，该方法可能收到了`"0"`，但它也可能收到了 `"foo"`、`"bar"` 或无数其他将引发异常的字符串。
这是一个真正的问题：您如何知道该方法何时真正收到 `"0"`，或者何时收到其他内容？
答案是，用这种方法，没有办法知道。

## 使用 Option/Some/None 

Scala 中这个问题的一个常见解决方案是使用三个类，称为 `Option`、`Some` 和 `None` 。
`Some` 和 `None` 类是 `Option` 的子类，因此解决方案的工作原理如下：

- 你声明 `makeInt` 返回一个 `Option` 类型
- 如果 `makeInt` 接收到一个字符串，它*可以* 转换为 `Int`，答案将包含在 `Some` 中
- 如果 `makeInt` 接收到一个它*无法*转换的字符串，它返回一个 `None`

这是 `makeInt` 的修订版：

```scala
def makeInt(s: String): Option[Int] =
  try
    Some(Integer.parseInt(s.trim))
  catch
    case e: Exception => None
```

这段代码可以理解为，“当给定的字符串转换为整数时，返回包裹在 `Some` 中的 `Int`，例如 `Some(1)`。
当字符串无法转换为整数时，会抛出并捕获异常，并且该方法返回一个 `None` 值。”

这些示例展示了 `makeInt` 的工作原理：

```scala
val a = makeInt("1")     // Some(1)
val b = makeInt("one")   // None
```

如图所示，字符串`"1"`产生一个 `Some(1)`，而字符串 `"one"` 产生一个 `None`。
这是错误处理的 `Option` 方法的本质。
如图所示，使用了这种技术，因此方法可以返回 *值* 而不是 *异常*。
在其他情况下，`Option` 值也用于替换 `null` 值。

两个注意事项：

- 你会发现这种方法在整个 Scala 库类和第三方 Scala 库中使用。
- 这个例子的一个关键点是函数式方法不会抛出异常；相反，它们返回类似 `Option` 的值。

## 成为 makeInt 的消费者

现在假设您是 `makeInt` 方法的使用者。
你知道它返回一个 `Option[Int]` 的子类，所以问题就变成了，你如何处理这些返回类型？

根据您的需要，有两个常见的答案：

- 使用 `match` 表达式
- 使用 `for` 表达式

## 使用 `match` 表达式

一种可能的解决方案是使用 `match` 表达式：

```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn’t work.")
```

在本例中，如果 `x` 可以转换为 `Int`，则计算第一个 `case` 子句右侧的表达式；如果 `x` 不能转换为 `Int`，则计算第二个 `case` 子句右侧的表达式。

## 使用 `for` 表达式

另一种常见的解决方案是使用 `for` 表达式，即本书前面显示的 `for`/`yield` 组合。
例如，假设您要将三个字符串转换为整数值，然后将它们相加。
这就是你使用 `for` 表达式和 `makeInt` 的方法：

```scala
val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

在该表达式运行后，`y` 将是以下两种情况之一：

- 如果*所有*三个字符串都转换为 `Int` 值，`y` 将是 `Some[Int]`，即包裹在 `Some` 中的整数
- 如果三个字符串中*任意一个*字符串不能转换为 `Int`，则 `y` 将是 `None`

你可以自己测试一下：

```scala
val stringA = "1"
val stringB = "2"
val stringC = "3"

val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

使用该样本数据，变量 `y` 的值将是 `Some(6)` 。

要查看失败案例，请将这些字符串中的任何一个更改为不会转换为整数的字符串。
当你这样做时，你会看到 `y` 是 `None`：

```scala
y: Option[Int] = None
```

## 将 Option 视为容器

心智模型通常可以帮助我们理解新情况，因此，如果您不熟悉 `Option` 类，可以将它们视为*容器*：

- `Some` 是一个容器，里面有一个项目
- `None` 是一个容器，但里面什么都没有

如果您更愿意将 `Option` 类想象成一个盒子，`None` 就像一个空盒子。
它可能有一些东西，但它没有。

{% comment %}
NOTE: I commented-out this subsection because it continues to explain Some and None, and I thought it was probably too much for this book.

## Using `foreach` with `Option`

Because `Some` and `None` can be thought of containers, they’re also like collections classes.
They have many of the methods you’d expect from a collection class, including `map`, `filter`, `foreach`, etc.

This raises an interesting question: What will these two values print, if anything?

```scala
makeInt("1").foreach(println)
makeInt("x").foreach(println)
```

Answer: The first example prints the number `1`, and the second example doesn’t print anything.
The first example prints `1` because:

- `makeInt("1")` evaluates to `Some(1)`
- The expression becomes `Some(1).foreach(println)`
- The `foreach` method on the `Some` class knows how to reach inside the `Some` container and extract the value (`1`) that’s inside it, so it passes that value to `println`

Similarly, the second example prints nothing because:

- `makeInt("x")` evaluates to `None`
- The `foreach` method on the `None` class knows that `None` doesn’t contain anything, so it does nothing

In this regard, `None` is similar to an empty `List`.

### The happy and unhappy paths

Somewhere in Scala’s history, someone noted that the first example (the `Some`) represents the “Happy Path” of the `Option` approach, and the second example (the `None`) represents the “Unhappy Path.”
*But* despite having two different possible outcomes, the great thing with `Option` is that there’s really just one path: The code you write to handle the `Some` and `None` possibilities is the same in both cases.
The `foreach` examples look like this:

```scala
makeInt(aString).foreach(println)
```

And the `for` expression looks like this:

```scala
val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```

With exceptions you have to worry about handling branching logic, but because `makeInt` returns a value, you only have to write one piece of code to handle both the Happy and Unhappy Paths, and that simplifies your code.

Indeed, the only time you have to think about whether the `Option` is a `Some` or a `None` is when you handle the result value, such as in a `match` expression:

```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn't work.")
```

> There are several other ways to handle `Option` values.
> See the reference documentation for more details.
{% endcomment %}

## 使用 `Option` 替换 `null`

回到 `null` 值，`null` 值可以悄悄地潜入你的代码的地方是这样的类：

```scala
class Address(
  var street1: String,
  var street2: String,
  var city: String,
  var state: String,
  var zip: String
)
```

虽然地球上的每个地址都有一个 `street1` 值，但 `street2` 值是可选的。
因此，`street2` 字段可以被分配一个 `null` 值：

```scala
val santa = Address(
  "1 Main Street",
  null,               // <-- D’oh! A null value!
  "North Pole",
  "Alaska",
  "99705"
)
```

从历史上看，开发人员在这种情况下使用了空白字符串和空值，这两种方法都是使用技巧来解决基础性的问题，这个问题是：`street2` 是一个*可选*字段。
在 Scala 和其他现代语言中，正确的解决方案是预先声明 `street2` 是可选的：

```scala
class Address(
  var street1: String,
  var street2: Option[String],   // an optional value
  var city: String, 
  var state: String, 
  var zip: String
)
```

现在开发人员可以编写更准确的代码，如下所示：

```scala
val santa = Address(
  "1 Main Street",
  None,           // 'street2' has no value
  "North Pole",
  "Alaska",
  "99705"
)
```

或这个：

```scala
val santa = Address(
  "123 Main Street",
  Some("Apt. 2B"),
  "Talkeetna",
  "Alaska",
  "99676"
)
```

## `Option` 不是唯一的解决方案

虽然本节关注的是 `Option` 类，但 Scala 还有一些其他选择。

例如，称为 `Try`/`Success`/`Failure` 的三个类以相同的方式工作，但是 (a) 当您的代码可以抛出异常时，您主要使用这些类，并且 (b) 您想要使用`Failure` 类，因为它使您可以访问异常消息。
例如，在编写与文件、数据库和 Internet 服务交互的方法时，通常会使用这些 `Try` 类，因为这些函数很容易引发异常。

## 快速回顾

这部分很长，让我们快速回顾一下：

- 函数式程序员不使用 `null` 值
- `null` 值的主要替代品是使用 `Option` 类
- 函数式方法不会抛出异常； 相反，它们返回诸如 `Option` 、 `Try` 或 `Either` 之类的值
- 使用 `Option` 值的常用方法是 `match` 和 `for` 表达式
- Option 可以被认为是一个项目（`Some`）和没有项目（`None`）的容器
- option 也可用于可选的构造函数或方法参数

