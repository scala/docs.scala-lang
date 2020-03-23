---
type: section
layout: multipage-overview
title: The Map Class
description: This page provides examples of the Scala 'Map' class, including how to add and remove elements from a Map, and iterate over Map elements.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 32
outof: 54
previous-page: vector-class
next-page: set-class
---


The [Map class documentation]({{site.baseurl}}/overviews/collections-2.13/maps.html) describes a `Map` as an iterable sequence that consists of pairs of keys and values. A simple `Map` looks like this:

```scala
val states = Map(
    "AK" -> "Alaska",
    "IL" -> "Illinois",
    "KY" -> "Kentucky"
)
```

Scala has both mutable and immutable `Map` classes. In this lesson we’ll show how to use the *mutable* class.



## Creating a mutable Map

To use the mutable `Map` class, first import it:

```scala
import scala.collection.mutable.Map
```

Then you can create a `Map` like this:

```scala
val states = collection.mutable.Map("AK" -> "Alaska")
```



## Adding elements to a Map

Now you can add a single element to the `Map` with `+=`, like this:

```scala
states += ("AL" -> "Alabama")
```

You also add multiple elements using `+=`:

```scala
states += ("AR" -> "Arkansas", "AZ" -> "Arizona")
```

You can add elements from another `Map` using `++=`:

```scala
states ++= Map("CA" -> "California", "CO" -> "Colorado")
```

The REPL shows how these examples work:

```scala
scala> val states = collection.mutable.Map("AK" -> "Alaska")
states: scala.collection.mutable.Map[String,String] = Map(AK -> Alaska)

scala> states += ("AL" -> "Alabama")
res0: states.type = Map(AL -> Alabama, AK -> Alaska)

scala> states += ("AR" -> "Arkansas", "AZ" -> "Arizona")
res1: states.type = Map(AZ -> Arizona, AL -> Alabama, AR -> Arkansas, AK -> Alaska)

scala> states ++= Map("CA" -> "California", "CO" -> "Colorado")
res2: states.type = Map(CO -> Colorado, AZ -> Arizona, AL -> Alabama, CA -> California, AR -> Arkansas, AK -> Alaska)
```



## Removing elements from a Map

You remove elements from a `Map` using `-=` and `--=` and specifying the key values, as shown in the following examples:

```scala
states -= "AR"
states -= ("AL", "AZ")
states --= List("AL", "AZ")
```

The REPL shows how these examples work:

```scala
scala> states -= "AR"
res3: states.type = Map(CO -> Colorado, AZ -> Arizona, AL -> Alabama, CA -> California, AK -> Alaska)

scala> states -= ("AL", "AZ")
res4: states.type = Map(CO -> Colorado, CA -> California, AK -> Alaska)

scala> states --= List("AL", "AZ")
res5: states.type = Map(CO -> Colorado, CA -> California, AK -> Alaska)
```



## Updating Map elements

You update `Map` elements by reassigning their key to a new value:

```scala
states("AK") = "Alaska, A Really Big State"
```

The REPL shows the current `Map` state:

```scala
scala> states("AK") = "Alaska, A Really Big State"

scala> states
res6: scala.collection.mutable.Map[String,String] = Map(CO -> Colorado, CA -> California, AK -> Alaska, A Really Big State)
```



## Traversing a Map

There are several different ways to iterate over the elements in a map. Given a sample map:

```scala
val ratings = Map(
    "Lady in the Water"-> 3.0, 
    "Snakes on a Plane"-> 4.0,
    "You, Me and Dupree"-> 3.5
)
```

a nice way to loop over all of the map elements is with this `for` loop syntax:

```scala
for ((k,v) <- ratings) println(s"key: $k, value: $v")
```

Using a `match` expression with the `foreach` method is also very readable:

```scala
ratings.foreach {
    case(movie, rating) => println(s"key: $movie, value: $rating")
}
```

>The `ratings` map data in this example comes from the old-but-good book, *Programming Collective Intelligence*.



## See also

There are other ways to work with Scala Maps, and a nice collection of Map classes for different needs. See the [Map class documentation]({{site.baseurl}}/overviews/collections-2.13/maps.html) for more information and examples.









