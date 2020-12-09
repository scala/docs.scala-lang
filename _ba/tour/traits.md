---
layout: tour
title: Trejtovi
language: ba
partof: scala-tour

num: 5
next-page: tuples
previous-page: classes
assumed-knowledge: expressions, classes, generics, objects, companion-objects

---

Trejtovi se koriste za dijeljenje interfejsa i polja među klasama.
Slični su interfejsima Jave 8.
Klase i objekti mogu naslijediti trejtove ali trejtovi ne mogu biti instancirani i zato nemaju parametara.

## Definisanje trejta
Minimalni trejt je samo ključna riječ `trait` i identifikator:

```scala mdoc
trait HairColor
```

Trejtovi su vrlo korisni s generičkim tipovima i apstraktnim metodama.
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

Nasljeđivanje `trait Iterator[A]` traži tip `A` i implementacije metoda `hasNext` i `next`.

## Korištenje trejtova
Koristite `extends` za nasljeđivanje trejta. Zatim implementirajte njegove apstraktne članove koristeći `override` ključnu riječ:
```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int =  {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // prints 0
iterator.next()  // prints 1
```
Klasa `IntIterator` uzima parametar `to` kao gornju granicu. 
Ona nasljeđuje `Iterator[Int]` što znači da `next` mora vraćati `Int`.

## Podtipovi
Podtipovi trejtova mogu se koristiti gdje se trejt traži.
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
`trait Pet` ima apstraktno polje `name` koje implementiraju `Cat` i `Dog` u svojim konstruktorima. 
Na zadnjoj liniji, zovemo `pet.name` koje mora biti implementirano u bilo kom podtipu trejta `Pet`.
