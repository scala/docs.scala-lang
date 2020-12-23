---
title: Concurrency
type: chapter
description: This page discusses how Scala concurrency works, with an emphasis on Scala Futures.
num: 68
previous-page: ca-summary
next-page: scala-tools
---


When you want to write parallel and concurrent applications in Scala, you _can_ use the native Java `Thread`---but the Scala [Future](https://www.scala-lang.org/api/current/scala/concurrent/Future$.html) offers a more high level and idiomatic approach so it’s preferred, and covered in this chapter.



## Introduction

Here’s a description of the Scala `Future` from its Scaladoc:

> “A `Future` represents a value which may or may not _currently_ be available, but will be available at some point, or an exception if that value could not be made available.”

To demonstrate what that means, let’s first look at single-threaded programming.
In the single-threaded world you bind the result of a method call to a variable like this:

```scala
def aShortRunningTask(): Int = 42
val x = aShortRunningTask()
```

In this code, the value `42` is immediately bound to `x`.

When you’re working with a `Future`, the assignment process looks similar:

```scala
def aLongRunningTask(): Future[Int] = ???
val x = aLongRunningTask()
```

But the main difference in this case is that because `aLongRunningTask` takes an indeterminate amount of time to return, the value in `x` may or may not be _currently_ available, but it will be available at some point---in the future.

Another way to look at this is in terms of blocking.
In this single-threaded example, the `println` statement isn’t printed until `aShortRunningTask` completes:

```scala
def aShortRunningTask(): Int =
  Thread.sleep(500)
  42
val x = aShortRunningTask()
println("Here")
```

Conversely, if `aShortRunningTask` is created as a `Future`, the `println` statement is printed almost immediately because `aShortRunningTask` is spawned off on some other thread---it doesn’t block.

In this chapter you’ll see how to use futures, including how to run multiple futures in parallel and combine their results in a `for` expression.
You’ll also see examples of methods that are used to handle the value in a future once it returns.

> When you think about futures, it’s important to know that they’re intended as a one-shot, “Handle this relatively slow computation on some other thread, and call me back with a result when you’re done” construct.
> As a point of contrast, [Akka](https://akka.io) actors are intended to run for a long time and respond to many requests during their lifetime.
> While an actor may live forever, a future is intended to be run only once.



## An example in the REPL

A future is used to create a temporary pocket of concurrency.
For instance, you use a future when you need to call an algorithm that runs an indeterminate amount of time---such as calling a remote microservice---so you want to run it off of the main thread.

To demonstrate how this works, let’s start with a `Future` example in the REPL.
First, paste in these required `import` statements:

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}
```

Now you’re ready to create a future.
For this example, first define a long-running, single-threaded algorithm:

```scala
def longRunningAlgorithm =
  Thread.sleep(10_000)
  42
```

That fancy algorithm returns the integer value `42` after a ten second delay.
Now call that algorithm by wrapping it into the `Future` constructor, and assigning the result to a variable:

```scala
scala> val f = Future(longRunningAlgorithm)
f: scala.concurrent.Future[Int] = Future(<not completed>)
```

Right away your future begins running.
If you immediately check the value of the variable `f`, you see that the future hasn’t completed yet:

```scala
scala> f
val res1: scala.concurrent.Future[Int] = Future(<not completed>)
```

But if you check again after ten seconds, you’ll see that it completes successfully:

```scala
scala> f
val res2: scala.concurrent.Future[Int] = Future(Success(42))
```

While that’s a relatively simple example, it shows the basic approach: Just construct a new `Future` with your long-running algorithm.

One thing to notice is that the `42` you expected is wrapped in a `Success`, which is further wrapped in a `Future`.
This is a key concept to understand: the value in a `Future` is always an instance of one of the *scala.util.Try* types: `Success` or `Failure`.
Therefore, when you work with the result of a future, you use the usual `Try`-handling techniques.


### Using `map` with futures

`Future` has a `map` method, which you use just like the `map` method on collections.
This is what the result looks like when you call `map` right after creating the variable `f`:

```scala
scala> val a = f.map(_ * 2)
a: scala.concurrent.Future[Int] = Future(<not completed>)
```

As shown, for the future that was created with the `longRunningAlgorithm`, the initial output shows `Future(<not completed>)`.
But when you check `a`’s value after ten seconds you’ll see that it contains the expected result of `84`:

```scala
scala> a
res1: scala.concurrent.Future[Int] = Future(Success(84))
```

Once again, the successful result is wrapped inside a `Success` and a `Future`.


### Using callback methods with futures

In addition to higher-order functions like `map`, you can also use callback methods with futures.
One commonly used callback method is `onComplete`, which takes a *partial function* in which you handle the `Success` and `Failure` cases:

```scala
f.onComplete {
  case Success(value) => println(s"Got the callback, value = $value")
  case Failure(e) => e.printStackTrace
}
```

When you paste that code in the REPL you’ll see the result:

```scala
Got the callback, value = 42
```



## Other Future methods

The `Future` class has other methods you can use.
It has some of the methods that you find on Scala collections classes, including:

- `filter`
- `flatMap`
- `map`

Its callback methods are:

- `onComplete`
- `andThen`
- `foreach`

Other transformation methods include:

- `fallbackTo`
- `recover`
- `recoverWith`

See the [Futures and Promises][futures] page for a discussion of additional methods available to futures.



## Running multiple futures and joining their results

To run multiple futures in parallel and join their results when all of the futures complete, use a `for` expression.
The correct approach is:

1. Create the futures
2. Merge their results in a `for` expression
3. Extract the merged result using `onComplete` or a similar technique


### An example

The three steps of the correct approach are shown in the following example.
A key is that you first create the futures and then join them in the `for` expression:

```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

val startTime = System.currentTimeMillis
def delta() = System.currentTimeMillis - startTime
def sleep(millis: Long) = Thread.sleep(millis)

@main def multipleFutures1 =

  println(s"creating the futures:   ${delta()}")

  // (1) create the futures
  val f1 = Future { sleep(800); 1 }   // eventually returns 1
  val f2 = Future { sleep(200); 2 }   // eventually returns 2
  val f3 = Future { sleep(400); 3 }   // eventually returns 3

  // (2) run them simultaneously in a `for` expression
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

When you run that application, you see output that looks like this:

````
creating the futures:   1
before the 'sleep(3000)': 2
in the 'yield': 806
in the Success case: 806
result = 6
````

As that output shows, the futures are created very rapidly, and in just two milliseconds the print statement right before the `sleep(3000)` statement at the end of the method is reached.
All of that code is run on the JVM’s main thread.
Then, at 806 ms, the three futures complete and the code in the `yield` block is run.
Then the code immediately goes to the `Success` case in the `onComplete` method.

The 806 ms output is a key to seeing that the three futures are run in parallel.
If they were run sequentially, the total time would be about 1,400 ms---the sum of the sleep times of the three futures.
But because they’re run in parallel, the total time is just slightly longer than the longest-running future: `f1`, which is 800 ms.


### A method that returns a future

So far you’ve seen how to pass a single-threaded algorithm into a `Future` constructor.
You can use the same technique to create a method that returns a `Future`:

```scala
// simulate a slow-running method
def slowlyDouble(x: Int, delay: Long): Future[Int] = Future {
  sleep(delay)
  x * 2
}
```

As with the previous examples, just assign the result of the method call to a new variable.
Then when you check the result right away you’ll see that it’s not completed, but after the delay time the future will have a result:

````
scala> val f = slowlyDouble(2, 5_000L)
val f: concurrent.Future[Int] = Future(<not completed>)

scala> f
val res0: concurrent.Future[Int] = Future(<not completed>)

scala> f
val res1: concurrent.Future[Int] = Future(Success(4))
````



## Key points about futures

Hopefully those examples give you an idea of how Scala futures work.
To summarize, a few key points about futures are:

- You construct futures to run tasks off of the main thread
- Futures are intended for one-shot, potentially long-running concurrent tasks that *eventually* return a value; they create a temporary pocket of concurrency
- A future starts running as soon as you construct it
- A benefit of futures over threads is that they work with `for` expressions, and come with a variety of callback methods that simplify the process of working with concurrent threads
- When you work with futures you don’t have to concern yourself with the low-level details of thread management
- You handle the result of a future with callback methods like `onComplete` and `andThen`, or transformation methods like `filter`, `map`, etc.
- The value inside a `Future` is always an instance of one of the `Try` types: `Success` or `Failure`
- If you’re using multiple futures to yield a single result, combine them in a `for` expression

Also, as you saw with the `import` statements in these examples, the Scala `Future` depends on an `ExecutionContext`.

For more details about futures, see [Futures and Promises][futures], an article that discusses futures, promises, and execution contexts.
It also provides a discussion of how a `for` expression is translated into a `flatMap` operation.



[futures]: {% link _overviews/core/futures.md %}
