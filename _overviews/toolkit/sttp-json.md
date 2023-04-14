---
title: How to send and receive JSON?
type: section
description: How to send JSON in a request and to parse JSON from the response.
num: 27
previous-page: sttp-request-body
next-page: sttp-upload-file
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## HTTP and JSON

JSON is common format to send and receive data through HTTP, in the request and response bodies.

In the examples below, We use the [Github REST API](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28).
You will need a secret [Github authentication token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to run the programs.
Do not share this token with anyone and do not paste it online!

## Sending and receiving JSON

To send JSON in a request and parse JSON from a response we use sttp in combination with uJson.

### Sending JSON

To send JSON, you can construct a `uJson.Value` and write it as a string in the body of the request.

In the following example we use [Github users endpoint](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28) to update the profile of the authenticated user.
We provide the new location and bio of the profile in a JSON object.

{% tabs 'json' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val json = ujson.Obj(
  "location" -> "hometown",
  "bio" -> "Scala programmer"
)

val response = quickRequest
  .patch(uri"https://api.github.com/user")
  .auth.bearer(sys.env("GITHUB_TOKEN"))
  .header("Content-Type", "application/json")
  .body(ujson.write(json))
  .send()

println(response.code)
// prints: 200

println(response.body)
// prints the full updated profile in JSON
```
{% endtab %}
{% endtabs %}

To run the program, you need to define the  `GITHUB_TOKEN` environment variable.
After running it, you should see your new bio and location on your Github profile.

### Parsing JSON from the response

To parse JSON from the response of a request, you can use `ujson.read`.

Again we use the Github user endpoint, this time to get the authenticated user.

{% tabs 'json-2' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val response = quickRequest
  .get(uri"https://api.github.com/user")
  .auth.bearer(sys.env("GITHUB_TOKEN"))
  .send()

val json = ujson.read(response.body)

println(json("login").str)
// prints your login
```
{% endtab %}
{% endtabs %}

To run the program, you need to define the `GITHUB_TOKEN` environment variable.
Running the program should print your own login.

## Sending and receiving Scala objects using JSON

Alternatively, you can use uPickle to send or receive Scala objects using JSON.
Read the following to learn [*How to serialize an object to JSON*](/toolkit/upickle-serialize) and [*How to deserialize JSON to an object*](/toolkit/upickle-deserialize).


