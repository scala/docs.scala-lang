---
layout: tutorial
title: Apstraktni tipovi

disqus: true

tutorial: scala-tour
num: 22
outof: 33
language: ba
---

U Scali, klase su parameterizovane vrijednostima(parameteri konstruktora) i tipovima(ako su [generičke](generic-classes.html)).
Zbog dosljednosti, ne samo da je moguće imati vrijednosti kao članove objekta već i tipove. 
Nadalje, obje forme članova mogu biti konkretne ili apstraktne.
Slijedi primjer koji sadrži obje forme: apstraktnu vrijednost i apstraktni tip kao članove [klase](traits.html) `Buffer`.
 
    trait Buffer {
      type T
      val element: T
    }
 
*Apstraktni tipovi* su tipovi čiji identitet nije precizno definisan.
U gornjem primjeru, poznato je samo da svaki objekat klase `Buffer` ima a tip-član `T`, 
ali definicija klase `Buffer` ne kazuje kojem konkretno tipu odgovara `T`. 
Kao i definicije vrijednosti, možemo prebrisati(override) definicije tipova u podklasama.
Ovo nam omogućuje da otkrijemo više informacija o apstraktnom tipu sužavanjem granica tipa(koje opisuju moguće konkretne instance apstraktnog tipa).

U sljedećem programu izvodimo klasu `SeqBuffer` koja omogućuje čuvanje samo sekvenci u baferu kazivanjem da tip `T` 
mora biti podtip `Seq[U]` za neki novi apstraktni tip `U`:
 
    abstract class SeqBuffer extends Buffer {
      type U
      type T <: Seq[U]
      def length = element.length
    }
 
Trejtovi(trait) ili [klase](classes.html) s apstraktnim tip-članovima se često koriste u kombinaciji s instanciranjem anonimnih klasa. 
Radi ilustracije, pogledaćemo program koji radi s sekvencijalnim baferom koji sadrži listu integera:
 
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
 
Povratni tip metode `newIntSeqBuf` odnosi se na specijalizaciju trejta `Buffer` u kom je tip `U` sada jednak `Int`u.
Imamo sličan alijas tip u anonimnoj instanci klase u tijelu metode `newIntSeqBuf`.
Ovdje kreiramo novu instancu `IntSeqBuffer` u kojoj se tip `T` odnosi na `List[Int]`.

Imajte na umu da je često moguće pretvoriti apstraktni tip-član u tip-parametar klase i obrnuto.
Slijedi verzija gornjeg koda koji koristi tip-parametre:
 
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
 
Primijetite da moramo koristiti [anotacije za varijancu](variances.html) ovdje;
inače ne bismo mogli sakriti konkretni tip sekvencijalne implementacije objekta vraćenog iz metode `newIntSeqBuf`.
Nadalje, postoje slučajevi u kojima nije moguće zamijeniti apstraktne tipove tip parametrima.

