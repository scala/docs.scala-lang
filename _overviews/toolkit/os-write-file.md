---
title: How to write a file?
type: section
description: Writing files to disk with OS-Lib
num: 13
previous-page: os-read-file
next-page: os-run-process
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Writing a file all at once

`os.write` writes the supplied string to a new file:

{% tabs write %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
val path: os.Path = os.temp.dir() / "output.txt"
os.write(path, "hello\nthere\n")
println(os.read.lines(path).size)
// prints: 2
```
{% endtab %}
{% endtabs %}

## Overwriting or appending

`os.write` throws an exception if the file already exists:

{% tabs already-exists %}
{% tab 'Scala 2 and 3' %}
```scala mdoc:crash
os.write(path, "this will fail")
// this exception is thrown:
// java.nio.file.FileAlreadyExistsException
```
{% endtab %}
{% endtabs %}

To avoid this, use `os.write.over` to replace the existing
contents.

You can also use `os.write.append` to add more to the end:

{% tabs append %}
{% tab 'Scala 2 and 3' %}
```scala mdoc
os.write.append(path, "two more\nlines\n")
println(os.read.lines(path).size)
// prints: 4
```
{% endtab %}
{% endtabs %}
