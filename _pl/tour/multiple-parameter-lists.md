---
layout: tour
title: Rozwijanie funkcji (Currying)

discourse: false

partof: scala-tour

num: 9
language: pl
next-page: case-classes
previous-page: nested-functions
---

Funkcja może określić dowolną ilość list parametrów. Kiedy jest ona wywołana dla mniejszej liczby niż zostało to zdefiniowane, zwraca funkcję pobierającą dalsze listy parametrów jako jej argument.

Przykład rozwijania funkcji:

```tut
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

_Uwaga: metoda `modN` jest częściowo zastosowana dla dwóch wywołań `filter`, gdyż jest wywołana tylko dla jej pierwszego argumentu. Wyrażenie `modN(2)` zwraca funkcję typu `Int => Boolean` - stąd też może być przekazane jako drugi argument funkcji `filter`._

Wynik działania powyższego programu:

```
List(2,4,6,8)
List(3,6)
```
