---
layout: inner-page-no-masthead
title: Sjedinjeni tipovi

disqus: true

tutorial: scala-tour
categories: tour
num: 2
outof: 33
language: ba
---

Nasuprot Javi, sve vrijednosti u Scali su objekti (uključujući brojeve i funkcije).
Pošto je Scala bazirana na klasama, sve vrijednosti su instance neke klase.
Dijagram ispod prikazuje hijerarhiju Scala klasa.

![Scala Type Hierarchy]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Hijerarhija klasa u Scali ##

Nadklasa svih klasa, `scala.Any`, ima dvije direktne podklase, `scala.AnyVal` i `scala.AnyRef`, koje predstavljaju dva različita svijeta klasa:
klase za vrijednosti i klase za reference.
Sve klase za vrijednosti su predefinisane; one odgovaraju primitivnim tipovima u jezicima kao Java.
Sve ostale klase definišu referencne tipove.
Korisnički definisane klase definišu referencne tipove po defaultu; tj. uvijek (indirektno) nasljeđuju `scala.AnyRef`.
Svaka korisnični definisana klasa u Scali implicitno nasljeđuje trejt `scala.ScalaObject`.
Klase iz infrastrukture na kojoj se izvršava Scala (tj. JRE) ne nasljeđuju `scala.ScalaObject`.
Ako se Scala koristi u kontekstu JRE, onda `scala.AnyRef` odgovara klasi `java.lang.Object`.
Primijetite da gornji dijagram također prikazuje i implicitne konverzije (isprekidana crta) između vrijednosnih (value) klasa.
Slijedi primjer koji pokazuje da su i brojevi, i karakteri, boolean vrijednosti, i funkcije samo objekti kao i svaki drugi:
 
    object UnifiedTypes extends App {
      val set = new scala.collection.mutable.LinkedHashSet[Any]
      set += "Ovo je string"     // dodaj string
      set += 732                 // dodaj number
      set += 'c'                 // dodaj character
      set += true                // dodaj boolean
      set += main _              // dodaj main funkciju
      val iter: Iterator[Any] = set.iterator
      while (iter.hasNext) {
        println(iter.next.toString())
      }
    }
 
Ovaj program deklariše aplikaciju `UnifiedTypes` kao top-level [singlton objekt](singleton-objects.html) koji nasljeđuje `App`.
Aplikacija definiše lokalnu varijablu `set` koja se odnosi na instancu klase `LinkedHashSet[Any]`.
Program dodaje različite elemente u ovaj skup.
Elementi moraju odgovarati deklarisanom tipu elementa skupa, `Any`.
Na kraju, ispisana je string reprezentacija svih elemenata.

Ovo je izlaz programa:

    Ovo je string
    732
    c
    true
    <function>
