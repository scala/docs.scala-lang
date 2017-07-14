---
layout: inner-page-no-masthead
title: Funkcje anonimowe

discourse: false

tutorial: scala-tour
categories: tour
num: 6
language: pl
next-page: higher-order-functions
previous-page: mixin-class-composition
---

Scala posiada lekką składnię pozwalającą na definiowanie funkcji anonimowych. Poniższe wyrażenie tworzy funkcję następnika dla liczb całkowitych:

```tut
(x: Int) => x + 1
```

Jest to krótsza forma deklaracji anonimowej klasy:

```tut
new Function1[Int, Int] {
  def apply(x: Int): Int = x + 1
}
```

Możliwe jest także zdefiniowanie funkcji z wieloma parametrami:

```tut
(x: Int, y: Int) => "(" + x + ", " + y + ")"
```

lub też bez parametrów:

```tut
() => { System.getProperty("user.dir") }
```

Istnieje także prosty sposób definicji typów funkcji. Dla powyższych funkcji można je określić w następujący sposób:

```
Int => Int
(Int, Int) => String
() => String
```

Jest to skrócona forma dla poniższych typów:

```
Function1[Int, Int]
Function2[Int, Int, String]
Function0[String]
```
