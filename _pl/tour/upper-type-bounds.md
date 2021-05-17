---
layout: tour
title: Górne ograniczenia typów
partof: scala-tour

num: 21
language: pl
next-page: lower-type-bounds
previous-page: variances
---

W Scali [parametry typów](generic-classes.html) oraz [typy abstrakcyjne](abstract-type-members.html) mogą być warunkowane przez ograniczenia typów. Tego rodzaju ograniczenia pomagają określić konkretne wartości zmiennych typu oraz odkryć więcej informacji na temat elementów tych typów. _Ograniczenie górne typu_ `T <: A` zakładają, że zmienna `T` jest podtypem typu `A`.

Poniższy przykład demonstruje zastosowanie ograniczeń górnych typu dla parametru typu klasy `Cage`:

```scala mdoc
abstract class Animal {
 def name: String
}

abstract class Pet extends Animal {}

class Cat extends Pet {
  override def name: String = "Cat"
}

class Dog extends Pet {
  override def name: String = "Dog"
}

class Lion extends Animal {
  override def name: String = "Lion"
}

class Cage[P <: Pet](p: P) {
  def pet: P = p
}

object Main extends App {
  var dogCage = new Cage[Dog](new Dog)
  var catCage = new Cage[Cat](new Cat)
  /* Nie można włożyć Lion do Cage, jako że Lion nie jest typu Pet. */
//  var lionCage = new Cage[Lion](new Lion)
}
```

Instancja klasy `Cage` może zawierać `Animal` z górnym ograniczeniem `Pet`. Obiekt typu `Lion` nie należy do klasy `Pet`, zatem nie może być włożony do obiektu `Cage`.

Zastosowanie dolnych ograniczeń typów jest opisane [tutaj](lower-type-bounds.html).
