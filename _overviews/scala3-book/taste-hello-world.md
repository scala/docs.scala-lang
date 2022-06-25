---
title: Hello, World!
type: section
description: This section demonstrates a Scala 3 'Hello, World!' example.
num: 5
previous-page: taste-intro
next-page: taste-repl
---

## Your First Scala Program

A Scala 3 “Hello, world!” example goes as follows.
First, put this code in a file named _hello.scala_:

```scala
@main def hello() = println("Hello, world!")
```

In this code, `hello` is a method.
It’s defined with `def`, and declared to be a “main” method with the `@main` annotation.
It prints the `"Hello, world!"` string to standard output (STDOUT) using the `println` method.

Next, compile the code with `scalac`:

```bash
$ scalac hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, so that command creates several files:

```bash
$ ls -1
hello$package$.class
hello$package.class
hello$package.tasty
hello.scala
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

## Ask For User Input

In our next example let's ask for the user's name before we greet them!

There are several ways to read input from a command-line, but a simple way is to use the
`readLine` method in the _scala.io.StdIn_ object. To use it, you need to first import it, like this:

```scala
import scala.io.StdIn.readLine
```

To demonstrate how this works, let’s create a little example. Put this source code in a file named _helloInteractive.scala_:

```scala
import scala.io.StdIn.readLine

@main def helloInteractive() =
  println("Please enter your name:")
  val name = readLine()

  println("Hello, " + name + "!")
```

In this code we save the result of `readLine` to a variable called `name`, we then
use the `+` operator on strings to join `"Hello, "` with `name` and `"!"`, making one single string value. 

> You can learn more about using `val` by reading [Variables and Data Types](/scala3/book/taste-vars-data-types.html).

Then compile the code with `scalac`:

```bash
$ scalac helloInteractive.scala
```
Then run it with `scala helloInteractive`, this time the program will pause after asking for your name,
and wait until you type a name and press return on the keyboard, looking like this:

```bash
$ scala helloInteractive
Please enter your name:
▌
```

When you enter your name at the prompt, the final interaction should look like this:

```bash
$ scala helloInteractive
Please enter your name:
Alvin Alexander
Hello, Alvin Alexander!
```

### A Note about Imports

As you saw in this application, sometimes certain methods, or other kinds of definitions that we'll see later,
are not available unless you use an `import` clause like so:

```scala
import scala.io.StdIn.readLine
```

Imports help you write code in a few ways:
  - you can put code in multiple files, to help avoid clutter, and to help navigate large projects.
  - you can use a code library, perhaps written by someone else, that has useful functionality
  - you can know where a certain definition comes from (especially if it was not written in the current file).

[scala_tools]: {% link _overviews/scala3-book/scala-tools.md %}
