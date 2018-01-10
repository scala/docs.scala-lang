---
layout: tour
title: Funkcje wyższego rzędu

discourse: false

partof: scala-tour

num: 7
language: pl
next-page: nested-functions
previous-page: mixin-class-composition
---

Scala pozwala na definiowanie funkcji wyższego rzędu. Są to funkcje, które przyjmują funkcje jako parametry lub których wynik jest też funkcją. Poniżej znajduje się przykład funkcji `apply`, która pobiera inną funkcję `f` i wartość `v` po to, by zwrócić wynik zastosowania `f` do `v`:

```tut
def apply(f: Int => String, v: Int) = f(v)
```

_Uwaga: metody są automatycznie zamieniane na funkcje, jeżeli wymaga tego kontekst_

Praktyczny przykład:

```tut
class Decorator(left: String, right: String) {
  def layout[A](x: A) = left + x.toString() + right
}

object FunTest extends App {
  def apply(f: Int => String, v: Int) = f(v)
  val decorator = new Decorator("[", "]")
  println(apply(decorator.layout, 7))
}
```

Wykonanie zwraca poniższy wynik:

```
[7]
```

W tym przykładzie metoda `decorator.layout` jest automatycznie konwertowana do funkcji typu `Int => String`, czego wymaga funkcja `apply`. Warto dodać, że metoda `decorator.layout` jest polimorficzna, co oznacza, że jej sygnatura jest odpowiednio dopasowana przez kompilator, dzięki czemu, gdy jest przekazana do funkcji `apply`, jest ona traktowana jako `Int => String`.
