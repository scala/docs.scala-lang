---
title: How to make a request to a dynamic URLs 
type: section
description: How to operate on dynamic URLs with Scala Toolkit.
num: 14
previous-page: sttp-make-request
next-page: sttp-request-parameters
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Dynamic URLs
You will often find yourself in a situation where the address you want to make a request to has some changing parts. For example, `https://example.com/john` may be a page about someone called John, but you want to be able to check out people with different names

## The `uri` operator
The `uri` operator (e.g. in `uri"https://example.com/"`) allows you to safely create a web address, also called URI.
When you have a variable in scope, for instance `name`, you can put its value in the URI like this: `uri"https://example.com/$name"`.
It will produce the URI `https://example.com/peter`, exactly as you would expect.
`uri` is a custom [String interpolator](overviews/core/string-interpolation.html) defined in sttp.
When you call it, it replaces the interpolated variables with their values, for instance `$name` is replaced by `peter` and it makes sure, at compile time, that the syntax of the URI is correct.

```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = "peter" // the name you want to pass
val request = basicRequest.get(uri"https://example.com/$name") // Construct get request to the service - https://example.com/peter
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```

Learn more in the [sttp documentation chapter about URIs](https://sttp.softwaremill.com/en/latest/model/uri.html).