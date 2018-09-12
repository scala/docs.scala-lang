---
layout: tour
title: Cechy

discourse: false

partof: scala-tour

num: 4
language: pl
next-page: tuples
previous-page: classes
---

Zbliżone do interfejsów Javy cechy są wykorzystywane do definiowania typów obiektów poprzez określenie sygnatur wspieranych metod. Podobnie jak w Javie 8, Scala pozwala cechom na częściową implementację, tzn. jest możliwe podanie domyślnej implementacji dla niektórych metod. W przeciwieństwie do klas, cechy nie mogą posiadać parametrów konstruktora.

Przykład definicji cechy której zadaniem jest określanie podobieństwa z innym obiektem:

```tut
trait Similarity {
  def isSimilar(x: Any): Boolean
  def isNotSimilar(x: Any): Boolean = !isSimilar(x)
}
```
 
Powyższa cecha składa się z dwóch metod: `isSimilar` oraz `isNotSimilar`. Mimo że `isSimilar` nie posiada implementacji (odpowiada metodzie abstrakcyjnej w Javie), `isNotSimilar` definiuje konkretną implementację. W ten sposób klasy, które łączą tą cechę, muszą tylko zdefiniować implementacją dla metody `isSimilar`. Zachowanie `isNotSimilar` jest dziedziczone bezpośrednio z tej cechy. Cechy są zazwyczaj łączone z [klasami](classes.html) lub innymi cechami poprzez [kompozycję domieszek](mixin-class-composition.html):

```tut
class Point(xc: Int, yc: Int) extends Similarity {
  var x: Int = xc
  var y: Int = yc
  def isSimilar(obj: Any) =
    obj.isInstanceOf[Point] &&
    obj.asInstanceOf[Point].x == x
}

object TraitsTest extends App {
  val p1 = new Point(2, 3)
  val p2 = new Point(2, 4)
  val p3 = new Point(3, 3)
  val p4 = new Point(2, 3)
  println(p1.isSimilar(p2))
  println(p1.isSimilar(p3))
  // Metoda isNotSimilar jest zdefiniowana w Similarity
  println(p1.isNotSimilar(2))
  println(p1.isNotSimilar(p4))
}
```
 
Wynik działania programu:

```
true
false
true
false
```
