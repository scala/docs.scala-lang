---
layout: tutorial
title: Higher-order Functions

disqus: true

tutorial: scala-tour
num: 18
---

Scala allows the definition of higher-order functions. These are functions that _take other functions as parameters_, or whose _result is a function_. Here is a function `apply` which takes another function `f` and a value `v` and applies function `f` to `v`:

    def apply(f: Int => String, v: Int) = f(v)

_Note: methods are automatically coerced to functions if the context requires this._

Here is another example:
 
    class Decorator(left: String, right: String) {
      def layout[A](x: A) = left + x.toString() + right
    }
    
    object FunTest extends App {
      def apply(f: Int => String, v: Int) = f(v)
      val decorator = new Decorator("[", "]")
      println(apply(decorator.layout, 7))
    }
 
Execution yields the output:

    [7]

In this example, the method `decorator.layout` is coerced automatically to a value of type `Int => String` as required by method `apply`. Please note that method `decorator.layout` is a _polymorphic method_ (i.e. it abstracts over some of its signature types) and the Scala compiler has to instantiate its method type first appropriately.
