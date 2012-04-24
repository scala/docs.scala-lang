---
layout: tutorial
title: Automatic Type-Dependent Closure Construction

disqus: true

tutorial: scala-tour
num: 16
---

Scala allows parameterless function names as parameters of methods. When such a method is called, the actual parameters for parameterless function names are not evaluated and a nullary function is passed instead which encapsulates the computation of the corresponding parameter (so-called *call-by-name* evalutation).

The following code demonstrates this mechanism:

    object TargetTest1 extends App {
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if (cond) {
          body
          whileLoop(cond)(body)
        }
      var i = 10
      whileLoop (i > 0) {
        println(i)
        i -= 1
      }
    }

The function `whileLoop` takes two parameters `cond` and `body`. When the function is applied, the actual parameters do not get evaluated. But whenever the formal parameters are used in the body of `whileLoop`, the implicitly created nullary functions will be evaluated instead. Thus, our method `whileLoop` implements a Java-like while-loop with a recursive implementation scheme.

We can combine the use of [infix/postfix operators](operators.html) with this mechanism to create more complex statements (with a nice syntax).

Here is the implementation of a loop-unless statement:

    object TargetTest2 extends App {
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if (!cond) unless(cond)
        }
      }
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }
The `loop` function just accepts a body of a loop and returns an instance of class `LoopUnlessCond` (which encapsulates this body object). Note that the body didn't get evaluated yet. Class `LoopUnlessCond` has a method `unless` which we can use as a *infix operator*. This way, we achieve a quite natural syntax for our new loop: `loop { < stats > } unless ( < cond > )`.

Here's the output when `TargetTest2` gets executed:

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1

