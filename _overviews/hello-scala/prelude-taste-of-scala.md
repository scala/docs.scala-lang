---
layout: multipage-overview
title: A Taste of Scala
description: This page shares a Taste Of Scala example, quickly covering Scala's main features.
partof: hello_scala
overview-name: Hello, Scala
num: 2
---

My hope in this book is to demonstrate that [Scala](http://scala-lang.org) is a beautiful, modern, expressive programming language. To help demonstrate that, in this first chapter I’m going to jump right in and provide a whirlwind tour of Scala’s main features in the next ten pages. After this tour, the book begins with a more traditional “Getting Started” chapter.

>In this book I assume that you’ve used a language like Java before, and are ready to see a series of Scala examples to get a feel for what the language looks like. Although it’s not 100% necessary, it will also help if you’ve already [downloaded and installed Scala](https://www.scala-lang.org/download) so you can test the examples as you go along. You can also test these examples online with [ScalaFiddle.io](https://scalafiddle.io/).



## Overview

Before we jump into the examples, here are a few important things to know about Scala:

- It’s a high-level language
- It’s statically typed
- It’s syntax is concise but still readable — we call it *expressive*
- It supports the object-oriented programming (OOP) paradigm
- It supports the functional programming (FP) paradigm
- It has a sophisticated type inference system
- It has traits, which are a combination of interfaces and abstract classes that can be used as mixins, and support a modular programming style
- Scala code results in *.class* files that run on the Java Virtual Machine (JVM)
- It’s easy to use Java libraries in Scala



## Hello, world

Ever since the book, *C Programming Language*, it’s been tradition to begin programming books with a “Hello, world” example, and not to disappoint, this is one way to write that example in Scala:

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

I share more “Hello, world” examples in the lessons that follow, so I’ll leave that introduction as is for now.



## The Scala REPL

The Scala REPL (“Read-Evaluate-Print-Loop”) is a command-line interpreter that you use as a “playground” area to test your Scala code. I introduce it early here so you can use it with the code examples that follow.

To start a REPL session, just type `scala` at your operating system command line, and you’ll see something like this:

```scala
$ scala
Welcome to Scala 2.12.4 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_131).
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



## Implicit and explicit variable types

In Scala, you typically create variables without declaring their type (i.e., in an “implicit type” style):

```scala
val x = 1
val s = "a string"
val p = new Person("Regina")
```

You can also *explicitly* declare a variable’s type, but that’s not usually necessary:

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = new Person("Regina")
```

Because showing a variable’s type like that isn’t necessary and actually feels needlessly verbose, I rarely use this explicit syntax. (I explain *when* I use it later in the book.)



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

The if/else construct returns a value, so, among other things, you can use it as a ternary operator:

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

Powerful match expressions are a big feature of Scala.



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

Scala `for` loops (which I write as “for-loops”) look like this:

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

Because Scala code generally just makes, I’ll imagine that you can guess how this code works, even if you’ve never seen a for-expression or Scala list until now.

>Scala also has `while` loops, but I rarely use them.



## Classes

Here’s an example of a Scala class:

```scala
class Person(var firstName: String, var lastName: String) {
    def printFullName() {
        println(s"$firstName $lastName")
    }
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
    def addTopping(t: Topping): Unit = { toppings += t }
    def removeTopping(t: Topping): Unit = { toppings -= t }
    def removeAllToppings(): Unit = { toppings.clear() }
}
```

In that code, an `ArrayBuffer` is like Java’s `ArrayList`. I don’t show the `CrustSize`, `CrustType`, and `Topping` classes, but I suspect that you can understand how that code works without needing to see those classes.



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
    def startTail(): Unit = { println("tail is wagging") }
    def stopTail(): Unit = { println("tail is stopped") }
}

trait Runner {
    def startRunning(): Unit = { println("I'm running") }
    def stopRunning(): Unit = { println("Stopped running") }
}
```

You can create a `Dog` class that extends all of those traits while providing behavior for the `speak` method:

```scala
class Dog(name: String) extends Speaker with TailWagger with Runner {
    def speak(): String = "Woof!"
}
```

Similarly, here’s a `Cat` class that shows how to override trait methods:

```scala
class Cat extends Speaker with TailWagger with Runner {
    def speak(): String = "Meow"
    override def startRunning(): Unit = { println("Yeah ... I don't run") }
    override def stopRunning(): Unit = { println("No need to stop") }
}
```

If that code makes sense — great, you’re comfortable with traits! If not, don’t worry, I explain it in detail later in the book. As a last example, if you’re comfortable using traits as mixins, you might like this example:

```scala
val d = new Dog("Fido") with TailWagger with Runner
                        ---------------------------
```

In that example the traits `TailWagger` and `Runner` are mixed into `Dog` as a new `Dog` instance is created.



## Collections classes

Based on my own experience, here’s an important rule to know about Scala’s collections classes:

>Forget what you know about Java collections classes, and use the Scala collections classes.

You *can* use the Java collections classes in Scala, and I did so for several months, but when you do that, you’re slowing down your own learning process. The Scala collections classes offer many powerful methods that you’ll want to start using ASAP.


### Populating lists

There are times when it’s helpful to create sample lists that are populated with data, and Scala offers many ways to populate lists. Here are just a few:

```scala
val nums = List.range(0, 10)
val nums = 1 to 10 by 2 toList
val letters = ('a' to 'f').toList
val letters = ('a' to 'f') by 2 toList
```

### Sequence methods

While there are many sequential collections classes you can use, let’s look at some examples of what you can do with the Scala `List` class. Given these two lists:

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

Even though I didn’t explain it, you can see how `map` works: It applies an algorithm you supply to every element in the collection, returning a new, transformed value for each element.

If you’re ready to see one of the most powerful collections methods, here’s `reduce`:

```scala
scala> nums.reduce(_ + _)
res0: Int = 55

scala> nums.reduce(_ * _)
res1: Int = 3628800
```

Even though I didn’t explain `reduce`, you can guess that the first example yields the sum of the numbers in `nums`, and the second example returns the product of all those numbers.

There are many (many!) more methods available to Scala collections classes, but hopefully this gives you an idea of their power.

>There’s so much power in the Scala collections class, I spend over 100 pages discussing them in the *Scala Cookbook*.



## Tuples

Tuples let you put a heterogenous collection of elements in a little container. Tuples can contain between two and 22 variables, and they can all be different types. For example, given a `Person` class like this:

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
val(num, string, person) = (11, "Eleven", new Person("Eleven"))
```

I don’t overuse them, but tuples are nice for those times when you need to put a little “bag” of things together for a little while.



## What I haven’t shown

While that was whirlwind introduction to Scala in about ten pages, there are many things I haven’t shown yet, including:

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
- Concurrency with Futures and Akka
- More ...

If you like what you’ve seen so far, I hope you’ll like the rest of the book.



## A bit of background

Scala was created by [Martin Odersky](https://en.wikipedia.org/wiki/Martin_Odersky), who studied under [Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth), who created Pascal and several other languages. Mr. Odersky is one of the co-designers of Generic Java, and is also known as the “father” of the `javac` compiler.










