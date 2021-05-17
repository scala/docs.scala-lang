---
layout: tour
title: Krotki
partof: scala-tour

num: 8
language: pl
next-page: mixin-class-composition
previous-page: traits

---

W Scali, krotka (ang. tuple) to klasa, która przechowuje elementy różnych typów.
Krotki są niezmienne.

Krotki przydają się, gdy chcemy, żeby funkcja zwróciła jednocześnie wiele wartości.

Krotki tworzy się w następujący sposób:

```scala mdoc
val ingredient = ("Sugar" , 25): Tuple2[String, Int]
```

Powyższy kod tworzy krotkę zawierającą element typu String oraz typu Int.

W Scali krotki reprezentowane są przez szereg klas: Tuple2, Tuple3 itd. aż do Tuple22.
Za każdym razem, kiedy tworzymy krotkę zawierającą _n_ elementów (_n_ musi zawierać się w przedziale od 2 do 22), Scala tworzy instancję jednej z odpowiadających klas z grupy TupleN i parametryzuje ją odpowiednimi wartościami.
W ww. przykładzie jest to `Tuple2[String, Int]`.

## Dostęp do elementów

Krotka zapewnia dostęp do swoich elementów z użyciem składni podkreślnika (underscore).
`tuple._n` odwołuje się do n-tego elementu w kolejności (pod warunkiem, że dana krotka zawiera tyle elementów).

```scala mdoc
println(ingredient._1) // wyświetli Sugar

println(ingredient._2) // wyświetli 25
```

## Dekonstrukcja krotki

Krotki w Scali wspierają dekonstrukcję

```scala mdoc
val (name, quantity) = ingredient

println(name) // wyświetli Sugar

println(quantity) // wyświetli 25
```

Dekonstrukcja krotek może być bardzo przydatna w dopasowywaniu wzorców (ang. pattern matching)

{% scalafiddle %}
```scala mdoc
val planetDistanceFromSun = List(
  ("Mercury", 57.9),
  ("Venus", 108.2),
  ("Earth", 149.6),
  ("Mars", 227.9),
  ("Jupiter", 778.3)
)

planetDistanceFromSun.foreach {
  case ("Mercury", distance)  => println(s"Merkury jest $distance milionów km od Słońca")
    case p if p._1 == "Venus" => println(s"Wenus jest ${p._2} milionów km od Słońca")
    case p if p._1 == "Earth" => println(s"Niebieska Planeta jest ${p._2} milionów km od Słońca")
    case _                    => println("Zbyt daleko...")
}
```
{% endscalafiddle %}

Ma ona też zastosowanie w wyrażeniach 'for'.

{% scalafiddle %}
```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))

for ((a, b) <- numPairs) {
  println(a * b)
}
```
{% endscalafiddle %}

Wartość `()` typu `Unit` jest koncepcyjnie taka sama jak wartość `()` typu `Tuple0`.
Może być tylko jedna wartość tego typu, ponieważ nie zawiera żadnych elementów.

Użytkownicy mogą czasami mieć trudności z wyborem pomiędzy krotkami (tuple) i klasami przypadków (case class).
Zazwyczaj klasy przypadków są preferowane wtedy, kiedy elementy niosą ze sobą jakieś większe znaczenie.
``
