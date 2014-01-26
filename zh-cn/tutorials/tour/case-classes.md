---
layout: tutorial
title: Case Classes

disqus: true

tutorial: scala-tour
num: 5
---

Scala supports the notion of _case classes_. Case classes are regular classes which export their constructor parameters and which provide a recursive decomposition mechanism via [pattern matching](pattern-matching.html).

Here is an example for a class hierarchy which consists of an abstract super class `Term` and three concrete case classes `Var`, `Fun`, and `App`.

    abstract class Term
    case class Var(name: String) extends Term
    case class Fun(arg: String, body: Term) extends Term
    case class App(f: Term, v: Term) extends Term

This class hierarchy can be used to represent terms of the [untyped lambda calculus](http://www.ezresult.com/article/Lambda_calculus). To facilitate the construction of case class instances, Scala does not require that the `new` primitive is used. One can simply use the class name as a function.

Here is an example:

    Fun("x", Fun("y", App(Var("x"), Var("y"))))

The constructor parameters of case classes are treated as public values and can be accessed directly.

    val x = Var("x")
    println(x.name)

For every case class the Scala compiler generates an `equals` method which implements structural equality and a `toString` method. For instance:

    val x1 = Var("x")
    val x2 = Var("x")
    val y1 = Var("y")
    println("" + x1 + " == " + x2 + " => " + (x1 == x2))
    println("" + x1 + " == " + y1 + " => " + (x1 == y1))

will print

    Var(x) == Var(x) => true
    Var(x) == Var(y) => false

It makes only sense to define case classes if pattern matching is used to decompose data structures. The following object defines a pretty printer function for our lambda calculus representation:

    object TermTest extends scala.App {
      def printTerm(term: Term) {
        term match {
          case Var(n) =>
            print(n)
          case Fun(x, b) =>
            print("^" + x + ".")
            printTerm(b)
          case App(f, v) =>
            print("(")
            printTerm(f)
            print(" ")
            printTerm(v)
            print(")")
        }
      }
      def isIdentityFun(term: Term): Boolean = term match {
        case Fun(x, Var(y)) if x == y => true
        case _ => false
      }
      val id = Fun("x", Var("x"))
      val t = Fun("x", Fun("y", App(Var("x"), Var("y"))))
      printTerm(t)
      println
      println(isIdentityFun(id))
      println(isIdentityFun(t))
    }

In our example, the function `printTerm` is expressed as a pattern matching statement starting with the `match` keyword and consisting of sequences of `case Pattern => Body` clauses.
The program above also defines a function `isIdentityFun` which checks if a given term corresponds to a simple identity function. This example uses deep patterns and guards. After matching a pattern with a given value, the guard (defined after the keyword `if`) is evaluated. If it returns `true`, the match succeeds; otherwise, it fails and the next pattern will be tried.
