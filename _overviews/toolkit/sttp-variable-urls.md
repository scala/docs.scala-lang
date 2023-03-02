---
title: How to define URIs from variables
type: section
description: How to construct URIs from variables with Scala Toolkit.
num: 14
previous-page: sttp-send-request
next-page: sttp-query-parameters
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## URIs from variables
You will often find yourself in a situation where the address depends on some variables. 
For example, `https://example.com/john` may be a page about someone called John, but you may want to check out the pages of other people too.

## The `uri` interpolator
The `uri` interpolator (e.g. in `uri"https://example.com/"`) allows you to create valid web addresses, also called URI.
When you have a variable in scope, for instance `name`, you can put its value in the URI using the `$` sign or the `${}` syntax. For instance, the URI `uri"https://example.com/$name"` contains an interpolated variable `name`.
It will produce the URI `https://example.com/peter`, exactly as you would expect.

`uri` is a custom [String interpolator](/overviews/core/string-interpolation.html) defined in sttp.
When you call it, it replaces the interpolated variables with their values, for instance `$name` is replaced by `peter`.
The role of the `uri` interpolator is also to escape any special character to build valid URIs.

{% tabs 'variables' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = "peter" // The name you want to pass
val request = basicRequest.get(uri"https://example.com/$name") // Define the GET request to https://example.com/peter
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}

Learn more in the [sttp documentation chapter about URIs](https://sttp.softwaremill.com/en/latest/model/uri.html).