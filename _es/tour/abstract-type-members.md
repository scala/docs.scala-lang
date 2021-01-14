---
layout: tour
title: Tipos Abstractos
partof: scala-tour

num: 2

language: es

next-page: annotations
previous-page: tour-of-scala
---

En Scala, las cases son parametrizadas con valores (los parámetros de construcción) y con tipos (si las clases son [genéricas](generic-classes.html)). Por razones de consistencia, no es posible tener solo valores como miembros de objetos; tanto los tipos como los valores son miembros de objetos. Además, ambos tipos de miembros pueden ser concretos y abstractos.
A continuación un ejemplo el cual define de forma conjunta una asignación de valor tardía y un tipo abstracto como miembros del [trait](traits.html) `Buffer`.

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```

Los *tipos abstractos* son tipos los cuales su identidad no es precisamente conocida. En el ejemplo anterior, lo único que sabemos es que cada objeto de la clase `Buffer` tiene un miembro de tipo `T`, pero la definición de la clase `Buffer` no revela qué tipo concreto se corresponde con el tipo `T`. Tal como las definiciones de valores, es posible sobrescribir las definiciones de tipos en subclases. Esto permite revelar más información acerca de un tipo abstracto al acotar el tipo ligado (el cual describe las posibles instancias concretas del tipo abstracto).

En el siguiente programa derivamos la clase `SeqBuffer` la cual nos permite almacenar solamente sequencias en el buffer al estipular que el tipo `T` tiene que ser un subtipo de `Seq[U]` para un nuevo tipo abstracto `U`:

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```

Traits o [clases](classes.html) con miembros de tipos abstractos son generalmente usados en combinación con instancias de clases anónimas. Para ilustrar este concepto veremos un programa el cual trata con un buffer de sequencia que se remite a una lista de enteros.

```scala mdoc
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}

object AbstractTypeTest1 extends App {
  def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
    new IntSeqBuffer {
         type T = List[U]
         val element = List(elem1, elem2)
       }
  val buf = newIntSeqBuf(7, 8)
  println("length = " + buf.length)
  println("content = " + buf.element)
}
```

El tipo retornado por el método `newIntSeqBuf` está ligado a la especialización del trait `Buffer` en el cual el tipo `U` es ahora equivalente a `Int`. Existe un tipo alias similar en la instancia de la clase anónima dentro del cuerpo del método `newIntSeqBuf`. En ese lugar se crea una nueva instancia de `IntSeqBuffer` en la cual el tipo `T` está ligado a `List[Int]`.

Es necesario notar que generalmente es posible transformar un tipo abstracto en un tipo paramétrico de una clase y viceversa. A continuación se muestra una versión del código anterior el cual solo usa tipos paramétricos.

```scala mdoc:reset
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}
def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
  new SeqBuffer[Int, List[Int]] {
    val element = List(e1, e2)
  }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Nótese que es necesario usar [variance annotations](variances.html) aquí; de otra manera no sería posible ocultar el tipo implementado por la secuencia concreta del objeto retornado por `newIntSeqBuf`. Además, existen casos en los cuales no es posible remplazar tipos abstractos con tipos parametrizados.
