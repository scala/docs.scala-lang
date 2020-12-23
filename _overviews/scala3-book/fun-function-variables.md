---
title: Function Variables
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
num: 29
previous-page: fun-anonymous-functions
next-page: fun-eta-expansion
---



Going back to this example from the previous section:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
```

We noted that this part of the expression is an anonymous function:

```scala
(i: Int) => i * 2
```

The reason it’s called *anonymous* is because it’s not assigned to a variable, and therefore doesn’t have a name.

However, an anonymous function---also known as a *function literal*---can be assigned to a variable to create a *function variable*:

```scala
val double = (i: Int) => i * 2
```

This creates a function variable named `double`.
In this expression, the original function literal is on the right side of the `=` symbol:

```scala
val double = (i: Int) => i * 2
             -----------------
```

the new variable name is on the left side:

```scala
val double = (i: Int) => i * 2
    ------
```

and the function’s parameter list is underlined here:

```scala
val double = (i: Int) => i * 2
             --------
```

Like the parameter list for a method, this means that the `double` function takes one parameter, an `Int` named `i`.
You can see in the REPL that `double` has the type `Int => Int`, meaning that it takes a single `Int` parameter and returns an `Int`:

```scala
scala> val double = (i: Int) => i * 2
val double: Int => Int = ...
```


### Invoking the function

Now you can call the `double` function like this:

```scala
val x = double(2)   // 4
```

You can also pass `double` into a `map` call:

```scala
List(1, 2, 3).map(double)   // List(2, 4, 6)
```

Furthermore, when you have other functions of the `Int => Int` type:

```scala
val triple = (i: Int) => i * 3
```

you can store them in a `List` or `Map`:

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



## Key points

The important parts here are:

- To create a function variable, just assign a variable name to a function literal
- Once you have a function, you can treat it like any other variable, i.e., like a `String` or `Int` variable

And thanks to the improved [Eta Expansion][eta_expansion] functionality in Scala 3, you can treat *methods* in the same way.



[eta_expansion]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
