---
layout: inner-page-no-masthead
title: Gornja granica tipa

disqus: true

tutorial: scala-tour
categories: tour
num: 19
outof: 33
language: ba
---

U Scali, [tipski parametri](generic-classes.html) i [apstraktni tipovi](abstract-types.html) mogu biti ograničeni granicom tipa.
Takve granice tipa ograničavaju konkretne vrijednosti tipskih varijabli i ponekad otkrivaju još informacija o članovima takvih tipova.
  _Gornja granica tipa_ `T <: A` deklariše da se tipska varijabla `T` odnosi na podtip tipa `A`.
Slijedi primjer koji se oslanja na gornju granicu tipa za implementaciju polimorfne metode `findSimilar`:

    trait Similar {
      def isSimilar(x: Any): Boolean
    }
    case class MyInt(x: Int) extends Similar {
      def isSimilar(m: Any): Boolean =
        m.isInstanceOf[MyInt] &&
        m.asInstanceOf[MyInt].x == x
    }
    object UpperBoundTest extends App {
      def findSimilar[T <: Similar](e: T, xs: List[T]): Boolean =
        if (xs.isEmpty) false
        else if (e.isSimilar(xs.head)) true
        else findSimilar[T](e, xs.tail)
      val list: List[MyInt] = List(MyInt(1), MyInt(2), MyInt(3))
      println(findSimilar[MyInt](MyInt(4), list))
      println(findSimilar[MyInt](MyInt(2), list))
    }

Bez gornje granice ne bi bilo moguće pozvati metodu `isSimilar` iz metode `findSimilar`.
Korištenje donje granice tipa razmotreno je [ovdje](lower-type-bounds.html). 
