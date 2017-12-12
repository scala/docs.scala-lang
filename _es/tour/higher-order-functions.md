---
layout: tour
title: Funciones de orden superior

discourse: false

partof: scala-tour

num: 18
language: es

next-page: pattern-matching
previous-page: operators
---

Scala permite la definición de funciones de orden superior. Estas funciones son las que _toman otras funciones como parámetros_, o las cuales _el resultado es una función_. Aquí mostramos una función `apply` la cual toma otra función `f` y un valor `v` como parámetros y aplica la función `f` a `v`:

    def apply(f: Int => String, v: Int) = f(v)

_Nota: los métodos son automáticamente tomados como funciones si el contexto lo requiere._

Otro ejemplo:

    class Decorator(left: String, right: String) {
      def layout[A](x: A) = left + x.toString() + right
    }

    object FunTest extends App {
      def apply(f: Int => String, v: Int) = f(v)
      val decorator = new Decorator("[", "]")
      println(apply(decorator.layout, 7))
    }

La ejecución da como valor el siguiente resultado:

    [7]

En este ejemplo, el método `decorator.layout` es coaccionado automáticamente a un valor del tipo `Int => String` como es requerido por el método `apply`. Por favor note que el método `decorator.layout` es un _método polimórfico_ (esto es, se abstrae de algunos de sus tipos) y el compilador de Scala primero tiene que instanciar correctamente el tipo del método.
