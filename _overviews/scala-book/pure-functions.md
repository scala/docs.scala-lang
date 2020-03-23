---
type: section
layout: multipage-overview
title: Pure Functions
description: This lesson provides an introduction to writing pure functions in Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 45
outof: 54
previous-page: functional-programming
next-page: passing-functions-around
---



A first feature Scala offers to help you write functional code is the ability to write pure functions. In [Functional Programming, Simplified](https://alvinalexander.com/scala/functional-programming-simplified-book), Alvin Alexander defines a *pure function* like this:

- The function’s output depends *only* on its input variables
- It doesn’t mutate any hidden state
- It doesn’t have any “back doors”: It doesn’t read data from the outside world (including the console, web services, databases, files, etc.), or write data to the outside world

As a result of this definition, any time you call a pure function with the same input value(s), you’ll always get the same result. For example, you can call a `double` function an infinite number of times with the input value `2`, and you’ll always get the result `4`.



## Examples of pure functions

Given that definition of pure functions, as you might imagine, methods like these in the *scala.math._* package are pure functions:

- `abs`
- `ceil`
- `max`
- `min`

These Scala `String` methods are also pure functions:

- `isEmpty`
- `length`
- `substring`

Many methods on the Scala collections classes also work as pure functions, including `drop`, `filter`, and `map`.



## Examples of impure functions

Conversely, the following functions are *impure* because they violate the definition.

The `foreach` method on collections classes is impure because it’s only used for its side effects, such as printing to STDOUT.

>A great hint that `foreach` is impure is that it’s method signature declares that it returns the type `Unit`. Because it returns nothing, logically the only reason you ever call it is to achieve some side effect. Similarly, *any* method that returns `Unit` is going to be an impure function.

Date and time related methods like `getDayOfWeek`, `getHour`, and `getMinute` are all impure because their output depends on something other than their input parameters. Their results rely on some form of hidden I/O, *hidden input* in these examples.

In general, impure functions do one or more of these things:

- Read hidden inputs, i.e., they access variables and data not explicitly passed into the function as input parameters
- Write hidden outputs
- Mutate the parameters they are given
- Perform some sort of I/O with the outside world



## But impure functions are needed ...

Of course an application isn’t very useful if it can’t read or write to the outside world, so people make this recommendation:

>Write the core of your application using pure functions, and then write an impure “wrapper” around that core to interact with the outside world. If you like food analogies, this is like putting a layer of impure icing on top of a pure cake.

There are ways to make impure interactions with the outside world feel a little more pure. For instance, you’ll hear about things like the `IO` Monad for dealing with user input, files, networks, and databases. But in the end, FP applications have a core of pure functions combined with other functions to interact with the outside world.



## Writing pure functions

Writing pure functions in Scala is one of the simpler parts about functional programming: You just write pure functions using Scala’s method syntax. Here’s a pure function that doubles the input value it’s given:

```scala
def double(i: Int): Int = i * 2
```

Although recursion isn’t covered in this book, if you like a good “challenge” example, here’s a pure function that calculates the sum of a list of integers (`List[Int]`):

```scala
def sum(list: List[Int]): Int = list match {
    case Nil => 0
    case head :: tail => head + sum(tail)
}
```

Even though we haven’t covered recursion, if you can understand that code, you’ll see that it meets my definition of a pure function.



## Key points

The first key point of this lesson is the definition of a pure function:

>A *pure function* is a function that depends only on its declared inputs and its internal algorithm to produce its output. It does not read any other values from “the outside world” — the world outside of the function’s scope — and it does not modify any values in the outside world.

A second key point is that real-world applications consist of a combination of pure and impure functions. A common recommendation is to write the core of your application using pure functions, and then to use impure functions to communicate with the outside world.
















