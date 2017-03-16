---
layout: tutorial
title: Anonymous Function Syntax

disqus: true

tutorial: scala-tour
categories: tour
num: 7
next-page: higher-order-functions
previous-page: mixin-class-composition
prerequisite-knowledge: string-interpolation, expression-blocks
---

Anonymous functions are functions which are not assigned to an identifier. On the left of the arrow `=>` is a parameter list, and on the right is an expression.
```tut
(x: Int) => x + 1
```

Anonymous functions are not very useful by themselves but they have a value which can be used as an argument of another function or the return value of another function. This will be covered later in the tour.

It is also possible to define functions with multiple parameters and/or an expression block:

```tut
(x: Int, y: Int) => {
  val xSquared = x * x
  val ySquared = y * y
  s"($xSquared, $ySquared)"
}
```

or with no parameter:

```tut
() => System.getProperty("user.dir")
```

The types of the three functions defined above are written like so:

```
Int => Int
(Int, Int) => String
() => String
```
