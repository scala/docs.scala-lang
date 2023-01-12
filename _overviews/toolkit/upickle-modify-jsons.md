---
title: How to modify JSONs?
type: section
description: How to modify JSONs with Scala Toolkit.
num: 23
previous-page: upickle-write-json
next-page: 
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Modifying jsons
If you want to set, modify or remove fields of a json, you can do it with Scala Toolkit. 
First, you have to load the json. You can either do it from a json loaded to a `String`,
or operate on json generated from Scala values.

## Loading a json text and modyfing it
To read the `json` from text, you can use the `ujson.read` function. 
This function returns an object representing the json that you can operate on. 
Adding new fields and updating their values is done as a simple assignment:
```scala
json("name") = "Peter"
```
The code above would set the `name` field of the object in `json` to `Peter`.
If the field is present, then it will be updated. If not, a new one is created.
Below, you can see an example of all these operations put together. 
The `ujson.write` function allowed us to convert back the json object represention to a `String`.
```scala
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")
json("name") = "Peter"
json("surname") = "Scalinsky"
val jsonString: String = ujson.write(json)
println(jsonString)
//prints "{"name":"Peter","pets":["Toolkitty","Scaniel"],"surname":"Scalinisky"}"
```

## Removing fields
To remove fields from json you need to declare whether you are removing them from an `Object` or an `Array`.
 - To remove a field from an object, you can use the `.obj.remove("name")` function on json object
 - To remove a field from an array, you can use the `.obj.remove(index)` function on json object
 Following the previous example, below you can see how to remove some fields from it.
```scala
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")
json.obj.remove("name") // remove "name" field
json("pets").arr.remove(1) // remove pet with index 1 ("Scaniel")
val jsonString: String = ujson.write(json)
println(jsonString) // prints {"pets":["Toolkitty"]}
```
Above, we first removed the field `name` from the top-level object in the json.
Then, we selected the array `pets` and removed the value with index `1` from it.

## Operating on jsons generated from Scala values
If you want to operate on jsons generate from Scala values (like in the [How to write JSONs]({% link _overviews/toolkit/upickle-write-json.md %}) tutorial), then it is possible as well.
Usually, `upickle.write` operation outputs a `String`. But, if you replace it with `upickle.writeJs`, then it returns a json represention from `ujson`.
Then you can operate on it in the same way as you did in the previous code snippets in this tutorial. For example:
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String])
given ReadWriter[PetOwner] = macroRW
val petOwner = PetOwner("Peter", List("Toolkitty", "Scaniel"))
val json = writeJs[PetOwner](petOwner)
json("surname") = "Scalinsky"
val jsonString = ujson.write(json)
println(jsonString)
//Prints {"name":"Peter","pets":["Toolkitty","Scaniel"],"surname":"Scalinsky"}
```