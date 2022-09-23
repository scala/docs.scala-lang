---
layout: multipage-overview
title: Почему Scala 3?
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице описаны преимущества языка программирования Scala 3.
language: ru
num: 3
previous-page: scala-features
next-page: taste-intro
---

Использование Scala, и Scala 3 в частности, дает много преимуществ. 
Трудно перечислить их все, но “топ десять” может выглядеть так:

1. Scala сочетает в себе функциональное программирование (ФП) и объектно-ориентированное программирование (ООП)
2. Scala статически типизирован, но часто ощущается как язык с динамической типизацией
3. Синтаксис Scala лаконичен, но все же удобочитаем; его часто называют _выразительным_
4. _Implicits_ в Scala 2 были определяющей функцией, а в Scala 3 они были улучшены и упрощены
5. Scala легко интегрируется с Java, поэтому вы можете создавать проекты со смешанным кодом Scala и Java, а код Scala легко использует тысячи существующих библиотек Java
6. Scala можно использовать на сервере, а также в браузере со [Scala.js](https://www.scala-js.org)
7. Стандартная библиотека Scala содержит десятки готовых функциональных методов, позволяющих сэкономить ваше время и значительно сократить потребность в написании пользовательских циклов `for` и алгоритмов
8. “Best practices”, встроенные в Scala, поддерживают неизменность, анонимные функции, функции высшего порядка, сопоставление с образцом, классы, которые не могут быть расширены по умолчанию, и многое другое
9. Экосистема Scala предлагает самые современные ФП библиотеки в мире
10. Сильная система типов


## 1) Слияние ФП/ООП

Больше, чем любой другой язык, Scala поддерживает слияние парадигм ФП и ООП.
Как заявил Мартин Одерски, сущность Scala — это слияние функционального и объектно-ориентированного программирования в типизированной среде с:

- Функции для логики и
- Объекты для модульности

Возможно, одними из лучших примеров модульности являются классы стандартной библиотеки.
Например, `List` определяется как класс---технически это абстрактный класс---и новый экземпляр создается следующим образом:

{% tabs list %}
{% tab 'Scala 2 and 3' for=list %}
```scala
val x = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

Однако то, что кажется программисту простым `List`, на самом деле построено из комбинации нескольких специализированных типов, 
включая трейты с именами `Iterable`, `Seq` и `LinearSeq`. 
Эти типы также состоят из других небольших модульных единиц кода.

В дополнение к построению типа наподобие `List` из серии модульных трейтов, 
`List` API также состоит из десятков других методов, многие из которых являются функциями высшего порядка:

{% tabs list-methods %}
{% tab 'Scala 2 and 3' for=list-methods %}
```scala
val xs = List(1, 2, 3, 4, 5)

xs.map(_ + 1)         // List(2, 3, 4, 5, 6)
xs.filter(_ < 3)      // List(1, 2)
xs.find(_ > 3)        // Some(4)
xs.takeWhile(_ < 3)   // List(1, 2)
```
{% endtab %}
{% endtabs %}

В этих примерах значения в списке не могут быть изменены. 
Класс `List` неизменяем, поэтому все эти методы возвращают новые значения, как показано в каждом комментарии.

## 2) Ощущение динамики

_Вывод типов_ (_type inference_) в Scala часто заставляет язык чувствовать себя динамически типизированным, даже если он статически типизирован. 
Это верно для объявления переменной:

{% tabs dynamic %}
{% tab 'Scala 2 and 3' for=dynamic %}
```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3,4,5)
val stuff = ("fish", 42, 1_234.5)
```
{% endtab %}
{% endtabs %}

Это также верно при передаче анонимных функций функциям высшего порядка:

{% tabs dynamic-hof %}
{% tab 'Scala 2 and 3' for=dynamic-hof %}
```scala
list.filter(_ < 4)
list.map(_ * 2)
list.filter(_ < 4)
    .map(_ * 2)
```
{% endtab %}
{% endtabs %}

и при определении методов:

{% tabs dynamic-method %}
{% tab 'Scala 2 and 3' for=dynamic-method %}
```scala
def add(a: Int, b: Int) = a + b
```
{% endtab %}
{% endtabs %}

Это как никогда верно для Scala 3, например, при использовании [типов объединения][union-types]:

{% tabs union %}
{% tab 'Scala 3 Only' for=union %}
```scala
// параметр типа объединения
def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // дальнейший код ...

// значение типа объединения
val b: Password | Username = if (true) name else password
```
{% endtab %}
{% endtabs %}

## 3) Лаконичный синтаксис

Scala — это неформальный, “краткий, но все же читабельный“ язык. Например, объявление переменной лаконично:

{% tabs concise %}
{% tab 'Scala 2 and 3' for=concise %}
```scala
val a = 1
val b = "Hello, world"
val c = List(1,2,3)
```
{% endtab %}
{% endtabs %}

Создание типов, таких как трейты, классы и перечисления, является кратким:

{% tabs enum %}
{% tab 'Scala 3 Only' for=enum %}
```scala
trait Tail:
  def wagTail(): Unit
  def stopTail(): Unit

enum Topping:
  case Cheese, Pepperoni, Sausage, Mushrooms, Onions

class Dog extends Animal, Tail, Legs, RubberyNose

case class Person(
  firstName: String,
  lastName: String,
  age: Int
)
```
{% endtab %}
{% endtabs %}

Функции высшего порядка кратки:

{% tabs list-hof %}
{% tab 'Scala 2 and 3' for=list-hof %}

```scala
list.filter(_ < 4)
list.map(_ * 2)
```
{% endtab %}
{% endtabs %}

Все эти и многие другие выражения кратки и при этом очень удобочитаемы: то, что мы называем _выразительным_ (_expressive_).

## 4) Implicits, упрощение

Implicits в Scala 2 были главной отличительной особенностью дизайна. 
Они представляли собой фундаментальный способ абстрагирования от контекста с единой парадигмой, 
которая обслуживала множество вариантов использования, среди которых:

- Реализация [типовых классов]({% link _overviews/scala3-book/ca-type-classes.md %})
- Установление контекста
- Внедрение зависимости
- Выражение возможностей

С тех пор другие языки приняли аналогичные концепции, все из которых являются вариантами основной идеи вывода терминов: 
при заданном типе компилятор синтезирует “канонический” термин, имеющий этот тип.

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
- [Akka Actors](https://akka.io) let you use the actor model to greatly simplify distributed and concurrent software applications

Scala can also be used in the browser with the [Scala.js project](https://www.scala-js.org), which is a type-safe replacement for JavaScript.
The Scala.js ecosystem [has dozens of libraries](https://www.scala-js.org/libraries) to let you use React, Angular, jQuery, and many other JavaScript and Scala libraries in the browser.

In addition to those tools, the [Scala Native](https://github.com/scala-native/scala-native) project “is an optimizing ahead-of-time compiler and lightweight managed runtime designed specifically for Scala.” It lets you build “systems” style binary executable applications with plain Scala code, and also lets you use lower-level primitives.

## 7) Standard library methods

You will rarely ever need to write a custom `for` loop again, because the dozens of pre-built functional methods in the Scala standard library will both save you time, and help make code more consistent across different applications.

The following examples show some of the built-in collections methods, and there are many in addition to these.
While these all use the `List` class, the same methods work with other collections classes like `Seq`, `Vector`, `LazyList`, `Set`, `Map`, `Array`, and `ArrayBuffer`.

Here are some examples:

{% tabs list-more %}
{% tab 'Scala 2 and 3' for=list-more %}
```scala
List.range(1, 3)                          // List(1, 2)
List.range(start = 1, end = 6, step = 2)  // List(1, 3, 5)
List.fill(3)("foo")                       // List(foo, foo, foo)
List.tabulate(3)(n => n * n)              // List(0, 1, 4)
List.tabulate(4)(n => n * n)              // List(0, 1, 4, 9)

val a = List(10, 20, 30, 40, 10)          // List(10, 20, 30, 40, 10)
a.distinct                                // List(10, 20, 30, 40)
a.drop(2)                                 // List(30, 40, 10)
a.dropRight(2)                            // List(10, 20, 30)
a.dropWhile(_ < 25)                       // List(30, 40, 10)
a.filter(_ < 25)                          // List(10, 20, 10)
a.filter(_ > 100)                         // List()
a.find(_ > 20)                            // Some(30)
a.head                                    // 10
a.headOption                              // Some(10)
a.init                                    // List(10, 20, 30, 40)
a.intersect(List(19,20,21))               // List(20)
a.last                                    // 10
a.lastOption                              // Some(10)
a.map(_ * 2)                              // List(20, 40, 60, 80, 20)
a.slice(2, 4)                             // List(30, 40)
a.tail                                    // List(20, 30, 40, 10)
a.take(3)                                 // List(10, 20, 30)
a.takeRight(2)                            // List(40, 10)
a.takeWhile(_ < 30)                       // List(10, 20)
a.filter(_ < 30).map(_ * 10)              // List(100, 200, 100)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)                 // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)             // List(A, P, P, L, E, P, E, A, R)

val nums = List(10, 5, 8, 1, 7)
nums.sorted                               // List(1, 5, 7, 8, 10)
nums.sortWith(_ < _)                      // List(1, 5, 7, 8, 10)
nums.sortWith(_ > _)                      // List(10, 8, 7, 5, 1)
```
{% endtab %}
{% endtabs %}

## 8) Built-in best practices

Scala idioms encourage best practices in many ways.
For immutability, you’re encouraged to create immutable `val` declarations:

{% tabs val %}
{% tab 'Scala 2 and 3' for=val %}
```scala
val a = 1                 // immutable variable
```
{% endtab %}
{% endtabs %}

You’re also encouraged to use immutable collections classes like `List` and `Map`:

{% tabs list-map %}
{% tab 'Scala 2 and 3' for=list-map %}
```scala
val b = List(1,2,3)       // List is immutable
val c = Map(1 -> "one")   // Map is immutable
```
{% endtab %}
{% endtabs %}

Case classes are primarily intended for use in [domain modeling]({% link _overviews/scala3-book/domain-modeling-intro.md %}), and their parameters are immutable:

{% tabs case-class %}
{% tab 'Scala 2 and 3' for=case-class %}
```scala
case class Person(name: String)
val p = Person("Michael Scott")
p.name           // Michael Scott
p.name = "Joe"   // compiler error (reassignment to val name)
```
{% endtab %}
{% endtabs %}

As shown in the previous section, Scala collections classes support higher-order functions, and you can pass methods (not shown) and anonymous functions into them:

{% tabs higher-order %}
{% tab 'Scala 2 and 3' for=higher-order %}
```scala
a.dropWhile(_ < 25)
a.filter(_ < 25)
a.takeWhile(_ < 30)
a.filter(_ < 30).map(_ * 10)
nums.sortWith(_ < _)
nums.sortWith(_ > _)
```
{% endtab %}
{% endtabs %}

`match` expressions let you use pattern matching, and they truly are _expressions_ that return values:

{% tabs match class=tabs-scala-version %}
{% tab 'Scala 2' for=match %}
```scala
val numAsString = i match {
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
}
```
{% endtab %}

{% tab 'Scala 3' for=match %}
```scala
val numAsString = i match
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
```
{% endtab %}
{% endtabs %}

Because they can return values, they’re often used as the body of a method:

{% tabs match-body class=tabs-scala-version %}
{% tab 'Scala 2' for=match-body %}
```scala
def isTruthy(a: Matchable) = a match {
  case 0 | "" => false
  case _ => true
}
```
{% endtab %}

{% tab 'Scala 3' for=match-body %}
```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" => false
  case _ => true
```
{% endtab %}
{% endtabs %}

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
- Safe initialization

Good examples of _ergonomics_ are enumerations and extension methods, which have been added to Scala 3 in a very readable manner:

{% tabs extension %}
{% tab 'Scala 3 Only' for=extension %}
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
{% endtab %}
{% endtabs %}

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
[reference]: {{ site.scala3ref }}
[dropped]: {{ site.scala3ref }}/dropped-features
[changed]: {{ site.scala3ref }}/changed-features
[added]:{{ site.scala3ref }}/other-new-features

[union-types]: {% link _overviews/scala3-book/types-union.md %}
[opaque-types]: {% link _overviews/scala3-book/types-opaque-types.md %}
