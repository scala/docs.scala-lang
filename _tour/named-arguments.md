---
layout: tour
title: Named Arguments
partof: scala-tour

num: 6
next-page: traits
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

redirect_from:
  - "/tutorials/tour/named-arguments.html"
  - "/tutorials/tour/named-parameters.html"
---

When calling methods, you can label the arguments with their parameter names like so:

{% tabs named-arguments-when-good %}

{% tab 'Scala 2 and 3' for=named-arguments-when-good %}
```scala mdoc
def printName(first: String, last: String): Unit =
  println(first + " " + last)

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```
{% endtab %}

{% endtabs %}

Notice how the order of named arguments can be rearranged. However, if some arguments are named and others are not, the unnamed arguments must come first and in the order of their parameters in the method signature.

{% tabs named-arguments-when-error %}

{% tab 'Scala 2 and 3' for=named-arguments-when-error %}
```scala mdoc:fail
printName(last = "Smith", "john") // error: positional after named argument
```
{% endtab %}

{% endtabs %}

Named arguments work with calls to Java methods, but only if the Java library in question was compiled with `-parameters`.
