---
title: Contextual Abstractions
type: section
description: This section provides an introduction to Contextual Abstractions in Scala 3.
num: 12
previous-page: taste-collections
next-page: taste-summary
---


{% comment %}
TODO: Now that this is a separate section, it needs a little more content.
{% endcomment %}


Under certain circumstances, the Scala compiler can “write” some parts of your programs. For instance, consider a program that sorts a list of addresses by two criteria, city name and then street name:

```scala
val addresses: List[Address] = ...
addresses.sortBy(address => (address.city, address.street))
```

The sorting algorithm needs to compare addresses by first comparing their city names, and then also their street names when the city names are the same. However, with the use of contextual abstraction, you don’t need to manually define this ordering relation, because the compiler is able to summon it automatically based on an existing ordering relation for comparing string values.

For more details, see the [Contextual Abstractions chapter][contextual] of this book, and also in the [Reference documentation][reference].



[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}/overview.html
