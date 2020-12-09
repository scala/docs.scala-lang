---
layout: tour
title: Dolne ograniczenia typów
partof: scala-tour

num: 22
language: pl
next-page: inner-classes
previous-page: upper-type-bounds
---

Podczas gdy [górne ograniczenia typów](upper-type-bounds.html) zawężają typ do podtypu innego typu, *dolne ograniczenia typów* określają dany typ jako typ bazowy innego typu. Sformułowanie `T >: A` wyraża, że parametr typu `T` lub typ abstrakcyjny `T` odwołuje się do typu bazowego `A`.

Oto przykład, w którym jest to użyteczne:

```scala mdoc
case class ListNode[T](h: T, t: ListNode[T]) {
  def head: T = h
  def tail: ListNode[T] = t
  def prepend(elem: T): ListNode[T] =
    ListNode(elem, this)
}
```

Powyższy program implementuje listę jednokierunkową z operacją dodania elementu na jej początek. Niestety typ ten jest niezmienny według parametru typu klasy `ListNode`, tzn. `ListNode[String]` nie jest podtypem `ListNode[Any]`. Z pomocą [adnotacji wariancji](variances.html) możemy wyrazić semantykę podtypowania:

```scala
case class ListNode[+T](h: T, t: ListNode[T]) { ... }
```

Niestety ten program się nie skompiluje, ponieważ adnotacja kowariancji może być zastosowana tylko, jeżeli zmienna typu jest używana wyłącznie w pozycji kowariantnej. Jako że zmienna typu `T` występuje jako parametr typu metody `prepend`, ta zasada jest złamana. Z pomocą *dolnego ograniczenia typu* możemy jednak zaimplementować tą metodę w taki sposób, że `T` występuje tylko w pozycji kowariantnej:

```scala mdoc:nest
case class ListNode[+T](h: T, t: ListNode[T]) {
  def head: T = h
  def tail: ListNode[T] = t
  def prepend[U >: T](elem: U): ListNode[U] =
    ListNode(elem, this)
}
```

_Uwaga:_ nowa wersja metody `prepend` ma mniej ograniczający typ. Przykładowo pozwala ona na dodanie obiektu typu bazowego elementów istniejącej listy. Wynikowa lista będzie listą tego typu bazowego.

Przykład, który to ilustruje:

```scala mdoc:fail
object LowerBoundTest extends App {
  val empty: ListNode[Null] = ListNode(null, null)
  val strList: ListNode[String] = empty.prepend("hello")
                                       .prepend("world")
  val anyList: ListNode[Any] = strList.prepend(12345)
}
```

