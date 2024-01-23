---
title: 高阶函数
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
language: zh-cn
num: 32
previous-page: fun-eta-expansion
next-page: fun-write-map-function

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


高阶函数 (HOF) 通常定义为这类函数，它 (a) 将其他函数作为输入参数或 (b) 返回函数作为结果。
在 Scala 中，HOF 是可能的，因为函数是一等值。

需要注意的是，虽然我们在本文档中使用了常见的行业术语“高阶函数”，但在 Scala 中，该短语同时适用于 *方法* 和 *函数*。
得益于 Scala 的 [Eta 扩展技术][eta_expansion]，它们通常可以在相同的地方使用。

## 从消费者到创造者

在本书到目前为止的示例中，您已经了解了如何成为方法的*消费者*，该方法将其他函数作为输入参数，例如使用诸如 `map` 和 `filter` 之类的 HOF。
在接下来的几节中，您将了解如何成为 HOF 的*创造者*，包括：

- 如何编写将函数作为输入参数的方法
- 如何从方法中返回函数

在这个过程中你会看到：

- 用于定义函数输入参数的语法
- 引用函数后如何调用它

作为本次讨论的一个有益的副作用，一旦您对这种语法感到满意，您将使用它来定义函数参数、匿名函数和函数变量，并且也更容易阅读有关高阶函数的 Scaladoc。

## 理解过滤器的 Scaladoc

要了解高阶函数的工作原理，深入研究一个示例会有所帮助。
例如，您可以通过查看 Scaladoc 来了解 `filter` 接受的函数类型。
这是 `List[A]` 类中的 `filter` 定义：

{% tabs filter-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def filter(p: (A) => Boolean): List[A]
```
{% endtab %}
{% endtabs %}

这表明 `filter` 是一个接受名为 `p` 的函数参数的方法。
按照惯例，`p` 代表 *谓词（predicate）*，它只是一个返回 `Boolean` 值的函数。
所以 `filter` 将谓词 `p` 作为输入参数，并返回一个 `List[A]`，其中 `A` 是列表中保存的类型；如果你在 `List[Int]` 上调用 `filter`，`A` 是 `Int` 类型。

在这一点上，如果你不知道 `filter` 方法的用途，你只知道它的算法以某种方式使用谓词 `p` 创建并返回 `List[A]`。

具体看函数参数 `p`，这部分 `filter` 的描述：

{% tabs filter-definition_1 %}
{% tab 'Scala 2 and 3' %}
```scala
p: (A) => Boolean
```
{% endtab %}
{% endtabs %}

意味着您传入的任何函数都必须将类型 `A` 作为输入参数并返回一个 `Boolean` 。
因此，如果您的列表是 `List[Int]`，则可以将通用类型 `A` 替换为 `Int`，并像这样读取该签名：

{% tabs filter-definition_2 %}
{% tab 'Scala 2 and 3' %}
```scala
p: (Int) => Boolean
```
{% endtab %}
{% endtabs %}

因为 `isEven` 具有这种类型——它将输入 `Int` 转换为结果 `Boolean`——它可以与 `filter` 一起使用。

{% comment %}
NOTE: (A low-priority issue): The next several sections can be condensed.
{% endcomment %}

## 编写接受函数参数的方法

鉴于此背景，让我们开始编写将函数作为输入参数的方法。

**注意：**为了使下面的讨论更清楚，我们将您编写的代码称为*方法*，将您作为输入参数接受的代码称为*函数*。

### 第一个例子

要创建一个接受函数参数的方法，您所要做的就是：

1. 在方法的参数列表中，定义要接受的函数的签名
2. 在你的方法中使用那个函数

为了证明这一点，这里有一个方法，它接受一个名为 `f` 的输入参数，其中 `f` 是一个函数：

{% tabs sayHello-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def sayHello(f: () => Unit): Unit = f()
```
{% endtab %}
{% endtabs %}

这部分代码---*类型签名*---声明 `f` 是一个函数，并定义了 `sayHello` 方法将接受的函数类型：

{% tabs sayHello-definition_1 %}
{% tab 'Scala 2 and 3' %}
```scala
f: () => Unit
```
{% endtab %}
{% endtabs %}

这是它的工作原理：

- `f` 是函数输入参数的名称。
  这就像将 `String` 参数命名为 `s` 或 `Int` 参数命名为 `i`。
- `f` 的类型签名指定此方法将接受的函数的 *类型*。
- `f` 签名的 `()` 部分（在 `=>` 符号的左侧）表明 `f` 不接受输入参数。
- 签名的 `Unit` 部分（在 `=>` 符号的右侧）表示 `f` 不应返回有意义的结果。
- 回顾 `sayHello` 方法的主体（在 `=` 符号的右侧），那里的 `f()` 语句调用传入的函数。

现在我们已经定义了 `sayHello`，让我们创建一个函数来匹配 `f` 的签名，以便我们可以测试它。
以下函数不接受任何输入参数并且不返回任何内容，因此它匹配 `f` 的类型签名：

{% tabs helloJoe-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def helloJoe(): Unit = println("Hello, Joe")
```
{% endtab %}
{% endtabs %}

因为类型签名匹配，你可以将 `helloJoe` 传递给 `sayHello`：

{% tabs sayHello-usage %}
{% tab 'Scala 2 and 3' %}
```scala
sayHello(helloJoe)   // prints "Hello, Joe"
```
{% endtab %}
{% endtabs %}

如果您以前从未这样做过，那么恭喜您：
您刚刚定义了一个名为 `sayHello` 的方法，它接受一个函数作为输入参数，然后在其方法体中调用该函数。

### sayHello 可以带很多函数

重要的是要知道这种方法的美妙之处并不是说​​ `sayHello` 可以将 *一个* 函数作为输入参数；而在于它可以采用与 `f` 签名匹配的 *任意一个* 函数。
例如，因为下一个函数没有输入参数并且不返回任何内容，所以它也适用于 `sayHello`：

{% tabs bonjourJulien-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def bonjourJulien(): Unit = println("Bonjour, Julien")
```
{% endtab %}
{% endtabs %}

它在 REPL 中：

{% tabs bonjourJulien-usage %}
{% tab 'Scala 2 and 3' %}
````
scala> sayHello(bonjourJulien)
Bonjour, Julien
````
{% endtab %}
{% endtabs %}

这是一个好的开始。
现在唯一要做的就是查看更多示例，了解如何为函数参数定义不同的类型签名。

## 定义函数输入参数的通用语法

在这种方法中：

{% tabs sayHello-definition-2 %}
{% tab 'Scala 2 and 3' %}
```scala
def sayHello(f: () => Unit): Unit
```
{% endtab %}
{% endtabs %}

我们注意到 `f` 的类型签名是：

{% tabs sayHello-definition-2_1 %}
{% tab 'Scala 2 and 3' %}
```scala
() => Unit
```
{% endtab %}
{% endtabs %}

我们知道这意味着，“一个没有输入参数并且不返回任何有意义的东西的函数（由 `Unit` 给出）。”

为了演示更多类型签名示例，这里有一个函数，它接受一个 `String` 参数并返回一个 `Int`：

{% tabs sayHello-definition-2_2 %}
{% tab 'Scala 2 and 3' %}
```scala
f: (String) => Int
```
{% endtab %}
{% endtabs %}

什么样的函数接受一个字符串并返回一个整数？
“字符串长度”和校验和等函数就是两个例子。

同样，此函数接受两个 `Int` 参数并返回一个 `Int`：

{% tabs sayHello-definition-2_3 %}
{% tab 'Scala 2 and 3' %}
```scala
f: (Int, Int) => Int
```
{% endtab %}
{% endtabs %}

你能想象什么样的函数匹配那个签名？

答案是任何接受两个 `Int` 输入参数并返回 `Int` 的函数都与该签名匹配，因此所有这些“函数”（实际上是方法）都是匹配的：

{% tabs add-sub-mul-definitions %}
{% tab 'Scala 2 and 3' %}
```scala
def add(a: Int, b: Int): Int = a + b
def subtract(a: Int, b: Int): Int = a - b
def multiply(a: Int, b: Int): Int = a * b
```
{% endtab %}
{% endtabs %}

正如您可以从这些示例中推断出的，定义函数参数类型签名的一般语法是：

{% tabs add-sub-mul-definitions_1 %}
{% tab 'Scala 2 and 3' %}
```scala
variableName: (parameterTypes ...) => returnType
```
{% endtab %}
{% endtabs %}

> 因为函数式编程就像创建和组合一系列代数方程，所以在设计函数和应用程序时通常会考虑*很多*类型。
> 你可能会说你“在类型中思考”。

## 将函数参数与其他参数一起使用

为了使 HOF 真正有用，它们还需要一些数据来处理。
对于像 `List` 这样的类，它的 `map` 方法已经有数据可以处理：`List` 中的数据。
但是对于没有自己数据的独立 HOF，它也应该接受数据作为其他输入参数。

例如，这是一个名为 `executeNTimes` 的方法，它有两个输入参数：一个函数和一个 `Int`：

{% tabs executeNTimes-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def executeNTimes(f: () => Unit, n: Int): Unit =
  for (i <- 1 to n) f()
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def executeNTimes(f: () => Unit, n: Int): Unit =
  for i <- 1 to n do f()
```
{% endtab %}
{% endtabs %}

如代码所示，`executeNTimes` 执行了`f` 函数 `n` 次。
因为像这样的简单 `for` 循环没有返回值，`executeNTimes` 返回 `Unit`。

要测试 `executeNTimes`，请定义一个匹配 `f` 签名的方法：

{% tabs helloWorld-definition %}
{% tab 'Scala 2 and 3' %}
```scala
// a method of type `() => Unit`
def helloWorld(): Unit = println("Hello, world")
```
{% endtab %}
{% endtabs %}

然后将该方法与 `Int` 一起传递给`executeNTimes`：

{% tabs helloWorld-usage %}
{% tab 'Scala 2 and 3' %}
````
scala> executeNTimes(helloWorld, 3)
Hello, world
Hello, world
Hello, world
````
{% endtab %}
{% endtabs %}

优秀。
`executeNTimes` 方法执行 `helloWorld` 函数 3 次。

### 需要多少参数

您的方法可以继续变得尽可能复杂。
例如，此方法采用类型为 `(Int, Int) => Int` 的函数，以及两个输入参数：

{% tabs executeAndPrint-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def executeAndPrint(f: (Int, Int) => Int, i: Int, j: Int): Unit =
  println(f(i, j))
```
{% endtab %}
{% endtabs %}

因为这些 `sum` 和 `multiply` 方法与该类型签名匹配，所以它们可以与两个 `Int` 值一起传递到 `executeAndPrint` 中：

{% tabs executeAndPrint-usage %}
{% tab 'Scala 2 and 3' %}
```scala
def sum(x: Int, y: Int) = x + y
def multiply(x: Int, y: Int) = x * y

executeAndPrint(sum, 3, 11)       // prints 14
executeAndPrint(multiply, 3, 9)   // prints 27
```
{% endtab %}
{% endtabs %}

## 函数类型签名一致性

学习 Scala 的函数类型签名的一个好处是，用于定义函数输入参数的语法与用于编写函数字面量的语法相同。

例如，如果你要编写一个计算两个整数之和的函数，你可以这样写：

{% tabs f-val-definition %}
{% tab 'Scala 2 and 3' %}
```scala
val f: (Int, Int) => Int = (a, b) => a + b
```
{% endtab %}
{% endtabs %}

该代码由类型签名组成：

````
val f: (Int, Int) => Int = (a, b) => a + b
       -----------------
````

输入参数：

````
val f: (Int, Int) => Int = (a, b) => a + b
                           ------
````

和函数体：

````
val f: (Int, Int) => Int = (a, b) => a + b
                                     -----
````

这里展示了 Scala 的一致性，这里的函数类型：

````
val f: (Int, Int) => Int = (a, b) => a + b
       -----------------
````

与用于定义函数输入参数的类型签名相同：

````
def executeAndPrint(f: (Int, Int) => Int, ...
                       -----------------
````

一旦你熟悉了这种语法，你就会用它来定义函数参数、匿名函数和函数变量，而且当你阅读 Scaladoc 中有关高阶函数的内容时，这些内容变得更容易了。

[eta_expansion]: {% link _zh-cn/overviews/scala3-book/fun-eta-expansion.md %}
