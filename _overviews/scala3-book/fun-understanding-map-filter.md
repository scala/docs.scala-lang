---
title: Understanding map and filter
type: section
description: This section explains the 'map' and 'filter' higher-order functions that are found on Scala’s collections classes.
num: 18
previous-page: fun-eta-expansion
next-page: fun-hofs
---


You may be wondering how methods like `map` and `filter` work. Technically, the `map` method on a collections class like `List` takes a *function* parameter. That function is defined to take a generic parameter `A` as input, and it returns a generic value `B` as its result. Any function that matches this type signature can be used here. When `map` finishes traversing over all of its elements, it returns a `List[B]` as its result.

When you see this `map` method signature in the `List` Scaladoc, that’s what it means:

```scala
def map[B](f: (A) => B): List[B]
```

In the case of the `ints` list we’ve been using:

```scala
val ints = List(1, 2, 3)
```

the compiler knows that `ints` is a list of integers, i.e., a `List[Int]`. Therefore, the generic parameter `A` must be the type `Int`.

The parameter `B` is whatever your custom function returns. For instance, while the previous examples transformed one `Int` into another `Int` value, this function transforms an `Int` to a `Double`:

```scala
val intToDouble = (i: Int) => i.toDouble
```

As a result, when you use that function with `ints` and `map`, you get a `List[Double]`:

```scala
ints.map(intToDouble)   // List[Double] = List(1.0, 2.0, 3.0)
```

In summary, while generically-speaking, the `map` method expects this type:

```scala
f: (A) => B
```

in this specific example, the `intToDouble` function has this type:

```scala
f: (Int) => Double
```

Because `A` is the type `Int` in this example, `intToDouble` matches the signature `map` wants for a `List[Int]`.



## More `map` and `filter` examples

Here’s another `map` example that transforms a `Seq[String]` into a `Seq[Int]`:

```scala
Seq("hi", "there").map(_.length)   // Seq[Int] = List(2, 5)
```

In this case the anonymous function `_.length` transforms each `String` it’s given into an `Int` by calling the `length` function on the `String`.

Like `map`, `filter` also takes a function parameter, but the function it’s given must return a `Boolean` value, so it’s Scaladoc signature looks like this:

```scala
def filter(p: (A) => Boolean): List[A]
```

Therefore, any anonymous function used with `filter` must take the type `A` that’s contained in the list and return a `Boolean`, like these examples:

```scala
val list = Seq(1, 2, 3, 4, 5)
list.filter(_ < 3)        // List(1, 2)
list.filter(_ % 2 == 0)   // List(2, 4)
```

If you’re not familiar with the syntax shown in that last example, it performs a modulus comparison that returns `true` for even numbers.

>The letter `p` is used in the `filter` Scaladoc because any function that returns a `Boolean` value is known as a *predicate*.



## A note about `map`

If you’re new to the `map` function, it can help to know that this expression:

```scala
val doubledInts = ints.map(_ * 2)
```

is equivalent to this expression:

```scala
val doubledInts = for i <- ints yield i * 2
```

Depending on their background, when some developers come to Scala they may initially feel more comfortable writing this `for` expression, until one day they realize it’s the exact same thing as writing the more concise `map` expression.



