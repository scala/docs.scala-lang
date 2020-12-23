---
title: Scala for Python Developers
type: chapter
description: This page is for Python developers who are interested in learning about Scala 3.
num: 73
previous-page: scala-for-javascript-devs
next-page: 
---

{% include_relative scala4x.css %}
<div markdown="1" class="scala3-comparison-page">

{% comment %}
NOTE: Hopefully someone with more Python experience can give this a thorough review 

NOTE: On this page (https://contributors.scala-lang.org/t/feedback-sought-optional-braces/4702/10), Li Haoyi comments: “Python’s success also speaks for itself; beginners certainly don’t pick Python because of performance, ease of installation, packaging, IDE support, or simplicity of the language’s runtime semantics!” I’m not a Python expert, so these points are good to know, though I don’t want to go negative in any comparisons.
It’s more like thinking, “Python developers will appreciate Scala’s performance, ease of installation, packaging, IDE support, etc.”
{% endcomment %}

{% comment %}
TODO: We should probably go through this document and add links to our other detail pages, when time permits.
{% endcomment %}


This section provides a comparison between the Python and Scala programming languages.
It’s intended for programmers who know Python and want to learn about Scala, specifically by seeing examples of how Python language features compare to Scala.



## Introduction 

Before getting into the examples, this first section provides a relatively brief introduction and summary of the sections that follow.
The two languages are first compared at a high level, and then at an everyday programming level.

### High level similarities 

At a high level, Scala shares these *similarities* with Python:  

- Both are high-level programming languages, where you don’t have to concern yourself with low-level concepts like pointers and manual memory management
- Both have a relatively simple, concise syntax  
- Both are functional programming (FP) languages
- Both are object-oriented programming (OOP) languages
- Both have comprehensions: Python has list comprehensions and Scala has `for` comprehensions
- Both languages have support for lambdas and higher-order functions
- Both can be used with [Apache Spark](https://spark.apache.org) for big data processing
- Both have a wealth of terrific libraries

### High level differences 

Also at a high level, the *differences* between Python and Scala are:
  
- Python is dynamically typed, and Scala is statically typed  
  - Though it’s statically typed, Scala features like type inference make it feel like a dynamic language
- Python is interpreted, and Scala code is compiled to *.class* files, and runs on the Java Virtual Machine (JVM)
- In addition to running on the JVM, the [Scala.js](https://www.scala-js.org) project lets you use Scala as a JavaScript replacement
- The [Scala Native](https://scala-native.readthedocs.io/en/v0.3.9-docs) project lets you write “systems” level code, and compiles to native executables
- Everything in Scala is an *expression*: constructs like `if` statements, `for` loops, `match` expressions, and even `try`/`catch` expressions all have return values
- Scala idioms favor immutability by default: you’re encouraged to use immutable variables and immutable collections
- Scala has excellent support for concurrent and parallel programming  

### Programming level similarities

This section looks at the similarities you’ll see between Python and Scala when you write code on an everyday basis:  

- Scala’s type inference often makes it feel like a dynamically typed language
- Neither language uses semicolons to end expressions
- Both languages support the use of significant indentation rather than braces and parentheses
- The syntax for defining methods is similar
- Both have lists, dictionaries (maps), sets, and tuples
- Both have comprehensions for mapping and filtering
- Both have higher-order functions and strong support for lambdas
- With Scala 3’s toplevel definitions you can put method, field, and other definitions anywhere
  - One difference is that Python can operate without even declaring a single method, while Scala 3 can’t do _everything_ at the toplevel; for instance, a `@main def` method is required to start a Scala application

### Programming level differences

Also at a programming level, these are some of the differences you’ll see every day when writing code:  

- Scala’s syntax is extremely consistent:
  - Lists, maps, sets, and tuples are all created and accessed similarly
  - Collections classes generally have most of the same higher-order functions
  - `val` and `var` fields are used consistently to define fields and parameters
  - Pattern matching is used consistently throughout the language
- Scala variables and parameters are defined with the `val` (immutable) or `var` (mutable) keywords
- Scala idioms prefer immutable data structures
- Scala has terrific IDE support with IntelliJ IDEA and Microsoft VS Code
- Comments: Python uses `#` for comments; Scala uses the C, C++, and Java style: `//`, `/*...*/`, and `/**...*/`  
- Naming conventions: The Python standard is to use underscores like `my_list`; Scala uses `myList`
- Scala is statically typed, so you declare types for method parameters, method return values, and in other places
- Pattern matching and `match` expressions are used extensively in Scala  (and will change the way you write code)
- Traits are used heavily in Scala; interfaces and abstract classes are used less often in Python
- Scala’s *contextual abstractions* and *term inference* provide a collection of different features:
  - *Extension methods* let you easily add new functionality to classes using a clear syntax
  - *Multiversal equality* lets you limit equality comparisons---at compile time---to only those comparisons that make sense
- Scala has state-of-the-art open source functional programming libraries
- You can create your own “control structures” and DSLs, thanks to features like objects, by-name parameters, infix notation, optional parentheses, extension methods, higher-order functions, and more
- Scala code can run in the JVM and even be compiled to native images (using Scala Native and GraalVM) for high performance
- Many other goodies: case classes, companion classes and objects, macros, union and intersection types, toplevel definitions, numeric literals, multiple parameter lists, and more



### Features compared with examples

Given that introduction, the following sections provide side-by-side comparisons of Python and Scala programming language features.

> The general Python standard is to indent code with four spaces, but in the following examples only two spaces are used.
> This is only done so the examples can be shown side by side.


## Comments

Python uses `#` for comments, while the Scala comment syntax is the same as languages like C, C++, and Java:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># a comment</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// a comment
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
  </tbody>
</table>

  

## Variable assignment

These examples demonstrate how to create variables in Python and Scala.

### Create integer and string variables:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = 1
        <br>x = "Hi"</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = 1
        <br>val x = "Hi"</code>
      </td>
    </tr>
  </tbody>
</table>

### Lists:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = List(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### Dictionary/Map:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = {
        <br>&nbsp; "Toy Story": 8.3,
        <br>&nbsp; "Forrest Gump": 8.8,
        <br>&nbsp; "Cloud Atlas": 7.4
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val movies = Map(
        <br>&nbsp; "Toy Story" -&gt; 8.3,
        <br>&nbsp; "Forrest Gump" -&gt; 8.8,
        <br>&nbsp; "Cloud Atlas" -&gt; 7.4
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

### Set:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = {1,2,3}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### Tuple:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = (11, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = (11, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

If a Scala field is going to be mutable, use `var` instead of `val` for variable assignment:

```scala
var x = 1
x += 1
```

However, the rule of thumb in Scala is to always use `val` unless the variable specifically needs to be mutated.

  

## OOP style classes and methods

This section provides comparisons of features related to OOP-style classes and methods.

### OOP style class, primary constructor:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>class Person(object):
        <br>&nbsp; def __init__(self, name):
        <br>&nbsp;&nbsp;&nbsp; self.name = name
        <br>
        <br>&nbsp; def speak(self):
        <br>&nbsp;&nbsp;&nbsp; print('Hello, my name is %s' % self.name)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (var name: String):
        <br>&nbsp; def speak() = println(s"Hello, my name is $name")</code>
      </td>
    </tr>
  </tbody>
</table>

### Create and use an instance:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>p = Person("John")
        <br>p.name&nbsp;&nbsp; # John
        <br>p.name = 'Fred'
        <br>p.name&nbsp;&nbsp; # Fred
        <br>p.speak()</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val p = Person("John")
        <br>p.name&nbsp;&nbsp; // John
        <br>p.name = "Fred"
        <br>p.name&nbsp;&nbsp; // Fred
        <br>p.speak()</code>
      </td>
    </tr>
  </tbody>
</table>

### One-line method:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def add(a,b) = a + b</code>
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
      <td class="python-block">
        <code>def walkThenRun():
        <br>&nbsp; print('walk')
        <br>&nbsp; print('run')</code>
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



## Interfaces, traits, and inheritance

If you’re familiar with Java 8 and newer, Scala traits are similar to those Java interfaces.
Traits are used all the time in Scala, while Python interfaces and abstract classes are used much less often.
Therefore, rather than attempt to compare the two side by side, this example shows how to use Scala traits to build a small solution to a simulated math problem:

```scala
trait Adder:
  def add(a: Int, b: Int) = a + b

trait Multiplier:
  def multiply(a: Int, b: Int) = a * b

// create a class from the traits
class SimpleMath extends Adder, Multiplier
val sm = new SimpleMath
sm.add(1,1)        // 2
sm.multiply(2,2)   // 4
```

There are many other ways to use traits with classes and objects, but this gives you a little idea of how they can be used to organize concepts into logical groups of behavior, and then merge them as needed to create a complete solution.

  

## Control structures

This section compares control structures in Python and Scala.
Both languages have constructs like `if`/`else`, `while`, `for` loops, and `try`.
Scala also has `match` expressions.

### `if` statement, one line:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x == 1: print(x)</code>
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
      <td class="python-block">
        <code>if x == 1:
        <br>&nbsp; print("x is 1, as you can see:")
        <br>&nbsp; print(x)</code>
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
      <td class="python-block">
        <code>if x &lt; 0:
        <br>&nbsp; print("negative")
        <br>elif x == 0:
        <br>&nbsp; print("zero")
        <br>else:
        <br>&nbsp; print("positive")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x &lt; 0 then
        <br>&nbsp; println("negative")
        <br>else if x == 0 then
        <br>&nbsp; println("zero")
        <br>else
        <br>&nbsp; println("positive")</code>
      </td>
    </tr>
  </tbody>
</table>

### Returning a value from `if`:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>min_val = a if a &lt; b else b</code>
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

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def min(a, b):
        <br>&nbsp; return a if a &lt; b else b</code>
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

### `while` loop:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>i = 1
        <br>while i &lt; 3:
        <br>&nbsp; print(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 1
        <br>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` loop with range:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(0,3):
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- 0 until 3 do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- 0 until 3) println(i)
        <br>
        <br>// multiline syntax
        <br>for
        <br>&nbsp; i &lt;- 0 until 3
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` loop with a list:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>for i &lt;- ints do println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### `for` loop, multiple lines:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints:
        <br>&nbsp; x = i * 2
        <br>&nbsp; s = "i = {}, x = {}"
        <br>&nbsp; print(s.format(i,x))</code>
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

### Multiple “range” generators:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,3):
        <br>&nbsp; for j in range(4,6):
        <br>&nbsp;&nbsp;&nbsp; for k in range(1,10,3):
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; s= "i = {}, j = {}, k = {}"
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(s.format(i,j,k))</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 2
        <br>&nbsp; j &lt;- 4 to 5
        <br>&nbsp; k &lt;- 1 until 10 by 3
        <br>do
        <br>&nbsp; println(s"i = $i, j = $j, k = $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### Generator with guards (`if` expressions):

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0:
        <br>&nbsp;&nbsp;&nbsp; if i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(i)</code>
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

### Multiple `if` conditions per line:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0 and i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0 &amp;&amp; i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### Comprehensions:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = [i*10 for i in range(1,4)]
        <br># x: [10,20,30]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = 
        <br>&nbsp; for
        <br>&nbsp;&nbsp;&nbsp; i &lt;- 1 to 3
        <br>&nbsp; yield
        <br>&nbsp;&nbsp;&nbsp; i * 10
        <br>// x: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>

### `match` expressions:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A (but you can use dictionaries for basic “switch” functionality)
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val monthAsString = day match
        <br>&nbsp; case 1 =&gt; "January"
        <br>&nbsp; case 2 =&gt; "February"
        <br>&nbsp; _ =&gt; "Other"</code>
      </td>
    </tr>
  </tbody>
</table>

### switch/match:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val numAsString = i match
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
        <br>&nbsp; case _ =&gt; "too big"</code>
      </td>
    </tr>
  </tbody>
</table>

### try, catch, finally:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>try:
        <br>&nbsp; print(a)
        <br>except NameError:
        <br>&nbsp; print("NameError")
        <br>except:
        <br>&nbsp; print("Other")
        <br>finally:
        <br>&nbsp; print("Finally")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>try
        <br>&nbsp; writeTextToFile(text)
        <br>catch
        <br>&nbsp; case ioe: IOException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(ioe.getMessage)
        <br>&nbsp; case nfe: FileNotFoundException =&gt; 
        <br>&nbsp;&nbsp;&nbsp; println(fnf.getMessage)
        <br>finally
        <br>&nbsp; println("Finally")</code>
      </td>
    </tr>
  </tbody>
</table>

Match expressions and pattern matching are a big part of the Scala programming experience, but only a few `match` expression features are shown here. See the [Control Structures][control_structures] page for many more examples.



## Collections classes

This section compares the collections classes that are available in Python and Scala, including lists, dictionaries/maps, sets, and tuples.

### Lists 

Where Python has its list, Scala has several different specialized mutable and immutable sequence classes, depending on your needs.
Because the Python list is mutable, it most directly compares to Scala’s `ArrayBuffer`.

### Python list &amp; Scala sequences:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// use different sequence classes
        <br>// as needed
        <br>val a = List(1,2,3)
        <br>val a = Vector(1,2,3)
        <br>val a = ArrayBuffer(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### Accessing list elements:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a[0]<br>a[1]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>a(0)<br>a(1)</code>   // just like all other method calls
      </td>
    </tr>
  </tbody>
</table>

### Update list elements:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>a[0] = 10
        <br>a[1] = 20</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// ArrayBuffer is mutable
        <br>a(0) = 10
        <br>a(1) = 20</code>
      </td>
    </tr>
  </tbody>
</table>

### Combine two lists:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>c = a + b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val c = a ++ b</code>
      </td>
    </tr>
  </tbody>
</table>

### Iterate over a list:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
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

Scala’s main sequence classes are `List`, `Vector`, and `ArrayBuffer`.
`List` and `Vector` are the main classes to use when you want an immutable sequence, and `ArrayBuffer` is the main class to use when you want a mutable sequence.
(A “buffer” in Scala is a sequence that can grow and shrink.)

### Dictionary/Map

The Python dictionary is like the _mutable_ Scala `Map` class.
However, the default Scala map is _immutable_, and has a number of transformation methods to let you easily create new maps.

#### Dictionary/Map creation:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>my_dict = {
        <br>&nbsp; 'a': 1,
        <br>&nbsp; 'b': 2,
        <br>&nbsp; 'c': 3
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val myMap = Map(
        <br>&nbsp; "a" -&gt; 1,
        <br>&nbsp; "b" -&gt; 2,
        <br>&nbsp; "c" -&gt; 3
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

#### Accessing dictionary/map elements:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>my_dict['a']&nbsp;&nbsp; # 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>myMap("a")&nbsp;&nbsp; // 1</code>
      </td>
    </tr>
  </tbody>
</table>

#### Dictionary/Map with a `for` loop:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for key, value in my_dict.items():
        <br>&nbsp; print(key)
        <br>&nbsp; print(value)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; (key,value) &lt;- myMap
        <br>do
        <br>&nbsp; println(key)
        <br>&nbsp; println(value)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala has other specialized `Map` classes for different needs.

### Sets

The Python set is similar to the _mutable_ Scala `Set` class.

#### Set creation:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>set = {"a", "b", "c"}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val set = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

#### Duplicate elements:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>set = {1,2,1}
        <br># set: {1,2}</code></td>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val set = Set(1,2,1)
        <br>// set: Set(1,2)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala has other specialized `Set` classes for different needs.

### Tuples 

Python and Scala tuples are also similar.

#### Tuple creation:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

#### Accessing tuple elements:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>t[0]&nbsp;&nbsp; # 11
        <br>t[1]&nbsp;&nbsp; # 11.0</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>t(0)&nbsp;&nbsp; // 11
        <br>t(1)&nbsp;&nbsp; // 11.0</code>
      </td>
    </tr>
  </tbody>
</table>



## Methods on collections classes

Python and Scala have several of the same common functional methods available to them:

- `map`
- `filter`
- `reduce`  

If you’re used to using these methods with lambda expressions in Python, you’ll see that Scala has a similar approach with methods on its collections classes.
To demonstrate this functionality, here are two sample lists:  

```scala
numbers = (1,2,3)           // python
val numbers = List(1,2,3)   // scala
```

Those lists are used in the following table, that shows how to apply mapping and filtering algorithms to it.

### Mapping with a comprehension:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i*10 for i in numbers]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = for i &lt;- numbers yield i * 10</code>
      </td>
    </tr>
  </tbody>
</table>

### Filtering with a comprehension:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>evens = [i for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val evens = numbers.filter(_ % 2 == 0)</code>
      </td>
    </tr>
  </tbody>
</table>

### Mapping &amp; filtering with a comprehension:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i * 10 for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = numbers.filter(_ % 2 == 0)
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.map(_ * 10)</code>
      </td>
    </tr>
  </tbody>
</table>

### Mapping:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def times_10(n): return n * 10
        <br>x = map(lambda x: x * 10, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.map(_ * 10)</code>
      </td>
    </tr>
  </tbody>
</table>

### Filtering:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>f = lambda x: x if x &gt; 1 else 1
        <br>x = filter(f, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.filter(_ &gt; 1)</code>
      </td>
    </tr>
  </tbody>
</table>


### Scala collections methods

Scala collections classes have over 100 functional methods to simplify your code.
In addition to `map`, `filter`, and `reduce`, other commonly-used methods are listed below.
In those method examples:

- `c` refers to a collection
- `p` is a predicate
- `f` is a function, anonymous function, or method
- `n` refers to an integer value

These are some of the filtering methods that are available:

| Method         | Description   |
| -------------- | ------------- |
| `c1.diff(c2)`  | Returns the difference of the elements in `c1` and `c2`. |
| `c.distinct`   | Returns the unique elements in `c`. |
| `c.drop(n)`    | Returns all elements in the collection except the first `n` elements. |
| `c.filter(p)`  | Returns all elements from the collection for which the predicate is `true`. |
| `c.head`       | Returns the first element of the collection. (Throws a `NoSuchElementException` if the collection is empty.) |
| `c.tail`       | Returns all elements from the collection except the first element. (Throws a `UnsupportedOperationException` if the collection is empty.) |
| `c.take(n)`    | Returns the first `n` elements of the collection `c`. |

Here are a few transformer methods:

| Method          | Description   |
| --------------- | ------------- |
| `c.flatten`     | Converts a collection of collections (such as a list of lists) to a single collection (single list). |
| `c.flatMap(f)`  | Returns a new collection by applying `f` to all elements of the collection `c` (like `map`), and then flattening the elements of the resulting collections. |
| `c.map(f)`      | Creates a new collection by applying `f` to all elements of the collection `c`. |
| `c.reduce(f)`   | Applies the “reduction” function `f` to successive elements in `c` to yield a single value. |
| `c.sortWith(f)` | Returns a version of `c` that’s sorted by the comparison function `f`. |

Some common grouping methods:

| Method           | Description   |
| ---------------- | ------------- |
| `c.groupBy(f)`   | Partitions the collection into a `Map` of collections according to `f`. |
| `c.partition(p)` | Returns two collections according to the predicate `p`. |
| `c.span(p)`      | Returns a collection of two collections, the first created by `c.takeWhile(p)`, and the second created by `c.dropWhile(p)`. |
| `c.splitAt(n)`   | Returns a collection of two collections by splitting the collection `c` at element `n`. |

Some informational and mathematical methods:  

| Method         | Description   |
| -------------- | ------------- |
| `c1.containsSlice(c2)` | Returns `true` if `c1` contains the sequence `c2`. |
| `c.count(p)`   | Counts the number of elements in `c` where `p` is `true`. |
| `c.distinct`   | Returns the unique elements in `c`. |
| `c.exists(p)`  | Returns `true` if `p` is `true` for any element in the collection. |
| `c.find(p)`    | Returns the first element that matches `p`. The element is returned as `Option[A]`. |
| `c.min`        | Returns the smallest element from the collection. (Can throw _java.lang.UnsupportedOperationException_.) |
| `c.max`        | Returns the largest element from the collection. (Can throw _java.lang.UnsupportedOperationException_.) |
|`c slice(from, to)` | Returns the interval of elements beginning at element `from`, and ending at element `to`. |
| `c.sum`        | Returns the sum of all elements in the collection. (Requires an `Ordering` be defined for the elements in the collection.) |

Here are a few examples that demonstrate how these methods work on a list:

```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
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
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)
```

These methods show a common pattern in Scala: Functional methods that are available on objects.
None of these methods mutate the initial list `a`; instead, they all return the data shown after the comments.

There are many more methods available, but hopefully these descriptions and examples give you a taste of the power that’s available in the pre-built collections methods.



## Enums

This section compares enums (enumerations) in Python and Scala 3.

### Creating enums:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>from enum import Enum, auto
        <br>class Color(Enum):
        <br>&nbsp;&nbsp;&nbsp; RED = auto()
        <br>&nbsp;&nbsp;&nbsp; GREEN = auto()
        <br>&nbsp;&nbsp;&nbsp; BLUE = auto()</code>
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

### Values and comparison:

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>Color.RED == Color.BLUE&nbsp; # False</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>Color.Red == Color.Blue&nbsp; // false</code>
      </td>
    </tr>
  </tbody>
</table>

### Parameterized enums:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
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
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Planet(
        <br>&nbsp;&nbsp;&nbsp; mass: Double,
        <br>&nbsp;&nbsp;&nbsp; radius: Double
        <br>&nbsp; ):
        <br>&nbsp; case Mercury extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(3.303e+23, 2.4397e6)
        <br>&nbsp; case Venus extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(4.869e+24, 6.0518e6)
        <br>&nbsp; case Earth extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(5.976e+24, 6.37814e6)
        <br>&nbsp; // more planets ...
        <br>
        <br>&nbsp; // fields and methods
        <br>&nbsp; private final val G = 6.67300E-11
        <br>&nbsp; def surfaceGravity = G * mass /
        <br>&nbsp;&nbsp;&nbsp;&nbsp;(radius * radius)
        <br>&nbsp; def surfaceWeight(otherMass: Double)
        <br>&nbsp;&nbsp;&nbsp;&nbsp;= otherMass * surfaceGravity</code>
      </td>
    </tr>
  </tbody>
</table>



## Concepts that are unique to Scala

There are other concepts in Scala which currently don’t have equivalent functionality in Python.
Follow the links below for more details: 

- Most concepts related to [contextual abstractions][contextual], such as [extension methods][extension], [type classes][type_classes], implicit values
- Scala allows multiple parameter lists, which enables features like partially-applied functions, and the ability to create your own DSLs
- Case classes, which are extremely useful for functional programming and pattern matching
- The ability to create your own control structures and DSLs
- Pattern matching and `match` expressions
- [Multiversal equality][multiversal]: the ability to control at compile time what equality comparisons make sense
- Infix methods
- Macros and metaprogramming


[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[type_classes]: {% link _overviews/scala3-book/types-type-classes.md %}
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[control_structures]: {% link _overviews/scala3-book/control-structures.md %}

</div>

