---
title: How to run a process?
type: section
description: Starting external subprocesses with OS-Lib
num: 16
previous-page: oslib-read-directory
next-page: 
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Starting an external process

To set up a process, use `os.proc`, then to actually start it,
`call()`:

{% tabs 'touch' %}
{% tab 'Scala 2 and 3' %}
```
scala> val path = os.temp.dir() / "output.txt"
val path: os.Path = /var/folders/dr4f...q5yj/output.txt

scala> os.exists(path)
val res0: Boolean = false

scala> os.proc("touch", path).call()
val res1: os.CommandResult =
Result of touch…: 0

scala> os.exists(path)
val res2: Boolean = true
```
{% endtab %}
{% endtabs %}

Note that `proc` accepts both strings and `Path`s.

## Reading the output of a process

Above we saw that `call()` returned an `os.CommandResult`. We can
access the result's entire output with `out.text()`, or as lines
with `out.lines()`.

For example, we could use `bc` to do some math for us:

{% tabs 'bc' %}
{% tab 'Scala 2 and 3' %}
```
scala> os.proc("bc", "-e", "2 + 2").call()
     |   .out.text().trim.toInt
val res20: Int = 4
```
{% endtab %}
{% endtabs %}

Or have `cal` show us a calendar:

{% tabs 'cal' %}
{% tab 'Scala 2 and 3' %}
```
scala> os.proc("cal", "-h", "2", "2023").call()
     |   .out.lines().foreach(println)
   February 2023
Su Mo Tu We Th Fr Sa
          1  2  3  4
...
```
{% endtab %}
{% endtabs %}

## Customizing the process

`call()` takes various optional arguments, too many to explain
individually here. For example, you can set environment variables
(`env = ...`), or redirect input and output (`stdin = ...`, `stdout =
...`, `stderr = ...`).

## Next steps

For more complete information on OS-Lib, see [OS-Lib on GitHub](https://github.com/com-lihaoyi/os-lib).

See also Chapter 7 of Li Haoyi's book [_Hands-On Scala Programming_](https://www.handsonscala.com). (Li Haoyi is the author of OS-Lib.)
