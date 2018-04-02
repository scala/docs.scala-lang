---
layout: sip
discourse: true
title: SIP-22 - Async

vote-status: dormant
vote-text: Authors have marked this proposal as dormant. Details in the implementation need to be figured out. Check <a href="/sips/minutes-list.html">July 2016's minutes</a>.
permalink: /sips/:title.html
redirect_from: /sips/pending/async.html
---

**By: Philipp Haller and Jason Zaugg**

## Introduction

This is a proposal to add constructs that simplify asynchronous and concurrent programming in Scala. The main constructs, async and await, are inspired by similar constructs introduced in C# 5.0. The main purpose of async/await is to make it possible to express efficient asynchronous code in a familiar direct style (where suspending operations look as if they were blocking). As a result, non-blocking code using Scala’s futures API \[[1][1]\] can be expressed without using higher-order functions, such as map and flatMap, or low-level callbacks.

On the level of types, async and await are methods with simple, intuitive types:

    def async[T](body: => T): Future[T]
    def await[T](future: Future[T]): T

Here, `Future[T]` refers to the `Future` trait in package `scala.concurrent`. (The system can be adapted to other implementations of future-like abstractions; at the moment the API with the required extension points is internal, though.) The above methods are used as follows:

    val fut = async {
      slowComputation()
    }

The async construct marks a block of asynchronous code, and returns a future. Depending on the execution context in the implicit scope (see \[[1][1]\]), the block of asynchronous code is either executed on the current thread or in a thread pool. The async block can contain calls to await:

    val futureDOY: Future[Response] =
      WS.url("http://api.day-of-year/today").get

    val futureDaysLeft: Future[Response] =
      WS.url("http://api.days-left/today").get

    val respFut = async {
      val dayOfYear = await(futureDOY).body
      val daysLeft = await(futureDaysLeft).body
      Ok(s"$dayOfYear: $daysLeft days left!")
    }

Line 1 and 4 define two futures obtained as results of asynchronous requests to two hypothetical web services using an API inspired by Play Framework \[[2][2]\] (for the purpose of this example, the definition of type `Response` is unimportant). The `await` on line 8 causes the execution of the `async` block to suspend until `futureDOY` is completed (with a successful result or with an exception). When the future is completed successfully, its result is bound to the `dayOfYear` val, and the execution of the `async` block is resumed. When the future is completed with an exception (for example, because of a timeout), the invocation of `await` re-throws the exception that the future was completed with. In turn, this completes future respFut with the same exception. Likewise, the `await` on line 9 suspends the execution of the `async` block until futureDaysLeft is completed.

## Comparison with Scala’s Futures API

The provided async and await constructs can significantly simplify code coordinating multiple futures. Consider the following example, written using Scala’s futures API together with for-comprehensions:

    def nameOfMonth(num: Int): Future[String] = ...
    val date = “““(\d+)/(\d+)“““.r

    for { doyResponse <- futureDOY
          dayOfYear = doyResponse.body
          response <- dayOfYear match {
            case date(month, day) =>
              for (name <- nameOfMonth(month.toInt))
              yield Ok(s“It’s $name!“)
            case _ =>
              Future.successful(NotFound(“Not a...“))
          }
    } yield response

Line 1 defines an asynchronous method that converts an integer representing the number of a month to the name of the month (for example, the integer 2 is converted to "February"). Since the method is asynchronous, it returns a `Future[String]`. Line 2 defines a regular expression used to extract the month from a date string such as "07/24". The for-comprehension starting on line 4 first awaits the result of `futureDOY` (the example re-uses the definition of `futureDOY` shown earlier). Scala's futures provide methods like `map` and `flatMap`, and can thus be used as generators in for-comprehensions (for a more in-depth introduction of this feature see the official documentation \[[1][1]\]). The use of for-comprehensions can help make future-based code more clear, but in many cases it requires a significant amount of unnatural clutter and workarounds. The above example suffers from the following issues:

- To extract `dayOfYear`, we are forced to introduce the name `doyResponse`, a useless intermediate result (line 4);
- to await the completion of the future returned by `nameOfMonth`, we are forced to use a nested for-comprehension (line 8);
- the nested for-comprehension forces us to bind the result of nameOfMonth to name, a useless intermediate variable (line 8);
- the nested for-comprehension forces us to introduce an artificial future that's completed upon creation (line 11);
- the artificial future introduces additional overhead and garbage (line 11);
- finally, the use of for-yield might obscure the actual domain which is asynchronous computations with non-blocking awaits.

The same example can be written using async/await as follows:

    async {
      await(futureDOY).body match {
        case date(month, day) =>
          Ok(s“It’s ${await(nameOfMonth(month.toInt))}!“)
        case _ =>
          NotFound(“Not a date, mate!“)
      }
    }

This version avoids all drawbacks of the previous version listed above. In addition, the generated code is more efficient, because it creates fewer closures.

## Illegal Uses

The following uses of await are illegal and are reported as errors:
- await requires a directly-enclosing async; this means await must not be used inside a closure nested within an async block, or inside a nested object, trait, or class.
- await must not be used inside an expression passed as an argument to a by-name parameter.
- await must not be used inside a Boolean short-circuit argument.
- return expressions are illegal inside an async block.

## Implementation

We have implemented the present proposal using the macro system which has been introduced in Scala 2.10 as an experimental feature. Our implementation \[[3][3]\] is targeted at Scala 2.11.0, but runs on using Scala 2.10.1 without any limitations.

## Async Transform Specification

In the following we consider the transformation of an invocation `async { <block> }` of the async macro.
Before the block of code (`<block>`) is transformed, it is normalized into a form amenable to a transformation into a state machine. This form is called the "A-Normal Form" (ANF), and roughly means that:

- `if`, `match`, and other control-flow  constructs are only used as statements; they cannot be used as expressions;
- calls to `await` are not allowed in compound expressions.

After the ANF transform, the async macro prepares the state machine
transformation by identifying vals, vars and defs that are accessed
from multiple states. These will be lifted out to fields in the state
machine object.

The next step of the transformation breaks the code into "chunks."
Each chunk contains a linear sequence of statements that concludes
with a branching decision, or with the registration of a subsequent
state handler as the continuation (the "on-completion handler"). Once
all chunks have been built, the macro synthesizes a class representing
the state machine. The class contains:

- an integer representing the current state ID
- the lifted definitions
- an `apply(value: Try[Any]): Unit` method that will be called on completion of each future. The behavior of this method is determined by the current state. It records the downcast result of the future in a field, and calls the `resume()` method.
- the `resume(): Unit` method that switches on the current state and runs the users code for one "chunk," and either: (a) registers the state machine as the handler for the next future, or (b) completes the result promise of the async block, if at the terminal state.
- an `apply(): Unit` method that starts the evaluation of the async block's body.

### Example

    val future = async {
      val f1 = async { true }
      val x = 1
      def inc(t: Int) = t + x
      val t = 0
      val f2 = async { 42 }
      if (await(f1)) await(f2) else { val z = 1; inc(t + z) }
    }

After the ANF transform:
- `await` calls are moved to only appear on the RHS of a value definition;
- `if` is no longer used as an expression; instead each branch writes its result to a synthetic var;
- the `ExecutionContext` used to run the async block is obtained as an implicit argument.

Follows the end result of the ANF transform (with very minor
simplifications).

    {
      ();
      val f1: scala.concurrent.Future[Boolean] = {
        scala.concurrent.Future.apply[Boolean](true)(scala.concurrent.ExecutionContext.Implicits.global)
      };
      val x: Int = 1;
      def inc(t: Int): Int = t.+(x);
      val t: Int = 0;
      val f2: scala.concurrent.Future[Int] = {
        scala.concurrent.Future.apply[Int](42)(scala.concurrent.ExecutionContext.Implicits.global)
      };
      val await$1: Boolean = scala.async.Async.await[Boolean](f1);
      var ifres$1: Int = 0;
      if (await$1)
      {
        val await$2: Int = scala.async.Async.await[Int](f2);
        ifres$1 = await$2
      }
      else
      {
        ifres$1 = {
          val z: Int = 1;
          inc(t.+(z))
        }
      };
      ifres$1
    }

After the full async transform:

- one class is synthesized that represents the state machine. Its `apply()` method is used to start the computation (even the code before the first await call is executed asynchronously), and the `apply(tr: scala.util.Try[Any])` method will continue after each completed future that the async block awaits;

- each chunk of code is moved into the a branch of the pattern match in `resume$async`;

- value and function definitions accessed from multiple states are lifted to be members of class `stateMachine`; others remain local, e.g. `val z`;

- `result$async` holds the promise which is completed with the result of the async block;

- `execContext$async` holds the `ExecutionContext` that has been inferred.

Follows the end result of the full async transform (with very minor
simplifications).

    {
      class stateMachine$7 extends StateMachine[scala.concurrent.Promise[Int], scala.concurrent.ExecutionContext] {
        var state$async: Int = 0;
        val result$async: scala.concurrent.Promise[Int] = scala.concurrent.Promise.apply[Int]();
        val execContext$async = scala.concurrent.ExecutionContext.Implicits.global;
        var x$1: Int = 0;
        def inc$1(t: Int): Int = t.$plus(x$1);
        var t$1: Int = 0;
        var f2$1: scala.concurrent.Future[Int] = null;
        var await$1: Boolean = false;
        var ifres$1: Int = 0;
        var await$2: Int = 0;
        def resume$async(): Unit = try {
          state$async match {
            case 0 => {
              ();
              val f1 = {
                scala.concurrent.Future.apply[Boolean](true)(scala.concurrent.ExecutionContext.Implicits.global)
              };
              x$1 = 1;
              t$1 = 0;
              f2$1 = {
                scala.concurrent.Future.apply[Int](42)(scala.concurrent.ExecutionContext.Implicits.global)
              };
              f1.onComplete(this)(execContext$async)
            }
            case 1 => {
              ifres$1 = 0;
              if (await$1)
                {
                  state$async = 2;
                  resume$async()
                }
              else
                {
                  state$async = 3;
                  resume$async()
                }
            }
            case 2 => {
              f2$1.onComplete(this)(execContext$async);
              ()
            }
            case 5 => {
              ifres$1 = await$2;
              state$async = 4;
              resume$async()
            }
            case 3 => {
              ifres$1 = {
                val z = 1;
                inc$1(t$1.$plus(z))
              };
              state$async = 4;
              resume$async()
            }
            case 4 => {
              result$async.complete(scala.util.Success.apply(ifres$1));
              ()
            }
          }
        } catch {
          case NonFatal((tr @ _)) => {
            {
              result$async.complete(scala.util.Failure.apply(tr));
              ()
            };
            ()
          }
        };
        def apply(tr: scala.util.Try[Any]): Unit = state$async match {
          case 0 => {
            if (tr.isFailure)
              {
                result$async.complete(tr.asInstanceOf[scala.util.Try[Int]]);
                ()
              }
            else
              {
                await$1 = tr.get.asInstanceOf[Boolean];
                state$async = 1;
                resume$async()
              };
            ()
          }
          case 2 => {
            if (tr.isFailure)
              {
                result$async.complete(tr.asInstanceOf[scala.util.Try[Int]]);
                ()
              }
            else
              {
                await$2 = tr.get.asInstanceOf[Int];
                state$async = 5;
                resume$async()
              };
            ()
          }
        };
        def apply: Unit = resume$async()
      };
      val stateMachine$7: StateMachine[scala.concurrent.Promise[Int], scala.concurrent.ExecutionContext] = new stateMachine$7();
      scala.concurrent.Future.apply(stateMachine$7.apply())(scala.concurrent.ExecutionContext.Implicits.global);
      stateMachine$7.result$async.future
    }

## References

1. [The Scala Futures API][1]
2. [The Play! Framework][2]
3. [Scala Async on GitHub][3]

  [1]: http://docs.scala-lang.org/overviews/core/futures.html "ScalaFutures"
  [2]: http://www.playframework.com/ "Play"
  [3]: https://github.com/scala/async "ScalaAsync"
