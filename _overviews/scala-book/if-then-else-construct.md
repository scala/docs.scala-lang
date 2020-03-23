---
type: section
layout: multipage-overview
title: The if/then/else Construct
description: This page demonstrates Scala's if/then/else construct, including several examples you can try in the REPL.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 14
outof: 54
previous-page: control-structures
next-page: for-loops
---



A basic Scala `if` statement looks like this:

```scala
if (a == b) doSomething()
```

You can also write that statement like this:

```scala
if (a == b) {
    doSomething()
}
```

The `if`/`else` construct looks like this:

```scala
if (a == b) {
    doSomething()
} else {
    doSomethingElse()
}
```

The complete Scala if/else-if/else expression looks like this:

```scala
if (test1) {
    doX()
} else if (test2) {
    doY()
} else {
    doZ()
}
```


## `if` expressions always return a result

A great thing about the Scala `if` construct is that it always returns a result. You can ignore the result as we did in the previous examples, but a more common approach — especially in functional programming — is to assign the result to a variable:

```scala
val minValue = if (a < b) a else b
```

This is cool for several reasons, including the fact that it means that Scala doesn’t require a special “ternary” operator.



## Aside: Expression-oriented programming

As a brief note about programming in general, when every expression you write returns a value, that style is referred to as *expression-oriented programming*, or EOP. This is an example of an *expression*:

```scala
val minValue = if (a < b) a else b
```

Conversely, lines of code that don’t return values are called *statements*, and they are used for their *side-effects*. For example, these lines of code don’t return values, so they are used for their side effects:

```scala
if (a == b) doSomething()
println("Hello")
```

The first example runs the `doSomething` method as a side effect when `a` is equal to `b`. The second example is used for the side effect of writing a string to STDOUT. As you learn more about Scala you’ll find yourself writing more *expressions* and fewer *statements*. The differences between expressions and statements will also become more apparent.







