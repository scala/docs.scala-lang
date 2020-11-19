---
layout: tour
title: Clases genéricas
partof: scala-tour

num: 9
language: es

next-page: implicit-parameters
previous-page: extractor-objects
---

Tal como en Java 5, Scala provee soporte nativo para clases parametrizados con tipos. Eso es llamado clases genéricas y son especialmente importantes para el desarrollo de clases tipo colección.

A continuación se muestra un ejemplo:

    class Stack[T] {
      var elems: List[T] = Nil
      def push(x: T): Unit =
    	elems = x :: elems
      def top: T = elems.head
      def pop() { elems = elems.tail }
    }

La clase `Stack` modela una pila mutable que contiene elementos de un tipo arbitrario `T` (se dice, "una pila de elementos `T`). Los parámetros de tipos nos aseguran que solo elementos legales (o sea, del tipo `T`) sean insertados en la pila (apilados). De forma similar, con los parámetros de tipo podemos expresar que el método `top` solo devolverá elementos de un tipo dado (en este caso `T`).

Aquí se muestra un ejemplo del uso de dicha pila:

    object GenericsTest extends App {
      val stack = new Stack[Int]
      stack.push(1)
      stack.push('a')
      println(stack.top)
      stack.pop()
      println(stack.top)
    }

La salida del programa sería:

    97
    1

_Nota: los subtipos de tipos genéricos es *invariante*. Esto significa que si tenemos una pila de caracteres del tipo `Stack[Char]`, esta no puede ser usada como una pila de enteros tipo `Stack[Int]`. Esto no sería razonable ya que nos permitiría introducir elementos enteros en la pila de caracteres. Para concluir, `Stack[T]` es solamente un subtipo de `Stack[S]` si y solo si `S = T`. Ya que esto puede llegar a ser bastante restrictivo, Scala ofrece un [mecanismo de anotación de parámetros de tipo](variances.html) para controlar el comportamiento de subtipos de tipos genéricos._
