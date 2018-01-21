---
layout: tour
title: Construcción de closures automáticas

discourse: false

partof: scala-tour

num: 16
language: es

next-page: operators
previous-page: multiple-parameter-lists
---

Scala permite pasar funciones sin parámetros como parámetros de un método. Cuando un método así es invocado, los parámetros reales de la función enviada sin parámetros no son evaluados y una función "nularia" (de aridad cero, 0-aria, o sin parámetros) es pasada en su lugar. Esta función encapsula el comportamiento del parámetro correspondiente (comunmente conocido como "llamada por nombre").

Para aclarar un poco esto aquí se muestra un ejemplo:

    object TargetTest1 extends App {
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if (cond) {
          body
          whileLoop(cond)(body)
        }
      var i = 10
      whileLoop (i > 0) {
        println(i)
        i -= 1
      }
    }

La función `whileLoop` recibe dos parámetros `cond` y `body`. Cuando la función es llamada, los parámetros reales no son evaluados en ese momento. Pero cuando los parámetros son utilizados en el cuerpo de la función `whileLoop`, las funciones nularias creadas implícitamente serán evaluadas en su lugar. Así, nuestro método `whileLoop` implementa un bucle tipo Java mediante una implementación recursiva.

Es posible combinar el uso de [operadores de infijo y postfijo (infix/postfix)](operators.html) con este mecanismo para crear declaraciones más complejas (con una sintaxis agradadable).

Aquí mostramos la implementación de una declaración tipo repetir-a-menos-que (repetir el bucle a no ser que se cumpla X condición):

    object TargetTest2 extends App {
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if (!cond) unless(cond)
        }
      }
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }

La función `loop` solo acepta el cuerpo de un bucle y retorna una instancia de la clase `LoopUnlessCond` (la cual encapsula el cuerpo del objeto). Es importante notar que en este punto el cuerpo del bucle no ha sido evaluado aún. La clase `LoopUnlessCond` tiene un método `unless` el cual puede ser usado como un *operador de infijo (infix)*. De esta manera podemos lograr una sintaxis muy natural para nuestro nuevo bucle `repetir { <estas declaraciones> a_menos_que ( <condición>)`.

A continuación se expone el resultado de la ejecución de `TargetTest2`:

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1
