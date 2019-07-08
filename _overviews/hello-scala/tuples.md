---
layout: multipage-overview
title: Tuples
description: This page is an introduction to the Scala 'tuple' data type, showing examples of how to use tuples in your Scala code.
partof: hello_scala
overview-name: Hello, Scala
num: 38
---


A *tuple* is a neat little class that gives you a simple way to store heterogeneous items in a container. Rather than having to create a class to store things in, like this:

```scala
class SomeThings(i: Int, s: String, p: Person)
```

you can just create a tuple like this:

```scala
val t = (3, "Three", new Person("Al"))
```

As shown, just put some elements inside parentheses, and you have a tuple. Scala tuples can contain between two and 22 items, and I find them useful for those times when I just need to combine a few things together, and I don’t want the baggage of having to define a class, especially when that class feels a little “artificial” or phony.

>Technically, Scala has classes named `Tuple2`, `Tuple3` ... up to `Tuple22`. As a practical matter you rarely need to know this, but I find that it’s also good to know what’s going on under the hood.

Note: Those examples assume you have a `Person` class:

```scala
class Person(var name: String)
```



## A few more details

Here’s a two-element tuple:

```scala
scala> val d = ("Maggie", 30)
d: (String, Int) = (Maggie,30)
```

Notice that it contains two different types. Here’s a three-element tuple:

```scala
scala> case class Person(name: String)
defined class Person

scala> val t = (3, "Three", new Person("Robbie"))
t: (Int, java.lang.String, Person) = (3,Three,Person(Robbie))
```

There are a few ways to access tuple elements. One approach is to access them by element number, where the number is preceded by an underscore:

```scala
scala> t._1
res1: Int = 3

scala> t._2
res2: java.lang.String = Three

scala> t._3
res3: Person = Person(Robbie)
```



## Returning a tuple from a method

Another cool approach is to access them like this:

```scala
scala> val(x, y, z) = (3, "Three", new Person("Robbie"))
x: Int = 3
y: String = Three
z: Person = Person(Al)
```

Technically this approach involves a form of pattern-matching, and it’s a great way to assign tuple elements to variables.

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

I don’t use tuples a great deal, but for cases like this where it feels like overkill to create a class for the method’s return type, I find them convenient.



## Tuples aren’t collections

Technically, tuples aren’t collections classes, they’re just a convenient little container. Because they aren’t a collection, they don’t have methods like `map`, `filter`, etc.








