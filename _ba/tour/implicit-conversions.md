---
layout: tour
title: Implicitne konverzije
language: ba
partof: scala-tour

num: 27
next-page: polymorphic-methods
previous-page: implicit-parameters

---

Implicitna konverzija iz tipa `S` u tip `T` je definisana kao implicitna vrijednost koja ima tip `S => T` (funkcija), 
ili kao implicitna metoda koja može pretvoriti u očekivani tip `T`.

Implicitne konverzije se primjenjuju u dvije situacije:

* Ako je izraz `e` tipa `S`, i `S` ne odgovara očekivanom tipu `T`.
* U selekciji `e.m` gdje je `e` tipa `T`, ako selektor `m` nije član tipa `T`.

U prvom slučaju, traži se konverzija `c` koja je primjenjiva na `e` i čiji rezultat odgovara `T`. 
U drugom slučaju, traži se konverzija `c` koja je primjenjiva na `e` i čiji rezultat sadrži član pod imenom `m`.

Sljedeća operacija nad dvije liste xs i ys tipa `List[Int]` je legalna:

```
xs <= ys
```

pod pretpostavkom da su implicitne metode `list2ordered` i `int2ordered` definisane i dostupne (in scope):

```
implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { /* .. */ }

implicit def int2ordered(x: Int): Ordered[Int] =
  new Ordered[Int] { /* .. */ }
```

Implicitno importovani objekt `scala.Predef` deklariše nekoliko predefinisanih tipova (npr. `Pair`) i metoda (npr. `assert`) ali i nekoliko implicitnih konverzija.

Naprimjer, kada se pozivaju Javine metode koje očekuju `java.lang.Integer`, možete proslijediti `scala.Int`.
Možete, zato što `Predef` uključuje slj. implicitnu konverziju:

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

Pošto su implicitne konverzije opasne ako se koriste pogrešno, kompajler upozorava kada kompajlira definiciju implicitne konverzije.

Da biste ugasili ova upozorenja, uradite jedno od ovog:

* Importujte `scala.language.implicitConversions` u domen definicije implicitne konverzije
* Upalite kompajler s `-language:implicitConversions`

