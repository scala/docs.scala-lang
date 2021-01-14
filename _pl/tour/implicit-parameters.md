---
layout: tour
title: Parametry domniemane
partof: scala-tour

num: 27
language: pl
next-page: implicit-conversions
previous-page: self-types
---

Metodę z _parametrami domniemanymi_ można stosować tak samo jak każdą zwyczajną metodę. W takim przypadku etykieta `implicit` nie ma żadnego znaczenia. Jednak jeżeli odpowiednie argumenty dla parametrów domniemanych nie zostaną jawnie określone, to kompilator dostarczy je automatycznie.

Argumenty, które mogą być przekazywane jako parametry domniemane, można podzielić na dwie kategorie:

* Najpierw dobierane są takie identyfikatory, które są dostępne bezpośrednio w punkcie wywołania metody i które określają definicję lub parametr domniemany.
* W drugiej kolejności dobrane mogą być elementy modułów towarzyszących odpowiadających typom tych parametrów domniemanych, które są oznaczone jako `implicit`.

W poniższym przykładzie zdefiniujemy metodę `sum`, która oblicza sumę listy elementów wykorzystując operacje `add` i `unit` obiektu `Monoid`. Należy dodać, że wartości domniemane nie mogą być zdefiniowane globalnie, tylko muszą być elementem pewnego modułu.
 
```scala mdoc
/** Ten przykład wykorzystuje strukturę z algebry abstrakcyjnej aby zilustrować działanie parametrów domniemanych. Półgrupa jest strukturą algebraiczną na zbiorze A z łączną operacją (czyli taką, która spełnia warunek: add(x, add(y, z)) == add(add(x, y), z)) nazwaną add, która łączy parę obiektów A by zwrócić inny obiekt A. */
abstract class SemiGroup[A] {
  def add(x: A, y: A): A
}
/** Monoid jest półgrupą z elementem neutralnym typu A, zwanym unit. Jest to element, który połączony z innym elementem (przez metodę add) zwróci ten sam element. */
abstract class Monoid[A] extends SemiGroup[A] {
  def unit: A
}
object ImplicitTest extends App {
  /** Aby zademonstrować jak działają parametry domniemane, najpierw zdefiniujemy monoidy dla łańcuchów znaków oraz liczb całkowitych. Słowo kluczowe implicit sprawia, że oznaczone nimi wartości mogą być użyte aby zrealizować parametry domniemane. */
  implicit object StringMonoid extends Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  implicit object IntMonoid extends Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  /** Metoda sum pobiera List[A] i zwraca A, który jest wynikiem zastosowania monoidu do wszystkich kolejnych elementów listy. Oznaczając parametr m jako domniemany, sprawiamy że potrzebne jest tylko podanie parametru xs podczas wywołania, ponieważ mamy już List[A], zatem wiemy jakiego typu jest w rzeczywistości A, zatem wiemy też jakiego typu Monoid[A] potrzebujemy. Możemy więc wyszukać wartość val lub obiekt w aktualnym zasięgu, który ma odpowiadający typu i użyć go bez jawnego określania referencji do niego. */
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))

  /** Wywołamy tutaj dwa razy sum podając za każdym razem tylko listę. Ponieważ drugi parametr (m) jest domniemany, jego wartość jest wyszukiwana przez kompilator w aktualnym zasięgu na podstawie typu monoidu wymaganego w każdym przypadku, co oznacza że oba wyrażenia mogą być w pełni ewaluowane. */
  println(sum(List(1, 2, 3)))          // używa IntMonoid
  println(sum(List("a", "b", "c")))    // używa StringMonoid
}
```

Wynik powyższego programu:

```
6
abc
```
