---
layout: tutorial
title: Operators

disqus: true

tutorial: scala-tour
num: 17
---

Any method which takes a single parameter can be used as an *infix operator* in Scala. Here is the definition of class `MyBool` which defines three methods `and`, `or`, and `negate`.

    class MyBool(x: Boolean) {
      def and(that: MyBool): MyBool = if (x) that else this
      def or(that: MyBool): MyBool = if (x) this else that
      def negate: MyBool = new MyBool(!x)
    }

It is now possible to use `and` and `or` as infix operators:

    def not(x: MyBool) = x negate; // semicolon required here
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)

As the first line of this code shows, it is also possible to use nullary methods as postfix operators. The second line defines an `xor` function using the `and` and `or` methods as well as the new `not` function. In this example the use of _infix operators_ helps to make the definition of `xor` more readable.

Here is the corresponding code in a more traditional object-oriented programming language syntax:

    def not(x: MyBool) = x.negate; // semicolon required here
    def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
