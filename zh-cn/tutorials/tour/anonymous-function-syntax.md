---
layout: tutorial
title: Anonymous Function Syntax

disqus: true

tutorial: scala-tour
num: 14
---

Scala provides a relatively lightweight syntax for defining anonymous functions. The following expression creates a successor function for integers:

    (x: Int) => x + 1

This is a shorthand for the following anonymous class definition:

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

It is also possible to define functions with multiple parameters:

    (x: Int, y: Int) => "(" + x + ", " + y + ")"

or with no parameter:

    () => { System.getProperty("user.dir") }

There is also a very lightweight way to write function types. Here are the types of the three functions defined above:

    Int => Int
    (Int, Int) => String
    () => String

This syntax is a shorthand for the following types:

    Function1[Int, Int]
    Function2[Int, Int, String]
    Function0[String]
