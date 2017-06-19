---
layout: tutorial
title: Varijanse

discourse: false

tutorial: scala-tour
categories: tour
num: 18
outof: 33
language: ba

next-page: upper-type-bounds
previous-page: generic-classes
---

Scala podržava anotacije varijanse tipskih parametara [generičkih klasa](generic-classes.html).
Nasuprot Javi 5 ([JDK 1.5](http://java.sun.com/j2se/1.5/)), anotacije varijanse se dodaju pri definiciji same klase,
dok u Javi 5, anotacije varijanse se dodaju na korisničkoj strani, tj. kada se klasa koristi.

Na stranici o [generičkim klasama](generic-classes.html) dat je primjer promjenjivog steka.
Objasnili smo da je tip definisan klasom `Stack[T]` subjekt invarijantnog nasljeđivanja u odnosu na tipski parametar. 
Ovo može ograničiti ponovnu upotrebu apstrakcije klase.
Sada ćemo izvesti funkcionalnu (tj. nepromjenjivu) implementaciju steka koja nema ovo ograničenje.
Molimo primijetite da je ovo komplikovaniji primjer koji kombinuje upotrebu [polimorfnih metoda](polymorphic-methods.html), 
[donjih granica tipa](lower-type-bounds.html), i kovarijantnu anotaciju tipskog parametra na netrivijalan način. 
Nadalje, koristimo [unutarnje klase](inner-classes.html) da povežemo elemente steka bez eksplicitnih veza.

```tut
class Stack[+T] {
  def push[S >: T](elem: S): Stack[S] = new Stack[S] {
    override def top: S = elem
    override def pop: Stack[S] = Stack.this
    override def toString: String =
      elem.toString + " " + Stack.this.toString
  }
  def top: T = sys.error("no element on stack")
  def pop: Stack[T] = sys.error("no element on stack")
  override def toString: String = ""
}

object VariancesTest extends App {
  var s: Stack[Any] = new Stack().push("hello")
  s = s.push(new Object())
  s = s.push(7)
  println(s)
}
```

Anotacija `+T` deklariše tip `T` da bude korišten samo na kovarijantnim pozicijama.
Slično, `-T` bi deklarisalo `T` da bude korišten samo na kontravarijantnim pozicijama.
Za kovarijantne tipske parametre dobijamo kovarijantnu podtip relaciju u odnosu na ovaj parametar. 
Za naš primjer to znači da je `Stack[T]` podtip od `Stack[S]` ako je `T` podtip `S`. 
Suprotno važi za tipske parametre koji su obilježeni s `-`.

Za primjer sa stekom morali bi koristiti kovarijantni tipski parametar `T` na kontravarijantnoj poziciji pri definiciji metode `push`.
Pošto želimo kovarijantno nasljeđivanje za stekove, koristimo trik kojim apstrahujemo nad tipskim parametrom metode `push`. 
Dobijamo polimorfnu metodu u kojoj koristimo element tip `T` kao donju granicu tipske varijable metode `push`. 
Ovo ima efekt sinhronizovanja varijanse `T` s njegovom deklaracijom kao kovarijantni tipski parametar.
Sada su stekovi kovarijantni, ali naše rješenje dozvoljava npr. da dodamo string na stek integera.
Rezultat će biti stek tipa `Stack[Any]`; 
tako da samo ako je rezultat korišten u kontekstu gdje se zahtijeva stek integera, možemo otkriti grešku.
U suprotnom dobijamo stek s generalnijim tipom elemenata.
