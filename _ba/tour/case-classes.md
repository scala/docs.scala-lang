---
layout: tour
title: Case klase

discourse: false

partof: scala-tour

num: 30

language: ba

next-page: annotations
previous-page: automatic-closures
---

Scala podržava tzv. _case klase_.
Case klase su obične klase koje eksponiraju svoje parametre konstruktora i 
omogućuju rekurzivnu dekompoziciju pomoću [podudaranja uzorka (pattern matching)](pattern-matching.html).

Slijedi primjer hijerarhije klasa koja se sastoji od apstraktne nadklase `Term` i tri konkretne case klase `Var`, `Fun`, i `App`.

    abstract class Term
    case class Var(name: String) extends Term
    case class Fun(arg: String, body: Term) extends Term
    case class App(f: Term, v: Term) extends Term

Ova hijerarhija klasa može biti korištena da predstavi pojmove iz [bestipskog lambda računa](https://en.wikipedia.org/wiki/Lambda_calculus). 
Da bi se olakšala konstrukcija instanci case klasa, Scala ne zahtijeva `new` primitivu. Može se jednostavno koristiti ime klase kao funkcija.

Primjer:

    Fun("x", Fun("y", App(Var("x"), Var("y"))))

Parametri konstruktora case klasa tretiraju se kao javne (public) vrijednosti i može im se pristupiti direktno.

    val x = Var("x")
    println(x.name)

Za svaku case klasu Scala kompajler izgeneriše `equals` metodu koja implementira strukturalnu jednakost i `toString` metodu. Naprimjer:

    val x1 = Var("x")
    val x2 = Var("x")
    val y1 = Var("y")
    println("" + x1 + " == " + x2 + " => " + (x1 == x2))
    println("" + x1 + " == " + y1 + " => " + (x1 == y1))

će prikazati

    Var(x) == Var(x) => true
    Var(x) == Var(y) => false

Ima smisla definisati case klasu samo ako će biti korištena sa podudaranjem uzorka za dekompoziciju.
Sljedeći [objekt](singleton-objects.html) definiše funkciju za lijepo ispisivanje naše reprezentacije lambda računa:

    object TermTest extends scala.App {
	
      def printTerm(term: Term) {
        term match {
          case Var(n) =>
            print(n)
          case Fun(x, b) =>
            print("^" + x + ".")
            printTerm(b)
          case App(f, v) =>
            print("(")
            printTerm(f)
            print(" ")
            printTerm(v)
            print(")")
        }
      }
	  
      def isIdentityFun(term: Term): Boolean = term match {
        case Fun(x, Var(y)) if x == y => true
        case _ => false
      }
	  
      val id = Fun("x", Var("x"))
      val t = Fun("x", Fun("y", App(Var("x"), Var("y"))))
	  
      printTerm(t)
      println
      println(isIdentityFun(id))
      println(isIdentityFun(t))
    }

U našem primjeru, funkcija `printTerm` je izražena kao naredba podudaranja uzorka s `match` ključnom riječi
i sastoji se od niza `case Pattern => Body` klauza.
Gornji program također definiše funkciju `isIdentityFun` koja provjerava da li dati pojam odgovara jednostavnoj funkciji identiteta.
Ovaj primjer koristi duboke uzorke i čuvare (guard).
Nakon što se uzorak podudari s datom vrijednošću, čuvar (definisan nakon ključne riječi `if`) se evaluira.
Ako vrati `true`, podudaranje uspijeva; u suprotnom, ne uspijeva i sljedeći uzorak će biti pokušan.
