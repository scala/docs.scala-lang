---
layout: singlepage-overview
title: Future和Promise

partof: futures

language: zh-cn
---

**Philipp Haller, Aleksandar Prokopec, Heather Miller, Viktor Klang, Roland Kuhn, and Vojin Jovanovic 著**

## 简介

Future提供了一套高效便捷的非阻塞并行操作管理方案。其基本思想很简单，所谓 [`Future`](https://www.scala-lang.org/api/current/scala/concurrent/Future.html)，指的是一类占位符对象，用于指代某些尚未完成的计算的结果。一般来说，由Future指代的计算都是并行执行的，计算完毕后可另行获取相关计算结果。以这种方式组织并行任务，便可以写出高效、异步、非阻塞的并行代码。

默认情况下，future和promise并不采用一般的阻塞操作，而是依赖回调进行非阻塞操作。为了在语法和概念层面更加简明扼要地使用这些回调，Scala还提供了 `flatMap`、`foreach` 和 `filter` 等算子，使得我们能够以非阻塞的方式对future进行组合。
当然，future仍然支持阻塞操作——必要时，可以阻塞等待future（不过并不鼓励这样做）。

<!--
The futures and promises API builds upon the notion of an
`ExecutionContext`, an execution environment designed to manage
resources such as thread pools between parallel frameworks and
libraries (detailed in an accompanying SIP, forthcoming). Futures and
promises are created through such `ExecutionContext`s. For example, this makes it possible,
in the case of an application which requires blocking futures, for an underlying execution
environment to resize itself if necessary to guarantee progress.
-->

典型的 future 像这样：

{% tabs futures-00 %}
{% tab 'Scala 2 and 3' for=futures-00 %}

```scala
val inverseFuture: Future[Matrix] = Future {
    fatMatrix.inverse() // non-blocking long lasting computation
}(executionContext)
```

{% endtab %}
{% endtabs %}

或者更习惯的用法：

{% tabs futures-01 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-01 %}

```scala
implicit val ec: ExecutionContext = ...
val inverseFuture : Future[Matrix] = Future {
  fatMatrix.inverse()
} // ec is implicitly passed
```

{% endtab %}

{% tab 'Scala 3' for=futures-01 %}

```scala
given ExecutionContext = ...
val inverseFuture : Future[Matrix] = Future {
  fatMatrix.inverse()
} // execution context is implicitly passed
```

{% endtab %}
{% endtabs %}

这两个代码片段都将 `fatMatrix.inverse()` 的执行委托给 `ExecutionContext`，并在 `inverseFuture` 中体现计算结果。

## 执行上下文

Future 和 Promises 围绕 [`ExecutionContext`s](https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext.html) 展开，负责执行计算。

`ExecutionContext` 类似于 [Executor](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Executor.html)：
它可以在新线程、线程池或当前线程中自由地执行计算（尽管不鼓励在当前线程中执行计算 -- 更多内容见下文）。

`scala.concurrent` 包是开箱即用的，它带有 `ExecutionContext` 实现，一个全局静态线程池。
它也可以将 `Exector` 转换为 `ExecutionContext`。
最后，用户可以自由扩展 `ExecutionContext` trait来实现自己的执行上下文，尽管这只应在极少数情况下完成。

### 全局执行上下文

`ExecutionContext.global` 是由 [ForkJoinPool](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html) 支持的 `ExecutionContext`。
它应该满足大部分情况，但需要一些注意。
`ForkJoinPool` 管理有限数量的线程（线程的最大数量由 *parallelism level* 指定）。
仅当每个阻塞调用都包装在 `blocking` 调用中时（更多内容见下文），并发阻塞计算的数量才能超过并行度级别。
否则，存在全局执行上下文中的线程池不足的风险，并且无法继续进行任何计算。
缺省情况下，`ExecutionContext.global` 将其底层分叉连接池的并行级别设置为可用处理器的数量([Runtime.availableProcessors](https://docs.oracle.com/javase/7/docs/api/java/lang/Runtime.html#availableProcessors%28%29))。
通过设置以下一个（或多个） VM 属性，来重载这个设置：

  * scala.concurrent.context.minThreads - 缺省为 `Runtime.availableProcessors`
  * scala.concurrent.context.numThreads - 可以是一个数字，或者是 “xN” 这样形式中的乘数（N）；缺省为 `Runtime.availableProcessors`
  * scala.concurrent.context.maxThreads - 缺省为 `Runtime.availableProcessors`

只要并行度的数值在 `[minThreads; maxThreads]` 范围内，它就可以给 `numThreads` 赋值。

如上所述，在存在阻塞计算的情况下，`ForkJoinPool` 可以将线程数增加到超过 `parallelismLevel`。
如 `ForkJoinPool` API 中所述，这只有在明确通知 `ForkJoinPool` 时才有可能：

{% tabs futures-02 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-02 %}

```scala
import scala.concurrent.{ Future, ExecutionContext }
import scala.concurrent.forkjoin._

// the following is equivalent to `implicit val ec = ExecutionContext.global`
import ExecutionContext.Implicits.global

Future {
  ForkJoinPool.managedBlock(
    new ManagedBlocker {
      var done = false

      def block(): Boolean = {
        try {
          myLock.lock()
          // ...
        } finally {
          done = true
        }
        true
      }

      def isReleasable: Boolean = done
    }
  )
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-02 %}

```scala
import scala.concurrent.{ Future, ExecutionContext }
import scala.concurrent.forkjoin.*

// the following is equivalent to `given ExecutionContext = ExecutionContext.global`
import ExecutionContext.Implicits.global

Future {
  ForkJoinPool.managedBlock(
    new ManagedBlocker {
      var done = false

      def block(): Boolean =
        try
          myLock.lock()
          // ...
        finally
          done = true
        true

      def isReleasable: Boolean = done
    }
  )
}
```
{% endtab %}
{% endtabs %}

幸运的是，并发包为做这样的事情提供了便捷的方法：

{% tabs blocking %}
{% tab 'Scala 2 and 3' for=blocking %}

```scala
import scala.concurrent.Future
import scala.concurrent.blocking

Future {
  blocking {
    myLock.lock()
    // ...
  }
}
```

{% endtab %}
{% endtabs %}

注意 `blocking` 是一个通用结构，它将会在[下面](#Future-内的阻塞)作深入探讨。

最后你必须记住 `ForkJoinPool` 不是设计用来长连接阻塞操作。
即使收到 `blocking` 通知，池也可能无法像预期的那样生成新工作，而创建新工作线程时，它们的数量也可能多达 32767。
为了给您有个概念，以下代码将使用 32000 个线程：

{% tabs futures-03 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-03 %}

```scala
implicit val ec = ExecutionContext.global

for (i <- 1 to 32000) {
  Future {
    blocking {
      Thread.sleep(999999)
    }
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-03 %}

```scala
given ExecutionContext = ExecutionContext.global

for i <- 1 to 32000 do
  Future {
    blocking {
      Thread.sleep(999999)
    }
  }
```

{% endtab %}
{% endtabs %}

如果您需要包装持久的阻塞操作，我们建议使用专用的 `ExecutionContext`，例如通过包装Java 的 `Executor`。

### 适配 Java Executor

使用 `ExecutionContext.fromExecutor` 方法，你可以把 `Executor` 包装进 `ExecutionContext`。
例如：

{% tabs executor class=tabs-scala-version %}
{% tab 'Scala 2' for=executor %}

```scala
ExecutionContext.fromExecutor(new ThreadPoolExecutor( /* your configuration */ ))
```

{% endtab %}
{% tab 'Scala 3' for=executor %}

```scala
ExecutionContext.fromExecutor(ThreadPoolExecutor( /* your configuration */ ))
```

{% endtab %}
{% endtabs %}

### 同步执行上下文

也许试图得到一个在当前线程中运行计算的 `ExecutionContext`：

{% tabs bad-example %}
{% tab 'Scala 2 and 3' for=bad-example %}

```scala
val currentThreadExecutionContext = ExecutionContext.fromExecutor(
  new Executor {
    // Do not do this!
    def execute(runnable: Runnable) = runnable.run()
  })
```

{% endtab %}
{% endtabs %}

应该避免这种情况，因为它会在执行 future 时引入不确定性。

{% tabs bad-example-2 %}
{% tab 'Scala 2 and 3' for=bad-example-2 %}

```scala
Future {
  doSomething
}(ExecutionContext.global).map {
  doSomethingElse
}(currentThreadExecutionContext)
```

{% endtab %}
{% endtabs %}

`doSomethingElse` 调用，可能在 `doSomething` 的线程中执行或者在主线程中执行，这样可以是同步的或者是异步的。
正如[这里](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)解释的，一个调用不能两者都是。

## Future

所谓Future，是一种用于指代某个尚未就绪的值的对象。而这个值，往往是某个计算过程的结果：

1. 若该计算过程尚未完成，我们就说该Future **未就位**；
2. 若该计算过程正常结束，或中途抛出异常，我们就说该Future **已就位**。

Future的就位分为两种情况：

1. 当 `Future` 带着某个值就位时，我们就说该 future 携带计算结果**成功就位**。
2. 当 `Future` 因对应计算过程抛出异常而就绪，我们就说这个 future因该异常而**失败**。

`Future` 的一个重要属性在于它只能被赋值一次。一旦给定了某个值或某个异常，`Future` 对象就变成了不可变对象——无法再被改写。

创建future对象最简单的方法是调用 `Future.apply` 方法，该future方法启用异步(asynchronous)计算并返回保存有计算结果的futrue，一旦该future对象计算完成，其结果就变的可用。

注意 _Future[T]_ 是表示future对象的类型，而 `Future.apply` 是方法，该方法创建和调度一个异步计算，并返回随着计算结果而完成的future对象。

这最好通过一个例子予以说明。

假设我们使用某些流行的社交网络的假定API获取某个用户的朋友列表，我们将打开一个新对话(session)，然后发送一个请求来获取某个特定用户的好友列表。

{% tabs futures-04 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-04 %}

```scala
import scala.concurrent._
import ExecutionContext.Implicits.global

val session = socialNetwork.createSessionFor("user", credentials)
val f: Future[List[Friend]] = Future {
  session.getFriends()
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-04 %}

```scala
import scala.concurrent.*
import ExecutionContext.Implicits.global

val session = socialNetwork.createSessionFor("user", credentials)
val f: Future[List[Friend]] = Future {
  session.getFriends()
}
```

{% endtab %}
{% endtabs %}

以上，首先导入  `scala.concurrent` 包使得 `Future` 类型可见。
我们将马上解释第二个导入。

然后我们用一个假想的 `createSessionFor` 方法去初始化一个session变量，该变量用作向服务器发送请求。
为了获得朋友列表，我们必须通过网络发送一个请求，这个请求可能耗时很长。
这能从调用 `getFriends` 方法得到解释，该方法返回 `List[Friend]`。
为了更好的利用CPU，响应到达前不应该阻塞(block)程序的其他部分执行，于是在计算中使用异步。`Future.apply` 方法就是这样做的，它并行地执行指定的计算块，在这个例子中是向服务器发送请求和等待响应。

一旦服务器响应，future `f` 中的好友列表将变得可用。

未成功的尝试可能会导致一个异常(exception)。在下面的例子中，`session` 的值未被正确的初始化，于是在 `Future` 阻塞中的计算将抛出 `NullPointerException`。
该future `f` 不会圆满完成，而是以此异常失败：

{% tabs futures-04b %}
{% tab 'Scala 2 and 3' for=futures-04b %}

```scala
val session = null
val f: Future[List[Friend]] = Future {
  session.getFriends
}
```

{% endtab %}
{% endtabs %}

上面 `import ExecutionContext.Implicits.global` 这行，导入默认的全局执行上下文(global execution context)。
执行上下文执行提交给他们的任务，也可把执行上下文看作线程池。
这对于 `Future.apply` 方法来说是必不可少的，因为这可以处理异步计算如何及何时被执行。
可以定义自己的执行上下文，并在 `Future` 上使用它，但是现在只需要知道你能够通过上面的语句导入默认执行上下文就足够了。

我们的例子是基于一个假定的社交网络 API，此 API 的计算包含发送网络请求和等待响应。
提供一个涉及到你能试着立即使用的异步计算的例子是公平的。假设你有一个文本文件，你想找出一个特定的关键字第一次出现的位置。
当磁盘正在检索此文件内容时，这种计算可能会陷入阻塞，因此并行的执行该操作和程序的其他部分是合理的(make sense)。

{% tabs futures-04c %}
{% tab 'Scala 2 and 3' for=futures-04c %}

```scala
val firstOccurrence: Future[Int] = Future {
  val source = scala.io.Source.fromFile("myText.txt")
  source.toSeq.indexOfSlice("myKeyword")
}
```

{% endtab %}
{% endtabs %}

### Callbacks(回调函数)

现在我们知道如何开始一个异步计算来创建一个新的future值，但是我们没有展示一旦此结果变得可用后如何来使用，以便我们能够用它来做一些有用的事。
我们经常对计算结果感兴趣而不仅仅是它的副作用。

在许多future的实现中，一旦future的client对future的结果感兴趣，它不得不阻塞它自己的计算直到future完成——然后才能使用future的值继续它自己的计算。
虽然这在Scala的Future API（在后面会展示）中是允许的，但是从性能的角度来看更好的办法是一种完全非阻塞的方法，即在future中注册一个回调。
future 完成后这个回调称为异步回调。如果当注册回调时 future 已经完成，则回调可能是异步执行的，或在相同的线程中循序执行。

注册回调最通常的形式是使用 `OnComplete` 方法，即创建一个``Try[T] => U` 类型的回调函数。
如果future成功完成，回调则会应用到 `Success[T]` 类型的值中，否则应用到 `Failure[T]` 类型的值中。

 `Try[T]` 和`Option[T]`或 `Either[T, S]`相似，因为它是一个可能持有某种类型值的单子。
 然而，它是特意设计来保持一个值或某个可抛出(throwable)对象。
 `Option[T]` 既可以是一个值（如：`Some[T]`）也可以是完全无值（如：`None`），如果 `Try[T]` 获得一个值则它为 `Success[T]`，否则为 `Failure[T]` 的异常。`Failure[T]` 获得更多的关于为什么这儿没值的信息，而不仅仅是 `None`。
 同时也可以把 `Try[T]` 看作一种特殊版本的 `Either[Throwable, T]`，专门用于左值为可抛出类型(Throwable)的情形。

回到我们的社交网络的例子，假设我们想要获取我们最近的帖子并显示在屏幕上，我们通过调用 `getRecentPosts` 方法获得一个返回值 `List[String]` -- 一个近期帖子的列表文本：

{% tabs futures-05 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-05 %}

```scala
import scala.util.{Success, Failure}
val f: Future[List[String]] = Future {
  session.getRecentPosts
}

f.onComplete {
  case Success(posts) => for (post <- posts) println(post)
  case Failure(t) => println("An error has occured: " + t.getMessage)
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-05 %}

```scala
import scala.util.{Success, Failure}

val f: Future[List[String]] = Future {
  session.getRecentPosts()
}

f.onComplete {
  case Success(posts) => for post <- posts do println(post)
  case Failure(t) => println("An error has occurred: " + t.getMessage)
}
```

{% endtab %}
{% endtabs %}

`onComplete` 方法一般在某种意义上它允许客户处理future计算出的成功或失败的结果。对于仅仅处理成功的结果，可以使用 `foreach` 回调：

{% tabs futures-06 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-06 %}

```scala
val f: Future[List[String]] = Future {
  session.getRecentPosts()
}

for {
  posts <- f
  post <- posts
} println(post)
```

{% endtab %}
{% tab 'Scala 3' for=futures-06 %}

```scala
val f: Future[List[String]] = Future {
  session.getRecentPosts()
}

for
  posts <- f
  post <- posts
do println(post)
```

{% endtab %}
{% endtabs %}

`Future` 提供了一个清晰的手段只用来处理失败的结果，这个手段是使用 `failed` 投影，这个投影把 `Failure[Throwable]` 转换成 `Success[Throwable]`。下面的[投影](#投影)章节提供了这样一个例子。

回到前面查找某个关键字第一次出现的例子，我们想要在屏幕上打印出此关键字的位置：

{% tabs futures-oncomplete %}
{% tab 'Scala 2 and 3' for=futures-oncomplete %}

```scala
val firstOccurrence: Future[Int] = Future {
  val source = scala.io.Source.fromFile("myText.txt")
  source.toSeq.indexOfSlice("myKeyword")
}

firstOccurrence.onComplete {
  case Success(idx) => println("The keyword first appears at position: " + idx)
  case Failure(t) => println("Could not process file: " + t.getMessage)
}
```

{% endtab %}
{% endtabs %}

`onComplete` 和 `foreach` 方法都具有 `Unit` 的结果类型，这意味着不能链接使用这些方法的回调。注意这种设计是为了避免暗示而刻意为之的，因为链接回调也许暗示着按照一定的顺序执行注册回调（回调注册在同一个 future 中是无序的）。

也就是说，我们现在应讨论**何时**正好在调用回调(callback)。因为回调需要 future 的值是可用的，所有回调只能在 future 完成之后被调用。
然而，不能保证回调在完成 future 的线程或创建回调的线程中被调用。
反而， 回调会在 future 对象完成之后的一些线程和一段时间内执行。所以我们说回调最终会被执行。

此外，回调(callback)执行的顺序不是预先定义的，甚至在相同的应用程序中回调的执行顺序也不尽相同。
事实上，回调也许不是一个接一个连续的调用，但是可能会在同一时间同时执行。
这意味着在下面的例子中，变量 `totalA` 也许不能在计算上下文中被设置为正确的大写或者小写字母 `a`。

{% tabs volatile %}
{% tab 'Scala 2 and 3' for=volatile %}
 
```scala
@volatile var totalA = 0

val text = Future {
  "na" * 16 + "BATMAN!!!"
}


text.foreach { txt =>
   totalA += txt.count(_ == 'a')
}

text.foreach { txt =>
  totalA += txt.count(_ == 'A')
}
```

{% endtab %}
{% endtabs %}

以上，这两个回调(callbacks)可能是一个接一个地执行的，这样变量 `totalA` 得到的预期值为`18`。
然而，它们也可能是并发执行的，于是 `totalA` 最终可能是`16`或`2`，因为 `+=` 不是一个原子性的操作符（即它是由一个读和一个写的步骤组成，这样就可能使其与其他的读和写任意交错执行）。

考虑到完整性，回调的使用情景列在这儿：

1. 在 future 中注册 `onComplete` 回调的时候要确保最后 future 执行完成之后调用相应的终止回调。

2. 注册 `foreach` 回调时也和注册 `onComplete` 一样，不同之处在于 future 成功完成才会调用闭包。

3. 在一个已经完成的 future 上注册回调将导致此该回调最终被执行（1所隐含的）。

4. 在 future 中注册多个回调的情况下，这些回调的执行顺序是不确定的。事实上，这些回调也许是同时执行的。然而，特定的 `ExecutionContext` 实现可能导致明确的顺序。

5. 在一些回调抛出异常的情况下，其他的回调的执行不受影响。

6. 在一些情况下，回调函数永远不能结束（例如，这些回调处于无限循环中），其他回调可能完全不会执行。在这种情况下，对于那些潜在的阻塞回调要使用 `blocking` 的构造（例子如下）。

7. 一旦执行完，回调将从 future 对象中移除，这样更适合垃圾回收机制(GC)。

### 函数组合(Functional Composition)和For解构(For-Comprehensions)

尽管前文所展示的回调机制已经足够把future的结果和后继计算结合起来的。
但是有些时候回调机制并不易于使用，且容易造成冗余的代码。
我们可以通过一个例子来说明。假设我们有一个用于进行货币交易服务的 API，我们只想在有盈利的时候购进一些美元。让我们先来看看怎样用回调来解决这个问题：

{% tabs futures-07 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-07 %}
 
```scala
val rateQuote = Future {
  connection.getCurrentValue(USD)
}

for (quote <- rateQuote) {
  val purchase = Future {
    if (isProfitable(quote)) connection.buy(amount, quote)
    else throw new Exception("not profitable")
  }

  for (amount <- purchase)
    println("Purchased " + amount + " USD")
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-07 %}

```scala
val rateQuote = Future {
  connection.getCurrentValue(USD)
}

for quote <- rateQuote do
  val purchase = Future {
    if isProfitable(quote) then connection.buy(amount, quote)
    else throw Exception("not profitable")
  }

  for amount <- purchase do
    println("Purchased " + amount + " USD")
```

{% endtab %}
{% endtabs %}

首先，我们创建一个名为 `rateQuote` 的 future 对象并获得当前的汇率。
在服务器返回了汇率且该 future 对象成功完成了之后，计算操作才会从 `foreach` 回调中执行，这时我们就可以开始判断买还是不买了。
所以我们创建了另一个名为 `purchase` 的 future 对象，用来只在可盈利的情况下做出购买决定，然后发送一个请求。
最后，一旦purchase运行结束，我们会在标准输出中打印一条通知消息。

这确实是可行的，但是有两点原因使这种做法并不方便。其一，我们不得不使用 `foreach`，在其中嵌套第二个 `purchase` future 对象。试想一下，如果在 `purchase` 执行完成之后我们可能会想要卖掉一些其他的货币。这时我们将不得不在 `foreach` 回调中重复这个模式，从而可能使代码过度嵌套，过于冗长，并且难以理解。

其二，`purchase` future 不在余下的代码范围内 -- 它只能被来自 `foreach` 内部的回调响应。这也就是说，这个应用的其他部分看不到 `purchase`，而且不能为它注册其他的 `foreach` 回调，比如说卖掉些别的货币。

为解决上述的两个问题， futures提供了组合器（combinators）来使之具有更多易用的组合形式。映射（map）是最基本的组合器之一。试想给定一个 future 对象和一个通过映射来获得该 future 值的函数，映射方法将创建一个新 Future 对象，一旦原来的 Future 成功完成了计算操作，新的 Future 会通过该返回值来完成自己的计算。你能够像理解容器(collections)的map一样来理解 future 的map。

让我们用 `map` 组合器来重构一下前面的例子：

{% tabs futures-08 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-08 %}

```scala
val rateQuote = Future {
  connection.getCurrentValue(USD)
}

val purchase = rateQuote map { quote =>
  if (isProfitable(quote)) connection.buy(amount, quote)
  else throw new Exception("not profitable")
}

purchase.foreach { amount =>
  println("Purchased " + amount + " USD")
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-08 %}

```scala
val rateQuote = Future {
  connection.getCurrentValue(USD)
}

val purchase = rateQuote.map { quote =>
  if isProfitable(quote) then connection.buy(amount, quote)
  else throw Exception("not profitable")
}

purchase.foreach { amount =>
  println("Purchased " + amount + " USD")
}
```

{% endtab %}
{% endtabs %}

通过在 `rateQuote` 上使用 `map`，我们减少了一次 `foreach` 的回调，更重要的是避免了嵌套。这时如果我们决定出售一些货币就可以再次在 `purchase` 上使用 `map` 了。

可是如果 `isProfitable` 方法返回了 `false` 将会发生些什么？会引发异常？
这种情况下，`purchase` 的确会因为异常而失败。不仅仅如此，想象一下，链接的中断和 `getCurrentValue` 方法抛出异常会使 `rateQuote` 的操作失败。
在这些情况下映射将不会返回任何值，而 `purchase` 也会自动的以和 `rateQuote` 相同的异常而失败。

总之，如果原 future 成功完成了，那么返回的 future 将会使用从原 future来的映射值完成。如果映射函数抛出了异常则返回的 future 也会带着一样的异常。如果原 future 由于异常而计算失败，那么返回的 future 也会包含相同的异常。这种异常的传导语义也存在于其余的组合器(combinators)。

使之能够在for-comprehensions 中使用，是设计 future 的目的之一。
因为这个原因，future 还拥有 `flatMap` 和 `withFilter` 组合器。`flatMap` 方法获取一个函数，该函数把值映射到一个新 future `g`，然后返回一个随 `g` 的完成而完成的 future。

让我们假设我们想把一些美元兑换成瑞士法郎（CHF）。我们必须为这两种货币报价，然后再在这两个报价的基础上确定交易。
下面是一个在 for-comprehensions 中使用 `flatMap` 和 `withFilter` 的例子：

{% tabs futures-09 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-09 %}

```scala
val usdQuote = Future { connection.getCurrentValue(USD) }
val chfQuote = Future { connection.getCurrentValue(CHF) }

val purchase = for {
  usd <- usdQuote
  chf <- chfQuote
  if isProfitable(usd, chf)
} yield connection.buy(amount, chf)

purchase foreach { amount =>
  println("Purchased " + amount + " CHF")
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-09 %}

```scala
val usdQuote = Future { connection.getCurrentValue(USD) }
val chfQuote = Future { connection.getCurrentValue(CHF) }

val purchase = for
  usd <- usdQuote
  chf <- chfQuote
  if isProfitable(usd, chf)
yield connection.buy(amount, chf)

purchase.foreach { amount =>
  println("Purchased " + amount + " CHF")
}
```

{% endtab %}
{% endtabs %}

`purchase` 只有当 `usdQuote` 和 `chfQuote` 都完成计算以后才能完成-- 它以其他两个 future 的计算值为前提所以它自己的计算不能更早的开始。

上面的 for-comprhension 将被转换为：

{% tabs for-translation %}
{% tab 'Scala 2 and 3' for=for-translation %}

```scala
val purchase = usdQuote flatMap {
  usd =>
    chfQuote
      .withFilter(chf => isProfitable(usd, chf))
      .map(chf => connection.buy(amount, chf))
}
```

{% endtab %}
{% endtabs %}

这的确是比for-comprehension稍微难以把握一些，但是我们这样分析有助于您更容易的理解 `flatMap` 的操作。`flatMap` 操作会把自身的值映射到其他future对象上，并随着该对象计算完成的返回值一起完成计算。
在我们的例子里，`flatMap` 用 `usdQuote` 的值把 `chfQuote` 的值映射到第三个 futrue 对象里，该对象用于发送一定量瑞士法郎的购入请求。
只有当通过 `map` 返回的第三个 future 对象完成，结果 future `purchase` 才能完成。

这可能有些难以置信，但幸运的是faltMap操作在for-comprhensions模式以外很少使用，因为for-comprehensions本身更容易理解和使用。

`filter` 组合器可以用于创建一个新的 future 对象，该对象只有在满足某些特定条件的前提下才会得到原始future的值。否则新 future 就会有 `NoSuchElementException` 的失败。调用了 `filter` 的future，其效果与直接调用 `withFilter` 完全一样。

作为组合器的 `collect` 同 `filter` 之间的关系有些类似容器（collections）API里的那些方法之间的关系。

由于 `Future` trait(译注: trait有点类似java中的接口(interface)的概念)从概念上看可以包含两种类型的返回值（计算结果和异常），所以组合器会有一个处理异常的需求。

比方说我们准备在 `rateQuote` 的基础上决定购入一定量的货币，那么 `connection.buy` 方法需要获取购入的 `amount` 和期望的 `quote`。它返回完成购买的数量。假如 `quote` 偏偏在这个节骨眼儿改变了，那buy方法将会抛出一个 `QuoteChangedExecption`，并且不会做任何交易。如果我们想让我们的 future 对象返回`0`而不是抛出那个异常，那我们需要使用 `recover` 组合器：


{% tabs recover %}
{% tab 'Scala 2 and 3' for=recover %}

```scala
val purchase: Future[Int] = rateQuote.map {
  quote => connection.buy(amount, quote)
} recover {
  case QuoteChangedException() => 0
}
```
{% endtab %}
{% endtabs %}

这里用到的 `recover` 能够创建一个新 future 对象，该对象当成功完成时持有和原 future 对象一样的值。如果执行不成功则偏函数的参数会被传递给使原 future 失败的那个 `Throwable` 异常。如果它把 `Throwable` 映射到了某个值，那么新的 future 就会成功完成并返回该值。
如果偏函数没有定义在 `Throwable` 中，那么最终产生结果的 future 也会失败并返回同样的 `Throwable`。

组合器 `recoverWith` 能够创建一个新 future 对象，当原 future 对象成功完成计算时，新 future 包含有和原 future 相同的结果。若原 future 失败或异常，偏函数将会返回造成原 future 失败的相同的 `Throwable` 异常。如果此时 `Throwable` 又被映射给了别的 future ，那么新 future 就会完成并返回这个 future 的结果。
`recoverWith` 同 `recover` 的关系跟 `flatMap` 和 `map` 之间的关系很像。

`fallbackTo` 组合器生成的 future 对象可以在该原 future 成功完成计算时返回结果，如果原 future 失败或异常返回 future 参数对象的成功值。在原 future 和参数 future 都失败的情况下，新 future 对象会完成并返回原 future 对象抛出的异常。正如下面的例子中，本想打印美元的汇率，但是在获取美元汇率失败的情况下会打印出瑞士法郎的汇率：

{% tabs fallback-to %}
{% tab 'Scala 2 and 3' for=fallback-to %}

```scala
val usdQuote = Future {
  connection.getCurrentValue(USD)
}.map {
  usd => "Value: " + usd + "$"
}
val chfQuote = Future {
  connection.getCurrentValue(CHF)
} map {
  chf => "Value: " + chf + "CHF"
}

val anyQuote = usdQuote.fallbackTo(chfQuote)

anyQuote.foreach { println(_) }
```

{% endtab %}
{% endtabs %}

组合器 `andThen` 的用法是出于纯粹的side-effecting目的。经 `andThen` 返回的新 future 无论原 future 成功或失败都会返回与原 future 一模一样的结果。
一旦原 future 完成并返回结果，`andThen` 后跟的代码块就会被调用，且新 future 将返回与原 future 一样的结果，这确保了多个 `andThen` 调用的顺序执行。正如下例所示，这段代码可以从社交网站上把近期发出的帖子收集到一个可变集合里，然后把它们都打印在屏幕上：

{% tabs futures-10 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-10 %}

```scala
val allposts = mutable.Set[String]()

Future {
  session.getRecentPosts
} andThen {
  case Success(posts) => allposts ++= posts
} andThen {
  case _ =>
    clearAll()
    for (post <- allposts) render(post)
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-10 %}

```scala
val allPosts = mutable.Set[String]()

Future {
  session.getRecentPosts()
}.andThen {
  case Success(posts) => allPosts ++= posts
}.andThen {
  case _ =>
    clearAll()
    for post <- allPosts do render(post)
}
```
{% endtab %}
{% endtabs %}

综上所述，在 future 上的组合器功能是纯函数式的。
每种组合器都会返回一个与原future相关的新 future 对象。

### 投影

为了确保for解构(for-comprehensions)能够返回异常， future s也提供了投影(projections)。如果原 future 对象失败了，`failed` 的投影会返回一个带有 `Throwable` 类型返回值的 future 对象。如果原 future 成功了，`failed` 的投影失败并有一个 `NoSuchElementException`。下面就是一个在屏幕上打印出异常的例子：

{% tabs futures-11 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-11 %}

```scala
val f = Future {
  2 / 0
}
for (exc <- f.failed) println(exc)
```

{% endtab %}
{% tab 'Scala 3' for=futures-11 %}

```scala
val f = Future {
  2 / 0
}
for exc <- f.failed do println(exc)
```

{% endtab %}
{% endtabs %}

本例中的 for-comprehension 翻译成：

{% tabs for-comp-tran %}
{% tab 'Scala 2 and 3' for=for-comp-tran %}

```scala
f.failed.foreach(exc => println(exc))
```

{% endtab %}
{% endtabs %}

因为 `f` 在这没有成功，该闭包被注册到新成功的 `Future[Throwable]` 上的 `foreach`。
下面的例子不会在屏幕上打印出任何东西：

{% tabs futures-12 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-12 %}

```scala
val f = Future {
  4 / 2
}
for (exc <- f.failed) println(exc)
```

{% endtab %}
{% tab 'Scala 3' for=futures-12 %}

```scala
val g = Future {
  4 / 2
}
for exc <- g.failed do println(exc)
```

{% endtab %}
{% endtabs %}

<!--
There is another projection called `timedout` which is specific to the
`FutureTimeoutException`. It works in exactly the same way as the
`failed` projection, but is triggered only for this exception type. In
all other cases, it fails with a `NoSuchElementException`.
-->

<!--
TODO: the `failed` projection can be extended to be parametric in
the throwable types it matches.
-->

<!--
Invoking the `Future.apply` construct uses a global execution context to start an asynchronous computation. In the case the client desires to use a custom execution context to start an asynchronous computation:

    val f = customExecutionContext Future {
      4 / 2
    }
-->

### Future的扩展

用更多的实用方法来对 Futures API 进行扩展支持已经被提上了日程，这将为很多外部框架提供更多专业工具。

## 阻塞（Blocking）

Future 通常是异步的，不会阻塞底层执行线程。
但是，在某些情况下，有必要阻塞。
我们区分了两种形式的阻塞执行线程：
调用任意代码，从 future 来内部阻塞线程，
以及从另一个 future 外部阻塞，等待该 future 完成。

### Future 内的阻塞

正如在全局 `ExecutionContext` 中看到的那样，可以使用 `blocking` 结构通知某个阻塞调用的 `ExecutionContext`。
但是，实现完全由 `ExecutionContext`。一些 `ExecutionContext`，如 `ExecutionContext.global`，用 `MangedBlocker` 的办法实现 `blocking`，而另外一样通过执行上下文，如固定线程池来实现 `blocking`：
通过“ManagedBlocker”实现“阻塞”，一些执行上下文，如固定线程池：

{% tabs fixed-thread-pool %}
{% tab 'Scala 2 and 3' for=fixed-thread-pool %}

```scala
ExecutionContext.fromExecutor(Executors.newFixedThreadPool(x))
```

{% endtab %}
{% endtabs %}

将不作任何事，就像下面演示的那样：

{% tabs futures-13 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-13 %}

```scala
implicit val ec =
  ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

Future {
  blocking { blockingStuff() }
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-13 %}

```scala
given ExecutionContext =
  ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

Future {
  blocking { blockingStuff() }
}
```

{% endtab %}
{% endtabs %}

和以下代码有一样的副作用：

{% tabs alternative %}
{% tab 'Scala 2 and 3' for=alternative %}

```scala
Future { blockingStuff() }
```

{% endtab %}
{% endtabs %}

阻塞代码也可能抛出异常。这种情况下，异常被转发给调用者。

### Future 外部的阻塞

正如前面所说的，为了性能和防止死锁，强烈建议不要在future上用阻塞。
虽然在futures中使用这些功能方面的首选方式是回调和组合器，但在某些处理中也会需要用到阻塞，并且 Futures API 和 Promises API也支持它。

在之前的并发交易(concurrency trading)例子中，在应用的最后有一处用到阻塞来确定是否所有的 futures已经完成。这有个如何使用阻塞来处理一个 future 结果的例子：

{% tabs futures-14 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-14 %}

```scala
import scala.concurrent._
import scala.concurrent.duration._

object awaitPurchase {
  def main(args: Array[String]): Unit = {
    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    val purchase = rateQuote map { quote =>
      if (isProfitable(quote)) connection.buy(amount, quote)
      else throw new Exception("not profitable")
    }

    Await.result(purchase, 0.nanos)
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-14 %}

```scala
import scala.concurrent.*
import scala.concurrent.duration.*

@main def awaitPurchase =
  val rateQuote = Future {
    connection.getCurrentValue(USD)
  }

  val purchase = rateQuote.map { quote =>
    if isProfitable(quote) then connection.buy(amount, quote)
    else throw Exception("not profitable")
  }

  Await.result(purchase, 0.nanos)
```

{% endtab %}
{% endtabs %}

在这种情况下这个 future 是不成功的，这个调用者转发出了该 future 对象不成功的异常。它包含了 `failed` 的投影(projection)-- 阻塞(blocking)该结果将会造成一个 `NoSuchElementException` 异常在原 future 对象被成功计算的情况下被抛出。

相反的，调用`Await.ready`来等待这个future直到它已完成，但获不到它的结果。同样的方式，调用那个方法时如果这个future是失败的，它将不会抛出异常。

The `Future` trait实现了 `Awaitable` trait 还有其 `ready()` 和 `result()` 方法。这些方法不能被客户端直接调用，它们只能通过执行环境上下文来进行调用。

## 异常(Exceptions)

当异步计算抛出未处理的异常时，与那些计算相关的 futures 就失败了。失败的 futures 存储了一个 `Throwable` 的实例，而不是返回值。`Futures` 提供 `failed` 投影方法，它允许这个 `Throwable` 被当作另一个 `Future` 的成功值来处理。下列特殊异常的处理方式不同：
1. `scala.runtime.NonLocalReturnControl[_]` -- 此异常保存了一个与返回相关联的值。通常情况下，方法体中的 `return` 结构被翻译成带有异常的 `throw` 。相关联的值将会存储到future或一个promise中，而不是一直保存在这个异常中。

2. `ExecutionException` -- 当因为一个未处理的 `InterruptedException`, `Error` 或者 `scala.util.control.ControlThrowable` 导致计算失败时会被存储起来。这种情况下， `ExecutionException` 会为此具有未处理的异常。这些异常会在执行失败的异步计算线程中重新抛出。这样做的目的，是为了防止正常情况下没有被客户端代码处理过的那些关键的、与控制流相关的异常继续传播下去，同时告知客户端其中的 future 对象是计算失败的。

致命异常（由 `NonFatal` 确定）在执行失败的异步计算的线程中重新引发。这会通知管理问题执行线程的代码，并允许它在必要时快速失败。更精确的语义描述请参见[`NonFatal`](https://www.scala-lang.org/api/current/scala/util/control/NonFatal$.html)。

## Promise

到目前为止，我们仅考虑了通过异步计算的方式创建 `Future` 对象来使用 `Future` 的方法。尽管如此，futures也可以使用 *promises* 来创建。

如果说futures是为了一个还没有存在的结果，而当成一种只读占位符的对象类型去创建，那么promise就被认为是一个可写的，可以实现一个future的单一赋值容器。这就是说，promise通过这种 `success` 方法可以成功去实现一个带有值(通过 “实现” 该 promise)的future。相反的，用 `failure` 方法。
一个 promise 也能用来实现带有异常的 future，通过这个失败的promise。

一个promise `p` 通过 `p.future` 方式返回future。 这个futrue对象被指定到promise `p`。根据这种实现方式，可能就会出现 `p.future eq p` 的情况。

考虑下面的生产者-消费者的例子，其中一个计算产生一个值，并把它转移到另一个使用该值的计算。这个传递中的值通过一个 promise 来完成。

{% tabs promises %}
{% tab 'Scala 2 and 3' for=promises %}

```scala
import scala.concurrent.{ Future, Promise }
import scala.concurrent.ExecutionContext.Implicits.global

val p = Promise[T]()
val f = p.future

val producer = Future {
  val r = produceSomething()
  p.success(r)
  continueDoingSomethingUnrelated()
}

val consumer = Future {
  startDoingSomething()
  f.foreach { r =>
    doSomethingWithResult()
  }
}
```

{% endtab %}
{% endtabs %}

在这里，我们创建了一个promise并利用它的 `future` 方法获得由它实现的 `Future`。然后，我们开始了两种异步计算。第一种做了某些计算，结果值存放在r中，通过执行promise `p`，这个值被用来完成future对象 `f`。第二种做了某些计算，然后读取实现了 future `f` 的计算结果值 `r`。需要注意的是，在 `producer` 完成执行 `continueDoingSomethingUnrelated()` 方法这个任务之前，消费者可以获得这个结果值。

正如前面提到的，promises 具有单赋值语义。因此，它们仅能被完成一次。在一个已经计算完成的 promise 或者 failed 的promise上调用 `success` 方法将会抛出一个 `IllegalStateException` 异常。

下面的这个例子显示了如何使 promise 失败。

{% tabs futures-15 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-15 %}

```scala
val p = Promise[T]()
val f = p.future

val producer = Future {
  val r = someComputation
  if (isInvalid(r))
    p.failure(new IllegalStateException)
  else {
    val q = doSomeMoreComputation(r)
    p.success(q)
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-15 %}

```scala
val p = Promise[T]()
val f = p.future

val producer = Future {
  val r = someComputation
  if isInvalid(r) then
    p.failure(new IllegalStateException)
  else
    val q = doSomeMoreComputation(r)
    p.success(q)
}
```

{% endtab %}
{% endtabs %}

如上， `producer` 计算出一个中间结果值 `r`，并判断它的有效性。如果它不是有效的，它会通过返回一个异常实现promise `p` 的方式fails the promise，关联的future `f` 是失败的。否则， `producer` 会继续它的计算，最终使用一个有效的结果值实现future f，同时实现 promise p。

Promises也能通过一个complete方法来实现，这个方法采用了一个 `potential value Try[T]`，这个值要么是一个类型为 `Failure[Throwable]` 的失败的结果值，要么是一个类型为 `Success[T]` 的成功的结果值。

类似 `success` 方法，在一个已经完成(completed)的promise对象上调用 `failure` 方法和 `complete` 方法同样会抛出一个 `IllegalStateException` 异常。

应用前面所述的 promises 和 futures  操作的一个优点是，这些方法是单一操作的并且是没有副作用(side-effects)的，因此程序是具有确定性的(deterministic)。确定性意味着，如果该程序没有抛出异常(future 的计算值被获得)，无论并行的程序如何调度，那么程序的结果将会永远是一样的。

在一些情况下，客户端也许希望能够只在 promise 没有完成的情况下完成该 promise 的计算(例如，如果有多个HTTP请求被多个不同的futures对象来执行，并且客户端只关心第一个HTTP应答(response)，该应答对应于第一个完成该 promise 的future)。因为这些原因，future提供了 `tryComplete`，`trySuccess` 和 `tryFailure` 方法。客户端需要意识到调用这些的结果是不确定的，调用的结果将以来从程序执行的调度。

`completeWith` 方法将用另外一个 future 完成 promise 计算。当该 future 结束的时候，该 promise 对象得到那个 future 对象同样的值，如下的程序将打印 `1`：

{% tabs promises-2 %}
{% tab 'Scala 2 and 3' for=promises-2 %}

```scala
val f = Future { 1 }
val p = promise[Int]()

p.completeWith(f)

p.future.foreach { x =>
  println(x)
}
```

{% endtab %}
{% endtabs %}

当让一个promise以异常失败的时候，三个子类型的 `Throwable` 异常被分别的处理。如果中断该promise的可抛出(Throwable)一场是`scala.runtime.NonLocalReturnControl`，那么该promise将以对应的值结束；如果是一个Error的实例，`InterruptedException` 或者 `scala.util.control.ControlThrowable`，那么该 `Throwable` 异常将会封装一个 `ExecutionException` 异常，该 `ExectionException` 将会让该 promise 以失败结束。

通过使用 promises，futures 的 `onComplete` 方法和 `future` 的构造方法，你能够实现前文描述的任何函数式组合组合器(compition combinators)。
让我们来假设一下你想实现一个新的组合器 `first`，该组合器使用两个future `f` 和 `g`，然后生产出第三个 future，该future能够用 `f` 或者 `g` 来完成（看哪一个先到），但前提是它能够成功。

这里有个关于如何去做的实例：

{% tabs futures-16 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-16 %}

```scala
def first[T](f: Future[T], g: Future[T]): Future[T] = {
  val p = Promise[T]

  f.foreach { x =>
    p.trySuccess(x)
  }

  g.foreach { x =>
    p.trySuccess(x)
  }

  p.future
}
```

{% endtab %}
{% tab 'Scala 3' for=futures-16 %}

```scala
def first[T](f: Future[T], g: Future[T]): Future[T] =
  val p = Promise[T]

  f.foreach { x =>
    p.trySuccess(x)
  }

  g.foreach { x =>
    p.trySuccess(x)
  }

  p.future
```

{% endtab %}
{% endtabs %}

注意，在这种实现方式中，如果 `f` 和 `g` 都不成功，那么 `first(f, g)` 将不会完成（即返回一个值或者返回一个异常）。

<!--
## Migration p

scala.actor.Futures?
for clients


## Implementing custom futures and promises p
for library writers
-->

## 工具(Utilities)

为了简化在并发应用中处理时序(time)的问题， `scala.concurrent` 引入了 `Duration` 抽象。`Duration` 不是被作为另外一个通常的时间抽象存在的。他是为了用在并发(concurrency)库中使用的，`Duration` 位于 `scala.concurrent` 包中。

`Duration` 是表示时间长短的基础类，其可以是有限的或者无限的。有限的duration用 `FiniteDuration` 类来表示，并通过 `Long` 长度和 `java.util.concurrent.TimeUnit` 来构造。无限的 durations，同样扩展自 `Duration`，只在两种情况下存在，`Duration.Inf` 和 `Duration.MinusInf`。库中同样提供了一些 `Duration` 的子类用来做隐式的转换，这些子类不应被直接使用。

抽象的 `Duration` 类包含了如下方法：

1. 到不同时间单位的转换（`toNanos`，`toMicros`，`toMillis`，`toSeconds`，`toMinutes`，`toHours`，`toDays` 和 `toUnit(unit: TimeUnit)`）。
2. durations的比较（`<`，`<=`，`>`和`>=`）。
3. 算术运算符（`+`，`-`，`*`，`/`和 `unary_-`）
4. `this` duration 与提供的参数之间的最大和最小的方法（`min`，`max`）。
5. 检查 duration是否有限（`isFinite`）。

`Duration` 能够用如下方法实例化（`instantiated`）：

1. 通过 `Int` 和 `Long` 类型隐式转换，例如：`val d = 100 millis`。
2. 通过传递一个 `Long` 长度和 `java.util.concurrent.TimeUnit`。例如：`val d = Duration(100, MILLISECONDS)`。
3. 通过传递一个字符串来表示时间区间，例如： `val d = Duration("1.2 µs")`。

Duration 也提供了 `unapply` 方法，因此可以被用于模式匹配中，例如：

{% tabs futures-17 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-17 %}

```scala
import scala.concurrent.duration._
import java.util.concurrent.TimeUnit._

// instantiation
val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
val d2 = Duration(100, "millis") // from Long and String
val d3 = 100 millis // implicitly from Long, Int or Double
val d4 = Duration("1.2 µs") // from String

// pattern matching
val Duration(length, unit) = 5 millis
```

{% endtab %}
{% tab 'Scala 3' for=futures-17 %}

```scala
import scala.concurrent.duration.*
import java.util.concurrent.TimeUnit.*

// instantiation
val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
val d2 = Duration(100, "millis") // from Long and String
val d3 = 100.millis // implicitly from Long, Int or Double
val d4 = Duration("1.2 µs") // from String

// pattern matching
val Duration(length, unit) = 5.millis
```

{% endtab %}
{% endtabs %}
