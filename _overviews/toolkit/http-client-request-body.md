---
title: How to send a request with a body?
type: section
description: Sending a string body with sttp
num: 26
previous-page: http-client-uris
next-page: http-client-json
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Sending a request with a string body

To send a POST request with a string body, you can chain `post` and `body` on a `quickRequest`:
{% tabs 'body' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import sttp.client4.quick._

val response = quickRequest
  .post(uri"https://httpbin.org/post")
  .body("Lorem ipsum")
  .send()

println(response.code)
// prints: 200
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import sttp.client4.quick.*

val response = quickRequest
  .post(uri"https://httpbin.org/post")
  .body("Lorem ipsum")
  .send()

println(response.code)
// prints: 200
```
{% endtab %}
{% endtabs %}

In a request with string body, sttp adds the `Content-Type: text/plain; charset=utf-8` header and computes the `Content-Length` header.

## Binary data

The `body` method can also take a `Array[Byte]`, a `ByteBuffer` or an `InputStream`.

{% tabs 'binarydata' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
val bytes: Array[Byte] = "john".getBytes
val request = quickRequest.post(uri"https://httpbin.org/post").body(bytes)
```
{% endtab %}
{% endtabs %}

The binary body of a request is sent with `Content-Type: application/octet-stream`.

Learn more in the [sttp documentation chapter about request bodies](https://sttp.softwaremill.com/en/latest/requests/body.html).
