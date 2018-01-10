---
layout: tour
title: Inferencia de tipos Local

discourse: false

partof: scala-tour

num: 29
language: es

next-page: unified-types
previous-page: self-types
---

Scala tiene incorporado un mecanismo de inferencia de tipos el cual permite al programador omitir ciertos tipos de anotaciones. Por ejemplo, generalmente no es necesario especificar el tipo de una variable, ya que el compilador puede deducir el tipo mediante la expresión de inicialización de la variable. También puede generalmente omitirse los tipos de retorno de métodos ya que se corresponden con el tipo del cuerpo, que es inferido por el compilador.

Aquí hay un ejemplo:

    object InferenceTest1 extends App {
      val x = 1 + 2 * 3         // el tipo de  x es Int
      val y = x.toString()      // el tipo de y es String
      def succ(x: Int) = x + 1  // el método succ retorna valores Int
    }

Para métodos recursivos, el compilador no es capaz de inferir el tipo resultado. A continuación mostramos un programa el cual falla por esa razón:

    object InferenceTest2 {
      def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
    }

Tampoco es obligatorio especificar el tipo de los parámetros cuando se trate de [métodos polimórficos](polymorphic-methods.html) o sean instanciadas [clases genéricas](generic-classes.html). El compilador de Scala inferirá esos tipos de parámetros faltantes mediante el contexto y de los tipos de los parámetros reales del método/constructor.

Aquí se muestra un ejemplo que ilustra esto:

    case class MyPair[A, B](x: A, y: B);
    object InferenceTest3 extends App {
      def id[T](x: T) = x
      val p = MyPair(1, "scala") // tipo: MyPair[Int, String]
      val q = id(1)              // tipo: Int
    }

Las últimas dos lineas de este programa son equivalentes al siguiente código, donde todos los tipos inferidos son especificados explicitamente:

    val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
    val y: Int = id[Int](1)

En algunas situaciones puede ser bastante peligroso confiar en el mecanismo de inferencia de tipos de Scala, como se ilustra en el siguiente ejemplo:

    object InferenceTest4 {
      var obj = null
      obj = new Object()
    }

Este programa no compila porque el tipo inferido para la variable `obj` es `Null`. Ya que el único valor de ese tipo es `null`, es imposible hacer que esta variable refiera a otro valor.
