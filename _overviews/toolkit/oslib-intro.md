---
title: Working with files and processes with OS-Lib
type: chapter
description: The introduction of the OS-lib library
num: 13
previous-page: munit-what-else
next-page: oslib-read-directory
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## What is OS-Lib?

OS-Lib is a library for manipulating files and processes. It is part of the Scala Toolkit.

OS-Lib aims to replace the `java.nio.file` and `java.lang.ProcessBuilder` APIs. You should not need to use any underlying Java APIs directly.

OS-lib also aims to supplant the older `scala.io` and `scala.sys` APIs in the Scala standard library.

OS-Lib has no dependencies.

All of OS-Lib is in the `os.*` namespace.
