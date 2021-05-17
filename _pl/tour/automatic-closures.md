---
layout: tour
title: Automatyczna konstrukcja domknięć
partof: scala-tour

num: 30
language: pl
next-page: annotations
previous-page: operators
---

Scala pozwala na przekazywanie funkcji bezparametrycznych jako argumenty dla metod. Kiedy tego typu metoda jest wywołana, właściwe parametry dla funkcji bezparametrycznych nie są ewaluowane i przekazywana jest pusta funkcja, która enkapsuluje obliczenia odpowiadającego parametru (tzw. *wywołanie-przez-nazwę*).

Poniższy kod demonstruje działanie tego mechanizmu:

```scala mdoc
object TargetTest1 extends App {
  def whileLoop(cond: => Boolean)(body: => Unit): Unit =
    if (cond) {
      body
      whileLoop(cond)(body)
    }
  var i = 10
  whileLoop (i > 0) {
    println(i)
    i -= 1
  }
}
```

Funkcja `whileLoop` pobiera dwa parametry: `cond` i `body`. Kiedy funkcja jest aplikowana, jej właściwe parametry nie są ewaluowane. Lecz gdy te parametry są wykorzystane w ciele `whileLoop`, zostanie ewaluowana niejawnie utworzona funkcja zwracająca ich prawdziwą wartość. Zatem metoda `whileLoop` implementuje rekursywnie pętlę while w stylu Javy.

Możemy połączyć ze sobą wykorzystanie [operatorów infiksowych/postfiksowych](operators.html) z tym mechanizmem aby utworzyć bardziej złożone wyrażenia.

Oto implementacja pętli w stylu wykonaj-dopóki:

```scala mdoc
object TargetTest2 extends App {
  def loop(body: => Unit): LoopUnlessCond =
    new LoopUnlessCond(body)
  protected class LoopUnlessCond(body: => Unit) {
    def unless(cond: => Boolean) {
      body
      if (!cond) unless(cond)
    }
  }
  var i = 10
  loop {
    println("i = " + i)
    i -= 1
  } unless (i == 0)
}
```

Funkcja `loop` przyjmuje ciało pętli oraz zwraca instancję klasy `LoopUnlessCond` (która enkapsuluje to ciało). Warto zwrócić uwagę, że ciało tej funkcji nie zostało jeszcze ewaluowane. Klasa `LoopUnlessCond` posiada metodę `unless`, którą możemy wykorzystać jako *operator infiksowy*. W ten sposób uzyskaliśmy całkiem naturalną składnię dla naszej nowej pętli: `loop { < stats > } unless ( < cond > )`.

Oto wynik działania programu `TargetTest2`:

```
i = 10
i = 9
i = 8
i = 7
i = 6
i = 5
i = 4
i = 3
i = 2
i = 1
```

