---
type: chapter
layout: multipage-overview
title: Prelude꞉ A Taste of Scala
description: This page shares a Taste Of Scala example, quickly covering Scala's main features.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 2
outof: 54
previous-page: introduction
next-page: preliminaries
---

Our hope in this book is to demonstrate that [Scala](http://scala-lang.org) is a beautiful, modern, expressive programming language. To help demonstrate that, in this first chapter we’ll jump right in and provide a whirlwind tour of Scala’s main features. After this tour, the book begins with a more traditional “Getting Started” chapter.

>In this book we assume that you’ve used a language like Java before, and are ready to see a series of Scala examples to get a feel for what the language looks like. Although it’s not 100% necessary, it will also help if you’ve already [downloaded and installed Scala](https://www.scala-lang.org/download) so you can test the examples as you go along. You can also test these examples online with [ScalaFiddle.io](https://scalafiddle.io).



## Overview

Before we jump into the examples, here are a few important things to know about Scala:

- It’s a high-level language
- It’s statically typed
- Its syntax is concise but still readable — we call it *expressive*
- It supports the object-oriented programming (OOP) paradigm
- It supports the functional programming (FP) paradigm
- It has a sophisticated type inference system
- Scala code results in *.class* files that run on the Java Virtual Machine (JVM)
- It’s easy to use Java libraries in Scala



## Hello, world

Ever since the book, *C Programming Language*, it’s been a tradition to begin programming books with a “Hello, world” example, and not to disappoint, this is one way to write that example in Scala:

```scala
object Hello extends App {
    println("Hello, world")
}
```

After you save that code to a file named *Hello.scala*, you can compile it with `scalac`:

```sh
$ scalac Hello.scala
```

If you’re coming to Scala from Java, `scalac` is just like `javac`, and that command creates two files:

- *Hello$.class*
- *Hello.class*

These are the same “.class” bytecode files you create with `javac`, and they’re ready to run in the JVM. You run the `Hello` application with the `scala` command:

```sh
$ scala Hello
```

We share more “Hello, world” examples in the lessons that follow, so we’ll leave that introduction as-is for now.



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. We introduce it early here so you can use it with the code examples that follow.

To start a REPL session, just type `scala` at your operating system command line, and you’ll see something like this:

```scala
$ scala
Welcome to Scala 2.13.0 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_131).
Type in expressions for evaluation. Or try :help.

scala> _
```

Because the REPL is a command-line interpreter, it just sits there waiting for you to type something. Inside the REPL you type Scala expressions to see how they work:

```scala
scala> val x = 1
x: Int = 1

scala> val y = x + 1
y: Int = 2
```

As those examples show, after you type your expressions in the REPL, it shows the result of each expression on the line following the prompt.



## Two types of variables

Scala has two types of variables:

- `val` is an immutable variable — like `final` in Java — and should be preferred
- `var` creates a mutable variable, and should only be used when there is a specific reason to use it
- Examples:

```scala
val x = 1   //immutable
var y = 0   //mutable
```



## Declaring variable types

In Scala, you typically create variables without declaring their type:

```scala
val x = 1
val s = "a string"
val p = new Person("Regina")
```

When you do this, Scala can usually infer the data type for you, as shown in these REPL examples:

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string
```

This feature is known as *type inference*, and it’s a great way to help keep your code concise. You can also *explicitly* declare a variable’s type, but that’s not usually necessary:

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = new Person("Regina")
```

As you can see, that code looks unnecessarily verbose.



## Control structures

Here’s a quick tour of Scala’s control structures.


### if/else

Scala’s if/else control structure is similar to other languages:

```scala
if (test1) {
    doA()
} else if (test2) {
    doB()
} else if (test3) {
    doC()
} else {
    doD()
}
```

However, unlike Java and many other languages, the if/else construct returns a value, so, among other things, you can use it as a ternary operator:

```scala
val x = if (a < b) a else b
```


### match expressions

Scala has a `match` expression, which in its most basic use is like a Java `switch` statement:

```scala
val result = i match {
    case 1 => "one"
    case 2 => "two"
    case _ => "not 1 or 2"
}
```

The `match` expression isn’t limited to just integers, it can be used with any data type, including booleans:

```scala
val booleanAsString = bool match {
    case true => "true"
    case false => "false"
}
```

Here’s an example of `match` being used as the body of a method, and matching against many different types:

```scala
def getClassAsString(x: Any):String = x match {
    case s: String => s + " is a String"
    case i: Int => "Int"
    case f: Float => "Float"
    case l: List[_] => "List"
    case p: Person => "Person"
    case _ => "Unknown"
}
```

Powerful match expressions are a big feature of Scala, and we share more examples of it later in this book.



### try/catch

Scala’s try/catch control structure lets you catch exceptions. It’s similar to Java, but its syntax is consistent with match expressions:

```scala
try {
    writeToFile(text)
} catch {
    case fnfe: FileNotFoundException => println(fnfe)
    case ioe: IOException => println(ioe)
}
```


### for loops and expressions

Scala `for` loops — which we generally write in this book as *for-loops* — look like this:

```scala
for (arg <- args) println(arg)

// "x to y" syntax
for (i <- 0 to 5) println(i)

// "x to y by" syntax
for (i <- 0 to 10 by 2) println(i)
```

You can also add the `yield` keyword to for-loops to create *for-expressions* that yield a result. Here’s a for-expression that doubles each value in the sequence 1 to 5:

```scala
val x = for (i <- 1 to 5) yield i * 2
```

Here’s another for-expression that iterates over a list of strings:

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for {
    f <- fruits
    if f.length > 4
} yield f.length
```

Because Scala code generally just makes sense, we’ll imagine that you can guess how this code works, even if you’ve never seen a for-expression or Scala list until now.


### while and do/while

Scala also has `while` and `do`/`while` loops. Here’s their general syntax:

```scala
// while loop
while(condition) {
    statement(a)
    statement(b)
}

// do-while
do {
   statement(a)
   statement(b)
} 
while(condition)
```



## Classes

Here’s an example of a Scala class:

```scala
class Person(var firstName: String, var lastName: String) {
    def printFullName() = println(s"$firstName $lastName")
}
```

This is how you use that class:

```scala
val p = new Person("Julia", "Kern")
println(p.firstName)
p.lastName = "Manes"
p.printFullName()
```

Notice that there’s no need to create “get” and “set” methods to access the fields in the class.

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

In that code, an `ArrayBuffer` is like Java’s `ArrayList`. The `CrustSize`, `CrustType`, and `Topping` classes aren’t shown, but you can probably understand how that code works without needing to see those classes.



## Scala methods

Just like other OOP languages, Scala classes have methods, and this is what the Scala method syntax looks like:

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

There are more things you can do with methods, such as providing default values for method parameters, but that’s a good start for now.



## Traits

Traits in Scala are a lot of fun, and they also let you break your code down into small, modular units. To demonstrate traits, here’s an example from later in the book. Given these three traits:

```scala
trait Speaker {
    def speak(): String  // has no body, so it’s abstract
}

trait TailWagger {
    def startTail(): Unit = println("tail is wagging")
    def stopTail(): Unit = println("tail is stopped")
}

trait Runner {
    def startRunning(): Unit = println("I’m running")
    def stopRunning(): Unit = println("Stopped running")
}
```

You can create a `Dog` class that extends all of those traits while providing behavior for the `speak` method:

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner {
    def speak(): String = "Woof!"
}
```

Similarly, here’s a `Cat` class that shows how to override multiple trait methods:

```scala
class Cat extends Speaker with TailWagger with Runner {
    def speak(): String = "Meow"
    override def startRunning(): Unit = println("Yeah ... I don’t run")
    override def stopRunning(): Unit = println("No need to stop")
}
```

If that code makes sense — great, you’re comfortable with traits! If not, don’t worry, we explain it in detail later in the book.



## Collections classes

If you’re coming to Scala from Java and you’re ready to really jump in and learn Scala, it’s possible to use the Java collections classes in Scala, and some people do so for several weeks or months while getting comfortable with Scala. But it’s highly recommended that you learn the basic Scala collections classes — `List`, `ListBuffer`, `Vector`, `ArrayBuffer`, `Map`, and `Set` — as soon as possible. A great benefit of the Scala collections classes is that they offer many powerful methods that you’ll want to start using as soon as possible to simplify your code.


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



## Tuples

Tuples let you put a heterogenous collection of elements in a little container. Tuples can contain between two and 22 values, and they can all be different types. For example, given a `Person` class like this:

```scala
class Person(var name: String)
```

You can create a tuple that contains three different types like this:

```scala
val t = (11, "Eleven", new Person("Eleven"))
```

You can access the tuple values by number:

```scala
t._1
t._2
t._3
```

Or assign the tuple fields to variables:

```scala
val (num, string, person) = (11, "Eleven", new Person("Eleven"))
```

Tuples are nice for those times when you need to put a little “bag” of things together for a little while.



## What we haven’t shown

While that was whirlwind introduction to Scala in about ten printed pages, there are many things we haven’t shown yet, including:

- Strings and built-in numeric types
- Packaging and imports
- How to use Java collections classes in Scala
- How to use Java libraries in Scala
- How to build Scala projects
- How to perform unit testing in Scala
- How to write Scala shell scripts
- Maps, Sets, and other collections classes
- Object-oriented programming
- Functional programming
- Concurrency with Futures
- More ...

If you like what you’ve seen so far, we hope you’ll like the rest of the book.



## A bit of background

Scala was created by [Martin Odersky](https://en.wikipedia.org/wiki/Martin_Odersky), who studied under [Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth), who created Pascal and several other languages. Mr. Odersky is one of the co-designers of Generic Java, and is also known as the “father” of the `javac` compiler.










