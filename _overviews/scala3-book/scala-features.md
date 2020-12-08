---
title: Scala 3 Programming Language Features
description: This page discusses the main features of the Scala 3 programming language.
num: 2
previous-page: introduction
next-page: why-scala-3
---

<!--
- NOTE: the following IDE-related quotes come from the Scala.js website:
  - catch most errors in the IDE
  - Easy and reliable refactoring
  - Reliable code completion
-->

The name _Scala_ comes from the word _scalable_, and true to that name, the Scala language is used to power busy websites and analyze huge data sets. This section introduces the features that make Scala a scalable language. These features are split into three sections:

- High-level language features
- Lower-level language features
- Scala ecosystem features



<!-- I think of this section as being like an “elevator pitch” -->
<!-- https://en.wikipedia.org/wiki/High-level_programming_language -->
## 1) High-level Scala language features

Looking at Scala from the proverbial “30,000 foot view,” you can make the following statements about it:

- It’s a high-level programming language
- It has an expressive syntax
- It’s statically-typed (but feels dynamic)
- It has an expressive type system
- It’s a pure functional programming (FP) language
- It’s a pure object-oriented programming (OOP) language
- It supports the fusion of FP and OOP
- Contextual abstractions provide a clear way to implement _term inference_
- It runs on the JVM (and in the browser)
- It interacts seamlessly with Java code
- It’s used for server-side applications (including microservices), big data applications, and can also be used in the browser with Scala.js
- TODO: add something in this section or in the second section about the consistency of the language (I need help here)

The following sections take a quick look at these features.


### It’s a high-level programming language

Scala is considered a high-level language in at least two ways. First, like Java and many other modern languages, you don’t deal with low-level concepts like pointers and memory management.

Second, with the use of lambdas and higher-order functions, you write your code at a very high level. As the functional programming saying goes, in Scala you write _what_ you want, not _how_ to achieve it. That is, we don’t write imperative code like this:

```scala
def double(ints: List[Int]): List[Int] = {
  val buffer = new ListBuffer[Int]()
  for (i <- ints) {
      buffer += i * 2
  }
  buffer.toList
  foo
  bar
}

val newNumbers = double(oldNumbers)
```

That code instructs the compiler what to do on a step-by-step basis. Instead, we write high-level, functional code using higher-order functions and lambdas like this to achieve the same effect:

```scala
val newNumbers = oldNumbers.map(_ * 2)
```

As you can see, that code is much more concise, easier to read, and easier to maintain.


### It has an expressive syntax

Scala has a concise, readable syntax that is often referred to as _expressive_. For instance, variables are created concisely:

```scala
val nums = List(1,2,3)
val p = Person("Martin", "Odersky")
```

Higher-order functions and lambdas make for expressive code:

```scala
nums.map(i => i * 2)   // long form
nums.map(_ * 2)        // short form

nums.filter(i => i > 1)
nums.filter(_ > 1)
```

And traits, classes, and methods are defined with a clean, light syntax:

```scala
trait Animal:
  def speak(): Unit

trait HasTail:
  def wagTail(): Unit

class Dog extends Animal, HasTail:
  def speak() = println("Woof")
  def wagTail() = println("⎞⎜⎛  ⎞⎜⎛")
```

Studies have shown that the time a developer spends _reading_ code to _writing_ code is at least a 10:1 ratio, so writing code that is concise _and_ readable is important.


### It’s statically-typed (but feels dynamic)

Scala is a statically-typed language, but thanks to its type inference capabilities it feels dynamic. All of these expressions look like a dynamically-typed language like Python or Ruby, but they’re all Scala:

```scala
val s = "Hello"
val p = Person("Al", "Pacino")
val sum = ints.reduceLeft(_ + _)
val y = for i <- nums yield i * 2
val z = nums.filter(_ > 100)
            .filter(_ < 10_000)
            .map(_ * 2)
```

Because Scala is considered to be a [strong, statically-typed language](https://heather.miller.am/blog/types-in-scala.html), you get all the benefits of static types:

- Correctness: you catch most errors at compile-time
- Great IDE support
    - Code completion
    - Catching errors at compile-time means catching mistakes as you type
    - Easy and reliable refactoring
    - Reliable code completion
- You can refactor your code with confidence
- Method type declarations tell readers what the method does, and help serve as documentation
- Types make your code easier to maintain
- Scalability: types help ensure correctness across arbitrarily large applications and development teams
- Strong types enable Scala features like implicits (TODO: I need help on this wording and description)
<!-- in that list, 'Correctness' and 'Scalability' come from Heather Miller’s page -->

<!--
In this section or the next section:
- TODO: Add a note about the benefits of the DOT calculus
- TODO: Also add a note about TASTy?
-->

### Expressive type system

<!--
- this text comes from the current [ScalaTour](https://docs.scala-lang.org/tour/tour-of-scala.html).
- TODO: all of the URLs will have to be updated
-->
Scala’s expressive type system enforces, at compile-time, that abstractions are used in a safe and coherent manner. In particular, the type system supports:

* [Generic classes]({% link _overviews/scala3-book/types-generics.md %})
* [Variance annotations]({% link _overviews/scala3-book/types-variance.md %})
* [Upper](/tour/upper-type-bounds.html) and [lower](/tour/lower-type-bounds.html) type bounds
* [Inner classes](/tour/inner-classes.html) and [abstract type members](/tour/abstract-type-members.html) as object members
* [Compound types](/tour/compound-types.html)
* [Explicitly typed self references](/tour/self-types.html)
* [Implicit parameters](/tour/implicit-parameters.html) and [conversions](/tour/implicit-conversions.html)
* [Polymorphic methods](/tour/polymorphic-methods.html)
* [Type inference](/tour/type-inference.html) means the user is not required to annotate code with redundant type information.

In combination, these features provide a powerful basis for the safe reuse of programming abstractions and for the type-safe extension of software.

<!--
https://www.artima.com/scalazine/articles/scalas_type_system.html
MartinOdersky:
The first is that the type system in Scala is actually very flexible, so it typically lets you compose things in very flexible patterns, which a language like Java, which has a less expressive type system, would often make more difficult. The second is that with pattern matching, you can recover type information in a very flexible way without even noticing it.

MartinOdersky (https://jaxenter.com/current-state-scala-odersky-interview-129495.html):
I think one of the next big developments will be the refinement of type systems to describe ever more precise properties of programs.

https://en.wikipedia.org/wiki/Scala_(programming_language)#Expressive_type_system
- Expressive type system
  - Classes and abstract types as object members
  - Structural types
  - Path-dependent types
  - Compound types
  - Explicitly typed self references
  - Generic classes
  - Polymorphic methods
  - Upper and lower type bounds
  - Variance (covariance and contravariance)
  - Annotation
  - Views
  - Type inference
  - “Type enrichment” (implicits)
  - Statically typed
  - ADTs

- Possible resources
    - https://en.wikipedia.org/wiki/Scala_(programming_language)#Expressive_type_system
    - https://docs.scala-lang.org/tour/tour-of-scala.html
    - https://www.artima.com/scalazine/articles/scalas_type_system.html
    - https://heather.miller.am/blog/types-in-scala.html

- DOT, Soundness
    - http://dotty.epfl.ch/blog/2016/02/17/scaling-dot-soundness
    - https://www.scala-lang.org/blog/2016/02/03/essence-of-scala.html
-->


### It’s a pure functional programming language

Scala is a functional programming (FP) language, meaning:

- Functions are variables, and can be passed around like any other variable
- Higher-order functions are directly supported
- Lambdas are built in
- Everything in Scala is an expression that returns a value
- Syntactically it’s easy to use immutable variables, and their use is encouraged
- It has a wealth of immutable collections classes in the standard library
- Those collections classes come with dozens of functional methods: they don’t mutate the collection, but instead return an updated copy of the data


### It’s a pure object-oriented programming language

Scala is a _pure_ object-oriented programming (OOP) language. Every variable is an object, and every “operator” is a method.

In Scala, all types inherit from a top-level class `Any`, whose immediate children are `AnyVal` (_value types_, such as `Int` and `Boolean`) and `AnyRef` (_reference types_, as in Java). This means that the Java distinction between primitive types and boxed types (e.g. `int` vs. `Integer`) isn’t present in Scala. Boxing and unboxing is completely transparent to the user.

<!-- TODO: add the “hierarchy” image here -->


### Scala supports the fusion of FP and OOP

<!-- from a slide here: https://twitter.com/alexelcu/status/996408359514525696 -->

The essence of Scala is the fusion of functional programming and object-oriented programming in a typed settings:

- Functions for the logic
- Objects for the modularity

As [Martin Odersky has stated](https://jaxenter.com/current-state-scala-odersky-interview-129495.html), “Scala was designed to show that a fusion of functional and object-oriented programming is possible and practical.”

For more details on this philosophy, see the TODO section in the Reference documentation.


### Contextual abstractions provide a clear way to implement term inference

Following Haskell, Scala was the second popular language to have some form of _implicits_. In Scala 3 these concepts have been completely re-thought and more clearly implemented.

The core idea is _term inference_: Given a type, the compiler synthesizes a “canonical” term that has that type. In Scala, an implicit parameter directly leads to an inferred argument term that could also be written down explicitly.

Use cases for this concept include implementing type classes, establishing context, dependency injection, expressing capabilities, computing new types, and proving relationships between them.

Scala 3 makes this process more clear than ever before. Read about contextual abstractions in the [Reference documentation]({{ site.scala3ref }}/contextual/motivation.html).


### Scala runs on the JVM (and in the browser)

Scala code runs on the Java Virtual Machine (JVM), so you get all of its benefits:

- Security
- Performance
- Memory management
- Portability and platform independence
- The ability to use the wealth of existing Java and JVM libraries

In addition to running on the JVM, Scala also runs in the browser with Scala.js (and open source third-party tools to integrate popular JavaScript libraries), and native executables can be built with Scala Native and GraalVM.


### Interacts seamlessly with Java

You can use Java classes and libraries in your Scala applications, and you can use Scala code in your Java applications. In regards to the second point, large libraries like [Akka](https://akka.io) and the [Play Framework](https://www.playframework.com) are written in Scala, and can be used in Java applications.

In regards to the first point, Java classes and libraries are used in Scala applications every day. For instance, in Scala you can read files with a Java `BufferedReader` and `FileReader`:

```scala
import java.io._
val br = BufferedReader(FileReader(filename))
// read the file with `br` ...
```

Using Java code in Scala is generally seamless.

Java collections can also be used in Scala, and if you want to use Scala’s rich collection class methods with them, you can convert them with just a few lines of code:

```scala
import scala.jdk.CollectionConverters._
val scalaList: Seq[Integer] = JavaClass.getJavaList().asScala.toSeq
```


### Used for server-side apps, big data, Scala.js

As you’ll see in the third section of this page, Scala libraries and frameworks like these have been written to power busy websites and work with huge datasets:

1. The [Play Framework](https://www.playframework.com) is a lightweight, stateless, developer-friendly, web-friendly architecture for creating highly-scalable applications
2. [Lagom](https://www.lagomframework.com) is a microservices framework that helps you decompose your legacy monolith and build, test, and deploy entire systems of reactive microservices
3. [Apache Spark](https://spark.apache.org) is a unified analytics engine for big data processing, with built-in modules for streaming, SQL, machine learning and graph processing

The [Awesome Scala list](https://github.com/lauris/awesome-scala) shows dozens of additional open source tools that developers have created to build Scala applications.

In addition to server-side programming, [Scala.js](https://www.scala-js.org) is a strongly-typed replacement for writing JavaScript, with open source third-party libraries that include tools to integrate with Facebook’s React library, jQuery, and more.



<!--
The Lower-Level Features section is like the second part of an elevator pitch. Assuming you told someone about the previous high-level features and then they say, “Tell me more,” this is what you might tell them.
-->
## 2) Lower-level language features

Where the previous section covered high-level features of Scala 3, it’s interesting to note that at a high level you can make the same statements about both Scala 2 and Scala 3. A decade ago Scala started with a strong foundation of desirable features, and as you’ll see in this section, those benefits have been improved with Scala 3.

At a “sea level” view of the details — i.e., the language features programmers use everyday — Scala 3 has significant advantages over Scala 2:

- The ability to create algebraic data types (ADTs) more concisely with enums
- An even more concise and readable syntax:
    - The “quiet” control structure syntax is easier to read
    - Optional braces
        - Fewer symbols in the code creates less visual noise, making it easier to read
    - The `new` keyword is generally no longer needed when creating class instances
    - The formality of package objects have been dropped in favor of simpler “top level” definitions
- A clearer grammar:
    - Multiple different uses of the `implicit` keyword have been removed
    - Those uses are replaced by more obvious keywords like `given`, `using`, and `extension`, focusing on intent over mechanism
    - Extension methods replace implicit classes with a clearer and simpler mechanism
    - The addition of the `open` modifier for classes makes the developer intentionally declare that a class is open for modification, thereby limiting ad-hoc extensions to a code base
    - Multiversal equality rules out nonsensical comparisons with `==` and `!=` (i.e., attempting to compare a `Person` to a `Planet`)
    - Macros are implemented much more easily
    - TODO: Benefits of Union and intersection types (I need help here)
    - Trait parameters replace and simplify early initializers
    - Opaque type aliases replace most uses of value classes, while guaranteeing the absence of boxing
    - Export clauses provide a simple and general way to express aggregation, which can replace the previous facade pattern of package objects inheriting from classes
    - The procedure syntax has been dropped, and the varargs syntax has been changed, both to make the language more consistent
    - The `@infix` annotation makes it obvious how you want a method to be applied
    - The `@alpha` method annotation defines an alternate name for the method, improving Java interoperability, and letting you provide aliases for symbolic operators

It would take too much space to demonstrate all of those features here, but follow the links in those items above to see those features in action.
<!-- TODO: eventually add links to all of those features -->



<!--
CHECKLIST OF ALL ADDED, UPDATED, AND REMOVED FEATURES
=====================================================

NEW FEATURES
------------
- trait parameters
- super traits
- creator applications
- export clauses
- opaque type aliases
- open classes
- parameter untupling
- kind polymorphism
- tupled function
- threadUnsafe annotation
- new control syntax
- optional braces (experimental)
- explicit nulls
- safe initialization

CHANGED FEATURES
----------------
- numeric literals
- structural types
- operators
- wildcard types
- type checking
- type inference
- implicit resolution
- implicit conversions
- overload resolution
- match expressions
- vararg patterns
- pattern bindings
- pattern matching
- eta expansion
- compiler plugins
- lazy vals initialization
- main functions

DROPPED FEATURES
----------------
- DelayedInit
- macros
- existential types
- type projection
- do/while syntax
- procedure syntax
- package objects
- early initializers
- class shadowing
- limit 22
- XML literals
- symbol literals
- auto-application
- weak conformance
- nonlocal returns
- [this] qualifier
    - private[this] and protected[this] access modifiers are deprecated
      and will be phased out
-->



## 3) Scala ecosystem features

Scala has a vibrant ecosystem, with libraries and frameworks for every need. The [“Awesome Scala” list](https://github.com/lauris/awesome-scala) provides a list of hundreds of open source projects that are available to Scala developers. Some of the more notable are listed below.

<!--
  TODO: I didn’t put much work into this section because I don’t know if you want
        to add many tools because (a) that can be seen as an endorsement and
        (b) it creates a section that can need more maintenance than average
        since tool popularity can wax and wane. One way to avoid the first
        point is to base the lists on Github stars and activity.
-->


### Web development

- The [Play Framework](https://www.playframework.com) followed the Ruby on Rails model to become a lightweight, stateless, developer-friendly, web-friendly architecture for highly-scalable applications
- [Scalatra](https://scalatra.org) is a tiny, high-performance, async web framework, inspired by Sinatra
- [Finatra](https://twitter.github.io/finatra) is Scala services built on TwitterServer and Finagle
- [Scala.js](https://www.scala-js.org) is a strongly-typed replacement for JavaScript that provides a safer way to build robust front-end web applications
- [ScalaJs-React](https://github.com/japgolly/scalajs-react) lifts Facebook’s React library into Scala.js, and endeavours to make it as type-safe and Scala-friendly as possible
- [Lagom](https://www.lagomframework.com) is a microservices framework that helps you decompose your legacy monolith and build, test, and deploy entire systems of Reactive microservices

HTTP(S) libraries:

- Akka-http
- Finch
- Http4s
- Sttp

JSON libraries:

- Argonaut
- Circe
- Jackson/Scala
- Json4s
- Jsoniter
- Play-JSON

Serialization:

- ScalaPB

Science and data analysis:

- Algebird
- Spire
- Squants


### Big data

- Spark
- Apache Flink
- SCIO, A Scala API for Apache Beam and Google Cloud Dataflow.


### AI, machine learning

- BigDL, Distributed Deep Learning Framework for Apache Spark
- TensorFlow- Scala


### Concurrency

- Akka
    - Actor model
    - Concurrency
    - High throughput


### FP

- Cats
- Zio


### Functional reactive programming

- fs2
- monix
- ScalaRx


### Build tools

- sbt
- Gradle
- Mill
- Fury?



## Summary

As this page shows, Scala has many terrific programming language features at a high level, at an everyday programming level, and through its developer ecosystem.
