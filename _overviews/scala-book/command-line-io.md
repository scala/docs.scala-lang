---
type: section
layout: multipage-overview
title: Command-Line I/O
description: An introduction to command-line I/O in Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 12
outof: 54
previous-page: two-notes-about-strings
next-page: control-structures
---


To get ready to show `for` loops, `if` expressions, and other Scala constructs, let’s take a look at how to handle command-line input and output with Scala.



## Writing output

As we’ve already shown, you write output to standard out (STDOUT) using `println`:

```scala
println("Hello, world")
```

That function adds a newline character after your string, so if you don’t want that, just use `print` instead:

```scala
print("Hello without newline")
```

When needed, you can also write output to standard error (STDERR) like this:

```scala
System.err.println("yikes, an error happened")
```

>Because `println` is so commonly used, there’s no need to import it. The same is true of other commonly-used data types like `String`, `Int`, `Float`, etc.



## Reading input

There are several ways to read command-line input, but the easiest way is to use the `readLine` method in the *scala.io.StdIn* package. To use it, you need to first import it, like this:

```scala
import scala.io.StdIn.readLine
```

To demonstrate how this works, let’s create a little example. Put this source code in a file named *HelloInteractive.scala*:

```scala
import scala.io.StdIn.readLine

object HelloInteractive extends App {

    print("Enter your first name: ")
    val firstName = readLine()

    print("Enter your last name: ")
    val lastName = readLine()

    println(s"Your name is $firstName $lastName")

}
```

Then compile it with `scalac`:

```sh
$ scalac HelloInteractive.scala
```

Then run it with `scala`:

```sh
$ scala HelloInteractive
```

When you run the program and enter your first and last names at the prompts, the interaction looks like this:

```sh
$ scala HelloInteractive
Enter your first name: Alvin
Enter your last name: Alexander
Your name is Alvin Alexander
```


### A note about imports

As you saw in this application, you bring classes and methods into scope in Scala just like you do with Java and other languages, with `import` statements:

```scala
import scala.io.StdIn.readLine
```

That import statement brings the `readLine` method into the current scope so you can use it in the application.









