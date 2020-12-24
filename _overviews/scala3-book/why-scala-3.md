---
title: Why Scala 3?
type: chapter
description: This page describes the benefits of the Scala 3 programming language.
num: 3
previous-page: scala-features
next-page: taste-intro
---

{% comment %}
TODO: Is “Scala 3 Benefits” a better title?
NOTE: Could mention “grammar” as a way of showing that Scala isn’t a large language; see this slide: https://www.slideshare.net/Odersky/preparing-for-scala-3#13
{% endcomment %}


There are many benefits to using Scala, and Scala 3 in particular.
It’s hard to list every benefit of Scala, but a “Top Ten” list might look like this:

1. Scala embraces a fusion of functional programming (FP) and object-oriented programming (OOP)
2. Scala is statically typed, but often feels like a dynamically typed language
3. Scala’s syntax is concise, but still readable; it’s often referred to as _expressive_
4. _Implicits_ in Scala 2 were a defining feature, and they have been improved and simplified in Scala 3
5. Scala integrates seamlessly with Java, so you can create projects with mixed Scala and Java code, and Scala code easily uses the thousands of existing Java libraries
6. Scala can be used on the server, and also in the browser with [Scala.js](https://www.scala-js.org)
7. The Scala standard library has dozens of pre-built, functional methods to save you time, and greatly reduce the need to write custom `for` loops and algorithms
8. “Best practices” are built into Scala, which favors immutability, anonymous functions, higher-order functions, pattern matching, classes that cannot be extended by default, and more
9. The Scala ecosystem offers the most modern FP libraries in the world
10. Strong type system




## 1) FP/OOP fusion

More than any other language, Scala supports a fusion of the FP and OOP paradigms.
As Martin Odersky has stated, the essence of Scala is a fusion of functional and object-oriented programming in a typed setting, with:

- Functions for the logic, and
- Objects for the modularity

Possibly some of the best examples of modularity are the classes in the standard library.
For instance, a `List` is defined as a class---technically it’s an abstract class---and a new instance is created like this:

```scala
val x = List(1, 2, 3)
```

However, what appears to the programmer to be a simple `List` is actually built from a combination of several specialized types, including an abstract class named `AbstractSeq`, traits like `LinearSeq` and `LinearSeq`, and more.
Those types are similarly composed of other small, modular units of code.

In addition to building a type like `List` from a series of modular traits, the `List` API also consists of dozens of other methods, many of which are higher-order functions:

```scala
val xs = List(1, 2, 3, 4, 5)

xs.map(_ + 1)         // List(2, 3, 4, 5, 6)
xs.filter(_ < 3)      // List(1, 2)
xs.find(_ > 3)        // Some(4)
xs.takeWhile(_ < 3)   // List(1, 2)
```

In those examples, the values in the list can’t be modified.
The `List` class is immutable, so all of those methods return new values, as shown by the data in each comment.



## 2) A dynamic feel

Scala’s _type inference_ often makes the language feel dynamically typed, even though it’s statically typed.
This is true with variable assignment:

```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3,4,5)
val stuff = ("fish", 42, 1_234.5)
```

It’s also true when passing anonymous functions to higher-order functions:

```scala
list.filter(_ < 4)
list.map(_ * 2)
list.filter(_ < 4)
    .map(_ * 2)
```

and when defining methods:

```scala
def add(a: Int, b: Int) = a + b
```

This is more true than ever in Scala 3, such as when using [union types][union-types]:

```scala
// union type parameter
def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // more code here ...

// union type value
val b: Password | Username = if (true) name else password
```


## 3) Concise syntax

Scala is a low ceremony, “concise but still readable” language. For instance, variable type assignment is concise:

```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3)
```

Creating types like traits, classes, and enumerations are concise:

```scala
trait Tail:
  def wagTail: Unit
  def stopTail: Unit

enum Topping:
  case Cheese, Pepperoni, Sausage, Mushrooms, Onions

class Dog extends Animal, Tail, Legs, RubberyNose

case class Person(
  firstName: String,
  lastName: String,
  age: Int
)
```

Higher-order functions are concise:

```scala
list.filter(_ < 4)
list.map(_ * 2)
```

All of these expressions and many more are concise, and still very readable: what we call _expressive_.



## 4) Implicits, simplified

Implicits in Scala 2 were a major distinguishing design feature.
They represented _the_ fundamental way to abstract over context, with a unified paradigm that served a great variety of use cases, among them:

- Implementing type classes
- Establishing context
- Dependency injection
- Expressing capabilities

Since then other languages have adopted similar concepts, all of which are variants of the core idea of _term inference_: Given a type, the compiler synthesizes a “canonical” term that has that type.

While implicits were a defining feature in Scala 2, their design has been greatly improved in Scala 3:

- There’s a single way to define “given” values
- There’s a single way to introduce implicit parameters and arguments
- There’s a separate way to import givens that does not allow them to hide in a sea of normal imports
- There’s a single way to define an implicit conversion, which is clearly marked as such, and does not require special syntax

Benefits of these changes include:

- The new design avoids feature interactions and makes the language more consistent
- It makes implicits easier to learn and harder to abuse
- It greatly improves the clarity of the 95% of Scala programs that use implicits
- It has the potential to enable term inference in a principled way that’s also accessible and friendly

These capabilities are described in detail in other sections, so see the [Contextual Abstraction introduction][contextual], and the section on [`given` and `using` clauses][given] for more details.




## 5) Seamless Java integration

Scala/Java interaction is seamless in many ways.
For instance:

- You can use all of the thousands of Java libraries that are available in your Scala projects
- A Scala `String` is essentially a Java `String`, with additional capabilities added to it
- Scala seamlessly uses the date/time classes in the Java *java.time._* package

You can also use Java collections classes in Scala, and to give them more functionality, Scala includes methods so you can transform them into Scala collections.

While almost every interaction is seamless, the [“Interacting with Java” chapter][java] demonstrates how to use some features together better, including how to use:

- Java collections in Scala
- Java `Optional` in Scala
- Java interfaces in Scala
- Scala collections in Java
- Scala `Option` in Java
- Scala traits in Java
- Scala methods that throw exceptions in Java code
- Scala varargs parameters in Java

See that chapter for more details on these features.



## 6) Client &amp; server

Scala can be used on the server side with terrific frameworks:

- The [Play Framework](https://www.playframework.com) lets you build highly scalable server-side applications and microservices
- [Akka Actors](https://akka.io) let you use the actor model to greatly simplify parallel and concurrent software applications

Scala can also be used in the browser with the [Scala.js project](https://www.scala-js.org), which is a type-safe replacement for JavaScript.
The Scala.js ecosystem [has dozens of libraries](https://www.scala-js.org/libraries) to let you use React, Angular, jQuery, and many other JavaScript and Scala libraries in the browser.

In addition to those tools, the [Scala Native](https://github.com/scala-native/scala-native) project “is an optimizing ahead-of-time compiler and lightweight managed runtime designed specifically for Scala.” It lets you build “systems” style binary executable applications with plain Scala code, and also lets you use lower-level primitives.



## 7) Standard library methods

Because you’ll rarely ever need to write a custom `for` loop again, the dozens of pre-built functional methods in the Scala standard library will both save you time, and help make code more consistent across different applications.

The following examples show some of the built-in collections methods, and there are many in addition to these.
While these all use the `List` class, the same methods work with other collections classes like `Seq`, `Vector`, `LazyList`, `Set`, `Map`, `Array`, and `ArrayBuffer`.

Here are some examples:

```scala
List.range(1, 3)                      // List(1, 2)
List.range(1, 6, 2)                   // List(1, 3, 5)
List.fill(3)("foo")                   // List(foo, foo, foo)
List.tabulate(3)(n => n * n)          // List(0, 1, 4)
List.tabulate(4)(n => n * n)          // List(0, 1, 4, 9)

val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.filter(_ > 100)                     // List()
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.map(_ * 2)                          // List(20, 40, 60, 80, 20)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)
a.filter(_ < 30).map(_ * 10)          // List(100, 200)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)             // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)         // List(A, P, P, L, E, P, E, A, R)

val nums = List(10, 5, 8, 1, 7)
nums.sorted                           // List(1, 5, 7, 8, 10)
nums.sortWith(_ < _)                  // List(1, 5, 7, 8, 10)
nums.sortWith(_ > _)                  // List(10, 8, 7, 5, 1)
```



## 8) Built-in practices

Scala idioms encourage best practices in many ways.
For immutability, you’re encouraged to create immutable `val` fields:

```scala
val a = 1                 // immutable variable
```

You’re also encouraged to use immutable collections classes like `List` and `Map`:

```scala
val b = List(1,2,3)       // List is immutable
val c = Map(1 -> "one")   // Map is immutable
```

Case classes are primarily intended for use in functional programming, and their parameters are immutable:

```scala
case class Person(name: String)
val p = Person("Michael Scott")
p.name           // Michael Scott
p.name = "Joe"   // compiler error (reassignment to val name)
```

As shown in the previous section, Scala collections classes support higher-order functions, and you can pass methods (not shown) and anonymous functions into them:

```scala
a.dropWhile(_ < 25)
a.filter(_ < 25)
a.takeWhile(_ < 30)
a.filter(_ < 30).map(_ * 10)
nums.sortWith(_ < _)
nums.sortWith(_ > _)
```

`match` expressions let you use pattern matching, and they truly are _expressions_ that return values:

```scala
val numAsString = i match
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
```

Because they can return values, they’re often used as the body of a method:

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" => false
  case _ => true
```



## 9) Ecosystem libraries

Scala libraries for functional programming like [Cats](https://typelevel.org/cats) and [Zio](https://zio.dev) are leading-edge libraries in the FP community.
All of the buzzwords like high-performance, type safe, concurrent, asynchronous, resource-safe, testable, functional, modular, binary-compatible, efficient, effects/effectful, and more, can be said about these libraries.

We could list hundreds of libraries here, but fortunately they’re all listed in another location: For those details, see the [“Awesome Scala” list](https://github.com/lauris/awesome-scala).



## 10) Strong type system

Scala has a strong type system, and it’s been improved even more in Scala 3.
Scala 3’s goals were defined early on, and those related to the type system include:

- Simplification
- Eliminate inconsistencies
- Safety
- Ergonomics
- Performance

_Simplification_ comes about through dozens of changed and dropped features.
For instance, the changes from the overloaded `implicit` keyword in Scala 2 to the terms `given` and `using` in Scala 3 make the language more clear, especially for beginning developers.

_Eliminating inconsistencies_ is related to the dozens of [dropped features][dropped], [changed features][changed], and [added features][added] in Scala 3.
Some of the most important features in this category are:

- Intersection types
- Union types
- Implicit function types
- Dependent function types
- Trait parameters
- Generic tuples

{% comment %}
A list of types from the Dotty documentation:
- Inferred types
- Generics
- Intersection types
- Union types
- Structural types
- Dependent function types
- Type classes
- Opaque types
- Variance
- Algebraic Data Types
- Wildcard arguments in types: ? replacing _
- Type lambdas
- Match types
- Existential types
- Higher-kinded types
- Singleton types
- Refinement types
- Kind polymorphism
- Abstract type members and path-dependent types
- Dependent function types
- Bounds
{% endcomment %}


_Safety_ is related to several new and changed features:

- Multiversal equality
- Restricting implicit conversions
- Null safety

Good examples of _ergonomics_ are enumerations and extension methods, which have been added to Scala 3 in a very readable manner:

```scala
// enumeration
enum Color:
  case Red, Green, Blue

// extension methods
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

_Performance_ relates to several areas.
One of those is [opaque types][opaque-types].
In Scala 2 there were several attempts to create solutions to keep with the Domain-driven design (DDD) practice of giving values more meaningful types.
These attempts included:

- Type aliases
- Value classes
- Case classes

Unfortunately all of these approaches had weaknesses, as described in the [_Opaque Types_ SIP](https://docs.scala-lang.org/sips/opaque-types.html).
Conversely, the goal of opaque types, as described in that SIP, is that “operations on these wrapper types must not create any extra overhead at runtime while still providing a type safe use at compile time.”

For more type system details, see the [Reference documentation][reference].



## Other great features

Scala has many great features, and choosing a Top 10 list can be subjective.
Several surveys have shown that different groups of developers love different features.
Hopefully you’ll discover more great Scala features as you use the language.

[java]: {% link _overviews/scala3-book/interacting-with-java.md %}
[given]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}/overview.html
[dropped]: https://dotty.epfl.ch/docs/Dropped%20Features/index.html
[changed]: https://dotty.epfl.ch/docs/Other%20Changed%20Features/index.html
[added]: https://dotty.epfl.ch/docs/Other%20New%20Features/index.html

[union-types]: {% link _overviews/scala3-book/types-union.md %}
[opaque-types]: {% link _overviews/scala3-book/types-opaque-types.md %}
