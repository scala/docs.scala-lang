---
layout: tour
title: Klasy generyczne

discourse: false

partof: scala-tour

num: 17
language: pl
next-page: variances
previous-page: extractor-objects
---

Scala posiada wbudowaną obsługą klas parametryzowanych przez typy. Tego typu klasy generyczne są szczególnie użyteczne podczas tworzenia klas kolekcji.

Poniższy przykład demonstruje zastosowanie parametrów generycznych:

```tut
class Stack[T] {
  var elems: List[T] = Nil
  def push(x: T) { elems = x :: elems }
  def top: T = elems.head
  def pop() { elems = elems.tail }
}
```

Klasa `Stack` modeluje zmienny stos zawierający elementy dowolnego typu `T`. Parametr `T` narzuca ograniczenie dla metod takie, że tylko elementy typu `T` mogą zostać dodane do stosu. Podobnie metoda `top` może zwrócić tylko elementy danego typu.

Przykłady zastosowania:

```tut
object GenericsTest extends App {
  val stack = new Stack[Int]
  stack.push(1)
  stack.push('a')
  println(stack.top)
  stack.pop()
  println(stack.top)
}
```

Wyjściem tego programu będzie:

```
97
1
```

_Uwaga: podtypowanie typów generycznych jest domyślnie określane jako invariant (niezmienne). Oznacza to, że mając stos znaków typu `Stack[Char]`, nie można go użyć jako stos typu `Stack[Int]`. Byłoby to błędne, ponieważ pozwalałoby to nam na wprowadzenie liczb całkowitych do stosu znaków. Zatem `Stack[T]` jest tylko podtypem `Stack[S]` jeżeli `S = T`. Ponieważ jednak jest to dość ograniczające, Scala posiada [mechanizm adnotacji parametrów typów](variances.html) pozwalający na kontrolę zachowania podtypowania typów generycznych._
