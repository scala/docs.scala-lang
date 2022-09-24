---
title: 集合方法
type: section
description: This page demonstrates the common methods on the Scala 3 collections classes.
num: 38
previous-page: collections-classes
next-page: collections-summary

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


Scala 集合的一大优势在于它们提供了许多开箱即用的方法，并且这些方法在不可变和可变集合类型中始终可用。
这样做的好处是，您不用在每次需要使用集合时编写自定义的 `for` 循环，并且当您从一个项目转到另一个项目时，您会发现更多地使用这些相同的方法，而不是使用自定义 `for` 循环。

有*几十*种方法可供您使用，因此此处并未全部显示。
相反，只显示了一些最常用的方法，包括：

- `map`
- `filter`
- `foreach`
- `head`
- `tail`
- `take`, `takeWhile`
- `drop`, `dropWhile`
- `reduce`

以下方法适用于所有序列类型，包括 `List`、`Vector`、`ArrayBuffer` 等，但除非另有说明，否则这些示例使用 `List`。

> 作为一个非常重要的说明，`List` 上的任何方法都不会改变列表。
> 它们都以函数式风格工作，这意味着它们返回带有修改结果的新集合。

## 常用方法示例

为了让您大致了解在后面章节中将看到的内容，这些示例展示了一些最常用的集合方法。
首先，这里有一些不使用 lambda 的方法：

```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
```

### 高阶函数和 lambda

接下来，我们将展示一些常用的接受 lambda（匿名函数）的高阶函数 (HOF)。
首先，这里有几个 lambda 语法的变体，从最长的形式开始，逐步过渡最简洁的形式：

```scala
// these functions are all equivalent and return
// the same data: List(10, 20, 10)

a.filter((i: Int) => i < 25)   // 1. most explicit form
a.filter((i) => i < 25)        // 2. `Int` is not required
a.filter(i => i < 25)          // 3. the parens are not required
a.filter(_ < 25)               // 4. `i` is not required
```

在那些编号的例子中：

1. 第一个例子显示了最长的形式。
   _很少_需要这么多的冗长，并且只在最复杂的用法中需要。
2. 编译器知道 `a` 包含 `Int`，所以这里没有必要重述。
3. 只有一个参数时不需要括号，例如`i`。
4. 当你有一个参数并且它在你的匿名函数中只出现一次时，你可以用 `_` 替换参数。

[匿名函数][lambdas] 提供了与缩短 lambda 表达式相关的规则的更多详细信息和示例。

现在您已经看到了简洁的形式，下面是使用短形式 lambda 语法的其他 HOF 的示例：

```scala
a.dropWhile(_ < 25)   // List(30, 40, 10)
a.filter(_ > 100)     // List()
a.filterNot(_ < 25)   // List(30, 40)
a.find(_ > 20)        // Some(30)
a.takeWhile(_ < 30)   // List(10, 20)
```

值得注意的是，HOF 也接受方法和函数作为参数——不仅仅是 lambda 表达式。
下面是一些使用名为 `double` 的方法的`map` HOF 示例。
再次显示了 lambda 语法的几种变体：

```scala
def double(i: Int) = i * 2

// these all return `List(20, 40, 60, 80, 20)`
a.map(i => double(i))
a.map(double(_))
a.map(double)
```

在最后一个示例中，当匿名函数由一个接受单个参数的函数调用组成时，您不必命名参数，因此甚至不需要 `_`。

最后，您可以根据需要组合 HOF 来解决问题：

```scala
// yields `List(100, 200)`
a.filter(_ < 40)
 .takeWhile(_ < 30)
 .map(_ * 10)
```

## 例子数据

以下部分中的示例使用这些列表：

```scala
val oneToTen = (1 to 10).toList
val names = List("adam", "brandy", "chris", "david")
```

## `map`

`map` 方法遍历现有列表中的每个元素，将您提供的函数应用于每个元素，一次一个；
然后它返回一个包含所有修改元素的新列表。

这是一个将 `map` 方法应用于 `oneToTen` 列表的示例：

```scala
scala> val doubles = oneToTen.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

您还可以使用长格式编写匿名函数，如下所示：

```scala
scala> val doubles = oneToTen.map(i => i * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

但是，在本课中，我们将始终使用第一种较短的形式。

以下是更多应用于 `oneToTen` 和 `names` 列表的 `map` 方法的示例：

```scala
scala> val capNames = names.map(_.capitalize)
capNames: List[String] = List(Adam, Brandy, Chris, David)

scala> val nameLengthsMap = names.map(s => (s, s.length)).toMap
nameLengthsMap: Map[String, Int] = Map(adam -> 4, brandy -> 6, chris -> 5, david -> 5)

scala> val isLessThanFive = oneToTen.map(_ < 5)
isLessThanFive: List[Boolean] = List(true, true, true, true, false, false, false, false, false, false)
```

如最后两个示例所示，使用 `map` 返回与原始类型不同类型的集合是完全合法的（并且很常见）。

## `filter`

`filter` 方法创建一个新列表，其中包含满足所提供谓词的元素。
谓词或条件是返回 `Boolean`（`true` 或 `false`）的函数。
这里有一些例子：

```scala
scala> val lessThanFive = oneToTen.filter(_ < 5)
lessThanFive: List[Int] = List(1, 2, 3, 4)

scala> val evens = oneToTen.filter(_ % 2 == 0)
evens: List[Int] = List(2, 4, 6, 8, 10)

scala> val shortNames = names.filter(_.length <= 4)
shortNames: List[String] = List(adam)
```

集合上的函数式方法的一个优点是您可以将它们链接在一起以解决问题。
例如，这个例子展示了如何链接 `filter` 和 `map`：

```scala
oneToTen.filter(_ < 4).map(_ * 10)
```

REPL 显示结果：

```scala
scala> oneToTen.filter(_ < 4).map(_ * 10)
val res1: List[Int] = List(10, 20, 30)
```

## `foreach`

`foreach` 方法用于遍历集合中的所有元素。
请注意，`foreach` 用于副作用，例如打印信息。
这是一个带有 `names` 列表的示例：

```scala
scala> names.foreach(println)
adam
brandy
chris
david
```

## `head`

`head` 方法来自 Lisp 和其他早期的函数式编程语言。
它用于访问列表的第一个元素（头元素）：

```scala
oneToTen.head   // 1
names.head      // adam
```

因为 `String` 可以看作是一个字符序列，所以你也可以把它当作一个列表。
这就是 `head` 在这些字符串上的工作方式：

```scala
"foo".head // 'f'
"bar".head // 'b'
```

`head` 是一个很好的方法，但需要注意的是，在空集合上调用它时也会抛出异常：

```scala
val emptyList = List[Int]()   // emptyList: List[Int] = List()
emptyList.head                // java.util.NoSuchElementException: head of empty list
```

因此，您可能希望使用 `headOption` 而不是 `head`，尤其是在以函数式编程时：

```scala
emptyList.headOption          // None
```

如图所示，它不会抛出异常，它只是返回值为 `None` 的类型 `Option`。
您可以在 [函数式编程][fp-intro] 章节中了解有关这种编程风格的更多信息。

## `tail`

`tail` 方法也来自 Lisp，它用于打印列表头元素之后的每个元素。
几个例子展示了这一点：

```scala
oneToTen.head   // 1
oneToTen.tail   // List(2, 3, 4, 5, 6, 7, 8, 9, 10)

names.head      // adam
names.tail      // List(brandy, chris, david)
```

就像 `head` 一样，`tail` 也适用于字符串：

```scala
"foo".tail   // "oo"
"bar".tail   // "ar"
```

如果列表为空，`tail` 会抛出 _java.lang.UnsupportedOperationException_，所以就像 `head` 和 `headOption` 一样，还有一个 `tailOption` 方法，这是函数式编程的首选方法。

也可以匹配一个列表，因此您可以编写如下表达式：

```scala
val x :: xs = names
```

将该代码放在 REPL 中显示 `x` 分配给列表的头部，而 `xs` 分配给列表尾部：

```scala
scala> val x :: xs = names
val x: String = adam
val xs: List[String] = List(brandy, chris, david)
```

像这样的模式匹配在许多情况下都很有用，例如使用递归编写一个 `sum` 方法：

```scala
def sum(list: List[Int]): Int = list match
  case Nil => 0
  case x :: xs => x + sum(xs)
```

## `take`、`takeRight`、`takeWhile`

`take`、`takeRight` 和 `takeWhile` 方法为您提供了一种从列表中“获取”要用于创建新列表的元素的好方法。
这是 `take` 和 `takeRight`：

```scala
oneToTen.take(1)        // List(1)
oneToTen.take(2)        // List(1, 2)

oneToTen.takeRight(1)   // List(10)
oneToTen.takeRight(2)   // List(9, 10)
```

注意这些方法是如何处理“临界”情况的，当我们要求比序列中更多的元素，或者要求零元素的时候：

```scala
oneToTen.take(Int.MaxValue)        // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.takeRight(Int.MaxValue)   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.take(0)                   // List()
oneToTen.takeRight(0)              // List()
```

这是`takeWhle`，它与谓词函数一起使用：

```scala
oneToTen.takeWhile(_ < 5)       // List(1, 2, 3, 4)
names.takeWhile(_.length < 5)   // List(adam)
```

## `drop`、`dropRight`、`dropWhile`

`drop`、`dropRight` 和 `dropWhile` 本质上与它们对应的“取”相反，从列表中删除元素。
这里有些例子：

```scala
oneToTen.drop(1)        // List(2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.drop(5)        // List(6, 7, 8, 9, 10)

oneToTen.dropRight(8)   // List(1, 2)
oneToTen.dropRight(7)   // List(1, 2, 3)
```

再次注意这些方法如何处理临界情况：

```scala
oneToTen.drop(Int.MaxValue)        // List()
oneToTen.dropRight(Int.MaxValue)   // List()
oneToTen.drop(0)                   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.dropRight(0)              // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
```

这是 `dropWhile`，它与谓词函数一起使用：

```scala
oneToTen.dropWhile(_ < 5)       // List(5, 6, 7, 8, 9, 10)
names.dropWhile(_ != "chris")   // List(chris, david)
```

## `reduce`

当您听到 “map reduce” 术语时，“reduce” 部分指的是诸如 `reduce` 之类的方法。
它接受一个函数（或匿名函数）并将该函数应用于列表中的连续元素。

解释 `reduce` 的最好方法是创建一个可以传递给它的小辅助方法。
例如，这是一个将两个整数相加的 `add` 方法，还为我们提供了一些不错的调试输出：

```scala
def add(x: Int, y: Int): Int =
  val theSum = x + y
  println(s"received $x and $y, their sum is $theSum")
  theSum
```

有上面的方法和下面的列表：

```scala
val a = List(1,2,3,4)
```

这就是将 `add` 方法传递给 `reduce` 时发生的情况：

```scala
scala> a.reduce(add)
received 1 and 2, their sum is 3
received 3 and 3, their sum is 6
received 6 and 4, their sum is 10
res0: Int = 10
```

如该结果所示，`reduce` 使用`add` 将列表 `a` 归约为单个值，在这种情况下，是列表中整数的总和。

一旦你习惯了 `reduce`，你会写一个像这样的“求和”算法：

```scala
scala> a.reduce(_ + _)
res0: Int = 10
```

类似地，“连乘”算法如下所示：

```scala
scala> a.reduce(_ * _)
res1: Int = 24
```

> 关于 `reduce` 的一个重要概念是——顾名思义——它用于将集合_归约_为单个值。

## 更多

在 Scala 集合类型上确实有几十个额外的方法，可以让你不再需要编写另一个 `for` 循环。有关 Scala 集合的更多详细信息，请参阅[可变和不可变集合][mut-immut-colls]和[Scala集合的架构][architecture]。

> 最后一点，如果您在 Scala 项目中使用 Java 代码，您可以将 Java 集合转换为 Scala 集合。
> 通过这样做，您可以在 `for` 表达式中使用这些集合，还可以利用 Scala 的函数式集合方法。
> 请参阅 [与 Java 交互][interacting] 部分了解更多详细信息。

[interacting]: {% link _zh-cn/overviews/scala3-book/interacting-with-java.md %}
[lambdas]: {% link _zh-cn/overviews/scala3-book/fun-anonymous-functions.md %}
[fp-intro]: {% link _zh-cn/overviews/scala3-book/fp-intro.md %}
[mut-immut-colls]: {% link _overviews/collections-2.13/overview.md %}
[architecture]: {% link _overviews/core/architecture-of-scala-213-collections.md %}

