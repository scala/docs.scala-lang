---
layout: tour
title: Abstract Type Members
partof: scala-tour
num: 25
language: fr
next-page: compound-types
previous-page: inner-classes
topics: abstract type members
prerequisite-knowledge: variance, upper-type-bound
---

Les types abstraits, tels que les traits et les classes abstraites, peuvent avoir des membres type abstrait.
Cela signifie que les implémentations concrètes définissent les types réels.
Voici un exemple :

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```

Ici, nous avons défini un `type T` abstrait. Il est utilisé pour décrire le type de `element`. Nous pouvons étendre ce trait dans une classe abstraite, en ajoutant une borne de type supérieure à `T` pour le rendre plus spécifique.

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```

Remarquez comment nous pouvons utiliser un autre type abstrait `U` dans la spécification d'une borne supérieure pour `T`. Cette `class SeqBuffer` nous permet de stocker uniquement des séquences dans le tampon en indiquant que le type `T` doit être un sous-type de `Seq[U]` pour un nouveau type abstrait `U`.

Les traits ou [classes](classes.html) avec des membres type abstrait sont souvent utilisés en combinaison avec des instanciations de classes anonymes. Pour illustrer cela, regardons maintenant un programme qui traite un "sequence buffer" qui fait référence à une liste d'entiers :

```scala mdoc
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}


def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
  new IntSeqBuffer {
	type T = List[U]
	val element = List(elem1, elem2)
  }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Ici, la factory `newIntSeqBuf` utilise une implémentation de classe anonyme de `IntSeqBuffer` (c'est-à-dire `new IntSeqBuffer`) pour définir le type abstrait `T` comme étant le type concret `List[Int]`.

Il est également possible de transformer des membres type abstrait en paramètres de type de classes et *vice versa*. Voici une version du code ci-dessous qui n'utilise que des paramètres de type :

```scala mdoc:nest
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

Notez que nous devons utiliser ici [les annotaions de variance](variances.html) (`+T <: Seq[U]`) afin de masquer le type concret d'implémentation de séquence dans l'objet renvoyé par la méthode `newIntSeqBuf`. De plus, il existe des cas où il n'est pas possible de remplacer les membres de type abstrait par des paramètres de type.
