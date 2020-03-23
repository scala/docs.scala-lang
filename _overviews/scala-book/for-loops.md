---
type: section
layout: multipage-overview
title: for Loops
description: This page provides an introduction to the Scala 'for' loop, including how to iterate over Scala collections.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 15
outof: 54
previous-page: if-then-else-construct
next-page: for-expressions
---


In its most simple use, a Scala `for` loop can be used to iterate over the elements in a collection. For example, given a sequence of integers:

```scala
val nums = Seq(1,2,3)
```

you can loop over them and print out their values like this:

```scala
for (n <- nums) println(n)
```

This is what the result looks like in the Scala REPL:

```scala
scala> val nums = Seq(1,2,3)
nums: Seq[Int] = List(1, 2, 3)

scala> for (n <- nums) println(n)
1
2
3
```

That example uses a sequence of integers, which has the data type `Seq[Int]`. Here’s a list of strings which has the data type `List[String]`:

```scala
val people = List(
    "Bill", 
    "Candy", 
    "Karen", 
    "Leo", 
    "Regina"
)
```

You print its values using a `for` loop just like the previous example:

```scala
for (p <- people) println(p)
```

>`Seq` and `List` are two types of linear collections. In Scala these collection classes are preferred over `Array`. (More on this later.)



## The foreach method

For the purpose of iterating over a collection of elements and printing its contents you can also use the `foreach` method that’s available to Scala collections classes. For example, this is how you use `foreach` to print the previous list of strings:

```scala
people.foreach(println)
```

`foreach` is available on most collections classes, including sequences, maps, and sets.



## Using `for` and `foreach` with Maps

You can also use `for` and `foreach` when working with a Scala `Map` (which is similar to a Java `HashMap`). For example, given this `Map` of movie names and ratings:

```scala
val ratings = Map(
    "Lady in the Water"  -> 3.0, 
    "Snakes on a Plane"  -> 4.0, 
    "You, Me and Dupree" -> 3.5
)
```

You can print the movie names and ratings using `for` like this:

```scala
for ((name,rating) <- ratings) println(s"Movie: $name, Rating: $rating")
```

Here’s what that looks like in the REPL:

```scala
scala> for ((name,rating) <- ratings) println(s"Movie: $name, Rating: $rating")
Movie: Lady in the Water, Rating: 3.0
Movie: Snakes on a Plane, Rating: 4.0
Movie: You, Me and Dupree, Rating: 3.5
```

In this example, `name` corresponds to each *key* in the map, and `rating` is the name that’s assigned to each *value* in the map.

You can also print the ratings with `foreach` like this:

```scala
ratings.foreach {
    case(movie, rating) => println(s"key: $movie, value: $rating")
}
```




