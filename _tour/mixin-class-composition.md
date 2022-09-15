---
layout: tour
title: Class Composition with Mixins
partof: scala-tour

num: 9
next-page: higher-order-functions
previous-page: tuples
prerequisite-knowledge: inheritance, traits, abstract-classes, unified-types

redirect_from: "/tutorials/tour/mixin-class-composition.html"
---
Mixins are traits which are used to compose a class.

{% tabs mixin-first-exemple class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-first-exemple %}
```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "I'm an instance of class B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```
Class `D` has a superclass `B` and a mixin `C`. Classes can only have one superclass but many mixins (using the keywords `extends` and `with` respectively). The mixins and the superclass may have the same supertype.

{% endtab %}

{% tab 'Scala 3' for=mixin-first-exemple %}
```scala
abstract class A:
  val message: String
class B extends A:
  val message = "I'm an instance of class B"
trait C extends A:
  def loudMessage = message.toUpperCase()
class D extends B, C

val d = D()
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```
Class `D` has a superclass `B` and a mixin `C`. Classes can only have one superclass but many mixins (using the keyword `extends` and the separator `,` respectively). The mixins and the superclass may have the same supertype.

{% endtab %}

{% endtabs %}

Now let's look at a more interesting example starting with an abstract class:

{% tabs mixin-abstract-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-abstract-iterator %}
```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```
{% endtab %}

{% tab 'Scala 3' for=mixin-abstract-iterator %}
```scala
abstract class AbsIterator:
  type T
  def hasNext: Boolean
  def next(): T
```
{% endtab %}

{% endtabs %}

The class has an abstract type `T` and the standard iterator methods.

Next, we'll implement a concrete class (all abstract members `T`, `hasNext`, and `next` have implementations):

{% tabs mixin-concrete-string-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-concrete-string-iterator %}
```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=mixin-concrete-string-iterator %}
```scala
class StringIterator(s: String) extends AbsIterator:
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() =
    val ch = s charAt i
    i += 1
    ch
```
{% endtab %}

{% endtabs %}

`StringIterator` takes a `String` and can be used to iterate over the String (e.g. to see if a String contains a certain character).

Now let's create a trait which also extends `AbsIterator`.

{% tabs mixin-extended-abstract-iterator class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-extended-abstract-iterator %}
```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```
This trait implements `foreach` by continually calling the provided function `f: T => Unit` on the next element (`next()`) as long as there are further elements (`while (hasNext)`). Because `RichIterator` is a trait, it doesn't need to implement the abstract members of AbsIterator.

{% endtab %}

{% tab 'Scala 3' for=mixin-extended-abstract-iterator %}
```scala
trait RichIterator extends AbsIterator:
  def foreach(f: T => Unit): Unit = while hasNext do f(next())
}
```
This trait implements `foreach` by continually calling the provided function `f: T => Unit` on the next element (`next()`) as long as there are further elements (`while hasNext`). Because `RichIterator` is a trait, it doesn't need to implement the abstract members of AbsIterator.

{% endtab %}

{% endtabs %}

We would like to combine the functionality of `StringIterator` and `RichIterator` into a single class.

{% tabs mixin-combination-class class=tabs-scala-version %}

{% tab 'Scala 2' for=mixin-combination-class %}
```scala mdoc
class RichStringIter extends StringIterator("Scala") with RichIterator
val richStringIter = new RichStringIter
richStringIter.foreach(println)
```
{% endtab %}

{% tab 'Scala 3' for=mixin-combination-class %}
```scala
class RichStringIter extends StringIterator("Scala"), RichIterator
val richStringIter = RichStringIter()
richStringIter.foreach(println)
```
{% endtab %}

{% endtabs %}

The new class `RichStringIter` has `StringIterator` as a superclass and `RichIterator` as a mixin.

With single inheritance we would not be able to achieve this level of flexibility.
