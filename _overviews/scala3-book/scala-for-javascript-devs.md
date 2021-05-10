---
title: Scala for JavaScript Developers
type: chapter
description: This chapter provides an introduction to Scala 3 for JavaScript developers
num: 72
previous-page: scala-for-java-devs
next-page: scala-for-python-devs
---

{% include_relative scala4x.css %}
<div markdown="1" class="scala3-comparison-page">


This page provides a comparison between the JavaScript and Scala programming languages.
It’s intended for programmers who know JavaScript and want to learn about Scala, specifically by seeing examples of how JavaScript language features compare to Scala.



## Overview

This section provides a relatively brief introduction and summary of the sections that follow.
It presents the similarities and differences between JavaScript and Scala at a high level, and then introduces the differences you’ll experience every day as you write code.

### High-level similarities

At a high level, Scala shares these similarities with JavaScript:

- Both are considered high-level programming languages, where you don’t have to concern yourself with low-level concepts like pointers and manual memory management
- Both have a relatively simple, concise syntax
- Both support a C/C++/Java style curly-brace syntax for writing methods and other block of code
- Both include features (like classes) for object-oriented programming (OOP)
- Both include features (like lambdas) for functional programming (FP)
- JavaScript runs in the browser and other environments like Node.js.
  The [Scala.js](https://www.scala-js.org) flavor of Scala targets JavaScript and Scala programs can thus run in the same environments.
- Developers write server-side applications in JavaScript and Scala using [Node.js](https://nodejs.org); projects like the [Play Framework](https://www.playframework.com/) also let you write server-side applications in Scala
- Both languages have similar `if` statements, `while` loops, and `for` loops
- Starting [at this Scala.js page](https://www.scala-js.org/libraries/index.html), you’ll find dozens of libraries to support React, Angular, jQuery, and many other JavaScript and Scala libraries
- JavaScript objects are mutable; Scala objects _can_ be mutable when writing in an imperative style
- Both JavaScript and Scala support *promises* as a way of running asynchronous computations (Scala uses futures and promises)

### High-level differences

Also at a high level, some of the differences between JavaScript and Scala are:

- JavaScript is dynamically typed, and Scala is statically typed
  - Although Scala is statically typed, features like type inference make it feel like a dynamic language (as you’ll see in the examples that follow)
- Scala idioms favor immutability by default: you’re encouraged to use immutable variables and immutable collections
- Scala has a concise but readable syntax; we call it *expressive*
- Scala is a pure OOP language, so every object is an instance of a class, and symbols like `+` and `+=` that look like operators are really methods; this means that you can create your own methods that work as operators
- As a pure OOP language and a pure FP language, Scala encourages a fusion of OOP and FP, with functions for the logic and immutable objects for modularity
- Scala has state of the art, third-party, open source functional programming libraries
- Everything in Scala is an *expression*: constructs like `if` statements, `for` loops, `match` expressions, and even `try`/`catch` expressions all have return values
- The [Scala Native](https://scala-native.readthedocs.io/en/v0.3.9-docs) project lets you write “systems” level code, and also compiles to native executables

### Programming level differences

At a lower level, these are some of the differences you’ll see every day when writing code:

- Scala variables and parameters are defined with `val` (immutable, like a JavaScript `const`) or `var` (mutable, like a JavaScript `var` or `let`)
- Scala does not use semi-colons at the end of lines
- Scala is statically-typed, though in many situations you don’t need to declare the type
- Scala uses traits as interfaces and to create *mixins*
- In addition to simple `for` loops, Scala has powerful `for` comprehensions that yield results based on your algorithms
- Pattern matching and `match` expressions will change the way you write code
- Scala’s *contextual abstractions* and *term inference* provide a collection of features:
  - *Extension methods* let you add new functionality to closed classes without breaking modularity, by being available only in specific scopes (as opposed to monkey-patching, which can pollute other areas of the code)
  - *Given* instances let you define terms that the compiler can use to synthesize code for you
  - Type safety and *multiversal equality* let you limit equality comparisons---at compile time---to only those comparisons that make sense
- Thanks to features like by-name parameters, infix notation, optional parentheses, extension methods, and higher-order functions, you can create your own “control structures” and DSLs
- Many other goodies that you can read about throughout this book: case classes, companion classes and objects, macros, union and intersection types, multiple parameter lists, named arguments, and more...



## Variables and Types

### Comments

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>//
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>//
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
  </tbody>
</table>


### Mutable variables

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let&nbsp;&nbsp; // now preferred for mutable
        <br>var&nbsp;&nbsp; // old mutable style</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>var&nbsp; // used for mutable variables</code>
      </td>
    </tr>
  </tbody>
</table>


### Immutable values

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>const</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val</code>
      </td>
    </tr>
  </tbody>
</table>

The rule of thumb in Scala is to declare variables using `val`, unless there’s a specific reason you need a mutable variable.



## Naming standards

JavaScript and Scala generally use the same *CamelCase* naming standards.
Variables are named like `myVariableName`, methods are named like `lastIndexOf`, and classes and object are named like `Animal` and `PrintedBook`.



## Strings

Many uses of strings are similar in JavaScript and Scala, though Scala only uses double-quotes for simple strings, and triple-quotes for multiline strings.


### String basics

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>// use single- or double-quotes
        <br>let msg = 'Hello, world';
        <br>let msg = "Hello, world";</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// use only double-quotes
        <br>val msg = "Hello, world"</code>
      </td>
    </tr>
  </tbody>
</table>


### Interpolation

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let name = 'Joe';
        <br>
        <br>// JavaScript uses backticks
        <br>let msg = `Hello, ${name}`;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val name = "Joe"
        <br>val age = 42
        <br>val weight = 180.5
        <br>
        <br>// use `s` before a string for simple interpolation
        <br>println(s"Hi, $name")&nbsp;&nbsp; // "Hi, Joe"
        <br>println(s"${1 + 1}")&nbsp;&nbsp;&nbsp; // "2"
        <br>
        <br>// `f` before a string allows printf-style formatting.
        <br>// this example prints:
        <br>// "Joe is 42 years old, and weighs"
        <br>// "180.5 pounds."
        <br>println(f"$name is $age years old, and weighs $weight%.1f pounds.")</code>
      </td>
    </tr>
  </tbody>
</table>


### Multiline strings with interpolation

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let name = "joe";
        <br>let str = `
        <br>Hello, ${name}.
        <br>This is a multiline string.
        <br>`;
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val name = "Martin Odersky"
        <br>
        <br>val quote = s"""
        <br>  |$name says
        <br>  |Scala is a fusion of
        <br>  |OOP and FP.
        <br>""".stripMargin.replaceAll("\n", " ").trim
        <br>
        <br>// result:
        <br>// "Martin Odersky says Scala is a fusion of OOP and FP."
        </code>
      </td>
    </tr>
  </tbody>
</table>

JavaScript and Scala also have similar methods to work with strings, including `charAt`, `concat`, `indexOf`, and many more.
Escape characters like `\n`, `\f`, `\t` are also the same in both languages.



## Numbers and arithmetic

Numeric operators are similar between JavaScript and Scala.
The biggest difference is that Scala doesn’t offer `++` and `--` operators.


### Numeric operators:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let x = 1;
        <br>let y = 2.0;
        <br>&nbsp;
        <br>let a = 1 + 1;
        <br>let b = 2 - 1;
        <br>let c = 2 * 2;
        <br>let d = 4 / 2;
        <br>let e = 5 % 2;
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val x = 1
        <br>val y = 2.0
        <br>&nbsp;
        <br>val a = 1 + 1
        <br>val b = 2 - 1
        <br>val c = 2 * 2
        <br>val d = 4 / 2
        <br>val e = 5 % 2
        </code>
      </td>
    </tr>
  </tbody>
</table>


### Increment and decrement:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>i++;
        <br>i += 1;
        <br>
        <br>i--;
        <br>i -= 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>i += 1;
        <br>i -= 1;</code>
      </td>
    </tr>
  </tbody>
</table>

Perhaps the biggest difference is that “operators” like `+` and `-` are really *methods* in Scala, not operators.
Scala numbers also have these related methods:

```scala
var a = 2
a *= 2      // 4
a /= 2      // 2
```

Scala's `Double` type most closely corresponds to JavaScript’s default `number` type,
`Int` represents signed 32-bit integer values, and `BigInt` corresponds to JavaScript's `bigint`.

These are Scala `Int` and `Double` values.
Notice that the type doesn’t have to be explicitly declared:

```scala
val i = 1     // Int
val d = 1.1   // Double
```

You can also use other numeric types as needed:

```scala
val a: Byte = 0    // Byte = 0
val a: Double = 0  // Double = 0.0
val a: Float = 0   // Float = 0.0
val a: Int = 0     // Int = 0
val a: Long = 0    // Long = 0
val a: Short = 0   // Short = 0

val x = BigInt(1_234_456_789)
val y = BigDecimal(1_234_456.890)
```


### Boolean values

Both languages use `true` and `false` for boolean values:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let a = true;
        <br>let b = false;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val a = true
        <br>val b = false</code>
      </td>
    </tr>
  </tbody>
</table>



## Dates

Dates are another commonly used type in both languages.

### Get the current date:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let d = new Date();<br>
        <br>// result:
        <br>// Sun Nov 29 2020 18:47:57 GMT-0700 (Mountain Standard Time)
        </code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// different ways to get the current date and time
        <br>import java.time.*
        <br>
        <br>val a = LocalDate.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-29
        <br>val b = LocalTime.now
        <br>&nbsp;&nbsp;&nbsp; // 18:46:38.563737
        <br>val c = LocalDateTime.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-29T18:46:38.563750
        <br>val d = Instant.now
        <br>&nbsp;&nbsp;&nbsp; // 2020-11-30T01:46:38.563759Z</code>
      </td>
    </tr>
  </tbody>
</table>


### Specify a different date:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>let d = Date(2020, 1, 21, 1, 0, 0, 0);
        <br>let d = Date(2020, 1, 21, 1, 0, 0);
        <br>let d = Date(2020, 1, 21, 1, 0);
        <br>let d = Date(2020, 1, 21, 1);
        <br>let d = Date(2020, 1, 21);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>val d = LocalDate.of(2020, 1, 21)
        <br>val d = LocalDate.of(2020, Month.JANUARY, 21)
        <br>val d = LocalDate.of(2020, 1, 1).plusDays(20)
        </code>
      </td>
    </tr>
  </tbody>
</table>

In this case, Scala uses the date and time classes that come with Java.
Many date/time methods are similar between JavaScript and Scala.
See [the *java.time* package](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/package-summary.html) for more details.



## Functions

In both JavaScript and Scala, functions are objects, so their functionality is similar, but their syntax and terminology is a little different.

### Named functions, one line:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>function add(a, b) {
        <br>&nbsp; return a + b;
        <br>}
        <br>add(2, 2);&nbsp;&nbsp; // 4</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>// technically this is a “method,” not a function
        <br>def add(a: Int, b: Int) = a + b
        <br>add(2, 2)&nbsp;&nbsp; // 4</code>
      </td>
    </tr>
  </tbody>
</table>

### Named functions, multiline:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
          <code>function addAndDouble(a, b) {
        <br>&nbsp; // imagine this requires
        <br>&nbsp; // multiple lines
        <br>&nbsp; return (a + b) * 2
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
          <code>def addAndDouble(a: Int, b: Int): Int =
        <br>&nbsp; // imagine this requires
        <br>&nbsp; // multiple lines
        <br>&nbsp; (a + b) * 2</code>
      </td>
    </tr>
  </tbody>
</table>

In Scala, showing the `Int` return type is optional.
It’s _not_ shown in the `add` example and _is_ shown in the `addThenDouble` example, so you can see both approaches.



## Anonymous functions

Both JavaScript and Scala let you define anonymous functions, which you can pass into other functions and methods.

### Arrow and anonymous functions

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// arrow function
        <br>let log = (s) =&gt; console.log(s)
        <br>
        <br>// anonymous function
        <br>let log = function(s) {
        <br>&nbsp; console.log(s);
        <br>}
        <br>
        <br>// use either of those functions here
        <br>function printA(a, log) {
        <br>&nbsp; log(a);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// a function (an anonymous function assigned to a variable)
        <br>val log = (s: String) =&gt; console.log(s)
        <br>
        <br>// a scala method. methods tend to be used much more often,
        <br>// probably because they’re easier to read.
        <br>def log(a: Any) = console.log(a)
        <br>
        <br>// a function or a method can be passed into another
        <br>// function or method
        <br>def printA(a: Any, f: log: Any =&gt; Unit) = log(a)
        </code>
      </td>
    </tr>
  </tbody>
</table>

In Scala you rarely define a function using the first syntax shown.
Instead, you often define anonymous functions right at the point of use.
Many collections methods are higher-order functions and accept function parameters, so you write code like this:

```scala
// map method, long form
List(1,2,3).map(i => i * 10)   // List(10,20,30)

// map, short form (which is more commonly used)
List(1,2,3).map(_ * 10)        // List(10,20,30)

// filter, short form
List(1,2,3).filter(_ < 3)      // List(1,2)

// filter and then map
List(1,2,3,4,5).filter(_ < 3).map(_ * 10)   // List(10, 20)
```



## Classes

Scala has both classes and case classes.
A *class* is similar to a JavaScript class, and is generally intended for use in OOP style applications (though they can also be used in FP code), and *case classes* have additional features that make them very useful in FP style applications.

The following example shows how to create several types as enumerations, and then defines an OOP-style `Pizza` class.
At the end, a `Pizza` instance is created and used:

```scala
// create some enumerations that the Pizza class will use
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions

// import those enumerations and the ArrayBuffer,
// so the Pizza class can use them
import CrustSize.*
import CrustType.*
import Topping.*
import scala.collection.mutable.ArrayBuffer

// define an OOP style Pizza class
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

// create a Pizza instance
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



## Interfaces, traits, and inheritance

Scala uses traits as interfaces, and also to create mixins.
Traits can have both abstract and concrete members, including methods and fields.

This example shows how to define two traits, create a class that extends and implements those traits, and then create and use an instance of that class:

```scala
trait HasLegs:
  def numLegs: Int
  def walk(): Unit
  def stop() = println("Stopped walking")

trait HasTail:
  def wagTail(): Unit
  def stopTail(): Unit

class Dog(var name: String) extends HasLegs, HasTail:
  val numLegs = 4
  def walk() = println("I’m walking")
  def wagTail() = println("⎞⎜⎛  ⎞⎜⎛")
  def stopTail() = println("Tail is stopped")
  override def toString = s"$name is a Dog"

// create a Dog instance
val d = Dog("Rover")

// use the class’s attributes and behaviors
println(d.numLegs)   // 4
d.wagTail()          // "⎞⎜⎛  ⎞⎜⎛"
d.walk()             // "I’m walking"
```



## Control Structures

Except for the use of `===` and `!==` in JavaScript, comparison and logical operators are almost identical in JavaScript and Scala.

{% comment %}
TODO: Sébastien mentioned that `===` is closest to `eql` in Scala. Update this area.
{% endcomment %}

### Comparison operators

<table>
  <tbody>
    <tr>
      <th valign="top">JavaScript</th>
      <th valign="top">Scala</th>
    </tr>
    <tr>
      <td valign="top">
        <code>==</code></td>
      <td valign="top">
        <code>==</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>===</code></td>
      <td valign="top">
        <code>==</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>!=</code></td>
      <td valign="top">
        <code>!=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>!==</code></td>
      <td valign="top">
        <code>!=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&gt;</code></td>
      <td valign="top">
        <code>&gt;</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&lt;</code></td>
      <td valign="top">
        <code>&lt;</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&gt;=</code></td>
      <td valign="top">
        <code>&gt;=</code></td>
    </tr>
    <tr>
      <td valign="top">
        <code>&lt;=</code></td>
      <td valign="top">
        <code>&lt;=</code></td>
    </tr>
  </tbody>
</table>

### Logical operators

<table>
  <tbody>
    <tr>
      <th valign="top">JavaScript</th>
      <th valign="top">Scala</th>
    </tr>
    <tr>
      <td valign="top">
        <code>&amp;&amp;
        <br>||
        <br>!</code>
      </td>
      <td valign="top">
        <code>&amp;&amp;
        <br>||
        <br>!</code>
      </td>
    </tr>
  </tbody>
</table>



## if/then/else expressions

JavaScript and Scala if/then/else statements are similar.
In Scala 2 they were almost identical, but with Scala 3, curly braces are no longer necessary (though they can still be used).

### `if` statement, one line:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>if (x == 1) { console.log(1); }</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` statement, multiline:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>if (x == 1) {
        <br>&nbsp; console.log("x is 1, as you can see:")
        <br>&nbsp; console.log(x)
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then
        <br>&nbsp; println("x is 1, as you can see:")
        <br>&nbsp; println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### if, else if, else:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>if (x &lt; 0) {
        <br>&nbsp; console.log("negative")
        <br>} else if (x == 0) {
        <br>&nbsp; console.log("zero")
        <br>} else {
        <br>&nbsp; console.log("positive")
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x &lt; 0 then
        <br>&nbsp; println("negative")
        <br>else if x == 0
        <br>&nbsp; println("zero")
        <br>else
        <br>&nbsp; println("positive")</code>
      </td>
    </tr>
  </tbody>
</table>

### Returning a value from `if`:

JavaScript uses a ternary operator, and Scala uses its `if` expression as usual:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let minVal = a &lt; b ? a : b;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` as the body of a method:

Scala methods tend to be very short, and you can easily use `if` as the body of a method:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>function min(a, b) {
        <br>&nbsp; return (a &lt; b) ? a : b;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def min(a: Int, b: Int): Int =
        <br>&nbsp; if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

In Scala 3 you can still use the “curly brace” style, if you prefer.
For instance, you can write an if/else-if/else expression like this:

```scala
if (i == 0) {
  println(0)
} else if (i == 1) {
  println(1)
} else {
  println("other")
}
```



## Loops

Both JavaScript and Scala have `while` loops and `for` loops.
Scala used to have do/while loops, but they have been removed from the language.

### `while` loop:

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let i = 0;
        <br>while (i &lt; 3) {
        <br>&nbsp; console.log(i);
        <br>&nbsp; i++;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 0;
        <br>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

The Scala code can also be written like this, if you prefer:

```scala
var i = 0
while (i < 3) {
  println(i)
  i += 1
}
```

The following examples show `for` loops in JavaScript and Scala.
They assume that you have these collections to work with:

```scala
// JavaScript
let nums = [1, 2, 3];

// Scala
val nums = List(1, 2, 3)
```

### `for` loop, single line

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// newer syntax
        <br>for (let i of nums) {
        <br>&nbsp; console.log(i);
        <br>}
        <br>
        <br>// older
        <br>for (i=0; i&lt;nums.length; i++) {
        <br>&nbsp; console.log(nums[i]);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- ints do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- ints) println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` loop, multiple lines in the body

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>// preferred
        <br>for (let i of nums) {
        <br>&nbsp; let j = i * 2;
        <br>&nbsp; console.log(j);
        <br>}
        <br>
        <br>// also available
        <br>for (i=0; i&lt;nums.length; i++) {
        <br>&nbsp; let j = nums[i] * 2;
        <br>&nbsp; console.log(j);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- ints do
        <br>&nbsp; val i = i * 2
        <br>&nbsp; println(j)
        <br>
        <br>// also available
        <br>for (i &lt;- nums) {
        <br>&nbsp; val j = i * 2
        <br>&nbsp; println(j)
        <br>}</code>
      </td>
    </tr>
  </tbody>
</table>

### Multiple generators in a `for` loop

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>let str = &quot;ab&quot;;
        <br>for (let i = 1; i &lt; 3; i++) {
        <br>&nbsp; for (var j = 0; j &lt; str.length; j++) {
        <br>&nbsp;&nbsp;&nbsp; for (let k = 1; k &lt; 11; k++) {
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let c = str.charAt(j);
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.log(`i: ${i} j: ${c} k: ${k}`);
        <br>&nbsp;&nbsp;&nbsp; }
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 2
        <br>&nbsp; j &lt;- 'a' to 'b'
        <br>&nbsp; k &lt;- 1 to 10 by 5
        <br>do
        <br>&nbsp; println(s"i: $i, j: $j, k: $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### Generator with guards

A _guard_ is a name for an `if` expression inside a `for` expression.

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        <code>for (let i = 0; i &lt; 10; i++) {
        <br>&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {
        <br>&nbsp;&nbsp;&nbsp; console.log(i);
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0
        <br>&nbsp; if i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` comprehension

A `for` comprehension is a `for` loop that uses `yield` to return (yield) a value. They’re used often in Scala.

<table>
  <tbody>
    <tr>
      <td class="javascript-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val list =
        <br>&nbsp; for
        <br>&nbsp;&nbsp;&nbsp; i &lt;- 1 to 3
        <br>&nbsp; yield
        <br>&nbsp;&nbsp;&nbsp; i * 10
        <br>// result: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>



## switch & match

Where JavaScript has `switch` statements, Scala has `match` expressions.
Like everything else in Scala, these truly are *expressions*, meaning they return a result:

```scala
val day = 1

// later in the code ...
val monthAsString = day match
  case 1 => "January"
  case 2 => "February"
  case _ => "Other"
```

`match` expressions can handle multiple matches in each `case` statement:

```scala
val numAsString = i match
  case 1 | 3 | 5 | 7 | 9 => "odd"
  case 2 | 4 | 6 | 8 | 10 => "even"
  case _ => "too big"
```

They can also be used as the body of a method:

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" => false
  case _ => true

def isPerson(x: Matchable): Boolean = x match
  case p: Person => true
  case _ => false
```

`match` expressions have many other pattern-matching options.



## Collections classes

Scala has different collections classes for different needs.

Common *immutable* sequences are:

- `List`
- `Vector`

Common *mutable* sequences are:

- `Array`
- `ArrayBuffer`

Scala also has mutable and immutable Maps and Sets.

This is how you create the common Scala collection types:

```scala
val strings = List("a", "b", "c")
val strings = Vector("a", "b", "c")
val strings = ArrayBuffer("a", "b", "c")

val set = Set("a", "b", "a") // result: Set("a", "b")
val map = Map(
  "a" -> 1,
  "b" -> 2,
  "c" -> 3
)
```

### Methods on collections

The following examples show many different ways to work with Scala collections.

### Populating lists:

```scala
// to, until
(1 to 5).toList                   // List(1, 2, 3, 4, 5)
(1 until 5).toList                // List(1, 2, 3, 4)

(1 to 10 by 2).toList             // List(1, 3, 5, 7, 9)
(1 until 10 by 2).toList          // List(1, 3, 5, 7, 9)
(1 to 10).by(2).toList            // List(1, 3, 5, 7, 9)

('d' to 'h').toList               // List(d, e, f, g, h)
('d' until 'h').toList            // List(d, e, f, g)
('a' to 'f').by(2).toList         // List(a, c, e)

// range method
List.range(1, 3)                  // List(1, 2)
List.range(1, 6, 2)               // List(1, 3, 5)

List.fill(3)("foo")               // List(foo, foo, foo)
List.tabulate(3)(n => n * n)      // List(0, 1, 4)
List.tabulate(4)(n => n * n)      // List(0, 1, 4, 9)
```

### Functional methods on sequences:

```scala
// these examples use a List, but they’re the same with Vector
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
a.contains(20)                        // true
a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.filter(_ > 100)                     // List()
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)

// map, flatMap
val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)             // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)         // List(A, P, P, L, E, P, E, A, R)

val nums = List(10, 5, 8, 1, 7)
nums.sorted                           // List(1, 5, 7, 8, 10)
nums.sortWith(_ < _)                  // List(1, 5, 7, 8, 10)
nums.sortWith(_ > _)                  // List(10, 8, 7, 5, 1)

List(1,2,3).updated(0,10)             // List(10, 2, 3)
List(2,4).union(List(1,3))            // List(2, 4, 1, 3)

// zip
val women = List("Wilma", "Betty")    // List(Wilma, Betty)
val men = List("Fred", "Barney")      // List(Fred, Barney)
val couples = women.zip(men)          // List((Wilma,Fred), (Betty,Barney))
```

Scala has *many* more methods that are available to you.
The benefits of all these methods are:

- You don’t have to write custom `for` loops to solve problems
- When you read someone else’s code, you won’t have to read their custom `for` loops; you’ll just find common methods like these, so it’s easier to read code from different projects


### Tuples

When you want to put multiple data types in the same list, JavaScript lets you do this:

```scala
let stuff = ["Joe", 42, 1.0];
```

In Scala you do this:

```scala
val a = ("eleven")
val b = ("eleven", 11)
val c = ("eleven", 11, 11.0)
val d = ("eleven", 11, 11.0, Person("Eleven"))
```

In Scala these types are called tuples, and as shown, they can contain one or more elements, and the elements can have different types.
You access their elements just like you access elements of a `List`, `Vector`, or `Array`:

```scala
d(0)   // "eleven"
d(1)   // 11
```

### Enumerations

JavaScript doesn’t have enumerations, but you can do this:

```javascript
let Color = {
  RED: 1,
  GREEN: 2,
  BLUE: 3
};
Object.freeze(Color);
```

In Scala 3 you can do quite a few things with enumerations.
You can create an equivalent of that code:

```scala
enum Color:
  case Red, Green, Blue
```

You can create a parameterized enum:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

You can also create user-defined enum members:

```scala
enum Planet(mass: Double, radius: Double):
  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24,6.0518e6)
  case Earth   extends Planet(5.976e+24,6.37814e6)
  // more planets here ...

  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity
```



## Scala.js DOM Code

Scala.js lets you write Scala code that is compiled to JavaScript code that can then be used in the browser.
The approach is similar to TypeScript, ReScript, and other languages that are compiled to JavaScript.

Once you include the necessary libraries, and import the necessary packages in your project, writing Scala.js code looks very similar to writing JavaScript code:

```scala
// show an alert dialog on a button click
jQuery("#hello-button").click{() =>
  dom.window.alert("Hello, world")
}

// define a button and what should happen when it’s clicked
val btn = button(
  "Click me",
  onclick := { () =>
    dom.window.alert("Hello, world")
  })

// create two divs with css classes, an h2 element, and the button
val content =
  div(cls := "foo",
    div(cls := "bar",
      h2("Hello"),
      btn
    )
  )

// add the content to the DOM
val root = dom.document.getElementById("root")
root.innerHTML = ""
root.appendChild(content.render)
```

Note that although Scala is a type-safe language, no types are declared in the above code.
Scala’s strong type inference capabilities often make Scala code look like it’s dynamically typed.
But it is type-safe, so you catch many classes of errors early in the development cycle.



## Other Scala.js resources

The Scala.js website has an excellent collection of tutorials for JavaScript developers interested in using Scala.js.
Here are some of their initial tutorials:

- [Basic tutorial (creating a first Scala.js project)](https://www.scala-js.org/doc/tutorial/basic/)
- [Scala.js for JavaScript developers](https://www.scala-js.org/doc/sjs-for-js/)
- [From ES6 to Scala: Basics](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part1.html)
- [From ES6 to Scala: Collections](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part2.html)
- [From ES6 to Scala: Advanced](https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part3.html)



## Concepts that are unique to Scala

There are other concepts in Scala which currently have no equivalent in JavaScript:

- Almost everything related to [contextual abstractions][contextual]
- Method features:
  - Multiple parameter lists
  - Using named arguments when calling methods
- Using traits as interfaces
- Case classes
- Companion classes and objects
- The ability to create your own control structures and DSLs
- Advanced features of `match` expressions and pattern matching
- `for` comprehensions
- Infix methods
- Macros and metaprogramming
- More ...


[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}

</div>

