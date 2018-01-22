---
layout: tour
title: Currying

discourse: false

partof: scala-tour

num: 15
language: es

next-page: automatic-closures
previous-page: nested-functions
---

_Nota de traducción: Currying es una técnica de programación funcional nombrada en honor al matemático y lógico Haskell Curry. Es por eso que no se intentará hacer ninguna traducción sobre el término Currying. Entiendase este como una acción, técnica base de PF. Como una nota al paso, el lenguaje de programación Haskell debe su nombre a este eximio matemático._

Los métodos pueden definir múltiples listas de parámetros. Cuando un método es invocado con un número menor de listas de parámetros, en su lugar se devolverá una función que toma las listas faltantes como sus argumentos.

Aquí se muestra un ejemplo:

    object CurryTest extends App {

      def filter(xs: List[Int], p: Int => Boolean): List[Int] =
        if (xs.isEmpty) xs
        else if (p(xs.head)) xs.head :: filter(xs.tail, p)
        else filter(xs.tail, p)

      def modN(n: Int)(x: Int) = ((x % n) == 0)

      val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
      println(filter(nums, modN(2)))
      println(filter(nums, modN(3)))
    }

_Nota: el método `modN` está parcialmente aplicado en las dos llamadas a `filter`; esto significa que solo su primer argumento es realmente aplicado. El término `modN(2)` devuelve una función de tipo `Int => Boolean` y es por eso un posible candidato para el segundo argumento de la función `filter`_

Aquí se muestra la salida del programa anterior:

    List(2,4,6,8)
    List(3,6)
