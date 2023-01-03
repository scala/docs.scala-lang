---
title: 并发
type: chapter
description: This page discusses how Scala concurrency works, with an emphasis on Scala Futures.
language: zh-cn
num: 68
previous-page: ca-summary
next-page: scala-tools

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


当您想在 Scala 中编写并行和并发应用程序时，您_可以_使用原生 Java `Thread` --- 但 Scala [Future](https://www.scala-lang.org/api/current/scala/concurrent/Future$.html) 提供了一种更高级和惯用的方法，因此它是首选，本章将对此进行介绍。

## 介绍

以下是 Scaladoc 中对 Scala `Future` 的描述：

> “ `Future` 代表一个值，它可能_当前_可用或不可用，但在某个时候可用，或者如果该值不能可用，则表示为异常。”

为了演示这意味着什么，让我们首先看一下单线程编程。
在单线程世界中，您将方法调用的结果绑定到如下变量：

```scala
def aShortRunningTask(): Int = 42
val x = aShortRunningTask()
```

在此代码中，值 `42` 立即绑定到 `x`。

当您使用 `Future` 时，分配过程看起来很相似：

```scala
def aLongRunningTask(): Future[Int] = ???
val x = aLongRunningTask()
```

但在这种情况下的主要区别在于，因为 `aLongRunningTask` 需要不确定的时间才能返回，所以 `x` 中的值可能_当前_可用也可能不可用，但它会在某个时候可用——在未来.

另一种看待这个问题的方法是阻塞。
在这个单线程示例中，在 `aShortRunningTask` 完成之前不会打印 `println` 语句：

```scala
def aShortRunningTask(): Int =
  Thread.sleep(500)
  42
val x = aShortRunningTask()
println("Here")
```

相反，如果 `aShortRunningTask` 被创建为 `Future`，`println` 语句几乎立即被打印，因为 `aShortRunningTask` 是在其他线程上产生的——它不会阻塞。

在本章中，您将看到如何使用 futures，包括如何并行运行多个 future 并将它们的结果组合到一个 `for` 表达式中。
您还将看到一些例子，在这些例子中，有些方法用于处理在返回的 future 中的值。

> 当你考虑 future 时，重要的是要知道它们是一次性的，“在其他线程上处理这个相对较慢的计算，完成后给把结果通知我”的结构。
> 作为对比，[Akka](https://akka.io) Actor 旨在运行很长时间，并在其生命周期内响应许多请求。
> 虽然 actor可能永远活着，但 future 最终会包含只运行一次的计算结果。

## REPL 中的一个例子

future 用于创建一个临时的并发包。
例如，当您需要调用运行不确定时间的算法时---例如调用远程微服务---您使用 future---因此您希望在主线程之外运行它。

为了演示它是如何工作的，让我们从 REPL 中的 `Future` 示例开始。
首先，粘贴这些必需的 `import` 语句：

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}
```

现在您已准备好创造 future 。
对于这个例子，首先定义一个长时间运行的单线程算法：

```scala
def longRunningAlgorithm() =
  Thread.sleep(10_000)
  42
```

这种奇特的算法在十秒延迟后返回整数值`42`。
现在通过将其包装到 `Future` 构造函数中来调用该算法，并将结果分配给一个变量：

```scala
scala> val eventualInt = Future(longRunningAlgorithm())
eventualInt: scala.concurrent.Future[Int] = Future(<not completed>)
```

马上，您的计算——对 `longRunningAlgorithm()` 的调用——开始运行。
如果你立即检查变量 `eventualInt` 的值，你会看到 future 还没有完成：

```scala
scala>  eventualInt
val res1: scala.concurrent.Future[Int] = Future(<not completed>)
```

但是如果你在十秒后再次检查，你会看到它已经成功完成了：

```scala
scala> eventualInt
val res2: scala.concurrent.Future[Int] = Future(Success(42))
```

虽然这是一个相对简单的示例，但它显示了基本方法：只需使用您的长时间运行的算法构建一个新的 `Future`。

需要注意的一点是，您期望的 `42` 被包裹在 `Success` 中，而后者又被包裹在 `Future` 中。
这是一个需要理解的关键概念：`Future` 中的值始终是`scala.util.Try` 类型之一的实例：`Success` 或 `Failure`。
因此，当您处理 future 的结果时，您使用通常的 `Try` 处理技术。

### 将 `map` 与 future 一起使用

`Future` 有一个 `map` 方法，你可以像使用集合中的 `map` 方法一样使用它。
这是在创建变量 `f` 后立即调用 `map` 时的结果：

```scala
scala> val a = eventualInt.map(_ * 2)
a: scala.concurrent.Future[Int] = Future(<not completed>)
```

如图所示，对于使用 `longRunningAlgorithm` 创建的 future ，初始输出显示 `Future(<not completed>)`。
但是当你在十秒后检查 `a` 的值时，你会看到它包含 `84` 的预期结果：

```scala
scala> a
res1: scala.concurrent.Future[Int] = Future(Success(84))
```

再一次，成功的结果被包裹在 `Success` 和 `Future` 中。

### 在 future 中使用回调方法

除了像`map`这样的高阶函数，你还可以使用回调方法和futures。
一种常用的回调方法是 `onComplete`，它采用*偏函数*，您可以在其中处理 `Success` 和 `Failure` 情况：

```scala
eventualInt.onComplete {
  case Success(value) => println(s"Got the callback，value = $value")
  case Failure(e) => e.printStackTrace
}
```

当您将该代码粘贴到 REPL 中时，您最终会看到结果：

```scala
Got the callback, value = 42
```

## 其他 future 方法

`Future` 类还有其他可以使用的方法。
它具有您在 Scala 集合类中找到的一些方法，包括：

- `filter`
- `flatMap` 
- `map`

它的回调方法有：

- `onComplete`
- `andThen`
- `foreach`

其他转换方法包括：

- `fallbackTo`
- `recover`
- `recoverWith`

请参阅 [Futures and Promises][futures] 页面，了解有关 future 可用的其他方法的讨论。

## 运行多个 future 并加入他们的结果

要并行运行多个计算并在所有 future 完成后加入它们的结果，请使用 “for” 表达式。

正确的做法是：

1. 开始计算返回 `Future` 结果
2. 将他们的结果合并到一个 `for` 表达式中
3. 使用 `onComplete` 或类似技术提取合并结果

### 一个例子

以下示例显示了正确方法的三个步骤。
一个关键是你首先开始计算返回 future ，然后将它们加入到 `for` 表达式中：

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

val startTime = System.currentTimeMillis()
def delta() = System.currentTimeMillis() - startTime
def sleep(millis: Long) = Thread.sleep(millis)

@main def multipleFutures1 =

  println(s"creating the futures:   ${delta()}")

  // (1) start the computations that return futures
  val f1 = Future { sleep(800); 1 }   // eventually returns 1
  val f2 = Future { sleep(200); 2 }   // eventually returns 2
  val f3 = Future { sleep(400); 3 }   // eventually returns 3

  // (2) join the futures in a `for` expression
  val result =
    for
      r1 <- f1
      r2 <- f2
      r3 <- f3
    yield
      println(s"in the 'yield': ${delta()}")
      (r1 + r2 + r3)

  // (3) process the result
  result.onComplete {
    case Success(x) =>
      println(s"in the Success case: ${delta()}")
      println(s"result = $x")
    case Failure(e) =>
      e.printStackTrace
  }

  println(s"before the 'sleep(3000)': ${delta()}")

  // important for a little parallel demo: keep the jvm alive
  sleep(3000)
```

当您运行该应用程序时，您会看到如下所示的输出：

````
creating the futures:   1
before the 'sleep(3000)': 2
in the 'yield': 806
in the Success case: 806
result = 6
````

如该输出所示， future 的创建速度非常快，仅在两毫秒内就到达了方法末尾的 `sleep(3000)` 语句之前的打印语句。
所有这些代码都在 JVM 的主线程上运行。
然后，在 806 毫秒，三个 future 完成并运行 `yield` 块中的代码。
然后代码立即转到 `onComplete` 方法中的 `Success` 分支。

806 毫秒的输出是看到三个计算并行运行的关键。
如果它们按顺序运行，总时间约为 1,400 毫秒——三个计算的睡眠时间之和。
但是因为它们是并行运行的，所以总时间只比运行时间最长的计算：`f1`，即 800 毫秒，稍长。

> 请注意，如果计算是在 `for` 表达式中运行的，它们
> 将按顺序执行，而不是并行执行：
> ~~~
> // Sequential execution (no parallelism!)
> for
>   r1 <- Future { sleep(800); 1 }
>   r2 <- Future { sleep(200); 2 }
>   r3 <- Future { sleep(400); 3 }
> yield
>   r1 + r2 + r3
> ~~~
> 因此，如果您希望计算可能并行运行，请记住
> 在 `for` 表达式之外运行它们。

### 一个返回 future 的方法

到目前为止，您已经了解了如何将单线程算法传递给 `Future` 构造函数。
您可以使用相同的技术来创建一个返回 `Future` 的方法：

```scala
// simulate a slow-running method
def slowlyDouble(x: Int, delay: Long): Future[Int] = Future {
  sleep(delay)
  x * 2
}
```

与前面的示例一样，只需将方法调用的结果分配给一个新变量。
然后当你立刻检查结果时，你会看到它没有完成，但是在延迟时间之后，future 会有一个结果：

````
scala> val f = slowlyDouble(2, 5_000L)
val f: concurrent.Future[Int] = Future(<not completed>)

scala> f
val res0: concurrent.Future[Int] = Future(<not completed>)

scala> f
val res1: concurrent.Future[Int] = Future(Success(4))
````

## 关于 future 的要点

希望这些示例能让您了解 Scala  future 是如何工作的。
总而言之，关于 future 的几个关键点是：

- 您构建 future 以在主线程之外运行任务
- Futures 用于一次性的、可能长时间运行的并发任务，这些任务*最终*返回一个值；他们创造了一个临时的并发的容器 
- 一旦你构建了 future，它就会开始运行
- future 相对于线程的一个好处是它们可以使用 `for` 表达式，并带有各种回调方法，可以简化使用并发线程的过程
- 当您使用 future 时，您不必关心线程管理的低级细节
- 您可以使用 `onComplete` 和 `andThen` 之类的回调方法或 `filter`、`map` 等转换方法来处理 future 的结果。
- `Future` 中的值始终是 `Try` 类型之一的实例：`Success` 或 `Failure`
- 如果您使用多个 future 来产生一个结果，请将它们组合在一个 `for` 表达式中

此外，正如您在这些示例中看到的 `import` 语句，Scala `Future` 依赖于 `ExecutionContext`。

有关 future 的更多详细信息，请参阅[Future 和 Promises][future]，这是一篇讨论 future 、promises 和 ExecutionContext 的文章。
它还讨论了如何将 `for` 表达式转换为 `flatMap` 操作。


[futures]: {% link _overviews/core/futures.md %}
