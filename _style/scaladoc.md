---
layout: style-guide
title: Scaladoc

partof: style
overview-name: "Style Guide"

num: 10

previous-page: declarations
---

It is important to provide documentation for all packages, classes,
traits, methods, and other members. Scaladoc generally follows the
conventions of Javadoc, but provides many additional features that
simplify writing documentation for Scala code.

In general, you want to worry more about substance and writing style
than about formatting. Scaladocs need to be useful to new users of the code
as well as experienced users. Achieving this is very simple: increase
the level of detail and explanation as you write, starting from a terse
summary (useful for experienced users as reference), while providing
deeper examples in the detailed sections (which can be ignored by
experienced users, but can be invaluable for newcomers).

The Scaladoc tool does not mandate a documentation comment style.

The following examples demonstrate a single line summary followed
by detailed documentation, in the three common styles of indentation.

Javadoc style:

    /**
     * Provides a service as described.
     *
     * This is further documentation of what we're documenting.
     * Here are more details about how it works and what it does.
     */
    def member: Unit = ()

Scaladoc style, with gutter asterisks aligned in column two:

    /** Provides a service as described.
     *
     *  This is further documentation of what we're documenting.
     *  Here are more details about how it works and what it does.
     */
    def member: Unit = ()

Scaladoc style, with gutter asterisks aligned in column three:

    /** Provides a service as described.
      *
      * This is further documentation of what we're documenting.
      * Here are more details about how it works and what it does.
      */
    def member: Unit = ()

Because the comment markup is sensitive to whitespace,
the tool must be able to infer the left margin.

When only a simple, short description is needed, a one-line format can be used:

    /** Does something very simple */
    def simple: Unit = ()

Note that, in contrast to the Javadoc convention, the text in
the Scaladoc styles begins on the first line of the comment.
This format saves vertical space in the source file.

In either Scaladoc style, all lines of text are aligned on column five.
Since Scala source is usually indented by two spaces,
the text aligns with source indentation in a way that is visually pleasing.

See
[Scaladoc for Library Authors]({{ site.baseurl }}/overviews/scaladoc/for-library-authors.html)
for more technical info on formatting Scaladoc.

## General Style

It is important to maintain a consistent style with Scaladoc. It is also
important to target Scaladoc to both those unfamiliar with your code and
experienced users who just need a quick reference. Here are some general
guidelines:

-   Get to the point as quickly as possible. For example, say "returns
    true if some condition" instead of "if some condition return true".
-   Try to format the first sentence of a method as "Returns XXX", as in
    "Returns the first element of the List", as opposed to "this method
    returns" or "get the first" etc. Methods typically **return**
    things.
-   This same goes for classes; omit "This class does XXX"; just say
    "Does XXX"
-   Create links to referenced Scala Library classes using the
    square-bracket syntax, e.g. `[[scala.Option]]`
-   Summarize a method's return value in the `@return` annotation,
    leaving a longer description for the main Scaladoc.
-   If the documentation of a method is a one line description of what
    that method returns, do not repeat it with an `@return` annotation.
-   Document what the method *does do* not what the method *should do*.
    In other words, say "returns the result of applying f to x" rather
    than "return the result of applying f to x". Subtle, but important.
-   When referring to the instance of the class, use "this XXX", or
    "this" and not "the XXX". For objects, say "this object".
-   Make code examples consistent with this guide.
-   Use the wiki-style syntax instead of HTML wherever possible.
-   Examples should use either full code listings or the REPL, depending
    on what is needed (the simplest way to include REPL code is to
    develop the examples in the REPL and paste it into the Scaladoc).
-   Make liberal use of `@macro` to refer to commonly-repeated values
    that require special formatting.

## Packages

Provide Scaladoc for each package. This goes in a file named
`package.scala` in your package's directory and looks like so (for the
package `parent.package.name.mypackage`):

    package parent.package.name

    /** This is the Scaladoc for the package. */
    package object mypackage {
    }

A package's documentation should first document what sorts of classes
are part of the package. Secondly, document the general sorts of things
the package object itself provides.

While package documentation doesn't need to be a full-blown tutorial on
using the classes in the package, it should provide an overview of the
major classes, with some basic examples of how to use the classes in
that package. Be sure to reference classes using the square-bracket
notation:

    package my.package
    /** Provides classes for dealing with complex numbers.  Also provides
     *  implicits for converting to and from `Int`.
     *
     *  ==Overview==
     *  The main class to use is [[my.package.complex.Complex]], as so
     *  {{ "{{{" }}
     *  scala> val complex = Complex(4,3)
     *  complex: my.package.complex.Complex = 4 + 3i
     *  }}}
     *
     *  If you include [[my.package.complex.ComplexConversions]], you can
     *  convert numbers more directly
     *  {{ "{{{" }}
     *  scala> import my.package.complex.ComplexConversions._
     *  scala> val complex = 4 + 3.i
     *  complex: my.package.complex.Complex = 4 + 3i
     *  }}}
     */
    package complex {}

## Classes, Objects, and Traits

Document all classes, objects, and traits. The first sentence of the
Scaladoc should provide a summary of what the class or trait does.
Document all type parameters with `@tparam`.

#### Classes

If a class should be created using its companion object, indicate as
such after the description of the class (though leave the details of
construction to the companion object). Unfortunately, there is currently
no way to create a link to the companion object inline, however the
generated Scaladoc will create a link for you in the class documentation
output.

If the class should be created using a constructor, document it using
the `@constructor` syntax:

    /** A person who uses our application.
     *
     *  @constructor create a new person with a name and age.
     *  @param name the person's name
     *  @param age the person's age in years
     */
    class Person(name: String, age: Int) {
    }

Depending on the complexity of your class, provide an example of common
usage.

#### Objects

Since objects can be used for a variety of purposes, it is important to
document *how* to use the object (e.g. as a factory, for implicit
methods). If this object is a factory for other objects, indicate as
such here, deferring the specifics to the Scaladoc for the `apply`
method(s). If your object *doesn't* use `apply` as a factory method, be
sure to indicate the actual method names:

    /** Factory for [[mypackage.Person]] instances. */
    object Person {
      /** Creates a person with a given name and age.
       *
       *  @param name their name
       *  @param age the age of the person to create
       */
      def apply(name: String, age: Int) = {}

      /** Creates a person with a given name and birthdate
       *
       *  @param name their name
       *  @param birthDate the person's birthdate
       *  @return a new Person instance with the age determined by the
       *          birthdate and current date.
       */
      def apply(name: String, birthDate: java.util.Date) = {}
    }

If your object holds implicit conversions, provide an example in the
Scaladoc:

    /** Implicit conversions and helpers for [[mypackage.Complex]] instances.
     *
     *  {{ "{{{" }}
     *  import ComplexImplicits._
     *  val c: Complex = 4 + 3.i
     *  }}}
     */
    object ComplexImplicits {}

#### Traits

After the overview of what the trait does, provide an overview of the
methods and types that must be specified in classes that mix in the
trait. If there are known classes using the trait, reference them.

## Methods and Other Members

Document all methods. As with other documentable entities, the first
sentence should be a summary of what the method does. Subsequent
sentences explain in further detail. Document each parameter as well as
each type parameter (with `@tparam`). For curried functions, consider
providing more detailed examples regarding the expected or idiomatic
usage. For implicit parameters, take special care to explain where
these parameters will come from and if the user needs to do any extra
work to make sure the parameters will be available.
