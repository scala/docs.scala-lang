---
layout: tour
title: For Comprehensions

discourse: true

partof: scala-tour

num: 17
next-page: generic-classes
previous-page: extractor-objects

redirect_from: "/tutorials/tour/for-comprehensions.html"
---

Scala offers a lightweight notation for expressing *sequence comprehensions*. For-comprehensions have two basic syntaxes:

```tut
// 1: generally for one-liners
for (x1 <- e1; ...; xn <- en) yield e

// 2: generally for multi-line comprehensions
for {
  x1 <- e1
  ...
  xn <- en
} yield e
```

Each `x <- e` form is called a *generator* and introduces `x` as a value (called a *binding*) in the scope of the comprehension from that point. Comprehensions may have one or more generators. A comprehension evaluates the body `e` for each binding and returns a container of these values.

Here is a comprehension for creating a list of 5 square numbers:

```tut
val squares = for (num <- 1 to 5) yield num * num
// Vector(1, 4, 9, 16, 25)
```

To create a protocol for greeting by handshake between a group of people:

```tut
val avengers = List("Steve", "Tony", "Stan")
val leaguers = List("Clark", "Diana", "Bruce")

val handshakes = for {
  avenger <- avengers
  leaguer <- leaguers
} yield (avenger, leaguer)
// List((Steve,Clark), (Steve,Diana), (Steve,Bruce), (Tony,Clark), (Tony,Diana), (Tony,Bruce), (Stan,Clark), (Stan,Diana), (Stan,Bruce))
```

## Filters

For-comprehensions can optionally include a *filter* after each generator. A filter skips binding a value if its criterion isn't met. Here's an example with filters to generate some [Pythagorean triples](https://en.wikipedia.org/wiki/Pythagorean_triple):

```tut
val naturals = 1 to 20

val pythagoreanTriples = for {
  a <- naturals
  b <- naturals if b > a
  c <- naturals if a * a + b * b == c * c
} yield (a, b, c)
// Vector((3,4,5), (5,12,13), (6,8,10), (8,15,17), (9,12,15), (12,16,20))
```

The filter after the second generator ensures that we don't generate redundant triples like (3, 4, 5) and (4, 3, 5) by forcing the second number in the triple to be larger than the first. The filter after the third generator enforces that only valid Pythagorean triples will be generated, i.e. that they will follow [Pythagoras' theorem](https://en.wikipedia.org/wiki/Pythagorean_theorem).

## Intuition

For-comprehensions are not restricted to lists. Every data type that supports the operations `withFilter`, `map`, and `flatMap` (with the proper types) can be used in comprehensions. Different types may implement the exact mechanics of what a comprehension does differently; for example:

* Sequence types like `List[A]` implement comprehensions in terms of a *cartesian product* between different lists
* `Option[A]` implements comprehensions in terms of *short-circuiting* the overall operation to `None` if any of the generators binds to a `None` input value
* Concurrency handlers like `Future[A]` implement comprehensions as making sure asynchronous actions happen in the *order* in which they are generated.

## Comprehensions Without `yield`

You can omit `yield` in a comprehension. In that case, the comprehension will return `Unit`. This can be useful in case you need to perform side-effects. Here's a comprehension that *prints* the square numbers from the first example, instead of evaluating them into a collection value:

```tut
def printSquares(count: Int) = for (num <- 1 to count) println(num * num)

printSquares(5)
1
4
9
16
25
```
