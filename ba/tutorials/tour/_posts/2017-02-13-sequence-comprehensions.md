---
layout: tutorial
title: Komprehensije sekvenci

discourse: true

tutorial: scala-tour
categories: tour
num: 16
outof: 33
language: ba
---

Scala ima skraćenu notaciju za pisanje *komprehensija sekvenci*.
Komprehensije imaju oblik  
`for (enumeratori) yield e`, gdje su `enumeratori` lista enumeratora razdvojenih tačka-zarezima.
*Enumerator* je ili generator koji uvodi nove varijable, ili je filter.
Komprehensija evaluira tijelo `e` za svako vezivanje varijable generisano od strane enumeratora i vraća sekvencu ovih vrijednosti.

Slijedi primjer:
 
    object ComprehensionTest1 extends App {
      def even(from: Int, to: Int): List[Int] =
        for (i <- List.range(from, to) if i % 2 == 0) yield i
      Console.println(even(0, 20))
    }
 
For-izraz u funkciji uvodi novu varijablu `i` tipa `Int` koja se u svakoj iteraciji vezuje za vrijednost iz liste `List(from, from + 1, ..., to - 1)`.
Čuvar (guard) `if i % 2 == 0` izbacuje sve neparne brojeve tako da se tijelo (koje se sastoji samo od izraza `i`) evaluira samo za parne brojeve. 
Stoga, cijeli for-izraz vraća listu parnih brojeva.

Program ispisuje sljedeće:

    List(0, 2, 4, 6, 8, 10, 12, 14, 16, 18)

Slijedi komplikovaniji primjer koji izračunava sve parove brojeva između `0` i `n-1` čija je suma jednaka zadanoj vrijednosti `v`:
 
    object ComprehensionTest2 extends App {
      def foo(n: Int, v: Int) =
        for (i <- 0 until n;
             j <- i until n if i + j == v) yield
          Pair(i, j);
      foo(20, 32) foreach {
        case (i, j) =>
          println("(" + i + ", " + j + ")")
      }
    }
 
Ovaj primjer pokazuje da komprehensije nisu ograničene samo na liste.
Prethodni program koristi iteratore (a ne liste).
Svaki tip podatka koji podržava operacije `withFilter`, `map`, i `flatMap` (s odgovarajućim tipovima) može biti korišten u komprehensijama.

Ovo je izlaz programa:

    (13, 19)
    (14, 18)
    (15, 17)
    (16, 16)

Također postoji poseban oblik za komprehensije sekvenci koje vraćaju `Unit`.
Ovdje se vrijednosti koje se uzimaju iz liste generatora i filtera koriste za popratne pojave (side-effects).
Programer mora izostaviti ključnu riječ `yield` da bi koristio takve komprehensije.
Slijedi program koji je ekvivalentan prethodnom ali koristi specijalnu for komprehensiju koja vraća `Unit`:
 
    object ComprehensionTest3 extends App {
      for (i <- Iterator.range(0, 20);
           j <- Iterator.range(i, 20) if i + j == 32)
        println("(" + i + ", " + j + ")")
    }

