---
layout: tour
title: Parametry przekazywane według nazwy
partof: scala-tour

num: 32
next-page: annotations
previous-page: operators
language: pl
---

_Parametry przekazywane według nazwy_ są ewaluowane za każdym razem gdy są używane. Nie zostaną w ogóle wyewaluowane jeśli nie będą używane. Jest to podobne do zastępowania parametrów w ciele funkcji wyrażeniami podanymi w miejscu jej wywołania. Są przeciwieństwem do _parametrów przekazywanych według wartości_. Aby utworzyć parametr przekazywany według nazwy, po prostu dodaj `=>` przed jego typem.

```scala mdoc
def calculate(input: => Int) = input * 37
```

Parametry przekazywane według nazwy mają tę zaletę że nie są ewaluowane jeśli nie są używane w treści funkcji. Z drugiej strony parametry według wartości mają tę zaletę, że są ewaluowane tylko raz.

Oto przykład, jak możemy zaimplementować pętlę while:

```scala mdoc
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // prints 2 1
```

Metoda `whileLoop` używa wielu list parametrów do określenia warunku i treści pętli. Jeśli `condition` (warunek) jest prawdziwy, `body` (treść) jest wykonywana a następnie wykonywane jest rekurencyjne wywołanie `whileLoop`. Jeśli `condition` jest fałszywy, treść nigdy nie jest ewaluowana, ponieważ dodaliśmy `=>` do typu `body`.

Jeśli przekażemy `i>0` jako nasz `condition` (warunek) i `println(i); i-= 1` jako `body`, nasze wyrażenie zachowuje się jak standardowa pętla while w wielu językach.

Ta możliwość opóźnienia ewaluacji parametru do czasu jego użycia może zwiększyć wydajność, jeśli ewaluacja parametru wymaga intensywnych obliczeń lub dłużej działającego bloku kodu, takiego jak pobieranie treści spod adresu URL.
