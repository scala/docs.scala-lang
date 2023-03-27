---
title: Domain Modeling
type: section
description: This section provides an introduction to data modeling in Scala 3.
languages: [ru, zh-cn]
num: 9
previous-page: taste-control-structures
next-page: taste-methods
---


{% comment %}
NOTE: I kept the OOP section first, assuming that most readers will be coming from an OOP background.
{% endcomment %}

Scala supports both functional programming (FP) and object-oriented programming (OOP), as well as a fusion of the two paradigms.
This section provides a quick overview of data modeling in OOP and FP.

## OOP Domain Modeling

When writing code in an OOP style, your two main tools for data encapsulation are _traits_ and _classes_.

{% comment %}
NOTE: Julien had a comment, “in OOP we don’t really model data.
It’s more about modeling operations, imho.”

How to resolve? Is there a good DDD term to use here?
{% endcomment %}

### Traits

Scala traits can be used as simple interfaces, but they can also contain abstract and concrete methods and fields, and they can have parameters, just like classes.
They provide a great way for you to organize behaviors into small, modular units.
Later, when you want to create concrete implementations of attributes and behaviors, classes and objects can extend traits, mixing in as many traits as needed to achieve the desired behavior.

As an example of how to use traits as interfaces, here are three traits that define well-organized and modular behaviors for animals like dogs and cats:

{% tabs traits class=tabs-scala-version %}
{% tab 'Scala 2' for=traits %}

```scala
trait Speaker {
  def speak(): String  // has no body, so it’s abstract
}

trait TailWagger {
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running")
}
```

{% endtab %}

{% tab 'Scala 3' for=traits %}

```scala
trait Speaker:
  def speak(): String  // has no body, so it’s abstract

trait TailWagger:
  def startTail(): Unit = println("tail is wagging")
  def stopTail(): Unit = println("tail is stopped")

trait Runner:
  def startRunning(): Unit = println("I’m running")
  def stopRunning(): Unit = println("Stopped running")
```

{% endtab %}
{% endtabs %}

Given those traits, here’s a `Dog` class that extends all of those traits while providing a behavior for the abstract `speak` method:

{% tabs traits-class class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-class %}

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner {
  def speak(): String = "Woof!"
}
```

{% endtab %}

{% tab 'Scala 3' for=traits-class %}

```scala
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
```

{% endtab %}
{% endtabs %}

Notice how the class extends the traits with the `extends` keyword.

Similarly, here’s a `Cat` class that implements those same traits while also overriding two of the concrete methods it inherits:

{% tabs traits-override class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-override %}

```scala
class Cat(name: String) extends Speaker with TailWagger with Runner {
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
}
```

{% endtab %}

{% tab 'Scala 3' for=traits-override %}

```scala
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
```

{% endtab %}
{% endtabs %}

These examples show how those classes are used:

{% tabs traits-use class=tabs-scala-version %}
{% tab 'Scala 2' for=traits-use %}

```scala
val d = new Dog("Rover")
println(d.speak())      // prints "Woof!"

val c = new Cat("Morris")
println(c.speak())      // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

{% endtab %}

{% tab 'Scala 3' for=traits-use %}

```scala
val d = Dog("Rover")
println(d.speak())      // prints "Woof!"

val c = Cat("Morris")
println(c.speak())      // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

{% endtab %}
{% endtabs %}

If that code makes sense---great, you’re comfortable with traits as interfaces.
If not, don’t worry, they’re explained in more detail in the [Domain Modeling][data-1] chapter.

### Classes

Scala _classes_ are used in OOP-style programming.
Here’s an example of a class that models a “person.” In OOP fields are typically mutable, so `firstName` and `lastName` are both declared as `var` parameters:

{% tabs class_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=class_1 %}

```scala
class Person(var firstName: String, var lastName: String) {
  def printFullName() = println(s"$firstName $lastName")
}

val p = new Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

{% endtab %}

{% tab 'Scala 3' for=class_1 %}

```scala
class Person(var firstName: String, var lastName: String):
  def printFullName() = println(s"$firstName $lastName")

val p = Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

{% endtab %}
{% endtabs %}

Notice that the class declaration creates a constructor:

{% tabs class_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=class_2 %}

```scala
// this code uses that constructor
val p = new Person("John", "Stephens")
```

{% endtab %}

{% tab 'Scala 3' for=class_2 %}

```scala
// this code uses that constructor
val p = Person("John", "Stephens")
```

{% endtab %}
{% endtabs %}

Constructors and other class-related topics are covered in the [Domain Modeling][data-1] chapter.

## FP Domain Modeling

{% comment %}
NOTE: Julien had a note about expecting to see sealed traits here.
I didn’t include that because I didn’t know if enums are intended
to replace the Scala2 “sealed trait + case class” pattern. How to resolve?
{% endcomment %}

When writing code in an FP style, you’ll use these concepts:

- Algebraic Data Types to define the data
- Traits for functionality on the data.

### Enumerations and Sum Types

Sum types are one way to model algebraic data types (ADTs) in Scala.

They are used when data can be represented with different choices.

For instance, a pizza has three main attributes:

- Crust size
- Crust type
- Toppings

These are concisely modeled with enumerations, which are sum types that only contain singleton values:

{% tabs enum_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_1 %}

In Scala 2 `sealed` classes and `case object` are combined to define an enumeration:

```scala
sealed abstract class CrustSize
object CrustSize {
  case object Small extends CrustSize
  case object Medium extends CrustSize
  case object Large extends CrustSize
}

sealed abstract class CrustType
object CrustType {
  case object Thin extends CrustType
  case object Thick extends CrustType
  case object Regular extends CrustType
}

sealed abstract class Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping
}
```

{% endtab %}
{% tab 'Scala 3' for=enum_1 %}

Scala 3 offers the `enum` construct for defining enumerations:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

{% endtab %}
{% endtabs %}

Once you have an enumeration you can import its members as ordinary values:

{% tabs enum_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_2 %}

```scala
import CrustSize._
val currentCrustSize = Small

// enums in a `match` expression
currentCrustSize match {
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")
}

// enums in an `if` statement
if (currentCrustSize == Small) println("Small crust size")
```

{% endtab %}
{% tab 'Scala 3' for=enum_2 %}

```scala
import CrustSize.*
val currentCrustSize = Small

// enums in a `match` expression
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")

// enums in an `if` statement
if currentCrustSize == Small then println("Small crust size")
```

{% endtab %}
{% endtabs %}

Here’s another example of how to create a sum type with Scala, this would not be called an enumeration because the `Succ` case has parameters:

{% tabs enum_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=enum_3 %}

```scala
sealed abstract class Nat
object Nat {
  case object Zero extends Nat
  case class Succ(pred: Nat) extends Nat
}
```

Sum Types are covered in detail in the [Domain Modeling]({% link _overviews/scala3-book/domain-modeling-tools.md %}) section of this book.

{% endtab %}
{% tab 'Scala 3' for=enum_3 %}

```scala
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

Enums are covered in detail in the [Domain Modeling]({% link _overviews/scala3-book/domain-modeling-tools.md %}) section of this book, and in the [Reference documentation]({{ site.scala3ref }}/enums/enums.html).

{% endtab %}
{% endtabs %}

### Product Types

A product type is an algebraic data type (ADT) that only has one shape, for example a singleton object, represented in Scala by a `case` object; or an immutable structure with accessible fields, represented by a `case` class.

A `case` class has all of the functionality of a `class`, and also has additional features baked in that make them useful for functional programming.
When the compiler sees the `case` keyword in front of a `class` it has these effects and benefits:

- Case class constructor parameters are public `val` fields by default, so the fields are immutable, and accessor methods are generated for each parameter.
- An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions.
- A `copy` method is generated in the class.
  This provides a way to create updated copies of the object without changing the original object.
- `equals` and `hashCode` methods are generated to implement structural equality.
- A default `toString` method is generated, which is helpful for debugging.

{% comment %}
NOTE: Julien had a comment about how he decides when to use case classes vs classes. Add something here?
{% endcomment %}

You _can_ manually add all of those methods to a class yourself, but since those features are so commonly used in functional programming, using a `case` class is much more convenient.

This code demonstrates several `case` class features:

{% tabs case-class %}
{% tab 'Scala 2 and 3' for=case-class %}

```scala
// define a case class
case class Person(
  name: String,
  vocation: String
)

// create an instance of the case class
val p = Person("Reginald Kenneth Dwight", "Singer")

// a good default toString method
p                // : Person = Person(Reginald Kenneth Dwight,Singer)

// can access its fields, which are immutable
p.name           // "Reginald Kenneth Dwight"
p.name = "Joe"   // error: can’t reassign a val field

// when you need to make a change, use the `copy` method
// to “update as you copy”
val p2 = p.copy(name = "Elton John")
p2               // : Person = Person(Elton John,Singer)
```

{% endtab %}
{% endtabs %}

See the [Domain Modeling][data-1] sections for many more details on `case` classes.

[data-1]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
