---
layout: tour
title: Kompozicija mixin klasa
language: ba

discourse: true

partof: scala-tour

num: 6
next-page: higher-order-functions
previous-page: traits
prerequisite-knowledge: inheritance, traits, abstract-classes, unified-types

---

Mixini su trejtovi koji se koriste za kompoziciju klase.

```tut
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
d.message  // I'm an instance of class B
d.loudMessage  // I'M AN INSTANCE OF CLASS B
```
Klasa `D` je nadklasa od `B` i mixina `C`. 
Klase mogu imati samo jednu nadklasu alid mogu imati više mixina (koristeći ključne riječi `extends` i `with` respektivno). Mixini i nadklasa mogu imati isti nadtip.

Pogledajmo sada zanimljiviji primjer počevši od apstraktne klase:
 
```tut
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```
 
Klasa ima apstraktni tip `T` i standardne metode iteratora.
Dalje, implementiraćemo konkretnu klasu (svi apstraktni članovi `T`, `hasNext`, i `next` imaju implementacije):

```tut
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

`StringIterator` prima `String` i može se koristiti za iteraciju nad `String`om (npr. da vidimo da li sadrži određeni karakter).
 
    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next()) }
    }

Kreirajmo sada trejt koji također nasljeđuje `AbsIterator`.

```tut
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```

Pošto je `RichIterator` trejt, on ne mora implementirati apstraktne članove `AbsIterator`a.

Željeli bismo iskombinirati funkcionalnosti `StringIterator`a i `RichIterator`a u jednoj klasi.  

```tut
object StringIteratorTest extends App {
  class Iter extends StringIterator("Scala") with RichIterator
  val iter = new Iter
  iter foreach println
}
```
 
Nova klasa `Iter` ima `StringIterator` kao nadklasu i `RichIterator` kao mixin.

S jednostrukim nasljeđivanjem ne bismo mogli postići ovaj nivo fleksibilnosti.
