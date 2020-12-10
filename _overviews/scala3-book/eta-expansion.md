---
title: Eta Expansion in Scala 3
type: section
description: This page discusses Eta Expansion, the Scala technology that automatically and transparently converts methods into functions.
num: 43
previous-page: anonymous-functions
next-page: higher-order-functions
---



## Background

When you look at the Scaladoc for the `map` method on Scala collections classes, you see that it’s defined to accept a *function*:

```scala
def map[B](f: (A) => B): List[B]
           -----------
```

Indeed, the Scaladoc clearly states, “`f` is the function to apply to each element.” But despite that, somehow you can pass a *method* into `map`, and it still works:

```scala
def times10(i: Int) = i * 10   // a method
List(1,2,3).map(times10)       // List(10,20,30)
```

Have you ever wondered how this works — how you can pass a *method* into `map`, which expects a *function*?


### Eta Expansion

The technology behind this is known as *Eta Expansion*. It converts an expression of method type to an equivalent expression of function type, and it does so seamlessly and quietly.


### The differences between methods and functions

{% comment %}
TODO: I got the following “method” definition from this page (https://dotty.epfl.ch/docs/reference/changed-features/eta-expansion-spec.html), but I’m not sure it’s 100% accurate now that methods can exist outside of classes/traits/objects. I’m looking for a clear way to distinguish between methods and functions.
{% endcomment %}

Technically, *methods* are part of the definition of a class, while *functions* are complete objects themselves, making them first-class entities. For example, functions can be assigned to variables, while methods cannot.

Their syntax is also different. This example shows how to define a method and a function that perform the same task, determining if the given integer is even:

```scala
def isEvenMethod(i: Int) = i % 2 == 0         // a method
val isEvenFunction = (i: Int) => i % 2 == 0   // a function
```

The function truly is an object, so you can use it just like any other variable, such as putting it in a list:

```scala
val functions = List(isEvenFunction)
```

Conversely, a method technically isn’t an object, so in Scala 2 you couldn’t put a method in a `List`, at least not directly, as shown in this error message:

```scala
// this example shows the Scala 2 error message
val methods = List(isEvenMethod)
                   ^
error: missing argument list for method isEvenMethod
Unapplied methods are only converted to functions when a function type is expected.
You can make this conversion explicit by writing `isEvenMethod _` or `isEvenMethod(_)` instead of `isEvenMethod`.
```

As shown in that text, there is a manual way to convert a method into a function in Scala 2, but the important part for Scala 3 is that the Eta Expansion technology is improved, so now when you attempt to use a method as a variable, it just works — you don’t have to handle the manual conversion yourself:

```scala
val functions = List(isEvenFunction)   // works
val methods = List(isEvenMethod)       // works
```




