---
title: How to read JSON from an HTTP response body?
type: section
description: How to construct URLs from variables with Scala Toolkit.
num: 19
previous-page: sttp-send-file
next-page: sttp-send-json-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Json in HTTP response body
If you want to read a JSON body of HTTP response, you can use the integration between two of Toolkit libraries - upickle and sttp.
You can follow the [tutorial on reading jsons to typed structures](({% link _overviews/toolkit/upickle-read-json-typed.md %}) to learn details
about parsing jsons with upickle. However, using it with STTP is simplified and skips part of the steps.

### Defining your own data type to 
In Scala, you can use a `case class` to define your own data type. For example, if you wanted to represent a Person with names of its pets, you could do it as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```
After defining this `case class`, you can read a JSON containing its fields. But first, you need to provide an instance of `ReadWriter` that will tell the library
how to handle this type. Luckily, `upickle` is able to fully automate that and all have to do is:
```scala
given ReadWriter[PetOwner] = macroRW
```
`given` keyword may appear strange at first, but it just says that this value may be used later transparently in your code by some functions that needs a `ReadWriter[PetOwner]`. 
You don't need to think about it for too long, that's the only thing you need to do - as long as this value is available, you will be able to read a JSON that conforms to the type of a `PetOwner`.
The second part of this definition, `macroRW`, automates everything that needs to be done to provide this mechanism capable of reading these JSONs when parsing the request.

## Reading the JSON from response
After preparing the upickle to read your type from request response, you can use the `asJson` function as parameter to `response` method on `Request` to specify what type you expect to be in the request.
```scala
import sttp.client3._
import sttp.client3.upicklejson._
import upickle.default._

case class PetOwner(name: String, pets: List[String])
given ReadWriter[PetOwner] = macroRW

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest
    .get(uri"https://example.com/petowner") 
    .response(asJson[PetOwner])
val response = client.send(request) // send the request and get the response
println(response.body) // print the pet of the response
``` 

