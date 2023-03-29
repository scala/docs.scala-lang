---
title: How to parse JSON from an HTTP response body?
type: section
description: How to read JSON from an HTTP response body?
num: 19
previous-page: sttp-send-file
next-page: sttp-send-json-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}

To read the JSON body of an HTTP response, you can use the integration between uPickle and sttp.
This tutorial teaches how to do it in two steps:
1. Defining your own data type and its uPickle `ReadWriter`
2. Configuring the response of an HTTP request and sending it using sttp

As an example, we are going to use the [Github REST API](https://docs.github.com/en/rest/users) to get information about the octocat user.

## Defining your own data type and its ReadWriter

In Scala, you can use a `case class` to define your own data type.
For example, you can define a user data type like this:
```scala
case class User(login: String, name: String, location: String)
```

To parse a JSON string to a `User`, you need to provide an instance of `upickle.ReadWriter`.
Luckily, uPickle is able to fully automate that and all you have to write is:
{% tabs 'given' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val userRw: ReadWriter[UserInfo] = macroRW
```
Having a `implicit` value of type `ReadWriter[UserInfo]` in the current scope informs uPickle and sttp how to write a JSON string from a `UserInfo`.
The second part of this definition, `macroRW`, automates the instantiation of `ReadWriter` so that you don't have to do it by hand.
{% endtab %}
{% tab 'Scala 3' %}
```scala
case class UserInfo(name: String, location: String, bio: String) derives ReadWriter
```
`derives` keyword will automatically provide the `ReadWriter[PetOwner]` in current scope.
{% endtab %}
{% endtabs %}

The `given` keyword may appear strange at first but it is very powerful.
Having a `given` value of type `ReadWriter[User]` in the current scope informs uPickle and sttp how to parse a JSON string to a `User`.
You can learn more about `given` instances in the [Scala 3 book](https://docs.scala-lang.org/scala3/book/ca-given-using-clauses.html).
The second part of this definition, `macroRW`, automates the instanciation of `ReadWriter` so that we don't have to do it by hand.

## Parsing JSON from the response of an HTTP request
Once you have a `given ReadWriter`, it is possible to parse the JSON response of an HTTP request to your data type.

In sttp the description of how to handle the response is part of the request itself.
Thus, to parse a response from JSON to `User`, you can call `response(asJson[User])` on the request.

Here is the complete program that can fetches some information about the octocat user from Github.

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import sttp.client3._
import sttp.client3.upicklejson._
import upickle.default._

case class User(login: String, name: String, location: String)
implicit val userRw: ReadWriter[UserInfo] = macroRW

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest
  .get(uri"https://api.github.com/users/octocat") 
  .response(asJson[User])
val response = client.send(request) // Send the request and get the response as a User
println(response.body)
// Prints "Right(User(octocat,The Octocat,San Francisco))"
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import sttp.client3._
import sttp.client3.upicklejson._
import upickle.default._

case class User(login: String, name: String, location: String) derives ReadWriter

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest
  .get(uri"https://api.github.com/users/octocat") 
  .response(asJson[User])
val response = client.send(request) // Send the request and get the response as a User
println(response.body)
// Prints "Right(User(octocat,The Octocat,San Francisco))"
```
{% endtab %}
{% endtabs %}



When running the program, the `response.body` contains `User("octocat", "The Octocat", "San Francisco")`.
