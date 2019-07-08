---
layout: multipage-overview
title: Getting Started
description: How to get started working with Scala.
partof: hello_scala
overview-name: Hello, Scala
num: 3
---


In this book I assume that you’re familiar with another language like Java, so I don’t spend much time on programming basics. That is, I assume that you’ve seen things like for-loops, classes, and methods before, so I generally only write, “This is how you create a class in Scala,” that sort of thing.

That being said, there are a few good things to know before you read this book.



## Download Scala

First, to run the examples in this book you’ll need to download the Scala compiler and runtime environment. You can download it from this URL:

- [scala-lang.org/download/](https://www.scala-lang.org/download/)



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

The two main IDEs (integrated development environments) for Scala are:

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
- [Scala IDE for Eclipse](http://scala-ide.org/)

If you’re just starting with Scala, I recommend starting with the *Scala IDE for Eclipse*. I like both environments, and these days I use IntelliJ IDEA more than Eclipse, but IntelliJ has some occasional quirks that might be frustrating for a beginner.



## Naming conventions

Another good thing to know is that Scala naming conventions follow the same “camel case” style as Java:

- Class names: `Person`, `StoreEmployee`
- Variable names: `name`, `firstName`
- Method names: `convertToInt`, `toUpper`









