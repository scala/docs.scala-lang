---
title: Handling JSON with uPickle
type: chapter
description: Description of the uPickle library.
num: 19
previous-page: oslib-what-else
next-page: upickle-access-values
---

{% include markdown.html path="_markdown/install-upickle.md" %}

uPickle is a lightweight and efficient serialization library for the Scala language.
It comes with uJson, a Scala representation of the JSON data structure.

uJson is a JSON manipulation library.
It allows you to parse a JSON string to a JSON data structure, to access and mutate its values and to write it back to a string.
Or it allows you to create new JSON structures from scatch.

uPickle is a serialization library.
It can serialize and deserialize Scala objects directly to and from JSON strings.
It knows how to handle the Scala collections, such as the `Map` or `Seq`, as well as your custom data types, such as the `case class` and `enum` (Scala 3 only).
