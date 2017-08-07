---
layout: tour
title: Singleton Objects

discourse: false

partof: scala-tour

num: 12
language: es

next-page: nested-functions
previous-page: mixin-class-composition
---

Métodos y valores que no están asociados con instancias individuales de una [clase](classes.html) se denominan *objetos singleton* y se denotan con la palabra reservada `object` en vez de `class`.

    package test

    object Blah {
      def sum(l: List[Int]): Int = l.sum
    }

Este método `sum` está disponible de manera global, y puede ser referenciado, o importado, como `test.Blah.sum`.

Los objetos singleton son una especie de mezcla entre la definición de una clase de utilización única, la cual no pueden ser instanciada directamente, y un miembro `val`. De hecho, de la misma menera que los `val`, los objetos singleton pueden ser definidos como miembros de un [trait](traits.html) o de una clase, aunque esto no es muy frecuente.

Un objeto singleton puede extender clases y _traits_. De hecho, una [clase Case](case-classes.html) sin [parámetros de tipo](generic-classes.html) generará por defecto un objeto singleton del mismo nombre, con una [`Función*`](http://www.scala-lang.org/api/current/scala/Function1.html) trait implementada.

## Acompañantes ##

La mayoría de los objetos singleton no están solos, sino que en realidad están asociados con clases del mismo nombre. El "objeto singleton del mismo nombre" de una case Case, mencionada anteriormente es un ejemplo de esto. Cuando esto sucede, el objeto singleton es llamado el *objeto acompañante* de la clase, y la clase es a su vez llamada la *clase acompañante* del objeto.

[Scaladoc](/style/scaladoc.html) proporciona un soporte especial para ir y venir entre una clase y su acompañante: Si el gran círculo conteniendo la “C” u la “O” tiene su borde inferior doblado hacia adentro, es posible hacer click en el círculo para ir a su acompañante.

Una clase y su objeto acompañante, si existe, deben estar definidos en el mismo archivo fuente. Como por ejemplo:

    class IntPair(val x: Int, val y: Int)

    object IntPair {
      import math.Ordering

      implicit def ipord: Ordering[IntPair] =
        Ordering.by(ip => (ip.x, ip.y))
    }

Es común ver instancias de clases tipo como [valores implícitos](implicit-parameters.html), (`ipord` en el ejemplo anterior) definida en el acompañante cuando se sigue el patron de clases tipo. Esto es debido a que los miembros del acompañante se incluyen en la búsqueda de implícitos por defecto.

## Notas para los programadores Java ##
`static` no es una palabra reservada en Scala. En cambio, todos los miembros que serían estáticos, incluso las clases, van en los objetos acompañantes. Estos, pueden ser referenciados usando la misma sintaxis, importados de manera individual o en grupo, etc.

Frecuentemente, los programadores Java, definen miembros estáticos, incluso definidos como `private`, como ayudas en la implementacion de los miembros de la instancia. Estos elementos también van en el objeto acompañante. Un patrón comúnmente utilizado es de importar los miembros del objeto acompañante en la clase, como por ejemplo:

    class X {
      import X._

      def blah = foo
    }

    object X {
      private def foo = 42
    }

Esto permite ilustrar otra característica: en el contexto de un `private`, una clase y su acompañante son amigos. El `objecto X` puede acceder miembros de la `clase X`, y vice versa. Para hacer un miembro *realmente* privado para uno u otro, utilice `private[this]`.

Para conveniencia de Java, los métodos que incluyen `var` y `val`, definidos directamente en un objeto singleton también tienen un método estático definido en la clase acompañante, llamado *static forwarder*. Otros miembros son accesibles por medio del campo estático `X$.MODULE$` para el `objeto X`.

Si todos los elementos se mueven al objeto acompanante y se descubre que lo que queda es una clase que no se quiere instanciar, entonces simplemente bórrela. Los *static forwarder* de todas formas van a ser creados.
