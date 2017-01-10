---
layout: tutorial
title: Obiekty singleton

disqus: true

tutorial: scala-tour
num: 12
language: pl

tutorial-next: xml-processing
tutorial-previous: pattern-matching
---

Metody i wartości które nie są powiązane z konkretną instancją [klasy](classes.html) należą do *obiektów singleton*, określanych za pomocą słowa kluczowego `object` zamiast `class`.

```
package test

object Blah {
  def sum(l: List[Int]): Int = l.sum
}
```

Metoda `sum` jest dostępna globalnie i można się do niej odwołać lub importować jako `test.Blah.sum`.

Obiekty singleton są swego rodzaju skrótem do definiowania pojedynczej instancji klasy, która nie powinna być bezpośrednio tworzona i która sama w sobie stanowi referencję do tego obiektu, jakby była określona jako `val`. 

Obiekt singleton może rozszerzać klasę lub cechę. Przykładowo [klasa case](case-class.html) bez [parametrów typu](generic-class.html), domyślnie generuje obiekt singleton o tej samej nazwie, który implementuje cechę [`Function*`](http://www.scala-lang.org/api/current/scala/Function1.html).

## Companion ##

Duża część obiektów singleton nie istnieje samodzielnie, ale jest powiązana z klasą o tej samej nazwie. Obiekt singleton generowany dla klasy case jest tego przykładem. Kiedy tak się dzieje, obiekt singleton jest zwany *obiektem companion* (co oznacza, że jest _towarzyszem_ tej klasy).

Klasa i jej obiekt companion mogą być zdefiniowane tylko w tym samym pliku, przykład:

```tut
class IntPair(val x: Int, val y: Int)

object IntPair {
  import math.Ordering

  implicit def ipord: Ordering[IntPair] =
    Ordering.by(ip => (ip.x, ip.y))
}
```

Bardzo powszechne jest użycie wzorca typeclass w połączeniu z [wartościami implicit](implicit-parameters.html), takich jak `ipord` powyżej, zdefiniowanych w obiekcie companion. Dzieje się tak, ponieważ elementy obiektu companion są włączone w procesie wyszukiwania domyślnych wartości implicit.

## Uwagi dla programistów Javy ##

`static` nie jest słowem kluczowym w Scali. Zamiast tego, wszyskie elementy, które powinny być statyczne (wliczając w to klasy) powinny zostać zamieszczone w obiekcie singleton.

Często spotykanym wzorcem jest definiowanie statycznych elementów, np. jako prywatne, pomocniczo dla ich instancji. W Scali przenosi się je do obiektu companion:

```
class X {
  import X._

  def blah = foo
}

object X {
  private def foo = 42
}
```

Ten przykład ilustruje inną właściwość Scali: w kontekście zasięgu prywatnego, klasa i jej companion mają wzajemny dostęp do swoich pól. Aby sprawić, że dany element klasy jest *naprawdę* prywatny należy go zadeklarować jako `private[this]`.

Dla wygodnej współpracy z Javą, metody oraz pola klasy w obiekcie singleton, mają także statyczne metody zdefiniowane w obiekcie companion, nazywane *static forwarder*. Dostęp do innych elementów można uzyskać poprzez statyczne pole `X$.MODULE$` dla obiektu `X`.
