---
title: How to serialize an object to JSON?
type: section
description: How to write JSON with Scala Toolkit.
num: 20
previous-page: upickle-deserialize
next-page: upickle-files
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Serializing a Map to JSON

UPickle can serialize your Scala objects to JSON, so that you can save them in files or send them through the network.

By default it can serialize any primitive types, such as `Int` or `String`, and standard collections such as `Map` or `List`.

{% tabs 'array' %}
{% tab 'Scala 2 and 3' %}
```scala
val map: Map[String, Int] =
  Map("Toolkitty" -> 3, "Scaniel"   -> 5)
val jsonString: String = upickle.default.write(map)
println(jsonString)
// prints: {"Toolkitty":3,"Scaniel":5}
```
{% endtab %}
{% endtabs %}

## Serializing a custom object to JSON

In Scala, you can use a `case class` to define your own data type.
For example, to represent a pet owner with the name of its pets, you can do as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```

To be able to write a `PetOwner` to JSON we need to provide a `ReadWriter` instance for the case class `PetOwner`.
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

This means that you can now write (and read) `Foo` objects to JSON with `upickle.default.write(petOwner)`.

Notice that you do not need to pass the instance of `ReadWriter[PetOwner]` explicitly to the `write` method. But it does, nevertheless, get it from the context. You may find more information about contextual abstractions in the [Scala 3 Book](https://docs.scala-lang.org/scala3/book/ca-contextual-abstractions-intro.html).

Putting everything together you should get:

{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW

val petOwner = PetOwner("Peter", List("Toolkitty", "Scaniel"))
val json: String = write(petOwner)
println(json)
// prints: {"name":"Peter","pets":["Toolkitty","Scaniel"]}"
``` 
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String]) derives ReadWriter

val petOwner = PetOwner("Peter", List("Toolkitty", "Scaniel"))
val json: String = write(petOwner)
println(json) 
// prints: {"name":"Peter","pets":["Toolkitty","Scaniel"]}"
``` 
{% endtab %}
{% endtabs %}
