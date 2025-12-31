---
kind: SID
layout: sip
number: 7
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/scala-2-8-arrays.html
stage: completed
status: shipped
title: Scala 2.8 Arrays
---

*(This is an older SID, its original PDF can be found [here](https://www.scala-lang.org/sid/7))*

**Martin Odersky**

*October 1, 2009*

## The Problem

Arrays have turned out to be one of the trickiest concepts to get right in
Scala. This has mostly to do with very hard constraints that clash with what’s
desirable. On the one hand, we want to use arrays for interoperation with
Java, which means that they need to have the same representation as in Java.
This low-level representation is also useful to get high performance out of
arrays. But on the other hand, arrays in Java are severely limited.

First, there’s actually not a single array type representation in Java but
nine different ones: One representation for arrays of reference type and
another eight for arrays of each of the primitive types `byte`, `char`,
`short`, `int`, `long`, `float`, `double`, and `boolean`. There is no common
type for these different representations which is more specific than just
`java.lang.Object`, even though there are some reflective methods to deal with
arrays of arbitrary type in `java.lang.reflect.Array`. Second, there’s no way
to create an array of a generic type; only monomorphic array creations are
allowed. Third, the only operations supported by arrays are indexing, updates,
and get length.

Contrast this with what we would like to have in Scala: Arrays should slot
into the collections hierarchy, supporting the hundred or so methods that are
defined on sequences. And they should certainly be generic, so that one can
create an `Array[T]` where `T` is a type variable.

### The Past

How to combine these desirables with the representation restrictions imposed
by Java interoperability and performance? There’s no easy answer, and I
believe we got it wrong the first time when we designed Scala. The Scala
language up to 2.7.x “magically” wrapped and unwrapped arrays when required in
a process called boxing and unboxing, similarly to what is done to treat
primitive numeric types as objects. “Magically” means: the compiler generated
code to do so based on the static types of expressions. Additional magic made
generic array creation work. An expression like `new Array[T]` where `T` is a type
parameter was converted to `new BoxedAnyArray[T]`. `BoxedAnyArray` was a special
wrapper class which *changed its representation* depending on the type of the
concrete Java array to which it was cast. This scheme worked well enough for
most programs but the implementation “leaked” for certain combinations of type
tests and type casts, as well as for observing uninitialized arrays. It also
could lead to unexpectedly low performance. Some of the problems have been
described by David MacIver \[[1][1]\] and Matt Malone \[[2][2]\].

Boxed arrays were also unsound when combined with covariant collections. In
summary, the old array implementation technique was problematic because it was
a leaky abstraction that was complicated enough so that it would be very
tedious to specify where the leaks were to be expected.

### Exploring the Solution Space

The obvious way to reduce the amount of magic needed for arrays is to have two
representations: One which corresponds closely to a Java array and another
which forms an integral part of Scala’s collection hierarchy. Implicit
conversions can be used to transparently convert between the two
representations. This is the gist of the array refactoring proposal of David
MacIver (with contributions by Stepan Koltsov) \[[3][3]\]. The main problem
with this proposal, as I see it, is that it would force programmers to choose
the kind of array to work with. The choice would not be clear-cut: The Java-
like arrays would be fast and interoperable whereas the Scala native arrays
would support a much nicer set of operations on them. With a choice like this,
one would expect different components and libraries to make different
decisions, which would result in incompatibilities and brittle, complex code.
MacIver and Koltsov introduce some compiler magic to alleviate this. They
propose to automatically split a method taking an array as an argument into
two overloaded versions: one taking a Java array and one taking a generic
Scala array. I believe this would solve some of the more egregious plumbing
issues, but it would simply hide the problem a bit better, not solve it.

A similar idea—- but with a slightly different slant—- is to “dress up” native
arrays with an implicit conversion that integrates them into Scala’s
collection hierarchy. This is similar to what’s been done with the `String` to
`RichString` conversion in pre-2.8 Scala. The difference to the MacIver/Koltsov
proposal is that one would not normally refer to Scala native arrays in user
code, just as one rarely referred to RichString in Scala. One would only rely
on the implicit conversion to add the necessary methods and traits to Java
arrays. Unfortunately, the String/RichString experience has shown that this is
also problematic. In particular, in pre 2.8 versions of Scala, one had the
non-intuitive property that

    "abc".reverse.reverse == "abc"          //, yet
    "abc" != "abc".reverse.reverse          //!

The problem here was that the `reverse` method was inherited from class `Seq`
where it was defined to return another `Seq`. Since strings are not sequences,
the only feasible type reverse could return when called on a `String` was
`RichString`. But then the equals method on `String`s which is inherited from
Java would not recognize that a `String` could be equal to a `RichString`.

## 2.8 Collections

The new scheme of Scala 2.8 solves the problems with both arrays and strings.
It makes critical use of the new 2.8 collections framework which accompanies
collection traits such as `Seq` with implementation traits that abstract over
the representation of the collection. For instance, in addition to trait `Seq`
there is now a trait

    trait SeqLike[+Elem, +Repr] { ... }

That trait is parameterized with a representation type `Repr`. No assumptions
need to be made about this representation type; in particular it not required
to be a subtype of `Seq`. Methods such as `reverse` in trait `SeqLike` will
return values of the representation type `Repr` rather than `Seq`. The `Seq`
trait then inherits all its essential operations from `SeqLike`, instantiating
the `Repr` parameter to `Seq`.

    trait Seq[+Elem] extends ... with SeqLike[Elem, Seq[Elem]] { ... }

A similar split into base trait and implementation trait applies to most other
kinds of collections, including `Traversable`, `Iterable`, and `Vector`.

### Integrating Arrays

We can integrate arrays into this collection framework using two implicit
conversions. The first conversion will map an `Array[T]` to an object of type
`ArrayOps`, which is a subtype of type `VectorLike[T, Array[T]]`. Using this
conversion, all sequence operations are available for arrays at the natural
types. In particular, methods will yield arrays instead of `ArrayOps` values as
their results. Because the results of these implicit conversions are so short-
lived, modern VM’s can eliminate them altogether using escape analysis, so we
expect the calling overhead for these added methods to be essentially zero.

So far so good. But what if we need to convert an array to a real `Seq`, not
just call a `Seq` method on it? For this there is another implicit conversion,
which takes an array and converts it into a `WrappedArray`. `WrappedArrays`
are mutable `Vectors` that implement all vector operations in terms of a given
Java array. The difference between a `WrappedArray` and an `ArrayOps` object
is apparent in the type of methods like `reverse`: Invoked on a
`WrappedArray`, reverse returns again a `WrappedArray`, but invoked on an
`ArrayOps` object, it returns an `Array`. The conversion from `Array` to
`WrappedArray` is invertible. A dual implicit conversion goes from
`WrappedArray` to `Array`. `WrappedArray` and `ArrayOps` both inherit from an
implementation trait `ArrayLike`. This is to avoid duplication of code between
`ArrayOps` and `WrappedArray`; all operations are factored out into the common
`ArrayLike` trait.

### Avoiding Ambiguities

So now that we have two implicit conversions from `Array` to `ArrayLike`
values, how does one choose between them and how does one avoid ambiguities?
The trick is to make use of a generalization of overloading and implicit
resolution in Scala 2.8. Previously, the most specific overloaded method or
implicit conversion would be chosen based solely on the method’s argument
types. There was an additional clause which said that the most specific method
could not be defined in a proper superclass of any of the other alternatives.
This scheme has been replaced in Scala 2.8 by the following, more liberal one:
When comparing two different applicable alternatives of an overloaded method
or of an implicit, each method gets one point for having more specific
arguments, and another point for being defined in a proper subclass. An
alternative “wins” over another if it gets a greater number of points in these
two comparisons. This means in particular that if alternatives have identical
argument types, the one which is defined in a subclass wins.

Applied to arrays, this means that we can prioritize the conversion from
`Array` to `ArrayOps` over the conversion from `Array` to `WrappedArray` by
placing the former in the standard `Predef` object and by placing the latter
in a class `LowPriorityImplicits`, which is inherited from `Predef`. This way,
calling a sequence method will always invoke the conversion to `ArrayOps`. The
conversion to `WrappedArray` will only be invoked when an array needs to be
converted to a sequence.

### Integrating Strings

Essentially the same technique is applied to strings. There are two implicit
conversions: The first, which goes from `String` to `StringOps`, adds useful
methods to class `String`. The second, which goes from `String` to
`WrappedString`, converts strings to sequences.

## Generic Array Creation and Manifests

That’s almost everything. The only remaining question is how to implement
generic array creation. Unlike Java, Scala allows an instance creation
`new Array[T]` where `T` is a type parameter. How can this be implemented, given
the fact that there does not exist a uniform array representation in Java? The
only way to do this is to require additional runtime information which
describes the type `T`. Scala 2.8 has a new mechanism for this, which is
called a `Manifest`. An object of type `Manifest[T]` provides complete
information about the type `T`. Manifest values are typically passed in implicit
parameters; and the compiler knows how to construct them for statically
known types `T`. There exists also a weaker form named `ClassManifest` which can
be constructed from knowing just the top-level class of a type, without
necessarily knowing all its argument types. It is this type of runtime
information that’s required for array creation.

Here’s an example. Consider the method `tabulate` which forms an array from
the results of applying a given function `f` on a range of numbers from 0
until a given length. Up to Scala 2.7, `tabulate` could be written as follows:

    def tabulate[T](len: Int, f: Int => T) = {
    	val xs = new Array[T](len)
    	for (i <- 0 until len) xs(i) = f(i)
    	xs
    }

In Scala 2.8 this is no longer possible, because runtime information is
necessary to create the right representation of `Array[T]`. One needs to
provide this information by passing a `ClassManifest[T]` into the method as an
implicit parameter:

    def tabulate[T](len: Int, f: Int => T)(implicit m: ClassManifest[T]) = {
    	val xs = new Array[T](len)
    	for (i <- 0 until len) xs(i) = f(i)
    	xs
    }

When calling `tabulate` on a type such as `Int`, or `String`, or `List[T]`,
the Scala compiler can create a class manifest to pass as implicit argument to
`tabulate`. When calling `tabulate` on another type parameter, one needs to
propagate the requirement of a class manifest using another implicit parameter
or context bound. For instance:

    def tabTen[T: ClassManifest](f: Int => T) = tabulate(10, f)

The move away form boxing and to class manifests is bound to break some
existing code that generated generic arrays as in the first version of
`tabulate` above. Usually, the necessary changes simply involve adding a
context bound to some type parameter.

### Class `GenericArray`

For the case where generic array creation is needed but adding manifests is
not feasible, Scala 2.8 offers an alternative version of arrays in the
`GenericArray` class. This class is defined in package
`scala.collection.mutable` along the following lines.

    class GenericArray[T](length: Int) extends Vector[T] {
    	val array: Array[AnyRef] = new Array[AnyRef](length)
    	...
    	// all vector operations defined in terms of ‘array’
    }

Unlike normal arrays, `GenericArrays` can be created without a class manifest
because they have a uniform representation: all their elements are stored in
an `Array[AnyRef]`, which corresponds to an `Object[]` array in Java. The
addition of `GenericArray` to the Scala collection library does demand a
choice from the programmer—- should one pick a normal array or a generic
array? This choice is easily answered, however: Whenever a class manifest for
the element type can easily be produced, it’s better to pick a normal array,
because it tends to be faster, is more compact, and has better
interoperability with Java. Only when producing a class manifest is infeasible
one should revert to a `GenericArray`. The only place where `GenericArray` is
used in Scala’s current collection framework is in the `sortWith` method of
class `Seq`. A call `xs.sortWith(f)` converts its receiver `xs` first to a
`GenericArray`, passes the resulting array to a Java sorting method defined in
`java.util.Arrays`, and converts the sorted array back to the same type of
`Seq` as `xs`. Since the conversion to an array is a mere implementation
detail of `sortWith`, we felt that it was unreasonable to demand a class
manifest for the element type of the sequence. Hence the choice of a
`GenericArray`.

## Conclusion

In summary, the new Scala collection framework resolves some long-standing
problems with arrays and with strings. It removes a considerable amount of
compiler magic and avoids several pitfalls which existed in the previous
implementation. It relies on three new features of the Scala language that
should be generally useful in the construction of libraries and frameworks:
First, the generalization of overloading and implicit resolution allows one to
prioritize some implicits over others. Second, manifests provide type
information at run-time that was lost through erasure. Third, context bounds
are a convenient shorthand for certain forms of implicit arguments. These
three language features will be described in more detail in separate notes.


## References
1. [David MacIver. Scala arrays. Blog, June 2008.][1]
2. [Matt Malone. The mystery of the parameterized array. Blog, August 2009.][2]
3. David MacIver. Refactoring scala.array. Pre-SIP (Scala Improvement Proposal), October 2008.

  [1]: https://www.drmaciver.com/2008/06/scala-arrays
  [2]: https://oldfashionedsoftware.com/2009/08/05/the-mystery-of-the-parameterized-array
