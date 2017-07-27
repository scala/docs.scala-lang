---
layout: tour
title: Klasy

discourse: false

partof: scala-tour

num: 3
language: pl
next-page: traits
previous-page: unified-types
---

Klasy w Scali określają schemat obiektów podczas wykonania programu. Oto przykład definicji klasy `Point`:

```tut
class Point(var x: Int, var y: Int) {
  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }
  override def toString: String =
    "(" + x + ", " + y + ")"
}
```

Klasy w Scali są sparametryzowane poprzez argumenty konstruktora. Powyższy kod wymaga podania dwóch argumentów konstruktora: `x` i `y`. Oba parametry są widoczne w zasięgu ciała klasy.

Klasa `Point` zawiera także dwie metody: `move` i `toString`. `move` pobiera dwa argumenty w postaci liczb całkowitych, ale nie zwraca żadnej wartości (zwracany typ `Unit` odpowiada `void` w językach takich jak Java). Z drugiej strony `toString` nie wymaga żadnych parametrów, ale zwraca łańcuch znaków typu `String`. Ponieważ `toString` przesłania predefiniowaną metodę `toString`, jest ona oznaczona słowem kluczowym `override`.

Należy dodać, że w Scali nie jest wymagane podanie słowa kluczowego `return` w celu zwrócenia wartości. Dzięki temu, że każdy blok kodu w Scali jest wyrażeniem, wartością zwracaną przez metodę jest ostatnie wyrażenie w ciele metody. Dodatkowo proste wyrażenia, takie jak zaprezentowane na przykładzie implementacji `toString` nie wymagają podania klamer, zatem można je umieścić bezpośrednio po definicji metody.

Instancje klasy można tworzyć w następujący sposób:

```tut
object Classes {
  def main(args: Array[String]) {
    val pt = new Point(1, 2)
    println(pt)
    pt.move(10, 10)
    println(pt)
  }
}
```

Program definiuje wykonywalną aplikację w postaci [obiektu singleton](singleton-objects.html) z główną metodą `main`. Metoda `main` tworzy nową instancję typu `Point` i zapisuje ją do wartości `pt`. Istotną rzeczą jest to, że wartości zdefiniowane z użyciem słowa kluczowego `val` różnią się od zmiennych określonych przez `var` (jak w klasie `Point` powyżej) tym, że nie dopuszczają aktualizacji ich wartości.

Wynik działania programu:

```
(1, 2)
(11, 12)
```
