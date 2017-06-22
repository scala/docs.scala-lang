---
layout: inner-page-no-masthead
title: Podudaranje uzoraka (pattern matching)

discourse: false

tutorial: scala-tour
categories: tour
num: 11

outof: 33
language: ba

next-page: singleton-objects
previous-page: currying
---

Scala ima ugrađen mehanizam generalnog podudaranja uzoraka.
On omogućuje da se podudaraju uzorci bilo koje vrste podataka politikom "prvo podudaranje".
Slijedi mali primjer koji pokazuje kako podudarati vrijednost cijelog broja:

    object MatchTest1 extends App {
      def matchTest(x: Int): String = x match {
        case 1 => "one"
        case 2 => "two"
        case _ => "many"
      }
      println(matchTest(3))
    }

Blok s `case` izrazima definiše funkciju koja mapira cijele brojeve u stringove.
Ključna riječ `match` omogućuje pogodan način za primjenu funkcije (kao pattern matching funkcija iznad) na objekt.

Ovo je drugi primjer koja podudara vrijednost s uzorcima različitih tipova:

    object MatchTest2 extends App {
      def matchTest(x: Any): Any = x match {
        case 1 => "one"
        case "two" => 2
        case y: Int => "scala.Int"
      }
      println(matchTest("two"))
    }

Prvi `case` se podudara ako je `x` cijeli broj `1`.
Drugi `case` se podudara ako je `x` jednak stringu `"two"`.
Treći slučaj se sastoji od tipskog uzorka; podudara se sa bilo kojim integerom i povezuje vrijednost selektora `x` s varijablom `y` tipa integer.

Scalin mehanizam podudaranja uzoraka je najkorisniji za algebarske tipove koji su izraženi kroz [case klase](case-classes.html).
Scala također dozvoljava definisanje uzoraka nezavisno od case klasa, koristeći `unapply` metode u [ekstraktor objektima](extractor-objects.html).
