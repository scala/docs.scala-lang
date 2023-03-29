---
title: How to send a request?
type: section
description: Sending a simple HTTP request with sttp.
num: 27
previous-page: sttp-intro
next-page: sttp-uris
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Sending an HTTP request
The simplest way to send a request with Scala Toolkit's http client library, sttp, is to use the `SimpleHttpClient` instance. 
You need to import a few members from the library, and then write the code that defines and sends the request:

{% tabs 'request' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest.get(uri"https://httpbin.org/get") // Define a GET request to https://httpbin.org/get
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}

## Other request types
You can swap `basicRequest.get` with any HTTP method you want. For example:
```scala
val request = basicRequest.post(uri"https://httpbin.org/get").body("Hello, world!")
```
Defines a `POST` request with `Hello, world!` as the body.

## The `basicRequest`
The sttp library takes an approach of starting with a simple request description, the `basicRequest`, then modifying it to suit your needs. 
The `basicRequest` is already set up with some [basic headers](https://sttp.softwaremill.com/en/latest/requests/basics.html#initial-requests) - all you need to do is provide the address using the `get` method. 
Other methods are available for the other HTTP methods: GET, POST, DELETE, etc.

## The `uri` interpolator
The `uri` interpolator in `uri"https://httpbin.org/get"` keeps you safe from making some mistakes in the provided addresses.
It can also interpolate values from variables as described in ['How to construct URIs?']({% link _overviews/toolkit/sttp-uris.md %}).
