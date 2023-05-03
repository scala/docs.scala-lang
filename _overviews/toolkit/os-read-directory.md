---
title: How to read a directory?
type: section
description: Reading a directory's contents with OS-Lib
num: 11
previous-page: os-intro
next-page: os-read-file
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Paths

A fundamental data type in OS-Lib is `os.Path`, representing a path
on the filesystem. An `os.Path` is always an absolute path.

OS-Lib also provides `os.RelPath` (relative paths) and `os.SubPath` (a
relative path which cannot ascend to parent directories).

Typical starting points for making paths are `os.pwd` (the
current working directory), `os.home` (the current user's home
directory), `os.root` (the root of the filesystem), or
`os.temp.dir()` (a new temporary directory).

Paths have a `/` method for adding path segments. For example:

{% tabs 'etc' %}
{% tab 'Scala 2 and 3' %}
```
val etc: os.Path = os.root / "etc"
```
{% endtab %}
{% endtabs %}

## Reading a directory

`os.list` returns the contents of a directory:

{% tabs 'list-etc' %}
{% tab 'Scala 2 and 3' %}
```scala
val entries: Seq[os.Path] = os.list(os.root / "etc")
```
{% endtab %}
{% endtabs %}

Or if we only want subdirectories:

{% tabs 'subdirs' %}
{% tab 'Scala 2 and 3' %}
```scala
val dirs: Seq[os.Path] = os.list(os.root / "etc").filter(os.isDir)
```
{% endtab %}
{% endtabs %}

To recursively descend an entire subtree, change `os.list` to
`os.walk`.  To process results on the fly rather than reading them all
into memory first, substitute `os.walk.stream`.
