---
title: How to read JSON dynamically?
type: section
description: How to read JSON with the Scala Toolkit.
num: 20
previous-page: upickle-intro
next-page: upickle-read-json-typed
---

{% include markdown.html path="_markdown/install-upickle.md" %}

In the Scala Toolkit, there are two ways of reading JSON: the dynamic way and the fully-typed way.
- In the first approach, we can quickly extract data from JSON, without requiring any specific schema.
This approach is described below.
It is simple and fast.
 - In the second approach, you define your own data type, to parse JSON objects into instances of that data type, making sure that all the required fields are defined with the expected types.
 To discover this approach read the [How to parse a JSON value to a data type]({% link _overviews/toolkit/upickle-read-json-typed.md %}).
 It is well-suited when you need to validate the JSON values, to store them or to operate on them in a safe way.

## Reading JSON dynamically
If you want to parse a JSON object and access some of its field, you can use the uJson library, which is brought by uPickle.

The method `ujson.read` can parse a JSON string and make all of its fields available.
{% tabs 'read' %}
{% tab 'Scala 2 and 3' %}
```scala
val jsonString = """{"name": "Peter", "age": 13}"""
val json = ujson.read(jsonString)
println(json("name").str) // Prints out "Peter"
```
{% endtab %}
{% endtabs %}

You can access a field by passing its name to the `json` value, and then specifying which type you expect.
If `name` is a field that should contain a string, you can access it using `json("name").str`.

Similarly, you can access an element of an array by passing its indice, as in the example below:
{% tabs 'array' %}
{% tab 'Scala 2 and 3' %}
```scala
val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val json = ujson.read(jsonString)
val ownerName = json("name").str
val firstPet = json("pets")(0).str
println(s"$ownerName has a pet called $firstPet")
```
{% endtab %}
{% endtabs %}
You can traverse the JSON structure as deeply as you want, to extract any nested field.

## Extracting values
In the previous example we used the `str` method on fields to extract a `String` from the field's value.
Similar operations are available to extract other types of values. Namely:
 - `num` for numeric values, it returns an `Int`
 - `bool` for boolean values, it returns a `Boolean`
 - `arr` for arrays
 - `obj` for objects
