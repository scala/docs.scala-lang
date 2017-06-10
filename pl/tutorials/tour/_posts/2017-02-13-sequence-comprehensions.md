---
layout: tutorial
title: Instrukcje for (For comprehension)

discourse: true

tutorial: scala-tour
categories: tour
num: 16
language: pl
next-page: generic-classes
previous-page: extractor-objects
---

Scala posiada lekką składnię do wyrażania instrukcji for. Tego typu wyrażania przybierają formę `for (enumerators) yield e`, gdzie `enumerators` oznacza listę enumeratorów oddzielonych średnikami. *Enumerator* może być generatorem wprowadzającym nowe zmienne albo filtrem. Wyrażenie `e` określa wynik dla każdego powiązania wygenerowanego przez enumeratory i zwraca sekwencję tych wartości.

Przykład:
 
```tut
object ComprehensionTest1 extends App {
  def even(from: Int, to: Int): List[Int] =
    for (i <- List.range(from, to) if i % 2 == 0) yield i
  Console.println(even(0, 20))
}
```
 
To wyrażenie for w funkcji `even` wprowadza nową zmienną `i` typu `Int`, która jest kolejno wiązana ze wszystkimi wartościami listy `List(from, from + 1, ..., to - 1)`. Instrukcja `if i % 2 == 0` filtruje wszystkie liczby nieparzyste, tak aby ciało tego wyrażenia było obliczane tylko dla liczb parzystych. Ostatecznie całe to wyrażenie zwraca listę liczb parzystych.

Program zwraca następujący wynik:

```
List(0, 2, 4, 6, 8, 10, 12, 14, 16, 18)
```

Poniżej bardziej skomplikowany przykład, który oblicza wszystkie pary liczb od `0` do `n-1`, których suma jest równa danej wartości `v`:
 
```tut
object ComprehensionTest2 extends App {
  def foo(n: Int, v: Int) =
    for (i <- 0 until n;
         j <- i until n if i + j == v) yield
      (i, j);
  foo(20, 32) foreach {
    case (i, j) =>
      println(s"($i, $j)")
  }
}
```
 
Ten przykład pokazuje, że wyrażenia for nie są ograniczone do list. Każdy typ danych, który wspiera operacje: `withFilter`, `map` oraz `flatMap` (z odpowiednimi typami), może być użyty w instrukcjach for.

Wynik powyższego programu:

```
(13, 19)
(14, 18)
(15, 17)
(16, 16)
```

Istnieje szczególna postać instrukcji for, które zwracają `Unit`. Tutaj wiązania utworzone przez listę generatorów i filtrów są użyte do wykonania efektów ubocznych. Aby to osiągnąć, należy pominąć słowo kluczowe `yield`:
 
```
object ComprehensionTest3 extends App {
  for (i <- Iterator.range(0, 20);
       j <- Iterator.range(i, 20) if i + j == 32)
    println(s"($i, $j)")
}
```
