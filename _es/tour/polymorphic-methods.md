---
layout: tour
title: Métodos polimórficos

discourse: false

partof: scala-tour

num: 21
language: es

next-page: regular-expression-patterns
previous-page: pattern-matching
---

Los métodos en Scala pueden ser parametrizados tanto con valores como con tipos. Como a nivel de clase, parámetros de valores son encerrados en un par de paréntesis, mientras que los parámetros de tipo son declarados dentro de un par de corchetes.

Aquí hay un ejemplo:

    object PolyTest extends App {
      def dup[T](x: T, n: Int): List[T] =
        if (n == 0) Nil
        else x :: dup(x, n - 1)
      println(dup[Int](3, 4)) // linea 5
      println(dup("three", 3)) // linea 6
    }

El método `dup` en el objeto `PolyTest` es parametrizado con el tipo `T` y con los parámetros `x: T` y `n: Int`. Cuando el método `dup` es llamado, el programador provee los parámetros requeridos _(vea la linea 5 del programa anterior)_, pero como se muestra en la linea 6 no es necesario que se provea el parámetro de tipo `T` explicitamente. El sistema de tipado de Scala puede inferir estos tipos. Esto es realizado a través de la observación del tipo de los parámetros pasados y del contexto donde el método es invocado.

Por favor note que el trait `App` está diseñado para escribir programas cortos de pruebas. Debe ser evitado en código en producción (para versiones de Scala 2.8.x y anteriores) ya que puede afectar la habilidad de la JVM de optimizar el código resultante; por favor use `def main()` en su lugar.
