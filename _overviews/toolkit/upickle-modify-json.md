---
title: How to modify JSON?
type: section
description: Modifying JSON with uPickle.
num: 18
previous-page: upickle-parse-json
next-page: upickle-deserialize
---

{% include markdown.html path="_markdown/install-upickle.md" %}

`ujson.read` returns a mutable representation of JSON that you can update. Fields and elemnts can be added, modified, or removed.

First you read the JSON string, then you update it in memory, and finally you write it back out again.

{% tabs 'modify' %}
{% tab 'Scala 2 and 3' %}
```scala
// Parse the JSON string
val json: ujson.Value = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")

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
