---
layout: tour
title: Obiekty singleton
partof: scala-tour

num: 15
language: pl
next-page: regular-expression-patterns
previous-page: pattern-matching
---

Metody i wartości, które nie są powiązane z konkretną instancją [klasy](classes.html), należą do *obiektów singleton* określanych za pomocą słowa kluczowego `object` zamiast `class`.

```
package test

object Blah {
  def sum(l: List[Int]): Int = l.sum
}
```

Metoda `sum` jest dostępna globalnie i można się do niej odwołać lub importować jako `test.Blah.sum`.

Obiekty singleton są swego rodzaju skrótem do definiowania pojedynczej instancji klasy, która nie powinna być bezpośrednio tworzona i która sama w sobie stanowi referencję do tego obiektu, jakby była określona jako `val`.

Obiekt singleton może rozszerzać klasę lub cechę. Przykładowo [klasa przypadku](case-classes.html) bez [parametrów typu](generic-classes.html) domyślnie generuje obiekt singleton o tej samej nazwie, który implementuje cechę [`Function*`](https://www.scala-lang.org/api/current/scala/Function1.html).

## Obiekt towarzyszący ##

Duża część obiektów singleton nie istnieje samodzielnie, ale jest powiązana z klasą o tej samej nazwie. Obiekt singleton generowany dla klasy przypadku jest tego przykładem. Kiedy tak się dzieje, obiekt singleton jest zwany *obiektem towarzyszącym*.

Klasa i jej obiekt towarzyszący mogą być zdefiniowane tylko w tym samym pliku, przykład:

```scala mdoc
class IntPair(val x: Int, val y: Int)

object IntPair {
  import math.Ordering

  implicit def ipord: Ordering[IntPair] =
    Ordering.by(ip => (ip.x, ip.y))
}
```

Bardzo powszechne jest użycie wzorca typeclass w połączeniu z [wartościami domniemanymi](implicit-parameters.html) takimi jak `ipord` powyżej, zdefiniowanymi w obiekcie towarzyszącym. Dzieje się tak, ponieważ elementy obiektu towarzyszącego są uwzględniane w procesie wyszukiwania domyślnych wartości domniemanych.

## Uwagi dla programistów Javy ##

`static` nie jest słowem kluczowym w Scali. Zamiast tego wszystkie elementy, które powinny być statyczne (wliczając w to klasy), powinny zostać zamieszczone w obiekcie singleton.

Często spotykanym wzorcem jest definiowanie statycznych elementów, np. jako prywatne, pomocnicze dla ich instancji. W Scali przenosi się je do obiektu towarzyszącego:

```
class X {
  import X._

  def blah = foo
}

object X {
  private def foo = 42
}
```

Ten przykład ilustruje inną właściwość Scali: w kontekście zasięgu prywatnego klasa i jej obiekt towarzyszący mają wzajemny dostęp do swoich pól. Aby sprawić, żeby dany element klasy *naprawdę* stał się prywatny, należy go zadeklarować jako `private[this]`.

Dla wygodnej współpracy z Javą metody oraz pola klasy w obiekcie singleton mają także statyczne metody zdefiniowane w obiekcie towarzyszącym (nazywane *static forwarder*). Dostęp do innych elementów można uzyskać poprzez statyczne pole `X$.MODULE$` dla obiektu `X`.
