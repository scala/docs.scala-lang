---
title: Tools
type: section
description: This chapter provides an introduction to the available domain modeling tools in Scala 3, including classes, traits, enums, and more.
num: 20
previous-page: domain-modeling-intro
next-page: domain-modeling-oop
---


Scala 3 provides many different constructs so we can model the world around us:

- Classes
- Objects
- Companion objects
- Traits
- Abstract classes
- Enums
- Case classes
- Case objects

This section briefly introduces each of these language features.


## Classes

As with other languages, a _class_ in Scala is a template for the creation of object instances.
Here are some examples of classes:

```scala
class Person(var name: String, var vocation: String)
class Book(var title: String, var author: String, var year: Int)
class Movie(var name: String, var director: String, var year: Int)
```

These examples show that Scala has a very lightweight way to declare classes.
The definition of the class `Person` roughly corresponds to the following, more explicit, version:

```scala
class Person:
  // fields
  var name: String = null
  var vocation: String = null

  // constructor
  def this(_name: String, _vocation: String) =
    // call to the super constructor
    this()
    // assigning the fields
    name = _name
    vocation = _vocation
```

This version defines the two fields `name` and `vocation`, together with a constructor that accepts values for those two fields and assigns them.

All of the parameters of our example classes are defined as `var` fields, which means they are mutable: you can read them, and also modify them.
If you want them to be immutable---read only---create them as `val` fields instead.

Prior to Scala 3, you used the `new` keyword to create a new instance of a class:

```scala
val p = new Person("Robert Allen Zimmerman", "Harmonica Player")
//      ---
```

However, with [creator applications][creator] this isn’t required in Scala 3:

```scala
val p = Person("Robert Allen Zimmerman", "Harmonica Player")
```

Once you have an instance of a class such as `p`, you can access its fields, which in this example are all constructor parameters:

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

Classes can have also have methods and additional fields that are not part of constructors.
They are defined in the body of the class.
The body is initialized as part of the default constructor:

```scala
class Person(var firstName: String, var lastName: String):

  println("initialization begins")
  val fullName = firstName + " " + lastName

  // a class method
  def printFullName: Unit =
    // access the `fullName` field, which is created above
    println(fullName)

  printFullName
  println("initialization ends")
```

The following REPL session shows how to create a new `Person` instance with this class:

````
scala> val john = Person("John", "Doe")
initialization begins
John Doe
initialization ends
val john: Person = Person@55d8f6bb

scala> john.printFullName
John Doe
````

Classes can also extend traits and abstract classes, which we cover in dedicated sections below.

### Default parameter values

As a quick look at a few other features, class constructor parameters can also have default values:

```scala
class Socket(val timeout: Int = 5_000, val linger: Int = 5_000):
  override def toString = s"timeout: $timeout, linger: $linger"
```

A great thing about this feature is that it lets consumers of your code create classes in a variety of different ways, as though the class had alternate constructors:

```scala
val s = Socket()                  // timeout: 5000, linger: 5000
val s = Socket(2_500)             // timeout: 2500, linger: 5000
val s = Socket(10_000, 10_000)    // timeout: 10000, linger: 10000
val s = Socket(timeout = 10_000)  // timeout: 10000, linger: 5000
val s = Socket(linger = 10_000)   // timeout: 5000, linger: 10000
```

When creating a new instance of a class, you can also use named parameters.
This is particularly helpful when many of the parameters have the same type, as shown in this comparison:

```scala
// option 1
val s = Socket(10_000, 10_000)

// option 2
val s = Socket(
  timeout = 10_000,
  linger = 10_000
)
```

### Auxiliary constructors

You can define a class to have multiple constructors so consumers of your class can build it in different ways.
For example, let’s assume that you need to write some code to model students in a college admission system.
While analyzing the requirements you’ve seen that you need to be able to construct a `Student` instance in three ways:

- With a name and government ID, for when they first start the admissions process
- With a name, government ID, and an additional application date, for when they submit their application
- With a name, government ID, and their student ID, for after they’ve been admitted

One way to handle this situation in an OOP style is with this code:

```scala
import java.time.*

// [1] the primary constructor
class Student(
  var name: String,
  var govtId: String
):
  private var _applicationDate: Option[LocalDate] = None
  private var _studentId: Int = 0

  // [2] a constructor for when the student has completed
  // their application
  def this(
    name: String,
    govtId: String,
    applicationDate: LocalDate
  ) =
    this(name, govtId)
    _applicationDate = Some(applicationDate)

  // [3] a constructor for when the student is approved
  // and now has a student id
  def this(
    name: String,
    govtId: String,
    studentId: Int
  ) =
    this(name, govtId)
    _studentId = studentId
```

{% comment %}
// for testing that code
override def toString = s"""
|Name: $name
|GovtId: $govtId
|StudentId: $_studentId
|Date Applied: $_applicationDate
""".trim.stripMargin
{% endcomment %}

The class has three constructors, given by the numbered comments in the code:

1. The primary constructor, given by the `name` and `govtId` in the class definition
2. An auxiliary constructor with the parameters `name`, `govtId`, and `applicationDate`
3. Another auxiliary constructor with the parameters `name`, `govtId`, and `studentId`

Those constructors can be called like this:

```scala
val s1 = Student("Mary", "123")
val s2 = Student("Mary", "123", LocalDate.now)
val s3 = Student("Mary", "123", 456)
```

While this technique can be used, bear in mind that constructor parameters can also have default values, which make it seem that a class has multiple constructors.
This is shown in the previous `Socket` example.



## Objects

An object is a class that has exactly one instance.
It’s initialized lazily when its members are referenced, similar to a `lazy val`.
Objects in Scala allow grouping methods and fields under one namespace, similar to how you use `static` members on a class in Java, Javascript (ES6), or `@staticmethod` in Python.

Declaring an `object` is similar to declaring a `class`.
Here’s an example of a “string utilities” object that contains a set of methods for working with strings:

```scala
object StringUtils:
  def truncate(s: String, length: Int): String = s.take(length)
  def containsWhitespace(s: String): Boolean = s.matches(".*\\s.*")
  def isNullOrEmpty(s: String): Boolean =
    if s == null || s.trim.equals("") then true else false
```

We can use the object as follows:
```scala
StringUtil.truncate("Chuck Bartowski", 5)  // "Chuck"
```

Importing in Scala is very flexible, and allows us to import _all_ members of an object:

```scala
import StringUtils.*
truncate("Chuck Bartowski", 5)       // "Chuck"
containsWhitespace("Sarah Walker")   // true
isNullOrEmpty("John Casey")          // false
```

or just _some_ members:

```scala
import StringUtils.{truncate, containsWhitespace}
truncate("Charles Carmichael", 7)       // "Charles"
containsWhitespace("Captain Awesome")   // true
isNullOrEmpty("Morgan Grimes")          // Not found: isNullOrEmpty (error)
```

Objects can also contain fields, which are also accessed like static members:

```scala
object MathConstants:
  val PI = 3.14159
  val E = 2.71828

println(MathConstants.PI)   // 3.14159
```



## Companion objects

An `object` that has the same name as a class, and is declared in the same file as the class, is called a _"companion object_."
Similarly, the corresponding class is called the object’s companion class.
A companion class or object can access the private members of its companion.

Companion objects are used for methods and values that are not specific to instances of the companion class.
For instance, in the following example the class `Circle` has a member named `area` which is specific to each instance, and its companion object has a method named `calculateArea` that’s (a) not specific to an instance, and (b) is available to every instance:

```scala
import scala.math.*

case class Circle(radius: Double):
  def area: Double = Circle.calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area
```

In this example the `area` method that’s available to each instance uses the `calculateArea` method that’s defined in the companion object.
Once again, `calculateArea` is similar to a static method in Java.
Also, because `calculateArea` is private, it can’t be accessed by other code, but as shown, it can be seen by instances of the `Circle` class.

### Other uses

Companion objects can be used for several purposes:

- As shown, they can be used to group “static” methods under a namespace
  - These methods can be public or private
  - If `calculateArea` was public, it would be accessed as `Circle.calculateArea`
- They can contain `apply` methods, which---thanks to some syntactic sugar---work as factory methods to construct new instances
- They can contain `unapply` methods, which are used to deconstruct objects, such as with pattern matching

Here’s a quick look at how `apply` methods can be used as factory methods to create new objects:

```scala
class Person:
  var name = ""
  var age = 0
  override def toString = s"$name is $age years old"

object Person:

  // a one-arg factory method
  def apply(name: String): Person =
    var p = new Person
    p.name = name
    p

  // a two-arg factory method
  def apply(name: String, age: Int): Person =
    var p = new Person
    p.name = name
    p.age = age
    p

end Person

val joe = Person("Joe")
val fred = Person("Fred", 29)

//val joe: Person = Joe is 0 years old
//val fred: Person = Fred is 29 years old
```

The `unapply` method isn’t covered here, but it’s covered in the [Reference documentation][unapply].



## Traits

If you’re familiar with Java, a Scala trait is similar to an interface in Java 8+. Traits can contain:

- Abstract methods and fields
- Concrete methods and fields

In a basic use, a trait can be used as an interface, defining only abstract members that will be implemented by other classes:

```scala
trait Employee:
  def id: Int
  def firstName: String
  def lastName: String
```
However, traits can also contain concrete members.
For instance, the following trait defines two abstract members---`numLegs` and `walk()`---and also has a concrete implementation of a `stop()` method:

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

Notice how each trait only handles very specific attributes and behaviors: `HasLegs` deals only with legs, and `HasTail` deals only with tail-related functionality.
Traits let you build small modules like this.

Later in your code, classes can mix multiple traits to build larger components:

```scala
class IrishSetter(name: String) extends HasLegs, HasTail:
  val numLegs = 4
  val tailColor = "Red"
  def walk() = println("I’m walking")
  override def toString = s"$name is a Dog"
```

Notice that the `IrishSetter` class implements the abstract members that are defined in `HasLegs` and `HasTail`.
Now you can create new `IrishSetter` instances:

```scala
val d = IrishSetter("Big Red")   // "Big Red is a Dog"
```

This is just a taste of what you can accomplish with traits.
For more details, see the remainder of these modeling lessons.



## Abstract classes

{% comment %}
TODO: I have some notes on when to use abstract classes, and can update this section.
{% endcomment %}

When you want to write a class, but you know it will have abstract members, you can either create a trait or an abstract class.
In most situations you’ll use traits, but historically there have been two situations where it’s better to use an abstract class than a trait:

- You want to create a base class that takes constructor arguments
- The code will be called from Java code

### A base class that takes constructor arguments

Prior to Scala 3, when a base class needed to take constructor arguments, you’d declare it as an `abstract class`:

```scala
abstract class Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"I say $greeting, and I’m $age"

class Dog(name: String, age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```

However, with Scala 3, traits can now have [parameters][trait-params], so you can now use traits in the same situation:

```scala
trait Pet(name: String):
  def greeting: String
  def age: Int
  override def toString = s"My name is $name, I say $greeting, and I’m $age"

class Dog(name: String, var age: Int) extends Pet(name):
  val greeting = "Woof"

val d = Dog("Fido", 1)
```
Traits are more flexible to compose---you can mix in multiple traits, but only extend one class---and should be preferred to classes and abstract classes most of the time.
The rule of thumb is to use classes whenever you want to create instances of a particular type, and traits when you want to decompose and reuse behaviour.


## Enums

An enumeration can be used to define a type that consists of a finite set of named values (in the section on [FP modeling][fp-modeling], we will see that enums are much more flexible than this).
Basic enumerations are used to define sets of constants, like the months in a year, the days in a week, directions like north/south/east/west, and more.


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
import CrustSize.*
val currentCrustSize = Small
```

Enum values can be compared using equals (`==`), and also matched on:

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

### Additional Enum Features

Enumerations can also be parameterized:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

And they can also have members (like fields and methods):

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =
    otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more planets here ...
```

### Compatibility with Java Enums

If you want to use Scala-defined enums as Java enums, you can do so by extending the class `java.lang.Enum` (which is imported by default) as follows:

```scala
enum Color extends Enum[Color] { case Red, Green, Blue }
```

The type parameter comes from the Java `enum` definition, and should be the same as the type of the enum.
There’s no need to provide constructor arguments (as defined in the Java API docs) to `java.lang.Enum` when extending it---the compiler generates them automatically.

After defining `Color` like that, you can use it like you would a Java enum:

````
scala> Color.Red.compareTo(Color.Green)
val res0: Int = -1
````

The section on [algebraic datatypes][adts] and the [reference documentation][ref-enums] cover enumerations in more detail.


## Case classes

Case classes are used to model immutable data structures.
Take the following example:
```scala
case class Person(name: String, relation: String)
```
Since we declare `Person` as a case class, the fields `name` and `relation` are public and immutable by default.
We can create instances of case classes as follows:
```scala
val christina = Person("Christina", "niece")
```
Note that the fields can’t be mutated:
```scala
christina.name = "Fred"   // error: reassignment to val
```
Since the fields of a case class are assumed to be immutable, the Scala compiler can generate many helpful methods for you:
* An `unapply` method is generated, which allows you to perform pattern matching on a case class (that is, `case Person(n, r) => ...`).
* A `copy` method is generated in the class, which is very useful to create modified copies of an instance.
* `equals` and `hashCode` methods using structural equality are generated, allowing you to use instances of case classes in `Map`s.
* A default `toString` method is generated, which is helpful for debugging.

These additional features are demonstrated in the below example:
```scala
// Case classes can be used as patterns
christina match
  case Person(n, r) => println("name is " + n)

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

As mentioned, case classes support functional programming (FP):

- In FP you try to avoid mutating data structures.
  It thus makes sense that constructor fields default to `val`.
  Since instances of case classes can’t be changed, they can easily be shared without fearing mutation or race conditions.
- Instead of mutating an instance, you can use the `copy` method as a template to create a new (potentially changed) instance.
  This process can be referred to as “update as you copy.”
- Having an `unapply` method auto-generated for you also lets case classes be used in advanced ways with pattern matching.


{% comment %}
NOTE: We can use this following text, if desired. If it’s used, it needs to be updated a little bit.

### An `unapply` method

A great thing about a case class is that it automatically generates an `unapply` method for your class, so you don’t have to write one.

To demonstrate this, imagine that you have this trait:

```scala
trait Person:
  def name: String
```

Then, create these case classes to extend that trait:

```scala
case class Student(name: String, year: Int) extends Person
case class Teacher(name: String, specialty: String) extends Person
```

Because those are defined as case classes---and they have built-in `unapply` methods---you can write a match expression like this:

```scala
def getPrintableString(p: Person): String = p match
  case Student(name, year) =>
    s"$name is a student in Year $year."
  case Teacher(name, whatTheyTeach) =>
    s"$name teaches $whatTheyTeach."
```

Notice these two patterns in the `case` statements:

```scala
case Student(name, year) =>
case Teacher(name, whatTheyTeach) =>
```

Those patterns work because `Student` and `Teacher` are defined as case classes that have `unapply` methods whose type signature conforms to a certain standard.
Technically, the specific type of pattern matching shown in these examples is known as a _constructor pattern_.

> The Scala standard is that an `unapply` method returns the case class constructor fields in a tuple that’s wrapped in an `Option`.
> The “tuple” part of the solution was shown in the previous lesson.

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

> All of this content on `unapply` methods and extractors is a little advanced for an introductory book like this, but because case classes are an important FP topic, it seems better to cover them, rather than skipping over them.

#### Add pattern matching to any type with unapply

A great Scala feature is that you can add pattern matching to any type by writing your own `unapply` method.
As an example, this class defines an `unapply` method in its companion object:

```scala
class Person(var name: String, var age: Int)
object Person:
  def unapply(p: Person): Tuple2[String, Int] = (p.name, p.age)
```

Because it defines an `unapply` method, and because that method returns a tuple, you can now use `Person` with a `match` expression:

```scala
val p = Person("Astrid", 33)

p match
  case Person(n,a) => println(s"name: $n, age: $a")
  case null => println("No match")

// that code prints: "name: Astrid, age: 33"
```
{% endcomment %}



## Case objects

Case objects are to objects what case classes are to classes: they provide a number of automatically-generated methods to make them more powerful.
They’re particularly useful whenever you need a singleton object that needs a little extra functionality, such as being used with pattern matching in `match` expressions.

Case objects are useful when you need to pass immutable messages around.
For instance, if you’re working on a music player project, you’ll create a set of commands or messages like this:

```scala
sealed trait Message
case class PlaySong(name: String) extends Message
case class IncreaseVolume(amount: Int) extends Message
case class DecreaseVolume(amount: Int) extends Message
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
[ref-enums]: {{ site.scala3ref }}/enums/enums.html
[adts]: {% link _overviews/scala3-book/types-adts-gadts.md %}
[fp-modeling]: {% link _overviews/scala3-book/domain-modeling-fp.md %}
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[unapply]: {{ site.scala3ref }}/changed-features/pattern-matching.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
