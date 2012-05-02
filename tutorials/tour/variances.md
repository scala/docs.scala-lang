---
layout: tutorial
title: Variances

disqus: true

tutorial: scala-tour
num: 31
---

Scala supports variance annotations of type parameters of [generic classes](generic-classes.html). In contrast to Java 5 (aka. [JDK 1.5](http://java.sun.com/j2se/1.5/)), variance annotations may be added when a class abstraction is defined, whereas in Java 5, variance annotations are given by clients when a class abstraction is used.

In the page about [generic classes](generic-classes.html) an example for a mutable stack was given. We explained that the type defined by the class `Stack[T]` is subject to invariant subtyping regarding the type parameter. This can restrict the reuse of the class abstraction. We now derive a functional (i.e. immutable) implementation for stacks which does not have this restriction. Please note that this is an advanced example which combines the use of [polymorphic methods](polymorphic-methods.html), [lower type bounds](lower-type-bounds.html), and covariant type parameter annotations in a non-trivial fashion. Furthermore we make use of [inner classes](inner-classes.html) to chain the stack elements without explicit links.

    class Stack[+A] {
      def push[B >: A](elem: B): Stack[B] = new Stack[B] {
        override def top: B = elem
        override def pop: Stack[B] = Stack.this
        override def toString() = elem.toString() + " " +
                                  Stack.this.toString()
      }
      def top: A = sys.error("no element on stack")
      def pop: Stack[A] = sys.error("no element on stack")
      override def toString() = ""
    }
    
    object VariancesTest extends App {
      var s: Stack[Any] = new Stack().push("hello");
      s = s.push(new Object())
      s = s.push(7)
      println(s)
    }

The annotation `+T` declares type `T` to be used only in covariant positions. Similarly, `-T` would declare `T` to be used only in contravariant positions. For covariant type parameters we get a covariant subtype relationship regarding this type parameter. For our example this means `Stack[T]` is a subtype of `Stack[S]` if `T` is a subtype of `S`. The opposite holds for type parameters that are tagged with a `-`.

For the stack example we would have to use the covariant type parameter `T` in a contravariant position for being able to define method `push`. Since we want covariant subtyping for stacks, we use a trick and abstract over the parameter type of method `push`. We get a polymorphic method in which we use the element type `T` as a lower bound of `push`'s type variable. This has the effect of bringing the variance of `T` in sync with its declaration as a covariant type parameter. Now stacks are covariant, but our solution allows that e.g. it's possible to push a string on an integer stack. The result will be a stack of type `Stack[Any]`; so only if the result is used in a context where we expect an integer stack, we actually detect the error. Otherwise we just get a stack with a more general element type.
