---
layout: multipage-overview
title: for Expressions
description: This page shows how to use Scala 'for' expressions (also known as 'for-expressions'), including examples of how to use it with the 'yield' keyword.
partof: hello_scala
overview-name: Hello, Scala
num: 16
---


If you recall what I wrote about Expression-Oriented Programming (EOP) and the difference between *expressions* and *statements*, you’ll notice that in the previous lesson I used the `for` keyword and `foreach` method as tools for side effects. I used them to print the values in the collections to STDOUT using `println`. Java has similar keywords, and that’s how I used them for many years without ever giving much thought to how they could be improved.

After I started working with Scala I learned that in functional programming languages you can use more powerful “`for` expressions” in addition to “`for` loops.” In Scala, a `for` expression is a different use of the `for` construct. While a *for-loop* is used for side effects (such as printing output), a *for-expression* is used to create new collections from existing collections.

For example, given this list of integers:

```scala
val nums = Seq(1,2,3)
```

You can create a new list of integers where all of the values are doubled, like this:

```scala
val doubledNums = for (n <- nums) yield n * 2
```

That expression can be read as, “For every number `n` in the list of numbers `nums`, double each value, and then assign all of the new values to the variable `doubledNums`.” This is what it looks like in the Scala REPL:

```scala
scala> val doubledNums = for (n <- nums) yield n * 2
doubledNums: Seq[Int] = List(2, 4, 6)
```

As the REPL output shows, the new list `doubledNums` contains these values:

```scala
List(2,4,6)
```

In summary, the result of the for-expression is that it creates a new variable named `doubledNums` whose values were created by doubling each value in the original list, `nums`.



## Capitalizing a list of strings

You can use the same approach with a list of strings. For example, given this list of lowercase strings:

```scala
val names = List("adam", "david", "frank")
```

You can create a list of capitalized strings with this for-expression:

```scala
val ucNames = for (name <- names) yield name.capitalize
```

The REPL shows how this works:

```scala
scala> val ucNames = for (name <- names) yield name.capitalize
ucNames: List[String] = List(Adam, David, Frank)
```

Success! Each name in the new variable `ucNames` is capitalized.



## The `yield` keyword

Notice that both of those for-expressions use the `yield` keyword:

```scala
val doubledNums = for (n <- nums) yield n * 2
                                  -----

val ucNames = for (name <- names) yield name.capitalize
                                  -----
```

Using `yield` after `for` is the “secret sauce” that says, “I want to yield a new collection from the existing collection that I’m iterating over in the for-expression, using the algorithm shown.”



## Using a block of code after `yield`

The code after the `yield` expression can be as long as necessary to solve the current problem. For example, given a list of strings like this:

```scala
val names = List("_adam", "_david", "_frank")
```

Imagine that you want to create a new list that has the capitalized names of each person. To do that, you first need to remove the underscore character at the beginning of each name, and then capitalize each name. To remove the underscore from each name, you call the `tail` method on each `String`. After you do that, you call the `capitalize` method on each string. Here’s how you can use a for-expression to solve this problem:

```scala
val capNames = for (name <- names) yield {
    val nameWithoutUnderscore = name.tail
    val capName = nameWithoutUnderscore.capitalize
    capName
}
```

If you put that code in the REPL, you’ll see this result:

```scala
capNames: List[String] = List(Adam, David, Frank)
```


### How `tail` works

The `tail` method works on sequential collections, and returns every element in the collection other than the first element (which is known as the “head” element). Because a `String` is also a linear collection, `tail` works on strings like this:

```scala
scala> val result = "fred".tail
result: String = red
```


### A shorter version of the solution

I show the verbose form of the solution in that example so you can see how to use multiple lines of code after `yield`. However, for this particular example you can also write the code like this, which is more of the Scala style:

```scala
val capNames = for (name <- names) yield name.tail.capitalize
```

You can also put curly braces around the algorithm, if you prefer:

```scala
val capNames = for (name <- names) yield { name.tail.capitalize }
```



## See also

- My [Scala ‘for loop’ examples and syntax](https://alvinalexander.com/scala/scala-for-loop-examples-syntax-yield-foreach)
- My [How to create a Scala “for comprehension”](https://alvinalexander.com/scala/scala-for-comprehension-syntax-for-yield-loop-examples)















