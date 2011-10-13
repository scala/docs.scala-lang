---
layout: default
type: sip
title: Inline classes
---

Note: Derived from [this google document](https://docs.google.com/document/d/1k-aGAGmbrDB-2pJ3uDPpHVKno6p-XbnkVHDc07zPrzQ/edit?hl=en_US)

## Abstract ##

A minimal language construct is proposed that allows for more concise use of the common "type trait" and "extension method" patterns in Scala. This construct permits the compiler to eliminate object creation so long as the transformation preserves the semantics of the original program. In addition, an annotation is proposed for the standard library that verifies such an optimization was performed.


## Motivation ##

The popular extension method patter, sometimes called the Pimp My Library pattern is used in Scala to extend pre-existing classes with new methods, fields, and interfaces.
There is also another common ‘extension’ use case known as type traits or type classes (see `scala.math.Numeric`).  Type classes offer an alternative to pure inheritance hierarchies that is very similar to the extension method pattern.

The main drawback to both of these techniques is that they suffer the creation of an extra object at every invocation to gain the convenient syntax. This makes these useful patterns unsuitable for use in performance-critical code. In these situations it is common to remove use of the pattern and resort to using an object with static helper methods. In many cases, this is a simple mechanical transformation that could be performed by an optimizing compiler.

This proposal outlines inline semantic changes

## Description ##

The compiler shall be adapted to be able to inline the instantiation and usage of methods of a class in an expression if an instance of the class does not escape the expression.  This analysis occurs after all method inline expansion occurs.   That is, if a method returns an instance of the class, but is marked for inlining and the class itself is marked for inlining, then the entire instantation can still be inlined if the class does not escape the expanded expression.

For example, given the following class and object pairing:

{% highlight scala %}
@inline
class Foo(x: Int) {
  def plus(y: Int) = x + y
  override def toString = "Foo("+x+")"
}
object Foo {
  @inline final def apply(x: Int): Foo = new Foo(x)
}
{% endhighlight %}

The following expressions could be inlined:

{% highlight scala %}
new Foo(1) plus 2
new Foo(1) toString
new Foo(3) plus (_: Int)
Foo(1) plus 2
Foo(1).toString
Foo(3) plus (_: Int)
{% endhighlight %}

And the following expressions would not be inlined:

{% highlight scala %}
new Foo(1)
(x: Int) => new Foo(x)
Foo(_:Int)
{% endhighlight %}

In the example :

{% highlight scala %}
foo(1).toString
{% endhighlight %}

the inliner would first expand the Foo.apply method call, making the expression:

{% highlight scala %}
new Foo(1).toString
{% endhighlight %}

Then during the inline class pass, the instance of Foo created is seen to not escape the the expression, and the entire call is inlined into equivalent code for:

{% highlight scala %}
"Foo(" + 1 + ")"
{% endhighlight %}

The suggested implementation is for the compiler to generate static methods for the Foo class and delegate to them on inlining, unless they are themselves inlined.  This expression would actually be:

{% highlight scala %}
Foo.methods$.toString(1)
{% endhighlight %}

The goal of inling class is to remove the object instantiation, not necessarily remove the method call.  However, an inlined class my also have its methods marked inline.  In this case, an optional third pass of the inliner could attempt to remove any method calls after class inlining has been acheived.  This allows expressions involving inlined classes to inline all code relating to a method, as opposed to delegating to static methods for the class.

So given this class:

{% highlight scala %}
@inline
class Foo(x: Int) {
  @inline def plus(y: Int) = x + y
}
{% endhighlight %}

and the expression:

{% highlight scala %}
new Foo(1) plus 2
{% endhighlight %}

The compiler would eventually inline this into:

{% highlight scala %}
1 + 2
{% endhighlight %}

Most likely, this third pass is uneeded for targetting the JVM and other backends.  It is noted in the proposal in case the need does arrive.

In addition to the new inlining optimisations, the `@inline` annotations will be modified to accept an error behavior in its constructor of `WARN`, `FAIL` or `SILENT` with the default being `WARN`.

If a class or method marked `@inline` is unable to be inlined by the compiler, the compiler will take the following actions:
* If the error behavior is `WARN`, than a warning is issued at the point where inlining could not occur.  Compilation proceeds. 
* If the error behavior is `FAIL`, then an error is issued at the point where inlining could not occur.  Compilation is halted.
* If the error behavior is `SILENT`, then no action is taken, and the class is treated normally.

## Specification ##

No known spec changes are required.  The `@inline` annotation is considered an implementation optimisation.

## Consequences ##

The details of opimtizations are left to the compiler implementer, but some suggestions are envisioned to help achieve a common optimization strategy across the features in this proposal.   Inlined classes could be implemented as follows:

{% highlight scala %}
@inline final class Bar(x: Int, y: String) {
  def foo(z: Double) = y + x + "-" + z
}
{% endhighlight %}

would compile as follows:

{% highlight scala %}
final class Bar(x: Int, y: String) {
  def foo(z: Double) = Bar.methods$.foo(x,y,z)
}
object Bar {
  <synthetic> object methods$ {
    <synthetic> final def foo($t1: Int, $t2: String, $p1: Double) =
        $t2 + $t1 + "-" + $p1
  }
}
{% endhighlight %}

And the expression:

{% highlight scala %}
new Bar(5, "Time-").foo(1.0)
{% endhighlight %}

would compile to:

{% highlight scala %}
Bar.methods$.foo(5, "Time-", 1.0)
{% endhighlight %}

Allowing the JVM inliner to continue inlining the foo method.  Since this optimisations are at the compiler’s disgresison, arbitrary constraints may be made on classes that can participate in inlining.   The above suggestion of embedding ‘static’ methods for inlined classes rather than directly inlining is meant to strike a balance between generated code size and efficiency.   It is the hope tha tthe JVM inliner will inline these static methods where it makes sense, but profiling alternatives will lead to a much better decision.

### Requirements for inlined classes ###

As a possible first implementation of inlined classes, the following requirements will be in place:
* classes may only have other `@inline` annotated classes for parents
* classes may only define methods, the exception being constructor arguments.
