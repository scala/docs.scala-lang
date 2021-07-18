---
layout: singlepage-overview
title: Future和Promise

partof: futures

language: zh-cn
---

**Philipp Haller, Aleksandar Prokopec, Heather Miller, Viktor Klang, Roland Kuhn, and Vojin Jovanovic 著**

## 简介

Future提供了一套高效便捷的非阻塞并行操作管理方案。其基本思想很简单，所谓Future，指的是一类占位符对象，用于指代某些尚未完成的计算的结果。一般来说，由Future指代的计算都是并行执行的，计算完毕后可另行获取相关计算结果。以这种方式组织并行任务，便可以写出高效、异步、非阻塞的并行代码。

默认情况下，future和promise并不采用一般的阻塞操作，而是依赖回调进行非阻塞操作。为了在语法和概念层面更加简明扼要地使用这些回调，Scala还提供了flatMap、foreach和filter等算子，使得我们能够以非阻塞的方式对future进行组合。当然，future仍然支持阻塞操作——必要时，可以阻塞等待future（不过并不鼓励这样做）。

## Future

所谓Future，是一种用于指代某个尚未就绪的值的对象。而这个值，往往是某个计算过程的结果：

- 若该计算过程尚未完成，我们就说该Future未就位；
- 若该计算过程正常结束，或中途抛出异常，我们就说该Future已就位。

Future的就位分为两种情况：

- 当Future带着某个值就位时，我们就说该Future携带计算结果成功就位。
- 当Future因对应计算过程抛出异常而就绪，我们就说这个Future因该异常而失败。

Future的一个重要属性在于它只能被赋值一次。一旦给定了某个值或某个异常，future对象就变成了不可变对象——无法再被改写。

创建future对象最简单的方法是调用future方法，该future方法启用异步(asynchronous)计算并返回保存有计算结果的futrue，一旦该future对象计算完成，其结果就变的可用。

注意_Future[T]_ 是表示future对象的类型，而future是方法，该方法创建和调度一个异步计算，并返回随着计算结果而完成的future对象。

这最好通过一个例子予以说明。

假设我们使用某些流行的社交网络的假定API获取某个用户的朋友列表，我们将打开一个新对话(session)，然后发送一个请求来获取某个特定用户的好友列表。

    import scala.concurrent._
    import ExecutionContext.Implicits.global

    val session = socialNetwork.createSessionFor("user", credentials)
    val f: Future[List[Friend]] = Future {
      session.getFriends()
    }

以上，首先导入scala.concurrent 包使得Future类型和future构造函数可见。我们将马上解释第二个导入。

然后我们初始化一个session变量来用作向服务器发送请求，用一个假想的 createSessionFor 方法来返回一个List[Friend]。为了获得朋友列表，我们必须通过网络发送一个请求，这个请求可能耗时很长。这能从调用getFriends方法得到解释。为了更好的利用CPU，响应到达前不应该阻塞(block)程序的其他部分执行，于是在计算中使用异步。future方法就是这样做的，它并行地执行指定的计算块，在这个例子中是向服务器发送请求和等待响应。

一旦服务器响应，future f 中的好友列表将变得可用。

未成功的尝试可能会导致一个异常(exception)。在下面的例子中，session的值未被正确的初始化，于是在future的计算中将抛出NullPointerException，future f 不会圆满完成，而是以此异常失败。

    val session = null
    val f: Future[List[Friend]] = Future {
      session.getFriends
    }

`import ExecutionContext.Implicits.global` 上面的线条导入默认的全局执行上下文(global execution context)，执行上下文执行执行提交给他们的任务，也可把执行上下文看作线程池，这对于future方法来说是必不可少的，因为这可以处理异步计算如何及何时被执行。我们可以定义自己的执行上下文，并在future上使用它，但是现在只需要知道你能够通过上面的语句导入默认执行上下文就足够了。

我们的例子是基于一个假定的社交网络API，此API的计算包含发送网络请求和等待响应。提供一个涉及到你能试着立即使用的异步计算的例子是公平的。假设你有一个文本文件，你想找出一个特定的关键字第一次出现的位置。当磁盘正在检索此文件内容时，这种计算可能会陷入阻塞，因此并行的执行该操作和程序的其他部分是合理的(make sense)。

    val firstOccurrence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }

### Callbacks(回调函数)

现在我们知道如何开始一个异步计算来创建一个新的future值，但是我们没有展示一旦此结果变得可用后如何来使用，以便我们能够用它来做一些有用的事。我们经常对计算结果感兴趣而不仅仅是它的副作用。

在许多future的实现中，一旦future的client对future的结果感兴趣，它不得不阻塞它自己的计算直到future完成——然后才能使用future的值继续它自己的计算。虽然这在Scala的Future API（在后面会展示）中是允许的，但是从性能的角度来看更好的办法是一种完全非阻塞的方法，即在future中注册一个回调，future完成后这个回调称为异步回调。如果当注册回调时future已经完成，则回调可能是异步执行的，或在相同的线程中循序执行。

注册回调最通常的形式是使用OnComplete方法，即创建一个`Try[T] => U`类型的回调函数。如果future成功完成，回调则会应用到Success[T]类型的值中，否则应用到` Failure[T] `类型的值中。

 `Try[T]` 和`Option[T]`或 `Either[T, S]`相似，因为它是一个可能持有某种类型值的单子。然而，它是特意设计来保持一个值或某个可抛出(throwable)对象。`Option[T]` 既可以是一个值（如：`Some[T]`）也可以是完全无值（如：`None`），如果`Try[T]`获得一个值则它为`Success[T]` ，否则为`Failure[T]`的异常。 `Failure[T]` 获得更多的关于为什么这儿没值的信息，而不仅仅是None。同时也可以把`Try[T]`看作一种特殊版本的`Either[Throwable, T]`，专门用于左值为可抛出类型(Throwable)的情形。

回到我们的社交网络的例子，假设我们想要获取我们最近的帖子并显示在屏幕上，我们通过调用getRecentPosts方法获得一个返回值List[String]——一个近期帖子的列表文本：

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onComplete {
      case Success(posts) => for (post <- posts) println(post)
      case Failure(t) => println("An error has occured: " + t.getMessage)
    }

onComplete方法一般在某种意义上它允许客户处理future计算出的成功或失败的结果。对于仅仅处理成功的结果，onSuccess 回调使用如下（该回调以一个偏函数(partial function)为参数）：

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onSuccess {
      case posts => for (post <- posts) println(post)
    }

对于处理失败结果，onFailure回调使用如下：

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onFailure {
      case t => println("An error has occured: " + t.getMessage)
    }

    f onSuccess {
      case posts => for (post <- posts) println(post)
    }

如果future失败，即future抛出异常，则执行onFailure回调。

因为偏函数具有 isDefinedAt方法， onFailure方法只有在特定的Throwable类型对象中被定义才会触发。下面例子中的onFailure回调永远不会被触发：

    val f = Future {
      2 / 0
    }

    f onFailure {
      case npe: NullPointerException =>
        println("I'd be amazed if this printed out.")
    }

回到前面查找某个关键字第一次出现的例子，我们想要在屏幕上打印出此关键字的位置：

    val firstOccurrence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }

    firstOccurrence onSuccess {
      case idx => println("The keyword first appears at position: " + idx)
    }

    firstOccurrence onFailure {
      case t => println("Could not process file: " + t.getMessage)
    }

 onComplete,、onSuccess 和 onFailure 方法都具有Unit的结果类型，这意味着不能链接使用这些方法的回调。注意这种设计是为了避免暗示而刻意为之的，因为链接回调也许暗示着按照一定的顺序执行注册回调（回调注册在同一个future中是无序的）。

也就是说，我们现在应讨论论何时调用callback。因为callback需要future的值是可用的，所有回调只能在future完成之后被调用。然而，不能保证callback在完成future的线程或创建callback的线程中被调用。反而， 回调(callback)会在future对象完成之后的一些线程和一段时间内执行。所以我们说回调(callback)最终会被执行。

此外，回调(callback)执行的顺序不是预先定义的，甚至在相同的应用程序中callback的执行顺序也不尽相同。事实上，callback也许不是一个接一个连续的调用，但是可能会在同一时间同时执行。这意味着在下面的例子中，变量totalA也许不能在计算上下文中被设置为正确的大写或者小写字母。

    @volatile var totalA = 0

    val text = Future {
      "na" * 16 + "BATMAN!!!"
    }

    text onSuccess {
      case txt => totalA += txt.count(_ == 'a')
    }

    text onSuccess {
      case txt => totalA += txt.count(_ == 'A')
    }

以上，这两个回调(callbacks)可能是一个接一个地执行的，这样变量totalA得到的预期值为18。然而，它们也可能是并发执行的，于是totalA最终可能是16或2，因为+= 是一个不可分割的操作符（即它是由一个读和一个写的步骤组成，这样就可能使其与其他的读和写任意交错执行）。

考虑到完整性，回调的使用情景列在这儿：

- 在future中注册onComplete回调的时候要确保最后future执行完成之后调用相应的终止回调。

- 注册onSuccess或者onFailure回调时也和注册onComplete一样，不同之处在于future执行成功或失败分别调用onSuccess或onSuccess的对应的闭包。

- 注册一个已经完成的future的回调最后将导致此回调一直处于执行状态（1所隐含的）。

- 在future中注册多个回调的情况下，这些回调的执行顺序是不确定的。事实上，这些回调也许是同时执行的，然而，特定的ExecutionContext执行可能导致明确的顺序。

- 在一些回调抛出异常的情况下，其他的回调的执行不受影响。

- 在一些情况下，回调函数永远不能结束（例如，这些回调处于无限循环中），其他回调可能完全不会执行。在这种情况下，对于那些潜在的阻塞回调要使用阻塞的构造（例子如下）。

- 一旦执行完，回调将从future对象中移除，这样更适合JVM的垃圾回收机制(GC)。

### 函数组合(Functional Composition)和For解构(For-Comprehensions)

尽管前文所展示的回调机制已经足够把future的结果和后继计算结合起来的，但是有些时候回调机制并不易于使用，且容易造成冗余的代码。我们可以通过一个例子来说明。假设我们有一个用于进行货币交易服务的API，我们想要在有盈利的时候购进一些美元。让我们先来看看怎样用回调来解决这个问题：

    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    rateQuote onSuccess { case quote =>
      val purchase = Future {
        if (isProfitable(quote)) connection.buy(amount, quote)
        else throw new Exception("not profitable")
      }

      purchase onSuccess {
        case _ => println("Purchased " + amount + " USD")
      }
    }

首先，我们创建一个名为rateQuote的future对象并获得当前的汇率。在服务器返回了汇率且该future对象成功完成了之后，计算操作才会从onSuccess回调中执行，这时我们就可以开始判断买还是不买了。所以我们创建了另一个名为purchase的future对象，用来在可盈利的情况下做出购买决定，并在稍后发送一个请求。最后，一旦purchase运行结束，我们会在标准输出中打印一条通知消息。

这确实是可行的，但是有两点原因使这种做法并不方便。其一，我们不得不使用onSuccess，且不得不在其中嵌套purchase future对象。试想一下，如果在purchase执行完成之后我们可能会想要卖掉一些其他的货币。这时我们将不得不在onSuccess的回调中重复这个模式，从而可能使代码过度嵌套，过于冗长，并且难以理解。

其二，purchase只是定义在局部范围内--它只能被来自onSuccess内部的回调响应。这也就是说，这个应用的其他部分看不到purchase，而且不能为它注册其他的onSuccess回调，比如说卖掉些别的货币。

为解决上述的两个问题，futures提供了组合器（combinators）来使之具有更多易用的组合形式。映射（map）是最基本的组合器之一。试想给定一个future对象和一个通过映射来获得该future值的函数，映射方法将创建一个新Future对象，一旦原来的Future成功完成了计算操作，新的Future会通过该返回值来完成自己的计算。你能够像理解容器(collections)的map一样来理解future的map。

让我们用map的方法来重构一下前面的例子：

    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    val purchase = rateQuote map { quote =>
      if (isProfitable(quote)) connection.buy(amount, quote)
      else throw new Exception("not profitable")
    }

    purchase onSuccess {
      case _ => println("Purchased " + amount + " USD")
    }

通过对rateQuote的映射我们减少了一次onSuccess的回调，更重要的是避免了嵌套。这时如果我们决定出售一些货币就可以再次使用purchase方法上的映射了。

可是如果isProfitable方法返回了false将会发生些什么？会引发异常？这种情况下，purchase的确会因为异常而失败。不仅仅如此，想象一下，链接的中断和getCurrentValue方法抛出异常会使rateQuote的操作失败。在这些情况下映射将不会返回任何值，而purchase也会会自动的以和rateQuote相同的异常而执行失败。

总之，如果原Future的计算成功完成了，那么返回的Future将会使用原Future的映射值来完成计算。如果映射函数抛出了异常则Future也会带着该异常完成计算。如果原Future由于异常而计算失败，那么返回的Future也会包含相同的异常。这种异常的传导方式也同样适用于其他的组合器(combinators)。

使之能够在For-comprehensions原则下使用，是设计Future的目的之一。也正是因为这个原因，Future还拥有flatMap，filter和foreach等组合器。其中flatMap方法可以构造一个函数，它可以把值映射到一个姑且称为g的新future，然后返回一个随g的完成而完成的Future对象。

让我们假设我们想把一些美元兑换成瑞士法郎。我们必须为这两种货币报价，然后再在这两个报价的基础上确定交易。下面是一个在for-comprehensions中使用flatMap和withFilter的例子：

    val usdQuote = Future { connection.getCurrentValue(USD) }
    val chfQuote = Future { connection.getCurrentValue(CHF) }

    val purchase = for {
      usd <- usdQuote
      chf <- chfQuote
      if isProfitable(usd, chf)
    } yield connection.buy(amount, chf)

    purchase onSuccess {
      case _ => println("Purchased " + amount + " CHF")
    }

purchase只有当usdQuote和chfQuote都完成计算以后才能完成-- 它以其他两个Future的计算值为前提所以它自己的计算不能更早的开始。

上面的for-comprhension将被转换为：

    val purchase = usdQuote flatMap {
      usd =>
      chfQuote
        .withFilter(chf => isProfitable(usd, chf))
        .map(chf => connection.buy(amount, chf))
    }

这的确是比for-comprehension稍微难以把握一些，但是我们这样分析有助于您更容易的理解flatMap的操作。FlatMap操作会把自身的值映射到其他future对象上，并随着该对象计算完成的返回值一起完成计算。在我们的例子里，flatMap用usdQuote的值把chfQuote的值映射到第三个futrue对象里，该对象用于发送一定量瑞士法郎的购入请求。只有当通过映射返回的第三个future对象完成了计算，purchase才能完成计算。

这可能有些难以置信，但幸运的是faltMap操作在for-comprhensions模式以外很少使用，因为for-comprehensions本身更容易理解和使用。

再说说filter，它可以用于创建一个新的future对象，该对象只有在满足某些特定条件的前提下才会得到原始future的计算值，否则就会抛出一个NoSuchElementException的异常而失败。调用了filter的future，其效果与直接调用withFilter完全一样。

作为组合器的collect同filter之间的关系有些类似容器（collections）API里的那些方法之间的关系。

值得注意的是，调用foreach组合器并不会在计算值可用的时候阻塞当前的进程去获取计算值。恰恰相反，只有当future对象成功计算完成了，foreach所迭代的函数才能够被异步的执行。这意味着foreach与onSuccess回调意义完全相同。

由于Future trait(译注: trait有点类似java中的接口(interface)的概念)从概念上看包含两种类型的返回值（计算结果和异常），所以组合器会有一个处理异常的需求。

比方说我们准备在rateQuote的基础上决定购入一定量的货币，那么`connection.buy`方法需要知道购入的数量和期望的报价值，最终完成购买的数量将会被返回。假如报价值偏偏在这个节骨眼儿改变了，那buy方法将会抛出一个`QuoteChangedExecption`，并且不会做任何交易。如果我们想让我们的Future对象返回0而不是抛出那个该死的异常，那我们需要使用recover组合器：

    val purchase: Future[Int] = rateQuote map {
      quote => connection.buy(amount, quote)
    } recover {
      case QuoteChangedException() => 0
    }

这里用到的recover能够创建一个新future对象，该对象当计算完成时持有和原future对象一样的值。如果执行不成功则偏函数的参数会被传递给使原Future失败的那个Throwable异常。如果它把Throwable映射到了某个值，那么新的Future就会成功完成并返回该值。如果偏函数没有定义在Throwable中，那么最终产生结果的future也会失败并返回同样的Throwable。

组合器recoverWith能够创建一个新future对象，当原future对象成功完成计算时，新future对象包含有和原future对象相同的计算结果。若原future失败或异常，偏函数将会返回造成原future失败的相同的Throwable异常。如果此时Throwable又被映射给了别的future，那么新Future就会完成并返回这个future的结果。recoverWith同recover的关系跟flatMap和map之间的关系很像。

fallbackTo组合器生成的future对象可以在该原future成功完成计算时返回结果，如果原future失败或异常返回future参数对象的成功值。在原future和参数future都失败的情况下，新future对象会完成并返回原future对象抛出的异常。正如下面的例子中，本想打印美元的汇率，但是在获取美元汇率失败的情况下会打印出瑞士法郎的汇率：

    val usdQuote = Future {
      connection.getCurrentValue(USD)
    } map {
      usd => "Value: " + usd + "$"
    }
    val chfQuote = Future {
      connection.getCurrentValue(CHF)
    } map {
      chf => "Value: " + chf + "CHF"
    }

    al anyQuote = usdQuote fallbackTo chfQuote

    anyQuote onSuccess { println(_) }

组合器andThen的用法是出于纯粹的side-effecting目的。经andThen返回的新Future无论原Future成功或失败都会返回与原Future一模一样的结果。一旦原Future完成并返回结果，andThen后跟的代码块就会被调用，且新Future将返回与原Future一样的结果，这确保了多个andThen调用的顺序执行。正如下例所示，这段代码可以从社交网站上把近期发出的帖子收集到一个可变集合里，然后把它们都打印在屏幕上：

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

综上所述，Future的组合器功能是纯函数式的，每种组合器都会返回一个与原Future相关的新Future对象。

### 投影(Projections)

为了确保for解构(for-comprehensions)能够返回异常，futures也提供了投影(projections)。如果原future对象失败了，失败的投影(projection)会返回一个带有Throwable类型返回值的future对象。如果原Future成功了，失败的投影(projection)会抛出一个NoSuchElementException异常。下面就是一个在屏幕上打印出异常的例子：

    val f = Future {
      2 / 0
    }
    for (exc <- f.failed) println(exc)

下面的例子不会在屏幕上打印出任何东西：

    val f = Future {
      4 / 2
    }
    for (exc <- f.failed) println(exc)

### Future的扩展

用更多的实用方法来对Futures API进行扩展支持已经被提上了日程，这将为很多外部框架提供更多专业工具。

## Blocking

正如前面所说的，在future的blocking非常有效地缓解性能和预防死锁。虽然在futures中使用这些功能方面的首选方式是Callbacks和combinators，但在某些处理中也会需要用到blocking，并且它也是被Futures and Promises API所支持的。

在之前的并发交易(concurrency trading)例子中，在应用的最后有一处用到block来确定是否所有的futures已经完成。这有个如何使用block来处理一个future结果的例子：

    import scala.concurrent._
    import scala.concurrent.duration._

    def main(args: Array[String]) {
      val rateQuote = Future {
        connection.getCurrentValue(USD)
      }

      val purchase = rateQuote map { quote =>
        if (isProfitable(quote)) connection.buy(amount, quote)
        else throw new Exception("not profitable")
      }

      Await.result(purchase, 0 nanos)
    }

在这种情况下这个future是不成功的，这个调用者转发出了该future对象不成功的异常。它包含了失败的投影(projection)-- 阻塞(blocking)该结果将会造成一个NoSuchElementException异常在原future对象被成功计算的情况下被抛出。

相反的，调用`Await.ready`来等待这个future直到它已完成，但获不到它的结果。同样的方式，调用那个方法时如果这个future是失败的，它将不会抛出异常。

The Future trait实现了Awaitable trait还有其`ready()`和`result()`方法。这些方法不能被客户端直接调用，它们只能通过执行环境上下文来进行调用。

为了允许程序调用可能是阻塞式的第三方代码，而又不必实现Awaitable特质，原函数可以用如下的方式来调用：

    blocking {
      potentiallyBlockingCall()
    }

这段blocking代码也可以抛出一个异常。在这种情况下，这个异常会转发给调用者。

## 异常(Exceptions)

当异步计算抛出未处理的异常时，与那些计算相关的futures就失败了。失败的futures存储了一个Throwable的实例，而不是返回值。Futures提供onFailure回调方法，它用一个PartialFunction去表示一个Throwable。下列特殊异常的处理方式不同：

`scala.runtime.NonLocalReturnControl[_]` --此异常保存了一个与返回相关联的值。通常情况下，在方法体中的返回结构被调用去抛出这个异常。相关联的值将会存储到future或一个promise中，而不是一直保存在这个异常中。

ExecutionException-当因为一个未处理的中断异常、错误或者`scala.util.control.ControlThrowable`导致计算失败时会被存储起来。这种情况下，ExecutionException会为此具有未处理的异常。这些异常会在执行失败的异步计算线程中重新抛出。这样做的目的，是为了防止正常情况下没有被客户端代码处理过的那些关键的、与控制流相关的异常继续传播下去，同时告知客户端其中的future对象是计算失败的。

更精确的语义描述请参见 [NonFatal]。

## Promises

到目前为止，我们仅考虑了通过异步计算的方式创建future对象来使用future的方法。尽管如此，futures也可以使用promises来创建。

如果说futures是为了一个还没有存在的结果，而当成一种只读占位符的对象类型去创建，那么promise就被认为是一个可写的，可以实现一个future的单一赋值容器。这就是说，promise通过这种success方法可以成功去实现一个带有值的future。相反的，因为一个失败的promise通过failure方法就会实现一个带有异常的future。

一个promise p通过p.future方式返回future。 这个futrue对象被指定到promise p。根据这种实现方式，可能就会出现p.future与p相同的情况。

考虑下面的生产者 - 消费者的例子，其中一个计算产生一个值，并把它转移到另一个使用该值的计算。这个传递中的值通过一个promise来完成。

    import scala.concurrent.{ Future, Promise }
    import scala.concurrent.ExecutionContext.Implicits.global

    val p = Promise[T]()
    val f = p.future

    val producer = Future {
      val r = produceSomething()
      p success r
      continueDoingSomethingUnrelated()
    }

    val consumer = Future {
      startDoingSomething()
      f onSuccess {
        case r => doSomethingWithResult()
      }
    }

在这里，我们创建了一个promise并利用它的future方法获得由它实现的Future。然后，我们开始了两种异步计算。第一种做了某些计算，结果值存放在r中，通过执行promise p，这个值被用来完成future对象f。第二种做了某些计算，然后读取实现了future f的计算结果值r。需要注意的是，在生产者完成执行`continueDoingSomethingUnrelated()` 方法这个任务之前，消费者可以获得这个结果值。

正如前面提到的，promises具有单赋值语义。因此，它们仅能被实现一次。在一个已经计算完成的promise或者failed的promise上调用success方法将会抛出一个IllegalStateException异常。

下面的这个例子显示了如何fail a promise。

    val p = promise[T]
    val f = p.future

    val producer = Future {
      val r = someComputation
      if (isInvalid(r))
        p failure (new IllegalStateException)
      else {
        val q = doSomeMoreComputation(r)
        p success q
      }
    }

如上，生产者计算出一个中间结果值r，并判断它的有效性。如果它不是有效的，它会通过返回一个异常实现promise p的方式fails the promise，关联的future f是failed。否则，生产者会继续它的计算，最终使用一个有效的结果值实现future f，同时实现 promise p。

Promises也能通过一个complete方法来实现，这个方法采用了一个`potential value Try[T]`，这个值要么是一个类型为`Failure[Throwable]`的失败的结果值，要么是一个类型为`Success[T]`的成功的结果值。

类似success方法，在一个已经完成(completed)的promise对象上调用failure方法和complete方法同样会抛出一个IllegalStateException异常。

应用前面所述的promises和futures方法的一个优点是，这些方法是单一操作的并且是没有副作用(side-effects)的，因此程序是具有确定性的(deterministic)。确定性意味着，如果该程序没有抛出异常(future的计算值被获得)，无论并行的程序如何调度，那么程序的结果将会永远是一样的。

在一些情况下，客户端也许希望能够只在promise没有完成的情况下完成该promise的计算(例如，如果有多个HTTP请求被多个不同的futures对象来执行，并且客户端只关心第一个HTTP应答(response)，该应答对应于第一个完成该promise的future)。因为这个原因，future提供了tryComplete，trySuccess和tryFailure方法。客户端需要意识到调用这些的结果是不确定的，调用的结果将以来从程序执行的调度。

completeWith方法将用另外一个future完成promise计算。当该future结束的时候，该promise对象得到那个future对象同样的值，如下的程序将打印1：

    val f = Future { 1 }
    val p = promise[Int]

    p completeWith f

    p.future onSuccess {
      case x => println(x)
    }

当让一个promise以异常失败的时候，三总子类型的Throwable异常被分别的处理。如果中断该promise的可抛出(Throwable)一场是`scala.runtime.NonLocalReturnControl`，那么该promise将以对应的值结束；如果是一个Error的实例，`InterruptedException`或者`scala.util.control.ControlThrowable`，那么该可抛出(Throwable)异常将会封装一个ExecutionException异常，该ExectionException将会让该promise以失败结束。

通过使用promises，futures的onComplete方法和future的构造方法，你能够实现前文描述的任何函数式组合组合器(compition combinators)。让我们来假设一下你想实现一个新的组合起，该组合器首先使用两个future对象f和，产生第三个future，该future能够用f或者g来完成，但是只在它能够成功完成的情况下。

这里有个关于如何去做的实例：

    def first[T](f: Future[T], g: Future[T]): Future[T] = {
      val p = promise[T]

      f onSuccess {
        case x => p.trySuccess(x)
      }

      g onSuccess {
        case x => p.trySuccess(x)
      }

      p.future
    }

注意，在这种实现方式中，如果f与g都不是成功的，那么`first(f, g)`将不会实现（即返回一个值或者返回一个异常）。

## 工具(Utilities)

为了简化在并发应用中处理时序(time)的问题，`scala.concurrent`引入了Duration抽象。Duration不是被作为另外一个通常的时间抽象存在的。他是为了用在并发(concurrency)库中使用的，Duration位于`scala.concurrent`包中。

Duration是表示时间长短的基础类，其可以是有限的或者无限的。有限的duration用FiniteDuration类来表示，并通过时间长度`(length)`和`java.util.concurrent.TimeUnit`来构造。无限的durations，同样扩展了Duration，只在两种情况下存在，`Duration.Inf`和`Duration.MinusInf`。库中同样提供了一些Durations的子类用来做隐式的转换，这些子类不应被直接使用。

抽象的Duration类包含了如下方法：

到不同时间单位的转换`(toNanos, toMicros, toMillis, toSeconds, toMinutes, toHours, toDays and toUnit(unit: TimeUnit))`。
durations的比较`(<，<=，>和>=)`。
算术运算符`（+, -, *, / 和单值运算_-）`
duration的最大最小方法`(min，max)`。
测试duration是否是无限的方法`(isFinite)`。
Duration能够用如下方法实例化`(instantiated)`：

隐式的通过Int和Long类型转换得来 `val d = 100 millis`。
通过传递一个`Long length`和`java.util.concurrent.TimeUnit`。例如`val d = Duration(100, MILLISECONDS)`。
通过传递一个字符串来表示时间区间，例如 `val d = Duration("1.2 µs")`。
Duration也提供了unapply方法，因此可以i被用于模式匹配中，例如：

    import scala.concurrent.duration._
    import java.util.concurrent.TimeUnit._

    // instantiation
    val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
    val d2 = Duration(100, "millis") // from Long and String
    val d3 = 100 millis // implicitly from Long, Int or Double
    val d4 = Duration("1.2 µs") // from String

    // pattern matching
    val Duration(length, unit) = 5 millis
