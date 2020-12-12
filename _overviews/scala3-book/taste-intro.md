---
title: A Taste of Scala
type: chapter
description: This chapter provides a high-level overview of the main features of the Scala 3 programming language.
num: 4
previous-page: why-scala-3
next-page: taste-vars-data-types
---


{% comment %}
- NOTE: This chapter can be called “Scala Tour” if that makes more sense.
- NOTE: I don’t have a section on “New Control Syntax”, I just use that syntax.
- TODO: Discuss “Optional braces / significant indentation” here?
- TODO: Cover functional error handling (Option/Try/Either)
- TODO: Toplevel definitions are not covered here.
{% endcomment %}


This “Taste of Scala” chapter provides a whirlwind tour of the main features of the Scala 3 programming language. After the initial tour in this chapter, the rest of the book provides more details on these features, and the [Reference documentation][reference] provides _many_ more details.

>Throughout this book, you’ll be able to test many of the examples directly on this page. In addition to that, you can also test anything you’d like on [ScalaFiddle.io](https://scalafiddle.io), [Scastie](https://scastie.scala-lang.org), or in the Scala REPL, which is demonstrated shortly.



## Hello, world

A Scala 3 “Hello, world” example goes as follows. First, put this code in a file named _Hello.scala_:

```scala
@main def hello = println("Hello, world")
```

In this code, `hello` is a method — defined with `def`, and declared to be a “main” method with the `@main` annotation — that invokes the `println` method to write the `"Hello, world"` string to standard output (STDOUT).

Next, compile the code with `scalac`:

```sh
$ scalac Hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, so that command creates several files:

```sh
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

Like Java, the _.class_ files are bytecode files, and they’re ready to run in the JVM. Now you can run the main `hello` method with the `scala` command:

```sh
$ scala hello
Hello, world
```

Assuming that worked, congratulations, you just compiled and ran your first Scala application.



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. You start a REPL session by running the `scala` command at your operating system command line, where you’ll see a “welcome” prompt like this:

{% comment %}
TODO: update this when it’s ready
{% endcomment %}
```scala
$ scala
Welcome to Scala 3.0.0 (OpenJDK 64-Bit Server VM, Java 11.0.9).
Type in expressions for evaluation. Or try :help.

scala> _
```

The REPL is a command-line interpreter, so it sits there waiting for you to type something. Now you can type Scala expressions to see how they work:

````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````

As shown in the output, if you don’t assign a variable to the result of an expression, the REPL creates variables named `res0`, `res1`, etc., for you. You can use these variable names in subsequent expressions:

````
scala> val x = res0 * 10
val x: Int = 20
````

Notice that the REPL output also shows the result of your expressions.

You can run all sorts of experiments in the REPL. This example shows how to create and then call a `sum` method:

````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````

As mentioned earlier, if you prefer a browser-based playground environment, you can also use [ScalaFiddle.io](https://scalafiddle.io) or [Scastie.scala-lang.org](https://scastie.scala-lang.org).



