---
title: Handling JSON with UPickle
type: chapter
description: Description of the UPickle library.
num: 19
previous-page: oslib-what-else
next-page: upickle-access-values
---

{% include markdown.html path="_markdown/install-upickle.md" %}

In the Scala Toolkit, there are two ways of reading JSON: the dynamic way and the fully-typed way.
- In the first approach, we can quickly extract data from JSON, without requiring any specific schema.
This approach is described below.
It is simple and fast.
 - In the second approach, you define your own data type, to parse JSON objects into instances of that data type, making sure that all the required fields are defined with the expected types.
 To discover this approach read the ['How to parse JSON to a data type']({% link _overviews/toolkit/upickle-parse-json.md %}).
 It is well-suited when you need to validate the JSON values, to store them or to operate on them in a safe way.
