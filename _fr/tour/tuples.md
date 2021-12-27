---
layout: tour
title: Tuples
partof: scala-tour

num: 8

language: fr

next-page: mixin-class-composition
previous-page: traits
---

En Scala, un tuple est une valeur qui contient un nombre fixe d'éléments, chacun avec son propre type. Les tuples sont immuables.

Les tuples sont notamment utiles pour retourner plusieurs valeurs depuis une méthode.

Un tuple avec deux éléments peut être créé de la façon suivante :

```scala mdoc
val ingredient = ("Sugar" , 25)
```

Cela crée un tuple contenant un élément de type `String` et un élément de type `Int`.

Le type inféré de `ingredient` est `(String, Int)`, qui est un raccourci pour `Tuple2[String, Int]`.

Pour représenter les tuples, Scala utilise une série de classes : `Tuple2`, `Tuple3`, etc., jusqu'a `Tuple22`.
Chaque classe a autant de paramètres de types qu'elle a d'éléments.

## Accéder aux éléments

Une des méthodes pour accéder aux éléments d'un tuple est par position. Les éléments sont nommés individuellement `_1`, `_2`, et ainsi de suite.

```scala mdoc
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```

## Pattern matching sur les tuples

Un tuple peut aussi être décomposé en utilisant le pattern matching :

```scala mdoc
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```

Ici le type inféré de `name` est `String` et le type inféré de `quantity` est `Int`.

Voici un autre exemple de pattern-matching sur un tuple :

```scala mdoc
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach {
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

Ou, en décomposition dans un `for` :

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## Les tuples et les classes de cas

Les utilisateurs trouvent parfois qu'il est difficile de choisir entre les tuples et les classes de cas. Les classes de cas ont des éléments nommés. Les noms peuvent améliorer la lisibilité de certains codes. Dans l'exemple ci-dessus avec planet, nous pourrions définir `case class Planet(name: String, distance: Double)` plutôt que d'utiliser les tuples.

## Plus d'informations

* Apprennez-en d'avantage sur les tuples dans [Scala Book](/overviews/scala-book/tuples.html)

Traduction par Antoine Pointeau.