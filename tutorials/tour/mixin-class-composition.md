---
layout: tutorial
title: Mixin Class Composition

disqus: true

tutorial: scala-tour
num: 12
---

As opposed to languages that only support _single inheritance_, Scala has a more general notion of class reuse. Scala makes it possible to reuse the _new member definitions of a class_ (i.e. the delta in relationship to the superclass) in the definition of a new class. This is expressed as a _mixin-class composition_. Consider the following abstraction for iterators.
 
    abstract class AbsIterator {
      type T
      def hasNext: Boolean
      def next: T
    }
 
Next, consider a mixin class which extends `AbsIterator` with a method `foreach` which applies a given function to every element returned by the iterator. To define a class that can be used as a mixin we use the keyword `trait`.
 
    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next) }
    }
 
Here is a concrete iterator class, which returns successive characters of a given string:
 
    class StringIterator(s: String) extends AbsIterator {
      type T = Char
      private var i = 0
      def hasNext = i < s.length()
      def next = { val ch = s charAt i; i += 1; ch }
    }
 
We would like to combine the functionality of `StringIterator` and `RichIterator` into a single class. With single inheritance and interfaces alone this is impossible, as both classes contain member impementations with code. Scala comes to help with its _mixin-class composition_. It allows the programmers to reuse the delta of a class definition, i.e., all new definitions that are not inherited. This mechanism makes it possible to combine `StringIterator` with `RichIterator`, as is done in the following test program which prints a column of all the characters of a given string.
 
    object StringIteratorTest {
      def main(args: Array[String]) {
        class Iter extends StringIterator(args(0)) with RichIterator
        val iter = new Iter
        iter foreach println
      }
    }
 
The `Iter` class in function `main` is constructed from a mixin composition of the parents `StringIterator` and `RichIterator` with the keyword `with`. The first parent is called the _superclass_ of `Iter`, whereas the second (and every other, if present) parent is called a _mixin_.
