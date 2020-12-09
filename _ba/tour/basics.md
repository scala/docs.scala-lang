---
layout: tour
title: Osnove
language: ba
partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala

---

Na ovoj stranici ćemo objasniti osnove Scale.

## Probavanje Scale u browseru

Scalu možete probati u Vašem browser sa ScalaFiddle aplikacijom.

1. Idite na [https://scalafiddle.io](https://scalafiddle.io).
2. Zalijepite `println("Hello, world!")` u lijevi panel.
3. Kliknite "Run" dugme. Izlaz će se pojaviti u desnom panelu.

Ovo je jednostavan način za eksperimentisanje sa Scala kodom.

## Izrazi (en. expressions)

Izrazi su izjave koje imaju vrijednost.
```
1 + 1
```
Rezultate izraza možete prikazati pomoću `println`.

```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```

### Vrijednosti

Rezultatima možete dodijeliti naziv pomoću ključne riječi `val`.

```scala mdoc
val x = 1 + 1
println(x) // 2
```

Imenovani rezultati, kao `x` ovdje, nazivaju se vrijednostima. 
Referenciranje vrijednosti ne okida njeno ponovno izračunavanje.

Vrijednosti se ne mogu mijenjati.

```scala mdoc:fail
x = 3 // Ovo se ne kompajlira.
```

Tipovi vrijednosti mogu biti (automatski) zaključeni, ali možete i eksplicitno navesti tip:

```scala mdoc:nest
val x: Int = 1 + 1
```

Primijetite da deklaracija tipa `Int` dolazi nakon identifikatora `x`. Također morate dodati i `:`.  

### Varijable

Varijable su kao vrijednosti, osim što ih možete promijeniti. Varijable se definišu ključnom riječju `var`.

```scala mdoc:nest
var x = 1 + 1
x = 3 // Ovo se kompajlira jer je "x" deklarisano s "var" ključnom riječju.
println(x * x) // 9
```

Kao i s vrijednostima, tip možete eksplicitno navesti ako želite:

```scala mdoc:nest
var x: Int = 1 + 1
```


## Blokovi

Izraze možete kombinovati okružujući ih s `{}`. Ovo se naziva blok.

Rezultat zadnjeg izraza u bloku je rezultat cijelog bloka, također.

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Funkcije

Funkcije su izrazi koji primaju parametre.

Možete definisati anonimnu funkciju (bez imena) koja vraća cijeli broj plus jedan:

```scala mdoc
(x: Int) => x + 1
```

Na lijevoj strani `=>` je lista parametara. Na desnoj strani je izraz koji koristi date parametre.

Funkcije možete i imenovati.

```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```

Funkcije mogu imati više parametara.

```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```

Ili bez parametara.

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Metode

Metode izgledaju i ponašaju se vrlo slično funkcijama, ali postoji nekoliko razlika između njih.

Metode se definišu ključnom riječju `def`.  Nakon `def` slijedi naziv, lista parametara, povratni tip, i tijelo.

```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```

Primijetite da je povratni tip deklarisan _nakon_ liste parametara i dvotačke `: Int`.

Metode mogu imati više listi parametara.

```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```

Ili bez listi parametara ikako.

```scala mdoc
def name: String = System.getProperty("name")
println("Hello, " + name + "!")
```

Postoje i neke druge razlike, ali zasad, možete misliti o njima kao nečemu sličnom funkcijama.

Metode mogu imati višelinijske izraze također.

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

Zadnjo izraz u tijelu metode je povratna vrijednost metode. (Scala ima ključnu riječ `return`, ali se rijetko koristi.)

## Klase

Klasu možete definisati ključnom riječju `class` praćenom imenom i parametrima konstruktora.

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
Povratni tip metode `greet` je `Unit`, koji kaže da metoda ne vraća ništa značajno. 
Koristi se slično kao `void` u Javi ili C-u. 
(Razlika je u tome što svaki Scalin izraz mora imati neku vrijednost, postoji singlton vrijednost tipa `Unit`, piše se `()`. 
Ne prenosi nikakvu korisnu informaciju.)

Instancu klase možete kreirati pomoću ključne riječi `new`.

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Detaljniji pregled klasa biće dat [kasnije](classes.html).

## Case klase

Scala ima poseban tip klase koji se zove "case" klasa.  
Po defaultu, case klase su nepromjenjive i porede se po vrijednosti. Možete ih definisati s `case class` ključnim riječima.

```scala mdoc
case class Point(x: Int, y: Int)
```

Instancu case klase možete kreirati i bez ključne riječi `new`.

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

I porede se po vrijednosti.

```scala mdoc
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) i Point(1,2) su iste.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) su Point(2,2) različite.
```

Ima još mnogo stvari vezanih za case klase koje bismo voljeli objasniti, i ubijeđeni smo da ćete se zaljubiti u njih! 0
Objasnićemo ih u dubinu [kasnije](case-classes.html).

## Objekti


Objekti su jedine instance svojih definicija. Možete misliti o njima kao singltonima svoje vlastite klase.
Objekte možete definisati ključnom riječju `object`.

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Objektima možete pristupati referenciranjem njihovog imena.

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Objekti će biti objašnjeni u dubinu [kasnije](singleton-objects.html).

## Trejtovi

Trejtovi su tipovi koji sadrže polja i metode.  Više trejtova se može kombinovati.

Definišu se pomoću `trait` ključne riječi.

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

Metode trejtova mogu imati defaultnu implementaciju.

```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Možete naslijediti trejtove s `extends` ključnom riječi i redefinisati (override) implementacije s `override` ključnom riječi.

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

Ovdje, `DefaultGreeter` nasljeđuje samo jedan trejt, ali može naslijediti više njih.

Trejtove ćemo pokriti u dubinu [kasnije](traits.html).

## Glavna metoda

Glavna metoda je ulazna tačka programa.  
Java Virtuelna Mašina traži da se glavna metoda zove `main` i da prima jedan argument, niz stringova.

Koristeći objekt, možete definisati glavnu metodu ovako:

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
