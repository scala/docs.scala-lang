---
layout: tour
title: Parámetros implícitos

discourse: false

partof: scala-tour

num: 10
language: es

next-page: inner-classes
previous-page: generic-classes
---

Un método con _parámetros implícitos_ puede ser aplicado a argumentos tal como un método normal. En este caso la etiqueta `implicit` no tiene efecto. De todas maneras, si a un método le faltan argumentos para sus parámetros implícitos, tales argumentos serán automáticamente provistos.

Los argumentos reales que son elegibles para ser pasados a un parámetro implícito están contenidos en dos categorías:
* Primera, son elegibles todos los identificadores x que puedan ser accedidos en el momento de la llamada al método sin ningún prefijo y que denotan una definición implícita o un parámetro implícito.
* Segunda, además son elegibles todos los miembros de modulos `companion` (ver [objetos companion] (singleton-objects.html) ) del tipo de parámetro implicito que tienen la etiqueta `implicit`.

En el siguiente ejemplo definimos un método `sum` el cual computa la suma de una lista de elementos usando las operaciones `add` y `unit` de `Monoid`. Note que los valores implícitos no pueden ser de nivel superior (top-level), deben ser miembros de una plantilla.

    abstract class SemiGroup[A] {
      def add(x: A, y: A): A
    }
    abstract class Monoid[A] extends SemiGroup[A] {
      def unit: A
    }
    object ImplicitTest extends App {
      implicit object StringMonoid extends Monoid[String] {
        def add(x: String, y: String): String = x concat y
        def unit: String = ""
      }
      implicit object IntMonoid extends Monoid[Int] {
        def add(x: Int, y: Int): Int = x + y
        def unit: Int = 0
      }
      def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
        if (xs.isEmpty) m.unit
        else m.add(xs.head, sum(xs.tail))

      println(sum(List(1, 2, 3)))
      println(sum(List("a", "b", "c")))
    }

Esta es la salida del programa:

    6
    abc
