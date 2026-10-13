---
layout: tour
title: Traits
partof: scala-tour

num: 7

language: fr

next-page: tuples
previous-page: named-arguments
---

Les traits sont utilisés pour partager des interfaces et des champs entre les classes. Ils sont similaires aux interfaces de Java 8. Les classes et les objets peuvent étendre les traits, mais les traits ne peuvent pas être instanciés et donc n'ont pas de paramètres.

## Définition d'un trait

Un trait minimum est simplement le mot clef `trait` et un identifiant :

```scala mdoc
trait HairColor
```

Les traits deviennent spécialement utiles avec des types génériques et des méthodes abstraites. 

```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

Étendre le `trait Iterator[A]` requiert un type `A` et l'implémentation des méthodes `hasNext` et `next`.

## Utiliser les traits

Utilisez le mot clef `extends` pour étendre un trait. Puis implémentez tous les membres abstraits du trait en utilisant le mot clef `override` :

```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int = {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
```

Cette classe `IntIterator` prend un paramètre `to` comme limite maximum. Elle (étend) `extends Iterator[Int]` ce qui veut dire que la méthode `next` doit retourner un Int.

## Sous-typage

Là où un trait est requis, un sous-type du trait peut être utilisé à la place.

```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // Prints Harry Sally
```

Le `trait Pet` a un champs abstrait `name` qui est implémenté par Cat et Dog dans leur constructeur. Sur la dernière ligne, nous appelons `pet.name`, qui doit être implémenté par tous les sous-types du trait `Pet`.

## Plus d'informations

* Apprennez-en plus sur les traits dans [Scala Book](/overviews/scala-book/traits-intro.html)
* Utiliser les traits pour définir un [Enum](/overviews/scala-book/enumerations-pizza-class.html)

Traduction par Antoine Pointeau.