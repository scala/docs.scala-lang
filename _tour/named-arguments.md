---
layout: tour
title: Named Arguments

discourse: true

partof: scala-tour

num: 34
next-page: packages-and-imports
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

redirect_from: "/tutorials/tour/named-arguments.html"
---

When calling methods, you can label the arguments with their parameter names like so:

```tut
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```
Notice how the order of named arguments can be rearranged. However, if some arguments are named and others are not, the unnamed arguments must come first and in the order of their parameters in the method signature.

```tut:fail
printName(last = "Smith", "john") // error: positional after named argument
```

Note that named arguments do not work with calls to Java methods.
