---
title: How to write asynchronous tests?
type: section
description: Writing asynchronous tests using MUnit
num: 8
previous-page: munit-clues
next-page: munit-resources
---

{% include markdown.html path="_markdown/install-munit.md" %}

In Scala, it is common to define *asynchronous* methods as returning a `Future` of their result.
For example, consider an asynchronous variant of a `square` method:

```scala
import scala.concurrent.{ExecutionContext, Future}

object MathLib:
  def square(x: Int)(using ExecutionContext): Future[Int] =
    Future(x * x)
end MathLib
```

You may be tempted to test it as follows:

```scala
// Import the global execution context, required to call async methods
import scala.concurrent.ExecutionContext.Implicits.global

import MathLib.*

class MathLibTests extends munit.FunSuite:
  test("square") {
    assertEquals(9, square(3))
    assertEquals(16, square(-4))
  }
end MathLibTests
```

However, it refuses to compile with the following error message:

```
[error] -- Error: MathLibTests.scala:21:30
[error] 21 |    assertEquals(9, square(3))
[error]    |                              ^
[error]    |      Cannot prove that concurrent.Future[Int] <:< Int.
```

To address this kind of situation, MUnit offers special support for `Future`s.
A test can itself return a `Future[Unit]`.
MUnit will wait behind the scenes for the resulting `Future` to complete, failing the test if it is has a failed result.

You can therefore write the test as follows:

```scala
// Import the global execution context, required to call async methods
import scala.concurrent.ExecutionContext.Implicits.global

import MathLib.*

class MathLibTests extends munit.FunSuite:
  test("square") {
    for
      square3 <- square(3)
      squareM4 <- square(-4)
    yield
      assertEquals(9, square3)
      assertEquals(16, squareM4)
  }
end MathLibTests
```

The test first asynchronously computes `square(3)` and `square(-4)`.
Once both computations are completed, and if they are both successful, it proceeds with the calls to `assertEquals`.
If any of the above operations fails, the resulting `Future[Unit]` will be failed, and MUnit will interpret that as the test failing.

This strategy for asynchronous tests is portable: it works on the JVM, on Scala.js and in Scala Native.

You may find more details about asynchronous tests [in the MUnit documentation](https://scalameta.org/munit/docs/tests.html#declare-async-test).
In particular, it contains details on how to achieve the same result for other kinds of asynchronous containers, besides `Future`.
