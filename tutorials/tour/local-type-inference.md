---
layout: tutorial
title: Local Type Inference

disqus: true

tutorial: scala-tour
num: 29
---
Scala has a built-in type inference mechanism which allows the programmer to omit certain type annotations. It is, for instance, often not necessary in Scala to specify the type of a variable, since the compiler can deduce the type from the initialization expression of the variable. Also return types of methods can often be omitted since they corresponds to the type of the body, which gets inferred by the compiler.

Here is an example:

    object InferenceTest1 extends App {
      val x = 1 + 2 * 3         // the type of x is Int
      val y = x.toString()      // the type of y is String
      def succ(x: Int) = x + 1  // method succ returns Int values
    }

For recursive methods, the compiler is not able to infer a result type. Here is a program which will fail the compiler for this reason:

    object InferenceTest2 {
      def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
    }

It is also not compulsory to specify type parameters when [polymorphic methods](polymorphic-methods.html) are called or [generic classes](generic-classes.html) are instantiated. The Scala compiler will infer such missing type parameters from the context and from the types of the actual method/constructor parameters.

Here is an example which illustrates this:

    case class MyPair[A, B](x: A, y: B);
    object InferenceTest3 extends App {
      def id[T](x: T) = x
      val p = MyPair(1, "scala") // type: MyPair[Int, String]
      val q = id(1)              // type: Int
    }

The last two lines of this program are equivalent to the following code where all inferred types are made explicit:

    val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
    val y: Int = id[Int](1)

In some situations it can be quite dangerous to rely on Scala's type inference mechanism as the following program shows:

    object InferenceTest4 {
      var obj = null
      obj = new Object()
    }

This program does not compile because the type inferred for variable `obj` is `Null`. Since the only value of that type is `null`, it is impossible to make this variable refer to another value.

