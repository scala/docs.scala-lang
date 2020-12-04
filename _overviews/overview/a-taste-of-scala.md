---
title: A Taste of Scala
description: This page provides a high-level overview of the main features of the Scala 3 programming language.
num: 4
previous-page: why-scala-3
next-page: first-look-at-types
---

<!--
  - add ScalaFiddle at the appropriate places
  - NOTE: i didn’t include “Changes/Differences Between Scala 2 and Scala 3” because that would be a pretty large section
  - NOTE: i don’t have a section on “New Control Syntax”, I just use that syntax
  - TODO: cover functional error handling (Option/Try/Either)
  - TODO: discuss “Optional braces / significant indentation” here?
  - TODO: add a section at the end to list the things that haven’t been shown?
-->


This “Taste of Scala” section provides a whirlwind tour of the main features of the Scala 3 programming language. After the initial tour in this section, the rest of the Overview provides a few more details on these features, and the Reference documentation provides _many_ more details.

>Throughout this Overview you’ll be able to test many of the examples directly on this page. In addition to that, you can also test anything you’d like on [ScalaFiddle.io](https://scalafiddle.io), [Scastie](https://scastie.scala-lang.org), or in the Scala REPL, which is demonstrated shortly.



## Hello, world

A Scala “Hello, world” example goes as follows. First, put this code in a file named _Hello.scala_:

```scala
@main def hello = println("Hello, world")
```

In this code, `hello` is a method — defined with `def`, and declared to be a “main” method with the `@main` annotation — that invokes the `println` method to write the `"Hello, world"` string to standard output (STDOUT).

Next, compile the code with `scalac`:

```sh
$ scalac Hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, so that command creates several files:

```sh
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

Like Java, the _.class_ files are bytecode files, and they’re ready to run in the JVM. Now you can run the main `hello` method with the `scala` command:

```sh
$ scala hello
Hello, world
```

Assuming that worked, congratulations, you just compiled and ran your first Scala application.



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. You start a REPL session by running the `scala` command at your operating system command line, where you’ll see a “welcome” prompt like this:

<!-- TODO: update this when it’s ready -->
```scala
$ scala
Welcome to Scala 3.0.0 (OpenJDK 64-Bit Server VM, Java 11.0.7).
Type in expressions for evaluation. Or try :help.

scala> _
```

The REPL is a command-line interpreter, so it sits there waiting for you to type something. Now you can type Scala expressions to see how they work:

````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````

As shown in the output, if you don’t assign a variable to the result of an expression, the REPL creates variables named `res0`, `res1`, etc., for you. You can use these variable names in subsequent expressions:

````
scala> val x = res0 * 10
val x: Int = 20
````

Notice that the REPL output also shows the result of your expressions.

<!-- TODO: is it correct/okay to refer to this as a function? -->
You can run all sorts of experiments in the REPL. This example shows how to create and then call a `sum` function:

````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````

As mentioned earlier, if you prefer a browser-based playground environment, you can also use [ScalaFiddle.io](https://scalafiddle.io) or [Scastie.scala-lang.org](https://scastie.scala-lang.org).



## Two types of variables

When you create a new variable in Scala, you declare whether the variable is immutable or mutable:

- `val` creates an _immutable_ variable — like `final` in Java. You should always create a variable with `val`, unless there’s a reason you need a mutable variable.
- `var` creates a _mutable_ variable, and should only be used when a variable’s contents will change over time.

These examples show how to create `val` and `var` variables:

```scala
// immutable
val a = 0
val b = "Hello"

// mutable
var c = 1
var d = "world"
```

In an application, a `val` can’t be reassigned. You’ll generate a compiler error if you try to reassign one:

```scala
val msg = "Hello, world"
msg = "Hello"   // "reassignment to val" error; this won’t compile
```

Conversely, a `var` can be reassigned:

```scala
var msg = "Hello, world"
msg = "Hello"   // this compiles because a var can be reassigned
```



## Declaring variable types

When you create a variable you can (a) explicitly declare its type, or (b) let the compiler infer the type:

```scala
val x: Int = 1   // explicit
val x = 1        // implicit; the compiler infers the type
```

The second form is known as _type inference_, and it’s a great way to help keep this type of code concise. The Scala compiler can usually infer the data type for you, as shown in the output of these examples:

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1,2,3)
val nums: List[Int] = List(1, 2, 3)
```

You can always explicitly declare a variable’s type if you prefer, but in simple assignments like these it isn’t necessary:

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = Person("Richard")
```

Notice that with this approach, the code feels more verbose than necessary.


<!-- TODO: Jonathan had a comment on the text below: “While it might feel like this, I would be afraid that people automatically assume from this statement that everything is always boxed.” Suggestion on how to change this? -->
## Built-in data types

Scala comes with the standard numeric data types you’d expect, and they’re all full-blown instances of classes. In Scala, everything is an object.

These examples show how to declare variables of the numeric types:

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

```scala
val i = 123   // defaults to Int
val j = 1.0   // defaults to Double
```

In your code you can also append the characters `L`, `D`, and `F` (and their lowercase equivalents) to numbers to specify that they are `Long`, `Double`, or `Float` values:

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```

When you need really large numbers, use the `BigInt` and `BigDecimal` types:

```scala
var a = BigInt(1_234_567_890_987_654_321L)
var b = BigDecimal(123_456.789)
```

Where `Double` and `Float` are approximate decimal numbers, `BigDecimal` is used for precise arithmetic.

Scala also has `String` and `Char` data types:

```scala
val name = "Bill"   // String
val c = 'a'         // Char
```



## Two notes about strings

Scala strings are similar to Java strings, but they have two great additional features:

- They support string interpolation
- It’s easy to create multiline strings


### String interpolation

String interpolation provides a very readable way to use variables inside strings. For instance, given these three variables:

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

You can combine those variables in a string like this:

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```

Just precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string.

To enclose expressions inside a string, put them in curly braces:

<!-- TODO: Is this "~~~" syntax preferred? -->
~~~ scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
~~~

#### Other interpolators

The `s` that you place before the string is just one possible interpolator. If you use an `f` instead of an `s`, you can use `printf`-style formatting syntax in the string. Furthermore, because `s` and `f` are really just methods, you can write your own interpolators, such as creating a `sql` interpolator for use in a database library. For more details, see the Strings section in this Overview and in the Reference documentation (TODO:correct sections and their urls).


### Multiline strings

Multiline strings are created by including the string inside three double-quotes:

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```

The [“First Look at Types” section](TODO:url) provides more details on how to format multiline strings.



## Control structures

Scala has the programming language control structures you find in other languages, and also has powerful `for` expressions and `match` expressions:

- `if`/`else`
- `for` loops and expressions
- `match` expressions
- `while` loops
- `try`/`catch`

These structures are demonstrated in the following examples.


### `if`/`else`

Scala’s `if`/`else` control structure is similar to other languages:

```scala
if x < 0 then
  println("negative")
else if x == 0
  println("zero")
else
  println("positive")
```

Note that this really is an _expression_ — not a _statement_. This means that it returns a value, so you can assign the result to a variable:

```scala
val x = if a < b then a else b
```

As you’ll see throughout this Overview and in our Reference documentation, _all_ Scala control structures can be used as expressions.

>An expression returns a result, while a statement does not. Statements are typically used for their side-effects, such as using `println` to print to the console.


### `for` loops and expressions

The `for` keyword is used to create a `for` loop. This example shows how to print every element in a `List`:

```scala
val ints = List(1,2,3,4,5)

for i <- ints do println(i)
```

The code `i <- ints` is referred to as a _generator_, and if you leave the parentheses off of the generator, the `do` keyword is required before the code that follows it. Otherwise you can write the code like this:

```scala
for (i <- ints) println(i)
```


#### Guards

You can also use one or more `if` expressions inside a `for` loop. These are referred to as _guards_. This example prints all of the numbers in `ints` that are greater than `2`:

```scala
for
  i <- ints
  if i > 2
do
  println(i)
```

You can use multiple generators and guards. This loop iterates over the numbers `1` to `3`, and for each number it also iterates over the characters `a` to `c`. However, it also has two guards, so the only time the print statement is called is when `i` has the value `2` and `j` is the character `b`:

<!-- scalafiddle -->
```tut
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")   // prints: "i = 2, j = b"
```


#### Using `for` as an expression

The `for` keyword has even more power: When you use the `yield` keyword instead of `do`, you create `for` _expressions_ which are used to calculate and yield results.

A few examples demonstrate this. Using the same `ints` list as the previous example, this code creates a new list, where the value of each element in the new list is twice the value of the elements in the original list:

````
scala> val doubles = for i <- nums yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

Scala’s control structure syntax is flexible, and that `for` expression can be written in several other ways, depending on your preference:

```scala
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
```

This example shows how to capitalize the first character in each string in the list:

```scala
val names = List("chris", "ed", "maurice")
val capNames = for name <- names yield name.capitalize
```

Finally, this `for` expression iterates over a list of strings, and returns the length of each string, but only if that length is greater than `4`:

<!-- scalafiddle -->
```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for
  f <- fruits
  if f.length > 4
yield
  // you can use multiple lines
  // of code here
  f.length

// result: List[Int] = List(5, 6, 6)
```

`for` loops and expressions are covered in more detail in the Control Structures sections of this Overview and in the Reference documentation.


### match expressions

Scala has a `match` expression, which in its most basic use is like a Java `switch` statement:

```scala
val i = 1

// later in the code ...
i match
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
```

However, `match` really is an expression, meaning that it returns a result based on the pattern match, which you can bind to a variable:

```scala
val result = i match
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

`match` isn’t limited to just integers, it can be used with any data type, including booleans:

```scala
val booleanAsString = bool match
  case true => "true"
  case false => "false"
```

In fact, a `match` expression can be used to test a variable against many different types of patterns. This example shows (a) how to use a `match` expression as the body of a method, and (b) how to match all the different types shown:

<!-- scalafiddle -->
```scala
def getClassAsString(x: Any): String = x match
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[_] => "List"
  case _ => "Unknown"

// examples
getClassAsString(1)             // Int
getClassAsString("hello")       // 'hello' is a String
getClassAsString(List(1,2,3))   // List
```

There’s _much_ more to pattern matching in Scala. Patterns can be nested, results of patterns can be bound, and pattern matching can even be user-defined. See the pattern matching examples in the Control Structures sections of this Overview and the Reference documentation for more details.


### `try`/`catch`/`finally`

Scala’s `try`/`catch`/`finally` control structure lets you catch exceptions. It’s similar to Java, but its syntax is consistent with `match` expressions:

```scala
try
  writeTextToFile(text)
catch
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
finally
  println("Clean up your resources here.")
```


### `while` loops

Scala also has a `while` loop construct. It’s one-line syntax looks like this:

```scala
while x >= 0 do x = f(x)
```

If you leave the parentheses off of the test condition, the `do` keyword is required before the code that follows it. Again, Scala’s control structure syntax is flexible, and you can write this code in different ways depending on your preferences:

```scala
while (x >= 0) do x = f(x)
while (x >= 0) { x = f(x) }
```

The `while` loop multiline syntax looks like this:

```scala
var x = 1

// without parentheses
while
  x < 3
do
  println(x)
  x += 1

// with parentheses
while (x < 3)
  println(x)
  x += 1
```


### Create your own control structures

Thanks to features like by-name parameters, infix notation, fluent interfaces, optional parentheses, extension methods, and higher-order functions, you can also create your own code that works just like a control structure. You’ll learn more about this in the Control Structures chapter in the Reference documentation.



## Data Modeling
<!-- TODO: show the FP section first? -->

Scala supports both functional programming (FP) and object-oriented programming (OOP), as well as a fusion of the two paradigms. This section provides a quick overview of data modeling in OOP and FP.


### Data Modeling (Object-Oriented Programming Style)

When writing code in an OOP style, your two main tools for data encapsulation are _traits_ and _classes_.


<!-- TODO: Julien had a comment, “in OOP we don’t really model data. It’s more about modeling operations, imho.” How to resolve? -->
#### Traits

Scala traits can be used as simple interfaces, but they can also contain abstract and concrete methods and fields, and they can have parameters, just like classes. They provide a great way for you to organize behaviors into small, modular units. Later, when you want to create concrete implementations of attributes and behaviors, classes and objects can extend traits, mixing in as many traits as needed to achieve the desired behavior.

<!-- TODO: this example shows behaviors, not data -->
As an example of how to use traits as interfaces, here are three traits that define well-organized and modular behaviors for animals like dogs and cats:

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

Given those traits, here’s a `Dog` class that extends all of those traits while providing a behavior for the abstract `speak` method:

```scala
class Dog(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Woof!"
```

Notice how the class extends the traits with the `extends` and `with` keywords.

Similarly, here’s a `Cat` class that implements those same traits while also overriding two of the concrete methods it inherits:

```scala
class Cat(name: String) extends Speaker, TailWagger, Runner:
  def speak(): String = "Meow"
  override def startRunning(): Unit = println("Yeah ... I don’t run")
  override def stopRunning(): Unit = println("No need to stop")
```

These examples show how those classes are used:

```scala
val d = Dog("Rover")
d.speak()               // prints "Woof!"

val c = Cat("Morris")
c.speak()               // "Meow"
c.startRunning()        // "Yeah ... I don’t run"
c.stopRunning()         // "No need to stop"
```

If that code makes sense — great, you’re comfortable with traits as interfaces. If not, don’t worry, they’re explained in more detail in the Data Modeling sections of this Overview and the Reference documentation.


#### Classes

Scala _classes_ are used in OOP-style programming. Here’s an example of a class that models a “person.” In OOP fields are typically mutable, so `firstName` and `lastName` are both declared as `var` parameters:

```scala
class Person(var firstName: String, var lastName: String):
  def printFullName() = println(s"$firstName $lastName")

val p = Person("John", "Stephens")
println(p.firstName)   // "John"
p.lastName = "Legend"
p.printFullName()      // "John Legend"
```

Notice that the class declaration creates a constructor:

```scala
class Person(var firstName: String, var lastName: String):
  // more code here

// this code uses that constructor
val p = Person("John", "Stephens")
```

Constructors and other class-related topics are covered in the Data Modeling sections in this Overview, and in the Reference documentation.


### Data Modeling (Functional Programming Style)

<!-- TODO: Julien had a note about expecting to see sealed traits here.
I didn’t include that because I didn’t know if enums are intended
to replace the Scala2 “sealed trait + case class” pattern. How to resolve?
-->

When writing code in an FP style, you’ll use these constructs:

- Enums to define ADTs
- Case classes
- Traits


#### Enums

The `enum` construct is a great way to model algebraic data types (ADTs) in Scala 3. For instance, a pizza has three main attributes:

- Crust size
- Crust type
- Toppings

These are concisely modeled with enums:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

Once you have an enum you can use it in all of the ways you normally use a trait, class, or object:

```scala
import CrustSize._
val currentCrustSize = Small

// enums in a `match` expression
currentCrustSize match
  case Small => println("Small crust size")
  case Medium => println("Medium crust size")
  case Large => println("Large crust size")

// enums in an `if` statement
if currentCrustSize == Small then println("Small crust size")
```

Here’s another example of how to create and use an ADT with Scala:

```scala
enum Nat:
  case Zero
  case Succ(pred: Nat)
```

Enums are covered in detail in the Data Modeling section of this Overview, and in the Reference documentation.


#### Case classes

The Scala `case` class lets you model concepts with immutable data structures. A `case` class has all of the functionality of a `class`, and also has additional features baked in that make them useful for functional programming. When the compiler sees the `case` keyword in front of a `class` it has these effects and benefits:

- Case class constructor parameters are public `val` fields by default, so the fields are immutable, and accessor methods are generated for each parameter.
- An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions.
- A `copy` method is generated in the class. This provides a way to clone an object while making updates to its values as the cloned copy is created. In this way the original object can be used as a template, and the cloned copy can have changed fields, as needed.
- `equals` and `hashCode` methods are generated.
- A default `toString` method is generated, which is helpful for debugging.

<!-- TODO: Julien had a comment about how he decides when to use case classes. Add something here? -->

You _can_ manually add all of those methods to a class yourself, but since those features are so commonly used in functional programming, using a `case` class is much more convenient.

This code demonstrates several `case` class features:

```scala
// define a case class
case class Person(
  name: String,
  vocation: String
)

// create an instance of the case class
val p = Person("Reginald Kenneth Dwight", "Singer")

// a good default toString method
p                // Person = Person(Reginald Kenneth Dwight,Singer)

// can access its fields, which are immutable
p.name           // "Reginald Kenneth Dwight"
p.name = "Joe"   // error: can’t reassign a val field

// when you need to make a change, use the `copy` method
// to “update as you copy”
val p2 = p.copy(name = "Elton John")
p2               // Person = Person(Elton John,Singer)
```

See the Data Modeling sections of this Overview and the Reference documentation for many more details on `case` classes.



## Scala methods

Scala classes, case classes, traits, enums, and objects can all contain methods. The general method syntax looks like this:

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
```

Here are a few examples of that syntax:

```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```

You don’t have to declare a method’s return type, so you can write those methods like this, if you prefer:

```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```

This is how you call those methods:

```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```

Here’s an example of a multiline method:

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = new StringWriter
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
```

Method parameters can also have default values. In this example, if the `timeout` parameter isn’t specified, it defaults to `5000`:

```scala
def makeConnection(url: String, timeout: Int = 5000): Unit =
  println(s"url=$url, timeout=$timeout")
```

Because a default `timeout` value is supplied in the method declaration, the method can be called in these two ways:

```scala
makeConnection("https://localhost")         // url=http://localhost, timeout=5000
makeConnection("https://localhost", 2500)   // url=http://localhost, timeout=2500
```

Scala also supports the use of _named parameters_ when calling a method, so you can also call that method like this, if you prefer:

```scala
makeConnection(
  url = "https://localhost",
  timeout = 2500
)
```

Named parameters are particularly useful when multiple method parameters have the same type:

```scala
engage(true, true, true, false)
```

Without help from an IDE that code can be hard to read, but this code is much more obvious:

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```

Methods are covered in detail in the Data Modeling section of this Overview, and in the Reference documentation.



## Objects

In Scala, the `object` keyword creates a Singleton object. Put another way, an object is a class that has exactly one instance.

Objects have several uses:

- They are used to create collections of utility methods.
- A _companion object_ is an object that has the same name as the class it shares a file with. In this situation, that class is also called a _companion class_.
- They’re used to _reify_ traits to create _modules_.

### Creating a collection of utility methods

Because an `object` is a Singleton, its methods can be accessed like `static` methods in a Java class. For example, this `StringUtils` object contains a small collection of string-related methods:

```scala
object StringUtils:
  def isNullOrEmpty(s: String): Boolean = 
    if (s==null || s.trim.equals("")) true else false
  def leftTrim(s: String): String = s.replaceAll("^\\s+", "")
  def rightTrim(s: String): String = s.replaceAll("\\s+$", "")
```

Because `StringUtils` is a singleton, its methods can be called directly on the object:

```scala
val x = StringUtils.isNullOrEmpty("")    // true
val x = StringUtils.isNullOrEmpty("a")   // false
```

### Creating a companion object

A companion class or object can access the private members of its companion. Use a companion object for methods and values which aren’t specific to instances of the companion class.

This example demonstrates how the `area` method in the companion class can access the private `calculateArea` method in its companion object:

```scala
import scala.math._

class Circle(radius: Double):
  import Circle._
  def area: Double = calculateArea(radius)

object Circle:
  private def calculateArea(radius: Double): Double = 
    Pi * pow(radius, 2.0)

val circle1 = Circle(5.0)
circle1.area   // Double = 78.53981633974483
```


### Using objects to reify traits

Objects can also be used to reify traits to create modules. “Reify” means to turn an abstract concept and turn it into something concrete, and the process with traits and objects looks like this:

```scala
trait AddService:
    def add(a: Int, b: Int) = a + b

trait MultiplyService:
    def multiply(a: Int, b: Int) = a * b

// reify those traits into a concrete object
object MathService extends AddService, MultiplyService

// use the object
import MathService._
println(add(1,1))        // 2
println(multiply(2,2))   // 4
```



## First-class functions

Scala has all of the features you’d expect in a functional programming language, including:

- Lambdas
- Higher-order functions (HOFs)
- Higher-order functions in the standard library


### Lambdas

<!-- TODO: Jonathan had a note here about higher-order function definitions. How to resolve? -->

Lambdas, also known as _anonymous functions_, are a big part of keeping your code concise but readable. These two examples — which show how to call higher-order functions (HOFs) on a Scala `List` — are equivalent, and show how to multiply each number in a list by `2` by passing a lambda into the `map` method:

```scala
val a = List(1,2,3).map(i => i * 2)   // List(2,4,6)
val b = List(1,2,3).map(_ * 2)        // List(2,4,6)
```

Those examples are also equivalent to the following code, which uses a `double` method inside of `map` instead of a lambda:

```scala
def double(i: Int): Int = i * 2

val a = List(1,2,3).map(i => double(i))   // List(2,4,6)
val b = List(1,2,3).map(double)           // List(2,4,6)
```

>If you haven’t seen the `map` method before, it applies a given function to every element in a list, yielding a new list that contains the resulting values.

Passing lambdas into higher-order functions on collections classes is a part of the Scala experience, something you’ll do every day.

It’s important to know that these functions don’t mutate the collection they’re called on; instead, they return a new collection with the updated data. As a result, it’s also common to chain them together in a “fluent” style to solve problems. This example shows how to filter a collection twice, and then multiply each element in the remaining collection:

```scala
// a sample list
val nums = (1 to 10).toList   // List(1,2,3,4,5,6,7,8,9,10)

// methods can be chained together as needed
val x = nums.filter(_ > 3)
            .filter(_ < 7)
            .map(_ * 10)

// result: x == List(40, 50, 60)
```

In addition to higher-order functions being used throughout the standard library, you can also create your own. This is shown in the Reference documentation.



## Extension methods

_Extension methods_ let you add new methods to closed classes. For instance, if you want to add two methods named `hello` and `aloha` to the `String` class, declare them as extension methods:

<!-- scalafiddle -->
```scala
extension (s: String):
  def hello: String = s"Hello, ${s.capitalize}"
  def aloha: String = s"Aloha, ${s.capitalize}"

"world".hello    // "Hello, World"
"friend".aloha   // "Aloha, Friend"
```

The `extension` keyword declares that you’re about to define one or more extension methods on the type that’s put in parentheses. As shown with this `String` example, the parameter `s` can then be used in the body of your extension methods.

This next example shows how to add a `makeInt` method to the `String` class. Here, `makeInt` takes a parameter named `radix`. The code doesn’t account for possible string-to-integer conversion errors, but skipping that detail, the examples show how it works:

<!-- scalafiddle -->
```scala
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)

"1".makeInt(2)      // Int = 1
"10".makeInt(2)     // Int = 2
"100".makeInt(2)    // Int = 4
```



## Collections classes

Scala has a rich set of collections classes, and those classes have a rich set of methods. Collections classes are available in both immutable and mutable forms.

To give you a taste of how these work, here are some examples that use the `List` class, which is an immutable, linked-list class. These examples show different ways to create a populated `List`:

```scala
val a = List(1,2,3)             // a: List[Int] = List(1, 2, 3)

// Range methods
val b = (1 to 5).toList         // b: List[Int] = List(1, 2, 3, 4, 5)
val c = (1 to 10 by 2).toList   // c: List[Int] = List(1, 3, 5, 7, 9)
val e = (1 until 5).toList      // e: List[Int] = List(1, 2, 3, 4)
val f = List.range(1, 5)        // f: List[Int] = List(1, 2, 3, 4)
val g = List.range(1, 10, 3)    // g: List[Int] = List(1, 4, 7)
```

<!-- TODO: Should we show this style: `val a = 1 :: 2 :: Nil`? -->

Once you have a populated list, the following examples show some of the methods you can call on it. Notice that these are all functional methods, meaning that they don’t mutate the collection they’re called on, but instead return a new collection with the updated elements. The result that’s returned by each expression is shown in the comment on each line:

```scala
// a sample list
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.drop(2)                             // List(30, 40, 10)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeWhile(_ < 30)                   // List(10, 20)

// flatten
val a = List(List(1,2), List(3,4))
a.flatten                             // List(1, 2, 3, 4)

// map, flatMap
val nums = List("one", "two")
nums.map(_.toUpperCase)               // List("ONE", "TWO")
nums.flatMap(_.toUpperCase)           // List('O', 'N', 'E', 'T', 'W', 'O')
```

These examples show how the “fold” and “reduce” methods are used to sum the values in a sequence of integers:

```scala
val firstTen = (1 to 10).toList            // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

firstTen.reduce(_ + _)                     // 55
firstTen.reduceLeft(_ + _)                 // 55
firstTen.fold(100)(_ + _)                  // 155 (100 is a “seed” value)
firstTen.foldLeft(100)(_ + _)              // 155
```

There are many more methods available to Scala collections classes, and they’re demonstrated in the Collections sections of this Overview and in the Reference documentation.



### Tuples

The Scala _tuple_ is a type that lets you easily put a collection of different types in the same container. For example, given this `Person` case class:

```scala
case class Person(name: String)
```

This is how you create a tuple that contains an `Int`, a `String`, and a custom `Person` value:

```scala
val t = (11, "eleven", Person("Eleven"))
```

Once you have a tuple, you can access its values by binding them to variables, or access them by number:

```scala
t._1   // 11
t._2   // "eleven"
t._3   // Person("Eleven")
```

Tuples are nice for those times when you want to put a collection of heterogeneous types in a little collection-like structure. See the Reference documentation for more tuple details.



## Contextual Abstractions

Under certain circumstances, the Scala compiler can “write” some parts of your programs. For instance, consider a program that sorts a list of addresses by two criteria, city name and then street name:

```scala
val addresses: List[Address] = ...
addresses.sortBy(address => (address.city, address.street))
```

The sorting algorithm needs to compare addresses by first comparing their city names, and then also their street names when the city names are the same. However, with the use of contextual abstraction, you don’t need to manually define this ordering relation, because the compiler is able to summon it automatically based on an existing ordering relation for comparing string values.

For more details, see the Contextual Abstractions section in this Overview, and also in the Reference documentation.



## Even more

Scala has even more features that weren’t covered in this whirlwind tour. See the remainder of this Overview and the Reference documentation for many more details.

