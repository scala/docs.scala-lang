---
layout: tour
title: For komprehensije
language: ba

disqus: true

partof: scala-tour

num: 17
next-page: generic-classes
previous-page: extractor-objects

---

Scala ima skraćenu notaciju za pisanje *komprehensija sekvenci*.
Komprehensije imaju oblik  
`for (enumeratori) yield e`, gdje su `enumeratori` lista enumeratora razdvojenih tačka-zarezima.
*Enumerator* je ili generator koji uvodi nove varijable, ili je filter.
Komprehensija evaluira tijelo `e` za svako vezivanje varijable generisano od strane enumeratora i vraća sekvencu ovih vrijednosti.

Slijedi primjer:

```scala mdoc
case class User(name: String, age: Int)

val userBase = List(User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings = for (user <- userBase if (user.age >=20 && user.age < 30))
  yield user.name  // i.e. add this to a list

twentySomethings.foreach(name => println(name))  // prints Travis Dennis
```
`for` petlja korištena s `yield`-om ustvari kreira `List`-u. Pošto smo rekli `yield user.name`, to je `List[String]`. `user <- userBase` je naš generator a `if (user.age >=20 && user.age < 30)` je čuvar koji filtrira korisnike koji su u svojim dvadesetim.

Slijedi malo komplikovaniji primjer koji s dva generatora. Izračunava sve parove brojeva između `0` i `n-1` čija je suma jednaka vrijednosti `v`:

```scala mdoc
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- i until n if i + j == v)
   yield (i, j)

foo(10, 10) foreach {
  case (i, j) =>
    print(s"($i, $j) ")  // prints (1, 9) (2, 8) (3, 7) (4, 6) (5, 5)
}

```
Ovdje je `n == 10` i `v == 10`. U prvoj iteraciji, `i == 0` i `j == 0` tako da `i + j != v` i ništa se ne vraća. `j` se povećava 9 puta prije nego se `i` poveća na `1`. 
Bez `if` čuvara, ovo bi ispisalo sljedeće:
```

(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 0) ...
```
