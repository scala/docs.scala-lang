---
title: How to read and write JSON files?
type: section
description: Reading and writing JSON files using UPickle and OSLib
num: 21
previous-page: json-serialize
next-page: json-what-else
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Read and write raw JSON

To read and write JSON files, you can use uJson and OS-Lib as follows:

{% tabs 'raw' %}
{% tab 'Scala 2 and 3' %}
```scala mdoc:compile-only
// read a JSON file
val json = ujson.read(os.read(os.pwd / "raw.json"))

// modify the JSON content
json("updated") = "now"

//write to a new file
os.write(os.pwd / "raw-updated.json", ujson.write(json))
```
{% endtab %}
{% endtabs %}

## Read and write Scala objects using JSON

To read and write Scala objects to and from JSON files, you can use uPickle and OS-Lib as follows:

{% tabs 'object' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc:compile-only
import upickle.default._

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW

// read a PetOwner from a JSON file
val petOwner: PetOwner = read[PetOwner](os.read(os.pwd / "pet-owner.json"))

// create a new PetOwner
val petOwnerUpdated = petOwner.copy(pets = "Toolkitty" :: petOwner.pets)

// write to a new file
os.write(os.pwd / "pet-owner-updated.json", write(petOwnerUpdated))
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default.*

case class PetOwner(name: String, pets: List[String]) derives ReadWriter

// read a PetOwner from a JSON file
val petOwner: PetOwner = read[PetOwner](os.read(os.pwd / "pet-owner.json"))

// create a new PetOwner
val petOwnerUpdated = petOwner.copy(pets = "Toolkitty" :: petOwner.pets)

// write to a new file
os.write(os.pwd / "pet-owner-updated.json", write(petOwnerUpdated))
```
{% endtab %}
{% endtabs %}

To serialize and deserialize Scala case classes (or enums) to JSON we need an instance of `ReadWriter`.
To understand how uPickle generates it for you, you can read the [*How to deserialize JSON to an object?*](/toolkit/json-deserialize.html) or the [*How to serialize an object to JSON?*](/toolkit/json-serialize.html) tutorials.
