---
layout: tutorial
title: Trejtovi

disqus: true

tutorial: scala-tour
num: 4
outof: 33
language: ba
---

Slično Javinim interfejsima, trejtovi se koriste za definisanje tipova objekata navođenjem potpisa podržanih metoda.
Kao u Javi 8, Scala dozvoljava trejtovima da budu parcijalno implementirani;
tj. moguće je definisati defaultne implementacije nekih metoda.
Nasuprot klasama, trejtovi ne mogu imati parametre konstruktora.
Slijedi primjer:
 
    trait Similarity {
      def isSimilar(x: Any): Boolean
      def isNotSimilar(x: Any): Boolean = !isSimilar(x)
    }
 
Ovaj trejt se sastoji od dvije metode, `isSimilar` i `isNotSimilar`. 
Dok metoda `isSimilar` nema konkretnu implementaciju (u Java terminologiji, apstraktna je), 
metoda `isNotSimilar` definiše konkretnu implementaciju. 
Klase koje integrišu ovaj trejt moraju obezbijediti samo implementaciju za `isSimilar`. 
Ponašanje metode `isNotSimilar` se direktno nasljeđuje iz trejta.
Trejtovi se obično integrišu u [klase](classes.html) (ili druge trejtove) [kompozicijom mixin klasa](mixin-class-composition.html):
 
    class Point(xc: Int, yc: Int) extends Similarity {
      var x: Int = xc
      var y: Int = yc
      def isSimilar(obj: Any) =
        obj.isInstanceOf[Point] &&
        obj.asInstanceOf[Point].x == x
    }
    object TraitsTest extends App {
      val p1 = new Point(2, 3)
      val p2 = new Point(2, 4)
      val p3 = new Point(3, 3)
      println(p1.isNotSimilar(p2))
      println(p1.isNotSimilar(p3))
      println(p1.isNotSimilar(2))
    }
 
Ovo je izlaz programa:

    false
    true
    true
