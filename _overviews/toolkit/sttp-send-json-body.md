---
title: How to send JSON as body of an HTTP request?
type: section
description: How to construct URLs from variables with Scala Toolkit.
num: 20
previous-page: sttp-receive-json-body
next-page: upickle-intro
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## Json in HTTP response body
If you want to send JSON as a body of HTTP response, you can use the integration between two of Toolkit libraries - upickle and sttp.
You can follow the [tutorial on writing JSONs](({% link _overviews/toolkit/upickle-write-json.md %}) to learn details
about writing jsons with upickle. However, using it with STTP is simplified and skips part of the steps.

### Defining your own data type to 
In Scala, you can use a `case class` to define your own data type. For example, if you wanted to represent a Person with names of its pets, you could do it as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```
After defining this `case class`, you can output a JSON containing its fields. But first, you need to provide an instance of `ReadWriter` that will tell the library
how to handle this type. Luckily, `upickle` is able to fully automate that and all have to do is:
```scala
given ReadWriter[PetOwner] = macroRW
```
`given` keyword may appear strange at first, but it just says that this value may be used later transparently in your code by some functions that needs a `ReadWriter[PetOwner]`. 
You don't need to think about it for too long, that's the only thing you need to do - as long as this value is available, you will be able to write a value of type `PetOwner` to JSON.
The second part of this definition, `macroRW`, automates everything that needs to be done to provide this mechanism capable of writing these JSONs when generating the request.

## Reading the JSON from response
After preparing the upickle to write your type as the request body, you can just put it in the `body` function as a parameter to send it in the request body.
```scala
import sttp.client3._
import sttp.client3.upicklejson._
import upickle.default._

case class PetOwner(name: String, pets: List[String])
given ReadWriter[PetOwner] = macroRW

val ownerToSend = PetOwner("Peter", List("Toolkitty", "Scalniel"))

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest
    .post(uri"https://example.com/petowner") 
    .body(ownerToSend)
val response = client.send(request) // send the request and get the response
println(response.body) // print the pet of the response
``` 
