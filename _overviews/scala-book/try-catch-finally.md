---
type: section
layout: multipage-overview
title: try/catch/finally Expressions
description: This page shows how to use Scala's try/catch/finally construct, including several complete examples.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 18
outof: 54
previous-page: match-expressions
next-page: classes
---


Like Java, Scala has a try/catch/finally construct to let you catch and manage exceptions. The main difference is that for consistency, Scala uses the same syntax that `match` expressions use: `case` statements to match the different possible exceptions that can occur.



## A try/catch example

Here’s an example of Scala’s try/catch syntax. In this example, `openAndReadAFile` is a method that does what its name implies: it opens a file and reads the text in it, assigning the result to the variable named `text`:

```scala
var text = ""
try {
    text = openAndReadAFile(filename)
} catch {
    case e: FileNotFoundException => println("Couldn't find that file.")
    case e: IOException => println("Had an IOException trying to read that file")
}
```

Scala uses the _java.io.*_ classes to work with files, so attempting to open and read a file can result in both a `FileNotFoundException` and an `IOException`. Those two exceptions are caught in the `catch` block of this example.



## try, catch, and finally

The Scala try/catch syntax also lets you use a `finally` clause, which is typically used when you need to close a resource. Here’s an example of what that looks like:

```scala
try {
    // your scala code here
} 
catch {
    case foo: FooException => handleFooException(foo)
    case bar: BarException => handleBarException(bar)
    case _: Throwable => println("Got some other kind of Throwable exception")
} finally {
    // your scala code here, such as closing a database connection
    // or file handle
}
```



## More later

We’ll cover more details about Scala’s try/catch/finally syntax in later lessons, such as in the “Functional Error Handling” lessons, but these examples demonstrate how the syntax works. A great thing about the syntax is that it’s consistent with the `match` expression syntax. This makes your code consistent and easier to read, and you don’t have to remember a special/different syntax.






