---
layout: tour
title: Clases Case
partof: scala-tour

num: 5
language: es

next-page: compound-types
previous-page: classes
---

Scala da soporte a la noción de _clases case_ (en inglés _case classes_, desde ahora _clases Case_). Las clases Case son clases regulares las cuales exportan sus parámetros constructores y a su vez proveen una descomposición recursiva de sí mismas a través de [reconocimiento de patrones](pattern-matching.html).

A continuación se muestra un ejemplo para una jerarquía de clases la cual consiste de una super clase abstracta llamada `Term` y tres clases concretas: `Var`, `Fun` y `App`.

    abstract class Term
    case class Var(name: String) extends Term
    case class Fun(arg: String, body: Term) extends Term
    case class App(f: Term, v: Term) extends Term

Esta jerarquía de clases puede ser usada para representar términos de [cálculo lambda no tipado](https://www.ezresult.com/article/Lambda_calculus). Para facilitar la construcción de instancias de clases Case, Scala no requiere que se utilice la primitiva `new`. Simplemente es posible utilizar el nombre de la clase como una llamada a una función.

Aquí un ejemplo:

    Fun("x", Fun("y", App(Var("x"), Var("y"))))

Los parámetros constructores de las clases Case son tratados como valores públicos y pueden ser accedidos directamente.

    val x = Var("x")
    println(x.name)

Para cada una de las clases Case el compilador de Scala genera el método `equals` el cual implementa la igualdad estructural y un método `toString`. Por ejemplo:

    val x1 = Var("x")
    val x2 = Var("x")
    val y1 = Var("y")
    println("" + x1 + " == " + x2 + " => " + (x1 == x2))
    println("" + x1 + " == " + y1 + " => " + (x1 == y1))

imprime

    Var(x) == Var(x) => true
    Var(x) == Var(y) => false

Solo tiene sentido definir una clase Case si el reconocimiento de patrones es usado para descomponer la estructura de los datos de la clase. El siguiente objeto define define una función de impresión `elegante` (en inglés `pretty`) que imprime en pantalla nuestra representación del cálculo lambda:

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

En nuestro ejemplo, la función `printTerm` es expresada como una sentencia basada en reconocimiento de patrones, la cual comienza con la palabra reservada `match` y consiste en secuencias de sentencias tipo `case PatrónBuscado => Código que se ejecuta`.

El programa de arriba también define una función `isIdentityFun` la cual comprueba si un término dado se corresponde con una función identidad simple. Ese ejemplo utiliza patrones y comparaciones más avanzadas (obsérvese la guarda `if x==y`). 
Tras reconocer un patrón con un valor dado, se evalúa la comparación (definida después de la palabra clave `if`). 
Si retorna `true` (verdadero), el reconocimiento es exitoso; de no ser así, falla y se intenta con el siguiente patrón.
