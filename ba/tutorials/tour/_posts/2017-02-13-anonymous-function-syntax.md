---
layout: tutorial
title: Sintaksa anonimnih funkcija

disqus: true

tutorial: scala-tour
categories: tour
num: 6
outof: 33
language: ba
---

Scala omogućuje relativno lahku sintaksu za definisanje anonimnih funkcija. Sljedeći izraz kreira funkciju za sljedbenike cijelih brojeva:

    (x: Int) => x + 1

Ovo je kratica za definiciju sljedeće anonimne klase:

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

Također je moguće definisati funkciju s više parametara:

    (x: Int, y: Int) => "(" + x + ", " + y + ")"

ili bez parametara:

    () => { System.getProperty("user.dir") }

Također postoji vrlo lahka sintaksa za pisanje tipa funkcije. Ovo su tipovi tri gore navedene funkcije:

    Int => Int
    (Int, Int) => String
    () => String

Ova sintaksa je kratica za sljedeće tipove:

    Function1[Int, Int]
    Function2[Int, Int, String]
    Function0[String]
