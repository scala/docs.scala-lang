---
title: How to construct URIs and query parameters?
type: section
description: Using interpolation to construct URIs
num: 25
previous-page: http-client-request
next-page: http-client-request-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## The `uri` interpolator

`uri` is a custom [string interpolator](/overviews/core/string-interpolation.html) that allows you to create valid web addresses, also called URIs. For example, you can write `uri"https://example.com/"`.

You can insert any variable or expression in your URI with the usual `$` or `${}` syntax.
For instance `uri"https://example.com/$name"`, interpolates the value of the variable `name` into an URI.
If `name` contains `"peter"`, the result is `https://example.com/peter`.

`uri` escapes special characters automatically, as seen in this example:

{% tabs 'uri' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import sttp.client4.quick._
import sttp.model.Uri

val book = "programming in scala"
val bookUri: Uri = uri"https://example.com/books/$book"

println(bookUri)
// prints: https://example.com/books/programming%20in%20scala
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import sttp.client4.quick.*
import sttp.model.Uri

val book = "programming in scala"
val bookUri: Uri = uri"https://example.com/books/$book"

println(bookUri)
// prints: https://example.com/books/programming%20in%20scala
```
{% endtab %}
{% endtabs %}

## Query parameters

A query parameter is a key-value pair that is appended to the end of a URI in an HTTP request to specify additional details about the request.
The web server can use those parameters to compute the appropriate response.

For example, consider the following URL:

```
https://example.com/search?q=scala&limit=10&page=1
```

It contains three query parameters: `q=scala`, `limit=10` and `page=1`.

### Using a map of query parameters

The `uri` interpolator can interpolate a `Map[String, String]` as query parameters:

{% tabs 'queryparams' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
val queryParams = Map(
  "q" -> "scala",
  "limit" -> "10",
  "page" -> "1"
)
val uriWithQueryParams = uri"https://example.com/search?$queryParams"
println(uriWithQueryParams)
// prints: https://example.com/search?q=scala&limit=10&page=1
```
{% endtab %}
{% endtabs %}

For safety, special characters in the parameters are automatically escaped by the interpolator.

## Using an optional query parameter

A query parameter might be optional.
The `uri` interpolator can interpolate `Option`s:

{% tabs 'optional' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
def getUri(limit: Option[Int]): Uri =
  uri"https://example.com/all?limit=$limit"

println(getUri(Some(10)))
// prints: https://example.com/all?limit=100

println(getUri(None))
// prints: https://example.com/all
```
{% endtab %}
{% endtabs %}

Notice that the query parameter disappears entirely when `limit` is `None`.

## Using a sequence as values of a single query parameter

A query parameter can be repeated in a URI to represent a list of values.
For example, the `version` parameter in `?version=1.0.0&version=1.0.1&version=1.1.0` contains 3 values: `1.0.0`, `1.0.1` and `1.1.0`.

To build such query parameter in a URI, you can interpolate a `Seq` (or `List`, `Array`, etc) in a `uri"..."`.

{% tabs 'seq' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc:nest
def getUri(versions: Seq[String]): Uri =
  uri"https://example.com/scala?version=$versions"

println(getUri(Seq("3.2.2")))
// prints: https://example.com/scala?version=3.2.2

println(getUri(Seq("2.13.8", "2.13.9", "2.13.10")))
// prints: https://example.com/scala?version=2.13.8&version=2.13.9&version=2.13.10

println(getUri(Seq.empty))
// prints: https://example.com/scala
```
{% endtab %}
{% endtabs %}
