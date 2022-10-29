---
title: Contextual Abstractions
type: section
description: This section provides an introduction to Contextual Abstractions in Scala 3.
languages: [zh-cn]
num: 14
previous-page: taste-collections
next-page: taste-toplevel-definitions
---


{% comment %}
TODO: Now that this is a separate section, it needs a little more content.
{% endcomment %}

Under certain circumstances, you can omit some parameters of method calls that are considered repetitive.

Those parameters are called _Context Parameters_ because they are inferred by the compiler from the context surrounding the method call.

For instance, consider a program that sorts a list of addresses by two criteria: the city name and then street name.

{% tabs contextual_1 %}
{% tab 'Scala 2 and 3' for=contextual_1 %}

```scala
val addresses: List[Address] = ...

addresses.sortBy(address => (address.city, address.street))
```

{% endtab %}
{% endtabs %}

The `sortBy` method takes a function that returns, for every address, the value to compare it with the other addresses.
In this case, we pass a function that returns a pair containing the city name and the street name.

Note that we only indicate _what_ to compare, but not _how_ to perform the comparison.
How does the sorting algorithm know how to compare pairs of `String`?

Actually, the `sortBy` method takes a second parameter---a context parameter---that is inferred by the compiler.
It does not appear in the above example because it is supplied by the compiler.

This second parameter implements the _how_ to compare.
It is convenient to omit it because we know `String`s are generally compared using the lexicographic order.

However, it is also possible to pass it explicitly:

{% tabs contextual_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(Ordering.Tuple2(Ordering.String, Ordering.String))
```

{% endtab %}
{% tab 'Scala 3' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(using Ordering.Tuple2(Ordering.String, Ordering.String))
```

in Scala 3 `using` in an argument list to `sortBy` signals passing the context parameter explicitly, avoiding ambiguity.

{% endtab %}
{% endtabs %}

In this case, the `Ordering.Tuple2(Ordering.String, Ordering.String)` instance is exactly the one that is otherwise inferred by the compiler.
In other words both examples produce the same program.

_Contextual Abstractions_ are used to avoid repetition of code.
They help developers write pieces of code that are extensible and concise at the same time.

For more details, see the [Contextual Abstractions chapter][contextual] of this book, and also the [Reference documentation][reference].

[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}/overview.html
