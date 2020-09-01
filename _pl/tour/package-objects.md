---
layout: tour
title: Obiekty pakietu
language: pl
partof: scala-tour

num: 35
previous-page: packages-and-imports
language: pl
---

# Obiekty pakietu

Scala udostępnia obiekty pakietu jako wygodny kontener wspóldzielony w całym pakiecie.

Obiekty pakietu mogą zawierać dowolne definicje, nie tylko definicje zmiennych i metod. Na przykład, są często używane do przechowywania aliasów typów i niejawnych konwersji. Obiekty pakietu mogą nawet dziedziczyć klasy i cechy (traits) Scali.

Zgodnie z konwencją, kod źródłowy obiektu pakietu jest zwykle umieszczany w pliku źródłowym o nazwie `package.scala`.

Każdy pakiet może mieć jeden obiekt pakietu. Wszelkie definicje umieszczone w obiekcie pakietu traktowane są jak członkowie samego pakietu.

Zobacz przykład poniżej. Załóżmy najpierw, że w pakiecie `gradening.fruits` zdefiniowana jest klasa `Fruit` i trzy obiekty tej klasy:

```
// in file gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

Teraz załóżmy, że chcesz umieścić zmienną `planted` i metodę `showFruit` bezpośrednio w pakiecie `gardening.fruits`.
Możesz zrobić to w następujący sposób:

```
// in file gardening/fruits/package.scala
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```

Jako przykład tego, jak wygląda użycie definicji przygorowanych w ten sposób, obiekt `PrintPlanted` importuje `planted` i `showFruit` w ten sam sposób, w jaki importuje klasę `Fruit` - używając importu wieloznacznego w pakiecie `gardening.fruits`.

```
// in file PrintPlanted.scala
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```

Obiekty pakietu są podobne do innych obiektów, co oznacza, że można je tworzyć przy użyciu dziedziczenia. Na przykład można łączyć kilka cech:

```
package object fruits extends FruitAliases with FruitHelpers {
  // tutaj znajdują się pomocniki (helpers) i zmienne
}
```
