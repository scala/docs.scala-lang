---
title: How to modify JSONs?
type: section
description: How to modify JSONs with Scala Toolkit.
num: 23
previous-page: upickle-write-json
next-page: 
---

{% include markdown.html path="_markdown/install-upickle.md" %}

The `ujson.read` method creates a mutable representation of JSON that you can update, by adding, modifying or removing any field and element of its JSON objects and arrays.
First you need to read the JSON string, then you can update it, and finally you can write it back to a String.

```scala
// Read the JSON string
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")

// Update it
json("name") = "Peter"
json("surname") = "Scalinsky"
json("pets").arr.remove(1)

// Write it back to a String
val result: String = ujson.write(json)
println(result)
// Prints {"name":"Peter","pets":["Toolkitty"],"surname":"Scalinisky"}
```


## Modifying and adding fields

You can access the field `"name"` with `json("name")` and then assign it a new value with the `=` statement.
If the field does not yet exist, it is added to the JSON object.

```scala
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")
json("name") = "Peter"
json("surname") = "Scalinsky"
```

In the above code example, we change the value of the field `"name"`, from `"John"` to `"Peter"`, and we add a new field `"surname"` with value `"Scalinsky"`.

## Removing fields

To remove a field from a JSON object:
- declare that the JSON value is an object by calling the `obj` method
- call the `remove` method with the name of the field to remove.

```scala
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")
json.obj.remove("name") // Remove "name" field from object
println(ujson.write(json))
```

## Removing elements from arrays

To remove an element from an JSON array:
- declare that the JSON value is an array by calling the `arr` method
- call the `remove` method with the index of the element to remove.

```scala
val json = ujson.read("""{"name":"John","pets":["Toolkitty","Scaniel"]}""")
json("pets").arr.remove(1) // Remove pet at index 1 ("Scaniel")
val jsonString: String = ujson.write(json)
println(jsonString) // Prints {"name":"John","pets":["Toolkitty"]}
```
