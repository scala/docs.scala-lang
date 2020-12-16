---
layout: tour
title: Metody polimorficzne
partof: scala-tour

num: 29
language: pl
next-page: type-inference
previous-page: implicit-conversions
---

Metody w Scali mogą być parametryzowane zarówno przez wartości, jak i typy. Tak jak na poziomie klas, wartości parametrów zawierają się w parze nawiasów okrągłych, podczas gdy parametry typów są deklarawane w parze nawiasów kwadratowych.

Przykład poniżej:

```scala mdoc
def dup[T](x: T, n: Int): List[T] = {
  if (n == 0)
    Nil
  else
    x :: dup(x, n - 1)
}

println(dup[Int](3, 4))
println(dup("three", 3))
```

Metoda `dup` jest sparametryzowana przez typ `T` i parametry wartości `x: T` oraz `n: Int`. W pierwszym wywołaniu `dup` są przekazane wszystkie parametry, ale - jak pokazuje kolejna linijka - nie jest wymagane jawne podanie właściwych parametrów typów. System typów w Scali może inferować tego rodzaju typy. Dokonuje się tego poprzez sprawdzenie, jakiego typu są parametry dane jako wartości argumentów oraz na podstawie kontekstu wywołania metody.
