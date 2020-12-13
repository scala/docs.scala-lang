---
title: OOP Modeling
type: section
description: This chapter provides an introduction to OOP domain modeling with Scala 3.
num: 18
previous-page: domain-modeling-tools
next-page: domain-modeling-fp
---

This chapter provides an introduction to object-oriented programming (OOP) style domain modeling in Scala 3.



## Introduction

The “big three” concepts in OOP are encapsulation, polymorphism, and inheritance:

- *Encapsulation* consists of grouping related concepts — attributes and behaviors — into a logical unit, and then hiding the implementation details from the outside world.
- *Inheritance* refers to the ability of a class to inherit behavior from a parent class (superclass), and then override the default behavior as needed.
- *Polymorphism* literally means “many forms,” and in OOP it typically refers to the ability that methods can take on multiple forms.

Other OOP concepts include abstraction, state retention, message passing, and more. The important part is that Scala is a pure OOP language, and it has support for all of these features.

This chapter focuses on two main concepts:

- Defining classes as a blueprints for creating objects
- Create interfaces with traits (as needed), and implementing those interfaces with classes




## Classes

As shown in the [Modeling Tools section](domain-modeling-tools.md), these examples show how to define classes that only have constructor parameters:

```scala
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

In OOP, fields are typically mutable, so those parameters are defined as `var` fields so they can be mutated. These examples show how to create a `Person` instance, access its fields, and mutate its fields:

```scala
// define a class
class Person(var name: String, var vocation: String)

// create an instance of the class
val p = Person("Reginald Kenneth Dwight", "Pianist")

// access the fields
p.name       // "Reginald Kenneth Dwight"
p.vocation   // "Pianist"

// mutate the fields
p.name = "Elton John"
p.vocation = "Musician"

// access the fields again
p.name       // "Elton John"
p.vocation   // "Musician"
```


### Classes with attributes and behaviors

Of course OOP style classes can have attributes and behaviors, and they should allow for information hiding.

#### A smaller example

As a small example to get started, here’s another `Person` class. It has two constructor parameters — `name` and `vocation` — and it also has a third field named `age` that you can set after you’ve created the class. Like Java, you can provide a custom `toString` method in a class to control what the class looks like when you print it or access it in the REPL. This example shows how to define this class, create an instance of it, and then use that instance:

```scala
class Person(var name: String, var vocation: String):
  var age = 0
  override def toString =
    s"$name is $age years old, and is a $vocation"

// create an instance
val p = Person("Ludwig van Beethoven", "Musician")

// set the `age` field
p.age = 56

// use the `toString` method
println(p)   // "Ludwig van Beethoven is 56 years old, and is a Musician"
```

That example shows how to create a class field as well as a method in the class.


#### A larger example

Given that background, let’s create a larger class, a `Pizza` class for a pizza store. First, we need to define a few types that are class will need. This code defines `CrustSize`, `CrustType`, and `Topping` types as enumerations:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

Now we can import those enumerations, along with an `ArrayBuffer`, which we’ll also need:

```scala
import CrustSize._
import CrustType._
import Topping._
import scala.collection.mutable.ArrayBuffer
```

Given that code, you can now define an OOP-style `Pizza` class like this:

```scala
class Pizza(
  var crustSize: CrustSize,
  var crustType: CrustType
):

  private val toppings = ArrayBuffer[Topping]()

  def addTopping(t: Topping): Unit = 
    toppings += t

  def removeTopping(t: Topping): Unit = 
    toppings -= t

  def removeAllToppings(): Unit = 
    toppings.clear()

  override def toString(): String =
    s"""
      |Pizza:
      |  Crust Size: ${crustSize}
      |  Crust Type: ${crustType}
      |  Toppings:   ${toppings}
    """.stripMargin

end Pizza
```

Now you can create a `Pizza` instance, and mutate its fields as desired to get what you want:

```scala
// create an instance
val p = Pizza(Small, Thin)

// change the crust
p.crustSize = Large
p.crustType = Thick

// add and remove toppings
p.addTopping(Cheese)
p.addTopping(Pepperoni)
p.addTopping(BlackOlives)
p.removeTopping(Pepperoni)

// print the pizza, which uses its `toString` method
println(p)
```

That `println` statement prints this output:

````
Pizza:
  Crust Size: Large
  Crust Type: Thick
  Toppings:   ArrayBuffer(Cheese, BlackOlives)
````

Hopefully if you’re familiar with OOP languages like Java and Python, this code looks similar to what you’re used to.




### Using traits as interfaces

In object-oriented programming it’s also common to use interfaces, and then implement those interfaces with classes. When writing OOP code with Scala you do the same thing: you create interfaces as traits, and then create classes that extend those traits.

For example, this is a trait that defines an attribute named `numLegs`, and two behaviors. The `walk()` behavior is abstract, because it doesn’t have a method body, and `stop()` is a concrete method, because it has a method body. Even though `stop()` is defined, it can also be overridden in your classes:

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```

Similarly, this is a trait that defines two abstract behaviors for a “tail,” such as a tail on a dog, cat, or other animals:

```scala
trait HasTail:
  def wagTail(): Unit
  def stopTail(): Unit
```

Now you can define a class named `Dog` that extends both of those traits, and implements their behaviors:

```scala
class Dog(var name: String) extends HasLegs, HasTail:
  val numLegs = 4
  def walk() = println("I’m walking")
  def wagTail() = println("⎞⎜⎛  ⎞⎜⎛")
  def stopTail() = println("Tail is stopped")
  override def toString = s"$name is a Dog"

// create a Dog instance
val d = Dog("Rover")

// use the attributes and behaviors
println(d.numLegs)   // 4
d.wagTail()          // "⎞⎜⎛  ⎞⎜⎛"
d.walk()             // "I’m walking"
```

Note that the methods `walk()`, `wagTail()`, and `stopTail()` are defined with empty parentheses. This isn’t necessary, you could define them as `walk`, `wagTail`, and `stopTail`, but a Scala recommendation is to name methods like these that have *side effects* with open parentheses. When you do this, it requires callers of these methods to use open parentheses when they call the methods, and this is a reminder that these methods have side effects.
<!-- TODO: link to a "side effects" discussion -->

Scala classes have other features to support OOP-style programming:

- You can define methods and fields to be `private` or `protected`, to control how they are accessed and overridden
- Classes can have multiple constructors
- As shown in the [Modeling Tools section](domain-modeling-tools.md), class constructor parameters can have default values
- A class can be marked as `open`, signaling that it’s planned for extensions:

```scala
open class MyOpenClass:
  // ...
```

For more details on working with classes, see the Reference documentation.
<!-- TODO: link to the Reference docs -->





