---
layout: tour
title: Multiple Parameter Lists

discourse: true

partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

redirect_from: "/tutorials/tour/multiple-parameter-lists.html"
---

Methods may define multiple parameter lists. When a method is called with a fewer number of parameter lists, then this will yield a function taking the missing parameter lists as its arguments.

Here is an example, defined in [Traversable](/overviews/collections/trait-traversable.html) trait from Scala collections:

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```

`foldLeft` applies a binary operator `op` to an initial value `z` and all elements of this traversable, going left to right. Here is an example of its usage:

```tut
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m: Int, n: Int) => m + n)
print(res) // 55
```

Starting with an initial value of 0, `foldLeft` applies the function `(m: Int, n: Int) => m + n` to each element in the List and the previous accumulated value.

Multiple parameter lists have a more verbose invocation syntax; and hence should be used sparingly. Suggested use cases include:

1. ##### Implicit parameters
    To specify certain parameters in a parameter list as `implicit`, multiple parameter lists should be used. An example of this is:

    ```
    def execute(arg: Int)(implicit ec: ExecutionContext) = ???
    ```

2. ##### Single functional parameter
    In case of a single functional parameter, like `op` in the case of `foldLeft` above, multiple parameter lists allow a concise syntax to pass an anonymous function to the method.
