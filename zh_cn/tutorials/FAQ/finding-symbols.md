---
layout: overview-large
title: How do I find what some symbol means or does?

disqus: true

partof: FAQ
num: 1
outof: 9
---
Let's divide the operators, for the purpose of teaching, into **four categories**:

* Keywords/reserved symbols
* Automatically imported methods
* Common methods
* Syntactic sugars/composition

And let's see some arbitrary examples:

    ->    // Automatically imported method
    <-    // Keyword
    ||=   // Syntactic sugar
    ++=   // Syntactic sugar/composition or common method
    <=    // Common method
    _+_   // Keyword/composition
    ::    // Common method or object
    :+=   // Common method

The exact meaning of most of these methods depend on the class that is defining
them. For example, `<=` on `Int` means _"less than or equal to"_, but it might
mean something else in another class.  `::` is probably the method defined on
`List` but it _could_ also be the object of the same name.

So, let's see them.

Keywords/reserved symbols
-------------------------

There are a few symbols in Scala that are special and cannot be defined or used used as method names.
Two of them are considered proper keywords, while others are just "reserved". They are:

    // Keywords
    <-  // Used on for-comprehensions, to separate pattern from generator
    =>  // Used for function types, function literals and import renaming

    // Reserved
    ( )        // Delimit expressions and parameters
    [ ]        // Delimit type parameters
    { }        // Delimit blocks
    .          // Method call and path separator
    // /* */   // Comments
    #          // Used in type notations
    :          // Type ascription or context bounds
    <: >: <%   // Upper, lower and view bounds
    " """      // Strings
    '          // Indicate symbols and characters
    @          // Annotations and variable binding on pattern matching
    `          // Denote constant or enable arbitrary identifiers
    ,          // Parameter separator
    ;          // Statement separator
    _*         // vararg expansion
    _          // Many different meanings

These are all _part of the language_, and, as such, can be found in any text
that properly describe the language, such as [Scala Specification][1](PDF)
itself.

The last one, the underscore, deserve a special description, because it is
widely used, and has different meanings depending on the context. Here's a sample:

    import scala._    // Wild card -- all of Scala is imported
    import scala.{ Predef => _, _ } // Exclusion, everything except Predef
    def f[M[_]]       // Higher kinded type parameter
    def f(m: M[_])    // Existential type
    _ + _             // Anonymous function placeholder parameter
    m _               // Eta expansion of method into method value
    m(_)              // Partial function application
    _ => 5            // Discarded parameter
    case _ =>         // Wild card pattern -- matches anything
    f(xs: _*)         // Sequence xs is passed as multiple parameters to f(ys: T*)
    case Seq(xs @ _*) // Identifier xs is bound to the whole matched sequence

Automatically imported methods
------------------------------

If you did not find the symbol you are looking for in the list above, then
it must be a method, or part of one. But, often, you'll see some symbol and the
documentation for the class will not have that method. When this happens,
either you are looking at a composition of one or more methods with something
else, or the method has been imported into scope, or is available through an
imported implicit conversion.

These can also be found in ScalaDoc's [index][2].

Every Scala code has three automatic imports:

    // Not necessarily in this order
    import java.lang._
    import scala._
    import scala.Predef._

The first two only make classes and singleton objects available. The third one
contains all implicit conversions and imported methods, since [`Predef`][3] is
an object itself.

Looking inside `Predef` quickly shows some symbols:

    class <:<
    class =:=
    object <%<
    object =:=

Any other symbol will be made available through an _implicit conversion_. Just
look at the methods tagged with `implicit` that receive, as parameter, an
object of type that is receiving the method. For example:

    "a" -> 1  // Look for an implicit from String, AnyRef, Any or type parameter

In the above case, `->` is defined in the class [`ArrowAssoc`][4] through the
method `any2ArrowAssoc` that takes an object of type `A`, where `A` is an
unbounded type parameter to the same method.

Common methods
--------------

Many symbols are simply methods on a class. For instance, if you do

    List(1, 2) ++ List(3, 4)

You'll find the method `++` right on the ScalaDoc for [List][5]. However,
there's one convention that you must be aware when searching for methods.
Methods ending in colon (`:`) bind _to the right_ instead of the left. In other
words, while the above method call is equivalent to:

    List(1, 2).++(List(3, 4))

If I had, instead `1 :: List(2, 3)`, that would be equivalent to:

    List(2, 3).::(1)

So you need to look at the type found _on the right_ when looking for methods
ending in colon. Consider, for instance:

    1 +: List(2, 3) :+ 4

The first method (`+:`) binds to the right, and is found on `List`. The second
method (`:+`) is just a normal method, and binds to the left -- again, on
`List`.

Syntactic sugars/composition
-----------------------------

So, here's a few syntactic sugars that may hide a method:

    class Example(arr: Array[Int] = Array.fill(5)(0)) {
      def apply(n: Int) = arr(n)
      def update(n: Int, v: Int) = arr(n) = v
      def a = arr(0); def a_=(v: Int) = arr(0) = v
      def b = arr(1); def b_=(v: Int) = arr(1) = v
      def c = arr(2); def c_=(v: Int) = arr(2) = v
      def d = arr(3); def d_=(v: Int) = arr(3) = v
      def e = arr(4); def e_=(v: Int) = arr(4) = v
      def +(v: Int) = new Example(arr map (_ + v))
      def unapply(n: Int) = if (arr.indices contains n) Some(arr(n)) else None
    }

    var ex = new Example
    println(ex(0))  // calls apply(0)
    ex(0) = 2       // calls update(0, 2)
    ex.b = 3        // calls b_=(3)
    val ex(c) = 2   // calls unapply(2) and assigns result to c
    ex += 1         // substituted for ex = ex + 1

The last one is interesting, because *any* symbolic method can be combined to
form an assignment-like method that way.

And, of course, there's various combinations that can appear in code:

    (_+_) // An expression, or parameter, that is an anonymous function with
          // two parameters, used exactly where the underscores appear, and
          // which calls the "+" method on the first parameter passing the
          // second parameter as argument.

This answer was originally submitted in response to [this question on Stack Overflow][6].

  [1]: http://www.scala-lang.org/sites/default/files/linuxsoft_archives/docu/files/ScalaReference.pdf
  [2]: http://www.scala-lang.org/archives/downloads/distrib/files/nightly/docs/library/index.html#index.index-_
  [3]: http://www.scala-lang.org/api/current/index.html#scala.Predef$
  [4]: http://www.scala-lang.org/api/current/scala/Predef$$ArrowAssoc.html
  [5]: http://www.scala-lang.org/api/current/index.html#scala.collection.immutable.List
  [6]: http://stackoverflow.com/q/7888944/53013
