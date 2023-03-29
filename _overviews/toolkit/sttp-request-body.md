---
title: How to send an HTTP request with a body?
type: section
description: How to send an HTTP request with a body using the Scala Toolkit.
num: 21
previous-page: sttp-query-parameters
next-page: sttp-request-body-custom
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Sending a request with a body
To send a POST request with a body, you can use the `body` and the `post` methods, on the `basicRequest`:
{% tabs 'body' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val requestBody = """{"name": "peter"}""" // The body you want to send
val request = basicRequest.post(uri"https://example.com/").body(requestBody) // The post request to https://example.com/
val response = client.send(request) // Send the request and receive the response
println(response.body) // print the body of the response
```
{% endtab %}
{% endtabs %}

Calling the `body` method on a request sets its body to the provided value.

## Binary data
You can provide binary data as a body by passing an `Array[Byte]`, `ByteBuffer` or `InputStream` to the `body` method:
{% tabs 'binarydata' %}
{% tab 'Scala 2 and 3' %}
```scala
val bytes: Array[Byte] = "john".getBytes
val request = basicRequest.post(uri"https://example.com/").body(bytes)
```
{% endtab %}
{% endtabs %}

## Setting the Content-Type
When you specify a request body, sttp automatically sets some default `Content-Type` header.
For instance, for a body of type `String`, it will set the header `Content-Type` of value `text/plain; charset=utf-8`.

To change the default `Content-Type`, you can call the `contentType` method like this:

{% tabs 'contenttype' %}
{% tab 'Scala 2 and 3' %}
```scala
val requestBody = """{"name": "peter"}"""
val request = basicRequest
  .post(uri"https://example.com/")
  .body(requestBody)
  .contentType("application/json")
```
{% endtab %}
{% endtabs %}

Learn more in the [sttp documentation chapter about request bodies](https://sttp.softwaremill.com/en/latest/requests/body.html).
