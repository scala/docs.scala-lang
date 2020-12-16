---
layout: tour
title: Rozwijanie funkcji (Currying)
partof: scala-tour

num: 12
language: pl
next-page: case-classes
previous-page: nested-functions
---

Metoda może określać dowolną liczbę list parametrów.
W sytuacji, kiedy jest ona wywołana dla mniejszej liczby list parametrów niż zostało to zdefiniowane, zwracana jest funkcja oczekująca pozostałych list parametrów jako argumentów.

Dla przykładu przyjrzyjmy się metodzie `foldLeft` zdefiniowanej w [Traversable](/overviews/collections/trait-traversable.html) z kolekcji w Scali:

```
def foldLeft[B](z: B)(op: (B, A) => B): B
```

Metoda `foldLeft` stosuje binarny operator `op` na wartości początkowej `z` oraz wszystkich elementach zawartych w aktualnym obiekcie `Traversable` - idąc od lewej do prawej strony.
Poniżej omówiony jest przykład użycia. 

Zaczynając od początkowej wartości 0, funkcja `foldLeft` stosuje funkcję `(m, n) => m + n` na każdym elemencie listy oraz poprzedniej zakumulowanej wartości.

{% scalafiddle %}
```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}

Metody z wieloma listami parametrów mają bardziej dosadną składnię wywoływania, dlatego powinny być używane oszczędnie.
Sugerowane przypadki użycia obejmują:

#### Funkcja jako pojedynczy parametr

W przypadku funkcji jako pojedynczego parametru, tak jak w przypadku `op` z `foldLeft` powyżej, wiele list parametrów pozwala na bardziej zwięzłą składnię przy przekazywaniu funkcji anonimowej do metody.
Bez wielu list parametrów kod wyglądałby w następujący sposób:

```
numbers.foldLeft(0, {(m: Int, n: Int) => m + n})
```

Zauważ, że użycie wielu list parametrów pozwala na wykorzystanie wnioskowania typów, co z kolei czyni kod bardziej zwięzłym (jak pokazano poniżej).
Używając standardowej definicji metody, nie byłoby to możliwe.

```
numbers.foldLeft(0)(_ + _)
```

Powyższe wyrażenie `numbers.foldLeft(0)(_ + _)` pozwala trwale ustawić parametr `z` i przekazywać dalej częściową funkcję (partial function), tak jak pokazano to poniżej:

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]())_

val squares = numberFunc((xs, x) => xs:+ x*x)
print(squares.toString()) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs:+ x*x*x)
print(cubes.toString())  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

Podsumowując, `foldLeft` oraz `foldRight` mogą być używane w dowolnej z poniższych postaci:

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

numbers.foldLeft(0)((sum, item) => sum + item) // postać ogólna
numbers.foldRight(0)((sum, item) => sum + item) // postać ogólna

numbers.foldLeft(0)(_+_) // postać rozwijana (curried)
numbers.foldRight(0)(_+_) // postać rozwijana (curried)
```
