---
layout: tour
title: Límite de tipado inferior

discourse: false

partof: scala-tour

num: 26
language: es

next-page: self-types
previous-page: upper-type-bounds
---

Mientras que los [límites de tipado superior](upper-type-bounds.html) limitan el tipo de un subtipo de otro tipo, los *límites de tipado inferior* declaran que un tipo sea un supertipo de otro tipo. El término `T >: A` expresa que el parámetro de tipo `T` o el tipo abstracto `T` se refiera a un supertipo del tipo `A`

Aquí se muestra un ejemplo donde esto es de utilidad:

    case class ListNode[T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend(elem: T): ListNode[T] =
        ListNode(elem, this)
    }

El programa mostrado implementa una lista enlazada con una operación `prepend` (agregar al principio). Desafortunadamente este tipo es invariante en el parámetro de tipo de la clase `ListNode`; esto es, el tipo `ListNode[String]` no es un subtipo de `ListNode[Object]`. Con la ayuda de [anotaciones de varianza](variances.html) es posible expresar tal semantica de subtipos:

    case class ListNode[+T](h: T, t: ListNode[T]) { ... } // No compila

Desafortunadamente, este programa no compila porque una anotación covariante es solo posible si el tipo de la variable es usado solo en posiciones covariantes. Ya que la variable de tipo `T` aparece como un parámetro de tipo en el método `prepend`, esta regla se rompe. Con la ayuda de un *límite de tipado inferior*, sin embargo, podemos implementar un método `prepend` donde `T` solo aparezca en posiciones covariantes.

Este es el código correspondiente:

    case class ListNode[+T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend[U >: T](elem: U): ListNode[U] =
        ListNode(elem, this)
    }

_Nota: el nuevo método `prepend` tiene un tipo un poco menos restrictivo. Esto permite, por ejemplo, agregar un objeto de un supertipo a una lista ya creada. La lista resultante será una lista de este supertipo._

Este código ilustra el concepto:

    object LowerBoundTest extends App {
      val empty: ListNode[Null] = ListNode(null, null)
      val strList: ListNode[String] = empty.prepend("hello")
                                           .prepend("world")
      val anyList: ListNode[Any] = strList.prepend(12345)
    }
