---
layout: tour
title: Intersection Types, aka Compound Types
partof: scala-tour

num: 26
next-page: self-types
previous-page: abstract-type-members

redirect_from: "/tutorials/tour/compound-types.html"
---

Sometimes it is necessary to express that the type of an object is a subtype of several other types.

In Scala this can be expressed with the help of *intersection types*, (or *compound types* in
Scala 2) which are types that behave like any part of the intersection.

Suppose we have two traits `Cloneable` and `Resetable`:

{% tabs compound-types_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_1 %}
```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = { // makes clone public
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```
{% endtab %}
{% tab 'Scala 3' for=compound-types_1 %}
```scala
trait Cloneable extends java.lang.Cloneable:
  override def clone(): Cloneable =  // makes clone public
    super.clone().asInstanceOf[Cloneable]
trait Resetable:
  def reset: Unit
```
{% endtab %}
{% endtabs %}

Now suppose we want to write a function `cloneAndReset` which takes an object, clones it and resets the original object:

{% tabs compound-types_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_2 %}
```scala mdoc:fail
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```
{% endtab %}
{% tab 'Scala 3' for=compound-types_2 %}
```scala
def cloneAndReset(obj: ?): Cloneable =
  val cloned = obj.clone()
  obj.reset
  cloned
```
{% endtab %}
{% endtabs %}

The question arises what the type of the parameter `obj` is. If it's `Cloneable` then the object can be `clone`d, but not `reset`; if it's `Resetable` we can `reset` it, but there is no `clone` operation. To avoid type casts in such a situation, we can specify the type of `obj` to be both `Cloneable` and `Resetable`.
{% tabs compound-types_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_3 %}
This compound type is written in Scala as `Cloneable with Resetable`.

Here's the updated function:
```scala mdoc:fail
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```
Note that you can have more than two types: `A with B with C with ...`.
This means the same as thing as `(...(A with B) with C) with ... )`
{% endtab %}
{% tab 'Scala 3' for=compound-types_3 %}
This intersection type is written in Scala as `Cloneable & Resetable`.

Here's the updated function:
```scala
def cloneAndReset(obj: Cloneable & Resetable): Cloneable = {
  //...
}
```
<!-- Compound types can consist of several object types and they may have a single refinement which can be used to narrow the signature of existing object members. -->
Note that you can have more than two types: `A & B & C & ...`.
And `&` is associative, so parentheses can be added around any part without changing the meaning.
{% endtab %}
{% endtabs %}

An example for the use of refinements is given on the page about [class composition with mixins](mixin-class-composition.html).
