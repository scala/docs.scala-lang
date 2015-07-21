---
layout: tutorial
title: Singleton Objects

disqus: true

tutorial: scala-tour
num: 12

tutorial-next: xml-processing
tutorial-previous: pattern-matching
---

Methods and values that aren't associated with individual instances of a [class](classes.html) belong in *singleton objects*, denoted by using the keyword `object` instead of `class`.

    package test

    object Blah {
      def sum(l: List[Int]): Int = l.sum
    }

This `sum` method is available globally, and can be referred to, or imported, as `test.Blah.sum`.

Singleton objects are sort of a shorthand for defining a single-use class, which can't directly be instantiated, and a `val` member at the point of definition of the `object`, with the same name. Indeed, like `val`s, singleton objects can be defined as members of a [trait](traits.html) or class, though this is atypical.

A singleton object can extend classes and traits. In fact, a [case class](case-classes.html) with no [type parameters](generic-classes.html) will by default create a singleton object of the same name, with a [`Function*`](http://www.scala-lang.org/api/current/scala/Function1.html) trait implemented.

## Companions ##

Most singleton objects do not stand alone, but instead are associated with a class of the same name. The “singleton object of the same name” of a case class, mentioned above, is an example of this. When this happens, the singleton object is called the *companion object* of the class, and the class is called the *companion class* of the object.

[Scaladoc](https://wiki.scala-lang.org/display/SW/Introduction) has special support for jumping between a class and its companion: if the big “C” or “O” circle has its edge folded up at the bottom, you can click the circle to jump to the companion.

A class and its companion object, if any, must be defined in the same source file. Like this:

    class IntPair(val x: Int, val y: Int)

    object IntPair {
      import math.Ordering

      implicit def ipord: Ordering[IntPair] =
        Ordering.by(ip => (ip.x, ip.y))
    }

It's common to see typeclass instances as [implicit values](implicit-parameters.html), such as `ipord` above, defined in the companion, when following the typeclass pattern. This is because the companion's members are included in the default implicit search for related values.

## Notes for Java programmers ##

`static` is not a keyword in Scala. Instead, all members that would be static, including classes, should go in a singleton object instead. They can be referred to with the same syntax, imported piecemeal or as a group, and so on.

Frequently, Java programmers define static members, perhaps `private`, as implementation aids for their instance members. These move to the companion, too; a common pattern is to import the companion object's members in the class, like so:

    class X {
      import X._

      def blah = foo
    }

    object X {
      private def foo = 42
    }

This illustrates another feature: in the context of `private`, a class and its companion are friends. `object X` can access private members of `class X`, and vice versa. To make a member *really* private to one or the other, use `private[this]`.

For Java convenience, methods, including `var`s and `val`s, defined directly in a singleton object also have a static method defined in the companion class, called a *static forwarder*. Other members are accessible via the `X$.MODULE$` static field for `object X`.

If you move everything to a companion object and find that all you have left is a class you don't want to be able to instantiate, simply delete the class. Static forwarders will still be created.
