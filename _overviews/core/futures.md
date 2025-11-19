---
layout: singlepage-overview
title: Futures and Promises

partof: futures

languages: [ja, zh-cn]

permalink: /overviews/core/:title.html
---

**By: Philipp Haller, Aleksandar Prokopec, Heather Miller, Viktor Klang, Roland Kuhn, and Vojin Jovanovic**

## Introduction

Futures provide a way to reason about performing many operations
in parallel -- in an efficient and non-blocking way.

A [`Future`](https://www.scala-lang.org/api/current/scala/concurrent/Future.html)
is a placeholder object for a value that may not yet exist.
Generally, the value of the Future is supplied concurrently and can subsequently be used.
Composing concurrent tasks in this way tends to result in faster, asynchronous, non-blocking parallel code.

By default, futures and promises are non-blocking, making use of
callbacks instead of typical blocking operations.
To simplify the use of callbacks both syntactically and conceptually,
Scala provides combinators such as `flatMap`, `foreach`, and `filter` used to compose
futures in a non-blocking way.
Blocking is still possible - for cases where it is absolutely
necessary, futures can be blocked on (although this is discouraged).

<!--
The futures and promises API builds upon the notion of an
`ExecutionContext`, an execution environment designed to manage
resources such as thread pools between parallel frameworks and
libraries (detailed in an accompanying SIP, forthcoming). Futures and
promises are created through such `ExecutionContext`s. For example, this makes it possible,
in the case of an application which requires blocking futures, for an underlying execution
environment to resize itself if necessary to guarantee progress.
-->

A typical future looks like this:

{% tabs futures-00 %}
{% tab 'Scala 2 and 3' for=futures-00 %}
    val inverseFuture: Future[Matrix] = Future {
      fatMatrix.inverse() // non-blocking long lasting computation
    }(executionContext)
{% endtab %}
{% endtabs %}


Or with the more idiomatic:

{% tabs futures-01 class=tabs-scala-version %}

{% tab 'Scala 2' for=futures-01 %}
    implicit val ec: ExecutionContext = ...
    val inverseFuture : Future[Matrix] = Future {
      fatMatrix.inverse()
    } // ec is implicitly passed
{% endtab %}

{% tab 'Scala 3' for=futures-01 %}
    given ExecutionContext = ...
    val inverseFuture : Future[Matrix] = Future {
      fatMatrix.inverse()
    } // execution context is implicitly passed
{% endtab %}

{% endtabs %}

Both code snippets delegate the execution of `fatMatrix.inverse()` to an `ExecutionContext` and embody the result of the computation in `inverseFuture`.


## Execution Context

Future and Promises revolve around [`ExecutionContext`s](https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext.html), responsible for executing computations.

An `ExecutionContext` is similar to an [Executor](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Executor.html):
it is free to execute  computations in a new thread, in a pooled thread or in the current thread
(although executing the computation in the current thread is discouraged -- more on that below).

The `scala.concurrent` package comes out of the box with an `ExecutionContext` implementation, a global static thread pool.
It is also possible to convert an `Executor` into an `ExecutionContext`.
Finally, users are free to extend the `ExecutionContext` trait to implement their own execution contexts,
although this should only be done in rare cases.


### The Global Execution Context

`ExecutionContext.global` is an `ExecutionContext` backed by a [ForkJoinPool](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html).
It should be sufficient for most situations but requires some care.
A `ForkJoinPool` manages a limited number of threads (the maximum number of threads being referred to as *parallelism level*).
The number of concurrently blocking computations can exceed the parallelism level
only if each blocking call is wrapped inside a `blocking` call (more on that below).
Otherwise, there is a risk that the thread pool in the global execution context is starved,
and no computation can proceed.

By default, the `ExecutionContext.global` sets the parallelism level of its underlying fork-join pool to the number of available processors
([Runtime.availableProcessors](https://docs.oracle.com/javase/7/docs/api/java/lang/Runtime.html#availableProcessors%28%29)).
This configuration can be overridden by setting one (or more) of the following VM attributes:

  * scala.concurrent.context.minThreads - defaults to `1`
  * scala.concurrent.context.numThreads - can be a number or a multiplier (N) in the form 'xN' ;  defaults to `Runtime.availableProcessors`
  * scala.concurrent.context.maxThreads - defaults to `Runtime.availableProcessors`

The parallelism level will be set to `numThreads` as long as it remains within `[minThreads; maxThreads]`.

As stated above the `ForkJoinPool` can increase the number of threads beyond its `parallelismLevel` in the presence of blocking computation.
As explained in the `ForkJoinPool` API, this is only possible if the pool is explicitly notified:

{% tabs futures-02 class=tabs-scala-version %}

{% tab 'Scala 2' for=futures-02 %}
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
{% endtab %}
{% tab 'Scala 3' for=futures-02 %}
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
{% endtab %}

{% endtabs %}


Fortunately the concurrent package provides a convenient way for doing so:

{% tabs blocking %}
{% tab 'Scala 2 and 3' for=blocking %}
    import scala.concurrent.Future
    import scala.concurrent.blocking

    Future {
      blocking {
        myLock.lock()
        // ...
      }
    }
{% endtab %}
{% endtabs %}

Note that `blocking` is a general construct that will be discussed more in depth [below](#blocking-inside-a-future).

Last but not least, you must remember that the `ForkJoinPool` is not designed for long-lasting blocking operations.
Even when notified with `blocking` the pool might not spawn new workers as you would expect,
and when new workers are created they can be as many as 32767.
To give you an idea, the following code will use 32000 threads:

{% tabs futures-03 class=tabs-scala-version %}

{% tab 'Scala 2' for=futures-03 %}
    implicit val ec = ExecutionContext.global

    for (i <- 1 to 32000) {
      Future {
        blocking {
          Thread.sleep(999999)
        }
      }
    }
{% endtab %}
{% tab 'Scala 3' for=futures-03 %}
    given ExecutionContext = ExecutionContext.global

    for i <- 1 to 32000 do
      Future {
        blocking {
          Thread.sleep(999999)
        }
      }
{% endtab %}

{% endtabs %}

If you need to wrap long-lasting blocking operations we recommend using a dedicated `ExecutionContext`, for instance by wrapping a Java `Executor`.


### Adapting a Java Executor

Using the `ExecutionContext.fromExecutor` method you can wrap a Java `Executor` into an `ExecutionContext`.
For instance:

{% tabs executor class=tabs-scala-version %}

{% tab 'Scala 2' for=executor %}
    ExecutionContext.fromExecutor(new ThreadPoolExecutor( /* your configuration */ ))
{% endtab %}
{% tab 'Scala 3' for=executor %}
    ExecutionContext.fromExecutor(ThreadPoolExecutor( /* your configuration */ ))
{% endtab %}

{% endtabs %}


### Synchronous Execution Context

One might be tempted to have an `ExecutionContext` that runs computations within the current thread:

{% tabs bad-example %}
{% tab 'Scala 2 and 3' for=bad-example %}
    val currentThreadExecutionContext = ExecutionContext.fromExecutor(
      new Executor {
        // Do not do this!
        def execute(runnable: Runnable) = runnable.run()
    })
{% endtab %}
{% endtabs %}

This should be avoided as it introduces non-determinism in the execution of your future.

{% tabs bad-example-2 %}
{% tab 'Scala 2 and 3' for=bad-example-2 %}
    Future {
      doSomething
    }(ExecutionContext.global).map {
      doSomethingElse
    }(currentThreadExecutionContext)
{% endtab %}
{% endtabs %}

The `doSomethingElse` call might either execute in `doSomething`'s thread or in the main thread, and therefore be either asynchronous or synchronous.
As explained [here](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/) a callback should not be both.



## Futures

A `Future` is an object holding a value which may become available at some point.
This value is usually the result of some other computation:

1. If the computation has not yet completed, we say that the `Future` is **not completed.**
2. If the computation has completed with a value or with an exception, we say that the `Future` is **completed**.

Completion can take one of two forms:

1. When a `Future` is completed with a value, we say that the future was **successfully completed** with that value.
2. When a `Future` is completed with an exception thrown by the computation, we say that the `Future` was **failed** with that exception.

A `Future` has an important property that it may only be assigned
once.
Once a `Future` object is given a value or an exception, it becomes
in effect immutable -- it can never be overwritten.

The simplest way to create a future object is to invoke the `Future.apply`
method which starts an asynchronous computation and returns a
future holding the result of that computation.
The result becomes available once the future completes.

Note that `Future[T]` is a type which denotes future objects, whereas
`Future.apply` is a method which creates and schedules an asynchronous
computation, and then returns a future object which will be completed
with the result of that computation.

This is best shown through an example.

Let's assume that we want to use a hypothetical API of some
popular social network to obtain a list of friends for a given user.
We will open a new session and then send
a request to obtain a list of friends of a particular user:

{% tabs futures-04 class=tabs-scala-version %}

{% tab 'Scala 2' for=futures-04 %}
    import scala.concurrent._
    import ExecutionContext.Implicits.global

    val session = socialNetwork.createSessionFor("user", credentials)
    val f: Future[List[Friend]] = Future {
      session.getFriends()
    }
{% endtab %}
{% tab 'Scala 3' for=futures-04 %}
    import scala.concurrent.*
    import ExecutionContext.Implicits.global

    val session = socialNetwork.createSessionFor("user", credentials)
    val f: Future[List[Friend]] = Future {
      session.getFriends()
    }
{% endtab %}
{% endtabs %}

Above, we first import the contents of the `scala.concurrent` package
to make the type `Future` visible.
We will explain the second import shortly.

We then initialize a session variable which we will use to send
requests to the server, using a hypothetical `createSessionFor`
method.
To obtain the list of friends of a user, a request
has to be sent over a network, which can take a long time.
This is illustrated with the call to the method `getFriends` that returns `List[Friend]`.
To better utilize the CPU until the response arrives, we should not
block the rest of the program -- this computation should be scheduled
asynchronously. The `Future.apply` method does exactly that -- it performs
the specified computation block concurrently, in this case sending
a request to the server and waiting for a response.

The list of friends becomes available in the future `f` once the server
responds.

An unsuccessful attempt may result in an exception. In
the following example, the `session` value is incorrectly
initialized, so the computation in the `Future` block will throw a `NullPointerException`.
This future `f` is then failed with this exception instead of being completed successfully:

{% tabs futures-04b %}
{% tab 'Scala 2 and 3' for=futures-04b %}
    val session = null
    val f: Future[List[Friend]] = Future {
      session.getFriends()
    }
{% endtab %}
{% endtabs %}

The line `import ExecutionContext.Implicits.global` above imports
the default global execution context.
Execution contexts execute tasks submitted to them, and
you can think of execution contexts as thread pools.
They are essential for the `Future.apply` method because
they handle how and when the asynchronous computation is executed.
You can define your own execution contexts and use them with `Future`,
but for now it is sufficient to know that
you can import the default execution context as shown above.

Our example was based on a hypothetical social network API where
the computation consists of sending a network request and waiting
for a response.
It is fair to offer an example involving an asynchronous computation
which you can try out of the box. Assume you have a text file, and
you want to find the position of the first occurrence of a particular keyword.
This computation may involve blocking while the file contents
are being retrieved from the disk, so it makes sense to perform it
concurrently with the rest of the computation.

{% tabs futures-04c %}
{% tab 'Scala 2 and 3' for=futures-04c %}
    val firstOccurrence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }
{% endtab %}
{% endtabs %}


### Callbacks

We now know how to start an asynchronous computation to create a new
future value, but we have not shown how to use the result once it
becomes available, so that we can do something useful with it.
We are often interested in the result of the computation, not just its
side-effects.

In many future implementations, once the client of the future becomes interested
in its result, it has to block its own computation and wait until the future is completed --
only then can it use the value of the future to continue its own computation.
Although this is allowed by the Scala `Future` API as we will show later,
from a performance point of view a better way to do it is in a completely
non-blocking way, by registering a callback on the future.
This callback is called asynchronously once the future is completed. If the
future has already been completed when registering the callback, then
the callback may either be executed asynchronously, or sequentially on
the same thread.

The most general form of registering a callback is by using the `onComplete`
method, which takes a callback function of type `Try[T] => U`.
The callback is applied to the value
of type `Success[T]` if the future completes successfully, or to a value
of type `Failure[T]` otherwise.

The `Try[T]` is similar to `Option[T]` or `Either[T, S]`, in that it is a monad
potentially holding a value of some type.
However, it has been specifically designed to either hold a value or
some throwable object.
Where an `Option[T]` could either be a value (i.e. `Some[T]`) or no value
at all (i.e. `None`), `Try[T]` is a `Success[T]` when it holds a value
and otherwise `Failure[T]`, which holds an exception. `Failure[T]` holds
more information than just a plain `None` by saying why the value is not
there.
In the same time, you can think of `Try[T]` as a special version
of `Either[Throwable, T]`, specialized for the case when the left
value is a `Throwable`.

Coming back to our social network example, let's assume we want to
fetch a list of our own recent posts and render them to the screen.
We do so by calling a method `getRecentPosts` which returns
a `List[String]` -- a list of recent textual posts:

{% tabs futures-05 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-05 %}
    import scala.util.{Success, Failure}

    val f: Future[List[String]] = Future {
      session.getRecentPosts()
    }

    f.onComplete {
      case Success(posts) => for (post <- posts) println(post)
      case Failure(t) => println("An error has occurred: " + t.getMessage)
    }
{% endtab %}
{% tab 'Scala 3' for=futures-05 %}
    import scala.util.{Success, Failure}

    val f: Future[List[String]] = Future {
      session.getRecentPosts()
    }

    f.onComplete {
      case Success(posts) => for post <- posts do println(post)
      case Failure(t) => println("An error has occurred: " + t.getMessage)
    }
{% endtab %}
{% endtabs %}

The `onComplete` method is general in the sense that it allows the
client to handle the result of both failed and successful future
computations. In the case where only successful results need to be
handled, the `foreach` callback can be used:

{% tabs futures-06 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-06 %}
    val f: Future[List[String]] = Future {
      session.getRecentPosts()
    }

    for {
      posts <- f
      post <- posts
    } println(post)
{% endtab %}
{% tab 'Scala 3' for=futures-06 %}
    val f: Future[List[String]] = Future {
      session.getRecentPosts()
    }

    for
      posts <- f
      post <- posts
    do println(post)
{% endtab %}
{% endtabs %}

`Future`s provide a clean way of handling only failed results using
the `failed` projection which converts a `Failure[Throwable]` to a
`Success[Throwable]`. An example of doing this is provided in the
section below on [projections](#projections).

Coming back to the previous example with searching for the first
occurrence of a keyword, you might want to print the position
of the keyword to the screen:

{% tabs futures-oncomplete %}
{% tab 'Scala 2 and 3' for=futures-oncomplete %}
    val firstOccurrence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }

    firstOccurrence.onComplete {
      case Success(idx) => println("The keyword first appears at position: " + idx)
      case Failure(t) => println("Could not process file: " + t.getMessage)
    }
{% endtab %}
{% endtabs %}


The `onComplete` and `foreach` methods both have result type `Unit`, which
means invocations
of these methods cannot be chained. Note that this design is intentional,
to avoid suggesting that chained
invocations may imply an ordering on the execution of the registered
callbacks (callbacks registered on the same future are unordered).

That said, we should now comment on **when** exactly the callback
gets called. Since it requires the value in the future to be available,
it can only be called after the future is completed.
However, there is no guarantee it will be called by the thread
that completed the future or the thread which created the callback.
Instead, the callback is executed by some thread, at some time
after the future object is completed.
We say that the callback is executed **eventually**.

Furthermore, the order in which the callbacks are executed is
not predefined, even between different runs of the same application.
In fact, the callbacks may not be called sequentially one after the other,
but may concurrently execute at the same time.
This means that in the following example the variable `totalA` may not be set
to the correct number of lower case and upper case `a` characters from the computed
text.

{% tabs volatile %}
{% tab 'Scala 2 and 3' for=volatile %}
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
{% endtab %}
{% endtabs %}

Above, the two callbacks may execute one after the other, in
which case the variable `totalA` holds the expected value `18`.
However, they could also execute concurrently, so `totalA` could
end up being either `16` or `2`, since `+=` is not an atomic
operation (i.e. it consists of a read and a write step which may
interleave arbitrarily with other reads and writes).

For the sake of completeness the semantics of callbacks are listed here:

1. Registering an `onComplete` callback on the future
ensures that the corresponding closure is invoked after
the future is completed, eventually.

2. Registering a `foreach` callback has the same
semantics as `onComplete`, with the difference that the closure is only called
if the future is completed successfully.

3. Registering a callback on the future which is already completed
will result in the callback being executed eventually (as implied by
1).

4. In the event that multiple callbacks are registered on the future,
the order in which they are executed is not defined. In fact, the
callbacks may be executed concurrently with one another.
However, a particular `ExecutionContext` implementation may result
in a well-defined order.

5. In the event that some callbacks throw an exception, the
other callbacks are executed regardless.

6. In the event that some callbacks never complete (e.g. the
callback contains an infinite loop), the other callbacks may not be
executed at all. In these cases, a potentially blocking callback must
use the `blocking` construct (see below).

7. Once executed, the callbacks are removed from the future object,
thus being eligible for GC.


### Functional Composition and For-Comprehensions

The callback mechanism we have shown is sufficient to chain future
results with subsequent computations.
However, it is sometimes inconvenient and results in bulky code.
We show this with an example. Assume we have an API for
interfacing with a currency trading service. Suppose we want to buy US
dollars, but only when it's profitable. We first show how this could
be done using callbacks:

{% tabs futures-07 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-07 %}
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
{% endtab %}
{% tab 'Scala 3' for=futures-07 %}
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
{% endtab %}
{% endtabs %}

We start by creating a future `rateQuote` which gets the current exchange
rate.
After this value is obtained from the server and the future successfully
completed, the computation proceeds in the `foreach` callback, and we are
ready to decide whether to buy or not.
We therefore create another future `purchase` which makes a decision to buy only if it's profitable
to do so, and then sends a request.
Finally, once the purchase is completed, we print a notification message
to the standard output.

This works, but is inconvenient for two reasons. First, we have to use
`foreach` and nest the second `purchase` future within
it. Imagine that after the `purchase` is completed we want to sell
some other currency. We would have to repeat this pattern within the
`foreach` callback, making the code overly indented, bulky and hard
to reason about.

Second, the `purchase` future is not in the scope with the rest of
the code -- it can only be acted upon from within the `foreach`
callback. This means that other parts of the application do not
see the `purchase` future and cannot register another `foreach`
callback to it, for example, to sell some other currency.

For these two reasons, futures provide combinators which allow a
more straightforward composition. One of the basic combinators
is `map`, which, given a future and a mapping function for the value of
the future, produces a new future that is completed with the
mapped value once the original future is successfully completed.
You can reason about mapping futures in the same way you reason
about mapping collections.

Let's rewrite the previous example using the `map` combinator:

{% tabs futures-08 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-08 %}
    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    val purchase = rateQuote.map { quote =>
      if (isProfitable(quote)) connection.buy(amount, quote)
      else throw new Exception("not profitable")
    }

    purchase.foreach { amount =>
      println("Purchased " + amount + " USD")
    }
{% endtab %}
{% tab 'Scala 3' for=futures-08 %}
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
{% endtab %}
{% endtabs %}

By using `map` on `rateQuote` we have eliminated one `foreach` callback and,
more importantly, the nesting.
If we now decide to sell some other currency, it suffices to use
`map` on `purchase` again.

But what happens if `isProfitable` returns `false`, hence causing
an exception to be thrown?
In that case `purchase` is failed with that exception.
Furthermore, imagine that the connection was broken and that
`getCurrentValue` threw an exception, failing `rateQuote`.
In that case we'd have no value to map, so the `purchase` would
automatically be failed with the same exception as `rateQuote`.

In conclusion, if the original future is
completed successfully then the returned future is completed with a
mapped value from the original future. If the mapping function throws
an exception the future is completed with that exception. If the
original future fails with an exception then the returned future also
contains the same exception. This exception propagating semantics is
present in the rest of the combinators, as well.

One of the design goals for futures was to enable their use in for-comprehensions.
For this reason, futures also have the `flatMap` and `withFilter`
combinators. The `flatMap` method takes a function that maps the value
to a new future `g`, and then returns a future which is completed once
`g` is completed.

Let's assume that we want to exchange US dollars for Swiss francs
(CHF). We have to fetch quotes for both currencies, and then decide on
buying based on both quotes.
Here is an example of `flatMap` and `withFilter` usage within for-comprehensions:

{% tabs futures-09 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-09 %}
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
{% endtab %}
{% tab 'Scala 3' for=futures-09 %}
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
{% endtab %}
{% endtabs %}

The `purchase` future is completed only once both `usdQuote`
and `chfQuote` are completed -- it depends on the values
of both these futures so its own computation cannot begin
earlier.

The for-comprehension above is translated into:

{% tabs for-translation %}
{% tab 'Scala 2 and 3' for=for-translation %}
    val purchase = usdQuote.flatMap {
      usd =>
        chfQuote
          .withFilter(chf => isProfitable(usd, chf))
          .map(chf => connection.buy(amount, chf))
    }
{% endtab %}
{% endtabs %}

which is a bit harder to grasp than the for-comprehension, but
we analyze it to better understand the `flatMap` operation.
The `flatMap` operation maps its own value into some other future.
Once this different future is completed, the resulting future
is completed with its value.
In our example, `flatMap` uses the value of the `usdQuote` future
to map the value of the `chfQuote` into a third future which
sends a request to buy a certain amount of Swiss francs.
The resulting future `purchase` is completed only once this third
future returned from `map` completes.

This can be mind-boggling, but fortunately the `flatMap` operation
is seldom used outside for-comprehensions, which are easier to
use and understand.

The `filter` combinator creates a new future which contains the value
of the original future only if it satisfies some predicate. Otherwise,
the new future is failed with a `NoSuchElementException`. For futures
calling `filter` has exactly the same effect as does calling `withFilter`.

The relationship between the `collect` and `filter` combinator is similar
to the relationship of these methods in the collections API.

Since the `Future` trait can conceptually contain two types of values
(computation results and exceptions), there exists a need for
combinators which handle exceptions.

Let's assume that based on the `rateQuote` we decide to buy a certain
amount. The `connection.buy` method takes an `amount` to buy and the expected
`quote`. It returns the amount bought. If the
`quote` has changed in the meanwhile, it will throw a
`QuoteChangedException` and it will not buy anything. If we want our
future to contain `0` instead of the exception, we use the `recover`
combinator:

{% tabs recover %}
{% tab 'Scala 2 and 3' for=recover %}
    val purchase: Future[Int] = rateQuote.map {
      quote => connection.buy(amount, quote)
    }.recover {
      case QuoteChangedException() => 0
    }
{% endtab %}
{% endtabs %}

The `recover` combinator creates a new future which holds the same
result as the original future if it completed successfully. If it did
not then the partial function argument is applied to the `Throwable`
which failed the original future. If it maps the `Throwable` to some
value, then the new future is successfully completed with that value.
If the partial function is not defined on that `Throwable`, then the
resulting future is failed with the same `Throwable`.

The `recoverWith` combinator creates a new future which holds the
same result as the original future if it completed successfully.
Otherwise, the partial function is applied to the `Throwable` which
failed the original future. If it maps the `Throwable` to some future,
then this future is completed with the result of that future.
Its relation to `recover` is similar to that of `flatMap` to `map`.

Combinator `fallbackTo` creates a new future which holds the result
of this future if it was completed successfully, or otherwise the
successful result of the argument future. In the event that both this
future and the argument future fail, the new future is completed with
the exception from this future, as in the following example which
tries to print US dollar value, but prints the Swiss franc value in
the case it fails to obtain the dollar value:

{% tabs fallback-to %}
{% tab 'Scala 2 and 3' for=fallback-to %}
	val usdQuote = Future {
	  connection.getCurrentValue(USD)
	}.map {
	  usd => "Value: " + usd + "$"
	}
	val chfQuote = Future {
	  connection.getCurrentValue(CHF)
	}.map {
	  chf => "Value: " + chf + "CHF"
	}

	val anyQuote = usdQuote.fallbackTo(chfQuote)

	anyQuote.foreach { println(_) }
{% endtab %}
{% endtabs %}

The `andThen` combinator is used purely for side-effecting purposes.
It returns a new future with exactly the same result as the current
future, regardless of whether the current future failed or not.
Once the current future is completed with the result, the closure
corresponding to the `andThen` is invoked and then the new future is
completed with the same result as this future. This ensures that
multiple `andThen` calls are ordered, as in the following example
which stores the recent posts from a social network to a mutable set
and then renders all the posts to the screen:

{% tabs futures-10 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-10 %}
    val allPosts = mutable.Set[String]()

    Future {
      session.getRecentPosts()
    }.andThen {
      case Success(posts) => allPosts ++= posts
    }.andThen {
      case _ =>
        clearAll()
        for (post <- allPosts) render(post)
    }
{% endtab %}
{% tab 'Scala 3' for=futures-10 %}
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
{% endtab %}
{% endtabs %}

In summary, the combinators on futures are purely functional.
Every combinator returns a new future which is related to the
future it was derived from.


### Projections

To enable for-comprehensions on a result returned as an exception,
futures also have projections. If the original future fails, the
`failed` projection returns a future containing a value of type
`Throwable`. If the original future succeeds, the `failed` projection
fails with a `NoSuchElementException`. The following is an example
which prints the exception to the screen:

{% tabs futures-11 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-11 %}
    val f = Future {
      2 / 0
    }
    for (exc <- f.failed) println(exc)
{% endtab %}
{% tab 'Scala 3' for=futures-11 %}
    val f = Future {
      2 / 0
    }
    for exc <- f.failed do println(exc)
{% endtab %}
{% endtabs %}

The for-comprehension in this example is translated to:

    f.failed.foreach(exc => println(exc))

Because `f` is unsuccessful here, the closure is registered to
the `foreach` callback on a newly-successful `Future[Throwable]`.
The following example does not print anything to the screen:

{% tabs futures-12 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-12 %}
    val g = Future {
      4 / 2
    }
    for (exc <- g.failed) println(exc)
{% endtab %}
{% tab 'Scala 3' for=futures-12 %}
    val g = Future {
      4 / 2
    }
    for exc <- g.failed do println(exc)
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

### Extending Futures

Support for extending the Futures API with additional utility methods is planned.
This will allow external frameworks to provide more specialized utilities.


## Blocking

Futures are generally asynchronous and do not block the underlying execution threads.
However, in certain cases, it is necessary to block.
We distinguish two forms of blocking the execution thread:
invoking arbitrary code that blocks the thread from within the future,
and blocking from outside another future, waiting until that future gets completed.


### Blocking inside a Future

As seen with the global `ExecutionContext`, it is possible to notify an `ExecutionContext` of a blocking call with the `blocking` construct.
The implementation is however at the complete discretion of the `ExecutionContext`. While some `ExecutionContext` such as `ExecutionContext.global`
implement `blocking` by means of a `ManagedBlocker`, some execution contexts such as the fixed thread pool:

{% tabs fixed-thread-pool %}
{% tab 'Scala 2 and 3' for=fixed-thread-pool %}
    ExecutionContext.fromExecutor(Executors.newFixedThreadPool(x))
{% endtab %}
{% endtabs %}

will do nothing, as shown in the following:

{% tabs futures-13 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-13 %}
    implicit val ec =
      ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

    Future {
      blocking { blockingStuff() }
    }
{% endtab %}
{% tab 'Scala 3' for=futures-13 %}
    given ExecutionContext =
      ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

    Future {
      blocking { blockingStuff() }
    }
{% endtab %}
{% endtabs %}

Has the same effect as

{% tabs alternative %}
{% tab 'Scala 2 and 3' for=alternative %}
    Future { blockingStuff() }
{% endtab %}
{% endtabs %}

The blocking code may also throw an exception. In this case, the exception is forwarded to the caller.


### Blocking outside the Future

As mentioned earlier, blocking on a future is strongly discouraged
for the sake of performance and for the prevention of deadlocks.
Callbacks and combinators on futures are a preferred way to use their results.
However, blocking may be necessary in certain situations and is supported by
the Futures and Promises API.

In the currency trading example above, one place to block is at the
end of the application to make sure that all the futures have been completed.
Here is an example of how to block on the result of a future:

{% tabs futures-14 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-14 %}
    import scala.concurrent._
    import scala.concurrent.duration._

    object awaitPurchase {
      def main(args: Array[String]): Unit = {
        val rateQuote = Future {
          connection.getCurrentValue(USD)
        }

        val purchase = rateQuote.map { quote =>
          if (isProfitable(quote)) connection.buy(amount, quote)
          else throw new Exception("not profitable")
        }

        Await.result(purchase, 0.nanos)
      }
    }
{% endtab %}
{% tab 'Scala 3' for=futures-14 %}
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
{% endtab %}
{% endtabs %}

In the case that the future fails, the caller is forwarded the
exception that the future is failed with. This includes the `failed`
projection -- blocking on it results in a `NoSuchElementException`
being thrown if the original future is completed successfully.

Alternatively, calling `Await.ready` waits until the future becomes
completed, but does not retrieve its result. In the same way, calling
that method will not throw an exception if the future is failed.

The `Future` trait implements the `Awaitable` trait with methods
`ready()` and `result()`. These methods cannot be called directly
by the clients -- they can only be called by the execution context.



## Exceptions

When asynchronous computations throw unhandled exceptions, futures
associated with those computations fail. Failed futures store an
instance of `Throwable` instead of the result value. `Future`s provide
the `failed` projection method, which allows this `Throwable` to be
treated as the success value of another `Future`.
The following exceptions receive special treatment:

1. `scala.runtime.NonLocalReturnControl[_]` -- this exception holds a value
associated with the return. Typically, `return` constructs in method
bodies are translated to `throw`s with this exception. Instead of
keeping this exception, the associated value is stored into the future or a promise.

2. `ExecutionException` - stored when the computation fails due to an
unhandled `InterruptedException`, `Error` or a
`scala.util.control.ControlThrowable`. In this case the
`ExecutionException` has the unhandled exception as its cause. The rationale
behind this is to prevent propagation of critical and control-flow related
exceptions normally not handled by the client code and at the same time inform
the client in which future the computation failed.

Fatal exceptions (as determined by `NonFatal`) are rethrown from the thread executing
the failed asynchronous computation. This informs the code managing the executing
threads of the problem and allows it to fail fast, if necessary. See
[`NonFatal`](https://www.scala-lang.org/api/current/scala/util/control/NonFatal$.html)
for a more precise description of which exceptions are considered fatal.

`ExecutionContext.global` handles fatal exceptions by printing a stack trace, by default.

A fatal exception means that the `Future` associated with the computation will never complete.
That is, "fatal" means that the error is not recoverable for the `ExecutionContext`
and is also not intended to be handled by user code. By contrast, application code may
attempt recovery from a "failed" `Future`, which has completed but with an exception.

An execution context can be customized with a reporter that handles fatal exceptions.
See the factory methods [`fromExecutor`](https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext$.html#fromExecutor(e:java.util.concurrent.Executor,reporter:Throwable=%3EUnit):scala.concurrent.ExecutionContextExecutor)
and [`fromExecutorService`](https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext$.html#fromExecutorService(e:java.util.concurrent.ExecutorService,reporter:Throwable=%3EUnit):scala.concurrent.ExecutionContextExecutorService).

Since it is necessary to set the [`UncaughtExceptionHandler`](https://docs.oracle.com/en/java/javase/20/docs/api/java.base/java/lang/Thread.UncaughtExceptionHandler.html)
for executing threads, as a convenience, when passed a `null` executor,
`fromExecutor` will create a context that is configured the same as `global`,
but with the supplied reporter for handling exceptions.

The following example demonstrates how to obtain an `ExecutionContext` with custom error handling
and also shows the result of different exceptions, as described above:

{% tabs exceptions class=tabs-scala-version %}
{% tab 'Scala 2' for=exceptions %}
~~~ scala
import java.util.concurrent.{ForkJoinPool, TimeoutException}
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

object Test extends App {
  def crashing(): Int  = throw new NoSuchMethodError("test")
  def failing(): Int   = throw new NumberFormatException("test")
  def interrupt(): Int = throw new InterruptedException("test")
  def erroring(): Int  = throw new AssertionError("test")

  // computations can fail in the middle of a chain of combinators, after the initial Future job has completed
  def testCrashes()(implicit ec: ExecutionContext): Future[Int] =
    Future.unit.map(_ => crashing())
  def testFails()(implicit ec: ExecutionContext): Future[Int] =
    Future.unit.map(_ => failing())
  def testInterrupted()(implicit ec: ExecutionContext): Future[Int] =
    Future.unit.map(_ => interrupt())
  def testError()(implicit ec: ExecutionContext): Future[Int] =
    Future.unit.map(_ => erroring())

  // Wait for 1 second for the the completion of the passed `future` value and print it
  def check(future: Future[Int]): Unit =
    try {
      Await.ready(future, 1.second)
      for (completion <- future.value) {
        println(s"completed $completion")
        // In case of failure, also print the cause of the exception, when defined
        completion match {
          case Failure(exception) if exception.getCause != null =>
            println(s"  caused by ${exception.getCause}")
          case _ => ()
        }
      }
    } catch {
      // If the future value did not complete within 1 second, the call
      // to `Await.ready` throws a TimeoutException
      case _: TimeoutException => println(s"did not complete")
    }

  def reporter(t: Throwable) = println(s"reported $t")

  locally {
    // using the `global` implicit context
    import ExecutionContext.Implicits._
    // a successful Future
    check(Future(42))        // completed Success(42)
    // a Future that completes with an application exception
    check(Future(failing())) // completed Failure(java.lang.NumberFormatException: test)
    // same, but the exception is thrown somewhere in the chain of combinators
    check(testFails())       // completed Failure(java.lang.NumberFormatException: test)
    // a Future that does not complete because of a linkage error;
    // the trace is printed to stderr by default
    check(testCrashes())     // did not complete
    // a Future that completes with an operational exception that is wrapped
    check(testInterrupted()) // completed Failure(java.util.concurrent.ExecutionException: Boxed Exception)
                             //   caused by java.lang.InterruptedException: test
    // a Future that completes due to a failed assert, which is bad for the app,
    // but is handled the same as interruption
    check(testError())       // completed Failure(java.util.concurrent.ExecutionException: Boxed Exception)
                             //   caused by java.lang.AssertionError: test
  }
  locally {
    // same as `global`, but adds a custom reporter that will handle uncaught
    // exceptions and errors reported to the context
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(null, reporter)
    check(testCrashes())     // reported java.lang.NoSuchMethodError: test
                             // did not complete
  }
  locally {
    // does not handle uncaught exceptions; the executor would have to be
    // configured separately
    val executor = ForkJoinPool.commonPool()
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(executor, reporter)
    // the reporter is not invoked and the Future does not complete
    check(testCrashes())     // did not complete
  }
  locally {
    // sample minimal configuration for a context and underlying pool that
    // use the reporter
    val handler: Thread.UncaughtExceptionHandler =
      (_: Thread, t: Throwable) => reporter(t)
    val executor = new ForkJoinPool(
      Runtime.getRuntime.availableProcessors,
      ForkJoinPool.defaultForkJoinWorkerThreadFactory, // threads use the pool's handler
      handler,
      /*asyncMode=*/ false
    )
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(executor, reporter)
    check(testCrashes())     // reported java.lang.NoSuchMethodError: test
                             // did not complete
  }
}
~~~
{% endtab %}

{% tab 'Scala 3' for=exceptions %}
~~~ scala
import java.util.concurrent.{ForkJoinPool, TimeoutException}
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

def crashing(): Int  = throw new NoSuchMethodError("test")
def failing(): Int   = throw new NumberFormatException("test")
def interrupt(): Int = throw new InterruptedException("test")
def erroring(): Int  = throw new AssertionError("test")

// computations can fail in the middle of a chain of combinators,
// after the initial Future job has completed
def testCrashes()(using ExecutionContext): Future[Int] =
  Future.unit.map(_ => crashing())
def testFails()(using ExecutionContext): Future[Int] =
  Future.unit.map(_ => failing())
def testInterrupted()(using ExecutionContext): Future[Int] =
  Future.unit.map(_ => interrupt())
def testError()(using ExecutionContext): Future[Int] =
  Future.unit.map(_ => erroring())

// Wait for 1 second for the the completion of the passed `future` value and print it
def check(future: Future[Int]): Unit =
  try
    Await.ready(future, 1.second)
    for completion <- future.value do
      println(s"completed $completion")
      // In case of failure, also print the cause of the exception, when defined
      completion match
        case Failure(exception) if exception.getCause != null =>
          println(s"  caused by ${exception.getCause}")
        case _ => ()
  catch
    // If the future value did not complete within 1 second, the call
    // to `Await.ready` throws a TimeoutException
    case _: TimeoutException => println(s"did not complete")

def reporter(t: Throwable) = println(s"reported $t")

@main def test(): Unit =
  locally:
    // using the `global` implicit context
    import ExecutionContext.Implicits.given
    // a successful Future
    check(Future(42))        // completed Success(42)
    // a Future that completes with an application exception
    check(Future(failing())) // completed Failure(java.lang.NumberFormatException: test)
    // same, but the exception is thrown somewhere in the chain of combinators
    check(testFails())       // completed Failure(java.lang.NumberFormatException: test)
    // a Future that does not complete because of a linkage error;
    // the trace is printed to stderr by default
    check(testCrashes())     // did not complete
    // a Future that completes with an operational exception that is wrapped
    check(testInterrupted()) // completed Failure(java.util.concurrent.ExecutionException: Boxed Exception)
                             //   caused by java.lang.InterruptedException: test
    // a Future that completes due to a failed assert, which is bad for the app,
    // but is handled the same as interruption
    check(testError())       // completed Failure(java.util.concurrent.ExecutionException: Boxed Exception)
                             //   caused by java.lang.AssertionError: test

  locally:
    // same as `global`, but adds a custom reporter that will handle uncaught
    // exceptions and errors reported to the context
    given ExecutionContext = ExecutionContext.fromExecutor(null, reporter)
    check(testCrashes())     // reported java.lang.NoSuchMethodError: test
                             // did not complete

  locally:
    // does not handle uncaught exceptions; the executor would have to be
    // configured separately
    val executor = ForkJoinPool.commonPool()
    given ExecutionContext = ExecutionContext.fromExecutor(executor, reporter)
    // the reporter is not invoked and the Future does not complete
    check(testCrashes())     // did not complete

  locally:
    // sample minimal configuration for a context and underlying pool that
    // use the reporter
    val handler: Thread.UncaughtExceptionHandler =
      (_: Thread, t: Throwable) => reporter(t)
    val executor = new ForkJoinPool(
      Runtime.getRuntime.availableProcessors,
      ForkJoinPool.defaultForkJoinWorkerThreadFactory, // threads use the pool's handler
      handler,
      /*asyncMode=*/ false
    )
    given ExecutionContext = ExecutionContext.fromExecutor(executor, reporter)
    check(testCrashes())     // reported java.lang.NoSuchMethodError: test
                             // did not complete
end test
~~~
{% endtab %}
{% endtabs %}

## Promises

So far we have only considered `Future` objects created by
asynchronous computations started using the `Future` method.
However, futures can also be created using *promises*.

While futures are defined as a type of read-only placeholder object
created for a result which doesn't yet exist, a promise can be thought
of as a writable, single-assignment container, which completes a
future. That is, a promise can be used to successfully complete a
future with a value (by "completing" the promise) using the `success`
method. Conversely, a promise can also be used to complete a future
with an exception, by failing the promise, using the `failure` method.

A promise `p` completes the future returned by `p.future`. This future
is specific to the promise `p`. Depending on the implementation, it
may be the case that `p.future eq p`.

Consider the following producer-consumer example, in which one computation
produces a value and hands it off to another computation which consumes
that value. This passing of the value is done using a promise.

{% tabs promises %}
{% tab 'Scala 2 and 3' for=promises %}
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
{% endtab %}
{% endtabs %}

Here, we create a promise and use its `future` method to obtain the
`Future` that it completes. Then, we begin two asynchronous
computations. The first does some computation, resulting in a value
`r`, which is then used to complete the future `f`, by fulfilling
the promise `p`. The second does some computation, and then reads the result `r`
of the completed future `f`. Note that the `consumer` can obtain the
result before the `producer` task is finished executing
the `continueDoingSomethingUnrelated()` method.

As mentioned before, promises have single-assignment semantics. As
such, they can be completed only once. Calling `success` on a
promise that has already been completed (or failed) will throw an
`IllegalStateException`.

The following example shows how to fail a promise.

{% tabs futures-15 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-15 %}
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
{% endtab %}
{% tab 'Scala 3' for=futures-15 %}
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
{% endtab %}
{% endtabs %}

Here, the `producer` computes an intermediate result `r`, and checks
whether it's valid. In the case that it's invalid, it fails the
promise by completing the promise `p` with an exception. In this case,
the associated future `f` is failed. Otherwise, the `producer`
continues its computation, and finally completes the future `f` with a
valid result, by completing promise `p`.

Promises can also be completed with a `complete` method which takes
a potential value `Try[T]` -- either a failed result of type `Failure[Throwable]` or a
successful result of type `Success[T]`.

Analogous to `success`, calling `failure` and `complete` on a promise that has already
been completed will throw an `IllegalStateException`.

One nice property of programs written using promises with operations
described so far and futures which are composed through monadic
operations without side-effects is that these programs are
deterministic. Deterministic here means that, given that no exception
is thrown in the program, the result of the program (values observed
in the futures) will always be the same, regardless of the execution
schedule of the parallel program.

In some cases the client may want to complete the promise only if it
has not been completed yet (e.g., there are several HTTP requests being
executed from several different futures and the client is interested only
in the first HTTP response - corresponding to the first future to
complete the promise). For these reasons methods `tryComplete`,
`trySuccess` and `tryFailure` exist on promise. The client should be
aware that using these methods results in programs which are not
deterministic, but depend on the execution schedule.

The method `completeWith` completes the promise with another
future. After the future is completed, the promise gets completed with
the result of that future as well. The following program prints `1`:

{% tabs promises-2 %}
{% tab 'Scala 2 and 3' for=promises-2 %}
    val f = Future { 1 }
    val p = Promise[Int]()

    p.completeWith(f)

    p.future.foreach { x =>
      println(x)
    }
{% endtab %}
{% endtabs %}

When failing a promise with an exception, three subtypes of `Throwable`s
are handled specially. If the `Throwable` used to break the promise is
a `scala.runtime.NonLocalReturnControl`, then the promise is completed with
the corresponding value. If the `Throwable` used to break the promise is
an instance of `Error`, `InterruptedException`, or
`scala.util.control.ControlThrowable`, the `Throwable` is wrapped as
the cause of a new `ExecutionException` which, in turn, is failing
the promise.

Using promises, the `onComplete` method of the futures and the `future` construct
you can implement any of the functional composition combinators described earlier.
Let's assume you want to implement a new combinator `first` which takes
two futures `f` and `g` and produces a third future which is completed by either
`f` or `g` (whichever comes first), but only given that it is successful.

Here is an example of how to do it:

{% tabs futures-16 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-16 %}
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
{% endtab %}
{% tab 'Scala 3' for=futures-16 %}
    def first[T](f: Future[T], g: Future[T]): Future[T] =
      val p = Promise[T]

      f.foreach { x =>
        p.trySuccess(x)
      }

      g.foreach { x =>
        p.trySuccess(x)
      }

      p.future
{% endtab %}
{% endtabs %}

Note that in this implementation, if neither `f` nor `g` succeeds, then `first(f, g)` never completes (either with a value or with an exception).

<!--
## Migration p

scala.actor.Futures?
for clients


## Implementing custom futures and promises p
for library writers
-->

## Utilities

To simplify handling of time in concurrent applications `scala.concurrent`
 introduces a `Duration` abstraction. `Duration` is not supposed to be yet another
 general time abstraction. It is meant to be used with concurrency libraries and
 resides in `scala.concurrent` package.

`Duration` is the base class representing a length of time. It can be either finite or infinite.
 A finite duration is represented with the `FiniteDuration` class, which is constructed from a `Long` length and
 a `java.util.concurrent.TimeUnit`. Infinite durations, also extended from `Duration`,
 exist in only two instances, `Duration.Inf` and `Duration.MinusInf`. The library also
 provides several `Duration` subclasses for implicit conversion purposes and those should
 not be used.

Abstract `Duration` contains methods that allow:

1. Conversion to different time units (`toNanos`, `toMicros`, `toMillis`,
`toSeconds`, `toMinutes`, `toHours`, `toDays` and `toUnit(unit: TimeUnit)`).
2. Comparison of durations (`<`, `<=`, `>` and `>=`).
3. Arithmetic operations (`+`, `-`, `*`, `/` and `unary_-`).
4. Minimum and maximum between `this` duration and the one supplied in the argument (`min`, `max`).
5. Checking whether the duration is finite (`isFinite`).

`Duration` can be instantiated in the following ways:

1. Implicitly from types `Int` and `Long`, for example, `val d = 100 millis`.
2. By passing a `Long` length and a `java.util.concurrent.TimeUnit`,
for example, `val d = Duration(100, MILLISECONDS)`.
3. By parsing a string that represent a time period, for example, `val d = Duration("1.2 µs")`.

Duration also provides `unapply` methods, so it can be used in pattern matching constructs.
Examples:

{% tabs futures-17 class=tabs-scala-version %}
{% tab 'Scala 2' for=futures-17 %}
    import scala.concurrent.duration._
    import java.util.concurrent.TimeUnit._

    // instantiation
    val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
    val d2 = Duration(100, "millis") // from Long and String
    val d3 = 100 millis // implicitly from Long, Int or Double
    val d4 = Duration("1.2 µs") // from String

    // pattern matching
    val Duration(length, unit) = 5 millis
{% endtab %}
{% tab 'Scala 3' for=futures-17 %}
    import scala.concurrent.duration.*
    import java.util.concurrent.TimeUnit.*

    // instantiation
    val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
    val d2 = Duration(100, "millis") // from Long and String
    val d3 = 100.millis // implicitly from Long, Int or Double
    val d4 = Duration("1.2 µs") // from String

    // pattern matching
    val Duration(length, unit) = 5.millis
{% endtab %}
{% endtabs %}
