---
layout: tour
title: Apstraktni tipovi
language: ba
partof: scala-tour

num: 23
next-page: compound-types
previous-page: inner-classes
prerequisite-knowledge: variance, upper-type-bound

---

Trejtovi i apstraktne klase mogu imati apstraktne tipove kao članove.
To znači da konkretne implementacije definišu stvarni tip.
Slijedi primjer:

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```

U gornjem primjeru smo definisali apstraktni tip `T`.
On se koristi za opis člana `element`.
Ovaj trejt možemo naslijediti u apstraktnoj klasi i dodati gornju granicu tipa za `T` da bi ga učinili preciznijim.

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```

Primijetite da možemo koristiti još jedan apstraktni tip, `U`, kao gornju granicu tipa. Klasa `SeqBuffer` omogućuje čuvanje samo sekvenci u baferu kazivanjem da tip `T`
mora biti podtip `Seq[U]` za neki novi apstraktni tip `U`.

Trejtovi ili [klase](classes.html) s apstraktnim tip-članovima se često koriste u kombinaciji s instanciranjem anonimnih klasa.
Radi ilustracije, pogledaćemo program koji radi s sekvencijalnim baferom koji sadrži listu integera:

```scala mdoc
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}


def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
  new IntSeqBuffer {
       type T = List[U]
       val element = List(elem1, elem2)
     }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Metoda `newIntSeqBuf` koristi anonimnu klasu kao implementaciju  `IntSeqBuf` postavljanjem tipa `T` u `List[Int]`.

Često je moguće pretvoriti apstraktni tip-član u tipski parametar klase i obrnuto.
Slijedi verzija gornjeg koda koji koristi tipske parametre:

```scala mdoc:nest
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}

def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
  new SeqBuffer[Int, List[Int]] {
    val element = List(e1, e2)
  }

val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Primijetite da moramo koristiti [anotacije za varijansu](variances.html) ovdje (`+T <: Seq[U]`) da sakrijemo konkretni tip sekvencijalne implementacije objekta vraćenog iz metode `newIntSeqBuf`.
Nadalje, postoje slučajevi u kojima nije moguće zamijeniti apstraktne tipove tip parametrima.
