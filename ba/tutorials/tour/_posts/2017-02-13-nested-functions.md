---
layout: tutorial
title: Ugniježdene funkcije

disqus: true

tutorial: scala-tour
categories: tour
num: 8
outof: 33
language: ba
---

U Scali je moguće ugnježdavati definicije funkcija.
Sljedeći objekt sadrži funkciju `filter` za dobijanje vrijednosti iz liste cijelih brojeva koji su manji od vrijednosti praga (treshold):

    object FilterTest extends App {
      def filter(xs: List[Int], threshold: Int) = {
        def process(ys: List[Int]): List[Int] =
          if (ys.isEmpty) ys
          else if (ys.head < threshold) ys.head :: process(ys.tail)
          else process(ys.tail)
        process(xs)
      }
      println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
    }

_Napomena: ugniježdena funkcija `process` koristi i varijablu `threshold` definisanu u vanjskom području (scope) kao parametar funkcije `filter`._

Izlaz ovog programa je:

    List(1,2,3,4)
