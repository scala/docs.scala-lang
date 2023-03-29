---
title: How to send a request with some query parameters?
type: section
description: Interpolating query parameters in sttp URIs.
num: 29
previous-page: sttp-uris
next-page: sttp-string-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Query parameters
A query parameter is a way to assign a value to a parameter in a URI.
For instance, "https://example.com/list?filter=peter" contains the query parameter `filter` with value `peter`.

## Adding custom query parameters
You can interpolate the value of a variable into a query parameter using the `$` sign, or the `${}` syntax. 
For example, calling `uri"https://example.com/list?filter=$name"` replaces `$name` with the value of the variable `name`.

{% tabs 'get' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = "peter" // The name you want to filter with
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Define the GET request to https://example.com/list with a query parameter filter=peter
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}

For safety, the `uri` interpolator makes sure to escape all the special characters coming from the interpolated variables.

## Optional parameters
If you are in a situation where you either can have the query parameter or not, the `uri` interpolator can hanlde that for you automatically. 
Scala comes with a handy type called `Option`. It allows you to represent something that is either available - `Some`, or something that is not present - `None`. 
You can use this when adding a request parameter:
{% tabs 'optionalparams' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val name = Some("peter") // the name you want to pass, in this case it is present and set to "peter"
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Define the GET request to https://example.com/list with a query parameter filter=peter
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}
But when the `name` is set to `None`, then the `filter` parameter would not appear at all in the URI.
```scala
val name = None // name is not present
val request = basicRequest.get(uri"https://example.com/list?filter=$name") // Define the GET request to https://example.com/list, the "filter" query parameter is not set.
```
In this case, the URI is just `https://example.com/list` - the query parameter is omitted due to the `name` being `None`.

Learn more in the [sttp documentation chapter about URIs](https://sttp.softwaremill.com/en/latest/model/uri.html).
