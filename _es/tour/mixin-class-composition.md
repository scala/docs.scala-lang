---
layout: tour
title: Composición de clases mixin

discourse: false

partof: scala-tour

num: 12
language: es

next-page: singleton-objects
previous-page: tuples
---
_Nota de traducción: La palabra `mixin` puede ser traducida como mezcla, dando título a esta sección de: Composición de clases Mezcla, pero es preferible utilizar la notación original_

A diferencia de lenguajes que solo soportan _herencia simple_, Scala tiene una notación más general de la reutilización de clases. Scala hace posible reutilizar la _nueva definición de miembros de una clase_ (es decir, el delta en relación a la superclase) en la definición de una nueva clase. Esto es expresado como una _composición de clases mixin_. Considere la siguiente abstracción para iteradores.

    abstract class AbsIterator {
      type T
      def hasNext: Boolean
      def next(): T
    }

A continuación, considere una clase mezcla la cual extiende `AbsIterator` con un método `foreach` el cual aplica una función dada a cada elemento retornado por el iterador. Para definir una clase que puede usarse como una clase mezcla usamos la palabra clave `trait`.

    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next()) }
    }

Aquí se muestra una clase iterador concreta, la cual retorna caracteres sucesivos de una cadena de caracteres dada:

    class StringIterator(s: String) extends AbsIterator {
      type T = Char
      private var i = 0
      def hasNext = i < s.length()
      def next() = { val ch = s charAt i; i += 1; ch }
    }

Nos gustaría combinar la funcionalidad de `StringIterator` y `RichIterator` en una sola clase. Solo con herencia simple e interfaces esto es imposible, ya que ambas clases contienen implementaciones para sus miembros. Scala nos ayuda con sus _compisiciones de clases mezcladas_. Permite a los programadores reutilizar el delta de la definición de una clase, esto es, todas las nuevas definiciones que no son heredadas. Este mecanismo hace posible combinar `StringIterator` con `RichIterator`, como es hecho en el siguiente programa, el cual imprime una columna de todos los caracteres de una cadena de caracteres dada.

    object StringIteratorTest {
      def main(args: Array[String]) {
        class Iter extends StringIterator("Scala") with RichIterator
        val iter = new Iter
        iter foreach println
      }
    }

La clase `Iter` en la función `main` es construida de una composición mixin de los padres `StringIterator` y `RichIterator` con la palabra clave `with`. El primera padre es llamado la _superclase_ de `Iter`, mientras el segundo padre (y cualquier otro que exista) es llamada un _mixin_.
