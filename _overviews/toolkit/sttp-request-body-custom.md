---
title: How to send a custom object as the body of an HTTP request?
type: section
description: How to make an HTTP request with an object as a body with Scala Toolkit.
num: 22
previous-page: sttp-request-body
next-page: sttp-send-file
---

{% include markdown.html path="_markdown/install-sttp.md" %}

## The case classes
In scala, you can define your objects using case classes.
You could, for example, have a `case class Person` representing a person in your program:
```scala
case class Person(name: String, surname: String)
```
An instance of `Person` is defined by two values: its `name` and `surname`. 

## Custom serializer

To send a value of `Person` as the body of a request, you need to define how to transform it into an HTTP body.
`BodySerializer` comes in handy and allows you to do it once and for all.

{% tabs 'serializer' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import sttp.client3._
implicit val bodySer: BodySerializer[Person] = { (p: Person) =>
  val serialized = s"${p.name},${p.surname}"
  StringBody(serialized, "UTF-8")
}
```
The `implicit` keyword may appear strange at first but is very powerful.
{% endtab %}
{% tab 'Scala 3' %}
```scala
import sttp.client3._
given BodySerializer[Person] = { (p: Person) =>
  val serialized = s"${p.name},${p.surname}"
  StringBody(serialized, "UTF-8")
}
```
The `given` keyword may appear strange at first but is very powerful.
{% endtab %}
{% endtabs %}
It makes the `BodySerializer` available in the current scope, to call the `body` method of an HTTP request and pass it a `Person`.
This serializer converts a `Person` to a `StringBody` by concatenating the `name` and `surname`, separated by a comma. 


## Sending a Person as the body of a request

When you have the `given BodySerializer[Person]` specified, you can just pass the value, of type `Person`, to the `body` method on `basicRequest`. The full code of the solution:

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import sttp.client3._

case class Person(name: String, surname: String)

implicit val bodySer: BodySerializer[Person] = { (p: Person) =>
  val serialized = s"${p.name},${p.surname}"
  StringBody(serialized, "UTF-8")
}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val person = Person("Peter", "Jackson")
val request = basicRequest.post(uri"https://example.com/").body(person) // Define a POST request to https://example.com/, with the person as the body
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import sttp.client3._

case class Person(name: String, surname: String)

given BodySerializer[Person] = { (p: Person) =>
  val serialized = s"${p.name},${p.surname}"
  StringBody(serialized, "UTF-8")
}

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val person = Person("Peter", "Jackson")
val request = basicRequest.post(uri"https://example.com/").body(person) // Define a POST request to https://example.com/, with the person as the body
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}

## Make the `BodySerializer[Person]` globally available

You can make the given `BodySerializer[Person]` globally available by defining it in the companion object of `Person`.

{% tabs 'companion' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
case class Person(name: String, surname: String)

object Person {
  implicit val bodySer: BodySerializer[Person] = { (p: Person) =>
    val serialized = s"${p.name},${p.surname}"
    StringBody(serialized, "UTF-8")
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
case class Person(name: String, surname: String)

object Person {
  given BodySerializer[Person] = { (p: Person) =>
    val serialized = s"${p.name},${p.surname}"
    StringBody(serialized, "UTF-8")
  }
}
```
{% endtab %}
{% endtabs %}

The `BodySerializer[Person]` defined in the companion object of `Person` is globally available.
In any other class or file of your project, you can now pass a `Person` to the `body` method of a request:
```scala
val request = basicRequest.post(uri"https://example.com/").body(person)
```

Learn more in the [sttp documentation chapter about request bodies](https://sttp.softwaremill.com/en/latest/requests/body.html).
