---
title: Hello, World!
type: section
description: This section demonstrates a Scala 3 'Hello, World!' example.
num: 5
previous-page: taste-intro
next-page: taste-repl
---


A Scala 3 “Hello, world!” example goes as follows.
First, put this code in a file named _Hello.scala_:

```scala
@main def hello = println("Hello, world!")
```

In this code, `hello` is a method.
It’s defined with `def`, and declared to be a “main” method with the `@main` annotation.
It prints the `"Hello, world!"` string to standard output (STDOUT) using the `println` method.

Next, compile the code with `scalac`:

```bash
$ scalac Hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, so that command creates several files:

```bash
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

Like Java, the _.class_ files are bytecode files, and they’re ready to run in the JVM.

Now you can run the `hello` method with the `scala` command:

```bash
$ scala hello
Hello, world!
```

Assuming that worked, congratulations, you just compiled and ran your first Scala application.

> More information about sbt and other tools that make Scala development easier can be found in the [Scala Tools][scala_tools] chapter.

[scala_tools]: {% link _overviews/scala3-book/scala-tools.md %}


