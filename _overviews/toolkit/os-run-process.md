---
title: How to run a process?
type: section
description: Starting external subprocesses with OS-Lib
num: 14
previous-page: os-write-file
next-page: os-what-else
---

{% include markdown.html path="_markdown/install-os-lib.md" %}

## Starting an external process

To set up a process, use `os.proc`, then to actually start it,
`call()`:

{% tabs 'touch' %}
{% tab 'Scala 2 and 3' %}
```
val path: os.Path = os.pwd / "output.txt"
println(os.exists(path))
// prints: false
val result: os.CommandResult = os.proc("touch", path).call()
println(result.exitCode)
// prints: 0
println(os.exists(path))
// prints: true
```
{% endtab %}
{% endtabs %}

Note that `proc` accepts both strings and `os.Path`s.

## Reading the output of a process

(The particular commands in the following examples might not exist on all
machines.)

Above we saw that `call()` returned an `os.CommandResult`. We can
access the result's entire output with `out.text()`, or as lines
with `out.lines()`.

For example, we could use `bc` to do some math for us:

{% tabs 'bc' %}
{% tab 'Scala 2 and 3' %}
```
val result: os.CommandResult = os.proc("bc", "-e", "2 + 2").call()
val text: String = result.out.text()
println(text.trim.toInt)
// prints: 4
```
{% endtab %}
{% endtabs %}

Or have `cal` show us a calendar:

{% tabs 'cal' %}
{% tab 'Scala 2 and 3' %}
```
val result: os.CommandResult = os.proc("cal", "-h", "2", "2023").call()
result.out.lines().foreach(println)
// prints:
//   February 2023
// Su Mo Tu We Th Fr Sa
//          1  2  3  4
// ...
```
{% endtab %}
{% endtabs %}

## Customizing the process

`call()` takes various optional arguments, too many to explain
individually here. For example, you can set the working directory
(`cwd = ...`), set environment variables (`env = ...`), or redirect
input and output (`stdin = ...`, `stdout = ...`, `stderr = ...`).
Find more information about the `call` method on [the README of OS-Lib](https://github.com/com-lihaoyi/os-lib#osproccall).

