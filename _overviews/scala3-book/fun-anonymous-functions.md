---
title: Anonymous Functions
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
num: 28
previous-page: fun-intro
next-page: fun-function-variables
---



An anonymous function---also referred to as a *lambda*---is a block of code that’s passed as an argument to a higher-order function.
Wikipedia defines an [anonymous function](https://en.wikipedia.org/wiki/Anonymous_function) as, “a function definition that is not bound to an identifier.”

For example, given a list like this:

```scala
val ints = List(1, 2, 3)
```

You can create a new list by doubling each element in `ints`, using the `List` class `map` method and your custom anonymous function:

```scala
val doubledInts = ints.map(_ * 2)   // List(2, 4, 6)
```

As the comment shows, `doubledInts` contains the list, `List(2, 4, 6)`.
In that example, this portion of the code is an anonymous function:

```scala
_ * 2
```

This is a shorthand way of saying, “Multiply a given element by 2.”



## Longer forms

Once you’re comfortable with Scala, you’ll use that form all the time to write anonymous functions that use one variable at one spot in the function.
But if you prefer, you can also write them using longer forms, so in addition to writing this code:

```scala
val doubledInts = ints.map(_ * 2)
```

you can also write it using these forms:

```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map((i) => i * 2)
val doubledInts = ints.map(i => i * 2)
```

All of these lines have the exact same meaning: Double each element in `ints` to create a new list, `doubledInts`.
(The syntax of each form is explained in a few moments.)

If you’re familiar with Java, it may help to know that those `map` examples are the equivalent of this Java code:

```java
List<Integer> ints = List.of(1, 2, 3);
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```



## Shortening anonymous functions

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

This long form can be shortened, as will be shown in the following steps.
First, here’s that longest and most explicit form again:

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

Because Scala lets you use the `_` symbol instead of a variable name when the parameter appears only once in your function, the code can be simplified even more:

```scala
val doubledInts = ints.map(_ * 2)
```

### Going even shorter

In other examples, you can simplify your anonymous functions further.
For instance, beginning with the most explicit form, you can print each element in `ints` using this anonymous function with the `List` class `foreach` method:

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

Finally, if an anonymous function consists of one statement that takes a single argument, you don’t need to explicitly name and specify the argument, so the statement can finally be reduced to this:

```scala
ints.foreach(println)
```


