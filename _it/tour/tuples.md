---
layout: tour
title: Tuples
partof: scala-tour

num: 8
next-page: mixin-class-composition
previous-page: traits
topics: tuples
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)


In Scala, una tupla è un valore che contiene un numero fisso di elementi, ognuno
con il proprio tipo. Le tuple sono immutabili.

Le tuple sono particolarmente utili per restituire valori multipli da un methodo.

Una tupla con due elementi può essere creata come segue:

```tut
val ingredient = ("Sugar" , 25)
```

Questo creerà una tupla contenente un elemento di tipo `String` e uno di tipo `Int`.

Il tipo inferito di `ingredient` è `(String, Int)`, che è un'abbreviazione per `Tuple2[String, Int]`.

Per rappresentare le tuple, scala ha una serie di classi: `Tuple2`, `Tuple3`, ecc., fino a `Tuple22` (compreso).
Ogni classe ha un numero di tipi di parametri uguali al numero dei suoi elementi.

## Accedere agli elementi

Un modo per accedere agli elementi della tupla è per posizione. I singoli
elementi sono chiamati, in questo caso, `_1`, `_2`, e così via. Notare che
il primo elemento è richiamato tramite `_1`, e non `_0` come ci si potrebbe aspettare (NDT)

```tut
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```

## Pattern matching per le tuple

Una tupla può essere scomposta usando il pattern matching:

```tut
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```

In questo esempio il tipo inferito di `name` è `String`, mentre quello di
`quantity` è `Int`.

Di seguito un altro esempio di pattern matching applicato alle tuple:

```tut
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

Oppure, usando le `for` comprehension:

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## Tuple e case class

Gli utenti a volte trovano difficile scegliere tra tuple e case class. Le case class hanno elementi identificabili da un nome. I nomi possono
facilitare ed aumentare la leggibilità di alcuni pezzi di codice. Nell'esempio sopra, avremmo potuto definire una case class
`case class Planet(name: String, distance: Double)` invece di usare le tuple.


## Altre risorse

* Potete trovare più informazioni sulle tuple al seguente link: [Scala Book](/overviews/scala-book/tuples.html)
