---
layout: tour
title: Hierarchia typów

discourse: false

partof: scala-tour

num: 2
language: pl
next-page: classes
previous-page: tour-of-scala
---

W przeciwieństwie do Javy wszystkie wartości w Scali są obiektami (wliczając w to wartości numeryczne i funkcje). Ponieważ Scala bazuje na klasach, wszystkie wartości są instancjami klasy. Można zatem powiedzieć, że Scala posiada zunifikowany system typów. Poniższy diagram ilustruje hierarchię klas Scali:

![Scala Type Hierarchy]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Hierarchia Klas Scali ##

Klasa bazowa dla wszystkich klas `scala.Any` posiada dwie bezpośrednie klasy pochodne: `scala.AnyVal` oraz `scala.AnyRef`, które reprezentują dwie różne rodziny klas: klasy wartości oraz klasy referencji. Klasy wartości są predefiniowane i odpowiadają one typom prymitywnym z języków takich jak Java. Wszystkie inne klasy definiują typy referencyjne. Klasy zdefiniowane przez użytkownika są domyślnie typami referencyjnymi, tzn. są one zawsze podtypem klasy `scala.AnyRef`. W kontekście maszyny wirtualnej Javy `scala.AnyRef` odpowiada typowi `java.lang.Object`. Powyższy diagram ilustruje także konwersje implicit pomiędzy klasami wartości.

Poniższy przykład pokazuje, że liczby, znaki, wartości logiczne oraz funkcje są obiektami:


```tut
object UnifiedTypes extends App {
  val fun: Int => Int = _ + 1     // deklaracja funkcji
  val set = new scala.collection.mutable.LinkedHashSet[Any]
  set += "To jest łańcuch znaków" // dodaj łańcuch znaków
  set += 732                      // dodaj liczbę
  set += 'c'                      // dodaj znak
  set += true                     // dodaj wartość logiczną
  set += fun _                    // dodaj funkcję
  set foreach println
}
```

Program deklaruje aplikację `UnifiedTypes` w postaci [obiektu singleton](singleton-objects.html) rozszerzającego klasę `App`. Aplikacja definiuje zmienną lokalną `set` odwołującą się do instancji klasy `LinkedHashSet[Any]`, która reprezentuje zbiór obiektów dowolnego typu (`Any`). Ostatecznie program wypisuje wszystkie elementy tego zbioru.

Wynik działania programu:

```
To jest łańcuch znaków
732
c
true
<function>
```
