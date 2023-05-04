---
title: What else can uPickle do?
type: section
description: An incomplete list of features of uPickle
num: 22
previous-page: json-files
next-page: http-client-intro
---

{% include markdown.html path="_markdown/install-upickle.md" %}
## Construct a new JSON structure with uJson

{% tabs construct%}
{% tab 'Scala 2 and Scala 3' %}
```scala mdoc
val obj: ujson.Value = ujson.Obj(
  "library" -> "upickle",
  "versions" -> ujson.Arr("1.6.0", "2.0.0", "3.1.0"),
  "documentation" -> "https://com-lihaoyi.github.io/upickle/",
)
```
{% endtab %}
{% endtabs %}

Learn more about constructing JSON in the [uJson documentation](https://com-lihaoyi.github.io/upickle/#Construction).

## Defining custom JSON serialization

You can customize the `ReadWriter` of your data type by mapping the `ujson.Value`, like this:

{% tabs custom-serializer class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
import upickle.default._

case class Bar(i: Int, s: String)

object Bar {
  implicit val barReadWriter: ReadWriter[Bar] = readwriter[ujson.Value]
    .bimap[Bar](
      x => ujson.Arr(x.s, x.i),
      json => new Bar(json(1).num.toInt, json(0).str)
    )
}

val bar = Bar(5, "bar")
val json = upickle.default.write(bar)
println(json)
// prints: [5, "bar"]
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default.*

case class Bar(i: Int, s: String)

object Bar:
  given ReadWriter[Bar] = readwriter[ujson.Value]
    .bimap[Bar](
      x => ujson.Arr(x.s, x.i),
      json => new Bar(json(1).num.toInt, json(0).str)
    )

val bar = Bar(5, "bar")
val json = upickle.default.write(bar)
println(json)
// prints: [5, "bar"]
```
{% endtab %}
{% endtabs %}

Learn more about custom JSON serialization in the [uPickle documentation](https://com-lihaoyi.github.io/upickle/#Customization).

