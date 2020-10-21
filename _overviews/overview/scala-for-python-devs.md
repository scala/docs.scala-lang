---
title: Scala for Python Developers
description: This page is for Python developers who are interested in learning about Scala 3.
---

<p><u>Notes to reviewers:</u></p>
<ol>
<li>This page will eventually link to many other pages. So if you
wonder why I don’t explain certain things in more detail, it’s
because (a) I’m trying to keep this page short, and (b) I assume
this page will eventually link to dozens of other pages for more
details.</li>
<li>I’m initially submitting this page as HTML because it’s much
easier to work on these side-by-side source code examples with a
Wysiwyg editor (I’m using SeaMonkey). I’ll convert it to
Markdown when we’re confident with the content in those tables.
If at all possible, I think the side-by-side code examples are
the best approach. </li>
<li>I haven’t formatted the multiline source code examples inside
table cells because I think it will be easier to convert them to
Markdown if I don’t do that now. (My initial conversion tests
with Pandoc showed that the conversion will be smoother by not
using <code>&lt;code&gt;</code> tags on those multiline
examples.) </li>
</ol>
<hr width="100%" size="2">
<p><br>
</p>
<p>This section provides a comparison between the Python and Scala
programming languages. It’s intended for programmers who know
Python and want to learn about Scala, specifically by seeing how
Python language features compare to Scala.</p>
<h2>Introduction<br>
</h2>
<p>This section provides a summary of the similarities and
differences between Python and Scala. The two languages are first
compared at a high level, and then at an everyday programming
level.</p>
<h3>High level similarities<br>
</h3>
<p>At a high level, Scala shares these <i>similarities</i> with
Python:<br>
</p>
<ul>
<li>Both are high-level programming languages, where you don’t
have to concern yourself with low-level concepts like pointers
and manual memory management</li>
<li>Both have a relatively simple, concise syntax<br>
</li>
<li>Both are object-oriented programming (OOP) languages</li>
<li>Both have comprehensions: Python has list comprehensions and
Scala has <code>for</code> comprehensions</li>
<li>Both languages have support for lambdas and higher-order
functions</li>
<li>Both can be used with Apache Spark for big data processing</li>
<li>Both have a wealth of terrific libraries</li>
</ul>
<h3>High level differences<br>
</h3>
<p>Also at a high level, the <i>differences</i> between Python and
Scala are:<br>
</p>
<ul>
<li>Python is dynamically typed, and Scala is statically typed<br>
</li>
<ul>
<li>Though it’s statically typed, type inference makes Scala
feel like a dynamic language</li>
</ul>
<li>In addition to being an OOP language, Scala is also a pure FP
language </li>
<li>Python is interpreted, and Scala code is compiled to <i>.class</i>
files, and runs on the Java Virtual Machine (JVM)</li>
<li>In addition to running on the JVM, the <a
href="https://www.scala-js.org">Scala.js</a> project lets you
use Scala as a JavaScript replacement</li>
<li>The <a
href="https://scala-native.readthedocs.io/en/v0.3.9-docs">Scala
Native</a> project adds low-level constructs to let you write
“systems” level code, and compiles to native executables</li>
<li>Everything in Scala is an <i>expression</i>: constructs like
<code>if</code> statements, <code>for</code> loops, <code>match</code>
expressions, and even <code>try</code>/<code>catch</code>
expressions all have return values<br>
</li>
<li>Scala idioms favor immutability by default: you’re encouraged
to use immutable variables and immutable collections</li>
<li>Scala has excellent support for concurrent and parallel
programming<br>
</li>
</ul>
<h3>Programming level similarities</h3>
<p>This section looks at the similarities you’ll see between Python
and Scala when you write code on an every day basis:<br>
</p>
<ul>
<li>Scala’s type inference often makes it feel like a dynamically
typed language<br>
</li>
<li>Neither language uses semi-colons to end expressions<br>
</li>
<li>Both languages support the use of significant indentation
rather than braces and parentheses</li>
<li>The syntax for defining methods is similar</li>
<li>Both have lists, dictionaries (maps), sets, and tuples</li>
<li>Both have comprehensions for mapping and filtering</li>
<li>Both have higher-order functions and strong support for
lambdas</li>
</ul>
<h3>Programming level differences</h3>
<p>Also at a programming level, these are some of the differences
you’ll see every day when writing code:<br>
</p>
<ul>
<li>Scala’s syntax is extremely consistent</li>
<ul>
<li>Lists, maps, sets, and tuples are all created and accessed
similarly; they have most of the same higher-order functions;
<code>val</code> and <code>var</code> fields are used
consistently
when defining fields and parameters; pattern matching is used
consistently; more<br>
</li>
</ul>
<li>Scala variables and parameters are defined with the <code>val</code>
(immutable) or <code>var</code> (mutable) keywords<br>
</li>
<li>Scala idioms prefer immutable data structures<br>
</li>
<li>Scala has terrific IDE support</li>
<li>Comments: Python uses <code>#</code>, Scala uses the C, C++,
and
Java style: <code>//</code>, <code>/*...*/</code>, and <code>/**...*/</code><br>
</li>
<li>Naming conventions: Python is <code>my_list</code>, Scala is
<code>myList</code><br>
</li>
<li>Scala is statically typed, so you declare types for method
parameters, method return values, and in other places<br>
</li>
<li>Pattern matching and <code>match</code> expressions are used
extensively in Scala, and will change the way you write code</li>
<li><i>Toplevel definitions</i> let you put method, field, and
other definitions anywhere, also leading to concise, expressive
code<br>
</li>
<li>Traits are used heavily in Scala; interfaces and abstract
classes are used less often in Python<br>
</li>
<li>Scala’s <i>contextual abstractions</i> and <i>term inference</i>
provide a collection of different features:<br>
</li>
<ul>
<li><i>Extension methods</i> let you add new functionality to
closed classes</li>
<li><i>Given</i> instances let you define terms that the
compiler can synthesize at <i>using</i> points, making your
code less verbose and essentially letting the compiler write
code for you<br>
</li>
<li><i>Multiversal equality</i> lets you limit equality
comparisons — at compile time — to only those comparisons that
make sense<br>
</li>
</ul>
<li>Scala has state-of-the-art open source functional programming
libraries</li>
<li>You can create your own “control structures” and DSLs, thanks
to features like objects, by-name parameters, infix notation,
optional parentheses, extension methods, higher-order functions,
and more<br>
</li>
<li>Many other goodies: case classes, companion classes and
objects, macros, union and intersection types, toplevel
definitions, numeric literals, multiple parameter lists,
and more</li>
</ul>
<p>TODO: mention compiling code; mention performance?</p>
<p><br>
</p>
<ul>
</ul>
<h3>Features compared with examples</h3>
<p>Given that introduction, the following sections provide
side-by-side comparisons of Python and Scala programming language
features.</p>
<p><br>
</p>
<h2>Comments</h2>
<p>The Scala comments syntax is the same as languages like C, C++,
and Java:</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Comments<br>
</td>
<td valign="top">#<br>
</td>
<td valign="top">//<br>
/* ... */<br>
/** ... */</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Variable assignment<br>
</h2>
<p>These examples demonstrate how to create variables in Python and
Scala:</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Integer,<br>
String<br>
</td>
<td valign="top">x = 1<br>
x = "Hi"<br>
</td>
<td valign="top">val x = 1<br>
val x = "Hi"<br>
</td>
</tr>
<tr>
<td valign="top">List<br>
</td>
<td valign="top">x = [1,2,3]<br>
</td>
<td valign="top">val x = List(1,2,3)<br>
</td>
</tr>
<tr>
<td valign="top">Dictionary/Map<br>
</td>
<td valign="top">x = {<br>
&nbsp; "Toy Story": 8.3,<br>
&nbsp; "Forrest Gump": 8.8,<br>
&nbsp; "Cloud Atlas": 7.4<br>
}<br>
</td>
<td valign="top">val movies = Map(<br>
&nbsp; "Toy Story" -&gt; 8.3,<br>
&nbsp; "Forrest Gump" -&gt; 8.8,<br>
&nbsp; "Cloud Atlas" -&gt; 7.4<br>
)<br>
</td>
</tr>
<tr>
<td valign="top">Set<br>
</td>
<td valign="top">x = {1,2,3}<br>
</td>
<td valign="top">val x = Set(1,2,3)<br>
</td>
</tr>
<tr>
<td valign="top">Tuple<br>
</td>
<td valign="top">x = (11, "Eleven")</td>
<td valign="top">val x = (11, "Eleven")</td>
</tr>
</tbody>
</table>
<p>If a Scala field is going to be mutable, you should use var
instead of val for variable assignment:</p>
<pre>var x = 1<br>x += 1</pre>
<p>However, the rule of them is to always use <code>val</code>
unless
the variable specifically needs to be mutated.<br>
</p>
<p><br>
</p>
<h2>OOP style classes and methods</h2>
<p>This section provides comparisons of features related to
OOP-style classes and methods.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">OOP style class,<br>
primary constructor<br>
</td>
<td valign="top">class Person(object):<br>
&nbsp; def __init__(self, name):<br>
&nbsp;&nbsp;&nbsp; self.name = name<br>
<br>
&nbsp; def speak(self):<br>
&nbsp;&nbsp;&nbsp; print('Hello, my name is %s' % self.name)<br>
</td>
<td valign="top">class Person (var name: String):<br>
&nbsp; def speak() = println(s"Hello, my name is $name")<br>
</td>
</tr>
<tr>
<td valign="top">Create and use an instance<br>
</td>
<td valign="top">p = Person("John")<br>
p.name&nbsp;&nbsp; # John<br>
p.name = 'Fred'<br>
p.name&nbsp;&nbsp; # Fred<br>
p.speak()<br>
</td>
<td valign="top">val p = Person("John")<br>
p.name&nbsp;&nbsp; // John<br>
p.name = "Fred"<br>
p.name&nbsp;&nbsp; // Fred<br>
p.speak()<br>
</td>
</tr>
<tr>
<td valign="top">Method, one line<br>
</td>
<td valign="top">def add(a,b) = a + b<br>
</td>
<td valign="top"><code>def add(a: Int, b: Int): Int = a + b</code><br>
</td>
</tr>
<tr>
<td valign="top">Method, multiple lines<br>
</td>
<td valign="top">def walkThenRun():<br>
&nbsp;&nbsp;&nbsp; print('walk')<br>
&nbsp;&nbsp;&nbsp; print('run')<br>
</td>
<td valign="top">def walkThenRun() =<br>
&nbsp; println("walk")<br>
&nbsp; println("run")<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Interfaces, traits, and inheritance</h2>
<p>If you’re familiar with Java 8 and newer, Scala traits are
similar to those Java interfaces. Traits are used all the time in
Scala, while Python interfaces and abstract classes are used much
less often. Therefore, rather than attempt to compare the two side
by side, this example shows how to use Scala traits to build a
small solution to a simulated math problem.</p>
<pre>trait Adder:<br>&nbsp; def add(a: Int, b: Int) = a + b<br>
trait Multiplier:
&nbsp; def multiply(a: Int, b: Int) = a * b<br><br>// create a class from the traits
class SimpleMath extends Adder, Multiplier<br>val sm = new SimpleMath<br>sm.add(1,1) // 2<br>sm.multiply(2,2) // 4</pre>
<p>There are many other ways to use traits with classes and objects,
but this gives you a little idea of how they can be used to
organize concepts into logical groups of behavior, and then merge
them as needed to create a complete solution.<br>
</p>
<br>
<h2>Control structures</h2>
<p> </p>
<p>This section compares control structures in Python and Scala.
Both languages have constructs like <code>if</code>/<code>else</code>,
<code>while</code>,
<code>for</code> loops, and <code>try</code>. Scala also has <code>match</code>
expressions.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top"><code>if</code> statement,<br>
one line<br>
</td>
<td valign="top"><code>if x == 1: print(x)</code><br>
</td>
<td valign="top"><code>if x == 1 then println(x)</code><br>
</td>
</tr>
<tr>
<td valign="top"><code>if</code> statement,<br>
multiline<br>
</td>
<td valign="top">if x == 1:<br>
&nbsp;&nbsp;&nbsp; print("x is 1, as you can see:")<br>
&nbsp;&nbsp;&nbsp; print(x)<br>
</td>
<td valign="top">if x == 1 then<br>
&nbsp; println("x is 1, as you can see:")<br>
&nbsp; println(x)<br>
</td>
</tr>
<tr>
<td valign="top">if/else-if/else<br>
</td>
<td valign="top">if x &lt; 0:<br>
&nbsp;&nbsp;&nbsp; print("negative")<br>
elif x == 0:<br>
&nbsp;&nbsp;&nbsp; print("zero")<br>
else:<br>
&nbsp;&nbsp;&nbsp; print("positive")<br>
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
<td valign="top">Returning a value from <code>if</code></td>
<td valign="top"><code>min_val = a if a &lt; b else b</code></td>
<td valign="top"><code>val minValue = if a &lt; b then a else
b</code></td>
</tr>
<tr>
<td valign="top"><code>if</code> as the body of a method<br>
</td>
<td valign="top">def min(a, b):<br>
&nbsp;&nbsp;&nbsp; return a if a &lt; b else b<br>
</td>
<td valign="top">def min(a: Int, b: Int): Int =<br>
&nbsp; if a &lt; b then a else b<br>
</td>
</tr>
<tr>
<td valign="top"><code>while</code><br>
</td>
<td valign="top">i = 1<br>
while i &lt; 3:<br>
&nbsp;&nbsp;&nbsp; print(i)<br>
&nbsp;&nbsp;&nbsp; i += 1<br>
</td>
<td valign="top">var i = 1<br>
while i &lt; 3 do<br>
&nbsp; println(i)<br>
&nbsp; i += 1<br>
</td>
</tr>
<tr>
<td valign="top">for loop with range<br>
</td>
<td valign="top">for i in range(0,3):<br>
&nbsp;&nbsp;&nbsp; print(i)<br>
</td>
<td valign="top">// preferred<br>
for i &lt;- 0 until 3 do println(i)<br>
<br>
// also available<br>
for (i &lt;- 0 until 3) println(i)<br>
<br>
// multiline syntax<br>
for<br>
&nbsp; i &lt;- 0 until 3<br>
do<br>
&nbsp; println(i)</td>
</tr>
<tr>
<td valign="top">for loop with a list<br>
</td>
<td valign="top">for i in ints: print(i)<br>
<br>
for i in ints:<br>
&nbsp;&nbsp;&nbsp; print(i)<br>
</td>
<td valign="top">for i &lt;- ints do println(i)&nbsp;&nbsp; //
preferred<br>
<br>
for (i &lt;- ints) println(i)&nbsp;&nbsp; // also available</td>
</tr>
<tr>
<td valign="top"><code>for</code> loop,<br>
multiple lines</td>
<td valign="top">for i in ints:<br>
&nbsp;&nbsp;&nbsp; x = i * 2<br>
&nbsp;&nbsp;&nbsp; s = "i = {}, x = {}"<br>
&nbsp;&nbsp;&nbsp; print(s.format(i,x))</td>
<td valign="top">for<br>
&nbsp; i &lt;- ints<br>
do<br>
&nbsp; val x = i * 2<br>
&nbsp; println(s"i = $i, x = $x")<br>
</td>
</tr>
<tr>
<td valign="top">Multiple range generators<br>
</td>
<td valign="top">for i in range(1,3):<br>
&nbsp;&nbsp;&nbsp; for j in range(4,6):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; for k in
range(1,10,3):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


s
= "i = {}, j = {}, k = {}"<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
print(s.format(i,j,k))<br>
<br>
</td>
<td valign="top">for<br>
&nbsp; i &lt;- 1 to 2<br>
&nbsp; j &lt;- 4 to 5<br>
&nbsp; k &lt;- 1 until 10 by 3<br>
do<br>
&nbsp; println(s"i = $i, j = $j, k = $k")<br>
</td>
</tr>
<tr>
<td valign="top">Generator with guards (<code>if</code>
expressions)<br>
</td>
<td valign="top">for i in range(1,11):<br>
&nbsp;&nbsp;&nbsp; if i % 2 == 0:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if i &lt; 5:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
print(i)<br>
<br>
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
<td valign="top">Same as previous, with the <code>if</code>
statements condensed to one line<br>
</td>
<td valign="top">for i in range(1,11):<br>
&nbsp;&nbsp;&nbsp; if i % 2 == 0 and i &lt; 5:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
print(i)<br>
</td>
<td valign="top">for<br>
&nbsp; i &lt;- 1 to 10<br>
&nbsp; if i % 2 == 0 &amp;&amp; i &lt; 5<br>
do<br>
&nbsp; println(i)</td>
</tr>
<tr>
<td valign="top"> Comprehensions: list comprehension in
Python, <code>for</code> comprehension in Scala<br>
</td>
<td valign="top">x = [i*10 for i in range(1,4)]<br>
<br>
# result: [10,20,30]<br>
</td>
<td valign="top">val x = <br>
&nbsp; for<br>
&nbsp;&nbsp;&nbsp; i &lt;- 1 to 3<br>
&nbsp; yield<br>
&nbsp;&nbsp;&nbsp; i * 10<br>
// result: Vector(10, 20, 30)<br>
</td>
</tr>
<tr>
<td valign="top"><code>match</code> expressions</td>
<td valign="top">N/A (can use dictionaries for basic switch
functionality)<br>
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
<td valign="top">N/A<br>
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
<td valign="top">try:<br>
&nbsp;&nbsp;&nbsp; print(a)<br>
except NameError:<br>
&nbsp;&nbsp;&nbsp; print("NameError")<br>
except:<br>
&nbsp;&nbsp;&nbsp; print("Other")<br>
finally:<br>
&nbsp;&nbsp;&nbsp; print("Finally")<br>
</td>
<td valign="top">try<br>
&nbsp; writeTextToFile(text)<br>
catch<br>
&nbsp; case ioe: IOException =&gt; println("Got an
IOException.")<br>
&nbsp; case nfe: FileNotFoundException =&gt; println("Got a
FileNotFoundException.")<br>
finally<br>
&nbsp; println("Finally")<br>
</td>
</tr>
</tbody>
</table>
<p>Scala has many more <code>match</code> expression features; only
a
few are shown here.</p>
<p><br>
</p>
<h2>Collections classes</h2>
<p>This section compares the collections classes that are available
in Python and Scala, including lists, dictionaries/maps, sets, and
tuples.<br>
</p>
<h3>Lists<br>
</h3>
<p>Where Python has its list, Scala has several different
specialized mutable and immutable sequence classes, depending on
your needs. Because the Python list is mutable, it most directly
compares to Scala’s <code>ArrayBuffer</code>.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Python list,<br>
Scala sequences<br>
</td>
<td valign="top">a = [1,2,3]<br>
</td>
<td valign="top">// many different sequence classes<br>
val a = List(1,2,3)<br>
val a = Vector(1,2,3)<br>
val a = ArrayBuffer(1,2,3)<br>
</td>
</tr>
<tr>
<td valign="top">Access elements<br>
</td>
<td valign="top">a[0]<br>
a[1]<br>
</td>
<td valign="top">a(0)<br>
a(1)<br>
</td>
</tr>
<tr>
<td valign="top">Update list elements<br>
</td>
<td valign="top">a[0] = 10<br>
a[1] = 20<br>
</td>
<td valign="top">// ArrayBuffer is mutable<br>
a(0) = 10<br>
a(1) = 20<br>
</td>
</tr>
<tr>
<td valign="top">Combine two lists<br>
</td>
<td valign="top">c = a + b</td>
<td valign="top">val c = a ++ b</td>
</tr>
<tr>
<td valign="top">Iterate over a list with a <code>for</code>
loop<br>
</td>
<td valign="top">for i in ints: print(i)<br>
<br>
for i in ints:<br>
&nbsp;&nbsp;&nbsp; print(i)</td>
<td valign="top">for i &lt;- ints do println(i)&nbsp;&nbsp; //
preferred<br>
<br>
for (i &lt;- ints) println(i)&nbsp;&nbsp; // also available</td>
</tr>
</tbody>
</table>
<p>Scala’s main three sequence classes are <code>List</code>, <code>Vector</code>,
and <code>ArrayBuffer</code>. The <code>List</code> and <code>Vector</code>
classes are the main classes to use when you want an immutable
sequence. The <code>ArrayBuffer</code> class is the main class to
use when you want a mutable sequence. (A “buffer” in Scala is a
sequence that can grow and shrink.)<br>
</p>
<p><br>
</p>
<h3>Dictionary/Map</h3>
<p>The Python dictionary is like the mutable Scala <code>Map</code>
class.</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Creation<br>
</td>
<td valign="top">my_dict = {<br>
&nbsp;&nbsp;&nbsp; 'a': 1,<br>
&nbsp;&nbsp;&nbsp; 'b': 2,<br>
&nbsp;&nbsp;&nbsp; 'c': 3<br>
}<br>
</td>
<td valign="top">val myMap = Map(<br>
&nbsp; "a" -&gt; 1,<br>
&nbsp; "b" -&gt; 2,<br>
&nbsp; "c" -&gt; 3<br>
)<br>
</td>
</tr>
<tr>
<td valign="top">Access elements<br>
</td>
<td valign="top">my_dict['a']&nbsp;&nbsp; # 1<br>
</td>
<td valign="top">myMap("a")&nbsp;&nbsp; // 1<br>
</td>
</tr>
<tr>
<td valign="top"><code>for</code> loop<br>
</td>
<td valign="top">for key, value in my_dict.items():<br>
&nbsp;&nbsp;&nbsp; print(key)<br>
&nbsp;&nbsp;&nbsp; print(value)<br>
</td>
<td valign="top">for<br>
&nbsp; (key,value) &lt;- myMap<br>
do<br>
&nbsp; println(key)<br>
&nbsp; println(value)<br>
</td>
</tr>
</tbody>
</table>
<p>Scala has other specialized <code>Map</code> classes for
different needs.<br>
</p>
<h3>Sets</h3>
<p>The Python set is like the mutable Scala <code>Set</code> class.
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Creation<br>
</td>
<td valign="top">
<meta http-equiv="content-type" content="text/html;
charset=UTF-8">
set = {"a", "b", "c"} </td>
<td valign="top">val set = Set(1,2,3)<br>
</td>
</tr>
<tr>
<td valign="top"><br>
</td>
<td valign="top">set = {1,2,1}<br>
# result: {1,2}<br>
</td>
<td valign="top">val set = Set(1,2,1)<br>
// result: Set(1,2)<br>
</td>
</tr>
</tbody>
</table>
<p>Scala has other specialized <code>Set</code> classes for
different needs. </p>
<h3>Tuples<br>
</h3>
<p>The Python and Scala tuples are also similar:</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Creation<br>
</td>
<td valign="top">t = (11, 11.0, "Eleven")<br>
</td>
<td valign="top">val t = (11, 11.0, "Eleven")<br>
</td>
</tr>
<tr>
<td valign="top">Access elements<br>
</td>
<td valign="top">t[0]&nbsp;&nbsp; # 11<br>
t[1]&nbsp;&nbsp; # 11.0<br>
</td>
<td valign="top">t(0)&nbsp;&nbsp; // 11<br>
t(1)&nbsp;&nbsp; // 11.0<br>
</td>
</tr>
</tbody>
</table>
<p><br>
</p>
<h2>Methods on collections classes</h2>
<p>Python and Scala have several of the same common functional
methods available to them:</p>
<ul>
<li><code>map</code></li>
<li><code>filter</code></li>
<li><code>reduce</code><br>
</li>
</ul>
<p>If you’re used to using these methods with lambda expressions in
Python, you’ll see that Scala has a similar approach with methods
on its collections classes. To demonstrate this functionality,
here are two sample lists:<br>
</p>
<pre>list = (1,2,3)&nbsp;&nbsp;&nbsp; // python<br>val list = List(1,2,3)&nbsp;&nbsp; // scala<br></pre>
<p>Given those lists, this table shows how to apply mapping and
filtering algorithms to it:<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Method<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Mapping with a comprehension<br>
</td>
<td valign="top"><code>x = [i*10 for i in list]</code></td>
<td valign="top"><code>val x = for i &lt;- list yield i * 10</code><br>
</td>
</tr>
<tr>
<td valign="top">Filtering with a comprehension</td>
<td valign="top"><code>evens = [i for i in list if i % 2 == 0]</code></td>
<td valign="top"><code>val evens = list.filter(_ % 2 == 0)</code></td>
</tr>
<tr>
<td valign="top">Mapping and filtering with a comprehension</td>
<td valign="top"><code>x = [i * 10 for i in list if i % 2 ==
0]</code></td>
<td valign="top">val x = xs.filter(_ % 2 == 0)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
.map(_ * 10)</td>
</tr>
<tr>
<td valign="top">Mapping with <code>map</code><br>
</td>
<td valign="top">def times_10(n): return n * 10<br>
x = map(times_10, list)<br>
</td>
<td valign="top">val x = list.map(_ * 10)<br>
</td>
</tr>
<tr>
<td valign="top">Filtering with <code>filter</code><br>
</td>
<td valign="top">f = lambda x: x if x &gt; 1 else 1<br>
x = filter(f, list)<br>
</td>
<td valign="top">val x = list.filter(_ &gt; 1)</td>
</tr>
</tbody>
</table>
<p>Scala collections classes have over 100 functional methods to
simplify your code. In addition to <code>map</code>, <code>filter</code>,
and <code>reduce</code>, other commonly-used methods are listed
below.</p>
<p>Filtering methods:</p>
<ul>
<li><code>diff</code></li>
<li><code>distinct<br>
</code></li>
<li><code>drop</code><br>
</li>
<li><code>filter</code></li>
<li><code>head</code></li>
<li><code>slice</code><br>
</li>
<li><code>tail</code><br>
</li>
</ul>
<p>Transformer methods:</p>
<ul>
<li><code>collect</code></li>
<li><code>flatten<br>
</code></li>
<li><code>flatMap</code></li>
<li><code>fold<br>
</code></li>
<li><code>map</code></li>
<li><code>reduce<br>
</code></li>
<li><code>sortWith</code><br>
</li>
</ul>
<p>Grouping methods:</p>
<ul>
<li><code>groupBy</code></li>
<li><code>partition</code></li>
<li><code>sliding</code></li>
<li><code>span</code></li>
<li><code>splitAt</code><br>
</li>
</ul>
<p>Informational and mathematical methods:<br>
</p>
<ul>
<li><code>containsSlice</code><br>
</li>
<li><code>count</code></li>
<li><code>distinct</code></li>
<li><code>exists</code></li>
<li><code>find<br>
</code></li>
<li><code>min</code></li>
<li><code>max</code></li>
<li><code>slice</code></li>
<li><code>sum<br>
</code></li>
</ul>
<p>Here are a few examples that demonstrate how these methods work
on a list:</p>
<pre>val a = List(10, 20, 30, 40, 10)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 30, 40, 10)<br>a.distinct&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 30, 40)<br>a.drop(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(30, 40, 10)<br>a.dropRight(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 30)<br>a.dropWhile(_ &lt; 25)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(30, 40, 10)<br>a.filter(_ &lt; 25)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 10)<br>a.filter(_ &gt; 100)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List()<br>a.find(_ &gt; 20)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // Some(30)<br>a.head&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // 10<br>a.headOption&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // Some(10)<br>a.init&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 30, 40)<br>a.intersect(List(19,20,21))&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(20)<br>a.last&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // 10<br>a.lastOption&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // Some(10)<br>a.slice(2,4)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(30, 40)<br>a.tail&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(20, 30, 40, 10)<br>a.take(3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20, 30)<br>a.takeRight(2)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(40, 10)<br>a.takeWhile(_ &lt; 30)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // List(10, 20)</pre>
<p>These methods show a common pattern in Scala: Functional methods
that are available on objects. None of these methods mutate the
initial list <code>a</code>; instead, they all return the data
shown
after the comments.<br>
</p>
<h2>Enums</h2>
<p>This section compares enums (enumerations) in Python and Scala 3.<br>
</p>
<table border="1" cellspacing="1" cellpadding="2">
<tbody>
<tr>
<th valign="top">Feature<br>
</th>
<th valign="top">Python<br>
</th>
<th valign="top">Scala<br>
</th>
</tr>
<tr>
<td valign="top">Simple creation<br>
</td>
<td valign="top">from enum import Enum, auto<br>
class Color(Enum):<br>
&nbsp;&nbsp;&nbsp; RED = auto()<br>
&nbsp;&nbsp;&nbsp; GREEN = auto()<br>
&nbsp;&nbsp;&nbsp; BLUE = auto()<br>
</td>
<td valign="top">enum Color:<br>
&nbsp; case Red, Green, Blue<br>
</td>
</tr>
<tr>
<td valign="top">Values and comparison<br>
</td>
<td valign="top">Color.RED == Color.BLUE<br>
# False<br>
</td>
<td valign="top">Color.Red == Color.Blue&nbsp; // false<br>
</td>
</tr>
<tr>
<td valign="top">Parameterized enum<br>
</td>
<td valign="top">N/A<br>
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
<td valign="top">N/A<br>
</td>
<td valign="top">enum Planet(mass: Double, radius: Double):<br>
&nbsp; case Mercury extends Planet(3.303e+23, 2.4397e6)<br>
&nbsp; case Venus&nbsp;&nbsp; extends Planet(4.869e+24,
6.0518e6)<br>
&nbsp; case Earth&nbsp;&nbsp; extends Planet(5.976e+24,
6.37814e6)<br>
&nbsp; // more planets ...<br>
<br>
&nbsp; // fields and methods<br>
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
<h2>Concepts that are unique to Scala</h2>
<p>TODO: Someone who knows more about Python than I do should
edit/update this section.<br>
</p>
<p>There are other concepts in Scala which currently don’t have
equivalent functionality in Python. Follow these links for more
details:<br>
</p>
<ul>
<li>Most concepts related to contextual abstractions</li>
<ul>
<li>Extension methods, type classes, implicit values<br>
</li>
</ul>
<ul>
</ul>
<li>Scala allows multiple parameter lists</li>
<ul>
<li>This enables features like partially-applied functions, and
the ability to create your own DSL<br>
</li>
</ul>
<li>Case classes</li>
<ul>
<li>Useful for functional programming and pattern matching<br>
</li>
</ul>
<li>The ability to create your own control structures and DSLs</li>
<li>Pattern matching and <code>match</code> expressions<br>
</li>
<li>Multiversal equality: the ability to control at compile time
what equality comparisons make sense<br>
</li>
<li>Infix methods</li>
<li>Macros and metaprogramming</li>
<li>More ...<br>
</li>
</ul>

