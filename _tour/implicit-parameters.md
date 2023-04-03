---
layout: tour
title: Contextual Parameters, aka Implicit Parameters
partof: scala-tour

num: 28
next-page: implicit-conversions
previous-page: self-types

redirect_from: "/tutorials/tour/implicit-parameters.html"
---

A method can have *contextual parameters*, also called *implicit parameters*, or more concisely *implicits*.
Parameter lists starting with the keyword `using` (or `implicit` in Scala 2) mark contextual parameters.
Unless the call site explicitly provides arguments for those parameters, Scala will look for implicitly available `given` (or `implicit` in Scala 2) values of the correct type.
If it can find appropriate values, it automatically passes them.

This is best shown using a small example first.
We define an interface `Comparator[A]` that can compare elements of type `A`, and provide two implementations, for `Int`s and `String`s.
We then define a method `max[A](x: A, y: A)` that returns the greater of the two arguments.
Since `x` and `y` are generically typed, in general we do not know how to compare them, but we can ask for an appropriate comparator.
As there is typically a canonical comparator for any given type `A`, we can declare them as *given*s, or *implicitly* available.

{% tabs implicits-comparator class=tabs-scala-version %}

{% tab 'Scala 2' for=implicits-comparator %}
```scala mdoc
trait Comparator[A] {
  def compare(x: A, y: A): Int
}

object Comparator {
  implicit object IntComparator extends Comparator[Int] {
    def compare(x: Int, y: Int): Int = Integer.compare(x, y)
  }

  implicit object StringComparator extends Comparator[String] {
    def compare(x: String, y: String): Int = x.compareTo(y)
  }
}

def max[A](x: A, y: A)(implicit comparator: Comparator[A]): A =
  if (comparator.compare(x, y) >= 0) x
  else y

println(max(10, 6))             // 10
println(max("hello", "world"))  // world
```

```scala mdoc:fail
// does not compile:
println(max(false, true))
//         ^
//     error: could not find implicit value for parameter comparator: Comparator[Boolean]
```

The `comparator` parameter is automatically filled in with `Comparator.IntComparator` for `max(10, 6)`, and with `Comparator.StringComparator` for `max("hello", "world")`.
Since no implicit `Comparator[Boolean]` can be found, the call `max(false, true)` fails to compile.
{% endtab %}

{% tab 'Scala 3' for=implicits-comparator %}
```scala
trait Comparator[A]:
  def compare(x: A, y: A): Int

object Comparator:
  given Comparator[Int] with
    def compare(x: Int, y: Int): Int = Integer.compare(x, y)

  given Comparator[String] with
    def compare(x: String, y: String): Int = x.compareTo(y)
end Comparator

def max[A](x: A, y: A)(using comparator: Comparator[A]): A =
  if comparator.compare(x, y) >= 0 then x
  else y

println(max(10, 6))             // 10
println(max("hello", "world"))  // world
```

```scala
// does not compile:
println(max(false, true))
-- Error: ----------------------------------------------------------------------
1 |println(max(false, true))
  |                        ^
  |no given instance of type Comparator[Boolean] was found for parameter comparator of method max
```

The `comparator` parameter is automatically filled in with the `given Comparator[Int]` for `max(10, 6)`, and with the `given Comparator[String]` for `max("hello", "world")`.
Since no `given Comparator[Boolean]` can be found, the call `max(false, true)` fails to compile.
{% endtab %}

{% endtabs %}

Scala will look for available given values in two places:

* Scala will first look for given definitions and using parameters that can be accessed directly (without a prefix) at the call site of `max`.
* Then it looks for members marked `given`/`implicit` in the companion objects associated with the implicit candidate type (for example: `object Comparator` for the candidate type `Comparator[Int]`).

A more detailed guide to where Scala looks for implicits can be found in [the FAQ](/tutorials/FAQ/finding-implicits.html).
