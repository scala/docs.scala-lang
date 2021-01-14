---
layout: tour
title: Kompozycja klas przez domieszki
partof: scala-tour

num: 9
language: pl
next-page: higher-order-functions
previous-page: tuples
---

Domieszka (ang. mixin) to cecha (trait), która używana jest do komponowania klas.

{% scalafiddle %}
```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "Jestem instancją klasy B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // wyświetli "Jestem instancją klasy B"
println(d.loudMessage)  // wyświetli "JESTEM INSTANCJĄ KLASY B"
```
{% endscalafiddle %}

Klasa `D` posiada nadklasę `B` oraz domieszkę `C`.
Klasy mogą mieć tylko jedną nadklasę, ale wiele domieszek (używając kolejno słów kluczowych `extends`, a następnie `with`).
Domieszki i nadklasy mogą posiadać tą samą nadklasę (typ bazowy).

Spójrzmy teraz na trochę ciekawszy przykład zawierający klasę abstrakcyjną.

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

Klasa ta zawiera abstrakcyjny typ `type T` oraz standardowe metody iteracyjne `hasNext` i `next`.

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```

Klasa `StringIterator` przyjmuje parametr typu `String`, może być ona użyta do iterowania po typach String (np. aby sprawdzić czy String zawiera daną literę).

Stwórzmy teraz cechę, która również rozszerza `AbsIterator`.

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```

Cecha `RichIterator` implementuje metodę `foreach`, która z kolei wywołuje przekazaną przez parametr funkcję `f: T => Unit` na kolejnym elemencie (`f(next())`) tak długo, jak dostępne są kolejne elementy (`while (hasNext)`).
Ponieważ `RichIterator` jest cechą, nie musi implementować abstrakcyjnych składników klasy `AbsIterator`.

Spróbujmy teraz połączyć funkcjonalności `StringIterator` oraz `RichIterator` w jednej klasie.

```scala mdoc
object StringIteratorTest extends App {
  class RichStringIter extends StringIterator("Scala") with RichIterator
  val richStringIter = new RichStringIter
  richStringIter foreach println
}
```

Nowo powstała `RichStringIter` posiada `StringIterator` jako nadklasę oraz `RichIterator` jako domieszkę.

Mając do dyspozycji jedynie pojedyncze dziedziczenie, nie byli byśmy w stanie osiągnąć takiego stopnia elastyczności.
