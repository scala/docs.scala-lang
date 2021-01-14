---
layout: tour
title: By-name parametri
language: ba
partof: scala-tour

num: 31
next-page: annotations
previous-page: operators

---

_By-name parametri_ (u slobodnom prevodu "po-imenu parametri") se izračunavaju samo kada se koriste. 
Oni su kontrastu sa _by-value parametrima_ ("po-vrijednosti parametri"). 
Da bi parametar bio pozivan by-name, dodajte `=>` prije njegovog tipa.
```scala mdoc
def calculate(input: => Int) = input * 37
```
By-name parametri imaju prednost da se ne izračunavaju ako se ne koriste u tijelu funkcije. 
U drugu ruku, by-value parametri imaju prednost da se izračunavaju samo jednom.

Ovo je primjer kako bi mogli implementirati while petlju:

```scala mdoc
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // prints 2 1
```
Metoda `whileLoop` koristi višestruke liste parametarada bi uzela uslov i tijelo petlje.
Ako je `condition` true, `body` se izvrši i zatim rekurzivno poziva `whileLoop`.
Ako je `condition` false, `body` se ne izračunava jer smo dodali `=>` prije tipa od `body`.

Kada proslijedimo `i > 0` kao naš `condition` i `println(i); i-= 1` kao `body`, 
ponaša se kao obična while petlja mnogih jezika.

Ova mogućnost da se odgodi izračunavanje parametra dok se ne koristi može poboljšati performanse ako je parametar 
skup za izračunavanje ili blok koda koji dugo traje kao npr. dobavljanje URL-a.
