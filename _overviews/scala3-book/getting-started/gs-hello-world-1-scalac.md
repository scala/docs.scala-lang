---
title: “Hello, World” with scalac
description: This page shows how to create and run a “Hello, world” project using the scalac and scala commands.
---

If you installed the Scala compiler on your computer — such as [with Coursier](gs-install-coursier.md) — you can use the following steps to create, compile, and run a “Hello, world” example with the `scalac` and `scala` commands.

First, create a new directory for your code, and move into that directory:

```sh
$ mkdir HelloWorld
$ cd HelloWorld
```

Next, create a file named *Hello.scala*, and put this line of code in that file:

```scala
@main def hello = println("Hello, world")
```

Now compile that file with `scalac`:

```sh
$ scalac Hello.scala
```

The run the `hello` method with `scala`:

```sh
$ scala hello
Hello, world
```

Assuming that worked — congratulations. You just created a Scala 3 application, compiled it with `scalac`, and ran it with the `scala` command.



## Discussion

This line of code creates a Scala 3 “main” method named `hello` that runs the `println` statement shown:

```scala
@main def hello = println("Hello, world")
```

That’s the entire application.

When you compile this little application with `scalac`, it creates these output files, which you can see with an `ls` command on macOS and Linux systems:

```sh
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

Then when you run the `hello` method with `scala`, it uses the *.class* files to produce this output:

```sh
$ scala hello
Hello, world
```

If you’ve used Java before, the `scalac` and `scala` commands are analogous to Java’s `javac` and `java` commands.



## Use a build tool

This is a nice way to show how things work with one source code file, but once you start creating Scala projects you’ll have *many* source code files in different directories. When that happens you’ll want to use a “build tool” like *sbt*, which is demonstrated next.




