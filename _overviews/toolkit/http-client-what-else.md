---
title: What else can sttp do?
type: section
description: An incomplete list of features of sttp
num: 29
previous-page: http-client-upload-file
next-page: web-server-intro
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Asynchronous requests

To send a request asynchronously you can use a `DefaultFutureBackend`:

{% tabs 'async' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import scala.concurrent.Future
import sttp.client4._

val asyncBackend = DefaultFutureBackend()
val response: Future[Response[String]] = quickRequest
  .get(uri"https://example.com")
  .send(asyncBackend)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import scala.concurrent.Future
import sttp.client4.*

val asyncBackend = DefaultFutureBackend()
val response: Future[Response[String]] = quickRequest
  .get(uri"https://example.com")
  .send(asyncBackend)
```
{% endtab %}
{% endtabs %}

You can learn more about `Future`-based backends in the [sttp documentation](https://sttp.softwaremill.com/en/latest/backends/future.html).

sttp supports other asynchronous wrappers such as Monix `Task`s, cats-effect `Effect`s, ZIO's `ZIO` type, and more.
You can see the full list of supported backends [here](https://sttp.softwaremill.com/en/latest/backends/summary.html).

## Websockets

You can use a `DefaultFutureBackend` to open a websocket, as follows.

{% tabs 'ws' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc:reset
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global

import sttp.client4._
import sttp.client4.ws.async._
import sttp.ws.WebSocket

val asyncBackend = DefaultFutureBackend()

def useWebSocket(ws: WebSocket[Future]): Future[Unit] =
  for {
    _ <- ws.sendText("Hello")
    text <- ws.receiveText()
  } yield {
    println(text)
  }

val response = quickRequest
  .get(uri"wss://ws.postman-echo.com/raw")
  .response(asWebSocketAlways(useWebSocket))
  .send(asyncBackend)

Await.result(response, Duration.Inf)
// prints: Hello
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global

import sttp.client4.*
import sttp.client4.ws.async.*
import sttp.ws.WebSocket

val asyncBackend = DefaultFutureBackend()

def useWebSocket(ws: WebSocket[Future]): Future[Unit] =
  for
    _ <- ws.sendText("Hello")
    text <- ws.receiveText()
  yield
    println(text)

val response = quickRequest
  .get(uri"wss://ws.postman-echo.com/raw")
  .response(asWebSocketAlways(useWebSocket))
  .send(asyncBackend)

Await.result(response, Duration.Inf)
// prints: Hello
```
{% endtab %}
{% endtabs %}

Learn more about WebSockets in [sttp documentation](https://sttp.softwaremill.com/en/latest/other/websockets.html).

## More features

You can discover many more features such as streaming, logging, timeouts, and more in [sttp documentation](https://sttp.softwaremill.com/en/latest/quickstart.html#).
