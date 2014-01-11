---
layout: tutorial
title: Extractor Objects

disqus: true

tutorial: scala-tour
num: 8
---

In Scala, patterns can be defined independently of case classes. To this end, a method named unapply is defined to yield a so-called extractor. For instance, the following code defines an extractor object Twice.

    object Twice {
      def apply(x: Int): Int = x * 2
      def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
    }
    
    object TwiceTest extends App {
      val x = Twice(21)
      x match { case Twice(n) => Console.println(n) } // prints 21
    }
There are two syntactic conventions at work here:

The pattern `case Twice(n)` will cause an invocation of `Twice.unapply`, which is used to match any even number; the return value of the `unapply` signals whether the argument has matched or not, and any sub-values that can be used for further matching. Here, the sub-value is `z/2`

The `apply` method is not necessary for pattern matching.  It is only used to mimick a constructor. `val x = Twice(21)` expands to `val x = Twice.apply(21)`.

The return type of an `unapply` should be chosen as follows:
* If it is just a test, return a `Boolean`. For instance `case even()`
* If it returns a single sub-value of type T, return an `Option[T]`
* If you want to return several sub-values `T1,...,Tn`, group them in an optional tuple `Option[(T1,...,Tn)]`.

Sometimes, the number of sub-values is fixed and we would like to return a sequence. For this reason, you can also define patterns through `unapplySeq`. The last sub-value type `Tn` has to be `Seq[S]`. This mechanism is used for instance in pattern `case List(x1, ..., xn)`.

Extractors can make code more maintainable. For details, read the paper ["Matching Objects with Patterns"](http://lamp.epfl.ch/~emir/written/MatchingObjectsWithPatterns-TR.pdf) (see section 4) by Emir, Odersky and Williams (January 2007).
