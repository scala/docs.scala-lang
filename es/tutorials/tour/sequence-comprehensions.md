---
layout: tutorial
title: Sequencias por Comprensión

disqus: true

tutorial: scala-tour
num: 7
language: es
---

Scala cuenta con una notación ligera para expresar *sequencias por comprensión* (*sequence comprehensions*). Las comprensiones tienen la forma `for (enumeradores) yield e`, donde `enumeradores` se refiere a una lista de enumeradores separados por el símbolo punto y coma (;). Un *enumerador* puede ser tanto un generador el cual introduce nuevas variables, o un filtro. La comprensión evalúa el cuerpo `e` por cada paso (o ciclo) generado por los enumeradores y retorna una secuencia de estos valores.

Aquí hay un ejemplo:
 
    object ComprehensionTest1 extends Application {
      def pares(desde: Int, hasta: Int): List[Int] =
        for (i <- List.range(desde, hasta) if i % 2 == 0) yield i
      Console.println(pares(0, 20))
    }

La expresión `for` en la función introduce una nueva variable `i` de tipo `Int` la cual es subsecuentemente atada a todos los valores de la lista `List(desde, desde + 1, ..., hasta - 1)`. La guarda `if i % 2 == 0` filtra los números impares por lo que el cuerpo (que solo consiste de la expresión `i`) es solamente evaluado para números pares. Consecuentemente toda la expresión `for` retorna una lista de números pares.

El programa produce los siguientes valores

    List(0, 2, 4, 6, 8, 10, 12, 14, 16, 18)

Aquí se muestra un ejemplo más complicado que computa todos los pares de números entre `0` y `n-1` cuya suma es igual a un número dado `v`: 

    object ComprehensionTest2 extends Application {
      def foo(n: Int, v: Int) =
        for (i <- 0 until n;
             j <- i + 1 until n if i + j == v) yield
          Pair(i, j);
      foo(20, 32) foreach {
        case (i, j) =>
          println("(" + i + ", " + j + ")")
      }
    }

Este ejemplo muestra que las comprensiones no están restringidas solo a listas. El programa anterior usa iteradores en su lugar. Cualquier tipo de datos que soporte las operaciones `filterWith`, `map`, y `flatMap` (con los tipos apropiados) puede ser usado en la comprensión de secuencias.

Esta es la salida del programa:

    (13, 19)
    (14, 18)
    (15, 17)

Existe también una forma especial de comprensión de secuencias la cual retorna `Unit`. En este caso las variables que son creadas por la lista de generadores y filtros son usados para realizar tareas con efectos colaterales (modificaciones de algún tipo). El programador tiene que omitir la palabra reservada `yield` para usar una comprensión de este tipo.
 
    object ComprehensionTest3 extends Application {
      for (i <- Iterator.range(0, 20);
           j <- Iterator.range(i + 1, 20) if i + j == 32)
        println("(" + i + ", " + j + ")")
    }

