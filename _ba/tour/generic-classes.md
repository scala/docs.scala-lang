---
layout: tour
title: Generičke klase

discourse: false

partof: scala-tour

num: 17

language: ba

next-page: variances
previous-page: sequence-comprehensions
---

Kao u Javi 5 ([JDK 1.5](http://java.sun.com/j2se/1.5/)), Scala ima ugrađenu podršku za klase parametrizovane tipovima.
Takve klase su vrlo korisne za implementiranje kolekcija.
Ovo je primjer koji to demonstrira:

    class Stack[T] {
      var elems: List[T] = Nil
      def push(x: T) { elems = x :: elems }
      def top: T = elems.head
      def pop() { elems = elems.tail }
    }

Klasa `Stack` modeluje imperativne (promjenjive) stekove elemenata proizvoljnog tipa `T`.
Parametri tipova obezbjeđuju sigurnost da se samo legalni elementi (samo tipa `T`) guraju na stek.
Slično, s tipskim parametrima možemo izraziti da metoda `top` vraća samo elemente zadanog tipa.

Ovo su neki primjeri korištenja:

    object GenericsTest extends App {
      val stack = new Stack[Int]
      stack.push(1)
      stack.push('a')
      println(stack.top)
      stack.pop()
      println(stack.top)
    }

Izlaz ovog programa je:

    97
    1

_Napomena: nasljeđivanje generičkih tipova je *invarijantno*.
Ovo znači da ako imamo stek karaktera, koji ima tip `Stack[Char]` onda on ne može biti korišten kao stek cijelih brojeva tipa `Stack[Int]`.
Ovo bi bilo netačno (unsound) jer bi onda mogli stavljati i integere na stek karaktera.
Zaključimo, `Stack[T]` je podtip `Stack[S]` ako i samo ako je `S = T`.
Pošto ovo može biti prilično ograničavajuće, Scala ima i [anotacije tipskih parametara](variances.html) za kontrolisanje ponašanja podtipova generičkih tipova._
