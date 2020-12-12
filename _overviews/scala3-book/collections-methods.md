---
title: Collections Methods
type: section
description: This page demonstrates the common methods on the Scala 3 collections classes.
num: 34
previous-page: collections-classes
next-page: collections-summary
---



A great strength of Scala’s collections classes is that they come with dozens of pre-built methods, and those methods are consistently available across the immutable and mutable classes. The benefits of this are that you no longer need to write custom `for` loops every time you need to work on a collection, and when you move from one project to another, you’ll find these same methods used, rather than more custom `for` loops.

There are *dozens* of methods available to you, so they aren’t all shown here. Instead, only some of the most commonly-used methods will be shown, including:

- `map`
- `filter`
- `foreach`
- `head`
- `tail`
- `take`, `takeWhile`
- `drop`, `dropWhile`
- `reduce`

The following methods work on all of the sequence classes, including `List`, `Vector`, `ArrayBuffer`, etc., but these examples use a `List` unless otherwise specified.

>As a very important note, none of these methods mutate the collection that they’re called on. They all work in a functional style, meaning that they return a new collection with the modified results.



## Examples of some common methods

To give you an overview of what you’ll see in the following sections, these examples show some of the most commonly used methods:

```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.filter(_ > 100)                     // List()
a.filterNot(_ < 25)                   // List(30, 40)
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)
```



## Sample lists

The following examples use these lists:

```scala
val oneToTen = (1 to 10).toList
val names = List("adam", "brandy", "chris", "david")
```



## `map`

The `map` method steps through each element in the existing list, applying the algorithm you supply to each element, one at a time; it then returns a new list with all of the modified elements.

Here’s an example of the `map` method being applied to the `oneToTen` list:

```scala
scala> val doubles = oneToTen.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

You can also write anonymous functions using a long form, like this:

```scala
scala> val doubles = oneToTen.map(i => i * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

However, in this lesson we’ll always use the first, shorter form.

Here are a few more examples of the `map` method being applied to the `oneToTen` and `names` lists:

```scala
scala> val capNames = names.map(_.capitalize)
capNames: List[String] = List(Adam, Brandy, Chris, David)

scala> val nameLengthsMap = names.map(s => (s, s.length)).toMap
nameLengthsMap: Map[String, Int] = Map(adam -> 4, brandy -> 6, chris -> 5, david -> 5)

scala> val isLessThanFive = oneToTen.map(_ < 5)
isLessThanFive: List[Boolean] = List(true, true, true, true, false, false, false, false, false, false)
```

As shown in the last two examples, it’s perfectly legal (and common) to use `map` to return a collection that has a different type than the original type.



## `filter`

The `filter` method creates a new, filtered list from the given list. Here are a few examples:

```scala
scala> val lessThanFive = oneToTen.filter(_ < 5)
lessThanFive: List[Int] = List(1, 2, 3, 4)

scala> val evens = oneToTen.filter(_ % 2 == 0)
evens: List[Int] = List(2, 4, 6, 8, 10)

scala> val shortNames = names.filter(_.length <= 4)
shortNames: List[String] = List(adam)
```



## `foreach`

The `foreach` method is used to loop over all elements in a collection. Note that `foreach` is used for side-effects, such as printing information. Here’s an example with the `names` list:

```scala
scala> names.foreach(println)
adam
brandy
chris
david
```

A great thing about the functional methods on the collections classes is that you can chain them together to solve problems. For example, this is one way to print the first three elements from `oneToTen`:

```scala
oneToTen.filter(_ < 4).foreach(println)
```

The REPL shows the result:

```scala
scala> oneToTen.filter(_ < 4).foreach(println)
1
2
3
```



## `head`

The `head` method comes from Lisp and other earlier functional programming languages. It’s used to print the first element (the head element) of a list:

```scala
oneToTen.head   // Int = 1
names.head      // adam
```

Because a `String` is a sequence of characters, you can also treat it like a list. This is how `head` works on these strings:

```scala
"foo".head   // f
"bar".head   // b
```

`head` is a great method to work with, but as a word of caution it can also throw an exception when called on an empty collection:

```scala
val emptyList = List[Int]()   // emptyList: List[Int] = List()
emptyList.head                // java.util.NoSuchElementException: head of empty list
```

Because of this you may want to use `headOption` instead of `head`, especially when programming in a functional style:

```scala
emptyList.headOption          // Option[Int] = None
```

As shown, it doesn’t throw an exception, it simply returns the type `Option` that has the value `None`. You can learn more about this programming style in the Reference documentation.



## `tail`

The `tail` method also comes from Lisp, and it’s used to print every element in a list after the head element. A few examples demonstrate this:

```scala
oneToTen.head   // Int = 1
oneToTen.tail   // List(2, 3, 4, 5, 6, 7, 8, 9, 10)

names.head      // adam
names.tail      // List(brandy, chris, david)
```

Just like `head`, `tail` also works on strings:

```scala
"foo".tail   // "oo"
"bar".tail   // "ar"
```

Like `head` and `headOption`, there’s also a `tailOption` method, which is preferred in functional programming.



## `take`, `takeRight`, `takeWhile`

The `take`, `takeRight`, and `takeWhile` methods give you a nice way of “taking” the elements from a list that you want to use to create a new list. This is `take` and `takeRight`:

```scala
oneToTen.take(1)        // List(1)
oneToTen.take(2)        // List(1, 2)

oneToTen.takeRight(1)   // List(10)
oneToTen.takeRight(2)   // List(9, 10)
```

And this is `takeWhile`, which works with a predicate function:

```scala
oneToTen.takeWhile(_ < 5)       // List(1, 2, 3, 4)
names.takeWhile(_.length < 5)   // List(adam)
```



## `drop`, `dropRight`, `dropWhile`

`drop`, `dropRight`, and `dropWhile` are essentially the opposite of their “take” counterparts, dropping elements from a list. Here are some examples:

```scala
oneToTen.drop(1)        // List(2, 3, 4, 5, 6, 7, 8, 9, 10)
oneToTen.drop(5)        // List(6, 7, 8, 9, 10)

oneToTen.dropRight(8)   // List(1, 2)
oneToTen.dropRight(7)   // List(1, 2, 3)
```

And this is `dropWhile`, which works with a predicate function:

```scala
oneToTen.dropWhile(_ < 5)       // List(5, 6, 7, 8, 9, 10)
names.dropWhile(_ != "chris")   // List(chris, david)
```



## `reduce`

When you hear the term, “map reduce,” the “reduce” part refers to methods like `reduce`. It takes a function (or anonymous function) and applies that function to successive elements in the list.

The best way to explain `reduce` is to create a little helper method you can pass into it. For example, this is an `add` method that adds two integers together, and also provides us some nice debug output:

```scala
def add(x: Int, y: Int): Int =
  val theSum = x + y
  println(s"received $x and $y, their sum is $theSum")
  theSum
```

Given that method and this list:

```scala
val a = List(1,2,3,4)
```

this is what happens when you pass the `add` method into `reduce`:

```scala
scala> a.reduce(add)
received 1 and 2, their sum is 3
received 3 and 3, their sum is 6
received 6 and 4, their sum is 10
res0: Int = 10
```

As that result shows, `reduce` uses `add` to reduce the list `a` into a single value, in this case, the sum of the integers in the list.

Once you get used to `reduce`, you’ll write a “sum” algorithm like this:

```scala
scala> a.reduce(_ + _)
res0: Int = 10
```

Similarly, a “product” algorithm looks like this:

```scala
scala> a.reduce(_ * _)
res1: Int = 24
```

>An important concept to know about `reduce` is that — as its name implies — it’s used to _reduce_ a collection down to a single value.



## Even more

There are literally dozens of additional methods on the Scala collections classes that will keep you from ever needing to write another `for` loop. See the Reference documentation for more details and examples.

>As a final note, if you’re using Java code in a Scala project, you can convert Java collections to Scala collections. By doing this you can use those collections in `for` expressions, and can also take advantage of Scala’s functional collections methods. See the [Interacting with Java][interacting] section for more details.



[interacting]: {% link _overviews/scala3-book/interacting-with-java.md %}
