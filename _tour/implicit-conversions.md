---
layout: tour
title: Implicit Conversions
partof: scala-tour

num: 29
next-page: polymorphic-methods
previous-page: implicit-parameters

redirect_from: "/tutorials/tour/implicit-conversions.html"
---

{% tabs implicit-conversion-defn class=tabs-scala-version %}
{% tab 'Scala 2' %}
In Scala 2, an implicit conversion from type `S` to type `T` is defined by an [implicit value]({% link _tour/implicit-parameters.md %}) which has function type `S => T`, or by an implicit method convertible to a value of that type.
{% endtab %}
{% tab 'Scala 3' %}
In Scala 3, an implicit conversion from type `S` to type `T` is defined by a [given instance]({% link _tour/implicit-parameters.md %}) which has type `scala.Conversion[S, T]`, or by an implicit method which can be eta-expanded to the function type `S => T`.
{% endtab %}
{% endtabs %}

Implicit conversions are applied in two situations:

1. If an expression `e` is of type `S`, and `S` does not conform to the expression's expected type `T`.
2. In a selection `e.m` with `e` of type `S`, if the selector `m` does not denote a member of `S`.

In the first case, a conversion `c` is searched for which is applicable to `e` and whose result type conforms to `T`.

An example is to pass a `scala.Int`, e.g. `x`, to a method that expects `scala.Long`. In this case, the implicit conversion `Int.int2long(x)` is inserted.


In the second case, a conversion `c` is searched for which is applicable to `e` and whose result contains a member named `m`.

An example is to compare two strings `"foo" < "bar"`. In this case, `String` has no member `<`, so the implicit conversion `Predef.augmentString("foo") < "bar"` is inserted.

**Beware the power of implicit conversions:**

{% tabs implicit-conversion-warning class=tabs-scala-version %}
{% tab 'Scala 2' %}
Because implicit conversions can have pitfalls if used indiscriminately the compiler warns when compiling the implicit conversion definition.

To turn off the warnings take either of these actions:

* Import `scala.language.implicitConversions` into the scope of the implicit conversion definition
* Invoke the compiler with `-language:implicitConversions`

No warning is emitted when the conversion is applied by the compiler.
{% endtab %}
{% tab 'Scala 3' %}
Because implicit conversions can have pitfalls if used indiscriminately the compiler warns in two situations:
- when compiling the implicit conversion definition (for Scala 2 style conversions).
- at the call site where a given instance of `scala.Conversion` is inserted as a conversion.

To turn off the warnings take either of these actions:

- Import `scala.language.implicitConversions` into the scope of:
  - the implicit conversion definition (for Scala 2 style conversions)
  - the call site (when an inserted conversion was defined by a given instance of `scala.Conversion`)
- Invoke the compiler with `-language:implicitConversions`
{% endtab %}
{% endtabs %}
