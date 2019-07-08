---
layout: multipage-overview
title: Functional Error Handling in Scala
description: This lesson takes a look at error handling with functional programming in Scala.
partof: hello_scala
overview-name: Hello, Scala
num: 53
---


Because functional programming is like algebra, there are no null values or exceptions. But of course you can still have exceptions when you try to access servers that are down or files that are missing, so what can you do? This lesson demonstrates the techniques of functional error handling in Scala.



## Option/Some/None

I already demonstrated one of the techniques to handle errors in Scala: The trio of classes named `Option`, `Some`, and `None`. Instead of writing a method like `toInt` to throw an exception or return a null value, you declare that the method returns an `Option`, in this case an `Option[Int]`:

```scala
def toInt(s: String): Option[Int] = {
    try {
        Some(Integer.parseInt(s.trim))
    } catch {
        case e: Exception => None
    }
}
```

Later in your code you handle the result from `toInt` using `match` and `for` expressions:

```scala
toInt(x) match {
    case Some(i) => println(i)
    case None => println("That didn't work.")
}

val y = for {
    a <- toInt(stringA)
    b <- toInt(stringB)
    c <- toInt(stringC)
} yield a + b + c
```

I discussed these approaches in the “No Null Values” lesson, so I won’t repeat that discussion here.



## Try/Success/Failure

Another trio of classes named `Try`, `Success`, and `Failure` work just like `Option`, `Some`, and `None`, but with two nice features:

- `Try` makes it very simple to catch exceptions
- `Failure` contains the exception message

Here’s the `toInt` method re-written to use these classes. First, you have to import the classes into the current scope:

```scala
import scala.util.{Try,Success,Failure}
```

After that, this is what `toInt` looks like:

```scala
def toInt(s: String): Try[Int] = Try {
    Integer.parseInt(s.trim)
}
```

As you can see, that’s quite a bit shorter than the Option/Some/None approach. The REPL demonstrates how this works. First, the success case:

```scala
scala> val a = toInt("1")
a: scala.util.Try[Int] = Success(1)
```

Second, this is what it looks like when `Integer.parseInt` throws an exception:

```scala
scala> val b = toInt("boo")
b: scala.util.Try[Int] = Failure(java.lang.NumberFormatException: For input string: "boo")
```

As that output shows, the `Failure` that’s returned by `toInt` contains the reason for the failure, i.e., the exception message.

There are quite a few ways to work with the results of a `Try` — including the ability to “recover” from the failure — but common approaches still involve using `match` and `for` expressions:

```scala
toInt(x) match {
    case Success(i) => println(i)
    case Failure(s) => println(s"Failed. Reason: $s")
}

val y = for {
    a <- toInt(stringA)
    b <- toInt(stringB)
    c <- toInt(stringC)
} yield a + b + c
```

Note that when using a for-expression and everything works, it returns the value wrapped in a `Success`:

```scala
scala.util.Try[Int] = Success(6)
```

Conversely, if it fails, it returns a `Failure`:

```scala
scala.util.Try[Int] = Failure(java.lang.NumberFormatException: For input string: "a")
```



## Even more ...

There are other combinations of classes from third party libraries that you can also use to catch and handle exceptions, but Option/Some/None and Try/Success/Failure are my two favorites. You can use whatever you like, but I generally use Try/Success/Failure when dealing with code that can throw exceptions — because I almost always want the exception message — and I use Option/Some/None in other places, such as to avoid using null values.

















