---
type: chapter
layout: multipage-overview
title: Case Classes
description: This lesson provides an introduction to 'case classes' in Scala.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 49
outof: 54
previous-page: companion-objects
next-page: case-objects
---


Another Scala feature that provides support for functional programming is the *case class*. A case class has all of the functionality of a regular class, and more. When the compiler sees the `case` keyword in front of a `class`, it generates code for you, with the following benefits:

* Case class constructor parameters are public `val` fields by default, so accessor methods are generated for each parameter.
* An `apply` method is created in the companion object of the class, so you don’t need to use the `new` keyword to create a new instance of the class.
* An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions.
* A `copy` method is generated in the class. You may not use this feature in Scala/OOP code, but it’s used all the time in Scala/FP.
* `equals` and `hashCode` methods are generated, which let you compare objects and easily use them as keys in maps.
* A default `toString` method is generated, which is helpful for debugging.

These features are all demonstrated in the following sections.



## With `apply` you don’t need `new`

When you define a class as a `case` class, you don’t have to use the `new` keyword to create a new instance:

```scala
scala> case class Person(name: String, relation: String)
defined class Person

// "new" not needed before Person
scala> val christina = Person("Christina", "niece")
christina: Person = Person(Christina,niece)
```

As discussed in the previous lesson, this works because a method named `apply` is generated inside `Person`’s companion object.



## No mutator methods

Case class constructor parameters are `val` fields by default, so an *accessor* method is generated for each parameter:

```scala
scala> christina.name
res0: String = Christina
```

But, *mutator* methods are not generated:

```scala
// can't mutate the `name` field
scala> christina.name = "Fred"
<console>:10: error: reassignment to val
       christina.name = "Fred"
                  ^
```

Because in FP you never mutate data structures, it makes sense that constructor fields default to `val`.



## An `unapply` method

In the previous lesson on companion objects you saw how to write `unapply` methods. A great thing about a case class is that it automatically generates an `unapply` method for your class, so you don’t have to write one.

To demonstrate this, imagine that you have this trait:

```scala
trait Person {
    def name: String
}
```

Then, create these case classes to extend that trait:

```scala
case class Student(name: String, year: Int) extends Person
case class Teacher(name: String, specialty: String) extends Person
```

Because those are defined as case classes — and they have built-in `unapply` methods — you can write a match expression like this:

```scala
def getPrintableString(p: Person): String = p match {
    case Student(name, year) =>
        s"$name is a student in Year $year."
    case Teacher(name, whatTheyTeach) =>
        s"$name teaches $whatTheyTeach."
}
```

Notice these two patterns in the `case` statements:

```scala
case Student(name, year) =>
case Teacher(name, whatTheyTeach) =>
```

Those patterns work because `Student` and `Teacher` are defined as case classes that have `unapply` methods whose type signature conforms to a certain standard. Technically, the specific type of pattern matching shown in these examples is known as a *constructor pattern*.

>The Scala standard is that an `unapply` method returns the case class constructor fields in a tuple that’s wrapped in an `Option`. The “tuple” part of the solution was shown in the previous lesson.

To show how that code works, create an instance of `Student` and `Teacher`:

```scala
val s = Student("Al", 1)
val t = Teacher("Bob Donnan", "Mathematics")
```

Next, this is what the output looks like in the REPL when you call `getPrintableString` with those two instances:

```scala
scala> getPrintableString(s)
res0: String = Al is a student in Year 1.

scala> getPrintableString(t)
res1: String = Bob Donnan teaches Mathematics.
```

>All of this content on `unapply` methods and extractors is a little advanced for an introductory book like this, but because case classes are an important FP topic, it seems better to cover them, rather than skipping over them.



## `copy` method

A `case` class also has an automatically-generated `copy` method that’s extremely helpful when you need to perform the process of a) cloning an object and b) updating one or more of the fields during the cloning process. As an example, this is what the process looks like in the REPL:

```scala
scala> case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
defined class BaseballTeam

scala> val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
cubs1908: BaseballTeam = BaseballTeam(Chicago Cubs,1908)

scala> val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
cubs2016: BaseballTeam = BaseballTeam(Chicago Cubs,2016)
```

As shown, when you use the `copy` method, all you have to do is supply the names of the fields you want to modify during the cloning process.

Because you never mutate data structures in FP, this is how you create a new instance of a class from an existing instance. This process can be referred to as, “update as you copy.”



## `equals` and `hashCode` methods

Case classes also have automatically-generated `equals` and `hashCode` methods, so instances can be compared:

```scala
scala> case class Person(name: String, relation: String)
defined class Person

scala> val christina = Person("Christina", "niece")
christina: Person = Person(Christina,niece)

scala> val hannah = Person("Hannah", "niece")
hannah: Person = Person(Hannah,niece)

scala> christina == hannah
res1: Boolean = false
```

These methods also let you easily use your objects in collections like sets and maps.



## `toString` methods

Finally, `case` classes also have a good default `toString` method implementation, which at the very least is helpful when debugging code:

```scala
scala> christina
res0: Person = Person(Christina,niece)
```



## The biggest advantage

While all of these features are great benefits to functional programming, as they write in the book, [Programming in Scala](https://www.amazon.com/Programming-Scala-Updated-2-12/dp/0981531687/) (Odersky, Spoon, and Venners), “the biggest advantage of case classes is that they support pattern matching.” Pattern matching is a major feature of FP languages, and Scala’s case classes provide a simple way to implement pattern matching in match expressions and other areas.


