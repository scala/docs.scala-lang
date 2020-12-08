---
layout: tour
title: Curry-jevanje
language: ba
partof: scala-tour

num: 10
next-page: case-classes
previous-page: nested-functions

---

Metode mogu definisati više listi parametara. 
Kada je metoda pozvana s manje listi parametara nego što ima,
onda će to vratiti funkciju koja prima preostale liste parametara kao argumente.

Primjer:

```scala mdoc
object CurryTest extends App {

  def filter(xs: List[Int], p: Int => Boolean): List[Int] =
    if (xs.isEmpty) xs
    else if (p(xs.head)) xs.head :: filter(xs.tail, p)
    else filter(xs.tail, p)

  def modN(n: Int)(x: Int) = ((x % n) == 0)

  val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
  println(filter(nums, modN(2)))
  println(filter(nums, modN(3)))
}
```

_Napomena: metoda `modN` je parcijalno primijenjena u dva poziva `filter`; tj. samo prvi argument je ustvari primijenjen. 
Izraz `modN(2)` vraća funkciju tipa `Int => Boolean` i zato je mogući kandidat za drugi argument funkcije `filter`._

Rezultat gornjeg programa:

```
List(2,4,6,8)
List(3,6)
```

