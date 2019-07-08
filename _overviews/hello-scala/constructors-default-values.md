---
layout: multipage-overview
title: Supplying Default Values for Constructor Parameters
description: This page shows how to provide default values for Scala constructor parameters, with several examples.
partof: hello_scala
overview-name: Hello, Scala
num: 21
---


A convenient Scala feature is that you can supply default values for constructor parameters. In the previous lessons I showed that you can define a `Socket` class like this:

```scala
class Socket(var timeout: Int, var linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}
```

That’s nice, but you can make this class even better by supplying default values for the `timeout` and `linger` parameters:

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

This is what those examples look like in the REPL:

```scala
scala> new Socket()
res0: Socket = timeout: 2000, linger: 3000

scala> new Socket(1000)
res1: Socket = timeout: 1000, linger: 3000

scala> new Socket(4000, 6000)
res2: Socket = timeout: 4000, linger: 6000
```


## Bonus: Named parameters

Another nice thing about Scala is that you can used named parameters when creating a new instance of a class. For instance, given this class:

```scala
class Socket(var timeout: Int, var linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}
```

you can create a new `Socket` like this:

```scala
val s = new Socket(timeout=2000, linger=3000)
```

I rarely use this feature, but it comes in handy every once in a while, especially when all of the class constructor parameters have the same type, such as `Int` in this example. For example, some people find that this code:

```scala
val s = new Socket(timeout=2000, linger=3000)
```

is more readable than this code:

```scala
val s = new Socket(2000, 3000)
```









