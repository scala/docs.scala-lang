---
layout: multipage-overview
title: Scala Futures
description: This page provides an introduction to Futures in Scala, including Future callback methods.
partof: hello_scala
overview-name: Hello, Scala
num: 57
---



While an Akka actor runs for a long time and is intended to handle *many* messages over its lifetime, a Scala [Future](https://www.scala-lang.org/api/current/scala/concurrent/Future$.html) is intended as a one-shot, “handle this relatively slow and potentially long-running computation, and call me back with a result when you’re done” construct.

In this lesson I’ll show how to use futures, including how to run several futures in parallel and combine their results in a for-expression, along with a few other useful `Future` methods.

>Note: If you find the name `Future` to be confusing in the following examples, [I recommend replacing it with the name `ConcurrentTask`](https://alvinalexander.com/scala/scala-future-semantics), which I personally find easier to understand.



## Source code

You can find the source code for this lesson at this Github URL:

- [github.com/alvinj/HelloScalaFutures](https://github.com/alvinj/HelloScalaFutures)




## An example in the REPL

A Scala `Future` is used to create a little pocket of concurrency that you use for one-shot needs. You typically use it when you need to call an algorithm that runs an indeterminate amount of time — such as calling a web service or executing a long-running algorithm — so you therefore want to run it off of the main thread.

To demonstrate how this works, let’s start with an example of a `Future` in the Scala REPL. First, paste in these `import` statements:

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}
```

Now, you can create a future. For example, here’s a future that sleeps for a few seconds and then returns the value `42`:

```scala
scala> val a = Future { Thread.sleep(2000); 42 }
a: scala.concurrent.Future[Int] = Future(<not completed>)
```

While that’s a simple example, it shows the basic approach: Just construct a new `Future` with your long-running algorithm.

Because `Future` has a `map` function, you use it as usual:

```scala
scala> val b = a.map(_ * 2)
b: scala.concurrent.Future[Int] = Future(<not completed>)
```

This shows `Future(<not completed>)`, but if you check `b`’s value you’ll see that it contains the expected result of `84`:

```scala
scala> b
res1: scala.concurrent.Future[Int] = Future(Success(84))
```

Notice that the `84` you expected is wrapped in a `Success`, which is further wrapped in a `Future`. This is a key point to know: The value in a `Future` is always an instance of one of the `Try` types: `Success` or `Failure`. Therefore, when working with the result of a future, use the usual `Try`-handling techniques, or one of the other `Future` callback methods.

One commonly used callback method is `onComplete`, which takes a [partial function](https://alvinalexander.com/scala/how-to-define-use-partial-functions-in-scala-syntax-examples), in which you should handle the `Success` and `Failure` cases, like this:

```scala
a.onComplete {
    case Success(value) => println(s"Got the callback, value = $value")
    case Failure(e) => e.printStackTrace
}
```

When you paste that code in the REPL you’ll see the result:

```scala
Got the callback, value = 42
```

There are other ways to process the results from futures, and I’ll list the most common methods later in this lesson.



## An example application

I like to use the following application to introduce futures because it’s relatively simple, and it shows several key points about how to work with futures:

- How to create futures
- How to combine multiple futures in a `for` expression to obtain a single result
- How to work with that result once you have it


### A potentially slow-running method

First, imagine you have a method that accesses a web service to get the current price of a stock. Because it’s a web service it can be slow to return, and even fail. As a result, you create a method to run as a `Future`. It takes a stock symbol as an input parameter and returns the stock price as a `Double` inside a `Future`, so its signature looks like this:

```scala
def getStockPrice(stockSymbol: String): Future[Double] = ???
```

I don’t want to write a method that accesses a web service for this tutorial, so I’ll mock up a method that has a variable run time like this:

```scala
def getStockPrice(stockSymbol: String): Future[Double] = Future {
    val r = scala.util.Random
    val randomSleepTime = r.nextInt(3000)
    val randomPrice = r.nextDouble * 1000
    sleep(randomSleepTime)
    randomPrice
}
```

That method sleeps a random time up to 3000 ms, and also returns a random stock price. Notice how simple it is to create a method that runs as a `Future`; I just pass a block of code into the `Future` constructor to create the method body.

Next, imagine that you’re instructed to get three stock prices in parallel, and return their results once all three return. To do so, you’d write code like this:

```scala
package futures

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

object MultipleFutures extends App {

    val startTime = currentTime

    // (a) create three futures
    val aaplFuture = getStockPrice("AAPL")
    val amznFuture = getStockPrice("AMZN")
    val googFuture = getStockPrice("GOOG")

    // (b) get a combined result in a for-expression
    val result: Future[(Double, Double, Double)] = for {
        aapl <- aaplFuture
        amzn <- amznFuture
        goog <- googFuture
    } yield (aapl, amzn, goog)

    // (c) do whatever you need to do with the results
    result.onComplete {
        case Success(x) => {
            val totalTime = deltaTime(startTime)
            println(s"In Success case, time delta: ${totalTime}")
            println(s"The stock prices are: $x")
        }
        case Failure(e) => e.printStackTrace
    }

    // important for a little parallel demo: need to keep
    // the jvm’s main thread alive
    sleep(5000)

    def sleep(time: Long): Unit = Thread.sleep(time)

    // a simulated web service
    def getStockPrice(stockSymbol: String): Future[Double] = Future {
        val r = scala.util.Random
        val randomSleepTime = r.nextInt(3000)
        println(s"For $stockSymbol, sleep time is $randomSleepTime")
        val randomPrice = r.nextDouble * 1000
        sleep(randomSleepTime)
        randomPrice
    }

    def currentTime = System.currentTimeMillis()
    def deltaTime(t0: Long) = currentTime - t0

}
```

I encourage you to clone my Github project and put that code in your favorite IDE before continuing this lesson. When you do so, first run it to make sure it works as expected, then change it as desired. I recommend adding debug `println` statements to the code so you can completely understand it.

>The Github repository for this lesson also contains a class named `MultipleFuturesWithDebugOutput` that contains the same code with a lot of debug `println` statements.



### Creating the futures

Let’s walk through that code to see how it works. First, I create three futures with these lines of code:

```scala
val aaplFuture = getStockPrice("AAPL")
val amznFuture = getStockPrice("AMZN")
val googFuture = getStockPrice("GOOG")
```

As you saw, `getStockPrice` is defined like this:

```scala
def getStockPrice(stockSymbol: String): Future[Double] = Future { ...
```

If you remember the lesson on companion objects, the way the body of that method works is that the code in between the curly braces is passed into the `apply` method of `Future`’s companion object, so the compiler translates that code to something like this:

```scala
def getStockPrice ... = Future.apply { method body here }
                               -----
```

An important thing to know about `Future` is that it *immediately* begins running the block of code inside the curly braces. It isn’t like the Java `Thread`, where you create an instance and later call its `start` method. You can see this very clearly in the debug output of the `MultipleFuturesWithDebugOutput` example, where the debug output in `getStockPrice` prints three times when the AAPL, AMZN, and GOOG futures are created, almost immediately after the application is started.

The three method calls eventually return the simulated stock prices. In fact, people often use the word *eventually* with futures because you typically use them when the return time of the algorithm is indeterminate: you don’t know when you’ll get a result back, you just hope to get a successful result back “eventually.”


### The `for` expression

The `for` expression in the application looks like this:

```scala
val result: Future[(Double, Double, Double)] = for {
    aapl <- aaplFuture
    amzn <- amznFuture
    goog <- googFuture
} yield (aapl, amzn, goog)
```

You can read this as, “Whenever `aapl`, `amzn`, and `goog` all return with their values, combine them in a tuple, and assign that value to the variable `result`.” As shown, `result` has the type `Future[(Double, Double, Double)]`, which is a tuple that contains three `Double` values, wrapped in a `Future` container.

It’s important to know that the application’s main thread doesn’t stop when `getStockPrice` is called, and it doesn’t stop at the for-expression either. In fact, if you print the result from `System.currentTimeMillis()` before and after the `for` expression, you probably won’t see a difference of more than a few milliseconds. You can see that for yourself in the `MultipleFuturesWithDebugOutput` example.



## onComplete

The final part of the application looks like this:

```scala
result.onComplete {
    case Success(x) => {
        val totalTime = deltaTime(startTime)
        println(s"In Success case, time delta: ${totalTime}")
        println(s"The stock prices are: $x")
    }
    case Failure(e) => e.printStackTrace
}
```

As I showed before, `onComplete` is a method that’s available on a `Future`, and you use it to process the future’s result as a side effect. In the same way that the `foreach` method on collections classes returns `Unit` and is only used for side effects, `onComplete` returns `Unit` and you only use it for side effects like printing the results, updating a GUI, updating a database, etc.

You can read that code as, “Whenever `result` has a final value — i.e., after all of the futures return in the `for` expression — come here. If everything returned successfully, run the `println` statement shown in the `Success` case. Otherwise, if an exception was thrown, go to the `Failure` case and print the exception’s stack trace.”

As that code implies, it’s completely possible that a `Future` may fail. For example, imagine that you call a web service, but the web service is down. That `Future` instance will contain an exception, so when you call `result.onComplete` like this, control will flow to the `Failure` case.

It’s important to note that just as the JVM’s main thread didn’t stop at the for-expression, it doesn’t block here, either. The code inside `onComplete` doesn’t execute until after the for-expression assigns a value to `result`.


### That `sleep` call

A final point to note about small examples like this is that you need to have a `sleep` call at the end of your `App`:

    sleep(5000)

That call keeps the main thread of the JVM alive for five seconds. If you don’t include a call like this, the JVM’s main thread will exit before you get a result from the three futures, which are running on other threads. This isn’t usually a problem in the real world, but it’s a problem for little demos like this.


### The other code

There are a few `println` statements in the code that use these methods:

```scala
def currentTime = System.currentTimeMillis()
def deltaTime(t0: Long) = System.currentTimeMillis() - t0
```

I only added a few `println` statements in this code so you can get an idea of how the application works. However, as you’ll see in the repository, I added many more `println` statements to the `MultipleFuturesWithDebugOutput` example so you can see exactly how futures work.



## Other Future methods

Futures have other methods that you can use. Common callback methods are:

- `onComplete`
- `onSuccess`
- `onFailure`

In addition to those methods, futures have methods that you’ll find on Scala collections classes, including:

- `filter`
- `foreach`
- `map`

Other useful and well-named methods include:

- `andThen`
- `fallbackTo`
- `recoverWith`

I discuss these methods in my article, [Simple concurrency with Scala Futures](https://alvinalexander.com/scala/concurrency-with-scala-futures-tutorials-examples#the-onsuccess-and-onfailure-callback-methods).



## Key points

While this was a short introduction, I hope those examples give you an idea of how Scala futures work. A few key points about futures are:

- You construct futures to run tasks off of the main thread
- A benefit of futures over threads is that they come with a variety of callback methods that simplify the process of working with concurrent threads,
  including the handling of exceptions and thread management
- A future starts running as soon as you construct it
- If you’re using multiple futures to yield a single result, you’ll often want to combine them in a for-expression
- Use `onComplete` and other callback methods to process the final result(s)
- The value in a `Future` is always an instance of one of the `Try` types: `Success` or `Failure



## See also

- My article, [Simple concurrency with Scala Futures](https://alvinalexander.com/scala/concurrency-with-scala-futures-tutorials-examples#the-onsuccess-and-onfailure-callback-methods), provides a little more discussion about future callback methods.
- I wrote a little demo GUI application named Future Board that works a little like [Flipboard](https://flipboard.com/). You can find an image of the application [at this URL](https://alvinalexander.com/photos/future-board-flipboard-scala-futures), and you can find the source code for Future Board in [this Github repository](https://github.com/alvinj/FPFutures).
- The [“Futures and Promises”](http://docs.scala-lang.org/overviews/core/futures.html) on scala-lang.org is a good resource

These are some of the best books I know about programming with Akka, futures, and JVM concurrency in general:

- *Learning Concurrent Programming in Scala*
- *Akka Concurrency*
- *Java Concurrency in Practice*







