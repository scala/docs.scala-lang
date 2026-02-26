---
layout: tour
title: Class Composition with Mixins
partof: scala-tour

num: 9

language: fr

next-page: higher-order-functions
previous-page: tuples
---

Les mixins sont des traits qui sont utilisés pour composer une classe.

```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "I'm an instance of class B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```

La classe `D` a une super-classe `B` et un mixin `C`. Les classes peuvent avoir une seule super-classe mais plusieurs mixins (en utilisant les mots clefs `extends` et `with` respectivement). Les mixins et la super-classe peuvent avoir le même super-type.

Maintenant, regardons un exemple plus intéressant, en commençant par une classe abstraite :

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

La classe a un type abstrait `T` et les méthodes d'itération standards.

Puis, nous allons implémenter une classe concrète (tous les membres `T`, `hasNext`, et `next` sont implémentés):

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```

`StringIterator` prend une `String` et peut être utilisé pour itérer sur la string (càd pour voir si une String contient un certain caractère).

Maintenant créons un trait qui étend également `AbsIterator`.

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```

Ce trait implémente `foreach` en appelant continuellement la fonction fournie `f: T => Unit` sur l'élément suivant (`next()`) tant qu'il y a des éléments (`while (hasNext)`). Parce que `RichIterator` est un trait, il n'y a pas besoin d'implémenter les membres abstraits de AbsIterator.

Enfin, pour combiner les fonctionnalités de `StringIterator` et `RichIterator` dans une seule classe.

```scala mdoc
class RichStringIter extends StringIterator("Scala") with RichIterator
val richStringIter = new RichStringIter
richStringIter.foreach(println)
```

La nouvelle classe `RicheStringIter` a `StringIterator` pour super-classe et `RichIterator` comme mixin.

Simplement avec l'héritage ne ne serions pas capable d'atteindre ce niveau de flexibilité.

Traduit par Antoine Pointeau.