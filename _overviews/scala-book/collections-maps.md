---
type: section
layout: multipage-overview
title: Common Map Methods
description: This page shows examples of the most common methods that are available on Scala Maps.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 36
outof: 54
previous-page: collections-methods
next-page: misc
---


In this lesson we’ll demonstrate some of the most commonly used `Map` methods. In these initial examples we’ll use an *immutable* `Map`, and Scala also has a mutable `Map` class that you can modify in place, and it’s demonstrated a little later in this lesson.

For these examples we won’t break the `Map` methods down into individual sections; we’ll just provide a brief comment before each method.

Given this immutable `Map`:

```scala
val m = Map(
    1 -> "a", 
    2 -> "b", 
    3 -> "c",
    4 -> "d"
)
```

Here are some examples of methods available to that `Map`:

```scala
// how to iterate over Map elements
scala> for ((k,v) <- m) printf("key: %s, value: %s\n", k, v)
key: 1, value: a
key: 2, value: b
key: 3, value: c
key: 4, value: d

// how to get the keys from a Map
scala> val keys = m.keys
keys: Iterable[Int] = Set(1, 2, 3, 4)

// how to get the values from a Map
scala> val values = m.values
val values: Iterable[String] = MapLike.DefaultValuesIterable(a, b, c, d)

// how to test if a Map contains a key
scala> val contains3 = m.contains(3)
contains3: Boolean = true

// how to transform Map values
scala> val ucMap = m.transform((k,v) => v.toUpperCase)
ucMap: scala.collection.immutable.Map[Int,String] = Map(1 -> A, 2 -> B, 3 -> C, 4 -> D)

// how to filter a Map by its keys
scala> val twoAndThree = m.view.filterKeys(Set(2,3)).toMap
twoAndThree: scala.collection.immutable.Map[Int,String] = Map(2 -> b, 3 -> c)

// how to take the first two elements from a Map
scala> val firstTwoElements = m.take(2)
firstTwoElements: scala.collection.immutable.Map[Int,String] = Map(1 -> a, 2 -> b)
```

>Note that the last example probably only makes sense for a sorted Map.



## Mutable Map examples

Here are a few examples of methods that are available on the mutable `Map` class. Given this initial mutable `Map`:

```scala
val states = scala.collection.mutable.Map(
    "AL" -> "Alabama", 
    "AK" -> "Alaska"
)
```

Here are some things you can do with a mutable `Map`:

```scala
// add elements with +=
states += ("AZ" -> "Arizona")
states += ("CO" -> "Colorado", "KY" -> "Kentucky")

// remove elements with -=
states -= "KY"
states -= ("AZ", "CO")

// update elements by reassigning them
states("AK") = "Alaska, The Big State"

// retain elements by supplying a function that operates on
// the keys and/or values
states.retain((k,v) => k == "AK")
```



## See also

There are many more things you can do with maps. See the [Map class documentation]({{site.baseurl}}/overviews/collections-2.13/maps.html) for more details and examples.










