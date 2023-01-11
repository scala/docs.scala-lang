---
title: Eta-Expansion
type: section
description: This page discusses Eta-Expansion, the Scala technology that automatically and transparently converts methods into functions.
languages: [ru, zh-cn]
num: 31
previous-page: fun-function-variables
next-page: fun-hofs
---


When you look at the Scaladoc for the `map` method on Scala collections classes, you see that it’s defined to accept a _function_ value:

{% tabs fun_1 %}
{% tab 'Scala 2 and 3' for=fun_1 %}

```scala
def map[B](f: A => B): List[B]
//            ^^^^^^ function type from `A` to `B`
```

{% endtab %}
{% endtabs %}

Indeed, the Scaladoc clearly states, “`f` is the _function_ to apply to each element.”
But despite that, somehow you can pass a _method_ into `map`, and it still works:

{% tabs fun_2 %}
{% tab 'Scala 2 and 3' %}

```scala
def times10(i: Int) = i * 10   // a method
List(1, 2, 3).map(times10)     // List(10,20,30)
```

{% endtab %}
{% endtabs %}

Why does this work? The process behind this is known as _eta-expansion_.
It converts an expression of _method type_ to an equivalent expression of _function type_, and it does so seamlessly and quietly.

## The differences between methods and functions

The key difference between methods and functions is that _a function is an object_, i.e. it is an instance of a class, and in turn has its own methods (e.g. try `f.apply` on a function `f`).

_Methods_ are not values that can be passed around, i.e. they can only be called via method application (e.g. `foo(arg1, arg2, ...)`). Methods can be _converted_ to a value by creating a function value that will call the method when supplied with the required arguments. This is known as eta-expansion.

More concretely: with automatic eta-expansion, the compiler automatically converts any _method reference_, without supplied arguments, to an equivalent _anonymous function_ that will call the method. For example, the reference to `times10` in the code above gets rewritten to `x => times10(x)`, as seen here:

{% tabs fun_2_expanded %}
{% tab 'Scala 2 and 3' %}

```scala
def times10(i: Int) = i * 10
List(1, 2, 3).map(x => times10(x)) // eta expansion of `.map(times10)`
```

{% endtab %}
{% endtabs %}

> For the curious, the term eta-expansion has its origins in the [Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

## When does eta-expansion happen?

Automatic eta-expansion is a desugaring that is context-dependent (i.e. the expansion conditionally activates, depending on the surrounding code of the method reference.)

{% tabs fun_5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

In Scala 2 eta-expansion only occurs automatically when the expected type is a function type.
For example, the following will fail:
```scala
def isLessThan(x: Int, y: Int): Boolean = x < y

val methods = List(isLessThan)
//                 ^^^^^^^^^^
// error: missing argument list for method isLessThan
// Unapplied methods are only converted to functions when a function type is expected.
// You can make this conversion explicit by writing `isLessThan _` or `isLessThan(_,_)` instead of `isLessThan`.
```

See [below](#manual-eta-expansion) for how to solve this issue with manual eta-expansion.
{% endtab %}

{% tab 'Scala 3' %}

New to Scala 3, method references can be used everywhere as a value, they will be automatically converted to a function object with a matching type. e.g.

```scala
def isLessThan(x: Int, y: Int): Boolean = x < y

val methods = List(isLessThan)       // works
```

{% endtab %}
{% endtabs %}

## Manual eta-expansion

You can always manually eta-expand a method to a function value, here are some examples how:

{% tabs fun_6 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val methodsA = List(isLessThan _)               // way 1: expand all parameters
val methodsB = List(isLessThan(_, _))           // way 2: wildcard application
val methodsC = List((x, y) => isLessThan(x, y)) // way 3: anonymous function
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
val methodsA = List(isLessThan(_, _))           // way 1: wildcard application
val methodsB = List((x, y) => isLessThan(x, y)) // way 2: anonymous function
```

{% endtab %}
{% endtabs %}

## Summary

For the purpose of this introductory book, the important things to know are:

- eta-expansion is a helpful desugaring that lets you use methods just like functions,
- the automatic eta-expansion been improved in Scala 3 to be almost completely seamless.

For more details on how this works, see the [Eta Expansion page][eta_expansion] in the Reference documentation.

[eta_expansion]: {{ site.scala3ref }}/changed-features/eta-expansion.html
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
