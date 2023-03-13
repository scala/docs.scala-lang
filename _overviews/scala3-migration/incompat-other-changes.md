---
title: Other Changed Features
type: section
description: This chapter details all incompatibilities caused by changed features
num: 19
previous-page: incompat-contextual-abstractions
next-page: incompat-type-checker
---

Some other features are simplified or restricted to make the language easier, safer or more consistent.

|Incompatibility|Scala 3 Migration Rewrite|
|--- |--- |
|[Inheritance shadowing](#inheritance-shadowing)|✅|
|[Non-private constructor in private class](#non-private-constructor-in-private-class)|Migration Warning|
|[Abstract override](#abstract-override)||
|[Case class companion](#case-class-companion)||
|[Explicit call to unapply](#explicit-call-to-unapply)||
|[Invisible bean property](#invisible-bean-property)||
|[`=>T` as type argument](#-t-as-type-argument)||
|[Wildcard type argument](#wildcard-type-argument)||

## Inheritance Shadowing

An inherited member, from a parent trait or class, can shadow an identifier defined in an outer scope.
That pattern is called inheritance shadowing.

{% tabs shared-inheritance_1 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
~~~
{% endtab %}
{% endtabs %}

For instance, in this preceding piece of code, the `x` term in C can refer to the `x` member defined in the outer class `B` or it can refer to a `x` member of the parent class `A`.
You cannot know until you go to the definition of `A`.

This is known for being error prone.

That's why, in Scala 3, the compiler requires disambiguation if the parent class `A` does actually have a member `x`.

It prevents the following piece of code from compiling.
{% tabs scala-2-inheritance_2 %}
{% tab 'Scala 2 Only' %}
~~~ scala
class A {
  val x = 2
}

object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
~~~
{% endtab %}
{% endtabs %}

But if you try to compile with Scala 3 you should see an error of the same kind as:
{% highlight text %}
-- [E049] Reference Error: src/main/scala/inheritance-shadowing.scala:9:14 
9 |      println(x)
  |              ^
  |              Reference to x is ambiguous,
  |              it is both defined in object B
  |              and inherited subsequently in class C
{% endhighlight %}

The [Scala 3 migration compilation](tooling-migration-mode.html) can automatically disambiguate the code by replacing `println(x)` with `println(this.x)`.

## Non-private Constructor In Private Class

The Scala 3 compiler requires the constructor of private classes to be private.

For instance, in the example:
{% tabs scala-2-constructor_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
package foo

private class Bar private[foo] () {}
~~~
{% endtab %}
{% endtabs %}

If you try to compile in scala 3 you should get the following error message:
{% highlight text %}
-- Error: /home/piquerez/scalacenter/scala-3-migration-guide/incompat/access-modifier/src/main/scala-2.13/access-modifier.scala:4:19 
4 |  private class Bar private[foo] ()
  |                   ^
  |      non-private constructor Bar in class Bar refers to private class Bar
  |      in its type signature (): foo.Foo.Bar
{% endhighlight %}

The [Scala 3 migration compilation](tooling-migration-mode.html) warns about this but no automatic rewrite is provided.

The solution is to make the constructor private, since the class is private.

## Abstract Override

In Scala 3, overriding a concrete def with an abstract def causes subclasses to consider the def abstract, whereas in Scala 2 it was considered as concrete.

In the following piece of code, the `bar` method in `C` is considered concrete by the Scala 2.13 compiler but abstract by the Scala 3 compiler, causing the following error.
{% tabs scala-2-abstract_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
trait A {
  def bar(x: Int): Int = x + 3
}

trait B extends A {
  def bar(x: Int): Int
}

class C extends B // In Scala 3, Error: class C needs to be abstract, since def bar(x: Int): Int is not defined
~~~
{% endtab %}
{% endtabs %}

This behavior was decided in [Dotty issue #4770](https://github.com/lampepfl/dotty/issues/4770).

An easy fix is simply to remove the abstract def, since in practice it had no effect in Scala 2.

## Case Class Companion

The companion object of a case class does not extend any of the `Function{0-23}` traits anymore.
In particular, it does not inherit their methods: `tupled`, `curried`, `andThen`, `compose`...

For instance, this is not permitted anymore:
{% tabs scala-2-companion_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
case class Foo(x: Int, b: Boolean)

Foo.curried(1)(true)
Foo.tupled((2, false))
~~~ 
{% endtab %}
{% endtabs %}

A cross-compiling solution is to explicitly eta-expand the method `Foo.apply`.
{% highlight diff %}

-Foo.curried(1)(true)
+(Foo.apply _).curried(1)(true)

-Foo.tupled((2, false))
+(Foo.apply _).tupled((2, false))
{% endhighlight %}

Or, for performance reasons, you can introduce an intermediate function value.
{% tabs scala-3-companion_2 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
val fooCtr: (Int, Boolean) => Foo = (x, b) => Foo(x, b)

fooCtr.curried(1)(true)
fooCtr.tupled((2, false))
~~~
{% endtab %}
{% endtabs %}
## Explicit Call to `unapply`

In Scala, case classes have an auto-generated extractor method, called `unapply` in their companion object.
Its signature has changed between Scala 2.13 and Scala 3.

The new signature is option-less (see the new [Pattern Matching]({{ site.scala3ref }}/changed-features/pattern-matching.html) reference), which causes an incompatibility when `unapply` is called explicitly.

Note that this problem does not affect user-defined extractors, whose signature stays the same across Scala versions.

Given the following case class definition:
{% tabs shared-unapply_1 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
case class Location(lat: Double, long: Double)
~~~
{% endtab %}
{% endtabs %}

The Scala 2.13 compiler generates the following `unapply` method:
{% tabs scala-2-unapply_2 %}
{% tab 'Scala 2 Only' %}
~~~ scala
object Location {
  def unapply(location: Location): Option[(Double, Double)] = Some((location.lat, location.long))
}
~~~ 
{% endtab %}
{% endtabs %}

Whereas the Scala 3 compiler generates:
{% tabs scala-3-unapply_2 %}
{% tab 'Scala 3 Only' %}
~~~ scala
object Location {
  def unapply(location: Location): Location = location
}
~~~
{% endtab %}
{% endtabs %}

Consequently the following code does not compile anymore in Scala 3.
{% tabs scala-2-unapply_3 %}
{% tab 'Scala 2 Only' %}
~~~ scala
def tuple(location: Location): (Int, Int) = {
  Location.unapply(location).get // [E008] In Scala 3, Not Found Error: value get is not a member of Location
}
~~~
{% endtab %}
{% endtabs %}

A possible solution, in Scala 3, is to use pattern binding:

{% highlight diff %}
def tuple(location: Location): (Int, Int) = {
-  Location.unapply(location).get
+  val Location(lat, lon) = location
+  (lat, lon)
}
{% endhighlight %}

## Invisible Bean Property

The getter and setter methods generated by the `BeanProperty` annotation are now invisible in Scala 3 because their primary use case is the interoperability with Java frameworks.

For instance, the below Scala 2 code would fail to compile in Scala 3:
{% tabs scala-2-bean_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
class Pojo() {
  @BeanProperty var fooBar: String = ""
}

val pojo = new Pojo()

pojo.setFooBar("hello") // [E008] In Scala 3, Not Found Error: value setFooBar is not a member of Pojo

println(pojo.getFooBar()) // [E008] In Scala 3, Not Found Error: value getFooBar is not a member of Pojo
~~~ 
{% endtab %}
{% endtabs %}

In Scala 3, the solution is to call the more idiomatic `pojo.fooBar` getter and setter.

{% highlight diff %}
val pojo = new Pojo()

-pojo.setFooBar("hello")
+pojo.fooBar = "hello"

-println(pojo.getFooBar())
+println(pojo.fooBar)
{% endhighlight %}

## `=> T` as Type Argument

A type of the form `=> T` cannot be used as an argument to a type parameter anymore.

This decision is explained in [this comment](https://github.com/lampepfl/dotty/blob/0f1a23e008148f76fd0a1c2991b991e1dad600e8/compiler/src/dotty/tools/dotc/core/ConstraintHandling.scala#L144-L152) of the Scala 3 source code.

For instance, it is not allowed to pass a function of type `Int => (=> Int) => Int` to the `uncurried` method since it would assign `=> Int` to the type parameter `T2`. 

{% highlight text %}
-- [E134] Type Mismatch Error: src/main/scala/by-name-param-type-infer.scala:3:41
3 |  val g: (Int, => Int) => Int = Function.uncurried(f)
  |                                ^^^^^^^^^^^^^^^^^^
  |None of the overloaded alternatives of method uncurried in object Function with types
  | [T1, T2, T3, T4, T5, R]
  |  (f: T1 => T2 => T3 => T4 => T5 => R): (T1, T2, T3, T4, T5) => R
  | [T1, T2, T3, T4, R](f: T1 => T2 => T3 => T4 => R): (T1, T2, T3, T4) => R
  | [T1, T2, T3, R](f: T1 => T2 => T3 => R): (T1, T2, T3) => R
  | [T1, T2, R](f: T1 => T2 => R): (T1, T2) => R
  |match arguments ((Test.f : Int => (=> Int) => Int))
{% endhighlight %}

The solution depends on the situation. In the given example, you can either:
  - define your own `uncurried` method with the appropriate signature
  - inline the implementation of `uncurried` locally

## Wildcard Type Argument

Scala 3 cannot reduce the application of a higher-kinded abstract type member to the wildcard argument.

For instance, the below Scala 2 code would fail to compile in Scala 3:
{% tabs scala-2-wildcard_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
trait Example {
  type Foo[A]

  def f(foo: Foo[_]): Unit // [E043] In Scala 3, Type Error: unreducible application of higher-kinded type Example.this.Foo to wildcard arguments 
}
~~~
{% endtab %}
{% endtabs %}

We can fix this by using a type parameter:

{% highlight diff %}
-def f(foo: Foo[_]): Unit
+def f[A](foo: Foo[A]): Unit
{% endhighlight %}

But this simple solution does not work when `Foo` is itself used as a type argument.
{% tabs scala-2-wildcard_2 %}
{% tab 'Scala 2 Only' %}
~~~ scala
def g(foos: Seq[Foo[_]]): Unit
~~~
{% endtab %}
{% endtabs %}

In such case, we can use a wrapper class around `Foo`:

{% highlight diff %}
+class FooWrapper[A](foo: Foo[A])

-def g(foos: Seq[Foo[_]]): Unit
+def g(foos: Seq[FooWrapper[_]]): Unit
{% endhighlight %}