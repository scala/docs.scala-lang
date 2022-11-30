---
title: Function Variables
type: section
description: This page shows how to use function variables in Scala.
languages: [ru, zh-cn]
num: 29
previous-page: fun-anonymous-functions
next-page: fun-eta-expansion
---



Going back to this example from the previous section:

{% tabs fun-function-variables-1 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

We noted that this part of the expression is an anonymous function:

{% tabs fun-function-variables-2 %}
{% tab 'Scala 2 and 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

The reason it’s called *anonymous* is because it’s not assigned to a variable, and therefore doesn’t have a name.

However, an anonymous function---also known as a *function literal*---can be assigned to a variable to create a *function variable*:

{% tabs fun-function-variables-3 %}
{% tab 'Scala 2 and 3' %}
```scala
val double = (i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

This creates a function variable named `double`.
In this expression, the original function literal is on the right side of the `=` symbol:

{% tabs fun-function-variables-4 %}
{% tab 'Scala 2 and 3' %}
```scala
val double = (i: Int) => i * 2
             -----------------
```
{% endtab %}
{% endtabs %}

the new variable name is on the left side:

{% tabs fun-function-variables-5 %}
{% tab 'Scala 2 and 3' %}
```scala
val double = (i: Int) => i * 2
    ------
```
{% endtab %}
{% endtabs %}

and the function’s parameter list is underlined here:

{% tabs fun-function-variables-6 %}
{% tab 'Scala 2 and 3' %}
```scala
val double = (i: Int) => i * 2
             --------
```
{% endtab %}
{% endtabs %}

Like the parameter list for a method, this means that the `double` function takes one parameter, an `Int` named `i`.
You can see in the REPL that `double` has the type `Int => Int`, meaning that it takes a single `Int` parameter and returns an `Int`:

{% tabs fun-function-variables-7 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> val double = (i: Int) => i * 2
val double: Int => Int = ...
```
{% endtab %}
{% endtabs %}


### Invoking the function

Now you can call the `double` function like this:

{% tabs fun-function-variables-8 %}
{% tab 'Scala 2 and 3' %}
```scala
val x = double(2)   // 4
```
{% endtab %}
{% endtabs %}

You can also pass `double` into a `map` call:

{% tabs fun-function-variables-9 %}
{% tab 'Scala 2 and 3' %}
```scala
List(1, 2, 3).map(double)   // List(2, 4, 6)
```
{% endtab %}
{% endtabs %}

Furthermore, when you have other functions of the `Int => Int` type:

{% tabs fun-function-variables-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val triple = (i: Int) => i * 3
```
{% endtab %}
{% endtabs %}

you can store them in a `List` or `Map`:

{% tabs fun-function-variables-11 %}
{% tab 'Scala 2 and 3' %}
```scala
val functionList = List(double, triple)

val functionMap = Map(
  "2x" -> double,
  "3x" -> triple
)
```
{% endtab %}
{% endtabs %}

If you paste those expressions into the REPL, you’ll see that they have these types:

{% tabs fun-function-variables-12 %}
{% tab 'Scala 2 and 3' %}
````
// a List that contains functions of the type `Int => Int`
functionList: List[Int => Int]

// a Map whose keys have the type `String`, and whose
// values have the type `Int => Int`
functionMap: Map[String, Int => Int]
````
{% endtab %}
{% endtabs %}



## Key points

The important parts here are:

- To create a function variable, just assign a variable name to a function literal
- Once you have a function, you can treat it like any other variable, i.e., like a `String` or `Int` variable

And thanks to the improved [Eta Expansion][eta_expansion] functionality in Scala 3, you can treat *methods* in the same way.



[eta_expansion]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
