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

// TODO: many times requested, find more references than the contributors thread

// TODO: use lingo of spec

## Motivating Examples

Given one wants to use pattern matching on a case class:

```scala
case class User(name: String, age: Int, city: String)

val user = User(name = "Anna", age = 10, city = "Berlin")

val annasCity = user match
  case User(name = "Anna", city = c) => c
```

The Deconstruction allows the same syntax as the construction and seems to be what people intuitive expect. See //TODO: Examples

Without names in patterns user have to use underscore a lot. The example above would be written as, and is the same what the compiler generates:

//TODO: how offend does this pattern occur?

```scala
val annasCity = user match
  case User("Anna", _, c) => c
```

This makes it hard which parameter means what, basically the same idea as for named arguments. (IDEs help here, by showing the names.)

In addition, it breaks every time a field of `User` gets added, rearranged, or removed.
In the worst case it breaks silently, if two fields with the type switch places.

Personal motivation comes from using to offend https://www.scalatest.org/user_guide/using_matchers#matchingAPattern
and got bitten every time the data model changed slightly.

## Counter-Examples

This SIP doesn't aim to allow pattern where parameters go into the pattern, e.g:

```scala
val map = Map("Berlin" -> 10, "Paris" -> 5)

map match
  case Map("Paris" -> five) => five
```

//TODO: find references where this feature was requested

## Design

Goal is similarity between construction and deconstruction of case classes.

Before this was invalid syntax, so this shouldn't affect any existing Scala program.

### Desugaring

> One important principle of Scala’s pattern matching design is that case classes should be abstractable. I.e. we want to be able to represent the abilities of a case class without exposing the case class itself. That also allows code to evolve from a case class to a regular class or a different case class while maintaining the interface of the old case class. [Martin Odersky](https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/52)

To create a user defined destructor user the `@names` annotation.

```scala
class User(val name: String, val age: Int, val city: String)

object User:
  @names("name", "age", "city")
  def unapply(user: User): Some[(String, Age, String)] =
    (user.name, user.age, user.city)
```

### Mixed usage

Mixed patterns, with positional and named patterns are allowed to keep the similarity.
But they have no motivational use case. Maybe they should be disallowed.

```scala
  case User("Anna", city = c) => // Mixed usage seems wired
  case User(_, city = c) => // Leading underscore are espacially useless
```

### Disallow same name twice

// TODO: Motivate this restriction

```scala
  case User(city = city1, city = city2) => a // error city is used twice
  case User(name1, name = name2) => a // error city is used twice
```

### Order of name and term

Normally an equal sign assigns the result of the right side to the left side. With the proposed syntax that's not the case. However, for most, if not all, people that's the correct. The order seems the requires a look ahead in the parser.

// TODO: Performance test

## Implementation


'Simple' rewrite of patterns. If a pattern with a name is encountered, the compiler looks up the index of those names and places the tree accordingly.

// TODO: Brag about the simplicity of the implementation

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


### Allow skipping arguments

Whenever a single named argument is used in pattern, the pattern can have fewer arguments than the unapply.
This leads to inconsistency, as pointed out by Lionel Parreaux in the [Scala Contributors Thread](https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/44). This could lead users to use a named pattern, just to skip all parameters.

```scala
  case User(age = _) => "Just wanted to use the extractor, lol!"
```


## Alternatives

### Without any changes to the language

One alternative way of archiving most objectives, that is doable with current Scala, is to use specialized extractors.

```scala
case class User(age: Int)

object User:
  object age:
    def unapply(user: User): Option[Int] =
      Some(user.age)

User(10) match
  case User.age(y) => y
```

Libraries like [Monocle][monocle] could be extended to reduce the boilerplate, but still some boilerplate would remain.
In addition, this breaks the intuitive similarity between construction and deconstruction.

### Type as vehicle

But what is with inheritance of the object?

```scala
object User:
  type Unapply = ("name", "age", "city")
  def unapply(user: User): Some((String, Age, String)) =
    (user.name, user.age, user.city)
```

### Named Tuple Arguments / Anonymous Case Classes

This was mentioned in the discussion about [Named Tuple Arguments / Anonymous Case Classes][named-tuple] as bonus, that named tuples could transport the names from unapply to the pattern. 
This would be more generic and could handle user defined extractors.

### Partial destructuring in guards

Lionel Parreaux proposed a more powerful mechanism, where if guards of cases could them self contains destructuring patterns.

```scala
  case user: User if Age(years) <- user => years
  case User(age = Age(years)) => years // both cases do the same thing
```

His proposal is striclty more powerfull, but arguably less intuitive. Both, Pattern matching with named fields and Partial destructuring in guards could be implemented along each other. Named fields for simple patterns and destructuring in guards for complex patterns. However, they offer two ways to do the same thing and could lead to lots of bike shedding.

## References

* [Scala Contributors Thread][contributors-thread]

* [Monocle][monocle]
* [Named Tuple Arguments / Anonymous Case Classes][named-tuple]
* [Partial Destructuring in Guards][partial-destructuring-in-guards]

[monocle]: https://www.optics.dev/Monocle/ "Monocle"
[named-tuple]: https://contributors.scala-lang.org/t/named-tuple-arguments-anonymous-case-classes/4352 
[contributors-thread]: https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/20 "Scala Contributors thread"
[partial-destructuring-in-guards]: http://lptk.github.io/programming/2018/12/12/scala-pattern-warts-improvements.html#-partial-destructuring-in-guards
