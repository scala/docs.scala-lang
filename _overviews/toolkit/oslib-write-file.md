---
title: How to write a file?
type: section
description: Writing files to disk with OS-Lib
num: 16
previous-page: oslib-read-file
next-page: oslib-run-process
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Writing a file all at once

`os.write` writes the supplied string to a new file:

{% tabs write %}
{% tab 'Scala 2 and 3' %}
```
scala> val path = os.pwd / "output.txt"
val path: os.pwd.ThisType = /Users/tisue/tmp/os-lib/output.txt

scala> os.write(path, "hello\nthere\n")

scala> os.read.lines(path).size
val res1: Int = 2
```
{% endtab %}
{% endtabs %}

## Overwriting or appending

`os.write` throws an exception if the file already exists:

{% tabs already-exists %}
{% tab 'Scala 2 and 3' %}
```
scala> os.write(path, "this will fail")
java.nio.file.FileAlreadyExistsException: /Users/alice/output.txt
```
{% endtab %}
{% endtabs %}

To avoid this, use `os.write.over` to replace the existing
contents.

You can also use `os.write.append` to add more to the end:

{% tabs append %}
{% tab 'Scala 2 and 3' %}
```
scala> os.write.append(path, "two more\nlines\n")

scala> os.read.lines(path).size
val res3: Int = 4
```
{% endtab %}
{% endtabs %}
