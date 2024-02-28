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
  println(s"$first $last")

printName("John", "Public")  // Prints "John Public"
printName(first = "John", last = "Public")  // Prints "John Public"
printName(last = "Public", first = "John")  // Prints "John Public"
printName("Elton", last = "John")  // Prints "Elton John"
```
{% endtab %}

{% endtabs %}

This is useful when two parameters have the same type and the arguments could be accidentally swapped.

Notice that named arguments can be written in any order. However, once the arguments are not in parameter order, reading from left to right, then the rest of the arguments must be named.

In the following example, named arguments enable the middle parameter to be omitted. But in the error case, the first argument is out of order, so the second argument must be named.

{% tabs named-arguments-when-error %}

{% tab 'Scala 2 and 3' for=named-arguments-when-error %}
```scala mdoc:fail
def printFullName(first: String, middle: String = "Q.", last: String): Unit =
  println(s"$first $middle $last")

printFullName(first = "John", last = "Public")  // Prints "John Q. Public"
printFullName("John", last = "Public")  // Prints "John Q. Public"
printFullName("John", middle = "Quincy", "Public")  // Prints "John Quincy Public"
printFullName(last = "Public", first = "John")  // Prints "John Q. Public"
printFullName(last = "Public", "John")  // error: positional after named argument
```
{% endtab %}

{% endtabs %}

Named arguments work with calls to Java methods, but only if the Java library in question was compiled with the `-parameters` flag.
