---
title: The REPL
type: section
description: This section provides an introduction to the Scala REPL.
languages: [zh-cn]
num: 6
previous-page: taste-hello-world
next-page: taste-vars-data-types
---


The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code.
You start a REPL session by running the `scala` or `scala3` command depending on your installation at your operating system command line, where you’ll see a “welcome” prompt like this:


{% tabs command-line class=tabs-scala-version %}

{% tab 'Scala 2' for=command-line %}
```bash
$ scala
Welcome to Scala {{site.scala-version}} (OpenJDK 64-Bit Server VM, Java 1.8.0_342).
Type in expressions for evaluation. Or try :help.

scala> _
```
{% endtab %}

{% tab 'Scala 3' for=command-line %}
```bash
$ scala
Welcome to Scala {{site.scala-3-version}} (1.8.0_322, Java OpenJDK 64-Bit Server VM).
Type in expressions for evaluation. Or try :help.

scala> _
```
{% endtab %}

{% endtabs %}

The REPL is a command-line interpreter, so it sits there waiting for you to type something.
Now you can type Scala expressions to see how they work:

{% tabs expression-one %}
{% tab 'Scala 2 and 3' for=expression-one %}
````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````
{% endtab %}
{% endtabs %}

As shown in the output, if you don’t assign a variable to the result of an expression, the REPL creates variables named `res0`, `res1`, etc., for you.
You can use these variable names in subsequent expressions:

{% tabs expression-two %}
{% tab 'Scala 2 and 3' for=expression-two %}
````
scala> val x = res0 * 10
val x: Int = 20
````
{% endtab %}
{% endtabs %}

Notice that the REPL output also shows the result of your expressions.

You can run all sorts of experiments in the REPL.
This example shows how to create and then call a `sum` method:

{% tabs expression-three %}
{% tab 'Scala 2 and 3' for=expression-three %}
````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````
{% endtab %}
{% endtabs %}

If you prefer a browser-based playground environment, you can also use [scastie.scala-lang.org](https://scastie.scala-lang.org).

If you prefer writing your code in a text editor instead of in console prompt, you can use a [worksheet].

[worksheet]: {% link _overviews/scala3-book/tools-worksheets.md %}
