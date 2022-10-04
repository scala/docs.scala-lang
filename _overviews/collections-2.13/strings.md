---
layout: multipage-overview
title: Strings
partof: collections-213
overview-name: Collections

num: 11
previous-page: arrays
next-page: performance-characteristics

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

Like arrays, strings are not directly sequences, but they can be converted to them, and they also support all sequence operations on strings. Here are some examples of operations you can invoke on strings.

{% tabs strings_1 %}
{% tab 'Scala 2 and 3' for=strings_1 %}

```scala
scala> val str = "hello"
val str: java.lang.String = hello

scala> str.reverse
val res6: String = olleh

scala> str.map(_.toUpper)
val res7: String = HELLO

scala> str.drop(3)
val res8: String = lo

scala> str.slice(1, 4)
val res9: String = ell

scala> val s: Seq[Char] = str
val s: Seq[Char] = hello
```

{% endtab %}
{% endtabs %}

These operations are supported by two implicit conversions. The first, low-priority conversion maps a `String` to a `WrappedString`, which is a subclass of `immutable.IndexedSeq`, This conversion got applied in the last line above where a string got converted into a Seq. The other, high-priority conversion maps a string to a `StringOps` object, which adds all methods on immutable sequences to strings. This conversion was implicitly inserted in the method calls of `reverse`, `map`, `drop`, and `slice` in the example above.
