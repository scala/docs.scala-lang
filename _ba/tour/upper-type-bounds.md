---
layout: tour
title: Gornja granica tipa
language: ba
partof: scala-tour
categories: tour
num: 20
next-page: lower-type-bounds
previous-page: variances

---

U Scali, [tipski parametri](generic-classes.html) i [apstraktni tipovi](abstract-type-members.html) mogu biti ograničeni granicom tipa.
Takve granice tipa ograničavaju konkretne vrijednosti tipskih varijabli i ponekad otkrivaju još informacija o članovima takvih tipova.
  _Gornja granica tipa_ `T <: A` kaže da se tipska varijabla `T` odnosi na podtip tipa `A`.
Slijedi primjer koji demonstrira gornju granicu tipa za tipski parametar klase `PetContainer`:

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

class PetContainer[P <: Pet](p: P) {
  def pet: P = p
}

val dogContainer = new PetContainer[Dog](new Dog)
val catContainer = new PetContainer[Cat](new Cat)
```

```scala mdoc:fail
val lionContainer = new PetContainer[Lion](new Lion) // this would not compile
```
Klasa `PetContainer` prima tipski parametar `P` koji mora biti podtip od `Pet`. 
`Dog` i `Cat` su podtipovi `Pet` tako da možemo kreirati novi `PetContainer[Dog]` i `PetContainer[Cat]`. 
Međutim, ako pokušamo kreirati `PetContainer[Lion]`, dobićemo sljedeću grešku:

`type arguments [Lion] do not conform to class PetContainer's type parameter bounds [P <: Pet]`

To je zato što `Lion` nije podtip `Pet`.
