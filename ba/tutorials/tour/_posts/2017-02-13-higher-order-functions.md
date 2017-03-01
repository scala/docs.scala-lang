---
layout: tutorial
title: Funkcije višeg reda

disqus: true

tutorial: scala-tour
categories: tour
num: 7
outof: 33
language: ba
---

Scala dozvoljava definisanje funkcija višeg reda.
To su funkcije koje _primaju druge funkcije kao parametre_, ili čiji je _rezultat funkcija_.
Ovo je funkcija `apply` koja uzima drugu funkciju `f` i vrijednost `v` i primjenjuje funkciju `f` na `v`:

    def apply(f: Int => String, v: Int) = f(v)

_Napomena: metode se automatski pretvoraju u funkcije ako kontekst zahtijeva korištenje this._

Ovo je još jedan primjer:
 
    class Decorator(left: String, right: String) {
      def layout[A](x: A) = left + x.toString() + right
    }
    
    object FunTest extends App {
      def apply(f: Int => String, v: Int) = f(v)
      val decorator = new Decorator("[", "]")
      println(apply(decorator.layout, 7))
    }
 
Izvršenjem se dobije izlaz:

    [7]

U ovom primjeru, metoda `decorator.layout` je automatski pretvorena u vrijednost tipa `Int => String` koju zahtijeva metoda `apply`.
Primijetite da je metoda `decorator.layout` _polimorfna metoda_ (tj. apstrahuje neke tipove u svom potpisu)
i Scala kompajler mora prvo instancirati tipove metode.
