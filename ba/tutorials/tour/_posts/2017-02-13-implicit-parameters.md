---
layout: tutorial
title: Implicitni parametri

discourse: true

tutorial: scala-tour
categories: tour
num: 25
outof: 33
language: ba
---

Metoda s _implicitnim parametrima_ može biti primijenjena na argumente kao i normalna metoda.
U ovom slučaju, implicitna labela nema nikakav efekt.
Međutim, ako takvoj metodi nedostaju argumenti za implicitne parametre, ti argumenti će biti proslijeđeni automatski.

Argumenti koji se mogu proslijediti kao implicitni parametri spadaju u dvije kategorije:

* Prva, kvalifikovani su svi identifikatori x koji su dostupni pri pozivu metode bez prefiksa i predstavljaju implicitnu definiciju ili implicitni parameter.
* Druga, kvalifikovani su također svi članovi prijateljskih objekata (modula) tipova implicitnih parametara.

U sljedećem primjeru definisaćemo metodu `sum` koja izračunava sumu liste elemenata koristeći `add` i `unit` operacije monoida.
Molimo primijetite da implicitne vrijednosti ne mogu biti top-level, već moraju biti članovi templejta.
 
    abstract class SemiGroup[A] {
      def add(x: A, y: A): A
    }
    abstract class Monoid[A] extends SemiGroup[A] {
      def unit: A
    }
    object ImplicitTest extends App {
      implicit object StringMonoid extends Monoid[String] {
        def add(x: String, y: String): String = x concat y
        def unit: String = ""
      }
      implicit object IntMonoid extends Monoid[Int] {
        def add(x: Int, y: Int): Int = x + y
        def unit: Int = 0
      }
      def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
        if (xs.isEmpty) m.unit
        else m.add(xs.head, sum(xs.tail))

      println(sum(List(1, 2, 3)))
      println(sum(List("a", "b", "c")))
    }

Ovo je izlaz navedenog Scala programa:

    6
    abc
