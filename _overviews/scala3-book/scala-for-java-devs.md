---
title: Scala for Java Developers
type: chapter
description: This page is for Java developers who are interested in learning about Scala 3.
num: 71
previous-page: interacting-with-java
next-page: scala-for-javascript-devs
---

{% include_relative scala4x.css %}
<div markdown="1" class="scala3-comparison-page">


This page provides a comparison between the Java and Scala programming languages by sharing side-by-side examples of each language.
It’s intended for programmers who know Java and want to learn about Scala, specifically by seeing how Scala features compare to Java.



## Overview

Before getting into the examples, this first section provides a relatively brief introduction and summary of the sections that follow.
It presents the similarities and differences between Java and Scala at a high level, and then introduces the differences you’ll experience every day as you write code.

### High level similarities

At a high level, Scala shares these similarities with Java:

- Scala code is compiled to _.class_ files, packaged in JAR files, and runs on the JVM
- It’s an [object-oriented programming][modeling-oop] (OOP) language
- It’s statically typed
- Both languages have support for lambdas and [higher-order functions][hofs]
- They can both be used with IDEs like IntelliJ IDEA and Microsoft VS Code
- Projects can be built with build tools like Gradle, Ant, and Maven
- It has terrific libraries and frameworks for building server-side, network-intensive applications, including web server applications, microservices, machine learning, and more (see the [“Awesome Scala” list](https://github.com/lauris/awesome-scala))
- Both Java and Scala can use Scala libraries:
   - They can use the [Akka actors library](https://akka.io) to build actor-based concurrent systems, and Apache Spark to build data-intensive applications
   - They can use the [Play Framework](https://www.playframework.com) to develop server-side applications
- You can use [GraalVM](https://www.graalvm.org) to compile your projects into native executables
- Scala can seamlessly use the wealth of libraries that have been developed for Java

### High level differences

Also at a high level, the differences between Java and Scala are:

- Scala has a concise but readable syntax; we call it _expressive_
- Though it’s statically typed, Scala often feels like a dynamic language
- Scala is a pure OOP language, so every object is an instance of a class, and symbols like `+` and `+=` that look like operators are really methods; this means that you can create your own operators
- In addition to being a pure OOP language, Scala is also a pure FP language; in fact, it encourages a fusion of OOP and FP, with functions for the logic and objects for modularity
- Scala has a full suite of immutable collections, including `List`, `Vector`, and immutable `Map` and `Set` implementations
- Everything in Scala is an _expression_: constructs like `if` statements, `for` loops, `match` expressions, and even `try`/`catch` expressions all have return values
- Scala idioms favor immutability by default: you’re encouraged to use immutable (`final`) variables and immutable collections
- The Scala ecosystem has other [build tools][tools] in sbt, Mill, and others
- In addition to running on the JVM, the [Scala.js](https://www.scala-js.org) project lets you use Scala as a JavaScript replacement
- The [Scala Native](http://www.scala-native.org) project adds low-level constructs to let you write “systems” level code, and also compiles to native executables

{% comment %}
These are several notes that came up early in the writing process, and I (Alvin) can’t really address them:
TODO: Need a good, simple way to state that Scala has a sound type system
TODO: Points to make about Scala’s consistency?
TODO: Add a point about how the type system lets you express details as desired
{% endcomment %}


### Programming level differences

Finally, these are some of the differences you’ll see every day when writing code:

- Scala’s syntax is extremely consistent
- Variables and parameters are defined as `val` (immutable, like `final` in Java) or `var` (mutable)
- _Type inference_ makes your code feel dynamically typed, and helps to keep your code brief
- In addition to simple `for` loops, Scala has powerful `for` comprehensions that yield results based on your algorithms
- Pattern matching and `match` expressions will change the way you write code
- Writing immutable code by default leads to writing _expressions_ rather than _statements_; in time you see that writing expressions simplifies your code (and your tests)
- [Toplevel definitions][toplevel] let you put method, field, and other definitions anywhere, also leading to concise, expressive code
- You can create _mixins_ by “mixing” multiple traits into classes and objects (traits are similar to interfaces in Java 8 and newer)
- Classes are closed by default, supporting Joshua Bloch’s _Effective Java_ idiom, “Design and document for inheritance or else forbid it”
- Scala’s [contextual abstractions][contextual] and _term inference_ provide a collection of features:
  - [Extension methods][extension-methods] let you add new functionality to closed classes
  - [_Given_ instances][givens] let you define terms that the compiler can synthesize at _using_ points, making your code less verbose and essentially letting the compiler write code for you
  - [Multiversal equality][multiversal] lets you limit equality comparisons---at compile time---to only those comparisons that make sense
- Scala has state of the art, third-party, open source functional programming libraries
- Scala case classes are like records in Java 14; they help you model data when writing FP code, with built-in support for concepts like pattern matching and cloning
- Thanks to features like by-name parameters, infix notation, optional parentheses, extension methods, and [higher-order functions][hofs], you can create your own “control structures” and DSLs
- Scala files do not have to be named according to the classes or traits they contain
- Many other goodies: companion classes and objects, macros, [union][union-types] and [intersection][intersection-types], numeric literals, multiple parameter lists, default values for parameters, named arguments, and more

### Features compared with examples

Given that introduction, the following sections provide side-by-side comparisons of Java and Scala programming language features.



## OOP style classes and methods

This section provides comparisons of features related to OOP-style classes and methods.

### Comments:

<table>
  <tbody>
    <tr>
      <td class="java-block">
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

### OOP style class, primary constructor:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Person {
          <br>&nbsp; private String firstName;
          <br>&nbsp; private String lastName;
          <br>&nbsp; private int age;
          <br>&nbsp; public Person(
          <br>&nbsp;&nbsp;&nbsp; String firstName, 
          <br>&nbsp;&nbsp;&nbsp; String lastName, int age
          <br>&nbsp; ) {
          <br>&nbsp;&nbsp;&nbsp; this.firstName = firstName;
          <br>&nbsp;&nbsp;&nbsp; this.lastName = lastName;
          <br>&nbsp;&nbsp;&nbsp; this.age = age;
          <br>&nbsp; }
          <br>&nbsp; override String toString() {
          <br>&nbsp;&nbsp;&nbsp; return String.format("%s %s is %d years old.", firstName, lastName, age);
          <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (
          <br>&nbsp; var firstName: String,
          <br>&nbsp; var lastName: String,
          <br>&nbsp; var age: Int
          <br>):&nbsp;&nbsp; 
          <br>&nbsp; override def toString = s"$firstName $lastName is $age years old."
        </code>
      </td>
    </tr>
  </tbody>
</table>

### Auxiliary constructors:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public class Person {
        <br>&nbsp; private String firstName;
        <br>&nbsp; private String lastName;
        <br>&nbsp; private int age;
        <br>
        <br>&nbsp; // primary constructor
        <br>&nbsp; public Person(
        <br>&nbsp;&nbsp;&nbsp; String firstName,
        <br>&nbsp;&nbsp;&nbsp; String lastName,
        <br>&nbsp;&nbsp;&nbsp; int age
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; this.firstName = firstName;
        <br>&nbsp;&nbsp;&nbsp; this.lastName = lastName;
        <br>&nbsp;&nbsp;&nbsp; this.age = age;
        <br>&nbsp; }
        <br>
        <br>&nbsp; // zero-arg constructor
        <br>&nbsp; public Person(
        <br>&nbsp;&nbsp;&nbsp; String firstName, 
        <br>&nbsp;&nbsp;&nbsp; String lastName, 
        <br>&nbsp;&nbsp;&nbsp; int age
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; this("", "", 0);
        <br>&nbsp; }
        <br>
        <br>&nbsp; // one-arg constructor
        <br>&nbsp; public Person(String firstName) {
        <br>&nbsp;&nbsp;&nbsp; this(firstName, "", 0);
        <br>&nbsp; }
        <br>
        <br>&nbsp; // two-arg constructor
        <br>&nbsp; public Person(
        <br>&nbsp;&nbsp;&nbsp; String firstName, 
        <br>&nbsp;&nbsp;&nbsp; String lastName
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0);
        <br>&nbsp; }
        <br>
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (
        <br>&nbsp; var firstName: String,
        <br>&nbsp; var lastName: String,
        <br>&nbsp; var age: Int
        <br>):
        <br>&nbsp;&nbsp;&nbsp; // zero-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this() = this("", "", 0)
        <br>
        <br>&nbsp;&nbsp;&nbsp; // one-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this(firstName: String) = 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this(firstName, "", 0)
        <br>
        <br>&nbsp;&nbsp;&nbsp; // two-arg auxiliary constructor
        <br>&nbsp;&nbsp;&nbsp; def this(
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;firstName: String,
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastName: String
        <br>&nbsp;&nbsp;&nbsp; ) = 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0)
        <br>
        <br>end Person</code>
      </td>
    </tr>
  </tbody>
</table>


### Classes closed by default:
“Plan for inheritance or else forbid it.”

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>final class Person</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person</code>
      </td>
    </tr>
  </tbody>
</table>


### A class that’s open for extension:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Person</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>open class Person</code>
      </td>
    </tr>
  </tbody>
</table>


### One-line method:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public int add(int a, int b) {
        <br>&nbsp; return a + b;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def add(a: Int, b: Int): Int = a + b</code>
      </td>
    </tr>
  </tbody>
</table>


### Multiline method:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public void walkThenRun() {
        <br>&nbsp; System.out.println("walk");
        <br>&nbsp; System.out.println("run");
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def walkThenRun() =
        <br>&nbsp; println("walk")
        <br>&nbsp; println("run")</code>
      </td>
    </tr>
  </tbody>
</table>


### Immutable fields:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>final int i = 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val i = 1</code>
      </td>
    </tr>
  </tbody>
</table>


### Mutable fields:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>int i = 1;
        <br>var i = 1;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 1</code>
      </td>
    </tr>
  </tbody>
</table>



## Interfaces, traits, and inheritance

This section compares Java interfaces to Scala traits, including how classes extend interfaces and traits.


### Interfaces/traits:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Marker;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Marker</code>
      </td>
    </tr>
  </tbody>
</table>


### Simple interface:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Adder {
        <br>&nbsp; public int add(int a, int b);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int): Int</code>
      </td>
    </tr>
  </tbody>
</table>


### Interface with a concrete method:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public interface Adder {
        <br>&nbsp; int add(int a, int b);
        <br>&nbsp; default int multiply(
        <br>&nbsp;&nbsp;&nbsp; int a, int b
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; return a * b;
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int): Int
        <br>&nbsp; def multiply(a: Int, b: Int): Int =
        <br>&nbsp;&nbsp;&nbsp; a * b</code>
      </td>
    </tr>
  </tbody>
</table>


### Inheritance:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>class Dog extends Animal, HasLegs, HasTail</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Dog extends Animal, HasLegs, HasTail</code>
      </td>
    </tr>
  </tbody>
</table>


### Extend multiple interfaces

These interfaces and traits have concrete, implemented methods (default methods):

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>interface Adder {
        <br>&nbsp; default int add(int a, int b) {
        <br>&nbsp;&nbsp;&nbsp; return a + b;
        <br>&nbsp; }
        <br>}
        <br>
        <br>interface Multiplier {
        <br>&nbsp; default int multiply (
        <br>&nbsp; &nbsp; int a,
        <br>&nbsp; &nbsp; int b)
        <br>&nbsp; {
        <br>&nbsp;&nbsp;&nbsp; return a * b;
        <br>&nbsp; }
        <br>}
        <br>
        <br>public class JavaMath <br>implements Adder, Multiplier {}
        <br>
        <br>JavaMath jm = new JavaMath();
        <br>jm.add(1,1);
        <br>jm.multiply(2,2);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>trait Adder:
        <br>&nbsp; def add(a: Int, b: Int) = a + b
        <br>
        <br>trait Multiplier:
        <br>&nbsp; def multiply(a: Int, b: Int) = a * b
        <br>
        <br>class ScalaMath extends Adder, Multiplier
        <br>
        <br>val sm = new ScalaMath
        <br>sm.add(1,1)
        <br>sm.multiply(2,2)</code>
      </td>
    </tr>
  </tbody>
</table>


### Mixins:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class DavidBanner
        <br>
        <br>trait Angry:
        <br>&nbsp; def beAngry() =
        <br>&nbsp;&nbsp;&nbsp; println("You won’t like me ...")
        <br>
        <br>trait Big:
        <br>&nbsp; println("I’m big")
        <br>
        <br>trait Green:
        <br>&nbsp; println("I’m green")
        <br>
        <br>// mix in the traits as DavidBanner
        <br>// is created
        <br>val hulk = new DavidBanner with Big,
        <br>&nbsp; Angry, Green</code>
      </td>
    </tr>
  </tbody>
</table>



## Control structures

This section compares [control structures][control] in Java and Scala.

### `if` statement, one line:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>if (x == 1) { System.out.println(1); }</code>
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
      <td class="java-block">
        <code>if (x == 1) {
        <br>&nbsp; System.out.println("x is 1, as you can see:")
        <br>&nbsp; System.out.println(x)
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
      <td class="java-block">
        <code>if (x &lt; 0) {
        <br>&nbsp; System.out.println("negative")
        <br>} else if (x == 0) {
        <br>&nbsp; System.out.println("zero")
        <br>} else {
        <br>&nbsp; System.out.println("positive")
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


### `if` as the method body:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>public int min(int a, int b) {
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


### Return a value from `if`:

Called a _ternary operator_ in Java:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>int minVal = (a &lt; b) ? a : b;</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>


### `while` loop:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>while (i &lt; 3) {
        <br>&nbsp; System.out.println(i);
        <br>&nbsp; i++;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>


### `for` loop, single line:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints) {
        <br>&nbsp; System.out.println(i);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>//preferred
        <br>for i &lt;- ints do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- ints) println(i)</code>
      </td>
    </tr>
  </tbody>
</table>


### `for` loop, multiple lines:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints) {
        <br>&nbsp; int x = i * 2;
        <br>&nbsp; System.out.println(x);
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- ints
        <br>do
        <br>&nbsp; val x = i * 2
        <br>&nbsp; println(s"i = $i, x = $x")</code>
      </td>
    </tr>
  </tbody>
</table>


### `for` loop, multiple generators:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>for (int i: ints1) {
        <br>&nbsp; for (int j: chars) {
        <br>&nbsp;&nbsp;&nbsp; for (int k: ints2) {
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; System.out.printf("i = %d, j = %d, k = %d\n", i,j,k);
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
        <br>&nbsp; println(s"i = $i, j = $j, k = $k")</code>
      </td>
    </tr>
  </tbody>
</table>


### Generator with guards (`if`) expressions:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>List ints = 
        <br>&nbsp; ArrayList(1,2,3,4,5,6,7,8,9,10);
        <br>
        <br>for (int i: ints) {
        <br>&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {
        <br>&nbsp;&nbsp;&nbsp; System.out.println(x);
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


### `for` comprehension:

<table>
  <tbody>
    <tr>
      <td class="java-block">
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
        <br>// list: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>


### switch/match:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>String monthAsString = "";
        <br>switch(day) {
        <br>&nbsp; case 1: monthAsString = "January";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; case 2: monthAsString = "February";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; default: monthAsString = "Other";
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; break;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val monthAsString = day match
        <br>&nbsp; case 1 =&gt; "January"
        <br>&nbsp; case 2 =&gt; "February"
        <br>&nbsp; _ =&gt; "Other"
        </code>
      </td>
    </tr>
  </tbody>
</table>


### switch/match, multiple conditions per case:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>String numAsString = "";
        <br>switch (i) {
        <br>&nbsp; case 1: case 3:
        <br>&nbsp; case 5: case 7: case 9: 
        <br>&nbsp;&nbsp;&nbsp; numAsString = "odd";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; case 2: case 4:
        <br>&nbsp; case 6: case 8: case 10: 
        <br>&nbsp;&nbsp;&nbsp; numAsString = "even";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>&nbsp; default:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "too big";
        <br>&nbsp;&nbsp;&nbsp; break;
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val numAsString = i match
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
        <br>&nbsp; case _ =&gt; "too big"
        </code>
      </td>
    </tr>
  </tbody>
</table>


### try/catch/finally:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>try {
        <br>&nbsp; writeTextToFile(text);
        <br>} catch (IOException ioe) {
        <br>&nbsp; println(ioe.getMessage())
        <br>} catch (NumberFormatException nfe) {
        <br>&nbsp; println(nfe.getMessage())
        <br>} finally {
        <br>&nbsp; println("Clean up resources here.")
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>try
        <br>&nbsp; writeTextToFile(text)
        <br>catch
        <br>&nbsp; case ioe: IOException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(ioe.getMessage)
        <br>&nbsp; case nfe: NumberFormatException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(nfe.getMessage)
        <br>finally
        <br>&nbsp; println("Clean up resources here.")</code>
      </td>
    </tr>
  </tbody>
</table>



## Collections classes

This section compares the [collections classes][collections-classes] that are available in Java and Scala.


### Immutable collections classes

Examples of how to create instances of immutable collections.


### Sequences:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>List strings = List.of("a", "b", "c");</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val strings = List("a", "b", "c")
        <br>val strings = Vector("a", "b", "c")</code>
      </td>
    </tr>
  </tbody>
</table>


### Sets:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>Set set = Set.of("a", "b", "c");</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val set = Set("a", "b", "c")</code>
      </td>
    </tr>
  </tbody>
</table>


### Maps:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>Map map = Map.of(
        <br>&nbsp; "a", 1, 
        <br>&nbsp; "b", 2,
        <br>&nbsp; "c", 3
        <br>);</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val map = Map(
        <br>&nbsp; "a" -&gt; 1, 
        <br>&nbsp; "b" -&gt; 2, 
        <br>&nbsp; "c" -&gt; 3
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>


### Mutable collections classes

Scala has mutable collections classes like `ArrayBuffer`, `Map`, and `Set` in its _scala.collection.mutable_ package.
After [importing them][imports] into the current scope, they’re created just like the immutable `List`, `Vector`, `Map`, and `Set` examples just shown.

Scala also has an `Array` class, which you can think of as being a wrapper around the Java `array` primitive type.
A Scala `Array[A]` maps to a Java `A[]`, so you can think of this Scala `Array[String]`:

```scala
val a = Array("a", "b")
```

as being backed by this Java `String[]`:

```scala
String[] a = ["a", "b"]
```

However, a Scala `Array` also has all of the functional methods you expect in a Scala collection, including `map` and `filter`:

```scala
val nums = Array(1, 2, 3, 4, 5)
val doubledNums = nums.map(_ * 2)
val filteredNums = nums.filter(_ > 2)
```

Because the Scala `Array` is represented in the same way as the Java `array`, you can easily use Java methods that return arrays in your Scala code.

> Despite that discussion of `Array`, bear in mind that often in Scala there are alternatives to `Array` that might be better suited.
> Arrays are useful for interoperating with other languages (Java, JavaScript) and they may also be useful when writing low-level code that needs to squeeze maximum performance out of the underlying platform. But in general, when you need to use a sequence, the Scala idiom is to prefer immutable sequences like `Vector` and `List`, and then use `ArrayBuffer` if and when when you really need a mutable sequence.

You can also convert between Java and Scala collections classes with the Scala `CollectionConverters` objects.
There are two objects in different packages, one for converting from Java to Scala, and another for converting from Scala to Java.
This table shows the possible conversions:

<table>
  <tbody>
    <tr>
      <th>Java</th>
      <th>Scala</th>
    </tr>
    <tr>
      <td valign="top">java.util.Collection</td>
      <td valign="top">scala.collection.Iterable</td>
    </tr>
    <tr>
      <td valign="top">java.util.List</td>
      <td valign="top">scala.collection.mutable.Buffer</td>
    </tr>
    <tr>
      <td valign="top">java.util.Set</td>
      <td valign="top">scala.collection.mutable.Set</td>
    </tr>
    <tr>
      <td valign="top">java.util.Map</td>
      <td valign="top">scala.collection.mutable.Map</td>
    </tr>
    <tr>
      <td valign="top">java.util.concurrent.ConcurrentMap</td>
      <td valign="top">scala.collection.mutable.ConcurrentMap</td>
    </tr>
    <tr>
      <td valign="top">java.util.Dictionary</td>
      <td valign="top">scala.collection.mutable.Map</td>
    </tr>
  </tbody>
</table>
  


## Methods on collections classes

With the ability to treat Java collections as streams, Java and Scala now have many of the same common functional methods available to them:

- `map`
- `filter`
- `forEach`/`foreach`
- `findFirst`/`find`
- `reduce`  

If you’re used to using these methods with lambda expressions in Java, you’ll find it easy to use the same methods on Scala’s [collection classes][collections-classes].

Scala also has _dozens_ of other [collections methods][collections-methods], including `head`, `tail`, `drop`, `take`, `distinct`, `flatten`, and many more.
At first you may wonder why there are so many methods, but after working with Scala you’ll realize that _because_ of these methods, you rarely ever need to write custom `for` loops any more.

(This also means that you rarely need to _read_ custom `for` loops, as well.
Because developers tend to spend on the order of ten times as much time _reading_ code as _writing_ code, this is significant.)



## Tuples

Java tuples are created like this:  

```scala
Pair<String, Integer> pair =
  new Pair<String, Integer>("Eleven", 11);

Triplet<String, Integer, Double> triplet =
  Triplet.with("Eleven", 11, 11.0);
Quartet<String, Integer, Double,Person> triplet =
  Triplet.with("Eleven", 11, 11.0, new Person("Eleven"));
```

Other Java tuple names are Quintet, Sextet, Septet, Octet, Ennead, Decade.

Tuples of any size in Scala are created by putting the values inside parentheses, like this:  

```scala
val a = ("eleven")
val b = ("eleven", 11)
val c = ("eleven", 11, 11.0)
val d = ("eleven", 11, 11.0, Person("Eleven"))
```

  

## Enums

This section compares enumerations in Java and Scala.


### Basic enum:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Color {
        <br>&nbsp; RED, GREEN, BLUE
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color:
        <br>&nbsp; case Red, Green, Blue</code>
      </td>
    </tr>
  </tbody>
</table>


### Parameterized enum:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Color {
        <br>&nbsp; Red(0xFF0000),
        <br>&nbsp; Green(0x00FF00),
        <br>&nbsp; Blue(0x0000FF);
        <br>
        <br>&nbsp; private int rgb;
        <br>
        <br>&nbsp; Color(int rgb) {
        <br>&nbsp;&nbsp;&nbsp; this.rgb = rgb;
        <br>&nbsp; }
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color(val rgb: Int):
        <br>&nbsp; case Red&nbsp;&nbsp; extends Color(0xFF0000)
        <br>&nbsp; case Green extends Color(0x00FF00)
        <br>&nbsp; case Blue&nbsp; extends Color(0x0000FF)</code>
      </td>
    </tr>
  </tbody>
</table>


### User-defined enum members:

<table>
  <tbody>
    <tr>
      <td class="java-block">
        <code>enum Planet {
        <br>&nbsp; MERCURY (3.303e+23, 2.4397e6),
        <br>&nbsp; VENUS&nbsp;&nbsp; (4.869e+24, 6.0518e6),
        <br>&nbsp; EARTH&nbsp;&nbsp; (5.976e+24, 6.37814e6);
        <br>&nbsp; // more planets ...
        <br>
        <br>&nbsp; private final double mass;
        <br>&nbsp; private final double radius;
        <br>
        <br>&nbsp; Planet(double mass, double radius) {
        <br>&nbsp;&nbsp;&nbsp; this.mass = mass;
        <br>&nbsp;&nbsp;&nbsp; this.radius = radius;
        <br>&nbsp; }
        <br>
        <br>&nbsp; public static final double G = 
        <br>&nbsp;&nbsp;&nbsp; 6.67300E-11;
        <br>
        <br>&nbsp; private double mass() {
        <br>&nbsp;&nbsp;&nbsp; return mass;
        <br>&nbsp; }
        <br>
        <br>&nbsp; private double radius() {
        <br>&nbsp;&nbsp;&nbsp; return radius;
        <br>&nbsp; }
        <br>
        <br>&nbsp; double surfaceGravity() {
        <br>&nbsp;&nbsp;&nbsp; return G * mass / 
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(radius * radius);
        <br>&nbsp; }
        <br>
        <br>&nbsp; double surfaceWeight(
        <br>&nbsp;&nbsp;&nbsp; double otherMass
        <br>&nbsp; ) {
        <br>&nbsp;&nbsp;&nbsp; return otherMass *
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; surfaceGravity();
        <br>&nbsp; }
        <br>
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Planet(
          <br>&nbsp; mass: Double, 
          <br>&nbsp; radius: Double
        <br>):
        <br>&nbsp; case Mercury extends <br>&nbsp;&nbsp;&nbsp; Planet(3.303e+23, 2.4397e6)
        <br>&nbsp; case Venus extends <br>&nbsp;&nbsp;&nbsp; Planet(4.869e+24, 6.0518e6)
        <br>&nbsp; case Earth extends <br>&nbsp;&nbsp;&nbsp; Planet(5.976e+24, 6.37814e6)
        <br>&nbsp;&nbsp;&nbsp; // more planets ...
        <br>
        <br>&nbsp; private final val G = 6.67300E-11
        <br>
        <br>&nbsp; def surfaceGravity = <br>&nbsp;&nbsp;&nbsp; G * mass / (radius * radius)
        <br>
        <br>&nbsp; def surfaceWeight(otherMass: Double)
        <br>&nbsp;&nbsp;&nbsp; = otherMass * surfaceGravity</code>
      </td>
    </tr>
  </tbody>
</table>



## Exceptions and error handling

This section covers the differences between exception handling in Java and Scala.

### Java uses checked exceptions

Java uses checked exceptions, so in Java code you have historically written `try`/`catch`/`finally` blocks, along with `throws` clauses on methods:

```scala
public int makeInt(String s)
throws NumberFormatException {
  // code here to convert a String to an int
}
```

### Scala doesn’t use checked exceptions

The Scala idiom is to _not_ use checked exceptions like this.
When working with code that can throw exceptions, you can use `try`/`catch`/`finally` blocks to catch exceptions from code that throws them, but how you proceed from there is different.

The best way to explain this is that Scala code consists of _expressions_, which return values.
As a result, you end up writing your code as a series of algebraic expressions:

```scala
val a = f(x)
val b = g(a,z)
val c = h(b,y)
```

This is nice, it’s just algebra.
You create equations to solve small problems, and then combine equations to solve larger problems.

And very importantly---as you remember from algebra courses---algebraic expressions don’t short circuit---they don’t throw exceptions that blow up a series of equations.

Therefore, in Scala our methods don’t throw exceptions.
Instead, they return types like `Option`.
For example, this `makeInt` method catches a possible exception and returns an `Option` value:

```scala
def makeInt(s: String): Option[Int] =
  try
    Some(s.toInt)
  catch
    case e: NumberFormatException => None
```

The Scala `Option` is similar to the Java `Optional` class.
As shown, if the string-to-int conversion succeeds, the `Int` is returned inside a `Some` value, and if it fails, a `None` value is returned.
`Some` and `None` are subtypes of `Option`, so the method is declared to return the `Option[Int]` type.

When you have an `Option` value, such as the one returned by `makeInt`, there are many ways to work with it, depending on your needs.
This code shows one possible approach:

```scala
makeInt(aString) match
  case Some(i) => println(s"Int i = $i")
  case None => println(s"Could not convert $aString to an Int.")
```

`Option` is commonly used in Scala, and it’s built into many classes in the standard library.
Other similar sets of classes like Try/Success/Failure and Either/Left/Right offer even more flexibility.

For more information on dealing with errors and exceptions in Scala, see the [Functional Error Handling][error-handling] section.



## Concepts that are unique to Scala

That concludes are comparison of the Java and Scala languages.

Currently there are other concepts in Scala which currently have no equal in Java 11.
This includes:

- Everything related to Scala’s [contextual abstractions][contextual]
- Several Scala method features:
  - Multiple parameter lists
  - Default parameter values
  - Using named arguments when calling methods
- Case classes (like “records” in Java 14), case objects, and companion classes and objects (see the [Domain Modeling][modeling-intro]) chapter
- The ability to create your own control structures and DSLs
- [Toplevel definitions][toplevel]
- Pattern matching
- Advanced features of `match` expressions
- Type lambdas
- Trait parameters
- [Opaque type aliases][opaque]
- [Multiversal equality][equality]
- [Type classes][type-classes]
- Infix methods
- Macros and metaprogramming


[collections-classes]: {% link _overviews/scala3-book/collections-classes.md %}
[collections-methods]: {% link _overviews/scala3-book/collections-methods.md %}
[control]: {% link _overviews/scala3-book/control-structures.md %}
[equality]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[error-handling]: {% link _overviews/scala3-book/fp-functional-error-handling.md %}
[extension-methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[givens]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
[hofs]: {% link _overviews/scala3-book/fun-hofs.md %}
[imports]: {% link _overviews/scala3-book/packaging-imports.md %}
[modeling-intro]: {% link _overviews/scala3-book/domain-modeling-intro.md %}
[modeling-oop]: {% link _overviews/scala3-book/domain-modeling-oop.md %}
[opaque]: {% link _overviews/scala3-book/types-opaque-types.md %}
[tools]: {% link _overviews/scala3-book/scala-tools.md %}
[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
[type-classes]: {% link _overviews/scala3-book/ca-type-classes.md %}





[concurrency]: {% link _overviews/scala3-book/concurrency.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[control]: {% link _overviews/scala3-book/control-structures.md %}
[fp-intro]: {% link _overviews/scala3-book/fp-intro.md %}
[intersection-types]: {% link _overviews/scala3-book/types-intersection.md %}
[modeling-fp]: {% link _overviews/scala3-book/domain-modeling-fp.md %}
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[union-types]: {% link _overviews/scala3-book/types-union.md %}

</div>
