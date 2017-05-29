---
layout: inner-page-no-masthead
title: Named Arguments

disqus: true

tutorial: scala-tour
categories: tour
num: 34
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax
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

```
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName(last = "Smith", "john")  // Does not compile
```

Note that named arguments do not work with calls to Java methods.
