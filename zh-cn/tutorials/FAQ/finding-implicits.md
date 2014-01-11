---
layout: overview-large
title: Where does Scala look for implicits?

disqus: true

partof: FAQ
num: 7
---

An _implicit_ question to newcomers to Scala seems to be: where does the
compiler look for implicits? I mean implicit because the question never seems
to get fully formed, as if there weren't words for it. :-) For example, where
do the values for `integral` below come from?

    scala> import scala.math._
    import scala.math._
    
    scala> def foo[T](t: T)(implicit integral: Integral[T]) {println(integral)}
    foo: [T](t: T)(implicit integral: scala.math.Integral[T])Unit
    
    scala> foo(0)
    scala.math.Numeric$IntIsIntegral$@3dbea611
    
    scala> foo(0L)
    scala.math.Numeric$LongIsIntegral$@48c610af

Another question that does follow up to those who decide to learn the answer to
the first question is how does the compiler choose which implicit to use, in
certain situations of apparent ambiguity (but that compile anyway)?

For instance, `scala.Predef` defines two conversions from `String`: one to
`WrappedString` and another to `StringOps`. Both classes, however, share a lot
of methods, so why doesn't Scala complain about ambiguity when, say, calling
`map`?

**Note:** this question was inspired by [this other question on Stack
Overflow][4], but stating the problem in more general terms.  The example was
copied from there, because it is referred to in the answer.

## Types of Implicits

Implicits in Scala refers to either a value that can be passed "automatically",
so to speak, or a conversion from one type to another that is made
automatically.

### Implicit Conversion

Speaking very briefly about the latter type, if one calls a method `m` on an
object `o` of a class `C`, and that class does not support method `m`, then
Scala will look for an implicit conversion from `C` to something that _does_
support `m`. A simple example would be the method `map` on `String`:

    "abc".map(_.toInt)

`String` does not support the method `map`, but `StringOps` does, and there's
an implicit conversion from `String` to `StringOps` available (see `implicit
def augmentString` on `Predef`).

### Implicit Parameters

The other kind of implicit is the implicit _parameter_. These are passed to
method calls like any other parameter, but the compiler tries to fill them in
automatically. If it can't, it will complain. One _can_ pass these parameters
explicitly, which is how one uses `breakOut`, for example (see question about
`breakOut`, on a day you are feeling up for a challenge).

In this case, one has to declare the need for an implicit, such as the `foo`
method declaration:

    def foo[T](t: T)(implicit integral: Integral[T]) {println(integral)}

### View Bounds

There's one situation where an implicit is both an implicit conversion and an
implicit parameter. For example:

    def getIndex[T, CC](seq: CC, value: T)(implicit conv: CC => Seq[T]) = seq.indexOf(value)

    getIndex("abc", 'a')

The method `getIndex` can receive any object, as long as there is an implicit
conversion available from its class to `Seq[T]`. Because of that, I can pass a
`String` to `getIndex`, and it will work.

Behind the scenes, the compile changes `seq.IndexOf(value)` to
`conv(seq).indexOf(value)`.

This is so useful that there is a syntactic sugar to write them. Using this
syntactic sugar, `getIndex` can be defined like this:

    def getIndex[T, CC <% Seq[T]](seq: CC, value: T) = seq.indexOf(value)

This syntactic sugar is described as a _view bound_, akin to an _upper bound_
(`CC <: Seq[Int]`) or a _lower bound_ (`T >: Null`).

### Context Bounds

Another common pattern in implicit parameters is the _type class pattern_. This
pattern enables the provision of common interfaces to classes which did not
declare them. It can both serve as a bridge pattern -- gaining separation of
concerns -- and as an adapter pattern.

The `Integral` class you mentioned is a classic example of type class pattern.
Another example on Scala's standard library is `Ordering`. There's a library
that makes heavy use of this pattern, called Scalaz.

This is an example of its use:

    def sum[T](list: List[T])(implicit integral: Integral[T]): T = {
        import integral._   // get the implicits in question into scope
        list.foldLeft(integral.zero)(_ + _)
    }

There is also a syntactic sugar for it, called a _context bound_, which is made
less useful by the need to refer to the implicit. A straight conversion of that
method looks like this:

    def sum[T : Integral](list: List[T]): T = {
        val integral = implicitly[Integral[T]]
        import integral._   // get the implicits in question into scope
        list.foldLeft(integral.zero)(_ + _)
    }

Context bounds are more useful when you just need to _pass_ them to other
methods that use them. For example, the method `sorted` on `Seq` needs an
implicit `Ordering`. To create a method `reverseSort`, one could write:

    def reverseSort[T : Ordering](seq: Seq[T]) = seq.reverse.sorted

Because `Ordering[T]` was implicitly passed to `reverseSort`, it can then pass
it implicitly to `sorted`.

## Where do Implicits Come From?

When the compiler sees the need for an implicit, either because you are calling
a method which does not exist on the object's class, or because you are calling
a method that requires an implicit parameter, it will search for an implicit
that will fit the need.

This search obey certain rules that define which implicits are visible and
which are not. The following table showing where the compiler will search for
implicits was taken from an excellent [presentation][1] about implicits by Josh
Suereth, which I heartily recommend to anyone wanting to improve their Scala
knowledge. It has been complemented since then with feedback and updates.

The implicits available under number 1 below has precedence over the ones under
number 2. Other than that, if there are several eligible arguments which match
the implicit parameter’s type, a most specific one will be chosen using the rules
of static overloading resolution (see [Scala Specification][5] §6.26.3).

1. First look in current scope
    * Implicits defined in current scope
    * Explicit imports
    * wildcard imports
    * <strike>Same scope in other files</strike>
2. Now look at associated types in
    * Companion objects of a type
    * Implicit scope of an argument's type **(2.9.1)**
    * Implicit scope of type arguments **(2.8.0)**
    * Outer objects for nested types
    * Other dimensions

Let's give examples for them.

### Implicits Defined in Current Scope

    implicit val n: Int = 5
    def add(x: Int)(implicit y: Int) = x + y
    add(5) // takes n from the current scope

### Explicit Imports

    import scala.collection.JavaConversions.mapAsScalaMap
    def env = System.getenv() // Java map
    val term = env("TERM")    // implicit conversion from Java Map to Scala Map
    
### Wildcard Imports

    def sum[T : Integral](list: List[T]): T = {
        val integral = implicitly[Integral[T]]
        import integral._   // get the implicits in question into scope
        list.foldLeft(integral.zero)(_ + _)
    }

### Same Scope in Other Files

**Edit**: It seems this does not have a different precedence. If you have some
example that demonstrates a precedence distinction, please make a comment.
Otherwise, don't rely on this one.

This is like the first example, but assuming the implicit definition is in a
different file than its usage. See also how [package objects][2] might be used
in to bring in implicits.

### Companion Objects of a Type

There are two object companions of note here. First, the object companion of
the "source" type is looked into. For instance, inside the object `Option`
there is an implicit conversion to `Iterable`, so one can call `Iterable`
methods on `Option`, or pass `Option` to something expecting an `Iterable`. For
example:

    for {
        x <- List(1, 2, 3)
        y <- Some('x')
    } yield, (x, y)

That expression is translated by the compile into

    List(1, 2, 3).flatMap(x => Some('x').map(y => (x, y)))

However, `List.flatMap` expects a `TraversableOnce`, which `Option` is not. The
compiler then looks inside `Option`'s object companion and finds the conversion
to `Iterable`, which is a `TraversableOnce`, making this expression correct.

Second, the companion object of the expected type:

    List(1, 2, 3).sorted

The method `sorted` takes an implicit `Ordering`. In this case, it looks inside
the object `Ordering`, companion to the class `Ordering`, and finds an implicit
`Ordering[Int]` there.

Note that companion objects of super classes are also looked into. For example:

    class A(val n: Int)
    object A { 
        implicit def str(a: A) = "A: %d" format a.n
    }
    class B(val x: Int, y: Int) extends A(y)
    val b = new B(5, 2)
    val s: String = b  // s == "A: 2"

This is how Scala found the implicit `Numeric[Int]` and `Numeric[Long]` in your
question, by the way, as they are found inside `Numeric`, not `Integral`.
    
### Implicit scope of an argument's type

If you have a method with an argument type `A`, then the implicit scope of type
`A` will also be considered. By "implicit scope" I mean that all these rules
will be applied recursively -- for example, the companion object of `A` will be
searched for implicits, as per the rule above.

Note that this does not mean the implicit scope of `A` will be searched for
conversions of that parameter, but of the whole expression. For example:

    class A(val n: Int) {
      def +(other: A) = new A(n + other.n)
    }
    object A {
      implicit def fromInt(n: Int) = new A(n)
    }

    // This becomes possible:
    1 + new A(1)
    // because it is converted into this:
    A.fromInt(1) + new A(1)

**This available only since Scala 2.9.1.**

### Implicit scope of type arguments

This is required to make the type class pattern really work. Consider
`Ordering`, for instance... it comes with some implicits in its companion
object, but you can't add stuff to it. So how can you make an `Ordering` for
your own class that is automatically found?

Let's start with the implementation:

    class A(val n: Int)
    object A {
        implicit val ord = new Ordering[A] {
            def compare(x: A, y: A) = implicitly[Ordering[Int]].compare(x.n, y.n)
        }
    }

So, consider what happens when you call

    List(new A(5), new A(2)).sorted

As we saw, the method `sorted` expects an `Ordering[A]` (actually, it expects
an `Ordering[B]`, where `B >: A`). There isn't any such thing inside
`Ordering`, and there is no "source" type on which to look. Obviously, it is
finding it inside `A`, which is a _type argument_ of `Ordering`.

This is also how various collection methods expecting `CanBuildFrom` work: the
implicits are found inside companion objects to the type parameters of
`CanBuildFrom`.

**Note**: `Ordering` is defined as `trait Ordering[T]`, where `T` is a type
parameter. Previously, I said that Scala looked inside type parameters, which
doesn't make much sense. The implicit looked for above is `Ordering[A]`, where
`A` is an actual type, not type parameter: it is a _type argument_ to
`Ordering`. See section 7.2 of the [Scala Specification][5].

**This available only since Scala 2.8.0.**

### Outer Objects for Nested Types

I haven't actually seen examples of this. I'd be grateful if someone could
share one. The principle is simple:

    class A(val n: Int) {
      class B(val m: Int) { require(m < n) }
    }
    object A {
      implicit def bToString(b: A#B) = "B: %d" format b.m
    }
    val a = new A(5)
    val b = new a.B(3)
    val s: String = b  // s == "B: 3"

### Other Dimensions

I'm pretty sure this was a joke, but this answer might not be up-to-date. So
don't take this question as being the final arbiter of what is happening, and
if you do noticed it has gotten out-of-date, do open a ticket about it, or, if
you know how to correct it, please fix it. It's a wiki after all.

**EDIT**

Related questions of interest:

* [Context and view bounds](context-and-view-bounds.html)
* [Chaining implicits](chaining-implicits.html)

This question and answer were originally submitted on [Stack Overflow][3].

  [1]: http://suereth.blogspot.com/2011/02/slides-for-todays-nescala-talk.html
  [2]: http://lampsvn.epfl.ch/trac/scala/ticket/4427
  [3]: http://stackoverflow.com/q/5598085/53013
  [4]: http://stackoverflow.com/questions/5512397/passing-scala-math-integral-as-implicit-parameter
  [5]: www.scala-lang.org/docu/files/ScalaReference.pdf

