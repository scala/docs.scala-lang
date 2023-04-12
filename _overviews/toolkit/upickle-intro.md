---
title: Handling JSON with uPickle
type: chapter
description: Description of the uPickle library.
num: 19
previous-page: oslib-what-else
next-page: upickle-access-values
---

uPickle is a lightweight and efficient serialization library for the Scala language.
It comes with uJson, a JSON manipulation library that can read a JSON string, access or mutate its values, and write it back to a string.

uPickle is a serialization library.
It can serialize and deserialize Scala objects directly to and from JSON strings.
It knows how to handle the Scala collections, such as the `Map` or `Seq`, as well as your custom data types, such as `case class`s and `enum`s (Scala 3 only).

{% include markdown.html path="_markdown/install-upickle.md" %}
