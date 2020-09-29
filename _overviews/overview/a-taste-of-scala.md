---
title: A Taste of Scala
description: This page provides a high-level overview of the main features of Scala 3.
---

<!-- TODO/QUESTIONS
  - add ScalaFiddle at the appropriate places
  - which Control Syntax to use by default?
  - demo “named parameters” with methods
  - show a method with default parameters
  - show package "exports"
  - cover Option/Try/Either (functional error handling)
  - do a search/replace on the word “field,” make sure it’s only used in classes, 
    objects, traits
    - don’t use "field," do use "variables," "binders," or maybe something
      like "assignment"
-->

This “Taste of Scala” section provides a whirlwind tour of Scala’s main features. After the initial tour in this section, the rest of the Overview will provide a few more details on the these features, and the Reference documentation will provide *many* more details.

>Throughout this Overview you’ll also be able to test many of the examples directly on this page. In addition to that, you can also test anything you’d like on [ScalaFiddle.io](https://scalafiddle.io), [Scastie](https://scastie.scala-lang.org), or in the Scala REPL, which is demonstrated shortly.



## Hello, world

<!-- NOTE: i assume here that dotc/dotr will be renamed to scala/scala -->

A “Hello, world” example in Scala goes as follows. First, put this code in a file named *Hello.scala*:

```scala
@main def hello = println("Hello, world")
```

Next, compile the code with `scalac`:

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

Like Java, the *.class* files are bytecode files, and they’re ready to run in the JVM. Now you can run the main `hello` method with the `scala` command:

```sh
$ scala hello
Hello, world
```

Assuming that worked, congratulations, you just compiled and ran your first Scala application.



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. You start a REPL session by running the `scala` command at your operating system command line. When you do so, you’ll see a “welcome” prompt like this:

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

- `val` creates an *immutable* variable — like `final` in Java. You should always create a variable with `val`, unless there’s a reason you need a mutable variable.
- `var` creates a *mutable* variable, and should only be used when a variable’s contents will change over time.

These examples show how to create `val` and `var` variables:

```scala
val a = 0         // immutable
val b = "Hello"

var c = 1         // mutable
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

You can declare variables by explicitly declaring their type, or by letting the compiler infer the type:

```scala
val x: Int = 1   // explicit
val x = 1        // implicit; the compiler infers the type
```

The second form is known as *type inference*, and it’s a great way to help keep this type of code concise. The Scala compiler can usually infer the data type for you, as shown in the output of these examples:

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
val p: Person = new Person("Richard")
```

Notice that with this approach, the code feels more verbose than necessary.



## Built-in data types

Scala comes with the standard numeric data types you’d expect, and they’re all full-blown instances of classes. In Scala, everything is an object.

These examples show how to declare variables of the numeric types:

```scala
val b: Byte = 1
val x: Int = 1
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

In your code you can also use the characters `L`, `D`, and `F` (and their lowercase equivalents) to specify `Long`, `Double`, and `Float` fields:

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

String interpolation lets you combine those variables in a string like this:

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```

Just precede the string with the letter `s`, and then put a `$` symbol before your variable names inside the string.

To enclose expressions inside a string, enclose them in curly braces:

~~~ scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
~~~

#### Other interpolators

“Why use the `s` in front of the string,” you may ask. The answer is that the `s` that precedes the strings in these examples is just one possible interpolator. You can also use the letter `f` in front of a string to use `printf`-style string formatting:

```scala
val name = "Fred"
val age = 33
val weight = 200.5

println(f"$name is $age years old, and weighs $weight%.1f pounds.")
```
<!-- TODO: use a better example -->

Beyond that, because `s` and `f` are really just methods, developers can write their own interpolators. For instance, Scala database libraries can create an `sql` interpolator that can have special features to support SQL:

```scala
val query = sql"select * from $table"
```


### Multiline strings

Multiline strings are created by including the string inside three double-quotes:

```scala
val quote = """The essence of Scala: 
               Fusion of functional and object-oriented 
               programming in a typed setting."""
```

One drawback of this basic approach is that the lines after the first line are indented, and look like this:

```scala
"The essence of Scala: 
               Fusion of functional and object-oriented
               programming in a typed setting."
```

A simple way to correct this problem is to put a `|` symbol in front of all lines after the first line, and call the `stripMargin` method after the string:

```scala
val quote = """The essence of Scala: 
               |Fusion of functional and object-oriented 
               |programming in a typed setting.""".stripMargin
```

Now all of the lines are left-justified inside the string:

```scala
"The essence of Scala: 
Fusion of functional and object-oriented 
programming in a typed setting."
```



## Control structures
<!--
https://dotty.epfl.ch/docs/reference/other-new-features/control-syntax.html
The rules in detail are:

- The condition of an if-expression can be written without enclosing parentheses if it is followed by a then or some indented code on a following line.
- The condition of a while-loop can be written without enclosing parentheses if it is followed by a do.
- The enumerators of a for-expression can be written without enclosing parentheses or braces if they are followed by a yield or do.
- A do in a for-expression expresses a for-loop.
-->

Scala has the programming language control structures you find in other languages, and also has powerful `for` expressions and `match` expressions:

- `if`/`else`
- `for` loops and expressions
- `match` expressions
- `while` loops
- `try`/`catch`

These structures are demonstrated in the following examples.


### if/else

Scala’s if/else control structure is similar to other languages:

```scala
if x < 0 then
  println("negative")
else if x == 0
  println("zero")
else
  println("positive")
```

Note that this really is an *expression* — not a *statement* — meaning that it returns a value, so you can assign the result to a variable:

```scala
val x = if a < b then a else b
```

As you’ll see throughout this Overview and in our Reference documentation, *all* Scala control structures can be used as expressions.

>An expression returns a result, while a statement does not. Statements are typically used for their side-effects, such as using `println` to print to the console.


### for loops and expressions
<!--
- basic for
- for/do
- multiple counters
- for/guard
- for/yield
-->

The `for` keyword can be used to create a `for` loop. This example shows how to print every element in a `List`:

```scala
val ints = List(1,2,3,4,5)

for i <- ints do println(i)
```

<!--
The code `i <- ints` is referred to as a *generator*, and if you want to leave the parentheses off of the generator, the `do` keyword is required before the code that follows it.
-->

#### Guards

You can also use one or more `if` expressions inside a `for` loop. These are referred to as *guards*. This example prints all of the numbers in `ints` that are greater than `2`:

<!-- TODO: scalafiddle -->
<!-- TODO: curly braces style? -->
```scala
val ints = List(1,2,3,4,5)

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

We encourage you to make changes to that code to be sure you understand how it works.


#### Using `for` as an expression

The `for` keyword has even more power: When you use the `yield` keyword instead of `do`, you create `for` *expressions* which are used to calculate and yield results.

A few examples demonstrate this. Using the same `ints` list as the previous example, this code creates a new list, where the value of each element in the new list is twice the value of the elements in the original list:

````
scala> val doubles = for (i <- ints) yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

Note that Scala’s syntax is flexible, and that `for` expression can be written in several different ways to make your code more readable:

```scala
val doubles = for i <- ints yield i * 2
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
```

This example shows how to capitalize the first character in each string in the list:

```scala
val names = List("chris", "ed", "maurice")
val capNames = for name <- names yield name.capitalize
```

Finally, this `for` expression iterates over a list of strings, and returns the length of each string, but only if that length is greater than `4`:

<!-- TODO: create a better example -->
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

<!-- TODO: links -->
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

However, a `match` expression really is an expression, meaning that it returns a result based on the pattern match:

```scala
val result = i match
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

The `match` expression isn’t limited to just integers, it can be used with any data type, including booleans:

```scala
val booleanAsString = bool match
  case true => "true"
  case false => "false"
```

In fact, a `match` expression can be used to test a variable against multiple patterns. This example shows (a) how to use a `match` expression as the body of a method, and (b) how to match all the different types shown:

<!-- TODO use scalafiddle -->
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

There’s much more to pattern matching in Scala. Patterns can be nested, results of patterns can be bound, and pattern matching can even be user-defined. You can find more pattern matching examples in the Control Structures section of this Overview, and in the Reference documentation.


### try/catch/finally

Scala’s `try`/`catch` control structure lets you catch exceptions. It’s similar to Java, but its syntax is consistent with `match` expressions:

<!-- TODO: better example; show 'finally' -->
```scala
try
  writeToFile(text)
catch
  case fnfe: FileNotFoundException => println(fnfe)
  case ioe: IOException => println(ioe)
```


### while loops

<!-- TODO: use parens and braces? -->

Scala also has a `while` loop construct. It’s one-line syntax looks like this:

```scala
while x >= 0 do x = f(x)
```

And it’s multiline syntax looks like this:

```scala
var x = 1

// parentheses
while (x < 3)
  println(x)
  x += 1

// no parens
while
  x < 3
do
  println(x)
  x += 1
```

### Create your own control structures!

Thanks to features like by-name parameters, infix notation, fluent interfaces, optional parentheses, extension methods, and higher-order functions, you can also create code that works just like a control structure. You’ll learn more about this in the Control Structures chapter in the Reference documentation.



## Data Modeling

Scala supports both functional programming (FP) and object-oriented programming (OOP), as well as a fusion of the two paradigms. This section provides a quick overview of data modeling in OOP and FP.


### OOP data modeling (traits and classes)

When writing code in an OOP style, your two main tools will be *traits* and *classes*.

#### Traits
<!--
- traits as interface
- implemented methods
- class extends traits
- traits as mixins
-->

Traits are like interfaces in other languages, but they can also contain implemented methods. They provide a great way for you to organize behaviors into small, modular units. When you want to create concrete implementations of attributes and behaviors, classes and objects can extend traits, mixing in as many traits as needed to achieve the desired behavior.

Here are three traits that define well-organized and modular behaviors for animals like dogs and cats:

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

<!-- TODO: links  -->
If that code makes sense — great, you’re comfortable with traits as interfaces. If not, don’t worry, they’re explained in more detail in the Data Modeling sections of this Overview and the Reference documentation.

<!-- TODO: show traits that take parameters here? -->


#### Classes

<!--
- TODO: update for final/open/closed
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

Scala *classes* are used in OOP-style programming. Here’s an example of a class that models a “person.” In OOP, fields are typically mutable, so `firstName` and `lastName` are both declared as `var` parameters:

```scala
class Person(var firstName: String, var lastName: String):
  def printFullName() = println(s"$firstName $lastName")

val p = Person("Julia", "Kern")
println(p.firstName)   // "Julia"
p.lastName = "Manes"
p.printFullName()      // "Julia Manes"
```


### Data Modeling (Functional Programming Style)

When writing code in an FP style, you’ll use these constructs:

- Enums to define ADTs
- Case classes
- Traits


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

Enums can also take parameters and have user-defined members like fields and methods. Here’s a sneak-peek of those capabilities:

```scala
enum Planet(mass: Double, radius: Double):
  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  // more ...
}
```

Enums are covered in detail in the Data Modeling section of this Overview, and in the Reference documentation.


#### Case classes

<!--
- WIKI: includes automatic support for pattern matching
- (From the perspective of Scala, a case class is simply a normal class for which the compiler automatically adds certain behaviors that could also be provided manually, e.g., definitions of methods providing for deep comparisons and hashing, and destructuring a case class on its constructor parameters during pattern matching.) 
-->

A *case class* is an extension of the base Scala class. Case classes provide features that make them useful for functional programming. They have all of the functionality of a regular class, and more. When the compiler sees the `case` keyword in front of a `class`, it generates code for you, with these benefits:

- Case class constructor parameters are public `val` fields by default, so accessor methods are generated for each parameter.
- An `apply` method is created in the companion object of the class, so you don’t need to use the `new` keyword to create a new instance of the class.
- An `unapply` method is generated, which lets you use case classes in more ways in `match` expressions.
- A `copy` method is generated in the class. This provides a way to clone an object while making updates to its values during the cloning process.
- `equals` and `hashCode` methods are generated.
- A default `toString` method is generated, which is helpful for debugging.

This code demonstrates several case class features:

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

// can access its fields, but they are immutable
p.name           // "Reginald Kenneth Dwight"
p.name = "Joe"   // error: can’t reassign a val field

// when you need to make a change, use the `copy` method
// to “update as you copy”
val p2 = p.copy(name = "Elton John")
p2               // Person = Person(Elton John,Singer)
```

See the Data Modeling sections of this Overview and the Reference documentation for many more details on case classes.



## Scala methods

<!--
TODO: review Jonathan’s notes/categories about methods
-->

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

There are more things you can do with methods, such as providing default values for method parameters and using named parameters when calling methods. Those featurs are shown in the Data Modeling section of this Overview and in the Reference documentation.



## First-class functions

Scala has first-class support for functional programming, and included in that is first-class support for everything related to functions:

- Top-level functions
- Functions in objects
- Lambdas
- Higher-order functions (HOFs)

<!-- TODO: when to say “function” vs when to say “method” -->
<!-- TODO: show the `val` function syntax? -->


###  Top-level functions

Functions don’t have to be in the body of a class, enum, or object. They can also exist on their own as a *top-level function*. For instance, when this code is saved in a file, the functions `add` and `double` would be called top-level functions because they exist outside the scope of a class, enum, or object:

```scala
package foo

def add(a: Int, b: Int): Int = a + b
def double(a: Int): Int = 2 * a

@main def topLevelFunctions() =
  val x = add(1, 2)
  val y = double(x)
  println(s"y = $y")
```


### Functions in objects

Functions can also be placed in objects. Here are a few functions in a “string utilities” object:

```scala
object StringUtils:

  // Left-trim a string: `"  foo  "` becomes `"foo  "`.
  def leftTrim(s: String) = s.replaceAll("^\\s+", "")

  // Right-trim a string: `"  foo  "` becomes `"  foo"`.
  def rightTrim(s: String) = s.replaceAll("\\s+$", "")

  def isNullOrEmpty(s: String): Boolean = 
    if (s==null || s.trim.equals("")) true else false

end StringUtils
```

Those functions can be called like this:

```scala
StringUtils.leftTrim("  hi  ")   // "hi  "
```

or this:

```scala
import StringUtils._
leftTrim("  hi  ")   // "hi  "
```


### Lambdas

Lambdas — also known as *anonymous functions* — are a big part of keeping your code concise but readable. These two examples are equivalent, and show how to multiply each number in a list by `2` by passing a lambda into the `map` method:

```scala
val a = List(1,2,3).map(i => i * 2)   // List(2,4,6)
val b = List(1,2,3).map(_ * 2)        // List(2,4,6)
```

Those examples are also equivalent to that code, but they use a `double` method inside of `map` instead of a lambda:

```scala
def double(i: Int): Int = i * 2
val a = List(1,2,3).map(i => double(i))
val b = List(1,2,3).map(double)
```

>If you haven’t seen the `map` method before, it applies a given function to every element in a list, yielding a new list that contains the new values.


### Higher-order functions

A “higher order function” (HOF) is a function that can take a function as an input parameter, or returns a function as a return value. HOFs are extremely common in Scala, such as being used throughout the standard libraries. These examples show how to pass methods and anonymous functions into the functional methods of Scala collections:

```scala
// a sample list
val nums = (1 to 10).toList   // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// sample methods
def isEven(i: Int): Boolean = i % 2 == 0
def double(i: Int): Int = i * 2

// pass in a method or function
val a = nums.filter(isEven)   // List(2, 4, 6, 8, 10)
val b = nums.map(double)      // List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)

// pass in a lambda
val c = nums.filter(_ % 2 == 0)   // List(2, 4, 6, 8, 10)
val d = nums.map(_ * 2)           // List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)

// methods can be chained as needed
val e = nums.filter(_ > 3)        // List(40, 50, 60)
            .filter(_ < 7)
            .map(_ * 10)
```

In addition to HOFs used all throughout the standard library, you can easily create your own HOFs. This is shown in the Reference documentation.

<!--
### Functions are objects
- add this section?
- TODO: show the types of functions?
    - see my 'val function vs def method page'
-->


## Extension methods

<!-- TODO: i may not be showing the latest syntax -->
*Extension methods* let you add new methods to closed classes. For instance, if you want to add two methods named `hello` and `aloha` to the `String` class, just declare them as extension methods:

<!-- TODO: scalafiddle -->
```scala
extension (s: String):
  def hello: String = s"Hello, ${s.capitalize}"
  def aloha: String = s"Aloha, ${s.capitalize}"

"world".hello    // "Hello, World"
"friend".aloha   // "Aloha, Friend"
```

The `extension` keyword declares that you’re about to define one or more extension methods. As shown, the `s` parameter can then be used in your methods.

This next example shows how to add a `makeInt` method to the `String` class. Here, `makeInt` takes a parameter named `radix`. The code doesn’t account for possible string-to-integer conversion errors, but skipping that detail, the examples show how it works:

<!-- TODO: scalafiddle -->
```scala
extension (s: String)
  def makeInt(radix: Int): Int = Integer.parseInt(s, radix)

"1".makeInt(2)      // Int = 1
"10".makeInt(2)     // Int = 2
"100".makeInt(2)    // Int = 4
```



## Collections classes

Scala has a rich set of collections classes, and those classes have a rich set of methods. Collections classes are available in both immutable and mutable forms. In alphabetical order, the basic collections classes you’ll use on a regular basis are:

| Class         | Mutable | Immutable | Description |
| ------------- | :-----: | :-------: | ----------- |
| `ArrayBuffer` | &#10003; |   | an indexed, mutable sequence |
| `List`        |   | &#10003; | a linear (linked list), immutable sequence |
| `Map`         | &#10003; | &#10003; | the base `Map` (key/value pairs) class |
| `Set`         | &#10003; | &#10003; | the base `Set` class |
| `Vector`      |   | &#10003; | an indexed, immutable sequence |

Scala also has a `Range` class which lets you create ordered sequences of integers that are equally spaced apart, such as “1, 2, 3,” and “5, 8, 11, 14.” Ranges are often used in `for` loops, and to create other sequences:

```scala
// a range in a for-loop
for (i <- 1 to 3) print(i)   // 123

// use ranges to create other collections
(1 to 5).toList              // List(1, 2, 3, 4, 5)
(1 to 10 by 2).toVector      // Vector(1, 3, 5, 7, 9)
(1 to 10).toSet              // Set[Int] = HashSet(5, 10, 1, 6, 9, 2, 7, 3, 8, 4)

('a' to 'f').toList          // List[Char] = List(a, b, c, d, e, f)
('a' to 'f' by 2).toList     // List[Char] = List(a, c, e)

List.range(1, 5)             // List(1, 2, 3, 4)
List.range(1, 5, 2)          // List(1, 3)
```

<!--
TODO:
  - mention Seq?
  - mention LazyList?
-->


### Immutable collections classes

Some of the most-commonly used *immutable* collections classes are:

| Class         | Description   |
| ------------- | ------------- |
| `List`        | A finite immutable linked-list. |
| `LazyList`    | Like a `List` except that its elements are computed lazily. Because of this, a lazy list can be infinitely long. |
| `Vector`      | A sequential collection type that provides good performance for all its operations. |
| `Map`         | Like maps in Java, dictionaries in Python, or a `HashMap` in Rust, `Map` is an `Iterable` that contains pairs of keys and values. |
| `Set`         | An `Iterable` sequence that contains no duplicate elements. |
| `Stack`       | A last-in-first-out sequence. |
| `Queue`       | A first-in-first-out sequence. |

In addition to the previous `Range` examples, here are a few more ways to create immutable collections:

<!-- TODO: more examples? -->
```scala
val a = List(1,2,3)
val b = Vector("hello", "world")

// create a List with a Range
val c = (1 to 5).toList

val m = Map(
  1 -> "one",
  2 -> "two"
)
```


### Mutable collections classes

Mutable Scala collections classes are located in the *scala.collection.mutable* package. These are some of the most commonly-used:

| Class         | Description   |
| ------------- | ------------- |
| `ArrayBuffer` | An indexed mutable buffer backed by an array. |
| `ListBuffer`    | A mutable buffer backed by a linked list. Use this class if you’ll use it like a `List`, or if you’ll convert it to a `List` once it’s built up. |
| `Map`         | A mutable `Map`, contains pairs of keys and values. |
| `Set`         | A mutable `Set`, a sequence that contains no duplicate elements. |
| `Stack`       | A mutable, last-in-first-out sequence. |
| `Queue`       | A mutable, first-in-first-out sequence. |

These examples show a few ways to use an `ArrayBuffer`:

```scala
import scala.collection.mutable.ArrayBuffer

val a = ArrayBuffer(1,2,3)          // ArrayBuffer(1, 2, 3)

val b = ArrayBuffer[String]()       // ArrayBuffer[String] = ArrayBuffer()
b += "Hello"                        // ArrayBuffer(Hello)
b ++= List("world", "it’s", "me")   // ArrayBuffer(Hello, world, it’s, me)
```

In addition to those classes, Scala has an `Array` class, which is a special kind of collection. An `Array` corresponds one-to-one to a Java `array`, so its elements can be mutated, but its size can’t be changed. In addition to behaving like a Java `array`, (a) it can hold generic types, and (b) it supports all of the usual sequence methods (which you’re about to see).



### Sequence methods

<!-- https://alvinalexander.com/scala/how-to-choose-scala-collection-method-solve-problem-cookbook -->

A great benefit of the Scala collections classes is that they offer dozens of powerful functional methods you can use to simplify your code. These are just a few of the common methods available to sequences:

| Method        | Description   |
| ------------- | ------------- |
| `map`         | Creates a new collection by applying a function to all the elements of the collection. |
| `filter`      | Returns all elements from the collection for which a given predicate is true. |
| `foreach`     | Applies a function to all elements of the collection to produce a side effect. |
| `take`, `takeWhile` | Returns elements from the beginning of the collection. |
| `drop`, `dropWhile` | Returns all elements in the collection except the first elements that are specified. |
| `flatten`  | Converts a sequence of sequences (such as a list of lists) to a single sequence (single list). |
| `foldLeft`     | Applies an operation to successive elements, going from left to right, using an initial seed value |
| `reduce`    | The same as `foldLeft`, but without an initial seed value. |

There are dozens of additional methods, which you’ll see in the Collections section of this Overview, and in the Reference documentation.

>A key to know about all of these methods is that they are *functional*: they don’t modify the existing sequence; they return a new collection by applying the method to the original sequence.

These examples demonstrate some of the commonly-used sequence methods:

```scala
// a sample list
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)

a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)

val a = List(List(1,2), List(3,4))
a.flatten                             // List(1, 2, 3, 4)

val nums = List("one", "two")
nums.map(_.toUpperCase)             // List("ONE", "TWO")
nums.flatMap(_.toUpperCase)         // List('O', 'N', 'E', 'T', 'W', 'O')
```

These examples show how the “fold” and “reduce” methods are used to sum up every element in a sequence:

```scala
val firstTen = (1 to 10).toList            // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

firstTen.fold(100)(_ + _)                  // 155
firstTen.foldLeft(100)(_ + _)              // 155
firstTen.reduce(_ + _)                     // 55
firstTen.reduceLeft(_ + _)                 // 55
```

There are many (many!) more methods available to Scala collections classes, and they’re demonstrated in the Collections sections of this Overview and in the Reference documentation.


### Tuples

<!-- TODO: introduce a tuple as an alternative to a class? -->

The Scala *tuple* is a type that lets you easily put a collection of different types in the same container. For example, given this `Person` case class:

```scala
case class Person(name: String)
```

This is how you create a tuple that contains an `Int`, a `String`, and a custom `Person` value:

```scala
val t = (11, "eleven", Person("Eleven"))
```

You can access the tuple values by number:

```scala
t._1   // 11
t._2   // "eleven"
t._3   // Person("Eleven")
```

You can also assign the tuple fields to variables, as shown in the REPL:

````
scala> val (num, string, name) = (11, "eleven", Person("Eleven"))
val num: Int = 11
val string: String = eleven
val good: Boolean = Person(Eleven)
````

Tuples are nice for those times when you want to put a collection of heterogenous types in a little collection-like structure.

<!--
TODO: state how tuples can be like an unstructured class, or for when a class is overkill?
-->



## Contextual Abstractions

<!-- TODO: my earlier Extension Method syntax may be a little old now -->

Implicits in Scala 2 were a main distinguishing feature. Following Haskell, Scala was the second popular language to have some form of implicits. Other languages have since followed suit.

Implicits are a fundamental way to abstract over context. They represent a unified paradigm with a great variety of use cases, among them: 

- Implementing type classes
- Establishing context
- Dependency injection
- Expressing capabilities
- Computing new types and proving relationships between them

Even though different languages use widely different terminology, they’re all variants of the core idea of *term inference*. Given a type, the compiler synthesizes a “canonical” term that has that type. Scala embodies the idea in a purer form than most other languages: An implicit parameter directly leads to an inferred argument term that could also be written down explicitly. 

In Scala 3 the syntax for these constructs has been changed significantly to make their usage more clear. Implicits are defined with the keyword `given`, and in later code they are referenced with the keyword `using`.


### Term inference

Here’s a quick example of how to use term inference in Scala 3. Imagine that you have a situation where a value is passed into a series of function calls, such as using an `ExecutionContext` when you’re working with parallel programming:

```scala
doX(a, executionContext)
doY(b, c, executionContext)
doZ(d, executionContext)
```

Because this type of code is repetitive and makes the code harder to read, you’d prefer to write it like this instead:

```scala
doX(a)
doY(b, c)
doZ(d)
```

The functions still use the `executionContext` variable, but they don’t require you to explicitly state that. As shown, the shorter code is more easy to read.

When you want a solution like this, Scala 3’s term inference solution is what you’re looking for. The solution involves multiple steps:

1. Define the code you want the compiler to discover using the Scala 3 `given` keyword.
1. When declaring the “implicit” parameter your function will use, put it in a separate parameter group and define it with the `using` keyword.
1. Make sure your `given` value is in the current context when your function is called.

The following example demonstrates these steps with the use of an `Adder` trait and two `given` values that implement the `Adder` trait’s `add` method.


### Step 1: Define your “given instances”

In the first step you’ll typically create a parameterized trait:

```scala
trait Adder[T]:
  def add(a: T, b: T): T
```

Then you’ll implement the trait using one or more `given` instances, which you define like this:

```scala
given intAdder as Adder[Int]:
  def add(a: Int, b: Int): Int = a + b

given stringAdder as Adder[String]:
  def add(a: String, b: String): String = "" + (a.toInt + b.toInt)
```

In this example, `intAdder` is an instance of `Adder[Int]`, and defines an `add` method that works with `Int` values. Similarly, `stringAdder` is an instance of `Adder[String]` and provides an `add` method that takes two strings, converts them to `Int` values, adds them together, and returns the sum as a `String`. (To keep things simple the code doesn’t account for potential string-to-integer errors.)

If you’re familiar with creating implicits in Scala 2, this new approach is similar to that process. The idea is the same, it’s just that the syntax has changed.


### Step 2: Declare the parameter your function will use with the `using` keyword

Next, define your functions that use the `Adder` instances. When doing this, specify the `Adder` parameter with the `using` keyword. Put the parameter in a separate parameter group, as shown here:

```scala
def genericAdder[A](x: A, y: A)(using adder: Adder[A]): A =
  adder.add(x, y)
```

The keys here are that the `adder` parameter is defined with the `using` keyword in that separate parameter group:

```scala
def genericAdder[A](x: A, y: A)(using adder: Adder[A]): A =
                               -----------------------
```

Also notice that `genericAdder` declares the generic type `A`. This function doesn’t know if it will be used to add two integers or two strings — it just calls the `add` method of the `adder` parameter.

>In Scala 2, parameters like this were declared using the `implicit` keyword, but now, as the entire programming industry has various implementations of this concept, this parameter is known in Scala 3 as a *context parameter*.


### Step 3: Make sure everything is in the current context

Finally, assuming that `intAdder`, `stringAdder`, and `genericAdder` are all in scope, your code can call the `genericAdder` function with `Int` and `String` values, without having to pass instances of `intAdder` and `stringAdder` into `genericAdder`:

```scala
println(genericAdder(1, 1))       // 2
println(genericAdder("2", "2"))   // 4
```

The Scala compiler is smart enough to know that `intAdder` should be used in the first instance, and `stringAdder` should be used in the second instance. This is because the first example uses two `Int` parameters and the second example uses two `String` values.



## Even more!

Scala has even more features that weren’t covered in this whirlwind tour. See the remainder of this Overview and the Reference documentation for many more details.


<!--
## Changes from Scala 2
- this might be as long as this doc. i think it should be a separate page.

## New control syntax
## Optional braces, indentation
## Discuss objects

## Givens/using/implicits
- i have a long example in the Cookbook, Recipe 19.9
- see if i can make that smaller
-->



<!--
## TODO: Other possible topics not in the outline

- Multiversal equality
- Advanced types
-->

<!--
## A small, sample application

- “Putting it all together”

- show an sbt example
- show several features
- @main
-->




