---
layout: tour
title: Ekstraktor objekti

discourse: false

partof: scala-tour

num: 15

language: ba

next-page: sequence-comprehensions
previous-page: regular-expression-patterns
---

U Scali, uzorci (patterns) mogu biti definisani nezavisno od case klasa.
Za ovo se koristi metoda `unapply` koja vraća tzv. ekstraktor.
Ekstraktor se može smatrati kao specijalna metoda koja ima obrnuti efekt od primjene (apply) nekog objekta na neke ulazne parametre.
Svrha mu je da 'ekstraktuje' ulazne parametre koji su bili prisutni prije 'apply' operacije.
Naprimjer, sljedeći kod definiše ekstraktor [objekt](singleton-objects.html) Twice.

    object Twice {
      def apply(x: Int): Int = x * 2
      def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
    }
    
    object TwiceTest extends App {
      val x = Twice(21)
      x match { case Twice(n) => Console.println(n) } // prints 21
    }

Navedene su dvije sintaksne konvencije:

Uzorak `case Twice(n)` će pozvati `Twice.unapply`, koja se koristi da ekstraktuje bilo koji paran broj;
povratna vrijednost od `unapply` signalizira da li se argument podudario s uzorkom ili ne,
i bilo koje pod-vrijednosti mogu biti korištene za daljnje uzorkovanje (matching).
Ovdje je pod-vrijednost `z/2`.

Metoda `apply` nije obavezna za uzorkovanje. Ona se jedino koristi da imitira konstructor.  
`val x = Twice(21)` se proširuje na `val x = Twice.apply(21)`.

Povratni tip od `unapply` se bira na sljedeći način:

* Ako je samo test, vraća `Boolean`. Naprimjer `case even()`
* Ako vraća jednu pod-vrijednost tipa, vraća `Option[T]`
* Ako vraća više pod-vrijednosti `T1,...,Tn`, groupiše ih u opcionu torku `Option[(T1,...,Tn)]`.

Ponekad, broj pod-vrijednosti nije fiksan i želimo da vratimo listu.
Iz ovog razloga, također možete definisati uzorke pomoću `unapplySeq`.
Zadnja pod-vrijednost tipa `Tn` mora biti `Seq[S]`.
Ovaj mehanizam se koristi naprimjer za uzorak `case List(x1, ..., xn)`.

Ekstraktori čine kod lakšim za održavanje.
Za više detalja, pročitajte dokument 
["Matching Objects with Patterns"](https://infoscience.epfl.ch/record/98468/files/MatchingObjectsWithPatterns-TR.pdf) 
(u sekciji 4) od Emir, Odersky i Williams (Januar 2007).
