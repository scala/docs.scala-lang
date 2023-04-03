---
title: 纯函数
type: section
description: This section looks at the use of pure functions in functional programming.
language: zh-cn
num: 43
previous-page: fp-immutable-values
next-page: fp-functions-are-values

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 提供的另一个帮助您编写函数式代码的特性是编写纯函数的能力。
一个_纯函数_可以这样定义：

- 函数 `f` 是纯函数，如果给定相同的输入 `x`，它总是返回相同的输出 `f(x)`
- 函数的输出_只_取决于它的输入变量和它的实现
- 它只计算输出而不修改周围的世界

这意味着：
- 它不修改其输入参数
- 它不会改变任何隐藏状态
- 没有任何“后门”：不从外界读取数据（包括控制台、Web服务、数据库、文件等），也不向外界写入数据

作为这个定义的结果，任何时候你调用一个具有相同输入值的纯函数，你总是会得到相同的结果。
例如，您可以使用输入值 `2` 无限次调用 `double` 函数，并且始终得到结果 `4`。

## 纯函数示例

给定这个定义，你可以想象， *scala.math._* 包中的这些方法是纯函数：

- `abs`
- `ceil`
- `max`

这些 `String` 方法也是纯函数：

- `isEmpty`
- `length`
- `substring`

Scala 集合类上的大多数方法也可以作为纯函数工作，包括 `drop`、`filter`、`map` 等等。

> 在 Scala 中，_函数_和_方法_几乎可以完全互换，因此即使我们使用行业通用术语“纯函数”，这个术语也可以用来描述函数和方法。
> 如果您对如何像函数一样使用方法感兴趣，请参阅 [Eta 表达式][eta] 的讨论。

## 不纯函数示例

相反，以下函数是_不纯的_，因为它们违反了纯函数的定义。

- `println` -- 与控制台、文件、数据库、Web 服务、传感器等交互的方法都是不纯的。
- `currentTimeMillis ` -- 与日期和时间相关的方法都是不纯的，因为它们的输出取决于输入参数以外的其他东西
- `sys.error` -- 异常抛出方法是不纯的，因为它们不简单地返回结果

不纯函数通常会执行以下一项或多项操作：

- 从隐藏状态读取，即它们访问的变量和数据不是作为输入参数明确地传递给函数
- 写入隐藏状态
- 改变他们给定的参数，或改变隐藏变量，例如类中包涵的字段
- 与外界执行某种 I/O

> 通常，您应该注意返回类型为 `Unit` 的函数。
> 因为这些函数不返回任何东西，逻辑上你调用它的唯一原因是实现一些副作用。
> 因此，这些功能的使用通常是不纯的。

## 但是需要不纯的函数...

当然，如果一个应用程序不能读取或写入外部世界，它就不是很有用，所以人们提出以下建议：

> 使用纯函数编写应用程序的核心，然后围绕该核心编写一个不纯的“包装器”以与外部世界交互。
> 正如有人曾经说过的，这就像在纯蛋糕上加了一层不纯的糖霜。

重要的是要注意，有一些方法可以让与外界的不纯粹互动感觉更纯粹。
例如，你会听说使用 `IO` Monad 来处理输入和输出。
这些主题超出了本文档的范围，所以为了简单起见，这样认识 FP 会有所帮助：FP 应用程序有一个纯函数核心，还有其他一些函数把这些纯函数包装起来与外部世界交互。

## 编写纯函数

**注意**：在本节中，常见的行业术语“纯函数”通常用于指代 Scala 方法。

要在 Scala 中编写纯函数，只需使用 Scala 的方法语法编写它们（尽管您也可以使用 Scala 的函数语法）。
例如，这是一个将给定输入值加倍的纯函数：

{% tabs fp-pure-function %}
{% tab 'Scala 2 and 3' %}
```scala
def double(i: Int): Int = i * 2
```
{% endtab %}
{% endtabs %}

如果您对递归感到满意，这是一个计算整数列表之和的纯函数：

{% tabs fp-pure-recursive-function class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def sum(xs: List[Int]): Int = xs match {
  case Nil => 0
  case head :: tail => head + sum(tail)
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def sum(xs: List[Int]): Int = xs match
  case Nil => 0
  case head :: tail => head + sum(tail)
```
{% endtab %}
{% endtabs %}

如果您理解该代码，您会发现它符合纯函数定义。

## 要点

本节的第一个要点是纯函数的定义：

> _纯函数_是仅依赖于其声明的输入及其实现来产生其输出的函数。
> 它只计算其输出，不依赖或修改外部世界。

第二个要点是每个现实世界的应用程序都与外部世界交互。
因此，考虑函数式程序的一种简化方法是，它们由一个纯函数核心组成，其他一些函数把这些纯函数包装起来与外部世界交互。

[eta]: {% link _zh-cn/overviews/scala3-book/fun-eta-expansion.md %}
