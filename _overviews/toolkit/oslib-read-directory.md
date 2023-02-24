---
title: How to read a directory?
type: section
description: Reading a directory's contents with OS-Lib
num: 15
previous-page: oslib-write-file
next-page: oslib-run-process
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Paths

A fundamental data type in OS-Lib is `os.Path`, representing a path
on the filesystem. An `os.Path` is always an absolute path.

OS-Lib also provides `os.RelPath` (relative paths) and `os.SubPath` (a
relative path which is not permitted to ascend to parent directories).

Typical starting points for constructing a path are `os.pwd` (the
current working directory), `os.home` (the current user's home
directory), and `os.root` (the root of the filesystem).

Paths have a `/` method for adding path segments.

## Reading a directory

`os.list` returns the contents of a directory:

{% tabs 'list-etc' %}
{% tab 'Scala 2 and 3' %}
```scala
os.list(os.root / "etc")
```
{% endtab %}
{% endtabs %}

If we are interested only in plain files (and not subdirectories),

{% tabs 'list-etc' %}
{% tab 'Scala 2 and 3' %}
```scala
os.list(os.root / "etc").filter(os.isFile)
```
{% endtab %}
{% endtabs %}

Some sample usages and outputs:

```scala
scala> os.list(os.root / "etc").size
val res18: Int = 77

scala> os.list(os.root / "etc").filter(os.isFile).size
val res19: Int = 56
```

To recursively descend an entire subtree, change `os.list` to
`os.walk`. To process results on the fly rather than reading them
all into memory first, use `os.walk.stream`.

## Next steps

We've seen how to find out what files a directory contains.
The next section of the tutorial shows how to process the
files themselves.
