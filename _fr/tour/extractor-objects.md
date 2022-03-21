---
layout: tour
title: Extractor Objects
partof: scala-tour

num: 18

language: fr

next-page: for-comprehensions
previous-page: regular-expression-patterns
---

Un objet extracteur est un objet avec une méthode `unapply`. Tandis que la méthode `apply` ressemble à un constructeur qui prend des arguments et crée un objet, `unapply` prend un object et essaye de retourner ses arguments. Il est utilisé le plus souvent en filtrage par motif (*pattern matching*) ou avec les fonctions partielles.
  
```scala mdoc
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val stringArray: Array[String] = customerID.split("--")
    if (stringArray.tail.nonEmpty) Some(stringArray.head) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // prints Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```

La méthode `apply` crée une chaîne de caractères `CustomerID` depuis `name`. La méthode `unapply` fait l'inverse pour retrouver le `name`. Lorsqu'on appelle `CustomerID("Sukyoung")`, c'est un raccourci pour `CustomerID.apply("Sukyoung")`. Lorsqu'on appelle `case CustomerID(name) => println(name)`, on appelle la méthode `unapply` avec `CustomerID.unapply(customer1ID)`.

Sachant qu'une définition de valeur peut utiliser une décomposition pour introduire une nouvelle variable, un extracteur peut être utilisé pour initialiser la variable, avec la méthode `unapply` pour fournir la valeur. 

```scala mdoc
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // prints Nico
```

C'est équivalent à `val name = CustomerID.unapply(customer2ID).get`.

```scala mdoc
val CustomerID(name2) = "--asdfasdfasdf"
```

S'il n'y a pas de correspondance, une `scala.MatchError` est levée :

```scala
val CustomerID(name3) = "-asdfasdfasdf"
```

Le type de retour de `unapply` doit être choisi comme suit :

* Si c'est juste un test, retourner un `Boolean`. Par exemple, `case even()`.
* Si cela retourne une seule sous-valeur de type T, retourner un `Option[T]`.
* Si vous souhaitez retourner plusieurs sous-valeurs `T1,...,Tn`, groupez-les dans un tuple optionnel `Option[(T1,...,Tn)]`.

Parfois, le nombre de valeurs à extraire n'est pas fixe et on souhaiterait retourner un nombre arbitraire de valeurs, en fonction des données d'entrée. Pour ce cas, vous pouvez définir des extracteurs avec la méthode `unapplySeq` qui retourne un `Option[Seq[T]]`. Un exemple commun d'utilisation est la déconstruction d'une liste en utilisant `case List(x, y, z) =>`. Un autre est la décomposition d'une `String` en utilisant une expression régulière `Regex`, comme `case r(name, remainingFields @ _*) =>`.

Traduit par Antoine Pointeau.