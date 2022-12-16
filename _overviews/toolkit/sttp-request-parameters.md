---
title: How to make an HTTP request with parameters?
type: section
description: How to make an HTTP request with parameters with Scala Toolkit.
num: 15
previous-page: sttp-dynamic-urls
next-page: sttp-request-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Making a request with parameters
The `uri` string interpolator (e.g. in `uri"https://example.com/"`) allows to easily add request parameters. Let's say you want to add a `filter` request parameter to `https://example.com/list` url, for example: `https://example.com/list?filter=peter`. If you want to use a static address and always query for `peter`, you would be done now. If you want to be a bit more flexible in your code and allow any filters, then you need to add one simple modification. 

## Adding custom request parameters
You can add request parameters dynamically by putting a value name after a `$` sign in the url. For example, `https://example.com/list?filter=$name` will replace `$name` with the value of variable `name`.

```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = "peter" // the name you want to pass
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Construct get request to the service - https://example.com/list?filter=peter
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```

## Optional parameters
If you are in a situation where you either can have the parameter available to put in the URL or not, you can create a code that is able to handle both scenarios. Scala comes with a handy type called `Option`. It allows you to represent something that is either available - `Some`, or something that is not present - `None`. You can utilize this when adding a request parameter:
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = Some("peter") // the name you want to pass, in this case it is present and set to "peter"
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Construct get request to the service - https://example.com/list?filter=peter
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```
But when the `name` was not set to `None`, then the `filter` parameter would not appear at all in the url.
```scala
val name = None // name is not present
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Construct get request to the service - https://example.com/list
```
In this case, the url would be just `https://example.com/list` - the filter parameter is omitted due to the `name` being `None`.

Learn more in the [sttp documentation chapter about URIs](https://sttp.softwaremill.com/en/latest/model/uri.html).