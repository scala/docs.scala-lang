---
title: How to deserialize JSON to an object?
type: section
description: Parsing JSON to a custom data type
num: 21
previous-page: upickle-access-values
next-page: upickle-serialize
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Parsing vs Deserialization

Parsing with uJson only checks the JSON structure but it does not validate any of the names and types of the fields automatically.
We have to do it by hand.

In comparision, deserialization with uPickle can validate the names and types of the fields in one pass, by transforming a JSON string to some user-specified Scala data type.
In this tutorial, we show how to deserialize to a `Map`, and then to a custom `case class`.

## Deserializing JSON to a Map

Given a type `T`, uPickle can deserialize JSON to a `Map[String, T]`, checking that all fields conform to `T`.

We can for instance, deserialize to a `Map[String, List[Int]]`:

{% tabs 'parsemap' %}
{% tab 'Scala 2 and 3' %}
```scala
val json = """{"primes": [2, 3, 5], "evens": [2, 4, 6]} """
val map: Map[String, List[Int]] = 
  upickle.default.read[Map[String, List[Int]]](json)

println(map("primes"))
// prints: List(2, 3, 5)
```
{% endtab %}
{% endtabs %}

If a JSON values do not match the expected type, uPickle throws a `upickle.core.AbortException`.

{% tabs 'parsemap-error' %}
{% tab 'Scala 2 and 3' %}
```scala
val json = """{"name": "Peter"} """
upickle.default.read[Map[String, List[Int]]](json)
// throws: upickle.core.AbortException: expected sequence got string at index 9
```
{% endtab %}
{% endtabs %}

### Deserializing JSON to a custom data type

In Scala, you can use a `case class` to define your own data type.
For example, to represent a pet owner with the name of its pets, you can do as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```

To be able to read a `PetOwner` from JSON we need to provide an instance of `ReadWriter[PetOwner]`.
Luckily, `upickle` is able to fully automate that:

{% tabs 'given' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import upickle.default.*

implicit val ownerRw: ReadWriter[PetOwner] = macroRW[PetOwner]
```
Some explanations:
- An `implicit val` is a value that can be automatically provided as an argument to a method or function call, without having to explicitly pass it.
- `macroRW` is a method provided by uPickle that can generate a instances of `ReadWriter` for case classes, using the information about its fields.
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default.*

case class PetOwner(name: String, pets: List[String]) derives ReadWriter
```
The `derives` keyword is used to automatically generate type class instances for case classes and enums.
Using the information about the fields of `PetOwner` it generates a `ReadWriter[PetOwner]`.
{% endtab %}
{% endtabs %}

This means that you can now read (and write) `Foo` objects from JSON with `upickle.default.read(petOwner)`.

Notice that you do not need to pass the instance of `ReadWriter[PetOwner]` explicitly to the `read` method. But it does, nevertheless, get it from the context. You may find more information about contextual abstractions in the [Scala 3 Book](https://docs.scala-lang.org/scala3/book/ca-contextual-abstractions-intro.html).

Putting everything together you should get:

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import upickle.default.*

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW

val json = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](jsonString)

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
val petOwner: PetOwner = read[PetOwner](jsonString)

val firstPet = petOwner.pets.head
println(s"${petOwner.name} has a pet called $firstPet")
// prints: Peter has a pet called Toolkitty
```
{% endtab %}
{% endtabs %}
