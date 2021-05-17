---
layout: tour
title: Klasy
partof: scala-tour

num: 4
language: pl
next-page: default-parameter-values
previous-page: unified-types
---

Klasy w Scali są wzorcami do tworzenia obiektów.
Klasy mogą zawierać metody, wartości, zmienne, typy, obiekty, cechy i klasy; wszystkie one są nazywane składnikami klasy (_class members_).
Typy, obiekty i cechy zostaną omówione w dalszej części przewodnika.

## Definiowanie klasy

Minimalna definicja klasy składa się ze słowa kluczowego `class` oraz jej identyfikatora.
Nazwy klas powinny zaczynać się z wielkiej litery.

```scala mdoc
class User

val user1 = new User
```

Do tworzenia nowych instancji klasy służy słowo kluczowe `new`.
Ponieważ żaden konstruktor nie został zdefiniowany, klasa `User` posiada konstruktor domyślny, który nie przyjmuje żadnych parametrów.
Zazwyczaj jednak definiujemy konstruktor i ciało klasy.
Poniższy przykład przedstawia definicję klasy służącej do reprezentowania punktu.

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // wyświetla (2, 3)
```

Klasa `Point` ma cztery składniki: zmienne `x` i `y` oraz metody `move` i `toString`.
W przeciwieństwie do innych języków programowania, główny konstruktor zawiera się w sygnaturze klasy: `(var x: Int, var y: Int)`.
Metoda `move` przyjmuje jako parametry dwie liczby całkowite i zwraca wartość `()` typu `Unit`, która nie niesie ze sobą żadnych informacji.
Odpowiada to słowu kluczowemu `void` w językach Java - podobnych.
Metoda `toString` nie przyjmuje żadnych parametrów, ale zwraca wartość typu `String`.
Ponieważ `toString` nadpisuje metodę `toString` zdefiniowaną w  [`AnyRef`](unified-types.html), jest ona dodatkowo oznaczona słowem kluczowym `override`.

## Konstruktory

Konstruktory mogą zawierać parametry opcjonalne - wystarczy dostarczyć wartość domyślną dla takiego parametru.

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x i y są mają wartość 0
val point1 = new Point(1)
println(point1.x)  // wyświetla 1

```

W tej wersji klasy `Point`, `x` oraz `y` mają domyślną wartość `0` - dlatego nie jest wymagane przekazanie żadnych parametrów.
Jednak z powodu tego, że konstruktor jest ewaluowany od lewej do prawej strony, jeżeli chcesz przekazać parametr tylko do argumentu `y`, musisz określić nazwę tego parametru.

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y = 2)
println(point2.y)  // wyświetla 2
```

Jest to również dobra praktyka, która zwiększa przejrzystość kodu.

## Prywatne składniki oraz składnia getterów i setterów

Domyślnie wszystkie składniki klasy są publiczne.
Aby ukryć je przed zewnętrznymi klientami (wszystkim co jest poza daną klasą), należy użyć słowa kluczowego `private`.

```scala mdoc:nest
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("UWAGA: wartość poza przedziałem")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // wyświetla ostrzeżenie
```

W powyższym przykładnie klasy `Point` dane przechowywane są w prywatnych zmiennych `_x` i `_y`.
Publiczne metody `def x` i `def y` istnieją w celu uzyskania dostępu do prywatnych danych - są to gettery.
Metody `def x_=` i `def y_=` (settery) służą do walidacji oraz ustawiania wartości zmiennych `_x` i `_y`.
Zwróć uwagę na specyficzną składnię dla setterów: posiadają one `_=` dołączone do nazwy, dopiero w dalszej kolejności zdefiniowane są ich parametry.

Parametry głównego konstruktora oznaczone przez `val` i `var` są publiczne.
Ponieważ `val` jest niezmienne, poniższy kod nie jest prawidłowy

```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- nie kompiluje się
```

Parametry konstruktora __nie__ zawierające `val` lub `var` są prywatne - widoczne jedynie we wnętrzu klasy.

```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- nie kompiluje się
```
