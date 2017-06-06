---
layout: tutorial
title: Polymorphe Methoden

discourse: true

tutorial: scala-tour
categories: tour
num: 21
language: de
---

Methoden in Scala können sowohl in deren Parametern als auch in deren Typen parametrisiert werden.
Wie bei Klassen werden die Parameter von runden Klammern umschlossen, während Typ-Parameter in
eckigen Klammern deklariert werden. Das folgende Beispiel demonstriert dies:

    object PolyTest extends App {
      def dup[T](x: T, n: Int): List[T] =
        if (n == 0)
          Nil
        else
          x :: dup(x, n - 1)

      println(dup[Int](3, 4))
      println(dup("three", 3))
    }

Die Methode `dup` des Objektes `PolyTest` ist im Typ `T` sowie den Parametern `x: T` und `n: Int`
parametrisiert. Wenn die Methode `dup` aufgerufen wird, können Typ-Parameter einerseits explizit
angegeben werden, wie in Zeile 8, andererseits kann man sie auslassen, wie in Zeile 9, und von
Scalas Typ-System inferieren lassen. Diese inferierten Typen stammen von den Typen der übergebenen
Argumente, in obigem Beispiel der Wert `"three"` vom Typ `String`.

Zu bemerken ist, dass der Trait `App` dafür entwickelt worden ist, kurze Testprogramme zu schreiben,
jedoch für wirklich produktiv gehenden Quellcode der Scala Versionen 2.8.x und früher vermieden
werden sollte. An dessen Stelle sollte die Methode `main` verwendet werden.

