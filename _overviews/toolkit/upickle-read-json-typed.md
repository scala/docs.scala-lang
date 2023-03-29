---
title: How to parse a JSON value to a data type?
type: section
description: How to read a JSON to typed structure with Scala Toolkit
num: 21
previous-page: upickle-read-json
next-page: upickle-write-json
---

{% include markdown.html path="_markdown/install-upickle.md" %}

In the Scala Toolkit, there are two ways of reading JSON: the dynamic way and the fully-typed way.
- In the first approach, we can quickly extract data from JSON, without requiring any specific schema.
To discover this approach read the [How to read JSON dynamically]({% link _overviews/toolkit/upickle-read-json.md %}). It is simple and fast.
- In the second approach, you define your own data type, and transform JSON objects into instances of that data type, making sure that all the required fields are defined with valid types.
This approach is described below.
It is well-suited when you need to validate the JSON values, to store them or to operate on them in a safe way.

## Parsing a JSON object to a Map
To type a JSON object into a Scala `Map`, you can use the `upickle` library. 
This approach is safe and convenient for working with structured data.
It allows you to quiclky validate the structure of the JSON string.

{% tabs 'parsemap' %}
{% tab 'Scala 2 and 3' %}
```scala
import upickle.default._
val jsonString = """{"primes": [2, 3, 5], "evens": [2, 4, 6]} """
val map = read[Map[String, List[Int]]](jsonString)
val primes = map("primes")
println(primes.head) // Prints 2
```
{% endtab %}
{% endtabs %}

In this example, we expect the JSON string to contain an object, where each fields's value is an array of numbers.
We call the `upickle.default.read` with the type parameter `Map[String, List[Int]]` to transform the JSON object into a map of this exact type.

If the JSON value does not match the expected type, upickle throws an exception.

### Parsing a JSON object to a custom data type

In Scala, you can use a `case class` to define your own data type.
For example, to represent the pets and their owner, you can do it as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```

To be able to read a `PetOwner` from a JSON we need to provide an instance of `ReadWriter[PetOwner]`.
Luckily, `upickle` is able to fully automate that and all you need to write is:

{% tabs 'given' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val ownerRw: ReadWriter[PetOwner] = macroRW
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
case class PetOwner(name: String, pets: List[String]) derives ReadWriter
```
`derives` keyword will automatically provide the `ReadWriter[PetOwner]` in current scope.
{% endtab %}
{% endtabs %}


Having a `ReadWriter[PetOwner]` in the current scope allows you to ask the `upickle.default.read` method to return a value of `PetOwner`, like this `read[PetOwner](jsonString)`.
As long as the value is available, you will be able to read JSON that conforms to the type of a `PetOwner`.
The second part of this definition, `macroRW`, automates the instanciation of `ReadWriter` so that we don't have to do it by hand.

After this declaration, you can put everything together and read a `PetOwner` from JSON:

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW

val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](jsonString)
val firstPet = petOwner.pets.head
println(s"${petOwner.name} has a pet called $firstPet")
// Prints "Peter has a pet called Toolkitty"
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String]) derives ReadWriter

val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](jsonString)
val firstPet = petOwner.pets.head
println(s"${petOwner.name} has a pet called $firstPet")
// Prints "Peter has a pet called Toolkitty"
```
{% endtab %}
{% endtabs %}