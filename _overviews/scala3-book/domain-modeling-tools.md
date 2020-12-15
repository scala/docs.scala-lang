---
title: Tools
type: section
description: This chapter provides an introduction to the available domain modeling tools in Scala 3, including classes, traits, enums, and more.
num: 20
previous-page: domain-modeling-intro
next-page: domain-modeling-oop
---



Scala 3 provides us with the following tools to model the world around us:

- Class
- Companion object
- Trait
- Abstract class
- Enum
- Case class
- Case object

The following sections introduce each of these modeling tools.



## Classes

As with other languages, a Scala *class* is a template for the creation of object instances. Here are some examples of classes that have constructor parameters, but no fields or methods:

```scala
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

All of those parameters are defined as `var` fields, which means they are mutable: you can read them, and also modify them. If you want them to be immutable — read only — create them as `val` fields instead.

Prior to Scala 3, you used the `new` keyword to create a new instance of a class:

```scala
val p = new Person("Robert Allen Zimmerman", "Harmonica Player")
        ---
```

However, this isn’t required in Scala 3:

```scala
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

Once you have an instance of a class, you can access its fields, which in this example are all constructor parameters:

```scala
p.name       // "Robert Allen Zimmerman"
p.vocation   // "Harmonica Player"
```

As mentioned, all of these parameters were created as `var` fields, so you can also mutate them:

```scala
p.name = "Bob Dylan"
p.vocation = "Musician"
```


### Fields and methods

In addition to constructor parameters, classes can also have fields and methods. They are defined in the body of the class, which also serves as the class constructor:

```scala
class Person(var firstName: String, var lastName: String):
  
  println("the constructor begins")
  val fullName = firstName + " " + lastName

  // a class method
  def printFullName: Unit =
    // access the `fullName` field, which is created above
    println(fullName)
  
  printFullName
  println("this ends the constructor")
```

The REPL shows how to create a new `Person` instance with this class:

````
scala> val john = Person("John", "Doe")
the constructor begins
John Doe
this ends the constructor
val john: Person = Person@55d8f6bb

scala> john.printFullName
John Doe
````

Classes can also extend traits and abstract classes. Examples of this are shown in the Trait and Abstract Class sections.


### Default parameter values

As a quick look at a few other features, class constructor parameters can also have default values:

```scala
class Socket(
  val timeout: Int = 5_000,
  val linger: Int = 5_000
):
    override def toString = s"timeout: $timeout, linger: $linger"
```

A great thing about this feature is that it lets consumers of your code create classes in a variety of different ways, as though the class had alternate constructors:

```scala
val s1 = Socket()                 // timeout: 5000, linger: 5000
val s2 = Socket(2_500)            // timeout: 2500, linger: 5000
val s3 = Socket(10_000, 10_000)   // timeout: 10000, linger: 10000
```

When creating a new instance of a class, you can also use named parameters. This is particularly helpful when many of the parameters have the same data type:

```scala
val s = Socket(
  timeout = 10_000,
  linger = 10_000
)
```



## Objects

An object is a class that has exactly one instance. It’s created lazily when it is referenced, like a `lazy val`. If you’re familiar with Java, methods and fields in an object are accessed like `static` members in Java.

Declaring an `object` is similar to declaring a `class`. Here’s an example of a “string utilities” object that contains a set of methods for working with strings:

```scala
object StringUtils:
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean =
    if (s==null || s.trim.equals("")) true else false
```

To use an object like this, import its members and then access them by name:

```scala
import StringUtils._
truncate("Chuck Bartowski", 5)   // "Chuck"
```

Objects can also contain fields, which are also accessed like static members:

```scala
object MathConstants:
  val PI = 3.14159
  val E = 2.71828

println(MathConstants.PI)   // 3.14159
```



## Companion objects

An `object` that has the same name as a class, and is declared in the same file as the class, is called a *companion object*. Similarly, the class is called the object’s companion class. A companion class or object can access the private members of its companion.

Companion objects are used for methods and values that are not specific to instances of the companion class. For instance, in the following example the class `Circle` has a member named `area` which is specific to each instance, and its companion object has a method named `calculateArea` that’s (a) not specific to an instance, and (b) is available to every instance:

```scala
import scala.math._

case class Circle(radius: Double):
  import Circle._
  def area: Double = calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area
```

In this example the `area` method that’s available to each instance uses the `calculateArea` method that’s defined in the companion object. If you’re familiar with Java, `calculateArea` is similar to a static method. Also, because `calculateArea` is private, it can’t be accessed by other code, but as shown, it can be seen by instances of the `Circle` class.

### Other uses

Companion objects can be used for several purposes:

- As shown, they can contain “static” methods
  - These methods can be public or private
  - If `calculateArea` was public, it would be accessed as `Circle.calculateArea`
  - Other examples are shown in the [Objects section](#objects)
- They can contain `apply` methods, which — thanks to some syntactic sugar — work as factory methods to construct new instances
- They can contain `unapply` methods, which are used to deconstruct objects, such as with pattern matching

Here’s a quick look at how `apply` methods that can be used as factory methods to create new objects:

```scala
class Person:
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"

object Person:

  // a one-arg constructor
  def apply(name: String): Person =
    var p = new Person
    p.name = name
    p

  // a two-arg constructor
  def apply(name: String, age: Int): Person =
    var p = new Person
    p.name = name
    p.age = age
    p

end Person

val joe = Person("Joe")         // one-arg constructor
val fred = Person("Fred", 29)   // two-arg constructor

//val joe: Person = Joe is 0 years old
//val fred: Person = Fred is 29 years old
```

The `unapply` method isn’t covered here, but it’s covered in detail in the Reference documentation.



## Traits

If you’re familiar with Java, a Scala trait is similar to an interface in Java 8+. Traits can contain:

- Abstract methods and fields
- Concrete methods and fields

In a basic use, a trait can be used as a pure interface, defining only abstract members that will be implemented by other classes:

```scala
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String
```

Traits can also contain concrete members. For instance, this trait defines two abstract members — `numLegs` and `walk()` — and also has a concrete implementation of a `stop()` method:

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")
```

Here’s another trait with an abstract member and two concrete implementations:

```scala
trait HasTail:
  def tailColor: String
  def wagTail() = println("Tail is wagging")
  def stopTail() = println("Tail is stopped")
```

Notice how each trait only handles very specific attributes and behaviors: `HasLegs` deals only with legs, and `HasTail` deals only with tail-related functionality. Traits let you build small modules like this.

Later in your code, classes can extend those traits to build larger components:

```scala
class IrishSetter(var name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

Notice that the `IrishSetter` class implements the abstract members that are defined in `HasLegs` and `HasTail`. Now you can create new `IrishSetter` instances:

```scala
val d = IrishSetter("Big Red")   // "Big Red is a Dog"
```

This is just a taste of what you can accomplish with traits. For more details, see the remainder of these modeling lessons, as well as the Reference documentation.



## Abstract classes

{% comment %}
TODO: I have some notes on when to use abstract classes, and can update this section.
{% endcomment %}

When you want to write a class, but you know it will have abstract members, you can either create a trait or an abstract class. In most situations you’ll use traits, but but historically there have been two situations where it’s better to use an abstract class than a trait:

- You want to create a base class that takes constructor arguments
- The code will be called from Java code

### A base class that takes constructor arguments

Prior to Scala 3, when a base class needed to take constructor arguments, you’d declare it as an `abstract class`:

```scala
abstract class Pet(var name: String):
  def greeting: String
  def age: Int
  override def toString = s"I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

However, with Scala 3, traits can now have parameters, so you can now use a trait in the same situation:

```scala
trait Pet(var name: String):
  def greeting: String
  def age: Int
  override def toString = s"I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

### When a Scala abstract class is called from Java

{% comment %}
TODO: I need to add content here.
{% endcomment %}



## Enums

An enumeration is used to define a type that consists of a finite set of named values. Basic enumerations are used to define sets of constants, like the months in a year, the days in a week, directions like north/south/east/west, and more.

As an example, these enumerations define sets of attributes related to pizzas:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

To use them in other code, first import them, and then use them:

```scala
import CrustSize._
val currentCrustSize = Small
```

They can be used anywhere classes can be used, including if/then expressions, match expressions, and more:

```scala
// if/then
if (currentCrustSize == Large)
  println("You get a prize!")

// match
currentCrustSize match
  case Small => println("small")
  case Medium => println("medium")
  case Large => println("large")
```

In the modeling sections that follow, you’ll also see that they can be used as constructor parameters, and to model ADTs and GADTs.

### More enum features

Enumerations have more features. You have the basic enum just shown:

```scala
enum Color:
  case Red, Green, Blue
```

They can also be parameterized:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

And they can also have members:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more planets here ...
```

### Compatibility with Java Enums

If you want to use Scala-defined enums as Java enums, you can do so by extending the class *java.lang.Enum*, which is imported by default, as follows:

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

The type parameter comes from the Java `enum` definition, and should be the same as the type of the enum. There’s no need to provide constructor arguments (as defined in the Java API docs) to *java.lang.Enum* when extending it — the compiler generates them automatically.

After defining `Color` like that, you can use it like you would a Java enum:

````
scala> Color.Red.compareTo(Color.Green)
val res0: Int = -1
````



## Case classes

A `case class` has all of the functionality of a `class`, and more. When the compiler sees the `case` keyword in front of a `class`, it generates code for you, with the following benefits:

{% comment %}
TODO: What to say about `apply` methods in the following bullet points? They’re less significant in Scala 3.
{% endcomment %}

* Case class constructor parameters are public `val` fields by default, so accessor methods are generated for each parameter
* An `apply` method is created in the companion object of the class, so you don’t need to use the `new` keyword to create a new instance of the class
* An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions
* A `copy` method is generated in the class, which is very useful in functional programming
* `equals` and `hashCode` methods are generated, which let you compare objects, and easily use them as keys in maps
* A default `toString` method is generated, which is helpful for debugging

Case classes are primarily intended for use in a functional programming style (though they can be used in an OOP style).

Some of those features are demonstrated in the following examples:

```scala
// `name` and `relation` are public and val by default
case class Person(name: String, relation: String)

// create an instance without needing `new`
val christina = Person("Christina", "niece")

// the parameters can’t be mutated
christina.name = "Fred"   // error: reassignment to val

// `equals` and `hashCode` methods generated for you
val hannah = Person("Hannah", "niece")
christina == hannah       // false

// `toString` method
println(christina)        // Person(Christina,niece)

// built-in `copy` method
case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)
// result:
// cubs2016: BaseballTeam = BaseballTeam(Chicago Cubs,2016)
```

### Support for functional programming

As mentioned, case classes are typically used in FP, and case class features support an FP style of coding:

- Because in FP you never mutate data structures, it makes sense that constructor fields default to `val`.
- Because you never mutate data structures in FP, you can use the `copy` method as a template when you create a new instance from an existing instance. This process can be referred to as, “update as you copy.”
- Having an `unapply` method auto-generated for you also lets case classes be used in advanced ways with pattern matching. (They take a little longer to demonstrate, so they’re shown in detail in the Reference documentation.)

As they write in the book, [Programming in Scala](https://www.amazon.com/Programming-Scala-Updated-2-12/dp/0981531687/) (Odersky, Spoon, and Venners), “the biggest advantage of case classes is that they support pattern matching.”


{% comment %}
We can use this following text, if desired. It might need to be updated a little.

### An `unapply` method

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
{% endcomment %}



## Case objects

Case objects are to objects what case classes are to classes: they provide a number of automatically-generated methods to make them more powerful. They’re particularly useful whenever you need a singleton object that needs a little extra functionality, such as being used with pattern matching in `match` expressions.

Case objects are useful when you need to pass immutable messages around. For instance, if you’re working on a music player project, you’ll create a set of commands or messages like this:

```scala
sealed trait Message
case object PlaySong(name: String) extends Message
case object IncreaseVolume(amount: Int) extends Message
case object DecreaseVolume(amount: Int) extends Message
case object StopPlaying extends Message
```

Then in other parts of your code you can write methods like this, which use pattern matching to handle the incoming message:

```scala
def handleMessages(msg: Message) = message match
  case PlaySong(name)      => playSong(name)
  case IncreaseVolume(amt) => changeVolume(amt)
  case DecreaseVolume(amt) => changeVolume(-amt)
  case StopPlaying         => stopPlayingMusic
```

