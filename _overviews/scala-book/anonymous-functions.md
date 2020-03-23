---
type: section
layout: multipage-overview
title: Anonymous Functions
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 34
outof: 54
previous-page: set-class
next-page: collections-methods
---


Earlier in this book you saw that you can create a list of integers like this:

```scala
val ints = List(1,2,3)
```

When you want to create a larger list, you can also create them with the `List` class `range` method, like this:

```scala
val ints = List.range(1, 10)
```

That code creates `ints` as a list of integers whose values range from 1 to 10. You can see the result in the REPL:

```scala
scala> val ints = List.range(1, 10)
x: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9)
```

In this lesson we’ll use lists like these to demonstrate a feature of functional programming known as *anonymous functions*. It will help to understand how these work before we demonstrate the most common Scala collections methods.



## Examples

An anonymous function is like a little mini-function. For example, given a list like this:

```scala
val ints = List(1,2,3)
```

You can create a new list by doubling each element in `ints`, like this:

```scala
val doubledInts = ints.map(_ * 2)
```

This is what that example looks like in the REPL:

```scala
scala> val doubledInts = ints.map(_ * 2)
doubledInts: List[Int] = List(2, 4, 6)
```

As that shows, `doubledInts` is now the list, `List(2, 4, 6)`. In this example, this code is an anonymous function:

```scala
_ * 2
```

This is a shorthand way of saying, “Multiply an element by 2.” 

Once you’re comfortable with Scala, this is a common way to write anonymous functions, but if you prefer, you can also write them using longer forms. Besides writing that code like this:

```scala
val doubledInts = ints.map(_ * 2)
```

you can also write it like this:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map(i => i * 2)
```

All three lines have exactly the same meaning: Double each element in `ints` to create a new list, `doubledInts`.

>The `_` character in Scala is something of a wildcard character. You’ll see it used in several different places. In this case it’s a shorthand way of saying, “An element from the list, `ints`.”

Before going any further, it’s worth mentioning that this `map` example is the equivalent of this Java code:

```java
List<Integer> ints = new ArrayList<>(Arrays.asList(1, 2, 3));

// the `map` process
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```

The `map` example shown is also the same as this Scala code:

```scala
val doubledInts = for (i <- ints) yield i * 2
```



## Anonymous functions with the `filter` method

Another good way to show anonymous functions is with the `filter` method of the `List` class. Given this `List` again:

```scala
val ints = List.range(1, 10)
```

This is how you create a new list of all integers whose value is greater than 5:

```scala
val x = ints.filter(_ > 5)
```

This is how you create a new list whose values are all less than 5:

```scala
val x = ints.filter(_ < 5)
```

And as a little more complicated example, this is how you create a new list that contains only even values, by using the modulus operator:

```scala
val x = ints.filter(_ % 2 == 0)
```

If that’s a little confusing, remember that this example can also be written in these other ways:

```scala
val x = ints.filter((i: Int) => i % 2 == 0)
val x = ints.filter(i => i % 2 == 0)
```

This is what the previous examples look like in the REPL:

```scala
scala> val x = ints.filter(_ > 5)
x: List[Int] = List(6, 7, 8, 9)

scala> val x = ints.filter(_ < 5)
x: List[Int] = List(1, 2, 3, 4)

scala> val x = ints.filter(_ % 2 == 0)
x: List[Int] = List(2, 4, 6, 8)
```



## Key points

The key points of this lesson are:

- You can write anonymous functions as little snippets of code
- You can use them with methods on the `List` class like `map` and `filter`
- With these little snippets of code and powerful methods like those, you can create a lot of functionality with very little code

The Scala collections classes contain many methods like `map` and `filter`, and they’re a powerful way to create very expressive code.



## Bonus: Digging a little deeper

You may be wondering how the `map` and `filter` examples work. The short answer is that when `map` is invoked on a list of integers — a `List[Int]` to be more precise — `map` expects to receive a function that transforms one `Int` value into another `Int` value. Because `map` expects a function (or method) that transforms one `Int` to another `Int`, this approach also works:

```scala
val ints = List(1,2,3)
def double(i: Int): Int = i * 2   //a method that doubles an Int
val doubledInts = ints.map(double)
```

The last two lines of that example are the same as this:

```scala
val doubledInts = ints.map(_ * 2)
```

Similarly, when called on a `List[Int]`, the `filter` method expects to receive a function that takes an `Int` and returns a `Boolean` value. Therefore, given a method that’s defined like this:

```scala
def lessThanFive(i: Int): Boolean = if (i < 5) true else false
```

or more concisely, like this:

```scala
def lessThanFive(i: Int): Boolean = (i < 5)
```

this `filter` example:

```scala
val ints = List.range(1, 10)
val y = ints.filter(lessThanFive)
```

is the same as this example:

```scala
val y = ints.filter(_ < 5)
```













