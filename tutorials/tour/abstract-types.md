---
layout: tutorial
title: Abstract Types

disqus: true

tutorial: scala-tour
num: 2
outof: 35
languages: [es]
---

In Scala, classes are parameterized with values (the constructor parameters) and with types (if classes are [generic](generic-classes.html)). For reasons of regularity, it is not only possible to have values as object members; types along with values are members of objects. Furthermore, both forms of members can be concrete and abstract.
Here is an example which defines both a deferred value definition and an abstract type definition as members of [class](traits.html) `Buffer`.
 
    trait Buffer {
      type T
      val element: T
    }
 
*Abstract types* are types whose identity is not precisely known. In the example above, we only know that each object of class `Buffer` has a type member `T`, but the definition of class `Buffer` does not reveal to what concrete type the member type `T` corresponds. Like value definitions, we can override type definitions in subclasses. This allows us to reveal more information about an abstract type by tightening the type bound (which describes possible concrete instantiations of the abstract type).

In the following program we derive a class `SeqBuffer` which allows us to store only sequences in the buffer by stating that type `T` has to be a subtype of `Seq[U]` for a new abstract type `U`:
 
    abstract class SeqBuffer extends Buffer {
      type U
      type T <: Seq[U]
      def length = element.length
    }
 
Traits or [classes](classes.html) with abstract type members are often used in combination with anonymous class instantiations. To illustrate this, we now look at a program which deals with a sequence buffer that refers to a list of integers:
 
    abstract class IntSeqBuffer extends SeqBuffer {
      type U = Int
    }
    
    object AbstractTypeTest1 extends App {
      def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
        new IntSeqBuffer {
             type T = List[U]
             val element = List(elem1, elem2)
           }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }
 
The return type of method `newIntSeqBuf` refers to a specialization of trait `Buffer` in which type `U` is now equivalent to `Int`. We have a similar type alias in the anonymous class instantiation within the body of method `newIntSeqBuf`. Here we create a new instance of `IntSeqBuffer` in which type `T` refers to `List[Int]`.

Please note that it is often possible to turn abstract type members into type parameters of classes and vice versa. Here is a version of the code above which only uses type parameters:
 
    abstract class Buffer[+T] {
      val element: T
    }
    abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
      def length = element.length
    }
    object AbstractTypeTest2 extends App {
      def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
        new SeqBuffer[Int, List[Int]] {
          val element = List(e1, e2)
        }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }
 
Note that we have to use [variance annotations](variances.html) here; otherwise we would not be able to hide the concrete sequence implementation type of the object returned from method `newIntSeqBuf`.  Furthermore, there are cases where it is not possible to replace abstract types with type parameters.

