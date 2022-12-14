---
title: How to make an HTTP request?
type: section
description: How to make any HTTP request with Scala Toolkit.
num: 13
previous-page: sttp-intro
next-page: sttp-dynamic-urls
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Make a request
The simplest way to make a request with Scala Toolkit's http client library, sttp, is to use the `SimpleHttpClient` instance. You need to import a few members from the library, and then write the code that makes the request:

```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest.get(uri"https://httpbin.org/get") // Construct get request to an example service - https://httpbin.org/get
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```

## Other request types
You can swap `basicRequest.get` with any HTTP method you want. For example:
```scala
val request = basicRequest.post(uri"https://httpbin.org/get")
```
Will make a `POST` request.

## The `basicRequest`
Sttp library takes an approach of starting with a simple request prototype, the `basicRequest`, then modifying it to suit your needs. The `basicRequest` is already set up with some [basic headers](https://sttp.softwaremill.com/en/latest/requests/basics.html#initial-requests) - all you need to do is provide the address and the method you want to preform with `get` function. Other functions are available for different HTTP methods. 

## The `uri` operator before website address
The `uri` operator in the `uri"https://httpbin.org/get"` code may appear strange at first, but it will keep you safe from making mistakes in the provided addresses. It takes care of all the pitfalls one call fall into when constructing URIs, especially when adding some dynamic parameters. All you need to know is that importing `UriContext` will make you able to use it.