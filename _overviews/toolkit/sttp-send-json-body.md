---
title: How to send JSON as body of an HTTP request?
type: section
description: How to construct URLs from variables with Scala Toolkit.
num: 20
previous-page: sttp-receive-json-body
next-page: upickle-intro
---

{% include markdown.html path="_markdown/install-sttp.md" %}

To send an HTTP request with a JSON body, you can use the integration between uPickle and sttp.
This tutorial teaches how to do it in two steps:
1. Defining your own data type and its uPickle `ReadWriter`
2. Configuring the body of an HTTP request and sending it using sttp

As an example, we are going to write a program that can update the bio on your personal Github account using the [Github REST API](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28).
Beware that you need a secret [Github authentication token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to run the program.
Do not share this token with anyone and do not paste it online.

### Defining your own data type to 
In Scala, you can use a `case class` to define your own data type.
For example, you can describe the information of a Github user like this:
```scala
case class UserInfo(name: String, location: String, bio: String)
```

To create a JSON string from a `UserInfo`, you need to provide an instance of `ReadWriter`
Luckily, `upickle` is able to fully automate that and all you have to write is:
```scala
given ReadWriter[UserInfo] = macroRW
```
The `given` keyword may appear strange at first but it is very powerful.
Having a `given` value of type `ReadWriter[UserInfo]` in the current scope informs uPickle and sttp how to write a JSON string from a `UserInfo`.
You can learn more about `given` instances in the [Scala 3 book](https://docs.scala-lang.org/scala3/book/ca-given-using-clauses.html).
The second part of this definition, `macroRW`, automates the instanciation of `ReadWriter` so that we don't have to do it by hand.

What's more, if you define the given instance of `ReadWriter[UserInfo]` in the companion object of `UserInfo`, it becomes available globally:

```scala
import upickle.default._

case class UserInfo(name: Option[String], location: Option[String], bio: Option[String])

object UserInfo:
  given ReadWriter[UserInfo] = macroRW
```

## Sending an HTTP request with a JSON body of your data type
Once you have a `given ReadWriter`, it is possible to write an instance of your data type as JSON into the body of your HTTP request.

To do so you can call the `body` method and pass it an instance of `UserInfo`.

Here is the complete program that can update the bio on your personnal Github account.

```scala
import sttp.client3._
import sttp.client3.upicklejson._
import upickle.default._

case class UserInfo(name: String, location: String, bio: String)

object UserInfo:
  given ReadWriter[UserInfo] = macroRW

// TODO: replace ??? with your own bio and token
val newBio: String = ???
val token: String = ???

// The information to update. Name and location will not be updated.
val userInfo = UserInfo(name = null, location = null, bio = newBio)

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val request = basicRequest
    .post(uri"https://api.github.com/user")
    .auth.bearer(token)
    .body(userInfo)
val response = client.send(request) // Send the request and get the response
println(response.body) // Print response body
``` 

To try this program locally:
- In `val newBio: String = ???`, replace `???` with your bio in a string. For instance: `"I am a Scala programmer"`.
Or, if you prefer, you can update your location.
- Generate a [Github authentication token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `user` scope.
- In `val token: String = ???` replace `???` with your token.
Do not share this token with anyone and do not paste it online.

After running the program, you should see your new bio on your Github profile.
