---
layout: tour
title: Podstawy
partof: scala-tour

num: 2
language: pl
next-page: unified-types
previous-page: tour-of-scala
---

Na tej stronie omówimy podstawy języka Scala.

## Uruchamianie Scali w przeglądarce

Dzięki ScalaFiddle możesz uruchomić Scalę w swojej przeglądarce.

1. Przejdź do [https://scalafiddle.io](https://scalafiddle.io).
2. Wklej kod `println("Hello, world!")` w polu po lewej stronie.
3. Naciśnij przycisk "Run". W panelu po prawej stronie pojawi się wynik działania programu.

Jest to prosta i niewymagająca żadnej instalacji metoda do eksperymentowania z kodem w Scali.

Wiele przykładów kodu w tym przewodniku jest również zintegrowana ze ScalaFiddle,
dzięki czemu można je wypróbować wciskając po prostu przycisk "Run".

## Wyrażenia

Wyrażenia są rezultatem ewaluacji fragmentów kodu.

```scala mdoc
1 + 1
```

Wyniki wyrażeń można wyświetlić za pomocą funkcji `println`.

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Wartości

Rezultaty wyrażeń mogą zostać nazwane za pomocą słowa kluczowego `val`.

```scala mdoc
val x = 1 + 1
println(x) // 2
```

Nazwane wyniki, tak jak `x` w ww. przykładzie, to wartości.
Odniesienie się do wartości nie powoduje jej ponownego obliczenia.

Wartości nie można przypisać ponownie.

```scala mdoc:fail
x = 3 // Nie kompiluje się.
```

Typy wartości mogą być wywnioskowane przez kompilator, ale można również wyraźnie określić type:

```scala mdoc:nest
val x: Int = 1 + 1
```

Zauważ, że deklaracja `Int` pojawia po identyfikatorze `x`, potrzebny jest rówmież dwukropek `:`.

### Zmienne

Zmienne są podobne do wartości, ale z tym wyjątkiem, że można je ponownie przypisywać.
Zmienną można zdefiniować używając słowa kluczowego `var`.

{% scalafiddle %}
```scala mdoc:nest
var x = 1 + 1
x = 3 // Kompiluje się, ponieważ "x" jest zdefiniowane z użyciem "var".
println(x * x) // 9
```
{% endscalafiddle %}

Tak jak przy wartościach, można wyraźnie zdefiniować żądany typ:

```scala mdoc:nest
var x: Int = 1 + 1
```

## Wyrażenia blokowe

Wyrażenia mogą być łączone poprzez zamknięcie ich w nawiasie klamrowym`{}`.
Taką konstrukcję nazywamy blokiem.
Wynikiem całego bloku kodu jest wynik ostatniego wyrażenia w tym bloku.

{% scalafiddle %}
```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```
{% endscalafiddle %}

## Funkcje

Funkcje to wyrażenia, które przyjmują pewne parametry.

Poniżej zdefiniowana jest funkcja anonimowa (nieposiadająca nazwy), która zwraca liczbę całkowitą przekazaną jako parametr, zwiększoną o 1.

```scala mdoc
(x: Int) => x + 1
```

Po lewej stronie od `=>` znajduje się lista parametrów.
Po prawej stronie - wyrażenie wykorzystujące te parametry.

Funkcje można również nazywać.

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Funkcje mogą przyjmować wiele parametrów.

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Mogą też wcale nie mieć parametrow.

{% scalafiddle %}
```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```
{% endscalafiddle %}

## Metody

Metody wyglądają i zachowują się bardzo podobnie jak funkcje, jednak jest między nimi kilka kluczowych różnic.

Metody są definiowane z użyciem słowa kluczowego `def`.
Po `def` następuje nazwa metody, lista parametrów, zwracany typ i ciało metody.

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Zauważ, że zwracany typ jest zadeklarowany _po_ liście parametrów i dwukropku `: Int`.

Metody mogą mieć wiele list parametrów.

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

Mogą również wcale ich nie posiadać.

{% scalafiddle %}
```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
{% endscalafiddle %}

Od funkcji odróżnia je jeszcze kilka innych rzeczy, ale na razie możesz o nich myśleć jak o bardzo podobnych do funkcji.

Metody mogą zawierać również wyrażenia wielowierszowe.

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

Ostatnie wyrażenie w ciele metody jest wartością, jaką zwraca cała metoda.
Scala posiada słowo kluczowe `return`, ale jest ono wykorzystywane bardzo rzadko.

## Klasy

Klasy są definiowane za pomocą słowa kluczowego `class`, po którym następuje nazwa klasy i parametry konstruktora.

{% scalafiddle %}
```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

Metoda `greet` zwraca typ `Unit` - oznacza to, że nie ma nic znaczącego do zwrócenia.
`Unit` jest używany podobnie jak `void` w językach Java i C.
Różnica polega na tym, że w Scali każde wyrażenie musi zwracać jakąś wartosć, tak naprawdę istnieje [obiekt singleton](singleton-objects.html) typu `Unit` - nie niesie on ze sobą żadnej znaczącej informacji.

Nowe instancje klasy tworzy się za pomocą słowa kluczowego `new`.

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endscalafiddle %}

Klasy zostaną szerzej omówione w [dalszej części](classes.html) tego przewodnika.

## Klasy przypadku (case classes)

W Scali istnieje spacjalny typ klasy - klasa "przypadku" (case class).
Klasy przypadku są domyślnie niezmienne i porównywane przez wartości.
Klasy te można definiować używająć słów kluczowych `case class`.

{% scalafiddle %}
```scala mdoc
case class Point(x: Int, y: Int)
```

Do utworzenia nowej instacji klasy przypadku nie jest konieczne używanie słowa kluczowego `new`.

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Są one porównywane przez wartości - _nie_ przez referencje.

```scala mdoc
if (point == anotherPoint) {
  println(point + " i " + anotherPoint + " są jednakowe.")
} else {
  println(point + " i " + anotherPoint + " są inne.")
} // Point(1,2) i Point(1,2) są jednakowe.

if (point == yetAnotherPoint) {
  println(point + " i " + yetAnotherPoint + " są jednakowe.")
} else {
  println(point + " i " + yetAnotherPoint + " są inne.")
} // Point(1,2) i Point(2,2) są inne.
```
{% endscalafiddle %}

Klasy przypadków to dużo szerszy temat, do zapoznania z którym bardzo zachęcamy. Jesteśmy pewni, że Ci się spodoba!
Jest on dokładnie omówiony w [późniejszym rozdziale](case-classes.html).

## Obiekty

Obiekty to pojedyncze wystąpienia ich definicji.
Można o nich myśleć jak o instancjach ich własnych klas - singletonach.

Objekty definiuje się z użyciem słowa kluczowego `object`.

{% scalafiddle %}
```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Aby uzyskać dostęp do obiektu używa się jego nazwy.

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```
{% endscalafiddle %}

Obiekty zostaną szerzej omówione [później](singleton-objects.html).

## Cechy (traits)

Cechy to typy zawierające pewne pola i metody.
Wiele cech może być łączonych.

Cechę (trait) można zdefiniować używając słowa kluczowego `trait`.

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

Cechy mogą zawierać domyślną implementację.

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Cechy można rozszerzać używając słowa kluczowego `extends` i nadpisać implementację z użyciem `override`.

```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

W tym przykładzie `DefaultGreeter` rozszerza tylko jedną cechę (trait), ale równie dobrze może rozszerzać ich wiele.

Cechy zostały dokładniej opisane w jednym z [kolejnych](traits.html) rozdziałów.

## Metoda Main

Metoda `main` to punkt wejścia do programu.
Maszyna Wirtalna Javy (Java Virtual Machine / JVM) wymaga, aby metoda ta nazywała się "main" i posiadała jeden arguemnt - tablicę ciągów znaków.

Z użyciem obiektu można zdefiniować metodę `main` w następujący sposób:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
