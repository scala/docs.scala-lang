---
title: Scala for Java Developers
description: This page is for Java developers who are interested in learning about Scala 3.
---

<p> <u>Notes to reviewers:</u> <br>
</p>
<ol>
<li>I’m initially submitting this page as HTML because it’s much
easier to work on these side-by-side source code examples with a
Wysiwyg editor (I’m using SeaMonkey). I will convert it to
Markdown when we’re confident with the content in those tables.
If at all possible, I think the side-by-side code examples are
the best approach.<br>
</li>
<li>I haven’t formatted the multiline source code examples inside
table cells because I think it will be easier to convert them to
Markdown if I don’t do that now. (My initial conversion tests
with Pandoc showed that the conversion will be smoother by not
using <code>&lt;code&gt;</code> tags on those multiline
examples.)<br>
</li>
<li>This page will eventually link to many other pages. So if you
wonder why I don’t explain certain things in more detail, it’s
because (a) I’m trying to keep this page as short as possible
and (b) I assume this page will eventually link to dozens of
other pages for more details.</li>
</ol>
<hr width="100%" size="2">
<p><br>
</p>
<p>This page provides a comparison between the Java and Scala
programming languages. It’s intended for programmers who know Java
and want to learn about Scala, specifically by seeing how Java
language features compare to Scala.</p>
<h2>Executive overview (TL;DR)<br>
</h2>
<p>This section provides a relatively brief introduction and summary
of the sections that follow. It presents the similarities and
differences between Java and Scala at a high level, and then
introduces the differences you’ll experience every day as you
write code.</p>
<h3>High level similarities<br>
</h3>
<p>At a high level, Scala shares these similarities with Java:<br>
</p>
<ul>
<li>Scala code is compiled to <i>.class</i> files, packaged in
JAR files, and runs on the JVM</li>
<li>It’s an object-oriented programming (OOP) language</li>
<li>It’s statically typed</li>
<li>Both languages have support for immutable collections,
lambdas, and higher-order functions<br>
</li>
<li>It has great IDE support</li>
<li>It has great build tools</li>
<li>It has terrific libraries and frameworks for building
server-side, network-intensive applications, including web
server applications, microservices, machine learning, and more</li>
<li>Both Java and Scala can use the Akka actors library to build
actor-based concurrent systems, and Apache Spark to build
data-intensive applications<br>
</li>
<li>You can use GraalVM to compile your projects into native
executables</li>
<li>Scala can seamlessly use the wealth of libraries that have
been developed for Java</li>
</ul>
<h3>High level differences<br>
</h3>
<p>Also at a high level, the differences between Java and Scala are:<br>
</p>
<ul>
<li>Scala has a concise but readable syntax; we call it <i>expressive</i><br>
</li>
<li>Though it’s statically typed, Scala feels like a dynamic
language</li>
<li>Scala is a pure OOP language, so every object is an instance
of a class, and symbols like <code>+</code> and <code>+=</code>
that look like operators are really methods; this means that you
can create your own operators<br>
</li>
<li>In addition to being a pure OOP language, Scala is also a pure
FP language; in fact, it encourages a fusion of OOP and FP, with
functions for the logic and objects for modularity<br>
</li>
<li>Everything in Scala is an <i>expression</i>: constructs like
<code>if</code> statements, <code>for</code> loops, <code>match</code>
expressions, and even <code>try</code>/<code>catch</code>
expressions all have return values<br>
</li>
<li>Scala idioms favor immutability by default: you’re encouraged
to use immutable (<code>final</code>) variables and immutable
collections<br>
</li>
<li>In addition to running on the JVM, the <a
href="https://www.scala-js.org">Scala.js</a> project lets you
use Scala as a JavaScript replacement</li>
<li>The <a
href="https://scala-native.readthedocs.io/en/v0.3.9-docs">Scala

Native</a> project adds low-level constructs to let you write
“systems” level code, and also compiles to native executables</li>
<li>Sound type system (TODO: need a good, simple way to state
this)<br>
</li>
</ul>
<h3>Programming level differences<br>
</h3>
<p>At a lower level, these are some of the differences you’ll see
every day when writing code:<br>
</p>
<ul>
<li>Scala’s syntax is extremely consistent (TODO: need a good way
to state this)</li>
<li>Variables and parameters are defined as <code>val</code>
(immutable, like <code>final</code> in Java) or <code>var</code>
(mutable)<br>
</li>
<li>Type inference makes your code feel dynamic and helps to keep
it as brief as you want it<br>
</li>
<li>In addition to simple <code>for</code> loops, Scala has
powerful <code>for</code> comprehensions that yield results
based on your algorithms<br>
</li>
<li>Pattern matching and <code>match</code> expressions will
change the way you write code<br>
</li>
<li>Scala’s type system lets you express details (TODO: need a
good way to state this)</li>
<li>Writing immutable code by default leads to writing <i>expressions</i>
rather than <i>statements</i>; in time you’ll see that writing
expressions simplifies your code (and your tests)<br>
</li>
<li><i>Toplevel definitions</i> let you put method, field, and
other definitions anywhere, also leading to concise, expressive
code<br>
</li>
<li>You can create <i>mixins</i> by “mixing in” multiple traits
(traits are similar to interfaces in Java 8 and newer)<br>
</li>
<li>Classes are closed by default, supporting Joshua Bloch’s <i>Effective

Java</i> idiom, “Design and document for inheritance or else
forbid it”<br>
</li>
<li>Scala’s <i>contextual abstractions</i> and <i>term inference</i>
provide a collection of features:<br>
</li>
<ul>
<li><i>Extension methods</i> let you add new functionality to
closed classes</li>
<li><i>Given</i> instances let you define terms that the
compiler can synthesize at <i>using</i> points, making your
code less verbose and essentially letting the compiler write
code for you<br>
</li>
<li>Multiversal equality lets you limit equality comparisons —
at compile time — to only those comparisons that make sense<br>
</li>
</ul>
<li>First class support for building modules<br>
</li>
<li>Scala has state of the art, third-party, open source
functional programming libraries</li>
<li>Case classes are like records in Java 14; they help you model
data when writing FP code, with built-in support for concepts
like pattern matching and cloning<br>
</li>
<li>Thanks to features like by-name parameters, infix notation,
optional parentheses, extension methods, and higher-order
functions, you can create your own “control structures” and DSLs<br>
</li>
<li>Scala files do not have to be named according to the classes
or traits they contain</li>
<li>Many other goodies: companion classes and objects, macros,
union and intersection types, toplevel definitions, numeric
literals, multiple parameter lists, default values for
parameters, named arguments, and more<br>
</li>
</ul>
<h3>Features compared with examples</h3>
<p>Given that introduction, the following sections provide
side-by-side comparisons of Java and Scala programming language
features.</p>
<h2>OOP style classes and methods</h2>
<p>This section provides comparisons of features related to
OOP-style classes and methods.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Comments<br>
(the same in Java and Scala)<br>
<br>
</td>
<td valign="top">//<br>
/* ... */<br>
/** ... */</td>
<td valign="top">//<br>
/* ... */<br>
/** ... */</td>
</tr>
<tr>
<td valign="top">OOP style class,<br>
primary constructor<br>
</td>
<td valign="top">class Person {<br>
&nbsp; private String firstName;<br>
&nbsp; private String lastName;<br>
&nbsp; private int age;<br>
&nbsp; public Person(String firstName, String lastName, int
age) {<br>
&nbsp;&nbsp;&nbsp; this.firstName = firstName;<br>
&nbsp;&nbsp;&nbsp; this.lastName = lastName;<br>
&nbsp;&nbsp;&nbsp; this.age = age;<br>
&nbsp; }<br>
&nbsp; override String toString() {<br>
&nbsp;&nbsp;&nbsp; return String.format("%s %s is %d years
old.", firstName, lastName, age);<br>
&nbsp; }<br>
}</td>
<td valign="top">class Person (<br>
&nbsp; var firstName: String, <br>
&nbsp; var lastName: String,<br>
&nbsp; var age: Int<br>
):&nbsp;&nbsp; <br>
&nbsp;&nbsp;&nbsp; override def toString = s"$firstName
$lastName is $age years old."<br>
<br>
</td>
</tr>
<tr>
<td valign="top">Auxiliary constructors<br>
</td>
<td valign="top">public class Person {<br>
&nbsp; private String firstName;<br>
&nbsp; private String lastName;<br>
&nbsp; private int age;<br>
<br>
&nbsp; // primary constructor<br>
&nbsp; public Person(String firstName, String lastName, int
age) {<br>
&nbsp;&nbsp;&nbsp; this.firstName = firstName;<br>
&nbsp;&nbsp;&nbsp; this.lastName = lastName;<br>
&nbsp;&nbsp;&nbsp; this.age = age;<br>
&nbsp; }<br>
<br>
&nbsp; // zero-arg constructor<br>
&nbsp; public Person(String firstName, String lastName, int
age) {<br>
&nbsp;&nbsp;&nbsp; this("", "", 0);<br>
&nbsp; }<br>
<br>
&nbsp; // one-arg constructor<br>
&nbsp; public Person(String firstName) {<br>
&nbsp;&nbsp;&nbsp; this(firstName, "", 0);<br>
&nbsp; }<br>
<br>
&nbsp; // two-arg constructor<br>
&nbsp; public Person(String firstName, String lastName) {<br>
&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0);<br>
&nbsp; }<br>
<br>
}<br>
</td>
<td valign="top">class Person (<br>
&nbsp; var firstName: String, <br>
&nbsp; var lastName: String,<br>
&nbsp; var age: Int<br>
):<br>
&nbsp;&nbsp;&nbsp; // zero-arg auxiliary constructor<br>
&nbsp;&nbsp;&nbsp; def this() = this("", "", 0)<br>
<br>
&nbsp;&nbsp;&nbsp; // one-arg auxiliary constructor<br>
&nbsp;&nbsp;&nbsp; def this(firstName: String) =
this(firstName, "", 0)<br>
<br>
&nbsp;&nbsp;&nbsp; // two-arg auxiliary constructor<br>
&nbsp;&nbsp;&nbsp; def this(firstName: String, lastName:
String) = <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this(firstName, lastName, 0)<br>
<br>
end Person<br>
</td>
</tr>
<tr>
<td valign="top">Classes closed by default (“Plan for
inheritance or else forbid it”)<br>
</td>
<td valign="top"><code>final class Person</code><br>
</td>
<td valign="top"><code>class Person</code><br>
</td>
</tr>
<tr>
<td valign="top">Create a class that’s open for extension<br>
</td>
<td valign="top"><code>class Person</code><br>
</td>
<td valign="top"><code>open class Person</code><br>
</td>
</tr>
<tr>
<td valign="top">Method, one line<br>
</td>
<td valign="top">public int add(int a, int b) {<br>
&nbsp; return a + b;<br>
}<br>
</td>
<td valign="top"><code>def add(a: Int, b: Int): Int = a + b</code><br>
</td>
</tr>
<tr>
<td valign="top">Method, multiple lines<br>
</td>
<td valign="top">public void walkThenRun() {<br>
&nbsp; System.out.println("walk");<br>
&nbsp; System.out.println("run");<br>
}<br>
</td>
<td valign="top">def walkThenRun() =<br>
&nbsp; println("walk")<br>
&nbsp; println("run")<br>
</td>
</tr>
<tr>
<td valign="top">Immutable field<br>
</td>
<td valign="top"><code>final int i = 1;</code><br>
</td>
<td valign="top"><code>val i = 1</code><br>
</td>
</tr>
<tr>
<td valign="top">Mutable field<br>
</td>
<td valign="top">int i = 1;<br>
var i = 1;<br>
</td>
<td valign="top"><code>var i = 1</code><br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Interfaces, traits, and inheritance</h2>
<p>This section compares Java interfaces to Scala traits, including
how classes extend interfaces and traits.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Interfaces/Traits<br>
</td>
<td valign="top"><code>public interface Marker;</code><br>
</td>
<td valign="top"><code>trait Marker</code><br>
</td>
</tr>
<tr>
<td valign="top">Simple interface<br>
</td>
<td valign="top">public interface Adder {<br>
&nbsp; public int add(int a, int b);<br>
}<br>
</td>
<td valign="top">trait Adder:<br>
&nbsp; def add(a: Int, b: Int): Int<br>
</td>
</tr>
<tr>
<td valign="top">Interface with a concrete method<br>
</td>
<td valign="top">public interface Adder {<br>
&nbsp; int add(int a, int b);<br>
&nbsp; default int multiply(int a, int b) {<br>
&nbsp;&nbsp;&nbsp; return a * b;<br>
&nbsp; }<br>
}</td>
<td valign="top">trait Adder:<br>
&nbsp; def add(a: Int, b: Int): Int<br>
&nbsp; def multiply(a: Int, b: Int): Int = a * b<br>
</td>
</tr>
<tr>
<td valign="top">Inheritance<br>
</td>
<td valign="top"><code>class Dog extends
Animal,HasLegs,HasTail</code> </td>
<td valign="top"><code>class Dog extends
Animal,HasLegs,HasTail</code><br>
</td>
</tr>
<tr>
<td valign="top">Extending multiple interfaces/traits<br>
that have implemented methods<br>
(default methods)<br>
</td>
<td valign="top">interface Adder {<br>
&nbsp; default int add(int a, int b) {<br>
&nbsp;&nbsp;&nbsp; return a + b;<br>
&nbsp; }<br>
}<br>
interface Multiplier {<br>
&nbsp; default int multiply(int a, int b) {<br>
&nbsp;&nbsp;&nbsp; return a * b;<br>
&nbsp; }<br>
}<br>
public class JavaMath implements Adder, Multiplier {}<br>
<br>
JavaMath jm = new JavaMath();<br>
jm.add(1,1);<br>
jm.multiply(2,2);<br>
</td>
<td valign="top">trait Adder:<br>
&nbsp; def add(a: Int, b: Int) = a + b<br>
<br>
trait Multiplier:<br>
&nbsp; def multiply(a: Int, b: Int) = a * b<br>
<br>
class ScalaMath extends Adder, Multiplier<br>
<br>
val sm = new ScalaMath<br>
sm.add(1,1)<br>
sm.multiply(2,2)<br>
</td>
</tr>
<tr>
<td valign="top">Mixin<br>
</td>
<td valign="top">N/A<br>
</td>
<td valign="top">class DavidBanner<br>
trait Angry:<br>
&nbsp; def beAngry() = println("You won’t like me ...")<br>
trait Big:<br>
&nbsp; println("I’m big")<br>
trait Green:<br>
&nbsp; println("I’m green")<br>
<br>
// mix in the traits as DavidBanner is created<br>
val hulk = new DavidBanner with Big with Angry with Green<br>
</td>
</tr>
</tbody>
</table>
<p> </p>
<p><br>
</p>
<h2>Control structures</h2>
<p> </p>
<p>This section compares control structures in Java and Scala.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top"><code>if</code> statement,<br>
one line<br>
</td>
<td valign="top"><code>if (x == 1) { System.out.println(1); }</code><br>
</td>
<td valign="top"><code>if x == 1 then println(x)</code><br>
</td>
</tr>
<tr>
<td valign="top"><code>if</code> statement,<br>
multiline<br>
</td>
<td valign="top">if (x == 1) {<br>
&nbsp; System.out.println("x is 1, as you can see:")<br>
&nbsp; System.out.println(x)<br>
} </td>
<td valign="top">if x == 1 then<br>
&nbsp; println("x is 1, as you can see:")<br>
&nbsp; println(x)<br>
</td>
</tr>
<tr>
<td valign="top">if/else if/else<br>
</td>
<td valign="top">if (x &lt; 0) {<br>
&nbsp; System.out.println("negative")<br>
} else if (x == 0) {<br>
&nbsp; System.out.println("zero")<br>
} else {<br>
&nbsp; System.out.println("positive")<br>
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
<td valign="top"><code>if</code> as method body<br>
</td>
<td valign="top">public int min(int a, int b) {<br>
&nbsp; return (a &lt; b) ? a : b;<br>
}<br>
</td>
<td valign="top">def min(a: Int, b: Int): Int =<br>
&nbsp; if a &lt; b then a else b<br>
</td>
</tr>
<tr>
<td valign="top">Returning a value from <code>if</code><br>
</td>
<td valign="top"><code>int minVal = (a &lt; b) ? a : b;</code></td>
<td valign="top"><code>val minValue = if a &lt; b then a else
b</code><br>
</td>
</tr>
<tr>
<td valign="top"><code>while</code><br>
</td>
<td valign="top">while (i &lt; 3) {<br>
&nbsp; System.out.println(i);<br>
&nbsp; i++;<br>
}<br>
</td>
<td valign="top">while i &lt; 3 do<br>
&nbsp; println(i)<br>
&nbsp; i += 1<br>
</td>
</tr>
<tr>
<td valign="top"><code>for</code> loop,<br>
single line<br>
</td>
<td valign="top">for (int i: ints) {<br>
&nbsp; System.out.println(i);<br>
}<br>
</td>
<td valign="top">for i &lt;- ints do println(i)&nbsp;&nbsp; //
preferred<br>
for (i &lt;- ints) println(i)&nbsp;&nbsp; // also available<br>
</td>
</tr>
<tr>
<td valign="top"><code>for</code> loop,<br>
multiple lines</td>
<td valign="top">for (int i: ints) {<br>
&nbsp; int x = i * 2;<br>
&nbsp; System.out.println(x);<br>
}</td>
<td valign="top">for<br>
&nbsp; i &lt;- ints<br>
do<br>
&nbsp; val x = i * 2<br>
&nbsp; println(s"i = $i, x = $x")<br>
</td>
</tr>
<tr>
<td valign="top">Multiple generators<br>
</td>
<td valign="top">for (int i: ints1) {<br>
&nbsp; for (int j: chars) {<br>
&nbsp;&nbsp;&nbsp; for (int k: ints2) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; System.out.printf("i = %d, j
= %d, k = %d\n", i,j,k);<br>
&nbsp;&nbsp;&nbsp; }<br>
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
<td valign="top">Generator with guards (<code>if</code>
expressions)<br>
</td>
<td valign="top">List ints = ArrayList(1,2,3,4,5,6,7,8,9,10);<br>
for (int i: ints) {<br>
&nbsp; if (i % 2 == 0 &amp;&amp; i &lt; 5) {<br>
&nbsp;&nbsp;&nbsp; System.out.println(x);<br>
&nbsp; }<br>
}</td>
<td valign="top">for<br>
&nbsp; i &lt;- 1 to 10<br>
&nbsp; if i % 2 == 0<br>
&nbsp; if i &lt; 5<br>
do<br>
&nbsp; println(i)<br>
</td>
</tr>
<tr>
<td valign="top"><code>for</code> comprehension<br>
</td>
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
<tr>
<td valign="top"><code>switch</code>/<code>match</code><br>
</td>
<td valign="top">String monthAsString = "";<br>
switch(day) {<br>
&nbsp; case 1: monthAsString = "January";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
break;<br>
&nbsp; case 2: monthAsString = "February";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
break;<br>
&nbsp; default: monthAsString = "Other";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
break;<br>
}<br>
</td>
<td valign="top">val monthAsString = day match {<br>
&nbsp; case 1 =&gt; "January"<br>
&nbsp; case 2 =&gt; "February"<br>
&nbsp; _ =&gt; "Other"<br>
}<br>
</td>
</tr>
<tr>
<td valign="top"><code>switch</code>/<code>match</code>:
handling<br>
multiple conditions<br>
per <code>case</code><br>
</td>
<td valign="top">String numAsString = "";<br>
switch (i) {<br>
&nbsp; case 1: case 3:<br>
&nbsp; case 5: case 7: case 9: <br>
&nbsp;&nbsp;&nbsp; numAsString = "odd";<br>
&nbsp;&nbsp;&nbsp; break;<br>
&nbsp; case 2: case 4:<br>
&nbsp; case 6: case 8: case 10: <br>
&nbsp;&nbsp;&nbsp; numAsString = "even";<br>
&nbsp;&nbsp;&nbsp; break;<br>
&nbsp; default:<br>
&nbsp;&nbsp;&nbsp; numAsString = "too big";<br>
&nbsp;&nbsp;&nbsp; break;<br>
}<br>
</td>
<td valign="top">val numAsString = i match {<br>
&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; println("odd")<br>
&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; println("even")<br>
&nbsp; case _ =&gt; println("too big")<br>
}<br>
</td>
</tr>
<tr>
<td valign="top"><code>try</code>/<code>catch</code>/<code>finally</code><br>
</td>
<td valign="top">try {<br>
&nbsp; writeTextToFile(text);<br>
} catch (IOException ioe) {<br>
&nbsp; println("Got an IOException.")<br>
} catch (NumberFormatException nfe) {<br>
&nbsp; println("Got an NumberFormatException.")<br>
} finally {<br>
&nbsp; println("Clean up your resources here.")<br>
}<br>
</td>
<td valign="top">try<br>
&nbsp; writeTextToFile(text)<br>
catch<br>
&nbsp; case ioe: IOException =&gt; println("Got an
IOException.")<br>
&nbsp; case nfe: NumberFormatException =&gt; println("Got a
NumberFormatException.")<br>
finally<br>
&nbsp; println("Clean up your resources here.")<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Collections classes</h2>
<p>This section compares the collections classes that are available
in Java and Scala.</p>
<h3>Immutable collections classes</h3>
<p>Examples of how to create instances of immutable collections:<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Sequences<br>
</td>
<td valign="top"><code>List strings = List.of("a", "b", "c");</code><br>
</td>
<td valign="top">val strings = List("a", "b", "c")<br>
val strings = Vector("a", "b", "c")<br>
</td>
</tr>
<tr>
<td valign="top">Set<br>
</td>
<td valign="top"><code>Set set = Set.of("a", "b", "c");</code>
</td>
<td valign="top"><code>val set = Set("a", "b", "c")</code><br>
</td>
</tr>
<tr>
<td valign="top">Map<br>
</td>
<td valign="top"><code>Map map = Map.of("a", 1, "b", 2, "c",
3);</code> </td>
<td valign="top"><code>val map = Map("a" -&gt; 1, "b" -&gt; 2,
"c" -&gt; 3)</code><br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h3>Mutable collections classes</h3>
<p>The table below shows which Java collections classes can be
converted to Scala collections classes with the Scala <code>CollectionConverters</code>
objects. There are two objects in different packages, one for
converting from Java to Scala, and another for converting from
Scala to Java. Here are the conversions:<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">java.util.Collection<br>
</td>
<td valign="top">scala.collection.Iterable</td>
</tr>
<tr>
<td valign="top">java.util.List<br>
</td>
<td valign="top">scala.collection.mutable.Buffer</td>
</tr>
<tr>
<td valign="top">java.util.Set<br>
</td>
<td valign="top">scala.collection.mutable.Set<br>
</td>
</tr>
<tr>
<td valign="top">java.util.Map<br>
</td>
<td valign="top">scala.collection.mutable.Map<br>
</td>
</tr>
<tr>
<td valign="top">java.util.concurrent.ConcurrentMap
<meta http-equiv="content-type" content="text/html;
charset=UTF-8">
</td>
<td valign="top">scala.collection.mutable.ConcurrentMap<br>
</td>
</tr>
<tr>
<td valign="top">java.util.Dictionary<br>
</td>
<td valign="top">scala.collection.mutable.Map</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Methods on collections classes</h2>
<p>With the ability to treat Java collections as streams, Java and
Scala now have many of the same common functional methods
available to them:</p>
<ul>
<li><code>map</code></li>
<li><code>filter</code></li>
<li><code>forEach</code>/<code>foreach</code></li>
<li><code>findFirst</code>/<code>find</code></li>
<li><code>reduce</code><br>
</li>
</ul>
<p>If you’re used to using these methods with lambda expressions in
Java, you’ll find it easy to use the same methods on Scala’s
collection classes.<br>
</p>
<h2>Tuples<br>
</h2>
<p>Java tuples are created like this:<br>
</p>
<pre>Pair&lt;String, Integer&gt; pair = new Pair&lt;String, Integer&gt;("Eleven", 11);<br>Triplet&lt;String, Integer, Double&gt; triplet = Triplet.with("Eleven", 11, 11.0);<br>Quartet&lt;String, Integer, Double,Person&gt; triplet = Triplet.with("Eleven", 11, 11.0, new Person("Eleven"));</pre>
<p>Other Java tuple names are Quintet, Sextet, Septet, Octet,
Ennead, Decade.</p>
<p>Tuples in Scala are created by putting the values inside
parentheses, like this:<br>
</p>
<pre>val a = ("eleven")<br>val b = ("eleven", 11)<br>val c = ("eleven", 11, 11.0)<br>val d = ("eleven", 11, 11.0, Person("Eleven"))</pre>
<p><br>
</p>
<h2>Enums</h2>
<p>This section compares enums (enumerations) in Java and Scala.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Java<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Basic enum<br>
</td>
<td valign="top">enum Color {<br>
&nbsp; RED, GREEN, BLUE<br>
}<br>
</td>
<td valign="top">enum Color:<br>
&nbsp; case Red, Green, Blue<br>
</td>
</tr>
<tr>
<td valign="top">Parameterized enum<br>
</td>
<td valign="top">enum Color {<br>
&nbsp; Red(0xFF0000),<br>
&nbsp; Green(0x00FF00),<br>
&nbsp; Blue(0x0000FF);<br>
<br>
&nbsp; private int rgb;<br>
<br>
&nbsp; Color(int rgb) {<br>
&nbsp;&nbsp;&nbsp; this.rgb = rgb;<br>
&nbsp; }<br>
}<br>
</td>
<td valign="top">enum Color(val rgb: Int):<br>
&nbsp; case Red&nbsp;&nbsp; extends Color(0xFF0000)<br>
&nbsp; case Green extends Color(0x00FF00)<br>
&nbsp; case Blue&nbsp; extends Color(0x0000FF)<br>
</td>
</tr>
<tr>
<td valign="top">User-defined enum members<br>
</td>
<td valign="top">enum Planet {<br>
&nbsp; MERCURY (3.303e+23, 2.4397e6),<br>
&nbsp; VENUS&nbsp;&nbsp; (4.869e+24, 6.0518e6),<br>
&nbsp; EARTH&nbsp;&nbsp; (5.976e+24, 6.37814e6);<br>
&nbsp; // more planets ...<br>
<br>
&nbsp; private final double mass;<br>
&nbsp; private final double radius;<br>
<br>
&nbsp; Planet(double mass, double radius) {<br>
&nbsp;&nbsp;&nbsp; this.mass = mass;<br>
&nbsp;&nbsp;&nbsp; this.radius = radius;<br>
&nbsp; }<br>
<br>
&nbsp; public static final double G = 6.67300E-11;<br>
<br>
&nbsp; private double mass() { return mass; }<br>
&nbsp; private double radius() { return radius; }<br>
<br>
&nbsp; double surfaceGravity() {<br>
&nbsp;&nbsp;&nbsp; return G * mass / (radius * radius);<br>
&nbsp; }<br>
&nbsp; double surfaceWeight(double otherMass) {<br>
&nbsp;&nbsp;&nbsp; return otherMass * surfaceGravity();<br>
&nbsp; }<br>
<br>
}<br>
<br>
</td>
<td valign="top">enum Planet(mass: Double, radius: Double):<br>
&nbsp; case Mercury extends Planet(3.303e+23, 2.4397e6)<br>
&nbsp; case Venus&nbsp;&nbsp; extends Planet(4.869e+24,
6.0518e6)<br>
&nbsp; case Earth&nbsp;&nbsp; extends Planet(5.976e+24,
6.37814e6)<br>
&nbsp; // more planets ...<br>
<br>
&nbsp; private final val G = 6.67300E-11<br>
&nbsp; def surfaceGravity = G * mass / (radius * radius)<br>
&nbsp; def surfaceWeight(otherMass: Double) =&nbsp;
otherMass * surfaceGravity<br>
<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Exceptions and error handling</h2>
<h3>Java uses checked exceptions</h3>
<p>Java uses checked exceptions, so in Java code you’ll see <code>try</code>/<code>catch</code>/<code>finally</code>
blocks, and <code>throws</code> clauses on methods:</p>
<pre>public int makeInt(String s) throws NumberFormatException {<br>&nbsp; // code here to convert a String to an int<br>}<br></pre>
<h3>Scala does not use checked exceptions<br>
</h3>
<p>The Scala idiom is to <i>not</i> use checked exceptions like
this. When working with code that can throw exceptions, you can
use <code>try</code>/<code>catch</code>/<code>finally</code>
blocks to catch exceptions from code that throws them, but how you
proceed from there is different.</p>
<p>The best way to explain this is that Scala code consists of <i>expressions</i>,
which return values. As a result, you end up writing your code as
a series of algebraic expressions: </p>
<pre>val a = f(x)<br>val b = g(a,z)<br>val c = h(b,y)</pre>
<p>This is nice, it’s just algebra, and a combination of equations.
As you may remember from high school algebra, algebraic
expressions don’t short circuit — they don’t throw exceptions that
blow up the series of equations.</p>
<p>Therefore, in Scala our methods don’t throw exceptions. Instead,
they return types like <code>Option</code>. For example, this <code>makeInt</code>
method catches a possible exception and returns an <code>Option</code>
value:<br>
</p>
<pre class="brush: scala">def makeInt(s: String): Option[Int] =
try
  Some(s.toInt)
catch
  case e: NumberFormatException =&gt; None
</pre>
<p>The Scala <code>Option</code> is similar to the Java <code>Optional</code>
class. As shown, if the string-to-int conversion succeeds, the <code>Int</code>
is returned inside a <code>Some</code> value, and if it fails, a
<code>None</code> value is returned. <code>Some</code> and <code>None</code>
are subtypes of <code>Option</code>, so the method is declared to
return the <code>Option[Int]</code> type.</p>
<p>When you have an <code>Option</code> value, such as the one
returned by <code>makeInt</code>, there are many ways to work
with it, depending on your needs. This code shows one possible
approach:<br>
</p>
<pre>makeInt(aString) match<br>&nbsp; case Some(i) =&gt; println(s"i = $i")<br>&nbsp; case None =&gt; println(s"Could not convert $aString to an Int.")<br></pre>
<p><code>Option</code> is commonly used in Scala, and it’s built
into many classes in the standard library.<br>
</p>
<p>For more information on dealing with errors and exceptions in
Scala, see the Functional Error Handling section in the Reference
documentation.</p>
<h2>Concepts that are unique to Scala<br>
</h2>
<p>There are other concepts in Scala which currently have no equal
in Java 11:</p>
<ul>
<li>Everything related to contextual abstractions</li>
<li>Method features:</li>
<ul>
<li>Multiple parameter lists</li>
<li>Default parameter values</li>
<li>Using named arguments when calling methods<br>
</li>
</ul>
<li>Case classes (like “records” in Java 14) and case objects</li>
<li>Companion classes and objects</li>
<li>The ability to create your own control structures and DSLs</li>
<li>Toplevel definitions</li>
<li>Pattern matching</li>
<li>Advanced features of <code>match</code> expressions</li>
<li>Type lambdas</li>
<li>Trait parameters</li>
<li>Opaque type aliases</li>
<li>Multiversal equality</li>
<li>Type classes</li>
<li>Infix methods</li>
<li>Macros and metaprogramming</li>
<li>More ...<br>
</li>
</ul>


