---
layout: singlepage-overview
title: Implicit Classes

partof: implicit-classes

languages: [zh-cn]

permalink: /overviews/core/:title.html
versionSpecific: true
scala2: true
---

In Scala 3, implicit classes are still supported for compatibility reasons but the recommended way to achieve the same result is to use [extension methods]({% link _overviews/scala3-book/ca-extension-methods.md %}).

---

**Josh Suereth**

## Introduction

Scala 2.10 introduced a new feature called *implicit classes*.  An *implicit class* is a class
marked with the `implicit` keyword.  This keyword makes the class's primary constructor available
for implicit conversions when the class is in scope.

Implicit classes were proposed in [SIP-13](https://docs.scala-lang.org/sips/pending/implicit-classes.html).

## Usage

To create an implicit class, simply place the `implicit` keyword in front of an appropriate
class.  Here's an example:

    object Helpers {
      implicit class IntWithTimes(x: Int) {
        def times[A](f: => A): Unit = {
          def loop(current: Int): Unit =
            if(current > 0) {
              f
              loop(current - 1)
            }
          loop(x)
        }
      }
    }

This example creates the implicit class `IntWithTimes`.  This class wraps an `Int` value and provides
a new method, `times`.   To use this class, just import it into scope and call the `times` method.
Here's an example:

    scala> import Helpers._
    import Helpers._

    scala> 5 times println("HI")
    HI
    HI
    HI
    HI
    HI

For an implicit class to work, its name must be in scope and unambiguous, like any other implicit
value or conversion.


## Restrictions

Implicit classes have the following restrictions:

**1. They must be defined inside another `trait`/`class`/`object`.**


    object Helpers {
       implicit class RichInt(x: Int) // OK!
    }
    implicit class RichDouble(x: Double) // BAD!


**2. They may only take one non-implicit argument in their constructor.**


    implicit class RichDate(date: java.time.LocalDate) // OK!
    implicit class Indexer[T](collection: Seq[T], index: Int) // BAD!
    implicit class Indexer[T](collection: Seq[T])(implicit index: Index) // OK!


While it's possible to create an implicit class with more than one non-implicit argument, such classes
aren't used during implicit lookup.


**3. The `implicit def` introduced by `implicit class` must not be ambiguous with respect to other term members.**

*Note: This means an implicit class cannot be a case class, since the `implicit def` would be ambiguous with the companion `apply`*.

    object Bar
    implicit class Bar(x: Int) // BAD!

    val x = 5
    implicit class x(y: Int) // BAD!

    implicit case class Baz(x: Int) // BAD!
