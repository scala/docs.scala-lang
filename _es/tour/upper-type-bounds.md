---
layout: tour
title: Límite de tipado superior

discourse: false

partof: scala-tour

num: 25
language: es

next-page: lower-type-bounds
previous-page: traits
---

En Scala, los [parámetros de tipo](generic-classes.html) y los [tipos abstractos](abstract-types.html) pueden ser restringidos por un límite de tipado. Tales límites de tipado limitan los valores concretos de las variables de tipo y posiblemente revelan más información acerca de los miembros de tales tipos. Un _límite de tipado superior_ `T <: A` declara que la variable de tipo `T` es un subtipo del tipo `A`.
Aquí se muestra un ejemplo el cual se basa en un límite de tipado superior para la implementación del método polimórfico `findSimilar`:

    trait Similar {
      def isSimilar(x: Any): Boolean
    }
    case class MyInt(x: Int) extends Similar {
      def isSimilar(m: Any): Boolean =
        m.isInstanceOf[MyInt] &&
        m.asInstanceOf[MyInt].x == x
    }
    object UpperBoundTest extends App {
      def findSimilar[T <: Similar](e: T, xs: List[T]): Boolean =
        if (xs.isEmpty) false
        else if (e.isSimilar(xs.head)) true
        else findSimilar[T](e, xs.tail)
      val list: List[MyInt] = List(MyInt(1), MyInt(2), MyInt(3))
      println(findSimilar[MyInt](MyInt(4), list))
      println(findSimilar[MyInt](MyInt(2), list))
    }

Sin la anotación del límite de tipado superior no sería posible llamar al método `isSimilar` en el método `findSimilar`. El uso de los límites de tipado inferiores se discute [aquí](lower-type-bounds.html).
