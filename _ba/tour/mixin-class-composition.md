---
layout: tour
title: Kompozicija mixin klasa

discourse: false

partof: scala-tour

num: 5

language: ba

next-page: anonymous-function-syntax
previous-page: traits
---

Nasuprot jezicima koji podržavaju samo _jednostruko nasljeđivanje_, Scala ima generalniji pojam ponovne upotrebe klasa.
Scala omogućuje ponovno korištenje _novih definicija članova klase_ (tj. razlika u odnosu na nadklasu) u definiciji nove klase.
Ovo se izražava  _kompozicijom mixin-klasa_.
Razmotrimo apstrakciju za iteratore.
 
    abstract class AbsIterator {
      type T
      def hasNext: Boolean
      def next(): T
    }
 
Dalje, razmotrimo mixin klasu koja nasljeđuje `AbsIterator` s metodom `foreach` koja primjenjuje datu funkciju na svaki element iteratora.
Da bi definisali klasu koja može biti korištena kao mixin koristimo ključnu riječ `trait` (en. osobina, svojstvo).
 
    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next()) }
    }
 
Ovo je konkretna klasa iteratora, koja vraća sukcesivne karaktere datog stringa:
 
    class StringIterator(s: String) extends AbsIterator {
      type T = Char
      private var i = 0
      def hasNext = i < s.length()
      def next() = { val ch = s charAt i; i += 1; ch }
    }
 
Željeli bismo iskombinirati funkcionalnosti `StringIterator`-a i `RichIterator`-a u jednoj klasi.  
S jednostrukim nasljeđivanjem i interfejsima ovo je nemoguće, jer obje klase sadrže implementacije članova.
Scala nam pomaže s _kompozicijom mixin-klasa_.
Ona dozvoljava programerima da ponovo iskoriste razliku definicija klasa, tj., sve nove definicije koje nisu naslijeđene.
Ovaj mehanizam omogućuje kombiniranje `StringIterator`-a s `RichIterator`-om, kao u sljedećem test programu koji ispisuje kolonu svih karaktera datog stringa.
 
    object StringIteratorTest {
      def main(args: Array[String]) {
        class Iter extends StringIterator(args(0)) with RichIterator
        val iter = new Iter
        iter foreach println
      }
    }
 
Klasa `Iter` u funkciji `main` je konstruisana mixin kompozicijom roditelja `StringIterator` i `RichIterator` ključnom riječju `with`.
Prvi roditelj se zove _nadklasa_ `Iter`-a, a drugi (i svaki sljedeći, ako postoji) roditelj se zove _mixin_.
