---
type: chapter
layout: multipage-overview
title: Preliminaries
description: A few things to know about getting started with Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 3
outof: 54
previous-page: prelude-taste-of-scala
next-page: scala-features
---


In this book we assume that you’re familiar with another language like Java, so we don’t spend much time on programming basics. That is, we assume that you’ve seen things like for-loops, classes, and methods before, so we generally only write, “This is how you create a class in Scala,” that sort of thing.

That being said, there are a few good things to know before you read this book.



## Installing Scala

First, to run the examples in this book you’ll need to install Scala on your computer. See our general [Getting Started]({{site.baseurl}}/getting-started/index.html) page for details on how to use Scala (a) in an IDE and (b) from the command line.



## Comments

One good thing to know up front is that comments in Scala are just like comments in Java (and many other languages):

```scala
// a single line comment

/*
 * a multiline comment
 */

/**
 * also a multiline comment
 */
```



## IDEs

The three main IDEs (integrated development environments) for Scala are:

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download)
- [Visual Studio Code](https://code.visualstudio.com)
- [Scala IDE for Eclipse](http://scala-ide.org)



## Naming conventions

Another good thing to know is that Scala naming conventions follow the same “camel case” style as Java:

- Class names: `Person`, `StoreEmployee`
- Variable names: `name`, `firstName`
- Method names: `convertToInt`, `toUpper`









