---
title: How to run a process?
type: section
description: Starting external subprocesses with OS-Lib
num: 17
previous-page: oslib-read-directory
next-page: oslib-what-else
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

Above we saw that `call()` returned an `os.CommandResult`. We can
access the result's entire output with `out.text()`, or as lines
with `out.lines()`.

For example, we could use `bc` to do some math for us:

{% tabs 'bc' %}
{% tab 'Scala 2 and 3' %}
```
val text: String =
  os.proc("bc", "-e", "2 + 2").call().out.text()
println(text.trim.toInt)
// prints: 4
```
{% endtab %}
{% endtabs %}

Or have `cal` show us a calendar:

{% tabs 'cal' %}
{% tab 'Scala 2 and 3' %}
```
os.proc("cal", "-h", "2", "2023").call()
  .out.lines().foreach(println)
// prints:
//   February 2023
// Su Mo Tu We Th Fr Sa
//          1  2  3  4
// ...
```
{% endtab %}
{% endtabs %}

(The particular commands in the examples might not exist on all
machines.)

## Customizing the process

`call()` takes various optional arguments, too many to explain
individually here. For example, you can set the working directory
(`cwd = ...`), set environment variables (`env = ...`), or redirect
input and output (`stdin = ...`, `stdout = ...`, `stderr = ...`).
