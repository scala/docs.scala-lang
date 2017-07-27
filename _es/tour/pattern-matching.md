---
layout: tour
title: Reconocimiento de patrones

discourse: false

partof: scala-tour

num: 20
language: es

next-page: polymorphic-methods
previous-page: higher-order-functions
---

_Nota de traducción: Es dificil encontrar en nuestro idioma una palabra que se relacione directamente con el significado de `match` en inglés. Podemos entender a `match` como "coincidir" o "concordar" con algo. En algunos lugares se utiliza la palabra `machear`, aunque esta no existe en nuestro idioma con el sentido que se le da en este texto, sino que se utiliza como traducción de `match`._

Scala tiene incorporado un mecanismo general de reconocimiento de patrones. Este permite identificar cualquier tipo de datos una política primero-encontrado. Aquí se muestra un pequeño ejemplo el cual muestra cómo coincidir un valor entero:

    object MatchTest1 extends App {
      def matchTest(x: Int): String = x match {
        case 1 => "one"
        case 2 => "two"
        case _ => "many"
      }
      println(matchTest(3))
    }

El bloque con las sentencias `case` define una función la cual mapea enteros a cadenas de caracteres (strings). La palabra reservada `match` provee una manera conveniente de aplicar una función (como la función anterior) a un objeto.

Aquí se muestra un ejemplo el cual coincide un valor contra un patrón de diferentes tipos:

    object MatchTest2 extends App {
      def matchTest(x: Any): Any = x match {
        case 1 => "one"
        case "two" => 2
        case y: Int => "scala.Int"
      }
      println(matchTest("two"))
    }

El primer `case` coincide si `x` se refiere a un valor entero `1`. El segundo `case` coincide si `x` es igual al string `"two"`. El tercero consiste en un patrón tipado (se provee un tipo); se produce una coincidencia contra cualquier entero que se provea y además se liga la variable `y` al valor pasado `x` de tipo entero.

El reconocimiento de patrones en Scala es más útil para hacer coincidir tipos algebráicos expresados mediante [clases case](case-classes.html). Scala también permite la definición de patrones independientemente de las clases Case, a través del método `unapply` de [objetos extractores](extractor-objects.html).
