---
layout: sip
title: SIP-14 - Futures and Promises
vote-status: complete
vote-text: This SIP has already been accepted and completed.
permalink: /sips/:title.html
redirect_from: /sips/pending/futures-promises.html
---

**By: Philipp Haller, Aleksandar Prokopec, Heather Miller, Viktor Klang, Roland Kuhn, and Vojin Jovanovic**

This SIP is part of two SIPs, which together constitute a redesign of `scala.concurrent` into a unified substrate for a variety of parallel frameworks.
This proposal focuses on futures and promises.

## Introduction

Futures provide a nice way to reason about performing many operations
in parallel-- in an efficient and non-blocking way. The idea
is simple, a `Future` is a sort of placeholder object that you can
create for a result that doesn't yet exist. Generally, the result of
the `Future` is computed concurrently and can be later collected. Composing concurrent tasks in this way tends to result in faster, asynchronous, non-blocking parallel code.

This is particularly evident due to the fact that within the Scala ecosystem alone, several frameworks aiming to provide a full-featured implementation of futures and promises have arisen, including the futures available in the Scala Actors package \[[4][4]\], Akka \[[3][3]\], Finagle \[[2][2]\], and Scalaz \[[5][5]\].

The redesign of `scala.concurrent` provides a new Futures and Promises
API, meant to act as a common foundation for multiple parallel
frameworks and libraries to utilize both within Scala's standard
library, and externally.

By default, futures and promises are non-blocking, making use of
callbacks instead of typical blocking operations. In an effort to
facilitate, and make use of callbacks on a higher-level, we provide
combinators such as `flatMap`, `foreach`, and `filter` for composing
futures in a non-blocking way. For cases where blocking is absolutely
necessary, futures can be blocked on (although it is discouraged).

The futures and promises API builds upon the notion of an
`ExecutionContext`, an execution environment designed to manage
resources such as thread pools between parallel frameworks and
libraries (detailed in an accompanying SIP, forthcoming). Futures and
promises are created through such `ExecutionContext`s. For example, this makes it possible, in the case of an application which requires blocking futures, for an underlying execution environment to resize itself if necessary to guarantee progress.

## Futures

A future is an abstraction which represents a value which may become
available at some point. A `Future` object either holds a result of a
computation or an exception in the case that the computation failed.
An important property of a future is that it is in effect immutable--
it can never be written to or failed by the holder of the `Future` object.

The simplest way to create a future object is to invoke the `future`
method which starts an asynchronous computation and returns a
future holding the result of that computation.
The result becomes available once the future completes.

Here is an example. Let's assume that we want to use the API of some
popular social network to obtain a list of friends for a given user.
After opening a new session we want to create an asynchronous request to the
server for this list:

    import scala.concurrent.Future

    val session = socialNetwork.createSessionFor("user", credentials)
    val f: Future[List[Friend]] = Future {
      session.getFriends
    }

The list of friends becomes available in the future `f` once the server
responds.

An unsuccessful attempt may result in an exception. In
the following example, the `session` value is incorrectly
initialized, so the future will hold a `NullPointerException` instead of the value:

    val session = null
    val f: Future[List[Friend]] = Future {
      session.getFriends
    }

### Callbacks

We are generally interested in the result value of the computation. To
obtain the future's result, a client of the future would have to block
until the future is completed. Although this is allowed by the `Future`
API as we will show later in this document, a better way to do it is in a
completely non-blocking way, by registering a callback on the future. This
callback is called asynchronously once the future is completed. If the
future has already been completed when registering the callback, then
the callback may either be executed asynchronously, or sequentially on
the same thread.

The most general form of registering a callback is by using the `onComplete`
method, which takes a callback function of type `Either[Throwable, T] => U`.
The callback is applied to the value
of type `Right[T]` if the future completes successfully, or to a value
of type `Left[Throwable]` otherwise. The `onComplete` method is
parametric in the return type of the callback, but it discards the
result of the callback.

Coming back to our social network example, let's assume we want to
fetch a list of our own recent posts and render them to the screen.
We do so by calling the method `getRecentPosts` which returns a `List[String]`:

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onComplete {
      case Right(posts) => for (post <- posts) render(post)
      case Left(t)  => render("An error has occurred: " + t.getMessage)
    }

The `onComplete` method is general in the sense that it allows the
client to handle the result of both failed and successful future
computations. To handle only successful results, the `onSuccess`
callback is used (which takes a partial function):

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onSuccess {
      case posts => for (post <- posts) render(post)
    }

To handle failed results, the `onFailure` callback is used:

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onFailure {
      case t => render("An error has occured: " + t.getMessage)
    }
    f onSuccess {
      case posts => for (post <- posts) render(post)
    }

The `onFailure` callback is only executed if the future fails, that
is, if it contains an exception. The `onComplete`, `onSuccess`, and
`onFailure` methods have result type `Unit`, which means invocations
of these methods cannot be chained. This is an intentional design
decision which was made to avoid suggesting that chained
invocations may imply an ordering on the execution of the registered
callbacks (callbacks registered on the same future are unordered).

Since partial functions have the `isDefinedAt` method, the
`onFailure` method only triggers the callback if it is defined for a
particular `Throwable`. In the following example the registered callback is never triggered:

    val f = Future {
      2 / 0
    }

    f onFailure {
      case npe: NullPointerException =>
        println("I'd be amazed if this printed out.")
    }

Having a regular function callback as an argument to `onFailure` would
require including the default case in every failure callback, which is
cumbersome-- omitting the default case would lead to `MatchError`s later.

Second, `try-catch` blocks also expect a `PartialFunction`
value. That means that if there are generic partial function exception
handlers present in the application then they will be compatible with the `onFailure` method.

In conclusion, the semantics of callbacks are as follows:

1. Registering an `onComplete` callback on the future
ensures that the corresponding closure is invoked after
the future is completed, eventually.

2. Registering an `onSuccess` or `onFailure` callback has the same
semantics as `onComplete`, with the difference that the closure is only called
if the future is completed successfully or fails, respectively.

3. Registering a callback on the future which is already completed
will result in the callback being executed eventually (as implied by
1). Furthermore, the callback may even be executed synchronously on
the same thread that registered the callback if this does not cancel
progress of that thread.

4. In the event that multiple callbacks are registered on the future,
the order in which they are executed is not defined. In fact, the
callbacks may be executed concurrently with one another.
However, a particular `Future` implementation may have a well-defined
order.

5. In the event that some of the callbacks throw an exception, the
other callbacks are executed regardlessly.

6. In the event that some of the callbacks never complete (e.g. the
callback contains an infinite loop), the other callbacks may not be
executed at all. In these cases, a potentially blocking callback must
use the `blocking` construct (see below).

7. Once executed, the callbacks are removed from the future object,
thus being eligible for GC.


<!--
The `onTimeout` method registers callbacks triggered when the future fails with a `FutureTimeoutException`. This case can also be handled by the `onFailure` method if the partial function is defined for that exception type.
-->

<!--
Note that all three latter on-callback methods can be expressed in terms of the `onComplete` method. As such they are by default implemented in the `scala.concurrent.Future` trait. Future implementations extending this trait must implement the `onComplete` method, but may choose to also override the other on-callback methods for performance reasons.
-->

### Functional Composition and For-Comprehensions

The examples we have shown so far lend themselves naturally
to the functional composition of futures. Assume we have an API for
interfacing with a currency trading service. Suppose we want to buy US
dollars, but only when it's profitable. We first show how this could
be done using callbacks:

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

We start by creating a future which fetches the current exchange
rate. After it's successfully obtained from the server, we create
another future which makes a decision to buy only if it's profitable
to do so, and then sends a requests.

This works, but is inconvenient for two reasons. First, we have to use
`onSuccess`, and we have to nest the second `purchase` future within
it.  Second, the `purchase` future is not in the scope of the rest of
the code.

For these two reasons, futures provide combinators which allow a
more straightforward composition. One of the basic combinators
is `map`, which, given a future and a mapping function for the value of
the future, produces a new future that is completed with the
mapped value once the original future is successfully completed. Let's
rewrite the previous example using the `map` combinator:

    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    val purchase = rateQuote map {
      quote => if (isProfitable(quote)) connection.buy(amount, quote)
               else throw new Exception("not profitable")
    }

    purchase onSuccess {
      case _ => println("Purchased " + amount + " USD")
    }

The semantics of `map` is as follows. If the original future is
completed successfully then the returned future is completed with a
mapped value from the original future. If the mapping function throws
an exception the future is completed with that exception. If the
original future fails with an exception then the returned future also
contains the same exception. This exception propagating semantics is
present in the rest of the combinators, as well.

To enable for-comprehensions, futures also have the `flatMap`, `filter` and
`foreach` combinators. The `flatMap` method takes a function that maps the value
to a new future `g`, and then returns a future which is completed once
`g` is completed.

Lets assume that we want to exchange US dollars for Swiss francs
(CHF). We have to fetch quotes for both currencies, and then decide on
buying based on both quotes.
Here is an example of `flatMap` usage within for-comprehensions:

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

The `filter` combinator creates a new future which contains the value
of the original future only if it satisfies some predicate. Otherwise,
the new future is failed with a `NoSuchElementException`.

It is important to note that calling the `foreach` combinator does not
block. Instead, the function for the `foreach` gets asynchronously
executed only if the future is completed successfully. This means that
the `foreach` has exactly the same semantics as the `onSuccess`
callback.

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

    val purchase: Future[Int] = rateQuote map {
      quote => connection.buy(amount, quote)
    } recover {
      case quoteExc: QuoteChangedException => 0
    }

The `recover` combinator creates a new future which holds the same
result as the original future if it completed successfully. If it did
not then the partial function argument is applied to the `Throwable`
which failed the original future. If it maps the `Throwable` to some
value, then the new future is successfully completed with that value.

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

	val anyQuote = usdQuote fallbackTo chfQuote

	anyQuote onSuccess { println(_) }

The `either` combinator creates a new future which either holds
the result of this future or the argument future, whichever completes
first, irregardless of success or failure. Here is an example in which
the quote which is returned first gets printed:

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

	val anyQuote = usdQuote either chfQuote

	anyQuote onSuccess { println(_) }

The `andThen` combinator is used purely for side-effecting purposes.
It returns a new future with exactly the same result as the current
future, irregardless of whether the current future failed or not.
Once the current future is completed with the result, the closure
corresponding to the `andThen` is invoked and then the new future is
completed with the same result as this future. This ensures that
multiple `andThen` calls are ordered, as in the following example
which stores the recent posts from a social network to a mutable set
and then renders all the posts to the screen:

	val allPosts = mutable.Set[String]()

	Future {
	  session.getRecentPosts
	} andThen {
	  case Success(posts) => allPosts ++= posts
	} andThen {
	  case _ =>
	  clearAll()
	  for (post <- allPosts) render(post)
	}

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

    val f = Future {
      2 / 0
    }
    for (exc <- f.failed) println(exc)

The following example does not print anything to the screen:

    val f = Future {
      4 / 2
    }
    for (exc <- f.failed) println(exc)

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
Invoking the `future` construct uses an implicit execution context to start an asynchronous computation. In the case the client desires to use a custom execution context to start an asynchronous computation:

    val f = Future {
      4 / 2
    }(customExecutionContext)
-->

### Extending Futures

Support for extending the Futures API with additional utility methods is planned. This will allow external frameworks to provide more specialized utilities.

## Blocking

As mentioned earlier, blocking on a future is strongly discouraged --
for the sake of performance and for the prevention of deadlocks --
in favour of using callbacks and combinators on futures. However,
blocking may be necessary in certain situations and is supported by
the Futures API.

In the currency trading example above, one place to block is at the
end of the application to make sure that all of the futures have been completed.
Here is an example of how to block on the result of a future:

    import scala.concurrent._

    def main(args: Array[String]) {
      val rateQuote = Future {
        connection.getCurrentValue(USD)
      }

      val purchase = rateQuote map {
        quote => if (isProfitable(quote)) connection.buy(amount, quote)
                 else throw new Exception("not profitable")
      }

      blocking(purchase, 0 ns)
    }

In the case that the future fails, the caller is forwarded the
exception that the future is failed with. This includes the `failed`
projection-- blocking on it results in a `NoSuchElementException`
being thrown if the original future is completed successfully.

The `Future` trait implements the `Awaitable` trait with a single
method `await()`. The `await()` method contains code which can
potentially result in a long running computation, block on some
external condition or which may not complete the computation at all. The
`await()` method cannot be called directly by the clients, it can
only be called by the execution context implementation itself. To block
on the future to obtain its result, the `blocking` method must be used.

    val f = Future { 1 }
    val one: Int = blocking(f, 0 ns)

To allow clients to call 3rd party code which is potentially blocking
and avoid implementing the `Awaitable` trait, the same
`blocking` primitive can also be used in the following form:

    blocking {
      potentiallyBlockingCall()
    }

The blocking code may also throw an exception. In this case, the
exception is forwarded to the caller.



## Exceptions

When asynchronous computations throw unhandled exceptions, futures
associated with those computations fail. Failed futures store an
instance of `Throwable` instead of the result value. `Future`s provide
the `onFailure` callback method, which accepts a `PartialFunction` to
be applied to a `Throwable`. The following special exceptions are
treated differently:

1. `TimeoutException` - stored when the computation is not
completed before some timeout (typically managed by an external
scheduler).

<!--
This exception has a reference to the original future
which was timed out (if any).
-->

2. `scala.runtime.NonLocalReturnControl[_]` - this exception holds a value
associated with the return. Typically, `return` constructs in method
bodies are translated to `throw`s with this exception. Instead of
keeping this exception, the associated value is stored into the future or a promise.

3. `ExecutionException` - stored when the computation fails due to an
unhandled `InterruptedException`, `Error` or a
`scala.util.control.ControlThrowable`. In this case the
`ExecutionException` has the unhandled exception as its cause.  These
exceptions are rethrown in the thread executing the failed
asynchronous computation. The rationale behind this is to prevent
propagation of critical and control-flow related exceptions normally
not handled by the client code and at the same time inform the client
in which future the computation failed.



## Promises

While futures are defined as a type of read-only placeholder object
created for a result which doesn't yet exist, a promise can be thought
of as a writeable, single-assignment container, which completes a
future. That is, a promise can be used to successfully complete a
future with a value (by "completing" the promise) using the `success`
method. Conversely, a promise can also be used to complete a future
with an exception, by failing the promise, using the `failure` method.

A promise `p` completes the future returned by `p.future`. This future
is specific to the promise `p`. Depending on the implementation, it
may be the case that `p.future == p`.

Consider the following producer-consumer example:

    import scala.concurrent.{ Future, Promise }

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

Here, we create a promise and use its `future` method to obtain the
`Future` that it completes. Then, we begin two asynchronous
computations. The first does some computation, resulting in a value
`r`, which is then used to complete the future `f`, by fulfilling
`p`. The second does some computation, and then reads the result `r`
of the completed future `f`. Note that the `consumer` can obtain the
result before the `producer` task is finished executing
the `continueDoingSomethingUnrelated()` method.

As mentioned before, promises have single-assignment semantics. As
such, they can be completed only once. Calling `success` on a
promise that has already been completed (or failed) will throw an
`IllegalStateException`.

The following example shows how to fail a promise.

    val p = Promise[T]()
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

Here, the `producer` computes an intermediate result `r`, and checks
whether it's valid. In the case that it's invalid, it fails the
promise by completing the promise `p` with an exception. In this case,
the associated future `f` is failed. Otherwise, the `producer`
continues its computation, and finally completes the future `f` with a
valid result, by completing promise `p`.

Promises can also be completed with a `complete` method which takes
either a failed result of type `Left[Throwable]` or a
successful result of type `Right[T]`.

Analogous to `success`, calling `failure` and `complete` on a promise that has already
been completed will throw an `IllegalStateException`.

One nice property of programs written using promises with operations
described so far and futures which are composed through monadic
operations without side-effects is that these programs are
deterministic. Deterministic here means that, given that no exception
is thrown in the program, the result of the program (values observed
in the futures) will always be the same, irregardless of the execution
schedule of the parallel program.

In some cases the client may want to complete the promise only if it
has not been completed yet (e.g., there are several HTTP requests being
executed from several different futures and the client is interested only
in the first HTTP response - corresponding to the first future to
complete the promise). For these reasons methods `tryComplete`,
`trySuccess` and `tryFailure` exist on future. The client should be
aware that using these methods results in programs which are not
deterministic, but depend on the execution schedule.

The method `completeWith` completes the promise with another
future. After the future is completed, the promise gets completed with
the result of that future as well. The following program prints `1`:

    val f = Future { 1 }
    val p = Promise[Int]()

    p completeWith f

    p.future onSuccess {
      case x => println(x)
    }

When failing a promise with an exception, three subtypes of `Throwable`s
are handled specially. If the `Throwable` used to break the promise is
a `scala.runtime.NonLocalReturnControl`, then the promise is completed with
the corresponding value. If the `Throwable` used to break the promise is
an instance of `Error`, `InterruptedException`, or
`scala.util.control.ControlThrowable`, the `Throwable` is wrapped as
the cause of a new `ExecutionException` which, in turn, is failing
the promise.


<!--
## Migration p

scala.actor.Futures?
for clients


## Implementing custom futures and promises p
for library writers
-->

## Utilities

To simplify handling of time in concurrent applications `scala.concurrent`
 will introduce a `Duration` abstraction. Duration is not supposed be yet another
 general time abstraction. It is meant to be used with concurrency libraries and
 will reside in `scala.concurrent.util` package.

`Duration` is the base class representing length of time. It can be either finite or infinite.
 Finite duration is represented with `FiniteDuration` class which is constructed from `Long` length and
 `java.util.concurrent.TimeUnit`. Infinite durations, also extended from `Duration`,
 exist in only two instances , `Duration.Inf` and `Duration.MinusInf`. Library also
 provides several `Duration` subclasses for implicit conversion purposes and those should
 not be used.

Abstract `Duration` contains methods that allow :

1. Conversion to different time units (`toNanos`, `toMicros`, `toMillis`,
`toSeconds`, `toMinutes`, `toHours`, `toDays` and `toUnit(unit: TimeUnit)`).
2. Comparison of durations (`<`, `<=`, `>` and `>=`).
3. Arithmetic operations (`+`, `-`, `*`, `/` and `unary_-`).
4. Minimum and maximum between `this` duration and the one supplied in the argument (`min`, `max`).
5. Check if the duration is finite (`finite_?`).

`Duration` can be instantiated in the following ways:

1. Implicitly from types `Int` and `Long`. For example `val d = 100 millis`.
2. By passing a `Long` length and a `java.util.concurrent.TimeUnit`.
For example `val d = Duration(100, MILLISECONDS)`.
3. By parsing a string that represent a time period. For example `val d = Duration("1.2 µs")`.

Duration also provides `unapply` methods so it can be used in pattern matching constructs.
Examples:

    import scala.concurrent.util.Duration
    import scala.concurrent.util.duration._
    import java.util.concurrent.TimeUnit._

    // instantiation
    val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
    val d2 = Duration(100, "millis") // from Long and String
    val d3 = 100 millis // implicitly from Long, Int or Double
    val d4 = Duration("1.2 µs") // from String

    // pattern matching
    val Duration(length, unit) = 5 millis


## References
1. [The Task-Based Asynchronous Pattern, Stephen Toub, Microsoft, April 2011][1]
2. [Finagle Documentation][2]
3. [Akka Documentation: Futures][3]
4. [Scala Actors Futures][4]
5. [Scalaz Futures][5]

  [1]: https://www.microsoft.com/download/en/details.aspx?id=19957 "NETAsync"
  [2]: https://twitter.github.com/scala_school/finagle.html "Finagle"
  [3]: https://doc.akka.io/docs/akka/current/futures.html "AkkaFutures"
  [4]: https://web.archive.org/web/20140814211520/https://www.scala-lang.org/api/2.9.3/scala/actors/Future.html "SActorsFutures"
  [5]: https://code.google.com/p/scalaz/ "Scalaz"


## Appendix A: API Traits

An implementation is available at [https://github.com/phaller/scala](https://github.com/phaller/scala/tree/execution-context/src/library/scala/concurrent). (Reasonably stable implementation, though possibility of flux.)
