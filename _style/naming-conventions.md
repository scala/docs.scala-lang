---
layout: style-guide
title: Naming Conventions

partof: style
overview-name: "Style Guide"

num: 3

previous-page: indentation
next-page: types
---

Generally speaking, Scala uses "camel case" naming. That is,
each word is capitalized, except possibly the first word:

    UpperCamelCase
    lowerCamelCase

Acronyms should be treated as normal words:

    xHtml
    maxId

instead of:

    XHTML
    maxID

Underscores in names (`_`) are not actually forbidden by the
compiler, but are strongly discouraged as they have
special meaning within the Scala syntax. (But see below
for exceptions.)

## Classes/Traits

Classes should be named in upper camel case:

    class MyFairLady

This mimics the Java naming convention for classes.

Sometimes traits and classes as well as their members are used to describe
formats, documentation or protocols and generate/derive them. 
In these cases it is desirable to be close to a 1:1 relation to the output format
and the naming conventions don't apply. In this case, they should only be used
for that specific purpose and not throughout the rest of the code.

## Objects

Object names are like class names (upper camel case).

An exception is when mimicking a package or function.
This isn't common. Example:

    object ast {
      sealed trait Expr

      case class Plus(e1: Expr, e2: Expr) extends Expr
      ...
    }

    object inc {
      def apply(x: Int): Int = x + 1
    }

## Packages

Scala packages should follow the Java package naming conventions:

    // wrong!
    package coolness

    // right! puts only coolness._ in scope
    package com.novell.coolness

    // right! puts both novell._ and coolness._ in scope
    package com.novell
    package coolness

    // right, for package object com.novell.coolness
    package com.novell
    /**
     * Provides classes related to coolness
     */
    package object coolness {
    }

### _root_

It is occasionally necessary to fully-qualify imports using
`_root_`.  For example if another `net` is in scope, then
to access `net.liftweb` we must write e.g.:

    import _root_.net.liftweb._

Do not overuse `_root_`. In general, nested package resolves are a
good thing and very helpful in reducing import clutter. Using `_root_`
not only negates their benefit, but also introduces extra clutter in and
of itself.

## Methods

Textual (alphabetic) names for methods should be in lower camel case:

    def myFairMethod = ...

This section is not a comprehensive guide to idiomatic method naming in Scala.
Further information may be found in the method invocation section.

### Accessors/Mutators

Scala does *not* follow the Java convention of prepending `set`/`get` to
mutator and accessor methods (respectively). Instead, the following
conventions are used:

-   For accessors of properties, the name of the method should be the
    name of the property.
-   In some instances, it is acceptable to prepend "\`is\`" on a boolean
    accessor (e.g. `isEmpty`). This should only be the case when no
    corresponding mutator is provided. Please note that the
    [Lift](https://liftweb.net) convention of appending "`_?`" to boolean
    accessors is non-standard and not used outside of the Lift
    framework.
-   For mutators, the name of the method should be the name of the
    property with "`_=`" appended. As long as a corresponding accessor
    with that particular property name is defined on the enclosing type,
    this convention will enable a call-site mutation syntax which
    mirrors assignment. Note that this is not just a convention but a
    requirement of the language.

        class Foo {

          def bar = ...

          def bar_=(bar: Bar) {
            ...
          }

          def isBaz = ...
        }

        val foo = new Foo
        foo.bar             // accessor
        foo.bar = bar2      // mutator
        foo.isBaz           // boolean property


Unfortunately, these conventions fall afoul of the Java convention
to name the private fields encapsulated by accessors and mutators
according to the property they represent. For example:

    public class Company {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

In Scala, there is no distinction between fields and methods. In fact,
fields are completely named and controlled by the compiler. If we wanted
to adopt the Java convention of bean getters/setters in Scala, this is a
rather simple encoding:

    class Company {
      private var _name: String = _

      def name = _name

      def name_=(name: String) {
        _name = name
      }
    }

While Hungarian notation is terribly ugly, it does have the advantage of
disambiguating the `_name` variable without cluttering the identifier.
The underscore is in the prefix position rather than the suffix to avoid
any danger of mistakenly typing `name _` instead of `name_`. With heavy
use of Scala's type inference, such a mistake could potentially lead to
a very confusing error.

Note that the Java getter/setter paradigm was often used to work around a
lack of first class support for Properties and bindings. In Scala, there
are libraries that support properties and bindings. The convention is to
use an immutable reference to a property class that contains its own
getter and setter. For example:

    class Company {
      val string: Property[String] = Property("Initial Value")

### Parentheses

Unlike Ruby, Scala attaches significance to whether or not a method is
*declared* with parentheses (only applicable to methods of
[arity](https://en.wikipedia.org/wiki/Arity)-0). For example:

    def foo1() = ...

    def foo2 = ...

These are different methods at compile-time. While `foo1` can be called
with or without the parentheses, `foo2` *may not* be called *with*
parentheses.

Thus, it is actually quite important that proper guidelines be observed
regarding when it is appropriate to declare a method without parentheses
and when it is not.

Methods which act as accessors of any sort (either encapsulating a field
or a logical property) should be declared *without* parentheses except
if they have side effects. While Ruby and Lift use a `!` to indicate
this, the usage of parens is preferred (please note that fluid APIs and
internal domain-specific languages have a tendency to break the
guidelines given below for the sake of syntax. Such exceptions should
not be considered a violation so much as a time when these rules do not
apply. In a DSL, syntax should be paramount over convention).

Further, the callsite should follow the declaration; if declared with
parentheses, call with parentheses. While there is temptation to save a
few characters, if you follow this guideline, your code will be *much*
more readable and maintainable.

    // doesn't change state, call as birthdate
    def birthdate = firstName

    // updates our internal state, call as age()
    def age() = {
      _age = updateAge(birthdate)
      _age
    }

### Symbolic Method Names

Avoid! Despite the degree to which Scala facilitates this area of API
design, the definition of methods with symbolic names should not be
undertaken lightly, particularly when the symbols itself are
non-standard (for example, `>>#>>`). As a general rule, symbolic method
names have two valid use-cases:

-   Domain-specific languages (e.g. `actor1 ! Msg`)
-   Logically mathematical operations (e.g. `a + b` or `c :: d`)

In the former case, symbolic method names may be used with impunity so
long as the syntax is actually beneficial. However, in the course of
standard API design, symbolic method names should be strictly reserved
for purely-functional operations. Thus, it is acceptable to define a
`>>=` method for joining two monads, but it is not acceptable to define
a `<<` method for writing to an output stream. The former is
mathematically well-defined and side-effect free, while the latter is
neither of these.

As a general rule, symbolic method names should be well-understood and
self documenting in nature. The rule of thumb is as follows: if you need
to explain what the method does, then it should have a real, descriptive
name rather than a symbols. There are some *very* rare cases where it is
acceptable to invent new symbolic method names. Odds are, your API is
not one of those cases!

The definition of methods with symbolic names should be considered an
advanced feature in Scala, to be used only by those most well-versed in
its pitfalls. Without care, excessive use of symbolic method names can
easily transform even the simplest code into symbolic soup.

## Constants, Values, Variable and Methods

Constant names should be in upper camel case. Similar to Java's `static final`
members, if the member is final, immutable and it belongs to a package
object or an object, it may be considered a constant:

    object Container {
      val MyConstant = ...
    }

The value: `Pi` in `scala.math` package is another example of such a constant.

Method, Value and variable names should be in lower camel case:

    val myValue = ...
    def myMethod = ...
    var myVariable

## Type Parameters (generics)

For simple type parameters, a single upper-case letter (from the English
alphabet) should be used, starting with `A` (this is different than the
Java convention of starting with `T`). For example:

    class List[A] {
      def map[B](f: A => B): List[B] = ...
    }

If the type parameter has a more specific meaning, a descriptive name
should be used, following the class naming conventions (as opposed to an
all-uppercase style):

    // Right
    class Map[Key, Value] {
      def get(key: Key): Value
      def put(key: Key, value: Value): Unit
    }

    // Wrong; don't use all-caps
    class Map[KEY, VALUE] {
      def get(key: KEY): VALUE
      def put(key: KEY, value: VALUE): Unit
    }

If the scope of the type parameter is small enough, a mnemonic can be
used in place of a longer, descriptive name:

    class Map[K, V] {
      def get(key: K): V
      def put(key: K, value: V): Unit
    }

### Higher-Kinds and Parameterized Type parameters

Higher-kinds are theoretically no different from regular type parameters
(except that their
[kind](https://en.wikipedia.org/wiki/Kind_(type_theory)) is at least
`*=>*` rather than simply `*`). The naming conventions are generally
similar, however it is preferred to use a descriptive name rather than a
single letter, for clarity:

    class HigherOrderMap[Key[_], Value[_]] { ... }

The single letter form is (sometimes) acceptable for fundamental concepts
used throughout a codebase, such as `F[_]` for Functor and `M[_]` for
Monad.

In such cases, the fundamental concept should be something well known
and understood to the team, or have tertiary evidence, such as the
following:

    def doSomething[M[_]: Monad](m: M[Int]) = ...

Here, the type bound `: Monad` offers the necessary evidence to inform
the reader that `M[_]` is the type of the Monad.

## Annotations

Annotations, such as `@volatile` should be in lower camel case:

    class cloneable extends StaticAnnotation

This convention is used throughout the Scala library, even though it is
not consistent with Java annotation naming.

Note: This convention applied even when using type aliases on
annotations. For example, when using JDBC:

    type id = javax.persistence.Id @annotation.target.field
    @id
    var id: Int = 0

## Special Note on Brevity

Because of Scala's roots in the functional languages, it is quite normal
for local names to be very short:

    def add(a: Int, b: Int) = a + b

This would be bad practice in languages like Java, but it is *good*
practice in Scala. This convention works because properly-written Scala
methods are quite short, only spanning a single expression and rarely
going beyond a few lines. Few local names are used (including
parameters), and so there is no need to contrive long, descriptive
names. This convention substantially improves the brevity of most Scala
sources. This in turn improves readability, as most expressions fit in
one line and the arguments to methods have descriptive type names.

This convention only applies to parameters of very simple methods (and
local fields for very simply classes); everything in the public
interface should be descriptive. Also note that the names of arguments
are now part of the public API of a class, since users can use named
parameters in method calls.
