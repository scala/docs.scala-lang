---
layout: multipage-overview
title: Common Sequential Collections Methods
description: This page shows examples of the most common methods that are available on the Scala sequential collections classes.
partof: hello_scala
overview-name: Hello, Scala
num: 35
---


A great strength of the Scala collections classes is that they come with dozens of pre-built methods. The benefit of this is that you no longer need to write custom `for` loops every time you need to work on a collection. (If that’s not enough of a benefit, it also means that you no longer have to read custom `for` loops written by other developers.)

Because there are so many methods available to you, I’m not going to show them all here. (I do that in the *Scala Cookbook*.) Instead, I’ll just show how to use some of the most commonly-used methods, including:

- map
- filter
- foreach
- head
- tail
- take, takeWhile
- drop, dropWhile
- find
- reduce, fold

The methods I’ll show work on all of the sequential collections classes, including `Array`, `ArrayBuffer`, `List`, `Vector`, etc., but in these examples I’ll use a `List` unless otherwise specified.



## Note: The methods don’t mutate the list

As a very important note, none of these methods mutate the list that they’re called on. They all work in a functional style, so they return a new list with the modified results.



## Sample lists

In the following examples I’ll use these lists:

```scala
val nums = (1 to 10).toList
val names = List("joel", "ed", "chris", "maurice")
```

This is what these lists look like in the REPL:

```scala
scala> val nums = (1 to 10).toList
nums: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> val names = List("joel", "ed", "chris", "maurice")
names: List[String] = List(joel, ed, chris, maurice)
```



## `map`

The `map` method steps through each element in the existing list, applying the algorithm you supply to each element, one at a time; it then returns a new list with all of the modified elements.

Here’s an example of the `map` method being applied to the `nums` list:

```scala
scala> val doubles = nums.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

As I wrote in the lesson on anonymous functions, you can also write the anonymous function like this:

```scala
scala> val doubles = nums.map(i => i * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
```

However, in this lesson I’ll always use the first, shorter form.

With that background, here’s an example of the `map` method being applied to the `nums` and `names` lists:

<!--
val doubles = nums.map(_ * 2)
val lessThanFive = nums.map(_ < 5)
val capNames = names.map(_.capitalize)
-->

```scala
scala> val capNames = names.map(_.capitalize)
capNames: List[String] = List(Joel, Ed, Chris, Maurice)

scala> val doubles = nums.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)

scala> val lessThanFive = nums.map(_ < 5)
lessThanFive: List[Boolean] = List(true, true, true, true, false, false, false, false, false, false)
```

As that last example shows, it’s perfectly legal (and very common) to use map to return a list with a different type (`List[Boolean]`) from the original type (`List[Int]`).



## `filter`

The `filter` method creates a new, filtered list from the given list. Here are a few examples:

<!--
val lessThanFive = nums.filter(_ < 5)
val evens = nums.filter(_ % 2 == 0)
val shortNames = names.filter(_.length <= 4)
-->

```scala
scala> val lessThanFive = nums.filter(_ < 5)
lessThanFive: List[Int] = List(1, 2, 3, 4)

scala> val evens = nums.filter(_ % 2 == 0)
evens: List[Int] = List(2, 4, 6, 8, 10)

scala> val shortNames = names.filter(_.length <= 4)
shortNames: List[String] = List(joel, ed)
```



## `foreach`

The `foreach` method is used to loop over all elements in a collection. As I mentioned earlier, `foreach` is used for side-effects, such as printing information. Here’s an example with the `names` list:

```scala
scala> names.foreach(println)
joel
ed
chris
maurice
```

The `nums` list is a little long, so I don’t want to print out all of those elements. But a great thing about Scala’s approach is that you can chain methods together to solve problems like this. For example, this is one way to print the first three elements from `nums`:

```scala
nums.filter(_ < 4).foreach(println)
```

The REPL shows the result:

```scala
scala> nums.filter(_ < 4).foreach(println)
1
2
3
```



## `head`

The `head` method comes from Lisp and functional programming languages. It’s used to print the first element (the head element) of a list:

```scala
scala> nums.head
res0: Int = 1

scala> names.head
res1: String = joel
```

Because a `String` is a sequence of characters, you can also treat it like a list. This is how `head` works on these strings:

```scala
scala> "foo".head
res2: Char = f

scala> "bar".head
res3: Char = b
```



## `tail`

The `tail` method also comes from Lisp and functional programming languages. It’s used to print every element in a list after the head element. A few examples:

```scala
scala> nums.tail
res0: List[Int] = List(2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> names.tail
res1: List[String] = List(ed, chris, maurice)
```

Just like `head`, `tail` also works on strings:

```scala
scala> "foo".tail
res2: String = oo

scala> "bar".tail
res3: String = ar
```



## `take`, `takeWhile`

The `take` and `takeWhile` methods give you a nice way of taking the elements out of a list that you want to create a new list. This is `take`:

```scala
scala> nums.take(1)
res0: List[Int] = List(1)

scala> nums.take(2)
res1: List[Int] = List(1, 2)

scala> names.take(1)
res2: List[String] = List(joel)

scala> names.take(2)
res3: List[String] = List(joel, ed)
```

And this is `takeWhile`:

```scala
scala> nums.takeWhile(_ < 5)
res4: List[Int] = List(1, 2, 3, 4)

scala> names.takeWhile(_.length < 5)
res5: List[String] = List(joel, ed)
```



## `drop`, `dropWhile`

`drop` and `dropWhile` are essentially the opposite of `take` and `takeWhile`. This is `drop`:

```scala
scala> nums.drop(1)
res0: List[Int] = List(2, 3, 4, 5, 6, 7, 8, 9, 10)

scala> nums.drop(5)
res1: List[Int] = List(6, 7, 8, 9, 10)

scala> names.drop(1)
res2: List[String] = List(ed, chris, maurice)

scala> names.drop(2)
res3: List[String] = List(chris, maurice)
```

And this is `dropWhile`:

```scala
scala> nums.dropWhile(_ < 5)
res4: List[Int] = List(5, 6, 7, 8, 9, 10)

scala> names.dropWhile(_ != "chris")
res5: List[String] = List(chris, maurice)
```



## `reduce`

When you hear the term, “map reduce,” the “reduce” part refers to methods like `reduce`. It takes a function (or anonymous function) and applies that function to successive elements in the list.

The best way to explain `reduce` is to create a little helper method we can pass into it. For example, this is an `add` method that adds two integers together, but also gives us some nice debug output:

```scala
def add(x: Int, y: Int): Int = {
    val theSum = x + y
    println(s"received $x and $y, their sum is $theSum")
    theSum
}
```

Now, given that method and this list:

```scala
val a = List(1,2,3,4)
```

this is what happens when I pass the `add` method into `reduce`:

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

Similarly, this is what a “product” algorithm looks like:

```scala
scala> a.reduce(_ * _)
res1: Int = 24
```

I know that might be a little mind-blowing if you’ve never seen it before, but because this is an “introduction” book, I’m going to leave it at that for now. For more details, please see the *Scala Cookbook*, which has over 100 pages on the Scala collections, and *Functional Programming, Simplified*, which has a very detailed chapter on how methods like `reduce` and `fold` work.

>Before I go, the important part about `reduce` is that it’s used to *reduce* a collection down to a single value.



## That’s all for now

There are literally dozens of additional methods on the Scala sequential collections classes that will keep you from ever needing to write another `for` loop. However, because this is a simple introduction book, I won’t cover them all. As mentioned, please see the *Scala Cookbook* and *Functional Programming, Simplified* for many more details.












