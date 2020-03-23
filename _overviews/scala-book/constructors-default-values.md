---
type: section
layout: multipage-overview
title: Supplying Default Values for Constructor Parameters
description: This page shows how to provide default values for Scala constructor parameters, with several examples.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 21
outof: 54
previous-page: classes-aux-constructors
next-page: methods-first-look
---

Scala lets you supply default values for constructor parameters. For example, in previous lessons we showed that you can define a `Socket` class like this:

```scala
class Socket(var timeout: Int, var linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}
```

That’s nice, but you can make this class better by supplying default values for the `timeout` and `linger` parameters:

```scala
class Socket(var timeout: Int = 2000, var linger: Int = 3000) {
    override def toString = s"timeout: $timeout, linger: $linger"
}
```

By supplying default values for the parameters, you can now create a new `Socket` in a variety of different ways:

```scala
new Socket()
new Socket(1000)
new Socket(4000, 6000)
```

Here’s what those examples look like in the REPL:

```scala
scala> new Socket()
res0: Socket = timeout: 2000, linger: 3000

scala> new Socket(1000)
res1: Socket = timeout: 1000, linger: 3000

scala> new Socket(4000, 6000)
res2: Socket = timeout: 4000, linger: 6000
```


### Benefits

Supplying default constructor parameters has at least two benefits:

- You provide preferred, default values for your parameters
- You let consumers of your class override those values for their own needs

As shown in the examples, a third benefit is that it lets consumers construct new `Socket` instances in at least three different ways, as if it had three class constructors.



## Bonus: Named parameters

Another nice thing about Scala is that you can use named parameters when creating a new instance of a class. For instance, given this class:

```scala
class Socket(var timeout: Int, var linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}
```

you can create a new `Socket` like this:

```scala
val s = new Socket(timeout=2000, linger=3000)
```

This feature comes in handy from time to time, such as when all of the class constructor parameters have the same type, such as the `Int` parameters in this example. For example, some people find that this code:

```scala
val s = new Socket(timeout=2000, linger=3000)
```

is more readable than this code:

```scala
val s = new Socket(2000, 3000)
```









