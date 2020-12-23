---
title: Functions Are Values
type: section
description: This section looks at the use of functions as values in functional programming.
num: 44
previous-page: fp-pure-functions
next-page: fp-functional-error-handling
---


While every programming language ever created probably lets you write pure functions, a second important Scala FP feature is that *you can create functions as values*, just like you create `String` and `Int` values.

This feature has many benefits, the most common of which are (a) you can define methods to accept function parameters, and (b) you can pass functions as parameters into methods.
You’ve seen this in multiple places in this book, whenever methods like `map` and `filter` are demonstrated:

```scala
val nums = (1 to 10).toList

val doubles = nums.map(_ * 2)           // double each value
val lessThanFive = nums.filter(_ < 5)   // List(1,2,3,4)
```

In those examples, anonymous functions are passed into `map` and `filter`.

> Anonymous functions are also known as *lambdas*.

In addition to passing anonymous functions into `filter` and `map`, you can also supply them with *methods*:

```scala
// two methods
def double(i: Int): Int = i * 2
def underFive(i: Int): Boolean = i < 5

// pass those methods into filter and map
val doubles = nums.filter(underFive).map(double)
```

This ability to treat methods and functions as values is a powerful feature that functional programming languages provide.

> Technically, a a function that takes another function as an input parameter is known as a *Higher-Order Function*.
> (If you like humor, as someone once wrote, that’s like saying that a class that takes an instance of another class as a constructor parameter is a Higher-Order Class.)



## Functions, anonymous functions, and methods

As you saw in those examples, this is an anonymous function:

```scala
_ * 2
```

As shown in the [higher-order functions][hofs] discussion, that’s a shorthand version of this syntax:

```scala
(i: Int) => i * 2
```

Functions like these are called “anonymous” because they don’t have names.
If you want to give one a name, just assign it to a variable:

```scala
val double = (i: Int) => i * 2
```

Now you have a named function, one that’s assigned to a variable.
You can use this function just like you use a method:

```scala
double(2)   // 4
```

In most scenarios it doesn’t matter if `double` is a function or a method; Scala lets you treat them the same way.
Behind the scenes, the Scala technology that lets you treat methods just like functions is known as [Eta Expansion][eta].

This ability to seamlessly pass functions around as variables is a distinguishing feature of functional programming languages like Scala.
And as you’ve seen in the `map` and `filter` examples throughout this book, the ability to pass functions into other functions helps you create code that is concise and still readable---*expressive*.

If you’re not comfortable with the process of passing functions as parameters into other functions, here are a few more examples you can experiment with:

```scala
List("bob", "joe").map(_.toUpperCase)   // List(BOB, JOE)
List("bob", "joe").map(_.capitalize)    // List(Bob, Joe)
List("plum", "banana").map(_.length)    // List(4, 6)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)       // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)   // List(A, P, P, L, E, P, E, A, R)

val nums = List(5, 1, 3, 11, 7)
nums.map(_ * 2)         // List(10, 2, 6, 22, 14)
nums.filter(_ > 3)      // List(5, 11, 7)
nums.takeWhile(_ < 6)   // List(5, 1, 3)
nums.sortWith(_ < _)    // List(1, 3, 5, 7, 11)
nums.sortWith(_ > _)    // List(11, 7, 5, 3, 1)

nums.takeWhile(_ < 6).sortWith(_ < _)   // List(1, 3, 5)
```


[hofs]: {% link _overviews/scala3-book/fun-hofs.md %}
[eta]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
