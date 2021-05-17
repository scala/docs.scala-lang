---
layout: tour
title: Donja granica tipa
language: ba
partof: scala-tour

num: 21
next-page: inner-classes
previous-page: upper-type-bounds
prerequisite-knowledge: upper-type-bounds, generics, variance

---

Dok [gornja granica tipa](upper-type-bounds.html) limitira tip na podtip nekog drugog tipa,
*donja granica tipa* limitira tip da bude nadtip nekog drugog tipa.
Izraz `B >: A` izražava tipski parametar `B` ili apstraktni tip `B` koji je nadtip tipa `A`. U većini slučajeva, `A` je tipski parametar klase a `B` je tipski parametar metode.

Kroz sljedeći primjer vidjećemo zašto je ovo korisno:

```scala mdoc:fail
trait Node[+B] {
  def prepend(elem: B): Node[B]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
}
```

Ovaj program implementira jednostruko povezanu listu.
`Nil` predstavlja prazan element (tj. prazna lista). `class ListNode` je čvor koji sadrži element tipa `B` (`head`) i referencu na ostatak liste (`tail`). Klasa `Node` i njeni podtipovi su kovarijantni jer imaju `+B`.


Nažalost, ovaj program se _ne može kompajlirati_ jer je parametar `elem` u `prepend` tipa `B`, kojeg smo deklarisali *ko*varijantnim. 
Ovo ne radi jer su funkcije *kontra*varijantne u svojim tipovima parametara i *ko*varijantne u svom tipu rezultata.

Da bismo popravili ovo, moramo zamijeniti varijansu tipskog parametra `elem` u `prepend`. 
Ovo radimo uvođenjem novog tipskog parametra `U` koji ima `B` kao svoju donju granicu tipa.

```scala mdoc
trait Node[+B] {
  def prepend[U >: B](elem: U): Node[U]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
}
```

Sada možemo uraditi sljedeće:
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird


val africanSwallowList= ListNode[AfricanSwallow](AfricanSwallow(), Nil())
val birdList: Node[Bird] = africanSwallowList
birdList.prepend(EuropeanSwallow())
```
`Node[Bird]` može biti dodijeljena `africanSwallowList` ali onda prihvatiti `EuropeanSwallow`e.
