---
layout: multipage-overview
title: How do I find what some symbol means or does?

discourse: true

overview-name: FAQ
partof: FAQ

num: 1

permalink: /tutorials/FAQ/:title.html
---
We can divide the operators in Scala, for the purpose of teaching, into four categories:

* Keywords/reserved symbols
* Normal methods or values
* Methods provided by implicit conversion
* Syntactic sugars/composition

And let's see some arbitrary examples:

    <-    // Keyword
    ->    // Method provided by implicit conversion
    <=    // Common method
    ++=   // Can be a common method or syntactic sugar involving ++ method
    ::    // Common method or object
    _+_   // Not really a single operator; it's parsed as _ + _

The exact meaning of most of these methods depends on the class they are defined
on. For example, `<=` on `Int` means _"less than or equal to"_, but it might
mean something else in another class.  `::` in an expression is probably the method of the class
`List` but it can also refer to the object of the same name (and in a pattern it
definitely does).

So, let's discuss these categories.

Keywords/reserved symbols
-------------------------

There are a few symbols in Scala that are special and cannot be defined or used as method names.
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
    <: >:      // Upper and lower bounds
    <%         // View bounds (deprecated)
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

Common methods
--------------

Many symbols are simply methods of a class, a trait, or an object. For instance, if you do

    List(1, 2) ++ List(3, 4)

You'll find the method `++` right on the Scaladoc for [List][5]. However,
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

If the name ends in `=`, look for the method called the same without `=` and
read the last section.

If you aren't sure what the type of the receiver is, you can look up the symbol
on the Scaladoc [index page for identifiers not starting with letters][2] (for
standard Scala library; of course, third-party libraries can add their own
symbolic methods, for which you should look at the corresponding page of _their_
Scaladoc).

Types and objects can also have symbolic names; in particular, it should be mentioned
that for types with two type parameters the name can be written _between_ parameters,
so that e.g. `Int <:< Any` is the same as `<:<[Int, Any]`.

Methods provided by implicit conversion
---------------------------------------

If you did not find the symbol you are looking for in the list of reserved symbols, then
it must be a method, or part of one. But, often, you'll see some symbol and the
documentation for the class will not have that method. When this happens,
either you are looking at a composition of one or more methods with something
else, or the method has been imported into scope, or is available through an
imported implicit conversion.

These can also be found in Scaladoc's [index][2], as mentioned above.

All Scala code has three automatic imports:

    // Not necessarily in this order
    import java.lang._
    import scala._
    import scala.Predef._

The first two only make classes and singleton objects available, none of which
look like operators. [`Predef`][3] is the only interesting one for this post.

Looking inside `Predef` shows some symbolic names:

    class <:<
    class =:=
    object =:=
    object <%< // removed in Scala 2.10
    def ???

There is also `::`, which doesn't appear in the Scaladoc, but is mentioned in the comments.
In addition, `Predef` makes some methods available through _implicit conversions_. Just
look at the methods and classes with `implicit` modifier that receive, as parameter, an
object of type that is receiving the method. For example, consider `"a" -> 1`. We need
to look for an implicit which works on `"a"`, and so it can take `String`, one of its
supertypes (`AnyRef` or `Any`) or a type parameter. In this case, we find
`implicit final class ArrowAssoc[A](private val self: A)` which makes this implicit
avaialable on all types.

Other implicit conversions may be visible in your scope depending on imports, extended types or
self-type annotations. See [Finding implicits](finding-implicits.html) for details.

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

    val ex = new Example
    println(ex(0))  // means ex.apply(0)
    ex(0) = 2       // means ex.update(0, 2)
    ex.b = 3        // means ex.b_=(3)
    val ex(c) = 2   // calls ex.unapply(2) and assigns result to c, if it's Some; throws MatchError if it's None
    ex += 1         // means ex = ex + 1; if Example had a += method, it would be used instead

The last one is interesting, because *any* symbolic method can be combined with `=` in that way.

And, of course, all of the above can be combined in various combinations, e.g.

    (_+_) // An expression, or parameter, that is an anonymous function with
          // two parameters, used exactly where the underscores appear, and
          // which calls the "+" method on the first parameter passing the
          // second parameter as argument.

This answer was originally submitted in response to [this question on Stack Overflow][6].

  [1]: http://scala-lang.org/files/archive/spec/2.11/
  [2]: http://www.scala-lang.org/api/current/index.html#index.index-_
  [3]: http://www.scala-lang.org/api/current/index.html#scala.Predef$
  [4]: http://www.scala-lang.org/api/current/scala/Predef$$ArrowAssoc.html
  [5]: http://www.scala-lang.org/api/current/index.html#scala.collection.immutable.List
  [6]: http://stackoverflow.com/q/7888944/53013
