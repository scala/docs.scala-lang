---
layout: multipage-overview
title: Возможности Scala
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице рассматриваются основные возможности языка программирования Scala.
language: ru
num: 2
previous-page: introduction
next-page: why-scala-3
---


Название _Scala_ происходит от слова _scalable_, и в соответствии с этим названием язык Scala используется для 
поддержки загруженных веб-сайтов и анализа огромных наборов данных. 
В этом разделе представлены функции, которые делают Scala масштабируемым языком. 
Эти функции разделены на три раздела:

- Функции высокоуровневого языка программирования
- Функции низкоуровневого языка программирования
- Особенности экосистемы Scala



## Высокоуровневые функции

Глядя на Scala с пресловутого “вида с высоты 30 000 фунтов”, вы можете сделать о нем следующие утверждения:

- Это высокоуровневый язык программирования
- Он имеет краткий, читаемый синтаксис
- Он статически типизирован (но кажется динамичным)
- Имеет выразительную систему типов
- Это язык функционального программирования (ФП)
- Это язык объектно-ориентированного программирования (ООП)
- Он поддерживает слияние ФП и ООП
- Контекстные абстракции обеспечивают понятный способ реализации _вывода терминов_ (_term inference_)
- Он работает на JVM (и в браузере)
- Беспрепятственно взаимодействует с Java кодом
- Он используется для серверных приложений (включая микросервисы), приложений для работы с большими данными, а также может использоваться в браузере с помощью Scala.js

Эти функции кратко рассматриваются в следующих разделах.


### Высокоуровневый язык

Scala считается высокоуровневым языком как минимум по двум причинам.
Во-первых, подобно Java и многим другим современным языкам, вы не имеете дело с низкоуровневыми понятиями, 
такими как указатели и управление памятью.

Во-вторых, с использованием лямбда-выражений и функций высшего порядка вы пишете свой код на очень высоком уровне. 
Как говорится в функциональном программировании, в Scala вы пишете то, _что_ хотите, а не то, _как_ этого добиться. 
То есть мы не пишем императивный код вот так:

{% tabs scala-features-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-1 %}
```scala
import scala.collection.mutable.ListBuffer

def double(ints: List[Int]): List[Int] = {
  val buffer = new ListBuffer[Int]()
  for (i <- ints) {
    buffer += i * 2
  }
  buffer.toList
}

val oldNumbers = List(1, 2, 3)
val newNumbers = double(oldNumbers)
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-1 %}
```scala
import scala.collection.mutable.ListBuffer

def double(ints: List[Int]): List[Int] =
  val buffer = new ListBuffer[Int]()
  for i <- ints do
    buffer += i * 2
  buffer.toList

val oldNumbers = List(1, 2, 3)
val newNumbers = double(oldNumbers)
```
{% endtab %}
{% endtabs %}

Этот код шаг за шагом указывает компилятору, что делать. 
Вместо этого мы пишем высокоуровневый функциональный код, используя функции высшего порядка и лямбда-выражения, 
подобные этому, для вычисления того же результата:

{% tabs scala-features-2 %}
{% tab 'Scala 2 and 3' for=scala-features-2 %}
```scala
val newNumbers = oldNumbers.map(_ * 2)
```
{% endtab %}
{% endtabs %}


Как видите, этот код намного лаконичнее, его легче читать и легче поддерживать.


### Лаконичный синтаксис

Scala имеет краткий, удобочитаемый синтаксис. 
Например, переменные создаются лаконично, а их типы понятны:

{% tabs scala-features-3 %}
{% tab 'Scala 2 and 3' for=scala-features-3 %}
```scala
val nums = List(1,2,3)
val p = Person("Martin", "Odersky")
```
{% endtab %}
{% endtabs %}


Функции высшего порядка и лямбда-выражения делают код кратким и удобочитаемым:

{% tabs scala-features-4 %}
{% tab 'Scala 2 and 3' for=scala-features-4 %}
```scala
nums.map(i => i * 2)   // длинная форма
nums.map(_ * 2)        // краткая форма

nums.filter(i => i > 1)
nums.filter(_ > 1)
```
{% endtab %}
{% endtabs %}

Трэйты, классы и методы определяются с помощью простого и легкого синтаксиса:

{% tabs scala-features-5 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-5 %}
```scala mdoc
trait Animal {
  def speak(): Unit
}

trait HasTail {
  def wagTail(): Unit
}

class Dog extends Animal with HasTail {
  def speak(): Unit = println("Woof")
  def wagTail(): Unit = println("⎞⎜⎛  ⎞⎜⎛")
}
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-5 %}
```scala
trait Animal:
  def speak(): Unit

trait HasTail:
  def wagTail(): Unit

class Dog extends Animal, HasTail:
  def speak(): Unit = println("Woof")
  def wagTail(): Unit = println("⎞⎜⎛  ⎞⎜⎛")
```
{% endtab %}
{% endtabs %}


Исследования показали, что время, которое разработчик тратит на _чтение_ и _написание_ кода, составляет как минимум 10:1, 
поэтому важно писать краткий и читабельный код.


### Ощущение динамики

Scala — это язык со статической типизацией, но благодаря своим возможностям вывода типов он кажется динамичным. 
Все эти выражения выглядят как языки с динамической типизацией, такие как Python или Ruby, но это все Scala:

{% tabs scala-features-6 class=tabs-scala-version %}
{% tab 'Scala 2' for=scala-features-6 %}
```scala
val s = "Hello"
val p = Person("Al", "Pacino")
val sum = nums.reduceLeft(_ + _)
val y = for (i <- nums) yield i * 2
val z = nums
  .filter(_ > 100)
  .filter(_ < 10_000)
  .map(_ * 2)
```
{% endtab %}
{% tab 'Scala 3' for=scala-features-6 %}
```scala
val s = "Hello"
val p = Person("Al", "Pacino")
val sum = nums.reduceLeft(_ + _)
val y = for i <- nums yield i * 2
val z = nums
  .filter(_ > 100)
  .filter(_ < 10_000)
  .map(_ * 2)
```
{% endtab %}
{% endtabs %}


Как утверждает Heather Miller, Scala считается [сильным языком со статической типизацией](https://heather.miller.am/blog/types-in-scala.html), 
и вы получаете все преимущества статических типов:

- Корректность: вы обнаруживаете большинство ошибок во время компиляции
- Отличная поддержка IDE
    - Надежное автодополнение кода
    - Отлов ошибок во время компиляции означает отлов ошибок по мере написания
    - Простой и надежный рефакторинг
- Вы можете уверенно рефакторить свой код
- Объявления типов методов сообщают читателям, что делает метод, и помогают служить документацией
- Масштабируемость и удобство обслуживания: типы помогают обеспечить корректность в произвольно больших приложениях и командах разработчиков
- Строгая типизация в сочетании с превосходным выводом типов позволяет использовать такие механизмы, как [контекстная абстракция]({{ site.scala3ref }}/contextual), которая позволяет вам опускать шаблонный код. Часто этот шаблонный код может быть выведен компилятором на основе определений типов и заданного контекста.


### Expressive type system

{% comment %}
- this text comes from the current [ScalaTour](https://docs.scala-lang.org/tour/tour-of-scala.html).
- TODO: all of the URLs will have to be updated

- i removed these items until we can replace them:
* [Compound types](/tour/compound-types.html)
* [conversions](/tour/implicit-conversions.html)
* [Explicitly typed self references](/tour/self-types.html)
{% endcomment %}

Scala’s type system enforces, at compile-time, that abstractions are used in a safe and coherent manner.
In particular, the type system supports:

- [Inferred types]({% link _overviews/scala3-book/types-inferred.md %})
- [Generic classes]({% link _overviews/scala3-book/types-generics.md %})
- [Variance annotations]({% link _overviews/scala3-book/types-variance.md %})
- [Upper](/tour/upper-type-bounds.html) and [lower](/tour/lower-type-bounds.html) type bounds
- [Polymorphic methods](/tour/polymorphic-methods.html)
- [Intersection types]({% link _overviews/scala3-book/types-intersection.md %})
- [Union types]({% link _overviews/scala3-book/types-union.md %})
- [Type lambdas]({{ site.scala3ref }}/new-types/type-lambdas.html)
- [`given` instances and `using` clauses]({% link _overviews/scala3-book/ca-given-using-clauses.md %})
- [Extension methods]({% link _overviews/scala3-book/ca-extension-methods.md %})
- [Type classes]({% link _overviews/scala3-book/ca-type-classes.md %})
- [Multiversal equality]({% link _overviews/scala3-book/ca-multiversal-equality.md %})
- [Opaque type aliases]({% link _overviews/scala3-book/types-opaque-types.md %})
- [Open classes]({{ site.scala3ref }}/other-new-features/open-classes.html)
- [Match types]({{ site.scala3ref }}/new-types/match-types.html)
- [Dependent function types]({{ site.scala3ref }}/new-types/dependent-function-types.html)
- [Polymorphic function types]({{ site.scala3ref }}/new-types/polymorphic-function-types.html)
- [Context bounds]({{ site.scala3ref }}/contextual/context-bounds.html)
- [Context functions]({{ site.scala3ref }}/contextual/context-functions.html)
- [Inner classes](/tour/inner-classes.html) and [abstract type members](/tour/abstract-type-members.html) as object members

In combination, these features provide a powerful basis for the safe reuse of programming abstractions and for the type-safe extension of software.


### A functional programming language

Scala is a functional programming (FP) language, meaning:

- Functions are values, and can be passed around like any other value
- Higher-order functions are directly supported
- Lambdas are built in
- Everything in Scala is an expression that returns a value
- Syntactically it’s easy to use immutable variables, and their use is encouraged
- It has a wealth of immutable collection classes in the standard library
- Those collection classes come with dozens of functional methods: they don’t mutate the collection, but instead return an updated copy of the data


### An object-oriented language

Scala is an object-oriented programming (OOP) language.
Every value is an instance of a class and every “operator” is a method.

In Scala, all types inherit from a top-level class `Any`, whose immediate children are `AnyVal` (_value types_, such as `Int` and `Boolean`) and `AnyRef` (_reference types_, as in Java).
This means that the Java distinction between primitive types and boxed types (e.g. `int` vs. `Integer`) isn’t present in Scala.
Boxing and unboxing is completely transparent to the user.

{% comment %}
- AnyRef above is wrong in case of strict null checking, no? On the other hand, maybe too much information to state this here
- probably not worth to mention (too advanced at this point) there is AnyKind
- Add the “types hierarchy” image here?
{% endcomment %}


### Supports FP/OOP fusion

{% comment %}
NOTE: This text in the first line comes from this slide: https://twitter.com/alexelcu/status/996408359514525696
{% endcomment %}

The essence of Scala is the fusion of functional programming and object-oriented programming in a typed setting:

- Functions for the logic
- Objects for the modularity

As [Martin Odersky has stated](https://jaxenter.com/current-state-scala-odersky-interview-129495.html), “Scala was designed to show that a fusion of functional and object-oriented programming is possible and practical.”


### Term inference, made clearer

Following Haskell, Scala was the second popular language to have some form of _implicits_.
In Scala 3 these concepts have been completely re-thought and more clearly implemented.

The core idea is _term inference_: Given a type, the compiler synthesizes a “canonical” term that has that type.
In Scala, a context parameter directly leads to an inferred argument term that could also be written down explicitly.

Use cases for this concept include implementing [type classes]({% link _overviews/scala3-book/ca-type-classes.md %}), establishing context, dependency injection, expressing capabilities, computing new types, and proving relationships between them.

Scala 3 makes this process more clear than ever before.
Read about contextual abstractions in the [Reference documentation]({{ site.scala3ref }}/contextual).


### Client &amp; server

Scala code runs on the Java Virtual Machine (JVM), so you get all of its benefits:

- Security
- Performance
- Memory management
- Portability and platform independence
- The ability to use the wealth of existing Java and JVM libraries

In addition to running on the JVM, Scala also runs in the browser with Scala.js (and open source third-party tools to integrate popular JavaScript libraries), and native executables can be built with Scala Native and GraalVM.


### Seamless Java interaction

You can use Java classes and libraries in your Scala applications, and you can use Scala code in your Java applications.
In regards to the second point, large libraries like [Akka](https://akka.io) and the [Play Framework](https://www.playframework.com) are written in Scala, and can be used in Java applications.

In regards to the first point, Java classes and libraries are used in Scala applications every day.
For instance, in Scala you can read files with a Java `BufferedReader` and `FileReader`:

{% tabs scala-features-7 %}
{% tab 'Scala 2 and 3' for=scala-features-7 %}
```scala
import java.io.*
val br = BufferedReader(FileReader(filename))
// read the file with `br` ...
```
{% endtab %}
{% endtabs %}

Using Java code in Scala is generally seamless.

Java collections can also be used in Scala, and if you want to use Scala’s rich collection class methods with them, you can convert them with just a few lines of code:

{% tabs scala-features-8 %}
{% tab 'Scala 2 and 3' for=scala-features-8 %}
```scala
import scala.jdk.CollectionConverters.*
val scalaList: Seq[Integer] = JavaClass.getJavaList().asScala.toSeq
```
{% endtab %}
{% endtabs %}


### Wealth of libraries

As you’ll see in the third section of this page, Scala libraries and frameworks like these have been written to power busy websites and work with huge datasets:

1. The [Play Framework](https://www.playframework.com) is a lightweight, stateless, developer-friendly, web-friendly architecture for creating highly-scalable applications
2. [Lagom](https://www.lagomframework.com) is a microservices framework that helps you decompose your legacy monolith and build, test, and deploy entire systems of reactive microservices
3. [Apache Spark](https://spark.apache.org) is a unified analytics engine for big data processing, with built-in modules for streaming, SQL, machine learning and graph processing

The [Awesome Scala list](https://github.com/lauris/awesome-scala) shows dozens of additional open source tools that developers have created to build Scala applications.

In addition to server-side programming, [Scala.js](https://www.scala-js.org) is a strongly-typed replacement for writing JavaScript, with open source third-party libraries that include tools to integrate with Facebook’s React library, jQuery, and more.



{% comment %}
The Lower-Level Features section is like the second part of an elevator pitch.
Assuming you told someone about the previous high-level features and then they say, “Tell me more,” this is what you might tell them.
{% endcomment %}

## Lower-level language features

Where the previous section covered high-level features of Scala, it’s interesting to note that at a high level you can make the same statements about both Scala 2 and Scala 3.
A decade ago Scala started with a strong foundation of desirable features, and as you’ll see in this section, those benefits have been improved with Scala 3.

At a “sea level” view of the details---i.e., the language features programmers use everyday---Scala 3 has significant advantages over Scala 2:

- The ability to create algebraic data types (ADTs) more concisely with enums
- An even more concise and readable syntax:
    - The “quiet” control structure syntax is easier to read
    - Optional braces
        - Fewer symbols in the code creates less visual noise, making it easier to read
    - The `new` keyword is generally no longer needed when creating class instances
    - The formality of package objects have been dropped in favor of simpler “top level” definitions
- A grammar that’s more clear:
    - Multiple different uses of the `implicit` keyword have been removed; those uses are replaced by more obvious keywords like `given`, `using`, and `extension`, focusing on intent over mechanism (see the [Givens][givens] section for details)
    - [Extension methods][extension] replace implicit classes with a clearer and simpler mechanism
    - The addition of the `open` modifier for classes makes the developer intentionally declare that a class is open for modification, thereby limiting ad-hoc extensions to a code base
    - [Multiversal equality][multiversal] rules out nonsensical comparisons with `==` and `!=` (i.e., attempting to compare a `Person` to a `Planet`)
    - Macros are implemented much more easily
    - Union and intersection offer a flexible way to model types
    - Trait parameters replace and simplify early initializers
    - [Opaque type aliases][opaque_types] replace most uses of value classes, while guaranteeing the absence of boxing
    - Export clauses provide a simple and general way to express aggregation, which can replace the previous facade pattern of package objects inheriting from classes
    - The procedure syntax has been dropped, and the varargs syntax has been changed, both to make the language more consistent
    - The `@infix` annotation makes it obvious how you want a method to be applied
    - The [`@targetName`]({{ site.scala3ref }}/other-new-features/targetName.html) method annotation defines an alternate name for the method, improving Java interoperability, and letting you provide aliases for symbolic operators

It would take too much space to demonstrate all of those features here, but follow the links in the items above to see those features in action.
All of these features are discussed in detail in the *New*, *Changed*, and *Dropped* features pages in the [Overview documentation][reference].



{% comment %}
CHECKLIST OF ALL ADDED, UPDATED, AND REMOVED FEATURES
=====================================================

New Features
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
{% endcomment %}




## Scala ecosystem

{% comment %}
TODO: I didn’t put much work into this section because I don’t know if you want
      to add many tools because (a) that can be seen as an endorsement and
      (b) it creates a section that can need more maintenance than average
      since tool popularity can wax and wane. One way to avoid the first
      point is to base the lists on Github stars and activity.
{% endcomment %}

Scala has a vibrant ecosystem, with libraries and frameworks for every need.
The [“Awesome Scala” list](https://github.com/lauris/awesome-scala) provides a list of hundreds of open source projects that are available to Scala developers, and the [Scaladex](https://index.scala-lang.org) provides a searchable index of Scala libraries.
Some of the more notable libraries are listed below.



### Web development

- The [Play Framework](https://www.playframework.com) followed the Ruby on Rails model to become a lightweight, stateless, developer-friendly, web-friendly architecture for highly-scalable applications
- [Scalatra](https://scalatra.org) is a tiny, high-performance, async web framework, inspired by Sinatra
- [Finatra](https://twitter.github.io/finatra) is Scala services built on TwitterServer and Finagle
- [Scala.js](https://www.scala-js.org) is a strongly-typed replacement for JavaScript that provides a safer way to build robust front-end web applications
- [ScalaJs-React](https://github.com/japgolly/scalajs-react) lifts Facebook’s React library into Scala.js, and endeavours to make it as type-safe and Scala-friendly as possible
- [Lagom](https://www.lagomframework.com) is a microservices framework that helps you decompose your legacy monolith and build, test, and deploy entire systems of Reactive microservices

HTTP(S) libraries:

- [Akka-http](https://akka.io)
- [Finch](https://github.com/finagle/finch)
- [Http4s](https://github.com/http4s/http4s)
- [Sttp](https://github.com/softwaremill/sttp)

JSON libraries:

- [Argonaut](https://github.com/argonaut-io/argonaut)
- [Circe](https://github.com/circe/circe)
- [Json4s](https://github.com/json4s/json4s)
- [Play-JSON](https://github.com/playframework/play-json)

Serialization:

- [ScalaPB](https://github.com/scalapb/ScalaPB)

### Science and data analysis:

- [Algebird](https://github.com/twitter/algebird)
- [Spire](https://github.com/typelevel/spire)
- [Squants](https://github.com/typelevel/squants)


### Big data

- [Apache Spark](https://github.com/apache/spark)
- [Apache Flink](https://github.com/apache/flink)


### AI, machine learning

- [BigDL](https://github.com/intel-analytics/BigDL) (Distributed Deep Learning Framework for Apache Spark) for Apache Spark
- [TensorFlow Scala](https://github.com/eaplatanios/tensorflow_scala)


### Functional Programming &amp; Functional Reactive Programming

FP:

- [Cats](https://github.com/typelevel/cats)
- [Zio](https://github.com/zio/zio)

Functional reactive programming (FRP):

- [fs2](https://github.com/typelevel/fs2)
- [monix](https://github.com/monix/monix)


### Build tools

- [sbt](https://www.scala-sbt.org)
- [Gradle](https://gradle.org)
- [Mill](https://github.com/lihaoyi/mill)



## Summary

As this page shows, Scala has many terrific programming language features at a high level, at an everyday programming level, and through its developer ecosystem.



[reference]: {{ site.scala3ref }}/overview.html
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[givens]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[opaque_types]: {% link _overviews/scala3-book/types-opaque-types.md %}



