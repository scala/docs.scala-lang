---
layout: tour
title: Ekstraktor objekti
language: ba
partof: scala-tour

num: 16
next-page: for-comprehensions
previous-page: regular-expression-patterns

---

Ekstraktor objekat je objekat koji ima `unapply` metodu.
Dok je `apply` metoda kao konstruktor koji uzima argumente i kreira objekat, `unapply` metoda prima objekat i pokušava vratiti argumente. 
Ovo se najčešće koristi u podudaranju uzoraka i parcijalnim funkcijama.

```scala mdoc
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val name = customerID.split("--").head
    if (name.nonEmpty) Some(name) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // prints Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```

Metoda `apply` kreira `CustomerID` string od argumenta `name`. 
Metoda `unapply` radi suprotno da dobije `name` nazad. 
Kada pozovemo `CustomerID("Sukyoung")`, to je skraćena sintaksa za `CustomerID.apply("Sukyoung")`. 
Kada pozovemo `case CustomerID(name) => customer1ID`, ustvari pozivamo `unapply` metodu.

Metoda `unapply` se može koristiti i za dodjelu vrijednosti.

```scala mdoc
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // prints Nico
```

Ovo je ekvivalentno `val name = CustomerID.unapply(customer2ID).get`. Ako se uzorak ne podudari, baciće se  `scala.MatchError` izuzetak:

```scala mdoc:crash
val CustomerID(name2) = "--asdfasdfasdf"
```

Povratni tip od `unapply` se bira na sljedeći način:

* Ako je samo test, vraća `Boolean`. Naprimjer `case even()`
* Ako vraća jednu pod-vrijednost tipa `T`, vraća `Option[T]`
* Ako vraća više pod-vrijednosti `T1,...,Tn`, grupiše ih u opcionu torku `Option[(T1,...,Tn)]`.

Ponekad, broj pod-vrijednosti nije fiksan i želimo da vratimo listu.
Iz ovog razloga, također možete definisati uzorke pomoću `unapplySeq` koja vraća `Option[Seq[T]]`.
Ovaj mehanizam se koristi naprimjer za uzorak `case List(x1, ..., xn)`.
