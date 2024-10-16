---
layout: singlepage-overview
title: A Scala Tutorial for Java Programmers

partof: scala-for-java-programmers

languages: [es, ko, de, it, ja, zh-tw]
permalink: /tutorials/:title.html

get_started_resources:
  - title: "Getting Started"
    description: "Install Scala on your computer and start writing some Scala code!"
    icon: "fa fa-rocket"
    link: /getting-started.html
  - title: Scala in the Browser
    description: >
      To start experimenting with Scala right away, use "Scastie" in your browser.
    icon: "fa fa-cloud"
    link: https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw
java_resources:
  - title: Scala for Java Developers
    description: A cheatsheet with a comprehensive side-by-side comparison of Java and Scala.
    icon: "fa fa-coffee"
    link: /scala3/book/scala-for-java-devs.html
next_resources:
  - title: Scala Book
    description: Learn Scala by reading a series of short lessons.
    icon: "fa fa-book-open"
    link: /scala3/book/introduction.html
  - title: Online Courses
    description: MOOCs to learn Scala, for beginners and experienced programmers.
    icon: "fa fa-cloud"
    link:  /online-courses.html
---

If you are coming to Scala with some Java experience already, this page should give a good overview of
the differences, and what to expect when you begin programming with Scala. For best results we suggest
to either set up a Scala toolchain on your computer, or try compiling Scala snippets in the browser with Scastie:

{% include inner-documentation-sections.html links=page.get_started_resources %}

## At a Glance: Why Scala?

**Java without Semicolons:** There's a saying that Scala is Java without semicolons.
There is a lot of a truth to this statement: Scala simplifies much of the noise and boilerplate of Java,
while building upon the same foundation, sharing the same underlying types and runtime.

**Seamless Interop:** Scala can use any Java library out of the box; including the Java standard library!
And pretty much any Java program will work the same in Scala, just by converting the syntax.

**A Scalable Language:** the name Scala comes from Scalable Language. Scala scales not only with hardware
resources and load requirements, but also with the level of programmer's skill. If you choose, Scala
rewards you with expressive additional features, which when compared to Java, boost developer productivity and
readability of code.

**It Grows with You:** Learning these extras are optional steps to approach at your own pace.
The most fun and effective way to learn, in our opinion, is to ensure you are productive first with what knowledge
you have from Java. And then, learn one thing at a time following the [Scala Book][scala-book]. Pick the learning pace convenient for you and ensure whatever you are learning is fun.

**TL;DR:** You can start writing Scala as if it were Java with new syntax, then explore from there as you see fit.

## Next Steps

### Compare Java and Scala
The remainder of this tutorial expands upon some of the key differences between Java and Scala,
with further explanations. **If you only want a quick reference** between the two, read
*Scala for Java Developers*, it comes
with many snippets which you can try out in your chosen Scala setup:

{% include inner-documentation-sections.html links=page.java_resources %}

### Explore Further

When you finish these guides, we recommend to continue your Scala journey by reading the
*Scala Book* or following a number of *online MOOCs*.

{% include inner-documentation-sections.html links=page.next_resources %}

## Your First Program

### Writing Hello World

As a first example, we will use the standard *Hello World* program. It
is not very fascinating but makes it easy to demonstrate the use of
the Scala tools without knowing too much about the language. Here is
how it looks:

{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}
```scala
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, World!")
  }
}
```
The structure of this program should be familiar to Java programmers:
it's entry-point consists of one method called `main` which takes the command
line arguments, an array of strings, as a parameter; the body of this
method consists of a single call to the predefined method `println`
with the friendly greeting as argument. The `main` method does not
return a value. Therefore, its return type is declared as `Unit`
(equivalent to `void` in Java).

What is less familiar to Java programmers is the `object`
declaration containing the `main` method. Such a declaration
introduces what is commonly known as a *singleton object*, that
is a class with a single instance. The declaration above thus declares
both a class called `HelloWorld` and an instance of that class,
also called `HelloWorld`. This instance is created on demand,
the first time it is used.

Another difference from Java is that the `main` method is
not declared as `static` here. This is because static members
(methods or fields) do not exist in Scala. Rather than defining static
members, the Scala programmer declares these members in singleton
objects.
{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}
```scala
@main def HelloWorld(args: String*): Unit =
  println("Hello, World!")
```
The structure of this program may not be familiar to Java programmers:
there is no method called `main`, instead the `HelloWorld` method is marked
as an entry-point by adding the `@main` annotation.

program entry-points optionally take parameters, which are populated by the
command line arguments. Here `HelloWorld` captures all the arguments in
a variable-length sequence of strings called `args`.

The body of the method consists of a single call to the
predefined method `println` with the friendly greeting as argument.
The `HelloWorld` method does not
return a value. Therefore, its return type is declared as `Unit`
(equivalent to `void` in Java).

Even less familiar to Java programmers is that `HelloWorld`
does not need to be wrapped in a class definition. Scala 3
supports top-level method definitions, which are ideal for
program entry-points.

The method also does not need to be declared as `static`.
This is because static members (methods or fields) do not exist in Scala.
Instead, top-level methods and fields are members of their enclosing
package, so can be accessed from anywhere in a program.

> **Implementation detail**: so that the JVM can execute the program,
> the `@main` annotation generates a class `HelloWorld` with a
> static `main` method which calls the `HelloWorld` method with the
> command line arguments.
> This class is only visible at runtime.
{% endtab %}

{% endtabs %}

### Running Hello World

> **Note:** The following assumes you are using Scala on the command line

If we save the above program in a file called
`HelloWorld.scala`, we can run it by issuing the following
command (the greater-than sign `>` represents the shell prompt
and should not be typed):

```shell
> scala run HelloWorld.scala
```

The program will be automatically compiled (with compiled classes somewhere in the newly created `.scala-build` directory)
and executed, producing an output similar to:
```
Compiling project (Scala {{site.scala-3-version}}, JVM (20))
Compiled project (Scala {{site.scala-3-version}}, JVM (20))
Hello, World!
```

#### Compiling From the Command Line

To compile the example, we use `scala compile` command, which will invoke the Scala compiler, `scalac`. `scalac`
works like most compilers: it takes a source file as argument, maybe
some options, and produces one or several output files. The outputs
it produces are standard Java class files.

```shell
> scala compile HelloWorld.scala -d .
```

This will generate a few class files in the current directory (`-d` option sets the compilation output directory). One of
them will be called `HelloWorld.class`, and contains a class
which can be directly executed using the `scala` command, as the
following section shows.

#### Running From the Command Line

Once compiled, the program can be run using the `scala run` command.
Its usage is very similar to the `java` command used to run Java
programs, and accepts similar options. The above example can be
executed using the following command, which produces the expected
output:

```shell
> scala run --main-class HelloWorld -classpath . 
Hello, World!
```

## Using Java Libraries

One of Scala's strengths is that it makes it very easy to interact
with Java code. All classes from the `java.lang` package are
imported by default, while others need to be imported explicitly.

Let's look at an example that demonstrates this.  We want to obtain
and format the current date according to the conventions used in a
specific country, say France. (Other regions such as the
French-speaking part of Switzerland use the same conventions.)

Java's class libraries define powerful utility classes, such as
`LocalDate` and `DateTimeFormatter`. Since Scala interoperates
seamlessly with Java, there is no need to implement equivalent
classes in the Scala class library; instead, we can import the classes
of the corresponding Java packages:

{% tabs date-time-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=date-time-demo %}
```scala
import java.time.format.{DateTimeFormatter, FormatStyle}
import java.time.LocalDate
import java.util.Locale._

object FrenchDate {
  def main(args: Array[String]): Unit = {
    val now = LocalDate.now
    val df = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(FRANCE)
    println(df.format(now))
  }
}
```
Scala's import statement looks very similar to Java's equivalent,
however, it is more powerful. Multiple classes can be imported from
the same package by enclosing them in curly braces as on the first
line. Another difference is that when importing all the names of a
package or class, in Scala 2 we use the underscore character (`_`) instead
of the asterisk (`*`).
{% endtab %}

{% tab 'Scala 3' for=date-time-demo %}
```scala
import java.time.format.{DateTimeFormatter, FormatStyle}
import java.time.LocalDate
import java.util.Locale.*

@main def FrenchDate: Unit =
  val now = LocalDate.now
  val df = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(FRANCE)
  println(df.format(now))
```
Scala's import statement looks very similar to Java's equivalent,
however, it is more powerful. Multiple classes can be imported from
the same package by enclosing them in curly braces as on the first
line. Like with Java, in Scala 3 we use the asterisk (`*`) to import all
the names of a package or class.
{% endtab %}

{% endtabs %}

The import statement on the third line therefore imports all members
of the `Locale` enum. This makes the static field `FRANCE` directly
visible.

Inside the entry-point method we first create an instance of Java's
`DateTime` class, containing today's date. Next, we
define a date format using the `DateTimeFormatter.ofLocalizedDate` method,
passing the `LONG` format style, then further passing the `FRANCE` locale
that we imported previously. Finally, we print the current date
formatted according to the localized `DateTimeFormatter` instance.

To conclude this section about integration with Java, it should be
noted that it is also possible to inherit from Java classes and
implement Java interfaces directly in Scala.

### Sidepoint: Third-Party Libraries

Usually the standard library is not enough. As a Java programmer, you might already know a lot of Java libraries
that you'd like to use in Scala. The good news is that, as with Java, Scala's library ecosystem is built upon Maven coordinates.

**Most Scala projects are built with sbt:** Adding third party libraries is usually managed by a build tool.
Coming from Java you may be familiar with Maven, Gradle and other such tools.
It's still possible to [use these][maven-setup] to build Scala projects, however it's common to use sbt.
See [setup a Scala Project with sbt][sbt-setup] for a guide on how
to build a project with sbt and add some dependencies.
<!-- TODO: we should update the getting started guide so that it shows how to add dependencies,
then reference it here -->

## Everything is an Object

Scala is a pure object-oriented language in the sense that
*everything* is an object, including numbers or functions. It
differs from Java in that respect, since Java distinguishes
primitive types (such as `boolean` and `int`) from reference
types.

### Numbers are objects

Since numbers are objects, they also have methods. And in fact, an
arithmetic expression like the following:

{% tabs math-expression-inline %}
{% tab 'Scala 2 and 3' for=math-expression-inline %}
```scala
1 + 2 * 3 / x
```
{% endtab %}
{% endtabs %}

consists exclusively of method calls, because it is equivalent to the
following expression, as we saw in the previous section:

{% tabs math-expression-explicit %}
{% tab 'Scala 2 and 3' for=math-expression-explicit %}
```scala
1.+(2.*(3)./(x))
```
{% endtab %}
{% endtabs %}

This also means that `+`, `*`, etc. are valid identifiers for fields/methods/etc
in Scala.

### Functions are objects

True to _everything_ being an object, in Scala even functions are objects, going beyond Java's support for
lambda expressions.

Compared to Java, there is very little difference between function objects and methods: you can pass methods as
arguments, store them in variables, and return them from other functions, all without special syntax.
This ability to manipulate functions as values is one of the cornerstones of a very
interesting programming paradigm called *functional programming*.

To demonstrate, consider a timer function which
performs some action every second. The action to be performed is supplied by the
caller as a function value.

In the following program, the timer function is called
`oncePerSecond`, and it gets a call-back function as argument.
The type of this function is written `() => Unit` and is the type
of all functions which take no arguments and return no useful value
(as before, the type `Unit` is similar to `void` in Java).

The entry-point of this program calls `oncePerSecond` by directly passing
the `timeFlies` method.

In the end this program will infitely print the sentence `time flies like an arrow` every
second.

{% tabs callback-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=callback-demo %}
```scala
object Timer {
  def oncePerSecond(callback: () => Unit): Unit = {
    while (true) { callback(); Thread.sleep(1000) }
  }
  def timeFlies(): Unit = {
    println("time flies like an arrow...")
  }
  def main(args: Array[String]): Unit = {
    oncePerSecond(timeFlies)
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=callback-demo %}
```scala
def oncePerSecond(callback: () => Unit): Unit =
  while true do { callback(); Thread.sleep(1000) }

def timeFlies(): Unit =
  println("time flies like an arrow...")

@main def Timer: Unit =
  oncePerSecond(timeFlies)
```
{% endtab %}

{% endtabs %}

Note that in order to print the string, we used the predefined method
`println` instead of using the one from `System.out`.

#### Anonymous functions

In Scala, lambda expressions are known as anonymous functions.
They are useful when functions are so short it is perhaps unneccesary
to give them a name.

Here is a revised version of the timer
program, passing an anonymous function to `oncePerSecond` instead of `timeFlies`:

{% tabs callback-demo-refined class=tabs-scala-version %}

{% tab 'Scala 2' for=callback-demo-refined %}
```scala
object TimerAnonymous {
  def oncePerSecond(callback: () => Unit): Unit = {
    while (true) { callback(); Thread.sleep(1000) }
  }
  def main(args: Array[String]): Unit = {
    oncePerSecond(() =>
      println("time flies like an arrow..."))
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=callback-demo-refined %}
```scala
def oncePerSecond(callback: () => Unit): Unit =
  while true do { callback(); Thread.sleep(1000) }

@main def TimerAnonymous: Unit =
  oncePerSecond(() =>
    println("time flies like an arrow..."))
```
{% endtab %}

{% endtabs %}

The presence of an anonymous function in this example is revealed by
the right arrow (`=>`), different from Java's thin arrow (`->`), which
separates the function's argument list from its body.
In this example, the argument list is empty, so we put empty parentheses
on the left of the arrow.
The body of the function is the same as the one of `timeFlies`
above.

## Classes

As we have seen above, Scala is an object-oriented language, and as
such it has a concept of class. (For the sake of completeness,
  it should be noted that some object-oriented languages do not have
  the concept of class, but Scala is not one of them.)
Classes in Scala are declared using a syntax which is close to
Java's syntax. One important difference is that classes in Scala can
have parameters. This is illustrated in the following definition of
complex numbers.

{% tabs class-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=class-demo %}
```scala
class Complex(real: Double, imaginary: Double) {
  def re() = real
  def im() = imaginary
}
```
This `Complex` class takes two arguments, which are the real and
imaginary part of the complex number. These arguments must be passed when
creating an instance of class `Complex`, as follows:
```scala
new Complex(1.5, 2.3)
```
The class contains two methods, called `re`
and `im`, which give access to these two parts.
{% endtab %}

{% tab 'Scala 3' for=class-demo %}
```scala
class Complex(real: Double, imaginary: Double):
  def re() = real
  def im() = imaginary
```
This `Complex` class takes two arguments, which are the real and
imaginary part of the complex number. These arguments must be passed when
creating an instance of class `Complex`, as follows:
```scala
new Complex(1.5, 2.3)
```
where `new` is optional.
The class contains two methods, called `re`
and `im`, which give access to these two parts.
{% endtab %}

{% endtabs %}

It should be noted that the return type of these two methods is not
given explicitly. It will be inferred automatically by the compiler,
which looks at the right-hand side of these methods and deduces that
both return a value of type `Double`.

> **Important:** The inferred result type of a method can change
> in subtle ways if the implementation changes, which could have a
> knock-on effect. Hence it is a best practise to put explicit
> result types for public members of classes.

For local values in methods, it is encouraged to infer result types.
Try to experiment by omitting type declarations when they seem to be
easy to deduce from the context, and see if the compiler agrees.
After some time, the programmer should get a good feeling about when
to omit types, and when to specify them explicitly.

### Methods without arguments

A small problem of the methods `re` and `im` is that, in
order to call them, one has to put an empty pair of parenthesis after
their name, as the following example shows:

{% tabs method-call-with-args-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=method-call-with-args-demo %}
```scala
object ComplexNumbers {
  def main(args: Array[String]): Unit = {
    val c = new Complex(1.2, 3.4)
    println("imaginary part: " + c.im())
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=method-call-with-args-demo %}
```scala
@main def ComplexNumbers: Unit =
  val c = Complex(1.2, 3.4)
  println("imaginary part: " + c.im())
```
{% endtab %}

{% endtabs %}

It would be nicer to be able to access the real and imaginary parts
like if they were fields, without putting the empty pair of
parenthesis. This is perfectly doable in Scala, simply by defining
them as methods *without arguments*. Such methods differ from
methods with zero arguments in that they don't have parenthesis after
their name, neither in their definition nor in their use. Our
`Complex` class can be rewritten as follows:

{% tabs class-no-method-params-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=class-no-method-params-demo %}
```scala
class Complex(real: Double, imaginary: Double) {
  def re = real
  def im = imaginary
}
```
{% endtab %}

{% tab 'Scala 3' for=class-no-method-params-demo %}
```scala
class Complex(real: Double, imaginary: Double):
  def re = real
  def im = imaginary
```
{% endtab %}

{% endtabs %}


### Inheritance and overriding

All classes in Scala inherit from a super-class. When no super-class
is specified, as in the `Complex` example of previous section,
`scala.AnyRef` is implicitly used.

It is possible to override methods inherited from a super-class in
Scala. It is however mandatory to explicitly specify that a method
overrides another one using the `override` modifier, in order to
avoid accidental overriding. As an example, our `Complex` class
can be augmented with a redefinition of the `toString` method
inherited from `Object`.

{% tabs class-inheritance-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=class-inheritance-demo %}
```scala
class Complex(real: Double, imaginary: Double) {
  def re = real
  def im = imaginary
  override def toString() =
    "" + re + (if (im >= 0) "+" else "") + im + "i"
}
```
{% endtab %}

{% tab 'Scala 3' for=class-inheritance-demo %}
```scala
class Complex(real: Double, imaginary: Double):
  def re = real
  def im = imaginary
  override def toString() =
    "" + re + (if im >= 0 then "+" else "") + im + "i"
```
{% endtab %}

{% endtabs %}

We can call the overridden `toString` method as below:

{% tabs class-inheritance-toString-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=class-inheritance-toString-demo %}
```scala
object ComplexNumbers {
  def main(args: Array[String]): Unit = {
    val c = new Complex(1.2, 3.4)
    println("Overridden toString(): " + c.toString)
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=class-inheritance-toString-demo %}
```scala
@main def ComplexNumbers: Unit =
  val c = Complex(1.2, 3.4)
  println("Overridden toString(): " + c.toString)
```
{% endtab %}

{% endtabs %}



## Algebraic Data Types and Pattern Matching

A kind of data structure that often appears in programs is the tree.
For example, interpreters and compilers usually represent programs
internally as trees; JSON payloads are trees; and several kinds of
containers are based on trees, like red-black trees.

We will now examine how such trees are represented and manipulated in
Scala through a small calculator program. The aim of this program is
to manipulate very simple arithmetic expressions composed of sums,
integer constants and variables. Two examples of such expressions are
`1+2` and `(x+x)+(7+y)`.

We first have to decide on a representation for such expressions. The
most natural one is the tree, where nodes are operations (here, the
addition) and leaves are values (here constants or variables).

In Java, before the introduction of records, such a tree would be
represented using an abstract
super-class for the trees, and one concrete sub-class per node or
leaf. In a functional programming language, one would use an algebraic
data-type (ADT) for the same purpose.

{% tabs algebraic-data-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=algebraic-data-demo %}
Scala 2 provides the concept of
*case classes* which is somewhat in between the two. Here is how
they can be used to define the type of the trees for our example:

```scala
abstract class Tree
object Tree {
  case class Sum(left: Tree, right: Tree) extends Tree
  case class Var(n: String) extends Tree
  case class Const(v: Int) extends Tree
}
```

The fact that classes `Sum`, `Var` and `Const` are
declared as case classes means that they differ from standard classes
in several respects:

- the `new` keyword is not mandatory to create instances of
  these classes (i.e., one can write `Tree.Const(5)` instead of
  `new Tree.Const(5)`),
- getter functions are automatically defined for the constructor
  parameters (i.e., it is possible to get the value of the `v`
  constructor parameter of some instance `c` of class
  `Tree.Const` just by writing `c.v`),
- default definitions for methods `equals` and
  `hashCode` are provided, which work on the *structure* of
  the instances and not on their identity,
- a default definition for method `toString` is provided, and
  prints the value in a "source form" (e.g., the tree for expression
  `x+1` prints as `Sum(Var(x),Const(1))`),
- instances of these classes can be decomposed through
  *pattern matching* as we will see below.
{% endtab %}

{% tab 'Scala 3' for=algebraic-data-demo %}
Scala 3 provides the concept of *enums* which can be used like Java's enum,
but also to implement ADTs. Here is how they can be used to define the type
of the trees for our example:
```scala
enum Tree:
  case Sum(left: Tree, right: Tree)
  case Var(n: String)
  case Const(v: Int)
```
The cases of the enum `Sum`, `Var` and `Const` are similar to standard classes,
but differ in several respects:
- getter functions are automatically defined for the constructor
  parameters (i.e., it is possible to get the value of the `v`
  constructor parameter of some instance `c` of case
  `Tree.Const` just by writing `c.v`),
- default definitions for methods `equals` and
  `hashCode` are provided, which work on the *structure* of
  the instances and not on their identity,
- a default definition for method `toString` is provided, and
  prints the value in a "source form" (e.g., the tree for expression
  `x+1` prints as `Sum(Var(x),Const(1))`),
- instances of these enum cases can be decomposed through
  *pattern matching* as we will see below.
{% endtab %}

{% endtabs %}

Now that we have defined the data-type to represent our arithmetic
expressions, we can start defining operations to manipulate them. We
will start with a function to evaluate an expression in some
*environment*. The aim of the environment is to give values to
variables. For example, the expression `x+1` evaluated in an
environment which associates the value `5` to variable `x`, written
`{ x -> 5 }`, gives `6` as result.

We therefore have to find a way to represent environments. We could of
course use some associative data-structure like a hash table, but we
can also directly use functions! An environment is really nothing more
than a function which associates a value to a (variable) name. The
environment `{ x -> 5 }` given above can be written as
follows in Scala:

{% tabs env-definition %}
{% tab 'Scala 2 and 3' for=env-definition %}
```scala
type Environment = String => Int
val ev: Environment = { case "x" => 5 }
```
{% endtab %}
{% endtabs %}

This notation defines a function which, when given the string
`"x"` as argument, returns the integer `5`, and fails with an
exception otherwise.

Above we defined a _type alias_ called `Environment` which is more
readable than the plain function type `String => Int`, and makes
future changes easier.

We can now give the definition of the evaluation function. Here is
a brief specification: the value of a `Sum` is the addition of the
evaluations of its two inner expressions; the value of a `Var` is obtained
by lookup of its inner name in the environment; and the value of a
`Const` is its inner value itself. This specification translates exactly into
Scala as follows, using a pattern match on a tree value `t`:

{% tabs patt-match-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=patt-match-demo %}
```scala
import Tree._

def eval(t: Tree, ev: Environment): Int = t match {
  case Sum(left, right) => eval(left, ev) + eval(right, ev)
  case Var(n)    => ev(n)
  case Const(v)  => v
}
```
{% endtab %}

{% tab 'Scala 3' for=patt-match-demo %}
```scala
import Tree.*

def eval(t: Tree, ev: Environment): Int = t match
  case Sum(left, right) => eval(left, ev) + eval(right, ev)
  case Var(n)    => ev(n)
  case Const(v)  => v
```
{% endtab %}

{% endtabs %}

You can understand the precise meaning of the pattern match as follows:

1. it first checks if the tree `t` is a `Sum`, and if it
   is, it binds the left sub-tree to a new variable called `left` and
   the right sub-tree to a variable called `right`, and then proceeds
   with the evaluation of the expression following the arrow; this
   expression can (and does) make use of the variables bound by the
   pattern appearing on the left of the arrow, i.e., `left` and
   `right`,
2. if the first check does not succeed, that is, if the tree is not
   a `Sum`, it goes on and checks if `t` is a `Var`; if
   it is, it binds the name contained in the `Var` node to a
   variable `n` and proceeds with the right-hand expression,
3. if the second check also fails, that is if `t` is neither a
   `Sum` nor a `Var`, it checks if it is a `Const`, and
   if it is, it binds the value contained in the `Const` node to a
   variable `v` and proceeds with the right-hand side,
4. finally, if all checks fail, an exception is raised to signal
   the failure of the pattern matching expression; this could happen
   here only if more sub-classes of `Tree` were declared.

We see that the basic idea of pattern matching is to attempt to match
a value to a series of patterns, and as soon as a pattern matches,
extract and name various parts of the value, to finally evaluate some
code which typically makes use of these named parts.

### Comparison to OOP

A programmer familiar with the object-oriented paradigm
might wonder why define a single function for `eval` outside
the scope of `Tree`, and not make `eval` and abstract method in
`Tree`, providing overrides in each subclass of `Tree`.

We could have done it actually, it is a choice to make, which has
important implications on extensibility:

- when using method overriding, adding a new operation to
  manipulate the tree implies far-reaching changes to the code,
  as it requires to add the method in all sub-classes of `Tree`,
  however, adding a new subclass only requires implementing the
  operations in one place. This design favours a few core operations
  and many growing subclasses,
- when using pattern matching, the situation is reversed: adding a
  new kind of node requires the modification of all functions which do
  pattern matching on the tree, to take the new node into account; on
  the other hand, adding a new operation only requires defining the function
  in one place. If your data structure has a stable set of nodes,
  it favours the ADT and pattern matching design.

### Adding a New Operation

To explore pattern matching further, let us define another operation
on arithmetic expressions: symbolic derivation. The reader might
remember the following rules regarding this operation:

1. the derivative of a sum is the sum of the derivatives,
2. the derivative of some variable `v` is one if `v` is the
   variable relative to which the derivation takes place, and zero
   otherwise,
3. the derivative of a constant is zero.

These rules can be translated almost literally into Scala code, to
obtain the following definition:

{% tabs derivation-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=derivation-demo %}
```scala
import Tree._

def derive(t: Tree, v: String): Tree = t match {
  case Sum(left, right)        => Sum(derive(left, v), derive(right, v))
  case Var(n) if v == n => Const(1)
  case _                => Const(0)
}
```
{% endtab %}

{% tab 'Scala 3' for=derivation-demo %}
```scala
import Tree.*

def derive(t: Tree, v: String): Tree = t match
  case Sum(left, right)        => Sum(derive(left, v), derive(right, v))
  case Var(n) if v == n => Const(1)
  case _                => Const(0)
```
{% endtab %}

{% endtabs %}

This function introduces two new concepts related to pattern matching.
First of all, the `case` expression for variables has a
*guard*, an expression following the `if` keyword. This
guard prevents pattern matching from succeeding unless its expression
is true. Here it is used to make sure that we return the constant `1`
only if the name of the variable being derived is the same as the
derivation variable `v`. The second new feature of pattern
matching used here is the *wildcard*, written `_`, which is
a pattern matching any value, without giving it a name.

We did not explore the whole power of pattern matching yet, but we
will stop here in order to keep this document short. We still want to
see how the two functions above perform on a real example. For that
purpose, let's write a simple `main` function which performs
several operations on the expression `(x+x)+(7+y)`: it first computes
its value in the environment `{ x -> 5, y -> 7 }`, then
computes its derivative relative to `x` and then `y`.

{% tabs calc-main class=tabs-scala-version %}

{% tab 'Scala 2' for=calc-main %}
```scala
import Tree._

object Calc {
  type Environment = String => Int
  def eval(t: Tree, ev: Environment): Int = ...
  def derive(t: Tree, v: String): Tree = ...

  def main(args: Array[String]): Unit = {
    val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
    val env: Environment = { case "x" => 5 case "y" => 7 }
    println("Expression: " + exp)
    println("Evaluation with x=5, y=7: " + eval(exp, env))
    println("Derivative relative to x:\n " + derive(exp, "x"))
    println("Derivative relative to y:\n " + derive(exp, "y"))
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=calc-main %}
```scala
import Tree.*

@main def Calc: Unit =
  val exp: Tree = Sum(Sum(Var("x"),Var("x")),Sum(Const(7),Var("y")))
  val env: Environment = { case "x" => 5 case "y" => 7 }
  println("Expression: " + exp)
  println("Evaluation with x=5, y=7: " + eval(exp, env))
  println("Derivative relative to x:\n " + derive(exp, "x"))
  println("Derivative relative to y:\n " + derive(exp, "y"))
```
{% endtab %}

{% endtabs %}

Executing this program, we should get the following output:
```
Expression: Sum(Sum(Var(x),Var(x)),Sum(Const(7),Var(y)))
Evaluation with x=5, y=7: 24
Derivative relative to x:
  Sum(Sum(Const(1),Const(1)),Sum(Const(0),Const(0)))
Derivative relative to y:
  Sum(Sum(Const(0),Const(0)),Sum(Const(0),Const(1)))
```

By examining the output, we see that the result of the derivative
should be simplified before being presented to the user. Defining a
basic simplification function using pattern matching is an interesting
(but surprisingly tricky) problem, left as an exercise for the reader.

## Traits

Apart from inheriting code from a super-class, a Scala class can also
import code from one or several *traits*.

Maybe the easiest way for a Java programmer to understand what traits
are is to view them as interfaces which can also contain code.  In
Scala, when a class inherits from a trait, it implements that trait's
interface, and inherits all the code contained in the trait.

(Note that since Java 8, Java interfaces can also contain code, either
using the `default` keyword, or as static methods.)

To see the usefulness of traits, let's look at a classical example:
ordered objects. It is often useful to be able to compare objects of a
given class among themselves, for example to sort them. In Java,
objects which are comparable implement the `Comparable`
interface. In Scala, we can do a bit better than in Java by defining
our equivalent of `Comparable` as a trait, which we will call
`Ord`.

When comparing objects, six different predicates can be useful:
smaller, smaller or equal, equal, not equal, greater or equal, and
greater. However, defining all of them is fastidious, especially since
four out of these six can be expressed using the remaining two. That
is, given the equal and smaller predicates (for example), one can
express the other ones. In Scala, all these observations can be
nicely captured by the following trait declaration:

{% tabs ord-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=ord-definition %}
```scala
trait Ord {
  def < (that: Any): Boolean
  def <=(that: Any): Boolean =  (this < that) || (this == that)
  def > (that: Any): Boolean = !(this <= that)
  def >=(that: Any): Boolean = !(this < that)
}
```
{% endtab %}

{% tab 'Scala 3' for=ord-definition %}
```scala
trait Ord:
  def < (that: Any): Boolean
  def <=(that: Any): Boolean =  (this < that) || (this == that)
  def > (that: Any): Boolean = !(this <= that)
  def >=(that: Any): Boolean = !(this < that)
```
{% endtab %}

{% endtabs %}

This definition both creates a new type called `Ord`, which
plays the same role as Java's `Comparable` interface, and
default implementations of three predicates in terms of a fourth,
abstract one. The predicates for equality and inequality do not appear
here since they are by default present in all objects.

The type `Any` which is used above is the type which is a
super-type of all other types in Scala. It can be seen as a more
general version of Java's `Object` type, since it is also a
super-type of basic types like `Int`, `Float`, etc.

To make objects of a class comparable, it is therefore sufficient to
define the predicates which test equality and inferiority, and mix in
the `Ord` class above. As an example, let's define a
`Date` class representing dates in the Gregorian calendar. Such
dates are composed of a day, a month and a year, which we will all
represent as integers. We therefore start the definition of the
`Date` class as follows:

{% tabs date-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=date-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord {
  def year = y
  def month = m
  def day = d
  override def toString(): String = s"$year-$month-$day"

  // rest of implementation will go here
}
```
{% endtab %}

{% tab 'Scala 3' for=date-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord:
  def year = y
  def month = m
  def day = d
  override def toString(): String = s"$year-$month-$day"

  // rest of implementation will go here
end Date
```
{% endtab %}

{% endtabs %}

The important part here is the `extends Ord` declaration which
follows the class name and parameters. It declares that the
`Date` class inherits from the `Ord` trait.

Then, we redefine the `equals` method, inherited from
`Object`, so that it correctly compares dates by comparing their
individual fields. The default implementation of `equals` is not
usable, because as in Java it compares objects by their identity. We arrive
at the following definition:

{% tabs equals-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=equals-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord {
  // previous decls here

  override def equals(that: Any): Boolean = that match {
    case d: Date => d.day == day && d.month == month && d.year == year
    case _ => false
  }

  // rest of implementation will go here
}
```
{% endtab %}

{% tab 'Scala 3' for=equals-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord:
  // previous decls here

  override def equals(that: Any): Boolean = that match
    case d: Date => d.day == day && d.month == month && d.year == year
    case _ => false

  // rest of implementation will go here
end Date
```
{% endtab %}

{% endtabs %}

While in Java (pre 16) you might use the `instanceof` operator followed by a cast
(equivalent to calling `that.isInstanceOf[Date]` and `that.asInstanceOf[Date]` in Scala);
in Scala it is more idiomatic to use a _type pattern_, shown in the example above which checks if `that` is an
instance of `Date`, and binds it to a new variable `d`, which is then used in the right hand side of the `case`.

Finally, the last method to define is the `<` test, as follows. It makes use of another method,
`error` from the package object `scala.sys`, which throws an exception with the given error message.

{% tabs lt-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=lt-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord {
  // previous decls here

  def <(that: Any): Boolean = that match {
    case d: Date =>
      (year < d.year) ||
      (year == d.year && (month < d.month ||
                         (month == d.month && day < d.day)))

    case _ => sys.error("cannot compare " + that + " and a Date")
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=lt-definition %}
```scala
class Date(y: Int, m: Int, d: Int) extends Ord:
  // previous decls here

  def <(that: Any): Boolean = that match
    case d: Date =>
      (year < d.year) ||
      (year == d.year && (month < d.month ||
                         (month == d.month && day < d.day)))

    case _ => sys.error("cannot compare " + that + " and a Date")
  end <
end Date
```
{% endtab %}

{% endtabs %}

This completes the definition of the `Date` class. Instances of
this class can be seen either as dates or as comparable objects.
Moreover, they all define the six comparison predicates mentioned
above: `equals` and `<` because they appear directly in
the definition of the `Date` class, and the others because they
are inherited from the `Ord` trait.

Traits are useful in other situations than the one shown here, of
course, but discussing their applications in length is outside the
scope of this document.

## Genericity

The last characteristic of Scala we will explore in this tutorial is
genericity. Java programmers should be well aware of the problems
posed by the lack of genericity in their language, a shortcoming which
is addressed in Java 1.5.

Genericity is the ability to write code parametrized by types. For
example, a programmer writing a library for linked lists faces the
problem of deciding which type to give to the elements of the list.
Since this list is meant to be used in many different contexts, it is
not possible to decide that the type of the elements has to be, say,
`Int`. This would be completely arbitrary and overly
restrictive.

Java programmers resort to using `Object`, which is the
super-type of all objects. This solution is however far from being
ideal, since it doesn't work for basic types (`int`,
`long`, `float`, etc.) and it implies that a lot of
dynamic type casts have to be inserted by the programmer.

Scala makes it possible to define generic classes (and methods) to
solve this problem. Let us examine this with an example of the
simplest container class possible: a reference, which can either be
empty or point to an object of some type.

{% tabs reference-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=reference-definition %}
```scala
class Reference[T] {
  private var contents: T = _
  def set(value: T): Unit = { contents = value }
  def get: T = contents
}
```
The class `Reference` is parametrized by a type, called `T`,
which is the type of its element. This type is used in the body of the
class as the type of the `contents` variable, the argument of
the `set` method, and the return type of the `get` method.

The above code sample introduces variables in Scala, which should not
require further explanations. It is however interesting to see that
the initial value given to that variable is `_`, which represents
a default value. This default value is `0` for numeric types,
`false` for the `Boolean` type, `()` for the `Unit`
type and `null` for all object types.
{% endtab %}

{% tab 'Scala 3' for=reference-definition %}
```scala
import compiletime.uninitialized

class Reference[T]:
  private var contents: T = uninitialized
  def set(value: T): Unit = contents = value
  def get: T = contents
```
The class `Reference` is parametrized by a type, called `T`,
which is the type of its element. This type is used in the body of the
class as the type of the `contents` variable, the argument of
the `set` method, and the return type of the `get` method.

The above code sample introduces variables in Scala, which should not
require further explanations. It is however interesting to see that
the initial value given to that variable is `uninitialized`, which represents
a default value. This default value is `0` for numeric types,
`false` for the `Boolean` type, `()` for the `Unit`
type and `null` for all object types.
{% endtab %}

{% endtabs %}

To use this `Reference` class, one needs to specify which type to use
for the type parameter `T`, that is the type of the element
contained by the cell. For example, to create and use a cell holding
an integer, one could write the following:

{% tabs reference-usage class=tabs-scala-version %}

{% tab 'Scala 2' for=reference-usage %}
```scala
object IntegerReference {
  def main(args: Array[String]): Unit = {
    val cell = new Reference[Int]
    cell.set(13)
    println("Reference contains the half of " + (cell.get * 2))
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=reference-usage %}
```scala
@main def IntegerReference: Unit =
  val cell = new Reference[Int]
  cell.set(13)
  println("Reference contains the half of " + (cell.get * 2))
```
{% endtab %}

{% endtabs %}

As can be seen in that example, it is not necessary to cast the value
returned by the `get` method before using it as an integer. It
is also not possible to store anything but an integer in that
particular cell, since it was declared as holding an integer.

## Conclusion

This document gave a quick overview of the Scala language and
presented some basic examples. The interested reader can go on, for example, by
reading the *[Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html)*, which
contains more explanations and examples, and consult the *Scala
  Language Specification* when needed.

[scala-book]: {% link _overviews/scala3-book/introduction.md %}
[maven-setup]: {% link _overviews/tutorials/scala-with-maven.md %}
[sbt-setup]: {% link _overviews/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.md %}#adding-a-dependency
