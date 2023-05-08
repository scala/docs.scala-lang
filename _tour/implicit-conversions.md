---
layout: tour
title: Implicit Conversions
partof: scala-tour

num: 29
next-page: polymorphic-methods
previous-page: implicit-parameters

redirect_from: "/tutorials/tour/implicit-conversions.html"
---

Implicit conversions are a powerful Scala feature that enable two common use cases:
- allow users to supply an argument of one type, as if it were another type, to avoid boilerplate.
- in Scala 2, to provide additional members to closed classes (replaced by [extension methods][exts] in Scala 3).

### Detailed Explanation
{% tabs implicit-conversion-defn class=tabs-scala-version %}
{% tab 'Scala 2' %}
In Scala 2, an implicit conversion from type `S` to type `T` is defined by either an [implicit class]({% link _overviews/core/implicit-classes.md %}) `T` that has a single parameter of type `S`, an [implicit value]({% link _tour/implicit-parameters.md %}) which has function type `S => T`, or by an implicit method convertible to a value of that type.
{% endtab %}
{% tab 'Scala 3' %}
In Scala 3, an implicit conversion from type `S` to type `T` is defined by a [given instance]({% link _tour/implicit-parameters.md %}) which has type `scala.Conversion[S, T]`. For compatibility with Scala 2, they can also be defined by an implicit method (read more in the Scala 2 tab).
{% endtab %}
{% endtabs %}

Implicit conversions are applied in two situations:

1. If an expression `e` is of type `S`, and `S` does not conform to the expression's expected type `T`.
2. In a selection `e.m` with `e` of type `S`, if the selector `m` does not denote a member of `S`.

In the first case, a conversion `c` is searched for, which is applicable to `e` and whose result type conforms to `T`.

An example is to pass a `scala.Int`, e.g. `x`, to a method that expects `scala.Long`. In this case, the implicit conversion `Int.int2long(x)` is inserted.


In the second case, a conversion `c` is searched for, which is applicable to `e` and whose result contains a member named `m`.

An example is to compare two strings `"foo" < "bar"`. In this case, `String` has no member `<`, so the implicit conversion `Predef.augmentString("foo") < "bar"` is inserted. (`scala.Predef` is automatically imported into all Scala programs.)

Further reading: [Implicit Conversions (in the Scala book)]({% link _overviews/scala3-book/ca-implicit-conversions.md %}).

[exts]: {% link _overviews/scala3-book/ca-extension-methods.md %}
