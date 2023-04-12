---
title: How to read a file?
type: section
description: Reading files from disk with OS-Lib
num: 15
previous-page: oslib-read-directory
next-page: oslib-write-file
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Reading a file

Supposing we have the path to a file:

{% tabs 'path' %}
{% tab 'Scala 2 and 3' %}
```
val path: os.Path = os.root / "usr" / "share" / "dict" / "words"
```
{% endtab %}
{% endtabs %}

Then we can slurp the entire file into a string with `os.read`:

{% tabs slurp %}
{% tab 'Scala 2 and 3' %}
```
val content: String = os.read(path)
```
{% endtab %}
{% endtabs %}

To read the file as line at a time, substitute `os.read.lines`.

We can find the longest word in the dictionary:

{% tabs lines %}
{% tab 'Scala 2 and 3' %}
```
val lines: Seq[String]  = os.read.lines(path)
println(lines.maxBy(_.size))
// prints: antidisestablishmentarianism
```
{% endtab %}
{% endtabs %}

There's also `os.read.lines.stream` if you want to process the lines
on the fly rather than read them all into memory at once. For example,
if we just want to read the first line, the most efficient way is:

{% tabs lines-stream %}
{% tab 'Scala 2 and 3' %}
```
val lineStream: geny.Generator[String] = os.read.lines.stream(path)
val firstLine: String = lineStream.head
println(firstLine)
// prints: A
```
{% endtab %}
{% endtabs %}

OS-Lib takes care of closing the file once the generator returned
by `stream` is exhausted.
