---
title: How to send a request?
type: section
description: Sending a simple HTTP request with sttp.
num: 24
previous-page: http-client-intro
next-page: http-client-uris
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Sending an HTTP request

The simplest way to send a request with sttp is `quickRequest`.

You can define a GET request with `.get` and send it with `.send`.

{% tabs 'request' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val response: Response[String] = quickRequest
  .get(uri"https://httpbin.org/get")
  .send()

println(response.code)
// prints: 200

println(response.body)
// prints some JSON string
```
{% endtab %}
{% endtabs %}

A `Response[String]` contains a status code and a string body.

## The request definition

### The HTTP method and URI

To specify the HTTP method and URI of a `quickRequest`, you can use `get`, `post`, `put`, or `delete`.

To construct a URI you can use the `uri` interpolator, for e.g. `uri"https://example.com"`.
To learn more about that, see [*How to construct URIs and query parameters?*](/toolkit/http-client-uris).

### The headers

By default, the `quickRequest` contains the "Accept-Encoding" and the "deflate" headers.
To add more headers, you can call one of the `header` or `headers` overloads:

{% tabs 'headers' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val request = quickRequest
  .get(uri"https://example.com")
  .header("Origin", "https://scala-lang.org")

println(request.headers)
// prints: Vector(Accept-Encoding: gzip, deflate, Origin: https://scala-lang.org)
```
{% endtab %}
{% endtabs %}

sttp can also add "Content-Type" and "Content-Length" automatically if the request contains a body.

## Authentication

If you need authentication to access a resource, you can use one of the `auth.basic`, `auth.basicToken`, `auth.bearer` or `auth.digest` methods.

{% tabs 'auth' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

// a request with a authentication
val request = quickRequest
  .get(uri"https://example.com")
  .auth.basic(user = "user", password = "***")
```
{% endtab %}
{% endtabs %}
