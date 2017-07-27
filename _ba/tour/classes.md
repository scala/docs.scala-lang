---
layout: tour
title: Klase

discourse: false

partof: scala-tour

num: 3

language: ba

next-page: traits
previous-page: unified-types
---

Klase u Scali su statički šabloni koji mogu biti instancirani u više objekata tokom izvršavanja programa (runtime).
Slijedi definicija klase `Point`:

    class Point(xc: Int, yc: Int) {

      var x: Int = xc
      var y: Int = yc

      def move(dx: Int, dy: Int) {
        x = x + dx
        y = y + dy
      }

      override def toString(): String = "(" + x + ", " + y + ")";
    }

Ova klasa definiše dvije varijable: `x` i `y`, i dvije metode: `move` i `toString`.
Metoda `move` prima dva cjelobrojna argumenta ali ne vraća vrijednost (implicitni povratni tip je `Unit`,
koji odgovoara `void`-u u jezicima sličnim Javi). `toString`, za razliku, ne prima nikakve parametre ali vraća `String` vrijednost.
Pošto `toString` prebrisava predefinisanu `toString` metodu, mora biti tagovana s `override`.

Klase u Scali se parametrizuju parametrima konstruktora. Kod iznad definiše dva parametra konstruktora, `xc` i `yc`;
oba su vidljiva u cijelom tijelu klase. U našem primjeru korišteni su za inicijalizaciju varijabli `x` i `y`.

Klase se inicijalizaciju pomoću `new` primitive, kao u sljedećem primjeru:

    object Classes {
      def main(args: Array[String]) {
        val pt = new Point(1, 2)
        println(pt)
        pt.move(10, 10)
        println(pt)
      }
    }

Program definiše izvršnu aplikaciju `Classes` u form vrhovnog singlton objekta s `main` metodom.
Metoda `main` kreira novu instancu klase `Point` i sprema je u vrijednost `pt`.
_Imajte u vidu da se vrijednosti definisane primitivom `val` razlikuju
od varijabli definisanih primitivom `var` (vidi klasu `Point` iznad)
u tome da ne dozvoljavaju promjenu vrijednosti; tj. vrijednost je konstanta._

Ovo je rezultat programa:

    (1, 2)
    (11, 12)
