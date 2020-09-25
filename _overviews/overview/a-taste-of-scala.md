---
title: A Taste of Scala
description: This page provides a high-level overview of the main features of Scala 3.
---

<!-- TODO
  - add ScalaFiddle at the appropriate places
  - test with jekyll on my system
-->

<!--
√ A “Hello, world,” example, demonstrating scalac, scala, @main methods
√ Show the REPL; mention ScalaFiddle and Worksheets
√ Two types of variables: val and var
√ Control structures examples (if/then, for, match, etc.)
√ Data modeling
  √ Classes and methods
  √ Traits
  √ Case classes
  - enums & ADTs
√ Mention that there is no need for new (not mentioning explicitly, just showing)
- Collections classes and methods
- New control syntax
- Optional braces, indentation
- Top-level defs and vals
- Note to Al: mention “code blocks” (thinking of things like parameter untupling and more generally, anonymous functions)
√ @main methods
- First-class functions (section from Jonathan)
  - Lambdas
  - Higher-order functions (HOFs)
  - HOFs in the standard library
- Mention Scalafix?
-->


Our hope in this Overview documentation is to demonstrate that Scala is a beautiful, expressive programming language, with a clean, modern syntax. To help with that demonstration, this “Taste of Scala” section provides a whirlwind tour of Scala’s main features. After the initial tour in this section, the rest of the Overview will provide a few more details on the these features, and the Reference documentation will provide *many* more details.

>In this Overview it’s assumed that you’ve used a language like Java before, and you’re ready to see a series of Scala examples to get a feel for what the language looks like. You’ll also be able to test many of the examples directly on this page, and in addition to that, you can also test anything you’d like on [ScalaFiddle.io](https://scalafiddle.io), [Scastie](https://scastie.scala-lang.org), in Worksheets with the VS Code or Intellij IDEA editors, or in the Scala REPL, which will be demonstrated shortly.



## Hello, world

<!-- NOTE: i assume here that dotc/dotr will be renamed to scala/scala -->

Ever since the book, *C Programming Language*, it’s been a tradition to begin programming books with a “Hello, world” example, and not to disappoint, this is one way to write that example in Scala:

```scala
@main def hello = println("Hello, world")
```

To see how this works, put that line of code in a file named *Hello.scala*, and then compile it with `scalac`:

```sh
$ scalac Hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, so that command creates several files:

<!-- TODO: will the tasty files go away? -->
```sh
$ ls -1
Hello$package$.class
Hello$package.class
Hello$package.tasty
Hello.scala
hello.class
hello.tasty
```

<!-- TODO: wording -->
Just like Java, the *.class* files are bytecode files, and they’re ready to run in the JVM. Now you can run the main `hello` method with the `scala` command:

```sh
$ scala hello
Hello, world
```

Assuming that worked, congratulations, you just compiled and ran your first Scala application.
<!-- TODO: more explanation on how that works? -->



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. We introduce it early here so you can use it with the code examples that follow.

Assuming that you’ve downloaded and installed Scala — such as from the [Scala download page](https://www.scala-lang.org/download) — you start a REPL session by running the `scala` command at your operating system command line. When you do this you’ll see a “welcome” prompt that looks like this:

<!-- TODO: update this when it’s ready -->
```scala
$ scala
Welcome to Scala 3.0.0 (OpenJDK 64-Bit Server VM, Java 11.0.7).
Type in expressions for evaluation. Or try :help.

scala> _
```

Because the REPL is a command-line interpreter, it sits there waiting for you to type something. Inside the REPL you can type Scala expressions to see how they work:

```scala
scala> val x = 1
x: Int = 1

scala> val y = x + 1
y: Int = 2
```

As those examples show, after you type your expressions in the REPL, it shows the result of each expression on the line following the prompt.

As mentioned earlier, if you prefer a browser-based testing environment you can also use [ScalaFiddle.io](https://scalafiddle.io) or [Scastie.scala-lang.org](https://scastie.scala-lang.org).



## Two types of variables

When you create a new variable in Scala, you declare whether the variable is immutable or mutable:

- `val` is an *immutable* variable — like `final` in Java. We recommend always creating a variable with `val`, unless there’s a specific reason you need a mutable variable.
- `var` creates a *mutable* variable, and should only be used when you have a variable whose contents will be modified over time.

These examples show how to create `val` and `var` variables:

```scala
val x = 1   // immutable
var y = 0   // mutable
```

In an application, once you create a `val` field, it can’t be reassigned. The second line of code here creates an error message:

```scala
val msg = "Hello, world"
msg = "Hello"   // "reassignment to val" error; this won’t compile
```

Conversely, a `var` field can be reassigned:

```scala
var msg = "Hello, world"
msg = "Hello"   // this compiles because a var can be reassigned
```

>Inside the REPL playground area you can reassign a `val` field, but this is just for convenience. In the real world a `val` field can’t be reassigned.



## Declaring variable types

In Scala you can declare variables without explicitly declaring their type:

```scala
val x = 1
val s = "a string"
val p = Person("Richard")
```

When you do this, the Scala compiler can usually infer the data type for you, as shown in the output of these REPL examples:

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1,2,3)
val nums: List[Int] = List(1, 2, 3)
```

This feature is known as *type inference*, and it’s a great way to help keep this type of code concise. You can also *explicitly* declare a variable’s type:

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = new Person("Richard")
```

However, as you can see, in simple situations this isn’t needed, and tends to feel more verbose than necessary.



## Built-in data types

Scala comes with the standard numeric data types you’d expect, and all of these data types are full-blown instances of classes. In Scala, everything is an object.

These examples show how to declare variables of the basic numeric types:

```scala
val b: Byte = 1
val x: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```

In the first four examples, if you don’t explicitly specify a type, the number `1` will default to an `Int`, so if you want one of the other data types — `Byte`, `Long`, or `Short` — you need to explicitly declare those types, as shown. Numbers with a decimal (like 2.0) will default to a `Double`, so if you want a `Float` you need to declare a `Float`, as shown in the last example.

Because `Int` and `Double` are the default numeric types, you typically create them without explicitly declaring the data type:

```scala
val i = 123   // defaults to Int
val x = 1.0   // defaults to Double
```
<!-- TODO: show 1L, 1D, 1F here? -->


### BigInt and BigDecimal

When you need really large numbers, Scala also includes the types `BigInt` and `BigDecimal`:

```scala
var b = BigInt(1234567890)
var b = BigDecimal(123456.789)
```

A great thing about `BigInt` and `BigDecimal` is that they support all the operators you’re used to using with numeric types:

```scala
scala> var b = BigInt(1234567890)
b: scala.math.BigInt = 1234567890

scala> b + b
res0: scala.math.BigInt = 2469135780

scala> b * b
res1: scala.math.BigInt = 1524157875019052100

scala> b += 1

scala> println(b)
1234567891
```

While you can think of `+`, `*`, and `+=` as being “operators,” because everything in Scala is an object, they’re really methods on their classes.


### String and Char

Scala also has `String` and `Char` data types, which you can generally declare with the implicit form:

```scala
val name = "Bill"
val c = 'a'
```

However, you can use the explicit form, if you prefer:

```scala
val name: String = "Bill"
val c: Char = 'a'
```

As shown, strings are enclosed in double-quotes — or triple-quotes, as you’re about to see — and a character is enclosed in single-quotes.



## Two notes about strings

Scala strings are similar to Java strings, but they have at least two great additional features:

- They support string interpolation
- You can create multiline strings


### String interpolation

In its most basic form, string interpolation provides a great way to use variables inside strings. For instance, given these three variables:

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```

string interpolation lets you combine those variables in a string like this:

```scala
val name = s"$firstName $mi $lastName"
```

This lets you embed variables inside strings in a very readable way:

```scala
println(s"Name: $firstName $mi $lastName")
```

As shown, all you have to do is to precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string.

It’s important to know that string interpolation goes well beyond this basic use. For instance, you can also access class fields and use equations inside the interpolated string by enclosing those references inside curly braces. This example shows how to reference a class field (or method) inside an interpolated string:

```scala
class Person(var name: String)
val p = Person("Margaret Hamilton")
println(s"Name: ${p.name}")
```

This example shows how to use an equation:

```scala
println(s"2 + 2 = ${2 + 2}")   // prints '4'
```

#### Other interpolators

“Why use the `s` in front of the string,” you may ask. The answer is that the `s` that precedes the strings in these examples is just one possible interpolator. You can also use the letter `f` in front of a string to use `printf`-style string formatting:

```scala
val name = "Fred"
val age = 33
val weight = 200.5
println(f"$name is $age years old, and weighs $weight%.1f pounds.")
```

<!--
TODO: use a better example than that
val msg = f"$time | $logLevel%-5s | $classname | $msg\n"
-->

Very importantly, because `s` and `f` are really just methods, other developers can write their own interpolators. For instance, Scala database libraries can create an `sql` interpolator that can have special features to support SQL:

```scala
val query = sql"select * from $table"
```

<!-- TODO: link -->
>For more details about interpolators, see the Scala Reference documentation.

<!--
See the [string interpolation documentation]({{site.baseurl}}/overviews/core/string-interpolation.html) for more details.
-->


### Multiline strings

A second great feature of Scala strings is that you can create multiline strings by including the string inside three double-quotes:

```scala
val speech = """Four score and
               seven years ago
               our fathers ..."""
```
<!-- TODO: maybe use a different quote -->

That’s very helpful for when you need to work with multiline strings. One drawback of this basic approach is that the lines after the first line are indented, as you can see in the REPL:

```scala
scala> val speech = """Four score and
     |                seven years ago
     |                our fathers ..."""
speech: String =
Four score and
                   seven years ago
                   our fathers ...
```

A simple way to correct this problem is to put a `|` symbol in front of all lines after the first line, and call the `stripMargin` method after the string:

```scala
val speech = """Four score and
               |seven years ago
               |our fathers ...""".stripMargin
```

The REPL shows that when you do this, all of the lines are left-justified:

```scala
scala> val speech = """Four score and
     |                |seven years ago
     |                |our fathers ...""".stripMargin
speech: String =
Four score and
seven years ago
our fathers ...
```

Because this is what you generally want, this is a common way to create multiline strings.



## Control structures
<!--
The rules in detail are:

- The condition of an if-expression can be written without enclosing parentheses if it is followed by a then or some indented code on a following line.
- The condition of a while-loop can be written without enclosing parentheses if it is followed by a do.
- The enumerators of a for-expression can be written without enclosing parentheses or braces if they are followed by a yield or do.
- A do in a for-expression expresses a for-loop.
-->

Scala has all of the basic programming language control structures you find in other languages, and also has powerful `for` expressions and `match` expressions:

- if/else
- `for` loops
- `match` expressions
- while, do/while
- try/catch

These structures are demonstrated in the following examples.


### if/else

Scala’s if/else control structure is similar to other languages. A multiline statement looks like this:

```scala
if x < 0 then
    "negative"
else if x == 0
    "zero"
else
    "positive"
```

and a single-line expression looks like this:

```scala
if x < 0 then -x else x
```

Note that this really is an *expression* — not a *statement* — meaning that it returns a value, and can therefore be used as a ternary operator:

```scala
val x = if (a < b) a else b
```

In fact, as you’ll see throughout this Overview and in our Reference documentation, *all* Scala control structures can be used as expressions.


### for loops and expressions
<!--
- basic for
- for/do
- multiple counters
- for/guard
- for/yield
-->

In its most basic use, the `for` keyword can be used to create a `for` loop. For instance, given this list:

```scala
// TODO introduce ranges first
val ints = (1 to 10).toList   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val ints = List.range(1,10)
```

you can print each element in the list like this:

```scala
for (i <- ints) println(i)
```

You can also use one or more *guards* — `if` expressions — inside a `for` loop. This example prints all of the numbers in `ints` that are greater than `5`:

```scala
for i <- ints if i > 5
do println(i)
```

That statement can be written like this if you prefer:

```scala
for
  i <- ints 
  if i > 5
do
  println(i)
```

This style is commonly used, because it supports the use of multiple generators and guards. For instance, this example prints all of the even numbers in `ints` that are greater than `2`:

```scala
// prints 4,6,8, and 10 on different lines
for
  i <- ints
  if i > 2
  if i % 2 == 0
do
  println(i)
```
<!--
// SHOWS MULTIPLE GUARDS
// prints: "i = 2, j = b"
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")
-->

Simple Scala `for` loops look like this:

```scala
for (arg <- args) println(arg)

// "x to y" syntax
for (i <- 0 to 5) println(i)

// "x to y by" syntax
for (i <- 0 to 10 by 2) println(i)
```

As shown in these examples, `for` loops are used for side effects, such as printing to the console. This use of the `for` keyword is just the beginning. When you add the `yield` keyword to `for` loops, you create powerful `for` *expressions* which are used to calculate and yield results. This REPL example shows how to use the for/yield combination to double each value in the sequence `1` to `5`:

```scala
scala> val x = for i <- 1 to 5 yield i * 2
val x: IndexedSeq[Int] = Vector(2, 4, 6, 8, 10)
```

<!--
// two-liner
for x <- xs if x > 0
yield x * x
-->

Here’s another `for` expression that iterates over a list of strings:

<!-- TODO: better example -->
```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for
  f <- fruits
  if f.length > 4
yield
  f.length

// result: List[Int] = List(5, 6, 6)
```

Because Scala code generally just makes sense, you can probably guess how this code works, even if you’ve never seen a for-expression or Scala list until now.

<!-- TODO: link  -->
`for` loops and expressions are covered in more detail in the Control Structures section.

<!--
a hard way to print the number `4`:
for {
    i <- 1 to 10
    if i > 3
    if i < 6
    if i % 2 == 0
} println(i)
-->


### match expressions

Scala has a `match` expression, which in its most basic use is like a Java `switch` statement:

```scala
val i = 1

// later in the code ...
val result = i match
    case 1 => "one"
    case 2 => "two"
    case _ => "not 1 or 2"
```

The `match` expression isn’t limited to just integers, it can be used with any data type, including booleans:

```scala
val booleanAsString = bool match
    case true => "true"
    case false => "false"
```

Here’s an example of `match` being used as the body of a method, and matching against many different types:

```scala
def getClassAsString(x: Any): String = x match
    case s: String => s + " is a String"
    case i: Int => "Int"
    case f: Float => "Float"
    case l: List[_] => "List"
    case p: Person => "Person"
    case _ => "Unknown"
```

Pattern matching is a significant feature of Scala, and you’ll see it used TODO (more here)


<!--
val cmd = "stop"
cmd match {
    case "start" | "go" => println("starting")
    case "stop" | "quit" | "exit" => println("stopping")
    case _ => println("doing nothing")
}

val evenOrOdd = someNumber match {
    case 1 | 3 | 5 | 7 | 9 => "odd"
    case 2 | 4 | 6 | 8 | 10 => "even"
    case _ => "other"
}

// `match` as the body of a method
def isTrue(a: Any) = a match {
    case 0 | "" => false
    case _ => true
}
-->




### try/catch

Scala’s try/catch control structure lets you catch exceptions. It’s similar to Java, but its syntax is consistent with `match` expressions:

<!-- TODO: test this -->
```scala
try
    writeToFile(text)
catch
    case fnfe: FileNotFoundException => println(fnfe)
    case ioe: IOException => println(ioe)
```


### while loops

Scala also has a `while` loop. It’s one-line syntax looks like this:

```scala
while x >= 0 do x = f(x)
```

And it’s multiline syntax looks like this:

```scala
var x = 1
while (x < 3)
    println(x)
    x += 1
```

<!--
while
  x >= 0
do
  x = f(x)
-->

<!--
- NOTE: dropped do/while
- see: https://dotty.epfl.ch/docs/reference/dropped-features/do-while.html
-->


### Create your own control structures!

- whilst
- doubleIfCOnditions
  doubleif(age > 18)(numAccidents == 0) { println("Discount!") }
  // two 'if' condition tests
  def doubleif(test1: => Boolean)(test2: => Boolean)(codeBlock: => Unit) { if (test1 && test2) {
    codeBlock
  } }



## Data Modeling

Scala supports both functional programming (FP) and object-oriented programming (OOP), as well as a fusion of the two paradigms. This section provides an overview of data modeling in OOP and FP.


### OOP data modeling (traits and classes)

When writing code in an OOP style, your two main tools will be *traits* and *classes*.

#### Traits
<!--
- traits as interface
- implemented methods
- class extends traits
- traits as mixins
-->

Traits can be used like interfaces and abstract classes in other languages, and they can also be used as mixins. Traits let you break your code down into small, modular units. Traits are like interfaces in other languages, but they can also contain implemented methods. When you want to create concrete implementations of attributes and behaviors, classes and objects can extend traits.

To demonstrate some things you can do with traits, here are three traits that define well-organized and modular behaviors for animals like dogs and cats:

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

Once you have those traits, you can create a `Dog` class that extends all three of those traits while providing a behavior for the abstract `speak` method:

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner:
    def speak(): String = "Woof!"
```

Similarly, here’s a `Cat` class that shows how to implement those same traits while also overriding two of the methods it inherits:

```scala
class Cat extends Speaker with TailWagger with Runner:
    def speak(): String = "Meow"
    override def startRunning(): Unit = println("Yeah ... I don’t run")
    override def stopRunning(): Unit = println("No need to stop")
```

<!-- TODO: links  -->
If that code makes sense — great, you’re comfortable with traits as interfaces. If not, don’t worry, they’re explained in more detail in the Data Modeling section of the Reference documentation.

<!-- TODO: show traits that take parameters -->


#### Classes

<!--
- TODO: update for final/open/closed?
- https://dotty.epfl.ch/docs/reference/other-new-features/open-classes.html
- An `open` modifier on a class signals that the class is planned for extensions
- Classes that are not open can still be extended, but only if at least one of two alternative conditions is met:
  - The extending class is in the same source file as the extended class
  - The language feature adhocExtensions is enabled for the extending class
- Details
  - `open` is a soft modifier. It is treated as a normal identifier unless it is in modifier position.
  - An open class cannot be final or sealed.
  - Traits or abstract classes are always open, so open is redundant for them.
-->

Scala classes are used in OOP-style programming. Here’s an example of a Scala class that models a “person,” where the person’s first and last names can both be modified (mutated):

```scala
class Person(var firstName: String, var lastName: String):
    def printFullName() = println(s"$firstName $lastName")
```

This is how you use that class:

```scala
// TODO: update
val p = Person("Julia", "Kern")
println(p.firstName)
p.lastName = "Manes"
p.printFullName()
```

<!-- TODO: link to correct section -->
Notice that the first and last names can be mutated because they’re declared as `var` fields. Also, there’s no need to create “get” and “set” methods to access the fields in the class. You’ll see more details about classes in the Data Modeling section.

As a more complicated example, here’s a `Pizza` class that you’ll see later in the book:

```scala
class Pizza (
  var crustSize: CrustSize,
  var crustType: CrustType,
  val toppings: ArrayBuffer[Topping]
) {
  def addTopping(t: Topping): Unit = toppings += t
  def removeTopping(t: Topping): Unit = toppings -= t
  def removeAllToppings(): Unit = toppings.clear()
}
```

In that code, an `ArrayBuffer` is a mutable sequence, like Java’s `ArrayList`. The `CrustSize`, `CrustType`, and `Topping` classes aren’t shown, but you can probably understand how that code works without needing to see those classes.


### FP data modeling  (TODO)

When writing code in an FP style, you’ll use these constructs:

- Traits
- Enums to define ADTs
- Case classes


#### Enums
<!-- 
- QUESTION: when to use enum vs case class?
- http://dotty.epfl.ch/docs/reference/enums/enums.html 
- http://dotty.epfl.ch/docs/reference/enums/adts.html
- enums can have parameters
- enums can have methods
- represented as sealed classes that extend the scala.Enum trait
- make compatible with java by extending java.lang.Enum
-->

<!-- 
// ENUM EXAMPLE
// attrib: example via Hermann’s slides
object Geometry {
  opaque type Length = Double
  opaque type Area = Double
  enum Shape {
    case Circle(radius: Length)
    case Rectangle(width: Length, height: Length)
    def area: Area = this match
      case Circle(r) => math.Pi * r * r
      case Rectangle(w, h) => w * h
    def circumference: Length = this match
      case Circle(r) => 2 * math.Pi * r
      case Rectangle(w, h) => 2 * w + 2 * h
  }
  object Length { def apply(d: Double): Length = d }
  object Area { def apply(d: Double): Area = d }
  // old syntax below here
//  given (length: Length) extended with
//    def double: Double = length
//  given (area: Area) extended with
//    def double: Double = area
}
-->

```scala
enum CrustSize:
    case Small, Medium, Large

enum CrustType:
    case Thin, Thick, Regular

enum Topping:
    case Cheese, Pepperoni, Olives
```


```scala
case class Pizza:
    crustSize: CrustSize,
    crustType: CrustType,
    toppings: Seq[Topping]

@main def pizzaDemo = 
    import CrustSize._
    import CrustType._
    import Topping._
    
    // passing enums as method parameters
    val smallThinCheesePizza = Pizza(
        Small, Thin, Seq(Cheese)
    )

    val largeThickWorks = Pizza(
        Large, Thick, Seq(Cheese, Pepperoni, Olives)
    )

    println(smallThinCheesePizza)
    println(largeThickWorks)

    printCrustSize(Small)

    // using an enum as a method parameter and in a match expression
    def printCrustSize(cs: CrustSize) = cs match 
        case Small  => println("small")
        case Medium => println("medium")
        case Large  => println("large")
```


##### Enums (WORKING)

Enums can take parameters:

```scala
// named values
enum Color:
  case Red, Green, Blue

// parameterized
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)

//TODO show usage
val red = Color.Red
Color.valueOf("Blue")   // res0: Color = Blue
Color.values            // Array(Red, Green, Blue)

// user-defined members
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // more ...
}
```


<!-- TODO: where to discuss `object` -->






#### Case classes

A *case class* is different than the base Scala class. Case classes provide support for functional programming, and they have all of the functionality of a regular class, and more. When the compiler sees the `case` keyword in front of a `class`, it generates code for you, with the following benefits:

- Case class constructor parameters are public `val` fields by default, so accessor methods are generated for each parameter.
- An `apply` method is created in the companion object of the class, so you don’t need to use the `new` keyword to create a new instance of the class.
- An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions.
- A `copy` method is generated in the class. You may not use this feature in Scala/OOP code, but it’s used all the time in Scala/FP.
- `equals` and `hashCode` methods are generated, which let you compare objects and easily use them as keys in maps.
- A default `toString` method is generated, which is helpful for debugging.

// BASIC
case class Person(name: String, relation: String)
val christina = Person("Christina", "niece")
christina.name
christina.name = "Fred"   // error

// MORE
trait Person:
    def name: String
case class Student(name: String, year: Int) extends Person
case class Teacher(name: String, specialty: String) extends Person

def getPrintableString(p: Person): String = p match {
    case Student(name, year) =>
        s"$name is a student in Year $year."
    case Teacher(name, whatTheyTeach) =>
        s"$name teaches $whatTheyTeach."
}

val s = Student("Al", 1)
val t = Teacher("Bob Donnan", "Mathematics")
getPrintableString(s)
getPrintableString(t)


// `copy`: “update as you copy”
case class BaseballTeam(name: String, lastWorldSeriesWin: Int)
val cubs1908 = BaseballTeam("Chicago Cubs", 1908)
val cubs2016 = cubs1908.copy(lastWorldSeriesWin = 2016)

// `equals` and `hashCode`
case class Person(name: String, relation: String)
val christina = Person("Christina", "niece")
val hannah = Person("Hannah", "niece")
christina == hannah

<!--
COMMENT: ProgrammingInScala: “the biggest advantage of case classes is that they support pattern matching.” 
-->



## Scala methods

Scala classes, case classes, and objects can all contain methods. This is what the Scala method syntax looks like:

```scala
def sum(a: Int, b: Int): Int = a + b
def concatenate(s1: String, s2: String): String = s1 + s2
```

You don’t have to declare a method’s return type, so it’s perfectly legal to write those two methods like this, if you prefer:

```scala
def sum(a: Int, b: Int) = a + b
def concatenate(s1: String, s2: String) = s1 + s2
```

This is how you call those methods:

```scala
val x = sum(1, 2)
val y = concatenate("foo", "bar")
```

There are more things you can do with methods, such as providing default values for method parameters and using named parameters when calling methods, and those are shown in TODO

<!-- TODO: differences between methods and functions -->



## First-class functions (TODO)

- top-level functions
- functions in objects
- lambdas / function literals / anonymous functions
- HOFs
- HOFs in the standard library




## Collections classes

If you’re coming to Scala from Java and you’re ready to really jump in and learn Scala, it’s possible to use the Java collections classes in Scala, and some people do so for several weeks or months while getting comfortable with Scala. But it’s highly recommended that you learn the basic Scala collections classes — `List`, `ListBuffer`, `Vector`, `ArrayBuffer`, `Map`, and `Set` — as soon as possible. A great benefit of the Scala collections classes is that they offer many powerful methods that you’ll want to start using as soon as possible to simplify your code.

<!-- TODO: list the popular classes in a UL -->


### Populating lists

There are times when it’s helpful to create sample lists that are populated with data, and Scala offers many ways to populate lists. Here are just a few:

```scala
val nums = List.range(0, 10)
val nums = (1 to 10 by 2).toList
val letters = ('a' to 'f').toList
val letters = ('a' to 'f' by 2).toList
```


### Sequence methods

While there are many sequential collections classes you can use — `Array`, `ArrayBuffer`, `Vector`, `List`, and more — let’s look at some examples of what you can do with the `List` class. Given these two lists:

```scala
val nums = (1 to 10).toList
val names = List("joel", "ed", "chris", "maurice")
```

This is the `foreach` method:

```scala
scala> names.foreach(println)
joel
ed
chris
maurice
```

Here’s the `filter` method, followed by `foreach`:

```scala
scala> nums.filter(_ < 4).foreach(println)
1
2
3
```

Here are some examples of the `map` method:

```scala
scala> val doubles = nums.map(_ * 2)
doubles: List[Int] = List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)

scala> val capNames = names.map(_.capitalize)
capNames: List[String] = List(Joel, Ed, Chris, Maurice)

scala> val lessThanFive = nums.map(_ < 5)
lessThanFive: List[Boolean] = List(true, true, true, true, false, false, false, false, false, false)
```

Even without any explanation you can see how `map` works: It applies an algorithm you supply to every element in the collection, returning a new, transformed value for each element.

If you’re ready to see one of the most powerful collections methods, here’s `foldLeft`:

```scala
scala> nums.foldLeft(0)(_ + _)
res0: Int = 55

scala> nums.foldLeft(1)(_ * _)
res1: Int = 3628800
```

Once you know that the first parameter to `foldLeft` is a *seed* value, you can guess that the first example yields the *sum* of the numbers in `nums`, and the second example returns the *product* of all those numbers.

There are many (many!) more methods available to Scala collections classes, and many of them will be demonstrated in the collections lessons that follow, but hopefully this gives you an idea of their power.

>For more details, jump to [the Scala Book collections lessons]({{site.baseurl}}/overviews/scala-book/collections-101.html), or see [the Mutable and Immutable collections overview]({{site.baseurl}}/overviews/collections-2.13/overview.html) for more details and examples.



## Tuples (TODO: update this section)

The Scala *tuple* is a class that lets you easily put a collection of different types in the same container. This is how you create a tuple that contains an `Int`, a `String`, and a `Boolean` value:

```scala
val t = (11, "eleven", true)
```

You can see the type in the REPL:

````
scala> val t = (11, "eleven", true)
TODO: UPDATE
````

You can access the tuple values by number:

```scala
t._1
t._2
t._3
```

TODO: other methods:

t.head
t.tail
t.drop(1)
t.take(1)
t.size
t.map ...

Or assign the tuple fields to variables:

```scala
val (num, string, good) = (11, "eleven", true)
```

````
scala> val (num, string, person) = (11, "eleven", true)
TODO: UPDATE
````

Tuples are nice for those times when you need to put a little “bag” of things together for a little while.



## Changes from Scala 2
## New control syntax
## Optional braces, indentation



## TODO: Other possible topics not in the outline

- Multiversal equality
- Advanced types
- Ranges
```scala
for (arg <- args) println(arg)

// "x to y" syntax
for (i <- 0 to 5) println(i)

// "x to y by" syntax
for (i <- 0 to 10 by 2) println(i)
```


## A small, sample application

- “Putting it all together”

- show an sbt example
- show several features
- @main












