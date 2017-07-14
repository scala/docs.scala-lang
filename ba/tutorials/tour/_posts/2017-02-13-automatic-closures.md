---
layout: inner-page-no-masthead
title: Automatska konstrukcija tipno zavisnih closura (zatvarajućih funkcija)

discourse: false

tutorial: scala-tour
categories: tour
num: 30
outof: 33
language: ba

next-page: case-classes
previous-page: operators
---

Scala dozvoljava da se argument (ili više njih) metode ne evaluira prije samog poziva metode.
Kada se takva metoda pozove, dati parametar se ne evaluira odmah već se na svakom mjestu u metodi gdje se poziva ubacuje 
besparametarska funkcija koja enkapsulira izračunavanje odgovarajućeg parametra (tzv. *poziv-po-imenu* (call-by-name) evaluacija).

Sljedeći kod demonstrira ovaj mehanizam:

    object TargetTest1 extends App {
	
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if(cond) {
          body
          whileLoop(cond)(body)
        }
		
      var i = 10
      whileLoop(i > 0) {
        println(i)
        i -= 1
      }
    }

Funkcija `whileLoop` prima dva parametra, `cond` i `body`. Kada se izvršava tijelo funkcije, stvarni parametri se ne evaluiraju. 
Ali svaki put kada se formalni parametri koriste u tijelu `whileLoop`, implicitno kreirana besparametarska funkcija će biti evaluirana.
Stoga, naša metoda `whileLoop` implementira Java-stu while petlju u rekurzivnom stilu.

Možemo kombinirati upotrebu [infiksnih/postfiksnih operatora](operators.html) s ovim mehanizmom da bi kreirali 
komplikovanije naredbe (s lijepom sintaksom).

Slijedi implementacija loop-unless naredbe:

    object TargetTest2 extends App {
	
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
		
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if(!cond) unless (cond)
        }
      }
	  
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }

Funkcija `loop` prima samo tijelo i vraća instancu klase `LoopUnlessCond` (koja enkapsulira objekat tijela).
Primijetite da tijelo još uvijek nije evaluirano.
Klasa `LoopUnlessCond` ima metodu `unless` koju možemo koristiti kao *infiksni operator*.
Na ovaj način postižemo prilično prirodnu sintaksu za našu novu petlju: `loop { < stats > } unless ( < cond > )`.

Ovo je rezultat izvršenja `TargetTest2`:

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1

