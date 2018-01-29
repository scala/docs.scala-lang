---
layout: tour
title: Objetos Extractores

discourse: false

partof: scala-tour

num: 8
language: es

next-page: generic-classes
previous-page: compound-types
---

En Scala pueden ser definidos patrones independientemente de las clases Caso (en inglés case classes, desde ahora clases Case). Para este fin exite un método llamado `unapply` que proveera el ya dicho extractor. Por ejemplo, en el código siguiente se define el objeto extractor `Twice`

    object Twice {
      def apply(x: Int): Int = x * 2
      def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
    }

    object TwiceTest extends App {
      val x = Twice(21)
      x match { case Twice(n) => Console.println(n) } // imprime 21
    }

Hay dos convenciones sintácticas que entran en juego aquí:

El patrón `case Twice(n)` causará la invocación del método `Twice.unapply`, el cual es usado para reconocer cualquier número par; el valor de retorno de `unapply` indica si el argumento produjo una coincidencia o no, y cualquier otro sub valor que pueda ser usado para un siguiente reconocimiento. Aquí, el sub-valor es `z/2`.

El método `apply` no es necesario para reconocimiento de patrones. Solamente es usado para proveer un constructor. `val x = Twice(21)` se puede expandir como `val x = Twice.apply(21)`.

El tipo de retorno de un método `unapply` debería ser elegido de la siguiente manera:
* Si es solamente una comprobación, retornar un `Boolean`. Por ejemplo, `case esPar()`
* Si retorna un único sub valor del tipo T, retornar un `Option[T]`
* Si quiere retornar varios sub valores `T1,...,Tn`, es necesario agruparlos en una tupla de valores opcionales `Option[(T1,...,Tn)]`.

Algunas veces, el número de sub valores es fijo y nos gustaría retornar una secuencia. Por esta razón, siempre es posible definir patrones a través de `unapplySeq`. El último sub valor de tipo `Tn` tiene que ser `Seq[S]`. Este mecanismo es usado por ejemplo en el patrón `case List(x1, ..., xn)`.

Los objetos extractores pueden hacer el código más mantenible. Para más detalles lea el paper ["Matching Objects with Patterns (Reconociendo objetos con patrones)"](https://infoscience.epfl.ch/record/98468/files/MatchingObjectsWithPatterns-TR.pdf) (ver sección 4) por Emir, Odersky y Williams (Enero de 2007).
