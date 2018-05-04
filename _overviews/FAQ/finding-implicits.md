---
layout: multipage-overview
title: Where does Scala look for implicits?

discourse: true

overview-name: FAQ
partof: FAQ

num: 7
permalink: /tutorials/FAQ/:title.html
---

Newcomers to Scala often ask: Where does the compiler look for implicits?

For example, where do the values for `integral` below come from?

    scala> import scala.math._
    import scala.math._

    scala> def foo[T](t: T)(implicit integral: Integral[T]): Unit = {
        println(integral)
    }
    foo: [T](t: T)(implicit integral: scala.math.Integral[T])Unit

    scala> foo(0)
    scala.math.Numeric$IntIsIntegral$@3dbea611

    scala> foo(0L)
    scala.math.Numeric$LongIsIntegral$@48c610af

The natural continuation of this line of inquiry leads to a second question: How
does the compiler choose which implicit to use, in certain situations of apparent
ambiguity (but that compile anyway)?

For instance, `scala.Predef` defines two conversions from `String`: one to
`WrappedString` and another to `StringOps`. Both classes, however, share a lot
of methods, so why doesn't Scala complain about ambiguity when, say, calling
`map`?

**Note:** this question was inspired by [this other question on Stack
Overflow][4], but states the problem in more general terms.  The example was
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

    def foo[T](t: T)(implicit integral: Integral[T]): Unit = {
        println(integral)
    }

### Implicit conversions as implicit parameters

There's one situation where an implicit is both an implicit conversion and an
implicit parameter. For example:

    def getIndex[T, CC](seq: CC, value: T)(implicit conv: CC => Seq[T]) = seq.indexOf(value)

    getIndex("abc", 'a')

The method `getIndex` can receive any object, as long as there is an implicit
conversion available from its class to `Seq[T]`. Because of that, a `String` can be
passed to `getIndex`, and it will work.

Behind the scenes, the compiler changes `seq.IndexOf(value)` to
`conv(seq).indexOf(value)`.

### Context Bounds

Another common pattern in implicit parameters is the _type class pattern_. This
pattern enables the provision of common interfaces to classes which did not
declare them. It can both serve as a bridge pattern -- gaining separation of
concerns -- and as an adapter pattern.

The `Integral` class mentioned above is a classic example of type class pattern.
Another example on Scala's standard library is `Ordering`. Scalaz is a library
that makes heavy use of this pattern.

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

As described above, there are several contexts in which an implicit value may be required 
for an expression to typecheck. The required implicit type is what determines
which value is selected. That value is found either in lexical scope or,
failing that, in what is called implicit scope.

### Implicits Defined in Lexical Scope

When a value of a certain name is required, lexical scope is searched for
a value with that name. Similarly, when an implicit value of a certain type is required,
lexical scope is searched for a value with that type.

Any such value which can be referenced with its "simple" name, without
selecting from another value using dotted syntax, is an eligible implicit value.

For example, here is a function that takes an implicit scaling factor.
The function requires a parameter of type `Int`, and there is a value
of that type in scope. The variable name `n` does not matter in this
case.

    implicit val n: Int = 5
    def scale(x: Int)(implicit y: Int) = x * y
    scale(5) // takes n from the current scope, with the result 25

The invocation can be rewritten `scale(5)(n)`. If `n` can be referenced
using its simple name, as shown here, it is eligible as an implicit value.

An implicit value can be introduced into scope by an import statement:

    import scala.collection.JavaConverters._
    def env = System.getenv().asScala   // extension method enabled by imported implicit
    val term = env("TERM")              // it's a Scala Map

There may be more than one such value because they have different names.

In that case, overload resolution is used to pick one of them. The algorithm
for overload resolution is the same used to choose the reference for a
given name, when more than one term in scope has that name. For example,
`println` is overloaded, and each overload takes a different parameter type.
An invocation of `println` requires selecting the correct overloaded method.

In implicit search, overload resolution chooses a value among more than one
that have the same required type. Usually this entails selecting a narrower
type or a value defined in a subclass relative to other eligible values.

The rule that the value must be accessible using its simple name means
that the normal rules for name binding apply.

In summary, a definition for `x` shadows a definition in
an enclosing scope. But a binding for `x` can also be introduced by
local imports. Imported symbols can't override definitions of the same
name in an enclosing scope. Similarly, wildcard imports can't override
an import of a specific name, and names in the current package that are
visible from other source files can't override imports or local definitions.

These are the normal rules for deciding what `x` means in a given context,
and also determine which value `x` is accessible by its simple name and
is eligible as an implicit.

This means that an implicit in scope can be disabled by shadowing it with
a term of the same name.

For example, here, `X.f` is supplied the imported `X.s`: `X.f(s)`.
The body of `f` uses an implicit `Int`, from the immediate scope,
which shadows the `n` from `Y`, which is therefore not an eligible
implicit value. The parameter `s` shadows the member `s`.

The method `g` does not compile because the implicit `t` is shadowed
by a `t` that is not implicit, so no implicit `T` is in scope.

    object Y {
      implicit val n: Int = 17
      trait T {
        implicit val i: Int = 17
        implicit def t: T   = ???
      }
      object X extends T {
        implicit val n: Int = 42
        implicit val s: String = "hello, world\n"
        def f(implicit s: String) = implicitly[String] * implicitly[Int]
        override def t: T = ???
        def g = implicitly[T]
      }
    }
    import Y.X._
    f

The invocation of `f` was enabled by importing from `Y.X.`. But it is
not convenient to require an import to access implicit values
providied by a package.

If an implicit value is not found in lexical scope, implicit search
continues in implicit scope.

### Implicits Defined in Implicit Scope

Implicit syntax can avoid the [import tax][1], which of course is a "sin tax,"
by leveraging "implicit scope", which depends on the type of the implicit
instead of imports in lexical scope.

When an implicit of type `T` is required, implicit scope includes
the companion object `T`:

    trait T
    object T { implicit val t: T = new T { } }

When an `F[T]` is required, implicit scope includes both the companion
of `F` and the companion of the type argument, e.g., `object C` for `F[C]`.

In addition, implicit scope includes the companions of the base classes
of `F` and `C`, including package objects, such as `p` for `p.F`.

### Companion Objects of a Type

There are two object companions of note here. First, the object companion of
the "source" type is looked into. For instance, inside the object `Option`
there is an implicit conversion to `Iterable`, so one can call `Iterable`
methods on `Option`, or pass `Option` to something expecting an `Iterable`. For
example:

    for {
        x <- List(1, 2, 3)
        y <- Some('x')
    } yield (x, y)

That expression is translated by the compiler into

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

This is how Scala found the implicit `Numeric[Int]` and `Numeric[Long]` in the
opening example, by the way, as they are found inside `Numeric`, not `Integral`.

### Implicit scope of an argument's type

If you have a method with an argument type `A`, then the implicit scope of type
`A` will also be considered. Here "implicit scope" means all these rules
will be applied recursively -- for example, the companion object of `A` will be
searched for implicits, as per the rule above.

Note that this does not mean the implicit scope of `A` will be searched for
conversions of that parameter alone, but of the whole expression. For example:

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
parameter. The implicit looked for above is `Ordering[A]`, where
`A` is an actual type, not type parameter: it is a _type argument_ to
`Ordering`. See section 7.2 of the [Scala Specification][6].

### Outer Objects for Nested Types

The principle is simple:

    class A(val n: Int) {
      class B(val m: Int) { require(m < n) }
    }
    object A {
      implicit def bToString(b: A#B) = "B: %d" format b.m
    }
    val a = new A(5)
    val b = new a.B(3)
    val s: String = b  // s == "B: 3"

A real world example of this would be welcome. Please share your example!

### Package Objects Can Contribute Implicit Values

An implicit value in a package object can be made available either
in lexical scope or in implicit scope.

To be available in lexical scope, the packages must be declared as nested packages:

    package object p { implicit val s: String = "hello, world" }
    package p {
      package q {
        object X { def f = implicitly[String] }
      }
    }

This is sensitive to name binding rules. The following example compiles
only if the package object is in a separate file, in which case the import is used:

    package object p { implicit val s: String = "hello, world" }
    package p {
      package q {
        object Y {
          implicit val s: String = "bye"
        }
        object X {
          import Y._
          def f = implicitly[String]
        }
      }
    }

A package object can also offer implicit values of types in subpackages:

    package object p { implicit val c: q.C = new q.C }
    package p.q {
      class C
      object X { def f = implicitly[C] }
    }

Here, the implicit is supplied in implicit scope of `C`.

### Call To Action

Avoid taking this question as being the final arbiter of what is happening.
If you do notice it has become out-of-date, do [open a ticket about it][7], or, if
you know how to correct it, please fix it.

Related questions of interest:

* [Context bounds](context-bounds.html)
* [Chaining implicits](chaining-implicits.html)

This question and answer were originally submitted on [Stack Overflow][3].

  [1]: http://jsuereth.com/scala/2011/02/18/2011-implicits-without-tax.html
  [2]: https://issues.scala-lang.org/browse/SI-4427
  [3]: http://stackoverflow.com/q/5598085/53013
  [4]: http://stackoverflow.com/questions/5512397/passing-scala-math-integral-as-implicit-parameter
  [5]: http://scala-lang.org/files/archive/spec/2.11/06-expressions.html
  [6]: http://scala-lang.org/files/archive/spec/2.11/07-implicits.html
  [7]: https://github.com/scala/docs.scala-lang/issues
