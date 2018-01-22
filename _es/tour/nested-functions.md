---
layout: tour
title: Funciones Anidadas

discourse: false

partof: scala-tour

num: 13
language: es

next-page: multiple-parameter-lists
previous-page: singleton-objects
---

En scala es posible anidar definiciones de funciones. El siguiente objeto provee una función `filter` para extraer valores de una lista de enteros que están por debajo de un valor determinado:

    object FilterTest extends App {
      def filter(xs: List[Int], threshold: Int) = {
        def process(ys: List[Int]): List[Int] =
          if (ys.isEmpty) ys
          else if (ys.head < threshold) ys.head :: process(ys.tail)
          else process(ys.tail)
        process(xs)
      }
      println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
    }

_Nota: la función anidada `process` utiliza la variable `threshold` definida en el ámbito externo como un parámetro de `filter`._

La salida del programa es:

    List(1,2,3,4)
