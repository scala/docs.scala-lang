---
layout: tour
title: Cechy
partof: scala-tour

num: 7
language: pl
next-page: tuples
previous-page: named-arguments
---

Cechy (Traits) są używane, aby współdzielić interfejsy i pola pomiędzy klasami.
Są bardzo podobne do interfejsów w Javie 8.
Cechy mogą być rozszerzane przez klasy i obiekty, jednak nie można stworzyć instancji danej cechy.
Z tego powodu cechy nie przyjmują parametrów wartości.

## Definiowanie cechy

Minimalna definicja cechy składa się ze słowa kluczowego `trait` oraz identyfikatora.

```scala mdoc
trait HairColor
```

Cechy są szczególnie przydatne jako generyczne typy zawierające abstrakcyjne metody.

```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

Rozszerzenie cechy `trait Iterator[A]` wymaga wskazania parametru typu `A` oraz zaimplementowania metod `hasNext` i `next`.

## Używanie cech

Aby rozszerzyć cechę należy użyć słowa kluczowego `extends`.
Następnie wymagane jest zaimplementowanie abstrakcyjnych składników danej cechy używając słowa kluczowego `override.`

{% scalafiddle %}
```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int = {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}

val iterator = new IntIterator(10)
println(iterator.next())  // wyświetli 0
println(iterator.next())  // wyświetli 1
```
{% endscalafiddle %}

Klasa `IntIterator` przyjmuje parametr `to` (do) jako ograniczenie górne, oraz rozszerza `extends Iterator[Int]` - co oznacza, że metoda `next` musi zwrócić wartość typu Int.

## Podtyp

Jeżeli w jakimś miejscu wymagana jest cecha pewnego typu, to zamiast niej można użyć jej podtypu.

{% scalafiddle %}
```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // wyświetli Harry Sally
```
{% endscalafiddle %}

Cecha `trait Pet` posiada abstrakcyjne pole `name`, które zostaje zaimplementowane przez klasy `Cat` i `Dog` w ich konstruktorach.
W ostatnim wierszu wywołujemy `pet.name` musi być ono zaimplementowane przez każdy podtyp cechy `Pet`.
