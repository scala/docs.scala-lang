---
layout: tour
title: Obiekty ekstraktorów
partof: scala-tour

num: 17
language: pl
next-page: for-comprehensions
previous-page: regular-expression-patterns
---

W Scali wzorce mogą być zdefiniowane niezależnie od klas przypadków. Obiekt posiadający metodę `unapply` może funkcjonować jako tak zwany ekstraktor. Jest to szczególna metoda, która pozwala na odwrócenie zastosowania obiektu dla pewnych danych. Jego celem jest ekstrakcja danych, z których został on utworzony. Dla przykładu, poniższy kod definiuje ekstraktor dla [obiektu](singleton-objects.html) `Twice`:

```scala mdoc
object Twice {
  def apply(x: Int): Int = x * 2
  def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
}

object TwiceTest extends App {
  val x = Twice(21)
  x match { case Twice(n) => Console.println(n) }
}
```

Mamy tutaj do czynienia z dwiema konwencjami syntaktycznymi:

Wyrażenie `case Twice(n)` prowadzi do wywołania `Twice.unapply`, który dopasowuje liczby parzyste. Wartość zwrócona przez metodę `unapply` określa czy argument został dopasowany lub nie, oraz wartość `n` wykorzystaną dalej w dopasowaniu danego przypadku. Tutaj jest to wartość `z/2`.

Metoda `apply` nie jest konieczna do dopasowania wzorców. Jest jedynie wykorzystywana do udawania konstruktora. `Twice(21)` jest równoważne `Twice.apply(21)`.

Typ zwracany przez `unapply` powinien odpowiadać jednemu przypadkowi:

* Jeżeli jest to tylko test, należy zwrócić Boolean. Na przykład: `case even()`
* Jeżeli zwraca pojedynczą wartość typu T, powinien zwrócić `Option[T]`
* Jeżeli zwraca kilka wartości typów: `T1, ..., Tn`, należy je pogrupować jako opcjonalna krotka `Option[(T1, ..., Tn)]`

Zdarza się, że chcielibyśmy dopasować określoną liczbę wartości oraz sekwencję. Z tego powodu możesz także zdefiniować wzorce poprzez metodę `unapplySeq`. Ostatnia wartość typu `Tn` powinna być `Seq[S]`. Ten mechanizm pozwala na dopasowanie wzorców takich jak `case List(x1, ..., xn)`.

Ekstraktory sprawiają, że kod jest łatwiejszy do utrzymania. Aby dowiedzieć się więcej, możesz przeczytać publikację ["Matching Objects with Patterns"](https://infoscience.epfl.ch/record/98468/files/MatchingObjectsWithPatterns-TR.pdf) (zobacz sekcję 4) autorstwa Emir, Odersky i Williams (styczeń 2007).
