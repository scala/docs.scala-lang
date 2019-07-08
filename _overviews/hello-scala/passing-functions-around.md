---
layout: multipage-overview
title: Passing Functions Around
description: Like a good functional programming language, Scala lets you use functions just like other variables, including passing them into other functions.
partof: hello_scala
overview-name: Hello, Scala
num: 48
---



While every programming language ever created probably lets you write pure functions, a second great FP feature of Scala is that *you can create functions as variables*, just like you create `String` and `Int` variables. This feature has many benefits, the most common of which is that it lets you pass functions as parameters into other functions. You saw that earlier in this book when I demonstrated the `map` and `filter` methods:

```scala
val nums = (1 to 10).toList

val doubles = nums.map(_ * 2)
val lessThanFive = nums.filter(_ < 5)
```

In those examples I pass anonymous functions into `map` and `filter`.

In the lesson on anonymous functions I demonstrated that this example:

```scala
val doubles = nums.map(_ * 2)
```

is the same as passing a regular function into `map`:

```scala
def double(i: Int): Int = i * 2   //a method that doubles an Int
val doubles = nums.map(double)
```

As those examples show, Scala clearly lets you pass anonymous functions and regular functions into other methods. This is a powerful feature that good FP languages provide.

>If you like technical terms, a function that takes another function as an input parameter is known as a *Higher-Order Function* (HOF). (And if you like humor, as someone once wrote, that’s like saying that a class that takes an instance of another class as a constructor parameter is a Higher-Order Class.)



## Function or method?

Scala has [a special “function” syntax](https://alvinalexander.com/scala/fp-book-diffs-val-def-scala-functions), but as a practical matter very few people seem to use it. I think this is because of two reasons:

- That function syntax can be hard to read
- You can use `def` methods just like they are functions

What I mean by that second statement is that when you define a method with `def` like this:

```scala
def double(i: Int): Int = i * 2
```

you can then pass `double` around as if it were a variable, like this:

```scala
val x = ints.map(double)
                 ------
```

Even though I define `double` as a method, Scala lets you treat it as a function. 

The ability to pass functions around as variables is a distinguishing feature of functional programming languages. And as you’ve seen in `map` and `filter` examples in this book, the ability to pass functions as parameters into other functions helps you create code that is concise and still readable.



## A few examples

If you’re not comfortable with the process of passing functions as parameters into other functions, here are a few more examples you can experiment with in the REPL:

```scala
List("foo", "bar").map(_.toUpperCase)
List("foo", "bar").map(_.capitalize)
List("adam", "scott").map(_.length)
List(1,2,3,4,5).map(_ * 10)
List(1,2,3,4,5).filter(_ > 2)
List(5,1,3,11,7).takeWhile(_ < 6)
```

Remember that any of those anonymous functions can also be written as “regular” functions, so you can write a function like this:

```scala
def toUpper(s: String): String = s.toUpperCase
```

and then pass it into `map` like this:

```scala
List("foo", "bar").map(toUpper)
```

or this:

```scala
List("foo", "bar").map(s => toUpper(s))
```

Those examples that use a “regular” function are equivalent to these anonymous function examples:

```scala
List("foo", "bar").map(s => s.toUpperCase)
List("foo", "bar").map(_.toUpperCase)
```



## How to write functions that takes functions as parameters

In both the *Scala Cookbook* and *Functional Programming, Simplified* I demonstrate how to *write* methods like `map` and `filter` that take other functions as input parameters. I won’t do that in this book, but when you get to the point where you want to write functions like this, it’s a technique you’ll want to learn.



## See also

If you want to see what Scala’s “function” syntax looks like, see my tutorial, [The differences between `val` and `def` in Scala when creating functions](https://alvinalexander.com/scala/fp-book-diffs-val-def-scala-functions).



