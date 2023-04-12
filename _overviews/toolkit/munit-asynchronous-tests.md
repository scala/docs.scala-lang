---
title: How to write asynchronous tests?
type: section
description: Writing asynchronous tests using MUnit
num: 10
previous-page: munit-exceptions
next-page: munit-resources
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Asynchronous tests

In Scala, it is common to define *asynchronous* methods as returning a `Future` of their result.
For example, consider an asynchronous variant of a `square` method:

{% tabs 'async-1' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import scala.concurrent.{ExecutionContext, Future}

object AsyncMathLib {
  def square(x: Int)(using ExecutionContext): Future[Int] =
    Future(x * x)
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import scala.concurrent.{ExecutionContext, Future}

object AsyncMathLib:
  def square(x: Int)(implicit ec: ExecutionContext): Future[Int] =
    Future(x * x)
```
{% endtab %}
{% endtabs %}

To test this kind of method, MUnit offers special support for `Future`s.
A test can itself return a `Future[Unit]`.
MUnit will wait behind the scenes for the resulting `Future` to complete, failing the test if any assertion turns out to be incorrect.

You can therefore write the test as follows:

{% tabs 'async-3' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
// Import the global execution context, required to call async methods
import scala.concurrent.ExecutionContext.Implicits.global

class AsyncMathLibTests extends munit.FunSuite:
  test("square") {
    for
      squareOf3 <- AsyncMathLib.square(3)
      squareOfMinus4 <- AsyncMathLib.square(-4)
    yield
      assertEquals(squareOf3, 9)
      assertEquals(squareOfMinus4, 16)
  }
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
// Import the global execution context, required to call async methods
import scala.concurrent.ExecutionContext.Implicits.global

class AsyncMathLibTests extends munit.FunSuite {
  test("square") {
    for {
      squareOf3 <- AsyncMathLib.square(3)
      squareOfMinus4 <- AsyncMathLib.square(-4)
    } yield {
      assertEquals(squareOf3, 9)
      assertEquals(squareOfMinus4, 16)
    }
  }
}
```
{% endtab %}
{% endtabs %}

The test first asynchronously computes `square(3)` and `square(-4)`.
Once both computations are completed, and if they are both successful, it proceeds with the calls to `assertEquals`.
If any of the assertion fails, the resulting `Future[Unit]` will be failed, and MUnit will interpret that as the test failing.

You may find more details about asynchronous tests [in the MUnit documentation](https://scalameta.org/munit/docs/tests.html#declare-async-test).
In particular, it contains details on how to achieve the same result for other kinds of asynchronous containers, besides `Future`.
