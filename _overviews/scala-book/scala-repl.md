---
type: section
layout: multipage-overview
title: The Scala REPL
description: This page shares an introduction to the Scala REPL.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 7
outof: 54
previous-page: hello-world-2
next-page: two-types-variables
---


The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. To start a REPL session, just type `scala` at your operating system command line, and you’ll see this:

```scala
$ scala
Welcome to Scala 2.13.0 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_131).
Type in expressions for evaluation. Or try :help.

scala> _
```

Because the REPL is a command-line interpreter, it just sits there waiting for you to type something. Once you’re in the REPL, you can type Scala expressions to see how they work:

```scala
scala> val x = 1
x: Int = 1

scala> val y = x + 1
y: Int = 2
```

As those examples show, just type your expressions inside the REPL, and it shows the result of each expression on the line following the prompt.


## Variables created as needed

Note that if you don’t assign the result of your expression to a variable, the REPL automatically creates variables that start with the name `res`. The first variable is `res0`, the second one is `res1`, etc.:

```scala
scala> 2 + 2
res0: Int = 4

scala> 3 / 3
res1: Int = 1
```

These are actual variable names that are dynamically created, and you can use them in your expressions:

```scala
scala> val z = res0 + res1
z: Int = 5
```

You’re going to use the REPL a lot in this book, so go ahead and start experimenting with it. Here are a few expressions you can try to see how it all works:

```scala
val name = "John Doe"
"hello".head
"hello".tail
"hello, world".take(5)
println("hi")
1 + 2 * 3
(1 + 2) * 3
if (2 > 1) println("greater") else println("lesser")
```

In addition to the REPL there are a couple of other, similar tools you can use:

- [Scastie](https://scastie.scala-lang.org) is “an interactive playground for Scala” with several nice features, including being able to control build settings and share code snippets
- IntelliJ IDEA has a Worksheet plugin that lets you do the same things inside your IDE
- The Scala IDE for Eclipse also has a Worksheet plugin
- [scalafiddle.io](https://scalafiddle.io) lets you run similar experiments in a web browser

For more information on the Scala REPL, see the [Scala REPL overview]({{site.baseurl}}/overviews/repl/overview.html)







