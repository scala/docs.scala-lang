---
title: How to make an HTTP request with a body?
type: section
description: How to make an HTTP request with a body with Scala Toolkit.
num: 16
previous-page: sttp-request-parameters
next-page: sttp-request-body-custom
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Making a request with a body
If you want to make a POST request with a body, then you can use the `.body` method together with `.post`, on the `basicRequest` value from the `sttp` Toolkit library when making a request:
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val requestBody = "{'name': 'peter'}" // the body you want to pass
val request = basicRequest.post(uri"https://example.com/").body(requestBody) // Construct get request to the service - https://people.com/list?filter=peter
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```
That will set the body of the request to the provided value.

## Binary data
You can provide binary data as a body by putting an `Array[Byte]`, `ByteBuffer` or `ByteArrayInputStream` as a parameter of `.body` method:
```scala
val bytes: Array[Byte] = ???
val request = basicRequest.post(uri"https://example.com/").body(bytes)
```
`???` represents some code you used to initialize the binary data.

## Setting the Content-Type
When sending a request body you may often want to specify the `Content-Type` header. To do that, you can set the second parameter of the `.body` method:
```scala
val requestBody = "peter"
val request = basicRequest.post(uri"https://example.com/").body(requestBody, "utf8") // use utf8 as Content-Type
```

Learn more in the [sttp documentation chapter about request bodies](https://sttp.softwaremill.com/en/latest/requests/body.html).