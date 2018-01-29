---
layout: tour
title: Funkcje zagnieżdżone

discourse: false

partof: scala-tour

num: 8
language: pl
next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

Scala pozwala na zagnieżdżanie definicji funkcji. Poniższy obiekt określa funkcję `filter`, która dla danej listy filtruje elementy większe bądź równe podanemu progowi `threshold`:

```tut
object FilterTest extends App {
  def filter(xs: List[Int], threshold: Int) = {
    def process(ys: List[Int]): List[Int] =
      if (ys.isEmpty) ys
      else if (ys.head < threshold) ys.head :: process(ys.tail)
      else process(ys.tail)
    process(xs)
  }
  println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
}
```

_Uwaga: zagnieżdżona funkcja `process` odwołuje się do zmiennej `threshold` określonej w zewnętrznym zasięgu jako parametr `filter`_

Wynik powyższego programu:

```
List(1,2,3,4)
```
