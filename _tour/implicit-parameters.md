---
layout: tour
title: Contextual Parameters, aka Implicit Parameters
partof: scala-tour

num: 28
next-page: implicit-conversions
previous-page: self-types

redirect_from: "/tutorials/tour/implicit-parameters.html"
---

A method can have _contextual parameters_, also called _implicit parameters_, or more concisely _implicits_.
Parameter lists starting with the keyword `using` (or `implicit` in Scala 2) mark contextual parameters.
Unless the call site explicitly provides arguments for those parameters, Scala will look for implicitly available `given` (or `implicit` in Scala 2) values of the correct type.
If it can find appropriate values, it automatically passes them.

This is best shown using a small example first.
We define an interface `Comparator[A]` that can compare elements of type `A`, and provide two implementations, for `Int`s and `String`s.
We then define a method `max[A](x: A, y: A)` that returns the greater of the two arguments.
Since `x` and `y` are generically typed, in general we do not know how to compare them, but we can ask for an appropriate comparator.
As there is typically a canonical comparator for any given type `A`, we can declare them as *given*s, or _implicitly_ available.

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
println(max(false, true))
// error: could not find implicit value for parameter comparator: Comparator[Boolean]
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

```scala mdoc:fail
println(max(false, true))
// error: could not find implicit value for parameter comparator: Comparator[Boolean]
```

The `comparator` parameter is automatically filled in with the `given Comparator[Int]` for `max(10, 6)`, and with the `given Comparator[String]` for `max("hello", "world")`.
Since no `given Comparator[Boolean]` can be found, the call `max(false, true)` fails to compile.
{% endtab %}

{% endtabs %}

Scala will look for available given values in two places:

- Scala will first look for given definitions and using parameters that can be accessed directly (without a prefix) at the call site of `max`.
- Then it looks for members marked `given`/`implicit` in the companion objects associated with the implicit candidate type (for example: `object Comparator` for the candidate type `Comparator[Int]`).

A more detailed guide to where Scala looks for implicits can be found in [the FAQ](/tutorials/FAQ/finding-implicits.html).

### Context Bounds

Context bounds are especially useful when working with type classes, where a type requires an associated contextual value.

A _context bound_ is a concise way to express that a type requires an implicit (contextual) value,
without explicitly naming the parameter.

{% tabs context-bounds-max class=tabs-scala-version %}

{% tab 'Scala 2' for=context-bounds-max %}

```scala mdoc
def max[A: Comparator](x: A, y: A): A = {
  val comparator = implicitly[Comparator[A]]
  if (comparator.compare(x, y) >= 0) x else y
}
```

{% endtab %}

{% tab 'Scala 3' for=context-bounds-max %}

```scala
def max[A: Comparator](x: A, y: A): A =
  val comparator = summon[Comparator[A]]
  if comparator.compare(x, y) >= 0 then x else y
```

{% endtab %}

{% endtabs %}

A context bound `[A: Comparator]` is syntactic sugar for:

```scala
[A](using comparator: Comparator[A])
```
