---
title: Eta Expansion
type: section
description: This page discusses Eta Expansion, the Scala technology that automatically and transparently converts methods into functions.
num: 30
previous-page: fun-function-variables
next-page: fun-hofs
---


When you look at the Scaladoc for the `map` method on Scala collections classes, you see that it’s defined to accept a *function*:

```scala
def map[B](f: (A) => B): List[B]
           -----------
```

Indeed, the Scaladoc clearly states, “`f` is the *function* to apply to each element.”
But despite that, somehow you can pass a *method* into `map`, and it still works:

```scala
def times10(i: Int) = i * 10   // a method
List(1, 2, 3).map(times10)     // List(10,20,30)
```

Have you ever wondered how this works---how you can pass a *method* into `map`, which expects a *function*?

The technology behind this is known as *Eta Expansion*.
It converts an expression of *method type* to an equivalent expression of *function type*, and it does so seamlessly and quietly.



## The differences between methods and functions

{% comment %}
NOTE: I got the following “method” definition from this page (https://dotty.epfl.ch/docs/reference/changed-features/eta-expansion-spec.html), but I’m not sure it’s 100% accurate now that methods can exist outside of classes/traits/objects.
I’ve made a few changes to that description that I hope are more accurate and up to date.
{% endcomment %}


{% comment %}
TODO: link to Toplevel definitions
{% endcomment %}

Historically, *methods* have been a part of the definition of a class, although in Scala 3 you can now have methods outside of classes, such as Toplevel definitions and [extension methods][extension].

Unlike methods, *functions* are complete objects themselves, making them first-class entities.

Their syntax is also different.
This example shows how to define a method and a function that perform the same task, determining if the given integer is even:

```scala
def isEvenMethod(i: Int) = i % 2 == 0         // a method
val isEvenFunction = (i: Int) => i % 2 == 0   // a function
```

The function truly is an object, so you can use it just like any other variable, such as putting it in a list:

```scala
val functions = List(isEvenFunction)
```

Conversely, a method technically isn’t an object, so in Scala 2 you couldn’t put a method in a `List`, at least not directly, as shown in this example:

```scala
// this example shows the Scala 2 error message
val methods = List(isEvenMethod)
                   ^
error: missing argument list for method isEvenMethod
Unapplied methods are only converted to functions when a function type is expected.
You can make this conversion explicit by writing `isEvenMethod _` or `isEvenMethod(_)` instead of `isEvenMethod`.
```

As shown in that error message, there is a manual way to convert a method into a function in Scala 2, but the important part for Scala 3 is that the Eta Expansion technology is improved, so now when you attempt to use a method as a variable, it just works---you don’t have to handle the manual conversion yourself:

```scala
val functions = List(isEvenFunction)   // works
val methods = List(isEvenMethod)       // works
```

For the purpose of this introductory book, the important things to know are:

- Eta Expansion is the Scala technology that lets you use methods just like functions
- The technology has been improved in Scala 3 to be almost completely seamless

For more details on how this works, see the [Eta Expansion page][eta_expansion] in the Reference documentation.



[eta_expansion]: {{ site.scala3ref }}/changed-features/eta-expansion.html
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
