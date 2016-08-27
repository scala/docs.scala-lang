---
layout: tutorial
title: Regularni izrazi

disqus: true

tutorial: scala-tour
num: 14

outof: 33
language: ba
---

## Desno-ignorišući uzorci sekvenci ##

Desno-ignorišući uzorci su korisna opcija za dekompoziciju bilo kojeg podatka koji je ili podtip `Seq[A]` 
ili case klasa s ponavljajućim formalnim parametrima(`Node*` u primjeru), naprimjer:

    Elem(prefix: String, label: String, attrs: MetaData, scp: NamespaceBinding, children: Node*)

U takvim slučajevima, Scala dozvoljava uzorke koji imaju zvjezdicu `_*` na najdesnijoj poziciji, predstavljajući sekvencu bilo koje dužine.
Sljedeći primjer demonstrira uzorak koji se podudara s prefiksom sekvence i povezuje ostatak s varijablom `rest`.

    object RegExpTest1 extends App {
      def containsScala(x: String): Boolean = {
        val z: Seq[Char] = x
        z match {
          case Seq('s', 'c', 'a', 'l', 'a', rest @ _*) =>
            println("rest is " + rest)
            true
          case Seq(_*) =>
            false
        }
      }
    }

Za razliku od prijašnjih verzija Scale, više nije dozvoljeno imati bilo kakve regularne izraze, iz razloga navedenih ispod.

### Generalni `RegExp` uzorci privremeno povučeni iz Scale ###

Pošto smo otkrili problem tačnosti, ova opcija je privremeno povučena iz Scala jezika.
Ako korisnici budu zahtijevali, moguće je da ćemo je ponovo aktivirati u poboljšanoj formi.

Naše mišljenje je da uzorci za regularne izraze nisu bili toliko korisni za procesiranje XML-a kako smo mislili.
U stvarnim aplikacijama za procesiranje XML-a, XPath se čini kao bolja opcija.
Kada smo otkrili da naš prevod uzoraka regularnih izraza ima greške kod ezoteričnih uzoraka koji su neobični ali nezamjenjivi,
odlučili smo da je vrijeme da pojednostavimo jezik.
