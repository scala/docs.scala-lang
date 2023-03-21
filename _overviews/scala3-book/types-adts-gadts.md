---
title: Algebraic Data Types
type: section
description: This section introduces and demonstrates algebraic data types (ADTs) in Scala 3.
languages: [zh-cn]
num: 52
previous-page: types-union
next-page: types-variance
---

Algebraic Data Types (ADTs) can be created with the `enum` construct, so we’ll briefly review enumerations before looking at ADTs.

## Enumerations

An _enumeration_ is used to define a type consisting of a set of named values:

{% tabs types-adts-gadts-1 %}
{% tab 'Scala 3 only' %}
```scala
enum Color:
  case Red, Green, Blue
```
{% endtab %}
{% endtabs %}

which can be seen as a shorthand for:

{% tabs types-adts-gadts-2 %}
{% tab 'Scala 3 only' %}
```scala
enum Color:
  case Red   extends Color
  case Green extends Color
  case Blue  extends Color
```
{% endtab %}
{% endtabs %}

#### Parameters
Enums can be parameterized:

{% tabs types-adts-gadts-3 %}
{% tab 'Scala 3 only' %}
```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```
{% endtab %}
{% endtabs %}

This way, each of the different variants has a value member `rgb` which is assigned the corresponding value:

{% tabs types-adts-gadts-4 %}
{% tab 'Scala 3 only' %}
```scala
println(Color.Green.rgb) // prints 65280
```
{% endtab %}
{% endtabs %}

#### Custom Definitions
Enums can also have custom definitions:

{% tabs types-adts-gadts-5 %}
{% tab 'Scala 3 only' %}
```scala
enum Planet(mass: Double, radius: Double):

  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // 5 or 6 more planets ...
```
{% endtab %}
{% endtabs %}

Like classes and `case` classes, you can also define a companion object for an enum:

{% tabs types-adts-gadts-6 %}
{% tab 'Scala 3 only' %}
```scala
object Planet:
  def main(args: Array[String]) =
    val earthWeight = args(0).toDouble
    val mass = earthWeight / Earth.surfaceGravity
    for (p <- values)
      println(s"Your weight on $p is ${p.surfaceWeight(mass)}")
```
{% endtab %}
{% endtabs %}

## Algebraic Datatypes (ADTs)

The `enum` concept is general enough to also support _algebraic data types_ (ADTs) and their generalized version (GADTs).
Here’s an example that shows how an `Option` type can be represented as an ADT:

{% tabs types-adts-gadts-7 %}
{% tab 'Scala 3 only' %}
```scala
enum Option[+T]:
  case Some(x: T)
  case None
```
{% endtab %}
{% endtabs %}

This example creates an `Option` enum with a covariant type parameter `T` consisting of two cases, `Some` and `None`.
`Some` is _parameterized_ with a value parameter `x`; this is a shorthand for writing a `case` class that extends `Option`.
Since `None` is not parameterized, it’s treated as a normal `enum` value.

The `extends` clauses that were omitted in the previous example can also be given explicitly:

{% tabs types-adts-gadts-8 %}
{% tab 'Scala 3 only' %}
```scala
enum Option[+T]:
  case Some(x: T) extends Option[T]
  case None       extends Option[Nothing]
```
{% endtab %}
{% endtabs %}

As with normal `enum` values, the cases of an `enum` are defined in the `enum`s companion object, so they’re referred to as `Option.Some` and `Option.None` (unless the definitions are “pulled out” with an import):

{% tabs types-adts-gadts-9 %}
{% tab 'Scala 3 only' %}
```scala
scala> Option.Some("hello")
val res1: t2.Option[String] = Some(hello)

scala> Option.None
val res2: t2.Option[Nothing] = None
```
{% endtab %}
{% endtabs %}

As with other enumeration uses, ADTs can define additional methods.
For instance, here’s `Option` again, with an `isDefined` method and an `Option(...)` constructor in its companion object:

{% tabs types-adts-gadts-10 %}
{% tab 'Scala 3 only' %}
```scala
enum Option[+T]:
  case Some(x: T)
  case None

  def isDefined: Boolean = this match
    case None => false
    case Some(_) => true

object Option:
  def apply[T >: Null](x: T): Option[T] =
    if (x == null) None else Some(x)
```
{% endtab %}
{% endtabs %}

Enumerations and ADTs share the same syntactic construct, so they can
be seen simply as two ends of a spectrum, and it’s perfectly possible
to construct hybrids.
For instance, the code below gives an
implementation of `Color`, either with three enum values or with a
parameterized case that takes an RGB value:

{% tabs types-adts-gadts-11 %}
{% tab 'Scala 3 only' %}
```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)
```
{% endtab %}
{% endtabs %}

#### Recursive Enumerations
So far all the enumerations that we defined consisted of different variants of values or case classes.
Enumerations can also be recursive, as illustrated in the below example of encoding natural numbers:

{% tabs types-adts-gadts-12 %}
{% tab 'Scala 3 only' %}
```scala
enum Nat:
  case Zero
  case Succ(n: Nat)
```
{% endtab %}
{% endtabs %}

For example the value `Succ(Succ(Zero))` represents the number `2` in an unary encoding.
Lists can be defined in a very similar way:

{% tabs types-adts-gadts-13 %}
{% tab 'Scala 3 only' %}
```scala
enum List[+A]:
  case Nil
  case Cons(head: A, tail: List[A])
```
{% endtab %}
{% endtabs %}

## Generalized Algebraic Datatypes (GADTs)
The above notation for enumerations is very concise and serves as the perfect starting point for modeling your data types.
Since we can always be more explicit, it is also possible to express types that are much more powerful: generalized algebraic datatypes (GADTs).

Here is an example of a GADT where the type parameter (`T`) specifies the contents stored in the box:

{% tabs types-adts-gadts-14 %}
{% tab 'Scala 3 only' %}
```scala
enum Box[T](contents: T):
  case IntBox(n: Int) extends Box[Int](n)
  case BoolBox(b: Boolean) extends Box[Boolean](b)
```
{% endtab %}
{% endtabs %}

Pattern matching on the particular constructor (`IntBox` or `BoolBox`) recovers the type information:

{% tabs types-adts-gadts-15 %}
{% tab 'Scala 3 only' %}
```scala
def extract[T](b: Box[T]): T = b match
  case IntBox(n)  => n + 1
  case BoolBox(b) => !b
```
{% endtab %}
{% endtabs %}

It is only safe to return an `Int` in the first case, since we know from pattern matching that the input was an `IntBox`.

## Desugaring Enumerations
_Conceptually_, enums can be thought of as defining a sealed class together with its companion object.
Let’s look at the desugaring of our `Color` enum above:

{% tabs types-adts-gadts-16 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
sealed abstract class Color(val rgb: Int) extends scala.reflect.Enum
object Color {
  case object Red extends Color(0xFF0000) { def ordinal = 0 }
  case object Green extends Color(0x00FF00) { def ordinal = 1 }
  case object Blue extends Color(0x0000FF) { def ordinal = 2 }
  case class Mix(mix: Int) extends Color(mix) { def ordinal = 3 }

  def fromOrdinal(ordinal: Int): Color = ordinal match {
    case 0 => Red
    case 1 => Green
    case 2 => Blue
    case _ => throw new NoSuchElementException(ordinal.toString)
  }
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
sealed abstract class Color(val rgb: Int) extends scala.reflect.Enum
object Color:
  case object Red extends Color(0xFF0000) { def ordinal = 0 }
  case object Green extends Color(0x00FF00) { def ordinal = 1 }
  case object Blue extends Color(0x0000FF) { def ordinal = 2 }
  case class Mix(mix: Int) extends Color(mix) { def ordinal = 3 }

  def fromOrdinal(ordinal: Int): Color = ordinal match
    case 0 => Red
    case 1 => Green
    case 2 => Blue
    case _ => throw new NoSuchElementException(ordinal.toString)
```
{% endtab %}
{% endtabs %}

Note that the above desugaring is simplified and we purposefully leave out [some details][desugar-enums].

While enums could be manually encoded using other constructs, using enumerations is more concise and also comes with a few additional utilities (such as the `fromOrdinal` method).

[desugar-enums]: {{ site.scala3ref }}/enums/desugarEnums.html
