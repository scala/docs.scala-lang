---
layout: tour
title: Traits

discourse: false

partof: scala-tour

num: 24
language: es

next-page: upper-type-bounds
previous-page: regular-expression-patterns
---

_Nota de traducción: La palabra `trait` en inglés puede traducirse literalmente como `rasgo` o `caracteristica`. Preferimos la designación original trait por ser una característica muy natural de Scala._

De forma similar a las interfaces de Java, los traits son usados para definir tipos de objetos al especificar el comportamiento mediante los métodos provistos. A diferencia de Java, Scala permite a los traits ser parcialmente implementados, esto es, es posible definir implementaciones por defecto para algunos métodos. En contraste con las clases, los traits no pueden tener parámetros de constructor.
A continuación se muestra un ejemplo:

    trait Similarity {
      def isSimilar(x: Any): Boolean
      def isNotSimilar(x: Any): Boolean = !isSimilar(x)
    }

Este trait consiste de dos métodos `isSimilar` y `isNotSimilar`. Mientras `isSimilar` no provee una implementación concreta del método (es abstracto en la terminología Java), el método `isNotSimilar` define una implementación concreta. Consecuentemente, las clases que integren este trait solo tienen que proveer una implementación concreta para `isSimilar`. El comportamiento de `isNotSimilar` es directamente heredado del trait. Los traits típicamente son integrados a una clase (u otros traits) mediante una [Composición de clases mixin](mixin-class-composition.html):

    class Point(xc: Int, yc: Int) extends Similarity {
      var x: Int = xc
      var y: Int = yc
      def isSimilar(obj: Any) =
        obj.isInstanceOf[Point] &&
        obj.asInstanceOf[Point].x == x
    }
    object TraitsTest extends App {
      val p1 = new Point(2, 3)
      val p2 = new Point(2, 4)
      val p3 = new Point(3, 3)
      println(p1.isNotSimilar(p2))
      println(p1.isNotSimilar(p3))
      println(p1.isNotSimilar(2))
    }

Esta es la salida del programa:

    false
    true
    true
