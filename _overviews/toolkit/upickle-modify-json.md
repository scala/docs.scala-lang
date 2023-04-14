---
title: How to modify JSON?
type: section
description: Modifying JSON with uPickle.
num: 18
previous-page: upickle-parse-json
next-page: upickle-deserialize
---

{% include markdown.html path="_markdown/install-upickle.md" %}

The `ujson.read` method creates a mutable representation of JSON that you can update, by adding, modifying or removing any field or element.

First you need to read the JSON string, then you can update it, and finally you can write it back to a String.

{% tabs 'modify' %}
{% tab 'Scala 2 and 3' %}
```scala
// Parse the JSON string
val jsonString: String = """{"name":"John","pets":["Toolkitty","Scaniel"]}"""
val json: ujson.Value = ujson.read(jsonString)

// Update it
json("name") = "Peter"
json("nickname") = "Pete"
json("pets").arr.remove(1)

// Write it back to a String
val result: String = ujson.write(json)
println(result)
// prints: {"name":"Peter","pets":["Toolkitty"],"nickname":"Pete"}
```
{% endtab %}
{% endtabs %}
