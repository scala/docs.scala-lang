---
type: section
layout: multipage-overview
title: Tuples
description: This page is an introduction to the Scala 'tuple' data type, showing examples of how to use tuples in your Scala code.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 38
outof: 54
previous-page: misc
next-page: oop-pizza-example
---


A *tuple* is a neat class that gives you a simple way to store *heterogeneous* (different) items in the same container. For example, assuming that you have a class like this:

```scala
class Person(var name: String)
```

Instead of having to create an ad-hoc class to store things in, like this:

```scala
class SomeThings(i: Int, s: String, p: Person)
```

you can just create a tuple like this:

```scala
val t = (3, "Three", new Person("Al"))
```

As shown, just put some elements inside parentheses, and you have a tuple. Scala tuples can contain between two and 22 items, and they’re useful for those times when you just need to combine a few things together, and don’t want the baggage of having to define a class, especially when that class feels a little “artificial” or phony.

>Technically, Scala 2.x has classes named `Tuple2`, `Tuple3` ... up to `Tuple22`. As a practical matter you rarely need to know this, but it’s also good to know what’s going on under the hood. (And this architecture is being improved in Scala 3.)



## A few more tuple details

Here’s a two-element tuple:

```scala
scala> val d = ("Maggie", 30)
d: (String, Int) = (Maggie,30)
```

Notice that it contains two different types. Here’s a three-element tuple:

```scala
scala> case class Person(name: String)
defined class Person

scala> val t = (3, "Three", new Person("David"))
t: (Int, java.lang.String, Person) = (3,Three,Person(David))
```

There are a few ways to access tuple elements. One approach is to access them by element number, where the number is preceded by an underscore:

```scala
scala> t._1
res1: Int = 3

scala> t._2
res2: java.lang.String = Three

scala> t._3
res3: Person = Person(David)
```

Another cool approach is to access them like this:

```scala
scala> val(x, y, z) = (3, "Three", new Person("David"))
x: Int = 3
y: String = Three
z: Person = Person(David)
```

Technically this approach involves a form of pattern-matching, and it’s a great way to assign tuple elements to variables.



## Returning a tuple from a method

A place where this is nice is when you want to return multiple values from a method. For example, here’s a method that returns a tuple:

```scala
def getStockInfo = {
    // other code here ...
    ("NFLX", 100.00, 101.00)  // this is a Tuple3
}
```

Now you can call that method and assign variable names to the return values: 

```scala
val (symbol, currentPrice, bidPrice) = getStockInfo
```

The REPL demonstrates how this works:

```scala
scala> val (symbol, currentPrice, bidPrice) = getStockInfo
symbol: String = NFLX
currentPrice: Double = 100.0
bidPrice: Double = 101.0
```

For cases like this where it feels like overkill to create a class for the method’s return type, a tuple is very convenient.



## Tuples aren’t collections

Technically, Scala 2.x tuples aren’t collections classes, they’re just a convenient little container. Because they aren’t a collection, they don’t have methods like `map`, `filter`, etc.






