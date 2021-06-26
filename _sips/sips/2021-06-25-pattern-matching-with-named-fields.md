---
layout: sip
title: SIP-NN - Pattern matching with named fields
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/2021-06-25-named-pattern-matching.html
---

## History

| Date           | Version       |
|----------------|---------------|
| June 25th 2015 | Initial Draft |

## Motivation

An intuitive, readable, and extendible way to deconstruct case classes in pattern matching.

## Motivating Examples

Given one wants to use pattern matching on a case class:

```scala
case class User(name: String, age: Int, city: String)

val user = User(name = "Anna", age = 10, city = "Berlin")

val annasCity = user match
  case User(name = "Anna", city = c) => c
  // wild stuff:
  case User(city = city, name = s"To$_") => ???
  case User(name = guy @ ("Guy" | "guy")) => ???
```

The Deconstruction allows the same syntax as the construction and seems to be what people intuitive expect. See //TODO: Examples

Without names in patterns user have to use underscore a lot. The example above would be written as, and is the same what the compiler generates:

```scala
val annasCity = user match
  case User("Anna", _, c) => c
  // wild stuff:
  case User(s"To$_", _, city) => ???
  case User(guy @ ("Guy" | "guy"), _, _) => ???
```

This makes it hard which parameter means what, basically the same idea as for named arguments. (The IDE can help here)

In addition, it breaks every time a field of `User` gets added, rearranged, or removed. In the worst case it breaks silently, if to fields with the type switch places.

Personal motivation comes from using to offend https://www.scalatest.org/user_guide/using_matchers#matchingAPattern
and got bitten every time the data model changed slightly.

## Counter-Examples

This SIP doesn't aim to allow pattern where parameters go into the pattern, e.g:

```scala
val map = Map("Berlin" -> 10, "Paris" -> 5)

map match {
  case Map("Paris" -> five) => five
}

4 match {
  case n / 2 => "douple of " + n.toString
  case _ => "odd"
}
```

//TODO: find references where is feature was requested

## Design

Goal is similarity between construction and deconstruction of case classes.

Before this was invalid syntax, so this shouldn't affect any existing Scala program.

### Open questions

Various patterns are allowed to keep the similarity, but have no motivational use case. Maybe those should be allowed:

```scala
  case User("Anna", city = c) => // Mixed usage seems wired
  case User(_, city = c) => // Leading underscore are espacially to useless (?)
```

Discuss design decisions (including, as examples):

* What's with user defined `unapply` on case classes? (Design)

## Implementation


'Simple' rewrite of patterns. If a pattern with a name is encountered, the compiler looks up the index of those names and places the tree accordingly.

Example:

```scala
// a match clause like
case User(age = <tree>) => ???

// gets rewritten to:
case User(
  _, // because name isn't mentioned
  <tree>, // because age is the second parameter of user
  _ //  because city isn't mentioned
)
```


## Drawbacks

Without allowing user defined named arguments in pattern matching, the fact that class is a case class becomes part if it's public interface. Changing a case class to a normal class is a backward incompatible change, that library maintainers of to be aware. This is especially worrying since currently libraries where designed without this feature in mind.

```scala
case class Age(years: Int)

class Age(val years: Int) {
  // equals, hashcode etc.
}
object Age {
  def unapply(age: Age): Option[Int] =
    Some(age.years)
}
```

## Alternatives

### Without any changes to the language

One alternative way of archiving most objectives, that is doable with current Scala, is to use specialized extractors.

```scala
case class User(age: Int)

object User {
  object age {
    def unapply(user: User): Option[Int] =
      Some(user.age)
  }
}

User(10) match {
  case User.age(y) => y
}
```

Libraries like [Monocle][2] could be extended to reduce the boilerplate, but still some boilerplate would remain.
In addition, this breaks the intuitive similarity between construction and deconstruction.

### Records, Tuples with names etc.

//TODO

Would be more generic, could be handle user defined extractors, also could lead naturally to a way to hand;e Counter-Example above.

### Partial destructuring

Lionel Parreaux proposed a more powerful mechanism:
http://lptk.github.io/programming/2018/12/12/scala-pattern-warts-improvements.html#-partial-destructuring-in-guards

If this SIP gets accepted, it could restrict the design any of the last two alternatives, if they come into being.

[2]: https://www.optics.dev/Monocle/ "Monocle"
[4]: https://github.com/dogescript/dogescript "Alternatives"
[5]: https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/20 "Scala Contributors thread"
