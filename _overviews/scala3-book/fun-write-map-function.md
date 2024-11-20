---
title: Write Your Own map Method
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
languages: [ru, zh-cn]
num: 33
previous-page: fun-hofs
next-page: fun-write-method-returns-function
---


Now that you’ve seen how to write your own higher-order functions, let’s take a quick look at a more real-world example.

Imagine for a moment that the `List` class doesn’t have its own `map` method, and you want to write your own.
A good first step when creating functions is to accurately state the problem.
Focusing only on a `List[Int]`, you state:

> I want to write a `map` method that can be used to apply a function to each element in a `List[Int]` that it’s given, returning the transformed elements as a new list.

Given that statement, you start to write the method signature.
First, you know that you want to accept a function as a parameter, and that function should transform an `Int` into some type `A`, so you write:

{% tabs map-accept-func-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def map(f: (Int) => A)
```
{% endtab %}
{% endtabs %}

The syntax for using a type parameter requires declaring it in square brackets `[]` before the parameter list, so you add that:

{% tabs map-type-symbol-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def map[A](f: (Int) => A)
```
{% endtab %}
{% endtabs %}

Next, you know that `map` should also accept a `List[Int]`:

{% tabs map-list-int-param-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int])
```
{% endtab %}
{% endtabs %}

Finally, you also know that `map` returns a transformed `List` that contains elements of the type `A`:

{% tabs map-with-return-type-definition %}
{% tab 'Scala 2 and 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] = ???
```
{% endtab %}
{% endtabs %}

That takes care of the method signature.
Now all you have to do is write the method body.
A `map` method applies the function it’s given to every element in the list it’s given to produce a new, transformed list.
One way to do this is with a `for` expression:
{% tabs for-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}

`for` expressions often make code surprisingly simple, and for our purposes, that ends up being the entire method body.

Putting it together with the method signature, you now have a standalone `map` method that works with a `List[Int]`:

{% tabs map-function class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}


### Make it generic

As a bonus, notice that the `for` expression doesn’t do anything that depends on the type inside the `List` being `Int`.
Therefore, you can replace `Int` in the type signature with the type parameter `B`:

{% tabs map-function-full-generic class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
def map[A, B](f: (B) => A, xs: List[B]): List[A] =
  for (x <- xs) yield f(x)
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
def map[A, B](f: (B) => A, xs: List[B]): List[A] =
  for x <- xs yield f(x)
```
{% endtab %}
{% endtabs %}

Now you have a `map` method that works with any `List`.

These examples demonstrate that `map` works as desired:

{% tabs map-use-example %}
{% tab 'Scala 2 and 3' %}
```scala
def double(i : Int): Int = i * 2
map(double, List(1, 2, 3))            // List(2, 4, 6)

def strlen(s: String): Int = s.length
map(strlen, List("a", "bb", "ccc"))   // List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

Now that you’ve seen how to write methods that accept functions as input parameters, let’s look at methods that return functions.


