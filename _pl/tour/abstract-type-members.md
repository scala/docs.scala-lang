---
layout: tour
title: Typy abstrakcyjne
partof: scala-tour

num: 24
language: pl
next-page: compound-types
previous-page: inner-classes
---

W Scali klasy są parametryzowane wartościami (parametry konstruktora) oraz typami (jeżeli klasa jest [generyczna](generic-classes.html)). Aby zachować regularność, zarówno typy jak i wartości są elementami klasy. Analogicznie mogą one być konkretne albo abstrakcyjne.

Poniższy przykład definiuje wartość określaną przez abstrakcyjny typ będący elementem [cechy](traits.html) `Buffer`:

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```

*Typy abstrakcyjne* są typami, które nie są jednoznacznie określone. W powyższym przykładzie wiemy tylko, że każdy obiekt klasy `Buffer` posiada typ `T`, ale definicja klasy `Buffer` nie zdradza jakiemu konkretnie typowi on odpowiada. Tak jak definicje wartości, możemy także nadpisać definicje typów w klasach pochodnych. Pozwala to nam na odkrywanie dodatkowych informacji o abstrakcyjnym typie poprzez zawężanie jego ograniczeń (które opisują możliwe warianty konkretnego typu).

W poniższym programie definiujemy klasę `SeqBuffer`, która ogranicza możliwe typy `T` do pochodnych sekwencji `Seq[U]` dla nowego typu `U`:

```scala mdoc:nest
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```

Cechy oraz [klasy](classes.html) z abstrakcyjnymi typami są często używane w połączeniu z anonimowymi klasami. Aby to zilustrować, wykorzystamy program, w którym utworzymy bufor sekwencji ograniczony do listy liczb całkowitych:

```scala mdoc:nest
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}

object AbstractTypeTest1 extends App {
  def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
    new IntSeqBuffer {
         type T = List[U]
         val element = List(elem1, elem2)
       }
  val buf = newIntSeqBuf(7, 8)
  println("length = " + buf.length)
  println("content = " + buf.element)
}
```

Typ zwracany przez metodę `newIntSeqBuf` nawiązuje do specjalizacji cechy `Buffer`, w której typ `U` jest równy `Int`. Podobnie w anonimowej klasie tworzonej w metodzie `newIntSeqBuf` określamy `T` jako `List[Int]`.

Warto zwrócić uwagę, że często jest możliwa zamiana abstrakcyjnych typów w parametry typów klas i odwrotnie. Poniższy przykład stosuje wyłącznie parametry typów:

```scala mdoc:nest
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}
object AbstractTypeTest2 extends App {
  def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
    new SeqBuffer[Int, List[Int]] {
      val element = List(e1, e2)
    }
  val buf = newIntSeqBuf(7, 8)
  println("length = " + buf.length)
  println("content = " + buf.element)
}
```

Należy też pamiętać o zastosowaniu [adnotacji wariancji](variances.html). Inaczej nie byłoby możliwe ukrycie konkretnego typu sekwencji obiektu zwracanego przez metodę `newIntSeqBuf`.
