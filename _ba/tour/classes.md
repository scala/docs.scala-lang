---
layout: tour
title: Klase
language: ba
partof: scala-tour

num: 4
next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures

---

Klase u Scali su šabloni za kreiranje objekata.
Mogu sadržavati metode, vrijednosti, varijable, tipove, objekte, trejtove i klase koji se kolektivno zovu _članovi_. 
Tipovi, objekti i trejtovi biće pokriveni kasnije.

## Definisanje klase
Minimalna definicija klase sastoji se od riječi `class` i identifikatora. Imena klasa bi trebala počinjati velikim slovom.
```scala mdoc
class User

val user1 = new User
```
Ključna riječ `new` koristi se za kreiranje instance klase. 
`User` ima podrazumijevani konstruktor bez argumenata jer nijedan konstruktor nije definisan. 
Međutim, često ćete imati konstruktor i tijelo klase.
Slijedi definicija klase `Point` (en. tačka):

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
println(point1)  // prints (x, y)
```

Ova klasa ima četiri člana: varijable `x` i `y`, i metode `move` i `toString`. 
Za razliku od većine ostalih jezika, primarni konstruktor je sadržan u potpisu klase `(var x: Int, var y: Int)`. 
Metoda `move` prima dva cjelobrojna argumenta i vraća `Unit` vrijednost, `()`. 
Ovo otprilike odgovara `void`-u u jezicima sličnim Javi. 
`toString`, za razliku, ne prima nikakve parametre ali vraća `String` vrijednost.
Pošto `toString` prebrisava metodu `toString` iz [`AnyRef`](unified-types.html), mora biti tagovana s `override`.

## Konstruktori

Konstruktori mogu imati opcione parametre koristeći podrazumijevane vrijednosti:

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x and y are both set to 0
val point1 = new Point(1)
println(point1.x)  // prints 1

```

U ovoj verziji klase `Point`, `x` i `y` imaju podrazumijevanu vrijednost `0` tako da ne morate proslijediti argumente.
Međutim, pošto se argumenti konstruktora čitaju s lijeva na desno, ako želite proslijediti samo `y` vrijednost, morate imenovati parametar.
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // prints 2
```

Ovo je također dobra praksa zbog poboljšanja čitljivosti.

## Privatni članovi i sintaksa getera/setera
Članovi su javni (`public`) po defaultu. 
Koristite `private` modifikator pristupa da sakrijete članove klase.
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

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // prints the warning
```
U ovoj verziji klase `Point`, podaci su spremljeni u privatnim varijablama `_x` i `_y`. 
Metode `def x` i `def y` se koriste za njihov pristup. 
`def x_=` i `def y_=` se koriste za validaciju i postavljanje vrijednosti `_x` i `_y`. 
Primijetite specijalnu sintaksu za setere: metoda ima `_=` nadodano na identifikator getera a parametri dolaze poslije.

Parametri primarnog konstruktora s `val` i `var` su javni. 
Međutim, pošto su `val` nepromjenjivi, ne možete napisati sljedeće.
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- does not compile
```

Parametri bez `val` ili `var` su privatne vrijednosti, vidljive samo unutar klase.
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- does not compile
```
