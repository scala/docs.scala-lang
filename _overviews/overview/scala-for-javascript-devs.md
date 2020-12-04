---
title: Scala for JavaScript Developers
description: This chapter provides an introduction to Scala 3 for JavaScript developers
num: 40
previous-page: scala-for-java-devs
next-page: scala-for-python-devs
---

<p>This page provides a comparison between the JavaScript and Scala
programming languages. It’s intended for programmers who know
JavaScript
and want to learn about Scala, specifically by seeing examples of
how JavaScript
language features compare to Scala.
</p>
<h2>Overview<br>
</h2>
<p>This section provides a relatively brief introduction and summary
of the sections that follow. It presents the similarities and
differences between JavaScript and Scala at a high level, and then
introduces the differences you’ll experience every day as you
write code.</p>
<h3>High-level similarities<br>
</h3>
<p>At a high level, Scala shares these similarities with JavaScript:<br>
</p>
<ul>
<li>Both are considered high-level programming languages, where
you don’t have to concern yourself with low-level concepts like
pointers and manual memory management</li>
<li>Both have a relatively simple, concise syntax</li>
<li>Both support a C/C++/Java style curly-brace syntax for writing
methods and other block of code<br>
</li>
<li>Both are object-oriented programming (OOP) languages</li>
<li>Both are functional programming (FP) languages, with support
for lambdas and higher-order functions</li>
<ul>
<li>Functions are first-class citizens in both languages<br>
</li>
</ul>
<li>JavaScript runs in the browser, and with <a
href="https://www.scala-js.org/">the <i>Scala.js</i> project</a>,
Scala can be compiled to JavaScript to run in the browser</li>
<li><a href="https://nodejs.org/">Node.js</a> lets you write
server-side code in JavaScript; projects like the <a
href="https://www.playframework.com/">Play Framework</a> let
you write server-side applications in Scala</li>
<li>Both languages have similar <code>if</code> statements, <code>while</code>
loops, and <code>for</code> loops</li>
<li>Starting <a
href="https://www.scala-js.org/libraries/index.html">at this
Scala.js page</a>, you’ll find dozens of libraries to support
React, Angular, jQuery, and many other JavaScript and Scala
libraries<br>
</li>
<li>JavaScript objects are mutable; Scala objects can be mutable
when writing in an OOP style</li>
<li>Both JavaScript and Scala support <i>promises</i> as a way of
running parallel code (Scala uses futures and promises)<br>
</li>
</ul>
<h3>High-level differences<br>
</h3>
<p>Also at a high level, some of the differences between JavaScript
and Scala are:<br>
</p>
<ul>
<li>JavaScript is weakly typed, and Scala is statically typed</li>
<ul>
<li>Although Scala is statically typed, features like type
inference make it feel like a dynamic language (as you’ll see
in the examples that follow)<br>
</li>
</ul>
<li>Scala idioms favor immutability by default: you’re encouraged
to use immutable variables and immutable
collections<br>
</li>
<li>Scala has a concise but readable syntax; we call it <i>expressive</i><br>
</li>
<li>Scala is a pure OOP language, so every object is an instance
of a class, and symbols like <code>+</code> and <code>+=</code>
that look like operators are really methods; this means that you
can create your own methods that work as operators<br>
</li>
<li>As a pure OOP language and a pure FP language, Scala
encourages a fusion of OOP and FP, with
functions for the logic and objects for modularity<br>
</li>
<li>Everything in Scala is an <i>expression</i>: constructs like
<code>if</code> statements, <code>for</code> loops, <code>match</code>
expressions, and even <code>try</code>/<code>catch</code>
expressions all have return values<br>
</li>
<li>The <a
href="https://scala-native.readthedocs.io/en/v0.3.9-docs">Scala
Native</a> project lets you write
“systems” level code, and also compiles to native executables</li>
<li>Scala is an extremely consistent language, JavaScript has a
few quirks you need to know to avoid</li>
<ul>
<li>JavaScript: "123" + 1 == "1231", but "123" - 1 == 122</li>
<li>Scala 2 was consistent, and Scala 3 adds even more
consistency: Collections classes are created in a consistent
manner; they all have many of the same methods; everything is
an expression; symbols are used consistently in the syntax;
more...<br>
</li>
</ul>
<li>JavaScript objects are prototype-based; Scala objects are
class-based</li>
<li>
<meta http-equiv="content-type" content="text/html;
charset=UTF-8">
JavaScript runtime environments are single- threaded</li>
<ul>
<li>TODO: need to verify that</li>
</ul>
</ul>
<h3>Programming level differences<br>
</h3>
<p>At a lower level, these are some of the differences you’ll see
every day when writing code:<br>
</p>
<ul>
<li>Scala variables and parameters are defined with <code>val</code>
(immutable) or <code>var</code>
(mutable) (compared to JavaScript’s <tt>var</tt>, <tt>const</tt>,
and <tt>let</tt>)</li>
<li>Scala is statically-typed, though in many situations you don’t
need to declare the type<br>
</li>
<li>Scala does not use semi-colons at the end of lines<br>
</li>
<li>In addition to simple <code>for</code> loops, Scala has
powerful <code>for</code> comprehensions that yield results
based on your algorithms<br>
</li>
<li>Pattern matching and <code>match</code> expressions will
change the way you write code<br>
</li>
<li><i>Toplevel definitions</i> let you put method, field, and
other definitions anywhere, also leading to concise, expressive
code<br>
</li>
<li>Scala uses traits as interfaces and to create <i>mixins</i><br>
</li>
<li>Scala’s <i>contextual abstractions</i> and <i>term inference</i>
provide a collection of features:<br>
</li>
<ul>
<li><i>Extension methods</i> let you add new functionality to
closed classes</li>
<li><i>Given</i> instances let you define terms that the
compiler can use to synthesize code for you<br>
</li>
<li>Type safety and <i>multiversal equality</i> let you limit
equality comparisons —
at compile time — to only those comparisons that make sense<br>
</li>
</ul>
<li>Scala has state of the art, third-party, open source
functional programming libraries</li>
<li>Thanks to features like by-name parameters, infix notation,
optional parentheses, extension methods, and higher-order
functions, you can create your own “control structures” and DSLs<br>
</li>
<li>Many other goodies that you can read about in the Overview
documentation: case classes, companion classes and objects,
macros,
union and intersection types, toplevel definitions, numeric
literals, multiple parameter lists, default values for
parameters, named arguments, and more<br>
</li>
</ul>
<h2>Variables and Types</h2>
<h3>Comments</h3>
<p>Both JavaScript and Scala use the C/C++/Java style comment
syntax:<br>
</p>
<table cellspacing="1" cellpadding="2" border="1">
<tbody>
<tr>
<td valign="top">//<br>
/* ... */<br>
/** ... */</td>
<td valign="top">//<br>
/* ... */<br>
/** ... */</td>
</tr>
</tbody>
</table>
<h3>Variables<br>
</h3>
<p>JavaScript variables are typically defined with <tt>let</tt> and
<tt>const</tt>. Scala variables are defined with <tt>var</tt> and
<tt>val</tt>.<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td valign="top">let&nbsp;&nbsp; // now preferred for mutable<br>
var&nbsp;&nbsp; // old mutable style<br>
</td>
<td valign="top"><tt>var&nbsp;&nbsp; // used for mutable
variables</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>const</tt><br>
</td>
<td valign="top"><tt>val&nbsp;&nbsp; // used for immutable
variables</tt></td>
</tr>
</tbody>
</table>
<p>The rule of thumb in Scala is to declare variables using <tt>val</tt>,
unless there’s a specific reason you need a mutable variable.<br>
</p>
<h3>Naming standards<br>
</h3>
<p>JavaScript and Scala generally use the same <i>CamelCase</i>
naming standards. Variables are named like <tt>myVariableName</tt>,
methods are named like <tt>lastIndexOf</tt>, and classes and
object are named like <tt>Animal</tt> and <tt>PrintedBook</tt>.<br>
</p>
<h3>Strings<br>
</h3>
<p>Many uses of strings are similar in JavaScript and Scala:
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td rowspan="1" colspan="2" valign="top">String basics<br>
</td>
</tr>
<tr>
<td valign="top">// can use single- or double-quotes<br>
let msg = 'Hello, world';<br>
let msg = "Hello, world";<br>
<br>
// different variable types<br>
const msg = "Hello, world";<br>
let msg = "Hello, world";<br>
var msg = "Hello, world";</td>
<td valign="top">// use only double-quotes<br>
<br>
// msg is immutable<br>
val msg = "Hello, world"<br>
<br>
// msg can be mutated<br>
var msg = "Hello, world"</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Interpolation<br>
</td>
</tr>
<tr>
<td valign="top">let name = 'Joe';<br>
let msg = 'Hello, ${name}';</td>
<td valign="top">val name = "Joe"<br>
val age = 42<br>
val weight = 180.5<br>
<br>
// `s` prints "Hello, Joe"<br>
println(s"Hello, $name")<br>
<br>
// `f` allows printf-style formatting. this example <br>
// prints "Joe is 42 years old, and weighs 180.5 pounds."<br>
println(f"$name is $age years old, and weighs $weight%.1f
pounds.")<br>
</td>
</tr>
</tbody>
</table>
<p>Scala lets you create multiline strings, which also support
interpolation:<br>
</p>
<pre>val name = "Martin Odersky"<br><br>val quote = s"""<br>&nbsp; |$name has stated that <br>&nbsp; |Scala is a fusion of<br>
&nbsp; |OOP and FP.<br>""".stripMargin.replaceAll("\n", " ").trim</pre>
<pre>// result: "Martin Odersky has stated that Scala is a fusion of OOP and FP."</pre>
<p>JavaScript and Scala also have similar methods to work with
strings, including <tt>charAt</tt>, <tt>concat</tt>, <tt>indexOf</tt>,
and many more. Escape characters like <tt>\n</tt>, <tt>\f</tt>,
<tt>\t</tt> are also the same in both languages.<br>
</p>
<h3>Numbers and arithmetic<br>
</h3>
<p>Numeric operators are similar between JavaScript and Scala. The
biggest difference in the operators is that Scala doesn’t offer <tt>++</tt>
and <tt>--</tt> operators:<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td valign="top">let x = 1;<br>
let y = 2.0;<br>
</td>
<td valign="top">val x = 1<br>
val y = 2.0<br>
</td>
</tr>
<tr>
<td valign="top">let a = 1 + 1;<br>
let b = 2 - 1;<br>
let c = 2 * 2;<br>
let d = 4 / 2;<br>
let e = 5 % 2;<br>
</td>
<td valign="top">val a = 1 + 1<br>
val b = 2 - 1<br>
val c = 2 * 2<br>
val d = 4 / 2<br>
val e = 5 % 2<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Increment and
decrement<br>
</td>
</tr>
<tr>
<td valign="top">i++;<br>
i += 1;<br>
<br>
i--;<br>
i -= 1;<br>
</td>
<td valign="top">i += 1;<br>
i -= 1;<br>
</td>
</tr>
</tbody>
</table>
<p>In addition to <tt>+=</tt> and <tt>-=</tt> — which are really <i>methods</i>,
and not <i>operators</i> — Scala has these additional methods:<br>
</p>
<pre>var a = 1<br>a *= 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // 2<br>a *= 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // 4<br>a /= 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // 2<br></pre>
<p>JavaScript doesn’t differentiate between different types of
numbers. Per the IEEE 754 standard, all numbers are stored as
double precision floating-point values. Scala has different
numeric types. The two main types are <tt>Int</tt> and <tt>Double</tt>:</p>
<pre>val i = 1&nbsp;&nbsp;&nbsp;&nbsp; // Int<br>val d = 1.1&nbsp;&nbsp; // Double<br></pre>
<p>You can also create other numeric types as needed:</p>
<pre>val a: Byte = 0&nbsp;&nbsp;&nbsp; // Byte = 0<br>val a: Double = 0&nbsp; // Double = 0.0<br>val a: Float = 0&nbsp;&nbsp; // Float = 0.0<br>val a: Int = 0&nbsp;&nbsp;&nbsp;&nbsp; // Int = 0<br>val a: Long = 0&nbsp;&nbsp;&nbsp; // Long = 0<br>val a: Short = 0&nbsp;&nbsp; // Short = 0<br><br>val x = BigInt(1_234_456_789)<br>val y = BigDecimal(1_234_456.890)</pre>
<p>Boolean values are the same in both languages:<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td valign="top">let a = true;<br>
let b = false;<br>
</td>
<td valign="top">val a = true<br>
val b = false<br>
</td>
</tr>
</tbody>
</table>
<h3>Dates</h3>
<p>Dates are another commonly used type in both languages. Here are
a few examples of how they work:<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td rowspan="1" colspan="2" valign="top">Get the current date<br>
</td>
</tr>
<tr>
<td valign="top">let d = new Date();<br>
// result:<br>
//
<meta http-equiv="content-type" content="text/html;
charset=UTF-8">
Sun Nov 29 2020 18:47:57 GMT-0700 (Mountain Standard Time)</td>
<td valign="top">// different ways to get the current date and
time<br>
import java.time._<br>
<br>
val a = LocalDate.now&nbsp;&nbsp; // 2020-11-29<br>
val b = LocalTime.now&nbsp;&nbsp; // 18:46:38.563737<br>
val c = LocalDateTime.now&nbsp;&nbsp; //
2020-11-29T18:46:38.563750<br>
val d = Instant.now&nbsp;&nbsp; //
2020-11-30T01:46:38.563759Z<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Specify a different
date<br>
</td>
</tr>
<tr>
<td valign="top">// specify a different date<br>
let d = Date(2020, 1, 21, 1, 0, 0, 0);<br>
let d = Date(2020, 1, 21, 1, 0, 0);<br>
let d = Date(2020, 1, 21, 1, 0);<br>
let d = Date(2020, 1, 21, 1);<br>
let d = Date(2020, 1, 21);</td>
<td valign="top">val d = LocalDate.of(2020, 1, 21)<br>
val d = LocalDate.of(2020, Month.JANUARY, 21)<br>
val d = LocalDate.of(2020, 1, 1).plusDays(20)</td>
</tr>
</tbody>
</table>
<br>
Scala uses the classes that come with Java, and many methods are
similar between JavaScript and Scala. See <a
href="https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/package-summary.html">the
<i>java.time</i> package</a> for more details.<br>
<br>
<h2>Functions</h2>
<p>In both JavaScript and Scala, functions are objects, so their
functionality is similar, but their syntax and terminology is a
little different.<br>
</p>
<p>Simple “named” functions look like this:<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td rowspan="1" colspan="2" valign="top">Named functions, one
line<br>
</td>
</tr>
<tr>
<td valign="top">function add(a, b) {<br>
&nbsp; return a + b;<br>
}<br>
<br>
add(2,2);&nbsp;&nbsp; // 4<br>
</td>
<td valign="top">def add(a: Int, b: Int) = a + b<br>
<br>
add(2,2)&nbsp;&nbsp; // 4<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Named, functions
multiline<br>
</td>
</tr>
<tr>
<td valign="top">function addThenDouble(a, b) {<br>
&nbsp; // imagine this requires multiple lines<br>
&nbsp; return (a + b) * 2<br>
}<br>
</td>
<td valign="top">def addThenDouble(a: Int, b: Int): Int =<br>
&nbsp; // imagine this requires multiple lines<br>
&nbsp; (a + b) * s<br>
<br>
</td>
</tr>
</tbody>
</table>
<p>In Scala, showing the <tt>Int</tt> return type is optional. It’s
not shown in the first example, and is shown in the second
example, so you can see both approaches.<br>
</p>
<h3>Anonymous functions</h3>
Both JavaScript and Scala let you define anonymous functions, which
you can pass into other functions and methods.<br>
<br>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td rowspan="1" colspan="2" valign="top">Define an arrow
function and pass it to another function<br>
</td>
</tr>
<tr>
<td valign="top">// arrow function<br>
let log = (s) =&gt; console.log(s)<br>
<br>
// anonymous function<br>
let log = function(s) {<br>
&nbsp; console.log(s);<br>
}<br>
<br>
// use either of those functions here<br>
function printA(a, log) {<br>
&nbsp; log(a);<br>
}<br>
</td>
<td valign="top">// an anonymous function assigned to a
variable<br>
val log = (s: String) =&gt; console.log(s)<br>
<br>
// a scala method. methods tend to be used much more<br>
// often, probably because they’re easier to read.<br>
def log(a: Any) = console.log(a)<br>
<br>
// a function or a method can be passed into another<br>
// function or method<br>
def printA(a: Any, f: log: Any =&gt; Unit) = log(a)<br>
</td>
</tr>
</tbody>
</table>
<br>
<br>
In Scala you often define anonymous functions right at the point of
use. Also, may of the methods on the collections classes accept
function parameters, so you write code like this:<br>
<pre>// map method, long form<br>List(1,2,3).map(i =&gt; i * 10)&nbsp;&nbsp; // List(10,20,30)</pre>
<pre>// map, short form (which is more commonly used)<br>List(1,2,3).map(_ * 10)&nbsp;&nbsp; // List(10,20,30)<br><br>// filter, short form<br>List(1,2,3).filter(_ &lt; 3)&nbsp;&nbsp; // List(1,2)<br><br>// filter and then map<br>List(1,2,3,4,5).filter(_ &lt; 3).map(_ * 10)&nbsp;&nbsp; // List(10, 20)</pre>
<br>
<h2>Classes</h2>
<p>Scala has both classes and case classes. A <i>class</i> is
similar to a JavaScript class, and is generally intended for use
in OOP style applications (though that’s not 100% true), and <i>case
classes</i> have additional features that make them very useful
in FP style applications.<br>
</p>
<p>The following code shows how to create an OOP style <tt>Pizza</tt>
class, and then create and use a <tt>Pizza</tt> instance:</p>
<p><br>
</p>
<pre>// create some enumerations that the Pizza class will use<br>enum CrustSize:<br>&nbsp; case Small, Medium, Large<br><br>enum CrustType:<br>&nbsp; case Thin, Thick, Regular<br><br>enum Topping:<br>&nbsp; case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions</pre>
<pre><br>// import those enumerations and the ArrayBuffer, so the Pizza class can use them<br>import CrustSize._<br>import CrustType._<br>import Topping._<br>import scala.collection.mutable.ArrayBuffer</pre>
<pre><br>// define an OOP style Pizza class<br>class Pizza(<br>&nbsp; var crustSize: CrustSize,<br>&nbsp; var crustType: CrustType<br>):<br><br>&nbsp; private val toppings = ArrayBuffer[Topping]()</pre>
<pre>&nbsp; def addTopping(t: Topping): Unit = <br>&nbsp;&nbsp;&nbsp; toppings += t</pre>
<pre>&nbsp; def removeTopping(t: Topping): Unit = <br>&nbsp;&nbsp;&nbsp; toppings -= t</pre>
<pre>&nbsp; def removeAllToppings(): Unit = <br>&nbsp;&nbsp;&nbsp; toppings.clear()</pre>
<pre>&nbsp; override def toString(): String =<br>&nbsp;&nbsp;&nbsp; s"""<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |Pizza:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |&nbsp; Crust Size: ${crustSize}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |&nbsp; Crust Type: ${crustType}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |&nbsp; Toppings:&nbsp;&nbsp; ${toppings}<br>&nbsp;&nbsp;&nbsp; """.stripMargin<br><br>end Pizza</pre>
<pre><br>// create a Pizza instance<br>val p = Pizza(Small, Thin)<br><br>// change the crust<br>p.crustSize = Large<br>p.crustType = Thick</pre>
<pre>// add and remove toppings<br>p.addTopping(Cheese)<br>p.addTopping(Pepperoni)<br>p.addTopping(BlackOlives)<br>p.removeTopping(Pepperoni)<br><br>// print the pizza, which uses its `toString` method<br>println(p)</pre>
<p><br>
TODO: Add a little description of case classes and link to that
section<br>
</p>
<p><br>
</p>
<h2>Interfaces, traits, and inheritance</h2>
<p>Scala uses traits as interfaces, and also to create mixins.
Traits can have both abstract and concrete members, including
methods and fields.</p>
<p>This example shows how to define two traits, create a class that
extends and implements those traits, and then create and use an
instance of that class:<br>
</p>
<pre>trait HasLegs:<br>&nbsp; def numLegs: Int<br>&nbsp; def walk(): Unit<br>&nbsp; def stop() = println("Stopped walking")</pre>
<pre>trait HasTail:<br>&nbsp; def wagTail(): Unit<br>&nbsp; def stopTail(): Unit</pre>
<pre>class Dog(var name: String) extends HasLegs, HasTail:<br>&nbsp; val numLegs = 4<br>&nbsp; def walk() = println("I’m walking")<br>&nbsp; def wagTail() = println("⎞⎜⎛&nbsp; ⎞⎜⎛")<br>&nbsp; def stopTail() = println("Tail is stopped")<br>&nbsp; override def toString = s"$name is a Dog"<br><br>// create a Dog instance<br>val d = Dog("Rover")<br><br>// use the attributes and behaviors<br>println(d.numLegs)&nbsp;&nbsp; // 4<br>d.wagTail()&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // "⎞⎜⎛&nbsp; ⎞⎜⎛"<br>d.walk()&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // "I’m walking"<br></pre>
<br>
<br>
<h2>Control Structures<br>
</h2>
<p>Except for the use of === and !== in JavaScript, comparison
operators are almost identical in JavaScript and Scala:<br>
</p>
<table width="100%" cellspacing="2" cellpadding="2" border="1">
<tbody>
<tr>
<td valign="top"><tt>==</tt><br>
</td>
<td valign="top"><tt>==</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>===</tt><br>
</td>
<td valign="top"><tt>==</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>!=</tt><br>
</td>
<td valign="top"><tt>!=</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>!==</tt><br>
</td>
<td valign="top"><tt>!=</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>&gt;</tt><br>
</td>
<td valign="top"><tt>&gt;</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>&lt;</tt><br>
</td>
<td valign="top"><tt>&lt;</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>&gt;=</tt><br>
</td>
<td valign="top"><tt>&gt;=</tt><br>
</td>
</tr>
<tr>
<td valign="top"><tt>&lt;=</tt><br>
</td>
<td valign="top"><tt>&lt;=</tt><br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Logical operators (<i>and</i>,
<i>or</i>, and <i>not</i>)<br>
</td>
</tr>
<tr>
<td valign="top">&amp;&amp;<br>
||<br>
!<br>
</td>
<td valign="top">&amp;&amp;<br>
||<br>
!<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h3>if/then/else</h3>
<p>JavaScript and Scala if/then/else statements are similar. In
Scala 2 they were almost identical, but with Scala 3, curly braces
are no longer necessary (though they can still be used):<br>
</p>
<table cellspacing="1" cellpadding="2" border="1">
<tbody>
<tr>
<th valign="top">JavaScript<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><code>if</code>
statement, one line</td>
</tr>
<tr>
<td valign="top"><code>if (x == 1) { console.log(1); }</code><br>
</td>
<td valign="top"><code>if x == 1 then println(x)</code><br>
</td>
</tr>
<tr>
<td valign="top"><code>if</code> statement, multiline</td>
<td valign="top"><br>
</td>
</tr>
<tr>
<td valign="top">if (x == 1) {<br>
&nbsp; console.log("x is 1, as you can see:")<br>
&nbsp; console.log(x)<br>
} </td>
<td valign="top">if x == 1 then<br>
&nbsp; println("x is 1, as you can see:")<br>
&nbsp; println(x)<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">if/else if/else</td>
</tr>
<tr>
<td valign="top">// verified<br>
if (x &lt; 0) {<br>
&nbsp; console.log("negative")<br>
} else if (x == 0) {<br>
&nbsp; console.log("zero")<br>
} else {<br>
&nbsp; console.log("positive")<br>
}<br>
</td>
<td valign="top">if x &lt; 0 then<br>
&nbsp; println("negative")<br>
else if x == 0<br>
&nbsp; println("zero")<br>
else<br>
&nbsp; println("positive")<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><code>if</code> as
method body</td>
</tr>
<tr>
<td valign="top">public int min(int a, int b) {<br>
&nbsp; return (a &lt; b) ? a : b;<br>
}<br>
</td>
<td valign="top">def min(a: Int, b: Int): Int =<br>
&nbsp; if a &lt; b then a else b<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Returning a value
from if (i.e., ternary use)</td>
</tr>
<tr>
<td valign="top">let minVal = a &lt; b ? a : b;<br>
</td>
<td valign="top"><code>// no special syntax<br>
val minValue = if a &lt; b then a else
b</code></td>
</tr>
</tbody>
</table>
<p>In Scala 3 you can still use the “curly brace” style, if you
prefer. For instance, you can write an if/else-if/else expression
like this, if you prefer:<br>
</p>
<pre>// scala<br>val i = 1</pre>
<pre>if (i == 0) {<br>&nbsp; println(0)<br>} else if (i == 1) {<br>&nbsp; println(1)<br>} else {<br>&nbsp; println("other")<br>}<br></pre>
<h3>Loops (TODO: need to improve the JavaScript examples)<br>
</h3>
<p>Both JavaScript and Scala have for loops and while loops. Scala
used to have do/while loops, but they have been removed from the
language.<br>
</p>
<table cellspacing="1" cellpadding="2" border="1">
<tbody>
<tr>
<th valign="top">JavaScript<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><tt>while</tt> loops<br>
</td>
</tr>
<tr>
<td valign="top">let i = 0;<br>
while (i &lt; 3) {<br>
&nbsp; console.log(i);<br>
&nbsp; i++;<br>
}<br>
</td>
<td valign="top">var i = 0;<br>
while i &lt; 3 do<br>
&nbsp; println(i)<br>
&nbsp; i += 1<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><code>for</code>
loop, single line</td>
</tr>
<tr>
<td valign="top">// TODO make this consistent with the Scala
example --&gt;<br>
for (let i=0; i&lt;10; i++) {<br>
&nbsp; console.log(i);<br>
}<br>
</td>
<td valign="top">for i &lt;- ints do println(i)&nbsp;&nbsp; //
preferred<br>
for (i &lt;- ints) println(i)&nbsp;&nbsp; // also available<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><code>for</code>
loop, multiple lines in the body</td>
</tr>
<tr>
<td valign="top">// TODO make this consistent with the Scala
example --&gt;<br>
for (let i=0; i&lt;10; i++) {<br>
&nbsp; let j = i * 2;<br>
&nbsp; console.log(j);<br>
}</td>
<td valign="top">for<br>
&nbsp; i &lt;- ints<br>
do<br>
&nbsp; val x = i * 2<br>
&nbsp; println(s"i = $i, x = $x")<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Breaking a <tt>for</tt>
loop</td>
</tr>
<tr>
<td valign="top">// TODO verify<br>
for (let i=0; i&lt;10; i++) {<br>
&nbsp; if (i &gt; 5) break;<br>
&nbsp; console.log(i);<br>
}</td>
<td valign="top">A <tt>break</tt> statement is very rarely
used in Scala. If you need it, you can import it and then
use it.<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Multiple generators</td>
</tr>
<tr>
<td valign="top">// TODO use char here?<br>
for (let i = 0; i &lt; 2; i += 1) {<br>
&nbsp; for (let j = 0; j &lt; 3; j += 1) {<br>
&nbsp;&nbsp;&nbsp; console.log("i: ${i} j: ${j}");<br>
&nbsp; }<br>
}<br>
</td>
<td valign="top">for<br>
&nbsp; i &lt;- 1 to 2<br>
&nbsp; j &lt;- 'a' to 'b'<br>
&nbsp; k &lt;- 1 to 10 by 5<br>
do<br>
&nbsp; println(s"i = $i, j = $j, k = $k")<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top">Generator with guards
(<code>if</code>
expressions)</td>
</tr>
<tr>
<td valign="top">for (let i = 0; i &lt; 10; i += 1) {<br>
&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {<br>
&nbsp; &nbsp; console.log(i)<br>
}<br>
</td>
<td valign="top">for<br>
&nbsp; i &lt;- 1 to 10<br>
&nbsp; if i % 2 == 0<br>
&nbsp; if i &lt; 5<br>
do<br>
&nbsp; println(i)<br>
</td>
</tr>
<tr>
<td rowspan="1" colspan="2" valign="top"><code>for</code>
comprehension</td>
</tr>
<tr>
<td valign="top">N/A<br>
</td>
<td valign="top">val list = <br>
&nbsp; for<br>
&nbsp;&nbsp;&nbsp; i &lt;- 1 to 3<br>
&nbsp; yield<br>
&nbsp;&nbsp;&nbsp; i * 10<br>
// result: Vector(10, 20, 30)<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h3>switch &amp; match<br>
</h3>
<p>Where JavaScript has <tt>switch</tt> statements, Scala has <tt>match</tt>
expressions. Like everything else in Scala, these truly are <i>expressions</i>,
meaning they return a result.</p>
<pre>// a sample match expression that returns a result<br>val monthAsString = day match {<br>&nbsp; case 1 =&gt; "January"
&nbsp; case 2 =&gt; "February"
&nbsp; _ =&gt; "Other"
}</pre>
<p>match expressions can handle multiple matches in each case
statement:<br>
</p>
<pre>val numAsString = i match<br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
&nbsp; case _ =&gt; "too big"
</pre>
<p>match expressions can be used as the body of a method:</p>
<pre>def isTrue(a: Any) = a match<br>&nbsp; case 0 | "" =&gt; false<br>&nbsp; case _ =&gt; true<br><br><meta http-equiv="content-type" content="text/html; charset=UTF-8">def isPerson(x: Any): Boolean = x match
case p: Person =&gt; true
case _ =&gt; false
<pre></pre></pre>
<p>You can match many more things in <tt>match</tt> expressions.<br>
</p>
<p><br>
</p>
<h2>Collections classes</h2>
<p>Scala has different collections classes for different needs.</p>
<p>Common immutable sequences:</p>
<ul>
<li><tt>List</tt></li>
<li><tt>Vector</tt></li>
</ul>
<p>Common mutable sequences:</p>
<ul>
<li><tt>Array</tt></li>
<li><tt>ArrayBuffer</tt></li>
</ul>
<p>Also has mutable and immutable Maps and Sets.</p>
<p>Has several different variations of collections for special
needs. This is how you create the common Scala collection types:<br>
</p>
<pre>val strings = List("a", "b", "c")
val strings = Vector("a", "b", "c")<br>val strings = ArrayBuffer("a", "b", "c")<br><br>val set = Set("a", "b", "a") // result: Set("a", "b")<br>val map = Map(<br> "a" -&gt; 1, <br> "b" -&gt; 2,<br> "c" -&gt; 3<br>)</pre>
<br>
<h3>Methods on collections classes</h3>
The following examples show many different ways to work with Scala
collections classes.<br>
<h4>Populating lists<br>
</h4>
<pre># to, until<br>(1 to 5).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 2, 3, 4, 5)<br>(1 until 5).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 2, 3, 4)<br><br>(1 to 10 by 2).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 3, 5, 7, 9)<br>(1 until 10 by 2).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 3, 5, 7, 9)<br>(1 to 10).by(2).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 3, 5, 7, 9)<br><br>('d' to 'h').toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(d, e, f, g, h)<br>('d' until 'h').toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(d, e, f, g)<br>('a' to 'f').by(2).toList&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(a, c, e)<br><br># range method<br>List.range(1, 3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 2)<br>List.range(1, 6, 2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 3, 5)</pre>
<pre>List.fill(3)("foo")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(foo, foo, foo)<br>List.tabulate(3)(n =&gt; n * n)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(0, 1, 4)<br>List.tabulate(4)(n =&gt; n * n)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(0, 1, 4, 9)<br></pre>
<h4>Functional methods on the List class<br>
</h4>
<pre>val a = List(10, 20, 30, 40, 10)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 30, 40, 10)<br>a.contains(20) # true<br>a.distinct&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 30, 40)<br>a.drop(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(30, 40, 10)<br>a.dropRight(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 30)<br>a.dropWhile(_ &lt; 25)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(30, 40, 10)<br>a.filter(_ &lt; 25)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 10)<br>a.filter(_ &gt; 100)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List()<br>a.find(_ &gt; 20)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Some(30)<br>a.head&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 10<br>a.headOption&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Some(10)<br>a.init&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 30, 40)<br>a.last&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 10<br>a.lastOption&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # Some(10)<br>a.slice(2,4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(30, 40)<br>a.tail&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(20, 30, 40, 10)<br>a.take(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20, 30)<br>a.takeRight(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(40, 10)<br>a.takeWhile(_ &lt; 30)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 20)<br><br># map, flatMap<br>val fruits = List("apple", "pear")<br>fruits.map(_.toUpperCase)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(APPLE, PEAR)<br>fruits.flatMap(_.toUpperCase)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(A, P, P, L, E, P, E, A, R)<br><br>val nums = List(10, 5, 8, 1, 7)<br>nums.sorted&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 5, 7, 8, 10)<br>nums.sortWith(_ &lt; _)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(1, 5, 7, 8, 10)<br>nums.sortWith(_ &gt; _)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 8, 7, 5, 1)<br><br>List(1,2,3).updated(0,10)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(10, 2, 3)<br>List(2,4).union(List(1,3))&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(2, 4, 1, 3)<br><br># zip<br>val women = List("Wilma", "Betty")&nbsp;&nbsp;&nbsp; # List(Wilma, Betty)<br>val men = List("Fred", "Barney")&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List(Fred, Barney)<br>val couples = women.zip(men)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # List((Wilma,Fred), (Betty,Barney))<br></pre>
<p>Scala has <i>many</i> more methods that are available to you.
The benefits of all these methods are:</p>
<ul>
<li>You don’t have to write custom <tt>for</tt> loops to solve
problems</li>
<li>When you read someone else’s code, you won’t have to read
their custom <tt>for</tt> loops; you’ll just find common
methods like these<br>
</li>
</ul>
<h3>Tuples</h3>
<p>When you want to put multiple data types in the same list,
JavaScript lets you do this:</p>
<pre>let stuff = ["Joe", 42, 1.0]</pre>
<p>In Scala you do this:<br>
</p>
<pre>val a = ("eleven")<br>val b = ("eleven", 11)<br>val c = ("eleven", 11, 11.0)<br>val d = ("eleven", 11, 11.0, Person("Eleven"))</pre>
<p>In Scala these types are called tuples, and you access their
elements just like you access elements of a <tt>List</tt>, <tt>Vector</tt>,
or <tt>Array</tt>:<br>
</p>
<pre>d(0)&nbsp;&nbsp; // "eleven"<br>d(1)&nbsp;&nbsp; // 11<br></pre>
<h3>Enumerations</h3>
<p>JavaScript doesn’t have enumerations, but you can do this:</p>
<pre>let Color = {<br>&nbsp; RED: 1,<br>&nbsp; GREEN: 2,<br>&nbsp; BLUE: 3<br>};<br>Object.freeze(Color);<br></pre>
<p>In Scala you can do quite a few things with enumerations. You can
create an equivalent of that code:</p>
<pre>enum Color:<br>
&nbsp; case Red, Green, Blue</pre>
<p>You can create a parameterized enum:<br>
</p>
<pre>enum Color(val rgb: Int):<br>&nbsp; case Red&nbsp;&nbsp; extends Color(0xFF0000)
&nbsp; case Green extends Color(0x00FF00)
&nbsp; case Blue&nbsp; extends Color(0x0000FF)</pre>
<p>You can also create user-defined enum members:</p>
<pre>enum Planet(mass: Double, radius: Double):
&nbsp; case Mercury extends Planet(3.303e+23, 2.4397e6)
&nbsp; case Venus&nbsp;&nbsp; extends Planet(4.869e+24,6.0518e6)
&nbsp; case Earth&nbsp;&nbsp; extends Planet(5.976e+24,6.37814e6)
&nbsp; // more planets here ...<br>
&nbsp; private final val G = 6.67300E-11<br>&nbsp; def surfaceGravity = G * mass / (radius * radius)<br>&nbsp; def surfaceWeight(otherMass: Double) = otherMass * surfaceGravity</pre>
<p><br>
</p>
<h2>Scala DOM Code</h2>
<p>Once you include the necessary libraries, and import the
necessary packages in your code, writing Scala.js code looks very
similar to writing JavaScript code:<br>
</p>
<pre>// show an alert dialog on a button click<br>$("#hello-button").click{() =&gt;<br>&nbsp; dom.window.alert("Hello, world")<br>}<br></pre>
<pre>// define a button and what should happen when it’s clicked<br>val btn = button(<br>&nbsp; "Click me",<br>&nbsp; onclick := { () =&gt;<br>&nbsp;&nbsp;&nbsp; dom.window.alert("Hello, world")<br>})<br><br></pre>
<pre>// create two divs with css classes, an h2 element, and the button<br>val content =<br>&nbsp; div(cls := "foo",<br>&nbsp;&nbsp;&nbsp; div(cls := "bar",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; h2("Hello"),<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; btn<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )<br>&nbsp; )</pre>
<pre>// add the content to the DOM<br>val root = dom.document.getElementById("root")<br>root.innerHTML = ""<br>root.appendChild(content.render)</pre>
<p>Perhaps the biggest difference in the code is that Scala.js is
type-safe — it’s statically typed, so you catch many classes of
errors early in the development cycle — and JavaScript code is
dynamically typed.<br>
</p>
<p><br>
</p>
<h2>Other Scala.js resources</h2>
<p>The Scala.js website has an excellent collection of tutorials
from JavaScript developers interested in using Scala.js. Here are
some of their initial tutorials:<br>
</p>
<ul>
<li><a href="https://www.scala-js.org/doc/tutorial/basic/">Basic
tutorial (creating a first Scala.js project)</a><br>
</li>
<li><a href="https://www.scala-js.org/doc/sjs-for-js/">Scala.js
for JavaScript developers</a></li>
<li><a
href="https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part1.html">From
ES6 to Scala: Basics<br>
</a></li>
<li><a
href="https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part2.html">From
ES6 to Scala: Collections</a></li>
<li><a
href="https://www.scala-js.org/doc/sjs-for-js/es6-to-scala-part3.html">From
ES6 to Scala: Advanced</a><br>
</li>
</ul>
<br>
<h2>Concepts that are unique to Scala (TODO: update this section)<br>
</h2>
<p>There are other concepts in Scala which currently have no
equivalent
in JavaScript:<br>
</p>
<ul>
<li>Everything related to contextual abstractions</li>
<li>Method features:</li>
<ul>
<li>Multiple parameter lists</li>
<li>Default parameter values</li>
<li>Using named arguments when calling methods<br>
</li>
</ul>
<li>Case classes<br>
</li>
<li>Companion classes and objects</li>
<li>The ability to create your own control structures and DSLs</li>
<li>Pattern matching</li>
<li>Advanced features of <code>match</code> expressions</li>
<li>Type classes</li>
<li>Infix methods</li>
<li>Macros and metaprogramming</li>
<li>More ...<br>
</li>
</ul>



