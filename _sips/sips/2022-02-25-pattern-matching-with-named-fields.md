---
layout: sip
title: SIP-NN - Pattern matching with named fields
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/2021-06-25-named-pattern-matching.html
---

## History

| Date          | Version       |
|---------------|---------------|
| Feb 25th 2022 | Initial Draft |

## Motivation

An readable, extensible, and intuitive way to deconstruct case classes in pattern matching.

Link to work in progress implementation lives here: https://github.com/Jentsch/dotty

## Motivating Examples

Given one wants to use pattern matching on a case class:

```scala
case class User(name: String, age: Int, city: String)

val user = User(name = "Anna", age = 10, city = "Berlin")

val annasCity = user match
  case User(name = "Anna", city = c) => c
```

The Deconstruction allows the same syntax as the construction and seems to be what people intuitively expect. See for example the very first post in [Scala Contributors Thread][contributors-thread] for this topic.

Without names in patterns user have to use underscore a lot. The example above would be written as, and is the same what the compiler generates:

//TODO: how offend does this pattern occur?

```scala
val annasCity = user match
  case User("Anna", _, c) => c
```

This makes it hard which parameter means what, basically the same idea as for named arguments. Adding underscores until the compile is happy is also not a great experience. IDEs can help here, by showing the names.

In addition, the code breaks every time a field of `User` gets added, rearranged, or removed.
In the worst case it breaks silently, if two fields with the same type switch places.

My personal motivation comes from using [`matchPattern` in ScalaTest](https://www.scalatest.org/user_guide/using_matchers#matchingAPattern)
and got bitten by it every time my data model changed slightly.

## Counter-Examples

This SIP doesn't aim to allow pattern where parameters go into the pattern, e.g:

```scala
val map = Map("Berlin" -> 10, "Paris" -> 5)

map match
  case Map("Paris" = five) => five
```

## Design

Goal is similarity between construction and deconstruction of case classes.

Up to now this was invalid syntax, so this shouldn't affect any existing Scala program.

### Mixed usage

Mixed patterns, with positional and named patterns are allowed to keep the similarity.
But they have no motivational use case. Maybe they should be disallowed.

```scala
  case User("Anna", city = c) => // Mixed usage seems wired
  case User(_, city = c) => // Leading underscore are especially useless
```

### Disallow same name twice

```scala
  case User(city = city1, city = city2) => a // error city is used twice
  case User(name1, name = name2) => a // error city is used twice
```

The same should happen if the `User` had a field with a [deprecated name](https://www.scala-lang.org/api/current/scala/deprecatedName.html).

### Order of name and term

Normally an equal sign assigns the result of the right side to the left side. With the proposed syntax that's not the case. However, for most, if not all, people that's the correct order.

This order seems the requires a single look ahead in the parser.

### Desugaring

> One important principle of Scala’s pattern matching design is that case classes should be abstractable. I.e. we want to be able to represent the abilities of a case class without exposing the case class itself. That also allows code to evolve from a case class to a regular class or a different case class while maintaining the interface of the old case class. [Martin Odersky](https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/52)

* Allow the same feature of case classes:
  * Provide arbitrary names
  * Enable [`@deprecatedName`](https://www.scala-lang.org/api/current/scala/deprecatedName.html), which leads to multiple names for a single field. Using both should be an error.
* Maybe provide additional named fields. For example for our `User`:

  ```scala
  case User(ageInDays = 3650) => ...
  ```

  But this could be an awful feature.
* Maybe leave fields without names

This SIP proposes basically to use [shapeless records](https://github.com/milessabin/shapeless/wiki/Feature-overview:-shapeless-2.0.0#extensible-records) for the specific purpose of pattern matching.
For incomplete list of alternatives see [alternative desugaring](#alternative-desugaring) below.

Pro:

* with shapeless records we have a good understanding what we are doing, however we need to tweak the encoding a bit
* with some helper definitions the usage would be quite short
* reuse possible

Con:

* opens an can of worms, as this encoding could be useful for other requested features like [named tuples](named-tuple), which would require more thought-out design
* no support for `@deprecatedName`
* identifiers are represented with string literals

Example for user:

```scala
object User:
  def unapply(user: User): Option[
    (String, Int, String) & 
    { type Names = ("name", "age", "city") }
  ] = (user.name, user.age, user.city).asInstanceOf
```

The reason to pull the names out, instead of keeping them near to their type, is to prevent extractors to accidentally leaking the name.

## Implementation

If a pattern with a name is encountered, the compiler looks up list of provided names and places the trees accordingly.

The list of names either provided by the return type of the unapply method or by the constructor list of the case class.

Example:

```scala
// a match clause like
case User(<tree1>, city = <tree2>) => ???

// gets rewritten to:
case User(
  <tree1>, // because tree1 is positional pattern
  _, // because name isn't mentioned
  <tree2>, // because city is the third parameter of user
)
```

This allows us to glace over the details of how pattern matching gets desugared further down the line.

## Drawbacks

### Allow skipping arguments

Whenever a single named argument is used in pattern, the pattern can have fewer arguments than the unapply provides. This is driven by the motivation the make pattern matching extensible.
But this leads to (arguably small) inconsistency, as pointed out by Lionel Parreaux in the [Scala Contributors Thread](https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/44). This could lead users to use a named pattern, just to skip all parameters.

```scala
  case User(age = _) => "Just wanted to use the extractor, lol!"
```

## Alternatives

### Without any changes to the language

One alternative way of archiving most objectives, that is doable with current Scala, is to use specialized extractors.

```scala
object User:
  object age:
    def unapply(user: User): Option[Int] =
      Some(user.age)

user match
  case User.age(y) => y
```

Libraries like [Monocle][monocle] could be extended to reduce the boilerplate, but some boilerplate would remain.
In addition, this breaks the intuitive similarity between construction and deconstruction.

### Alternative desugaring

As the above described desugaring has its drawbacks.Here are some alternatives with other drawbacks, and maybe better trade-offs.

#### Use underscore methods

In the sprit of [name based pattern matching](https://dotty.epfl.ch/docs/reference/changed-features/pattern-matching.html#name-based-match):

```scala
object User:
  class UserMatching(user: User):
    def _1 = user.name
    ...
    
    def _name = user.name
    inline def _age = _2
```

Pro:

* allows to add more fields
* allows `@deprecatedName`
* is the only desugaring, that doesn't use string literals

Con:

* How to detect that a name means the same as a position? Maybe detect simple patterns like the last line in the example?
* long and verbose, without any shortcuts in sight
* An underscore at the beginning of a name is an unheard of pattern, even in Scala. This could accidentally expose fields, which weren't suppose to become fields.

#### Annotated `unapply` method

```scala
object User:
  @names("name", "age", "city")
  def unapply(user: User): Some[(String, Age, String)] = ...
```

Pro:

* simple to implement (was done in the first draft implementation)

Con:

* no clear way of encoding deprecated name
* annotations are not very scalaish
* no reuse possible

#### Add type as vehicle

```scala
object User:
  type Unapply = ("name", "age", "city")
  def unapply(user: User): Some((String, Age, String)) = ...
```

Pro:

* should be easy to implement
* the type and the method can inherited from traits and allow some kind of reuse

Con:

* the type and the method can be defined in unrelated traits. Only at the use site of the can be checked if the type and the method agree on the arity of the pattern.
* no clear way of encoding deprecated name

### Named Tuple Arguments / Anonymous Case Classes

This was mentioned in the discussion about [Named Tuple Arguments / Anonymous Case Classes][named-tuple] as bonus, that named tuples could transport the names from unapply to the pattern.
This would be more generic and could handle user defined extractors.

### Partial destructuring in guards

Lionel Parreaux proposed a more powerful mechanism, where if guards of cases could them self contains destructuring patterns.

```scala
  case user: User if Age(years) <- user.age => years
  case User(age = Age(years)) => years // both cases do the same thing
```

His proposal is strictly more powerful, but arguably less intuitive. Both, Pattern matching with named fields and Partial destructuring in guards could be implemented along each other. Named fields for simple patterns and destructuring in guards for complex patterns. However, they offer two ways to do the same thing and could lead to lots of bike shedding, if both got added to the language.

## Open questions

It could be useful to add extractors with just named fields to sealed traits and enums.

What would reuse would look like? What is desirable?

## References

* [Scala Contributors Thread][contributors-thread]

* [Monocle][monocle]
* [Named Tuple Arguments / Anonymous Case Classes][named-tuple]
* [Partial Destructuring in Guards][partial-destructuring-in-guards]

[monocle]: https://www.optics.dev/Monocle/ "Monocle"
[named-tuple]: https://contributors.scala-lang.org/t/named-tuple-arguments-anonymous-case-classes/4352
[contributors-thread]: https://contributors.scala-lang.org/t/pattern-matching-with-named-fields/1829/20 "Scala Contributors thread"
[partial-destructuring-in-guards]: http://lptk.github.io/programming/2018/12/12/scala-pattern-warts-improvements.html#-partial-destructuring-in-guards
