---
layout: tour
title: Konwersje niejawne
partof: scala-tour

num: 28
language: pl
next-page: polymorphic-methods
previous-page: implicit-parameters
---

Konwersja niejawna z typu `S` do `T` jest określona przez wartość domniemaną, która jest funkcją typu `S => T` lub przez metodę domniemaną odpowiadającą funkcji tego typu.

Konwersje niejawne mogą być są zastosowane w jednej z dwóch sytuacji:

* Jeżeli wyrażenie `e` jest typu `S` i `S` nie odpowiada wymaganemu typowi `T`.
* W przypadku wyboru `e.m` z `e` typu `T`, jeżeli `m` nie jest elementem `T`.

W pierwszym przypadku wyszukiwana jest konwersja `c`, którą można zastosować do `e`, aby uzyskać wynik typu `T`.
W drugim przypadku wyszukiwana jest konwersja `c`, którą można zastosować do `e` i której wynik zawiera element nazwany `m`.

Poniższa operacja na dwóch listach `xs` oraz `ys` typu `List[Int]` jest dopuszczalna:

```
xs <= ys
```

Zakładając że metody niejawne `list2ordered` oraz `int2ordered` zdefiniowane poniżej znajdują się w danym zakresie:

```
implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { /* .. */ }

implicit def int2ordered(x: Int): Ordered[Int] =
  new Ordered[Int] { /* .. */ }
```

Domyślnie importowany obiekt `scala.Predef` deklaruje kilka predefiniowanych typów (np. `Pair`) i metod (np. `assert`) ale także wiele użytecznych konwersji niejawnych.

Przykładowo, kiedy wywołujemy metodę Javy, która wymaga typu `java.lang.Integer`, dopuszczalne jest przekazanie typu `scala.Int`. Dzieje się tak ponieważ `Predef` definiuje poniższe konwersje niejawne:

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

Aby zdefiniować własne konwersje niejawne, należy zaimportować `scala.language.implicitConversions` (albo uruchomić kompilator z opcją `-language:implicitConversions`). Ta funkcjonalność musi być włączona jawnie ze względu na problemy, jakie mogą się wiązać z ich nadmiernym stosowaniem.
