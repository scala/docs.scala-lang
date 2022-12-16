---
title: How to make an HTTP request with custom objects as a body?
type: section
description: How to make an HTTP request with an object as a body with Scala Toolkit.
num: 17
previous-page: sttp-request-body
next-page: sttp-send-file
---

{% include markdown.html path="_markdown/install-sttp.md" %}


## The case classes
In scala, you can represent structures of data using case classes. You could, for example, have a `case class` representing a Person in your program:
```scala
case class Person(name: String, surname: String)
```
It has two values inside of it, the `name` and `surname`. 

## Custom serializer
If you wanted to send an object of this type as body, you would need to specify a way to convert this object to a request body. `BodySerializer` comes in handy and allows you to do it once and use it implicitly afterwards.

```scala
import sttp.client3._
given personSerializer: BodySerializer[Person] = { (p: Person) =>
    val serialized = s"${p.name},${p.surname}"
    StringBody(serialized, "UTF-8")
}
```
This serializer converts a Person to its name and surname, separated by a comma. `given` keyword may appear strange at first, but it just says that this value may be used later transparently in your code by some functions that needs a `BodySerializer[Person]`. You don't need to think about it for too long, that's the only thing you need to do - as long as this value is available, you will be able to send the Person as a body in a request.

## Sending the Person as a body
When you have the `given personSerializer` specified, you can just pass the value, of type `Person`, to the `.body` method on `basicRequest`. The full code of the solution:

```scala
import sttp.client3._

case class Person(name: String, surname: String)

given personSerializer: BodySerializer[Person] = { (p: Person) =>
    val serialized = s"${p.name},${p.surname}"
    StringBody(serialized, "UTF-8")
}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val person = Person("Peter", "Jackson")
val request = basicRequest.post(uri"https://example.com/").body(person) // Construct post request to an example service - https://example.com/, with the person as a body
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```

Learn more in the [sttp documentation chapter about request bodies](https://sttp.softwaremill.com/en/latest/requests/body.html).