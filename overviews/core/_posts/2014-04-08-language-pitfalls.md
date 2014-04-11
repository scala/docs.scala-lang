---
layout: overview
title: Scala language pitfalls
disqus: true
label-color: important
label-text: Work in progress
---

**Jan Christopher Vogt,** *(contributors add yourself here)*

*work in progress*

**This document requires community contributions using [Github pull requests](https://github.com/scala/scala.github.com/blob/master/overviews/core/_posts/2014-04-08-language-pitfalls.md). Please fill in gaps, improve the examples and add important cases usig the [Template](#template).**

## Motivation

There are some pitfalls in Scala which can lead to unexpected behavior and frustration when you are not aware of them. The occasional blog posts or talks pointing out some of the issues make this clear. This guide is intended to collect these issues, their reasons and workarounds in order to better inform the community, especially Scala newcomers. Please point people to this guide and help improving and extending it.

## Initialization order

`val` member of classes, traits or objects are initialized in the order they are declared. If you refer to a val in a code location, where it has not been initialized yet, you see the Java default value instead (null, 0, 0.0, etc.).

Constructors of parent classes or traits are executed before their children

**Reason:** There is no good known solution to this problem in a language with OO and multiple-inheritance.

**Symptons:** NullPointerException or JVM default values for vals (e.g. 0 for Int)

**Suggested solution or workaround:**

**Examples 1:**

    class Vals {
      println(answer)
      private[this] val answer = 42
    }
    new Vals // prints 0

**Example 1 solution 1 - correct the order:**

Be aware of the order or use lazy vals or defs.

    class Vals {
      private[this] val answer = 42
      println(answer)
    }
    new Vals // prints 0

**Example 1 solution 2 - use a def or lazy val:**

    class Vals {
      println(answer)
      private[this] def answer = 42
    }
    new Vals // prints 0

**Example 2:**

    trait Foo{ val x = 5;  print(x) } 
    new Foo{} // prints 5 as expected
    new Foo{ override val x = 6 } // prints 0

**Example 2 solution:**

    // no solution for safely overriding a concrete val in parent class.
    // Use a def in the parent class as in Example 3

**Example 3:**

    trait Bar{ def x = 5;  print(x) }
    new Bar{} // prints 5 as expected
    new Bar{ val x = 6 } // prints 0

**Example 3 solution:**

    trait Bar{ def x = 5;  print(x) }
    new Bar{ def x = 6 } // prints 6
    new Bar{ lazy val x = 6 } // prints 6

**Example 4:**

    trait Baz{ val x: Int;  print(x) } 
    new Baz{ override val x = 6 } // prints 0

**Example 4 solution:**

    trait Baz{ val x: Int;  print(x) } 
    new Baz{ override lazy val x = 6 } // prints 6

**Further reading:**

// please add links to helpful, related blog posts, mailing list discussion, stackoverflow, etc.

## Collection methods returning Iterator 

Some collections methods return Iterator. If you are not aware of this, it can lead to surprising results, because [one should never use an iterator after calling a method on it](http://www.scala-lang.org/api/2.10.4/index.html#scala.collection.Iterator). Examples of such methods are `.permutations`, `.lines`, `.grouped` and `.sliding`.

**Reason:** An Iterator is cheap. It does not force any significant computation or memory overhead onto the user, who can always call `.toStream` if memoization is needed or `.toSeq` for strict materialization.

**Symptoms:** Unexpected return values or behavior.

**Suggested solution or workaround:** Convert Iterator to Stream, Seq or something else, if you need more than an iterator offers

**Example:**

    val p = Seq(1,2,3).permutations
    if (p.size < 10) {
      p foreach println // Doesn't print anything, as Iterator has already been exhausted
    }

**Solution:**

    val p = Seq(1,2,3).permutations.toStream
    if (p.size < 10) {
      p foreach println // prints as expected
    }

## Manually defined case class companion is not a function

The companion object of a case class can also be used as a function. In fact it extends Scala's function cass, if it is auto-generated. But if you define it by hand it does not anymore.

**Reason:** Not decided yet and tracked as a Scala issue here https://issues.scala-lang.org/browse/SI-3664 .

**Symptoms:** You cannot pass the companion object to something expecting a function anymore. You cannot call `.tupled` on the companion object.

**Suggested solution or workaround:** Either use .apply or extend the function type explicitly

**Example:**

    case class Foo( a: Int, b: String )
    object Foo{}
    Foo.tupled // <- compile error
    def bar[T]( f: (Int,String) => T ) = f(2,"test")
    bar(Foo) // <- compile error

**Solution 1:**

    case class Foo( a: Int, b: String )
    object Foo{}
    (Foo.apply _).tupled
    def bar[T]( f: (Int,String) => T ) = f(2,"test")
    bar(Foo.apply)

**Solution 2:**

    case class Foo( a: Int, b: String )
    object Foo extends ((Int,String) => Foo){}
    Foo.tupled
    def bar[T]( f: (Int,String) => T ) = f(2,"test")
    bar(Foo)

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

## Methods vs. functions and ETA-Expansion
Methods and functions in Scala are not the same thing. Methods are actual JVM methods. Functions are objects. ETA-expansion is the mechanism that turns a method into a function object. In important difference between the two in Scala is, that methods can have type arguments, functions cannot. During eta-expansion type arguments of the method are made concrete. Functions are first-class values and can be passed around, methods are not and cannot. This means a method needs to be eta-expanded (turned into a function) to be passed around. Eta-expansion can and sometimes has to be forced explicitly using the syntax `someMethod _`.

**Reason:** Java compatibility

**Symptoms:** E.g. error "missing parameter type for expanded function".

**Suggested solution or workaround:** Provide an explicit argument type

**Example 1:**

    val x = 5 + _ // error: missing parameter type for expanded function ((x$1) => 5.+(x$1))

**Solution 1 - explicit parameter type:**

    val x = 5 + (_: Int)
    val x: Int => Int = 5 + _


**Example 2:**

    def f(x: Int) {}
    Seq(1, 2) foreach f
    def g(x: => Int) {}
    Seq(1, 2) foreach g // does not compile

**Solution 2 - explicit eta expansion:**

    def f(x: Int) {}
    Seq(1, 2) foreach f
    def g(x: => Int) {}
    Seq(1, 2) foreach (g _) // explicit eta expansion

## Auto tupling
Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Example:**

    A code example demonstrating the unexpected behavior.

**Suggested solution or workaround:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.



## Parenthesis `( )` vs. `{ }`

Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    seq.foreach(x: Int => println(x))

**Solution:**

    seq foreach{x: Int => println(x)}

**Further reading:**

Links to related blog posts, papers, discussions.


## Unchecked vs. checked pattern matching 

Type tests in Scala's pattern matching are technically down-casts just like `.asInstanceOf`. Often they can be just as unsafe. Scala protects you from 

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** scala.MatchError runtime exception

**Suggested solution or workaround:** Use sealed traits if possible or `case _ =>`

**Example:**

    def foo(a: Any) = a match {
        case i:Int => i*i
    }
    foo(3) // 9
    foo("test") // MatchError

**Solution - provide a useful `case _ =>`:**

    def foo(a: Any) = a match {
        case i:Int => Some(i*i)
        case _ => None
    }
    foo(3) // Some(9)
    foo("test") // None

**Further reading:**

Links to related blog posts, papers, discussions.


## Complicated signatures with implicits

Scala's implicit add a lot of richness to the type system and allow things impossible in other languages. They can enforce stronger type-safety or allow type-based specialization of functionality. In a sense an implicit argument list can be considered an implementation detail of a method, which a user almost never has to think about. But as they are part of the signature they leak into the user interface of the method.

**Reason:** Implicit argument lists are in fact a part of the interface.

**Symptoms:** Surprisingly hard looking signatures in the API docs.

**Suggested solution or workaround:** Look at the correspoding documentated method of the same name tagged as *use case* instad. Or as a library author, write *use case* simplifications in your method documentations.

**Example - actual interface:**

    class List[A]{
        ...
        def map[B, That](f: (A) => B)(implicit bf: CanBuildFrom[List[A], B, That]): That
        ...
    }

**Solution - consider as use case interface:**

    class List[A]{
        ...
        def map[B](f: (A) => B)
        ...
    }

**Further reading:**

Links to related blog posts, papers, discussions.


## Inner classes / path-dependent types

Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.


## Mutability leaking into immutable collections


Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.

## Type-system limitations

Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.

## Compiler error messages

Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.





## Overloading
Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:**
Bad error messages, ETA-expansion can fail, unusable default parameters **(please add to this)** etc.

**Suggested solution or workaround:** Avoid overloading

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

[http://stackoverflow.com/questions/2510108/why-avoid-method-overloading](http://stackoverflow.com/questions/2510108/why-avoid-method-overloading)



## Similar guides

[http://scalatips.tumblr.com/](http://scalatips.tumblr.com/)


<a name="template"></a>
## Template

## Title
Description

**Reason:** Why does this problem exist or is this limitation in place?

**Symptoms:** What kind of behavior or errors does this lead to?

**Suggested solution or workaround:** General description how to fix it

**Example:**

    A code example demonstrating the unexpected behavior.

**Solution:**

    A modified code example fixing the original code example using a better implementation or workaround.

**Further reading:**

Links to related blog posts, papers, discussions.
