---
title: How to read a JSON?
type: section
description: How to read a JSON with Scala Toolkit.
num: 20
previous-page: upickle-intro
next-page: upickle-read-json-typed
---

{% include markdown.html path="_markdown/install-upickle.md" %}

In Scala Toolkit, it is possible to read a JSON and values inside of it in two ways:
 - First one offers everything you need to quickly extract data from a JSON, without requiring any specific structure. This approach is described in this article. It is a simple and fast way to read JSONs.
 - While the second approach allows you to work with the json in a fully typed code, and even to provide your custom data structures. To discover this approach read the [How to read a JSON to typed structure](({{ site.baseurl }}/overviews/toolkit/upickle-read-json) tutorial. It is more well-suited when you plan on reusing, storing and operating on the structures loaded from jsons.

## Reading JSONs dynamically
If you want to just parse a JSON and access some of its field, you may just use a `ujson` library that is included with Toolkit. 
Function `ujson.read` allows you to read a JSON and access it afterwards. 
You can access the fields in the returned JSON object by just providing their names exactly as you would to a standard function.
Afterwards you have to declare what you expect to be inside the field and extract it, for example `str` extracts field's value as a `String`.
For example, code below prints out `Peter`.
```scala
val jsonString = """{"name": "Peter", "age": 13}"""
val json = ujson.read(jsonString)
println(json("name").str) // Prints out "Peter"
```
You can operate on arrays similarly, accessing the indices as in the example below.
```scala
val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val json = ujson.read(jsonString)
val ownerName = json("name").str
val firstPet = json("pets")(0) .str
println(s"$ownerName has a pet called $firstPet")
```
You can traverse the JSON structure as deeply as you want, to extract the fields you require.

## Extracting values
In the previous example we used the `.str` function on fields to extract a `String` from the field's value.
Similiar operations are available to extract other types of values. Namely:
 - For the `Int`, you can use `.num` function
 - For the `Boolean`, you can use `.bool` function