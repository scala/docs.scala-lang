---
layout: tour
title: Kompozycja domieszek

discourse: false

partof: scala-tour

num: 5
language: pl
next-page: higher-order-functions
previous-page: tuples
---

W przeciwieństwie do języków, które wspierają jedynie pojedyncze dziedziczenie, Scala posiada bardziej uogólniony mechanizm ponownego wykorzystania klas. Scala umożliwia wykorzystanie _nowych elementów klasy_ (różnicy w stosunku do klasy bazowej) w definicji nowej klasy. Wyraża się to przy pomocy _kompozycji domieszek_.

Rozważmy poniższe uogólnienie dla iteratorów:

```tut
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

Następnie rozważmy klasę domieszkową, która doda do klasy `AbsIterator` metodę `foreach` wykonującą podaną funkcję dla każdego elementu zwracanego przez iterator. Aby zdefiniować klasę domieszkową, użyjemy słowa kluczowego `trait`:

```tut
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit) { while (hasNext) f(next()) }
}
```

Oto przykład konkretnego iteratora, który zwraca kolejne znaki w podanym łańcuchu znaków:

```tut
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length()
  def next() = { val ch = s charAt i; i += 1; ch }
}
```

Chcielibyśmy także połączyć funkcjonalność `StringIterator` oraz `RichIterator` w jednej klasie. Z pojedynczym dziedziczeniem czy też samymi interfejsami jest to niemożliwe, gdyż obie klasy zawierają implementacje metod. Scala pozwala na rozwiązanie tego problemu z użyciem _kompozycji domieszek_. Umożliwia ona ponowne wykorzystanie różnicy definicji klas, tzn. wszystkich definicji, które nie zostały odziedziczone. Ten mechanizm pozwala nam na połączenie `StringIterator` z `RichIterator`, tak jak w poniższym przykładzie - gdzie chcielibyśmy wypisać w kolumnie wszystkie znaki z danego łańcucha:

```tut
object StringIteratorTest {
  def main(args: Array[String]) {
    class Iter extends StringIterator("Scala") with RichIterator
    val iter = new Iter
    iter foreach println
  }
}
```

Klasa `iter` w funkcji `main` jest skonstruowana wykorzystując kompozycję domieszek `StringIterator` oraz `RichIterator` z użyciem słowa kluczowego `with`. Pierwszy rodzic jest nazywany _klasą bazową_ `Iter`, podczas gdy drugi (i każdy kolejny) rodzic jest nazywany _domieszką_.
