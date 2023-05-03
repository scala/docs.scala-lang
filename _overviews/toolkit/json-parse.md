---
title: How to access values inside JSON?
type: section
description: Accessing JSON values using ujson.
num: 17
previous-page: json-intro
next-page: json-modify
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Accessing values inside JSON

To parse a JSON string and access fields inside it, you can use uJson, which is part of uPickle.

The method `ujson.read` parses a JSON string into memory:
{% tabs 'read' %}
{% tab 'Scala 2 and 3' %}
```scala
val jsonString = """{"name": "Peter", "age": 13}"""
val json: ujson.Value  = ujson.read(jsonString)
println(json("name").str)
// prints: Peter
```
{% endtab %}
{% endtabs %}

To access the `"name"` field, we do `json("name")` and then call `str` to type it as a string.

To access the elements by index in a JSON array,

{% tabs 'array' %}
{% tab 'Scala 2 and 3' %}
```scala
val pets: ujson.Value = json("pets")

val firstPet: String = pets(0).str
val secondPet: String = pets(1).str

println(s"The pets are $firstPet and $seconPet")
// prints: The pets are Toolkitty and Scaniel
```
{% endtab %}
{% endtabs %}

You can traverse the JSON structure as deeply as you want, to extract any nested value.
For instance, `json("field1")(0)("field2").str` is the string value of `field2` in the first element of the array in `field1`.

## JSON types

In the previous examples we used `str` to type a JSON value as a string.
Similar methods exist for other types of values, namely:
 - `num` for numeric values, returning `Double`
 - `bool` for boolean values, returning `Boolean`
 - `arr` for arrays, returning a mutable `Buffer[ujson.Value]`
 - `obj` for objects, returning a mutable `Map[String, ujson.Value]`

{% tabs 'typing' %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.collection.mutable

val jsonString = """{"name": "Peter", "age": 13, "pets": ["Toolkitty", "Scaniel"]}"""
val json = ujson.read(jsonString)

val person: mutable.Map[String, ujson.Value] = json.obj
val age: Int = person("age").num
val pets: mutable.Buffer[ujson.Value] = person("pets").arr
```
{% endtab %}
{% endtabs %}

If a JSON value does not conform to the expected type, uJson throws a `ujson.Value.InvalidData` exception.

{% tabs 'exception' %}
{% tab 'Scala 2 and 3' %}
```scala
val name: Boolean = person("name").bool
// throws a ujson.Value.InvalidData: Expected ujson.Bool (data: "Peter")
```
{% endtab %}
{% endtabs %}
