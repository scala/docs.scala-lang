---
title: The REPL
type: section
description: This section provides an introduction to the Scala REPL.
num: 6
previous-page: taste-hello-world
next-page: taste-vars-data-types
---


The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code.
You start a REPL session by running the `scala` command at your operating system command line, where you’ll see a “welcome” prompt like this:

```bash
$ scala
Welcome to Scala 3.0.0 (OpenJDK 64-Bit Server VM, Java 11.0.9).
Type in expressions for evaluation.
Or try :help.

scala> _
```

The REPL is a command-line interpreter, so it sits there waiting for you to type something.
Now you can type Scala expressions to see how they work:

````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````

As shown in the output, if you don’t assign a variable to the result of an expression, the REPL creates variables named `res0`, `res1`, etc., for you.
You can use these variable names in subsequent expressions:

````
scala> val x = res0 * 10
val x: Int = 20
````

Notice that the REPL output also shows the result of your expressions.

You can run all sorts of experiments in the REPL.
This example shows how to create and then call a `sum` method:

````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````

If you prefer a browser-based playground environment, you can also use [scastie.scala-lang.org](https://scastie.scala-lang.org).


