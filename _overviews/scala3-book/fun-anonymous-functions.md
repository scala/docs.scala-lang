---
title: Anonymous Functions
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
languages: [ru, zh-cn]
num: 28
previous-page: fun-intro
next-page: fun-function-variables
---

An anonymous function---also referred to as a *lambda*---is a block of code that’s passed as an argument to a higher-order function.
Wikipedia defines an [anonymous function](https://en.wikipedia.org/wiki/Anonymous_function) as, “a function definition that is not bound to an identifier.”

For example, given a list like this:

{% tabs fun-anonymous-1 %}
{% tab 'Scala 2 and 3' %}
```scala
val ints = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

You can create a new list by doubling each element in `ints`, using the `List` class `map` method and your custom anonymous function:

{% tabs fun-anonymous-2 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)   // List(2, 4, 6)
```
{% endtab %}
{% endtabs %}

As the comment shows, `doubledInts` contains the list, `List(2, 4, 6)`.
In that example, this portion of the code is an anonymous function:

{% tabs fun-anonymous-3 %}
{% tab 'Scala 2 and 3' %}
```scala
_ * 2
```
{% endtab %}
{% endtabs %}

This is a shorthand way of saying, “Multiply a given element by 2.”

## Longer forms

Once you’re comfortable with Scala, you’ll use that form all the time to write anonymous functions that use one variable at one spot in the function.
But if you prefer, you can also write them using longer forms, so in addition to writing this code:

{% tabs fun-anonymous-4 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

you can also write it using these forms:

{% tabs fun-anonymous-5 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
val doubledInts = ints.map((i) => i * 2)
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

All of these lines have the exact same meaning: Double each element in `ints` to create a new list, `doubledInts`.
(The syntax of each form is explained in a few moments.)

If you’re familiar with Java, it may help to know that those `map` examples are the equivalent of this Java code:

{% tabs fun-anonymous-5-b %}
{% tab 'Java' %}
```java
List<Integer> ints = List.of(1, 2, 3);
List<Integer> doubledInts = ints.stream()
                                .map(i -> i * 2)
                                .collect(Collectors.toList());
```
{% endtab %}
{% endtabs %}

## Shortening anonymous functions

When you want to be explicit, you can write an anonymous function using this long form:

{% tabs fun-anonymous-6 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

The anonymous function in that expression is this:

{% tabs fun-anonymous-7 %}
{% tab 'Scala 2 and 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}
{% endtabs %}

If you’re not familiar with this syntax, it helps to think of the `=>` symbol as a transformer, because the expression *transforms* the parameter list on the left side of the symbol (an `Int` variable named `i`) into a new result using the algorithm on the right side of the `=>` symbol (in this case, an expression that doubles the `Int`).

### Shortening that expression

This long form can be shortened, as will be shown in the following steps.
First, here’s that longest and most explicit form again:

{% tabs fun-anonymous-8 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i: Int) => i * 2)
```
{% endtab %}
{% endtabs %}

Because the Scala compiler can infer from the data in `ints` that `i` is an `Int`, the `Int` declaration can be removed:

{% tabs fun-anonymous-9 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map((i) => i * 2)
```
{% endtab %}
{% endtabs %}

Because there’s only one argument, the parentheses around the parameter `i` aren’t needed:

{% tabs fun-anonymous-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(i => i * 2)
```
{% endtab %}
{% endtabs %}

Because Scala lets you use the `_` symbol instead of a variable name when the parameter appears only once in your function, the code can be simplified even more:

{% tabs fun-anonymous-11 %}
{% tab 'Scala 2 and 3' %}
```scala
val doubledInts = ints.map(_ * 2)
```
{% endtab %}
{% endtabs %}

### Going even shorter

In other examples, you can simplify your anonymous functions further.
For instance, beginning with the most explicit form, you can print each element in `ints` using this anonymous function with the `List` class `foreach` method:

{% tabs fun-anonymous-12 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach((i: Int) => println(i))
```
{% endtab %}
{% endtabs %}

As before, the `Int` declaration isn’t required, and because there’s only one argument, the parentheses around `i` aren’t needed:

{% tabs fun-anonymous-13 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(i => println(i))
```
{% endtab %}
{% endtabs %}

Because `i` is used only once in the body of the function, the expression can be further simplified with the `_` symbol:

{% tabs fun-anonymous-14 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(println(_))
```
{% endtab %}
{% endtabs %}

Finally, if an anonymous function consists of one method call that takes a single argument, you don’t need to explicitly name and specify the argument, so you can finally write only the name of the method (here, `println`):

{% tabs fun-anonymous-15 %}
{% tab 'Scala 2 and 3' %}
```scala
ints.foreach(println)
```
{% endtab %}
{% endtabs %}
