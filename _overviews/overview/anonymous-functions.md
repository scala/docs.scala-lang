---
title: Anonymous Functions (and Function Variables)
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
---


This chapter focuses on how to create *anonymous functions* — also known as *function literals*, and called *lambdas* in some languages — in Scala. Creating anonymous functions also helps us demonstrate something else: How to create function variables in Scala.



## Examples

An anonymous function is like a little mini-function. For example, given a list like this:

```scala
val ints = List(1,2,3)
```

You can create a new list by doubling each element in `ints`, using the `List` class `map` method and your custom anonymous function:

```scala
val doubledInts = ints.map(_ * 2)   // List(2, 4, 6)
```

As the comment shows, `doubledInts` contains the list, `List(2, 4, 6)`. In that example, this portion of the code is an anonymous function:

```scala
_ * 2
```

This is a shorthand way of saying, “Multiply a given element by 2.”


### Longer forms

Once you’re comfortable with Scala, that’s a common way to write anonymous functions, but if you prefer, you can also write them using longer forms. So, in addition to writing that code like this:

```scala
val doubledInts = ints.map(_ * 2)
```

you can also write it using these forms:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map((i) => i * 2)
val doubledInts = ints.map(i => i * 2)
```

All of these lines have the exact same meaning: Double each element in `ints` to create a new list, `doubledInts`. The syntax of each form is explained in the next section.

If you’re familiar with Java, it may help to know that those `map` examples are the equivalent of this Java code:

```java
List<Integer> ints = List.of(1,2,3);
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```



## The rules about shortening anonymous functions

When you want to be explicit, you can write an anonymous function using this long form:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

The anonymous function in that expression is this:

```scala
(i: Int) => i * 2
```

If you’re not familiar with this syntax, it helps to think of the `=>` symbol as a transformer, because the expression *transforms* the parameter list on the left side of the symbol (an `Int` variable named `i`) into a new result using the algorithm on the right side of the `=>` symbol (in this case, an expression that doubles the `Int`).


### Shortening that expression

Starting with that longest and most explicit form:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

Because the Scala compiler can infer from the data in `ints` that `i` is an `Int`, the `Int` declaration can be removed:

```scala
val doubledInts = ints.map((i) => i * 2)
```

Because there’s only one argument, the parentheses around the parameter `i` aren’t needed:

```scala
val doubledInts = ints.map(i => i * 2)
```

Next, because Scala lets you use the `_` symbol instead of a variable name when the parameter appears only once in your function, the code can be simplified even more:

```scala
val doubledInts = ints.map(_ * 2)
```

In other examples, you can simplify your anonymous functions further. For instance, beginning with the most explicit form, you can print each element in `ints` using this anonymous function with the `List` class `foreach` method:

```scala
ints.foreach((i:Int) => println(i))
```

As before, the `Int` declaration isn’t required, and because there’s only one argument, the parentheses around `i` aren’t needed:

```scala
ints.foreach(i => println(i))
```

Because `i` is used only once in the body of the function, the expression can be further simplified with the `_` symbol:

```scala
ints.foreach(println(_))
```

Finally, if a function literal consists of one statement that takes a single argument, you don’t need to explicitly name and specify the argument, so the statement can finally be reduced to this:

```scala
ints.foreach(println)
```



## From anonymous functions to function variables

Going back to this example:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

We noted earlier that this part of the expression is an anonymous function:

```scala
(i: Int) => i * 2
```

The reason it’s called *anonymous* is because it’s not assigned to a variable, and therefore doesn’t have a name.

What’s interesting now is that you can assign this anonymous function (function literal) to a variable to create a function variable:

```scala
val double = (i: Int) => i * 2
```

Now we have a function variable named `double`. In this expression, our original function literal is on the right side of the `=` symbol:

```scala
val double = (i: Int) => i * 2
             -----------------
```

and the new variable name is on the left side:

```scala
val double = (i: Int) => i * 2
    ------
```

In this expression the function’s parameter list is underlined here:

```scala
val double = (i: Int) => i * 2
             --------
```

Like the parameter list for a method, this means that the `double` function takes one parameter, an `Int` named `i`. In fact, you can see in the REPL that `double` has the type `Int => Int`, meaning that it takes a single `Int` parameter and returns an `Int`:

```scala
scala> val double = (i: Int) => i * 2
val double: Int => Int = ...
```

Now you can call the `double` function like this:

```scala
val x = double(2)   // 4
```

You can also pass `double` into a `map` call:

```scala
List(1,2,3).map(double)   // List(2, 4, 6)
```

Furthermore, if you happen to have another function that has the `Int => Int` type:

```scala
val triple = (i: Int) => i * 3
```

You can also store them in a `List` or `Map`:

```scala
val functionList = List(double, triple)

val functionMap = Map(
  "2x" -> double,
  "3x" -> triple
)
```

If you paste those expressions into the REPL, you’ll see that they have these types:

````
// a List that contains functions of the type `Int => Int`
functionList: List[Int => Int]

// a Map whose keys have the type `String`, and whose
// values have the type `Int => Int`
functionMap: Map[String, Int => Int]
````

The important parts here are:

- To create a function variable, just assign a variable name to a function literal
- Once you have a function, you can treat it like any other variable, i.e., like a `String` or `Int` variable

>And thanks to the improved Eta Expansion functionality in Scala 3, you can treat *methods* in the same way.
<!-- TODO: Link to the Eta Expansion lesson -->



## Key points

The key points of this lesson are:

- You can write anonymous functions as little snippets of code
- You can pass them into the dozens of higher-order functions (methods) on the collections classes, i.e., methods like `filter`, `map`, etc.
- With these little snippets of code and powerful higher-order functions, you create a lot of functionality with just a little code
- Function variables are simply anonymous functions that have been bound to a variable



## Bonus: Digging a little deeper

You may be wondering how methods like `map` and `filter` work. Technically, the `map` method on a sequence class like `List` takes a *function* parameter. That function is defined to take a generic parameter `A` as input, and it returns a generic value `B` as its result. Any function that matches this type signature can be used here. When `map` finishes traversing over all of its elements, it returns a `List[B]` as its result. When you see this `map` method signature in the `List` Scaladoc, that’s what it means:

```scala
def map[B](f: (A) => B): List[B]
```

In the case of our `ints` list, the compiler knows that `ints` is a list of integers, i.e., a `List[Int]`. Therefore, the generic parameter `A` must be the type `Int`.

The parameter `B` is whatever your custom function returns. For instance, while the anonymous function shown previously transformed one `Int` into another `Int` value, this function transforms an `Int` to a `Double`:

```tut
val intToDouble = (i: Int) => i.toDouble
```

So now when you use that function with `ints` and `map`, you get a `List[Double]`:

```scala
ints.map(intToDouble)   // List[Double] = List(1.0, 2.0, 3.0)
```

In summary, while generically the `map` method expects this type:

```scala
f: (A) => B
```

in this specific example the `intToDouble` function has this type:

```scala
f: (Int) => Double
```


### More `map` and `filter` examples

Here’s another `map` example that transforms a `Seq[String]` into a `Seq[Int]`:

```tut
Seq("hi", "there").map(_.length)   // Seq[Int] = List(2, 5)
```

In this case the anonymous function `_.length` transforms each `String` it’s given into an `Int` by calling the `length` function on the `String`.

Similarly, `filter` also takes a function parameter, but the function it’s given must return a `Boolean` value, so it’s Scaladoc signature looks like this:

```scala
def filter(p: (A) => Boolean): List[A]
```

So any anonymous function used with `filter` must take the type `A` that’s contained in the list and return a `Boolean`, like these examples:

```scala
val list = Seq(1,2,3,4,5)
list.filter(_ < 3)        // List(1, 2)
list.filter(_ % 2 == 0)   // List(2, 4)
```

If you’re not familiar with it, that last example performs a modulus comparison that returns `true` for even numbers.

>The letter `p` is used in the `filter` Scaladoc because any function that returns a `Boolean` value is known as a *predicate*.


### One more thing

As a bit of extra credit, you may be interested to know that this expression:

```scala
val doubledInts = ints.map(_ * 2)
```

is equivalent to this expression:

```scala
val doubledInts = for i <- ints yield i * 2
```

Depending on their background, when some developers come to Scala they may initially feel more comfortable writing this `for` expression, until one day they realize it’s the exact same thing as writing the more concise `map` expression.





