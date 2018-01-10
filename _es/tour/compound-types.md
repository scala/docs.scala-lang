---
layout: tour
title: Tipos Compuestos

discourse: false

partof: scala-tour

num: 6
language: es

next-page: extractor-objects
previous-page: case-classes
---

Algunas veces es necesario expresar que el tipo de un objeto es un subtipo de varios otros tipos. En Scala esto puede ser expresado con la ayuda de *tipos compuestos*, los cuales pueden entenderse como la intersección de otros tipos.

Suponga que tenemos dos traits `Cloneable` y `Resetable`:

    trait Cloneable extends java.lang.Cloneable {
      override def clone(): Cloneable = {
        super.clone().asInstanceOf[Cloneable]
      }
    }
    trait Resetable {
      def reset: Unit
    }

Ahora suponga que queremos escribir una función `cloneAndReset` la cual recibe un objeto, lo clona y resetea el objeto original:

    def cloneAndReset(obj: ?): Cloneable = {
      val cloned = obj.clone()
      obj.reset
      cloned
    }

La pregunta que surge es cuál es el tipo del parámetro `obj`. Si este fuera `Cloneable` entonces el objeto puede ser clonado mediante el método `clone`, pero no puede usarse el método `reset`; Si fuera `Resetable` podríamos resetearlo mediante el método `reset`, pero no sería posible clonarlo. Para evitar casteos (refundiciones, en inglés `casting`) de tipos en situaciones como la descrita, podemos especificar que el tipo del objeto `obj` sea tanto `Clonable` como `Resetable`. En tal caso estaríamos creando un tipo compuesto; de la siguiente manera:

    def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
      //...
    }

Los tipos compuestos pueden crearse a partir de varios tipos de objeto y pueden tener un refinamiento el cual puede ser usado para acotar la signatura los miembros del objeto existente.

La forma general es: `A with B with C ... { refinamiento }`

Un ejemplo del uso de los refinamientos se muestra en la página sobre [tipos abstractos](abstract-types.html).
