---
title: How to deserialize JSON to an object?
type: section
description: Parsing JSON to a custom data type
num: 19
previous-page: json-modify
next-page: json-serialize
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Parsing vs. deserialization

Parsing with uJson only accepts valid JSON, but it does not validate that the names and types of fields are as expected.

Deserialization, on the other hand, transforms a JSON string to some user-specified Scala data type, if required fields are present and have the correct types.

In this tutorial, we show how to deserialize to a `Map` and also to a custom `case class`.

## Deserializing JSON to a `Map`

For a type `T`, uPickle can deserialize JSON to a `Map[String, T]`, checking that all fields conform to `T`.

We can for instance, deserialize to a `Map[String, List[Int]]`:

{% tabs 'parsemap' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
val json = """{"primes": [2, 3, 5], "evens": [2, 4, 6]} """
val map: Map[String, List[Int]] =
  upickle.default.read[Map[String, List[Int]]](json)

println(map("primes"))
// prints: List(2, 3, 5)
```
{% endtab %}
{% endtabs %}

If a value is the wrong type, uPickle throws a `upickle.core.AbortException`.

{% tabs 'parsemap-error' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc:reset:crash
val json = """{"name": "Peter"} """
upickle.default.read[Map[String, List[Int]]](json)
// throws: upickle.core.AbortException: expected sequence got string at index 9
```
{% endtab %}
{% endtabs %}

### Deserializing JSON to a custom data type

In Scala, you can use a `case class` to define your own data type.
For example, to represent a pet owner, you might:
```scala mdoc:reset
case class PetOwner(name: String, pets: List[String])
```

To read a `PetOwner` from JSON, we must provide a `ReadWriter[PetOwner]`.
uPickle can do that automatically:

{% tabs 'given' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import upickle.default._

implicit val ownerRw: ReadWriter[PetOwner] = macroRW[PetOwner]
```
Some explanations:
- An `implicit val` is a value that can be automatically provided as an argument to a method or function call, without having to explicitly pass it.
- `macroRW` is a method provided by uPickle that can generate a instances of `ReadWriter` for case classes, using the information about its fields.
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default.*

case class PetOwner(name: String, pets: List[String])
  derives ReadWriter
```
The `derives` keyword is used to automatically generate given instances.
Using the compiler's knowledge of the fields in `PetOwner`, it generates a `ReadWriter[PetOwner]`.
{% endtab %}
{% endtabs %}

This means that you can now read (and write) `PetOwner` objects from JSON with `upickle.default.read(petOwner)`.

Notice that you do not need to pass the instance of `ReadWriter[PetOwner]` explicitly to the `read` method. But it does, nevertheless, get it from the context, as "given" value. You may find more information about contextual abstractions in the [Scala 3 Book](https://docs.scala-lang.org/scala3/book/ca-contextual-abstractions-intro.html).

Putting everything together you should get:

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc:reset
import upickle.default._

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW

val json = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](json)

val firstPet = petOwner.pets.head
println(s"${petOwner.name} has a pet called $firstPet")
// prints: Peter has a pet called Toolkitty
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default.*

case class PetOwner(name: String, pets: List[String]) derives ReadWriter

val json = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](json)

val firstPet = petOwner.pets.head
println(s"${petOwner.name} has a pet called $firstPet")
// prints: Peter has a pet called Toolkitty
```
{% endtab %}
{% endtabs %}
