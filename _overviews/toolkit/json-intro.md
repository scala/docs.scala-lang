---
title: Handling JSON with uPickle
type: chapter
description: Description of the uPickle library.
num: 16
previous-page: os-what-else
next-page: json-parse
---

uPickle is a lightweight serialization library for Scala.

It includes uJson, a JSON manipulation library that can parse JSON strings, access or mutate their values in memory, and write them back out again.

uPickle can serialize and deserialize Scala objects directly to and from JSON. It knows how to handle the Scala collections such as `Map` and `Seq`, as well as your own data types, such as `case class`s and Scala 3 `enum`s.

{% include markdown.html path="_markdown/install-upickle.md" %}
