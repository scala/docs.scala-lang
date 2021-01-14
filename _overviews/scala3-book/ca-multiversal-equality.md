---
title: Multiversal Equality
type: section
description: This page demonstrates how to implement Multiversal Equality in Scala 3.
num: 65
previous-page: ca-type-classes
next-page: ca-implicit-conversions
---


Previously, Scala had *universal equality*: Two values of any types could be compared with each other using `==` and `!=`.
This came from the fact that `==` and `!=` are implemented in terms of Java’s `equals` method, which can also compare values of any two reference types.

Universal equality is convenient, but it’s also dangerous since it undermines type safety.
For instance, let’s assume that after some refactoring, you’re left with an erroneous program where a value `y` has type `S` instead of the correct type `T`:

```scala
val x = ...   // of type T
val y = ...   // of type S, but should be T
x == y        // typechecks, will always yield false
```

If `y` gets compared to other values of type `T`, the program will still typecheck, since values of all types can be compared with each other.
But it will probably give unexpected results and fail at runtime.

A type-safe programming language can do better, and multiversal equality is an opt-in way to make universal equality safer.
It uses the binary type class `CanEqual` to indicate that values of two given types can be compared with each other.


## Allowing the comparison of class instances

By default, in Scala 3 you can still create an equality comparison like this:

```scala
case class Cat(name: String)
case class Dog(name: String)
val d = Dog("Fido")
val c = Cat("Morris")

d == c  // false, but it compiles
```

But with Scala 3 you can disable such comparisons.
By (a) importing `scala.language.strictEquality` or (b) using the `-language:strictEquality` compiler flag, this comparison no longer compiles:

```scala
import scala.language.strictEquality

val rover = Dog("Rover")
val fido = Dog("Fido")
println(rover == fido)   // compiler error

// compiler error message:
// Values of types Dog and Dog cannot be compared with == or !=
```


## Enabling comparisons

There are two ways to enable this comparison using the Scala 3 `CanEqual` type class.
For simple cases like this, your class can *derive* the `CanEqual` class:

```scala
// Option 1
case class Dog(name: String) derives CanEqual
```

As you’ll see in a few moments, when you need more flexibility you can also use this syntax:

```scala
// Option 2
case class Dog(name: String)
given CanEqual[Dog, Dog] = CanEqual.derived
```

Either of those two approaches now let `Dog` instances to be compared to each other.


## A more real-world example

In a more real-world example, imagine you have an online bookstore and want to allow or disallow the comparison of physical, printed books, and audiobooks.
With Scala 3 you start by enabling multiversal equality as shown in the previous example:

```scala
// [1] add this import, or this command line flag: -language:strictEquality
import scala.language.strictEquality
```

Then create your domain objects as usual:

```scala
// [2] create your class hierarchy
trait Book:
    def author: String
    def title: String
    def year: Int

case class PrintedBook(
    author: String,
    title: String,
    year: Int,
    pages: Int
) extends Book

case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book
```

Finally, use `CanEqual` to define which comparisons you want to allow:

```scala
// [3] create type class instances to define the allowed comparisons.
//     allow `PrintedBook == PrintedBook`
//     allow `AudioBook == AudioBook`
given CanEqual[PrintedBook, PrintedBook] = CanEqual.derived
given CanEqual[AudioBook, AudioBook] = CanEqual.derived

// [4a] comparing two printed books works as desired
val p1 = PrintedBook("1984", "George Orwell", 1961, 328)
val p2 = PrintedBook("1984", "George Orwell", 1961, 328)
println(p1 == p2)         // true

// [4b] you can’t compare a printed book and an audiobook
val pBook = PrintedBook("1984", "George Orwell", 1961, 328)
val aBook = AudioBook("1984", "George Orwell", 2006, 682)
println(pBook == aBook)   // compiler error
```

The last line of code results in this compiler error message:

````
Values of types PrintedBook and AudioBook cannot be compared with == or !=
````

This is how multiversal equality catches illegal type comparisons at compile time.


### Enabling “PrintedBook == AudioBook”

That works as desired, but in some situations you may want to allow the comparison of physical books to audiobooks.
When you want this, create these two additional equality comparisons:

```scala
// allow `PrintedBook == AudioBook`, and `AudioBook == PrintedBook`
given CanEqual[PrintedBook, AudioBook] = CanEqual.derived
given CanEqual[AudioBook, PrintedBook] = CanEqual.derived
```

Now you can compare physical books to audiobooks without a compiler error:

```scala
println(pBook == aBook)   // false
println(aBook == pBook)   // false
```

#### Implement “equals” to make them really work

While these comparisons are now allowed, they will always be `false` because their `equals` methods don’t know how to make these comparisons.
Therefore, the solution is to override the `equals` methods for each class.
For instance, when you override the `equals` method for `AudioBook`:

```scala
case class AudioBook(
    author: String,
    title: String,
    year: Int,
    lengthInMinutes: Int
) extends Book:
    // override to allow AudioBook to be compared to PrintedBook
    override def equals(that: Any): Boolean = that match
        case a: AudioBook =>
            if this.author == a.author
            && this.title == a.title
            && this.year == a.year
            && this.lengthInMinutes == a.lengthInMinutes
                then true else false
        case p: PrintedBook =>
            if this.author == p.author && this.title == p.title
                then true else false
        case _ =>
            false
```

You can now compare an `AudioBook` to a `PrintedBook`:

```scala
println(aBook == pBook)   // true (works because of `equals` in `AudioBook`)
println(pBook == aBook)   // false
```

Currently the `PrintedBook` book doesn’t have an `equals` method, so the second comparison returns `false`.
To enable that comparison, just override the `equals` method in `PrintedBook`.

You can find additional information on [multiversal equality][ref-equal] in the reference documentation.


[ref-equal]: {{ site.scala3ref }}/contextual/multiversal-equality.html
