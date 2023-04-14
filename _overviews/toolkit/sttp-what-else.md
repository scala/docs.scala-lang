---
title: What else can sttp do?
type: section
description: An incomplete list of features of sttp
num: 29
previous-page: sttp-upload-file
next-page: 
---

{% include markdown.html path="_markdown/install-upickle.md" %}

Here is an non-exhaustive list of features of sttp.

## Asynchronous requests

To send a request asynchronously you can use a `DefaultFutureBackend`:

{% tabs 'async' %}
{% tab 'Scala 2 and 3' %}
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

You can learn more about `Future`-based backends in [sttp documentation](https://sttp.softwaremill.com/en/latest/backends/future.html).

sttp supports many more asynchronous wrappers such as, the Monix [Task], the cats [Effect], the [ZIO] type and more.
You can see the full list of supported backends [here](https://sttp.softwaremill.com/en/latest/backends/summary.html).

## Websockets

You can use a `DefaultFutureBackend` to open a websocket, as follows.

{% tabs 'ws' class=scala-version-tabs %}
{% tab 'Scala 2' %}
```scala
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global

import sttp.client4.*
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

Learn more about WebSockets in [sttp documentation](https://sttp.softwaremill.com/en/latest/websockets.html).

## More features

You can discover many more features such as streaming, logging, timeouts, and more in [sttp documentation](https://sttp.softwaremill.com/en/latest/quickstart.html#).
