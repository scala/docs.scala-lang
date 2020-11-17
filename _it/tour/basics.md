---
layout: tour
title: Basics
partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)


In questa pagina tratteremo le basi di Scala.

## Provare Scala nel browser

È possibile eseguire Scala nel proprio browser con _ScalaFiddle_. Questo è un metodo facile e che non richiede alcun setup
per testare il proprio codice Scala:

1. Andare all'indirizzo [https://scalafiddle.io](https://scalafiddle.io).
2. Incolla `println("Hello, world!")` nella sezione di sinistra.
3. Clicca __Run__. L'output apparirà nella sezione di destra.

_ScalaFiddle_ è integrato direttamente con alcuni degli esempi di codice di questa documentazione; se vedi il pulsante __RUN__ in uno degli esempi seguenti, cliccalo per testare direttamente il codice.

## Espressioni

Le espressioni sono degli enunciati calcolabili:
```
1 + 1
```
Puoi far mostrare il risultato delle espressioni usando `println`:

{% scalafiddle %}
```tut
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Valori

Puoi dare un nome ai risultati delle espressioni usando la parola chiave `val`:

```tut
val x = 1 + 1
println(x) // 2
```

I risultati a cui è stato attribuito un nome, come `x` nell'esempio sopra, sono chiamati valori.
Richiamare un valore già definito non aziona il suo ricalcolo.

I valori non possono essere riassegnati:

```tut:fail
x = 3 // Questo non può essere compilato.
```

Il tipo di un valore può essere omesso e [inferito](https://docs.scala-lang.org/tour/type-inference.html), oppure
può essere dichiarato esplicitamente:

```tut
val x: Int = 1 + 1
```

Da notare che la dichiarazione del tipo `Int` viene dopo l'identificativo `x` e dopo `:`.

### Variabili

Le variabili sono simili ai valori, ma a differenza di questi ultimi li puoi riassegnare. Puoi definire una variabile con
la parola chiave `var`.

```tut
var x = 1 + 1
x = 3 // Questo compila perchè "x" è stato dichiarato con la parola chiave "var".
println(x * x) // 9
```

Come per i valori, il tipo di una variabile può essere omesso e [inferito](https://docs.scala-lang.org/tour/type-inference.html), oppure può essere dichiarato esplicitamente:

```tut
var x: Int = 1 + 1
```

## Blocchi di codice

Puoi combinare espressioni inserendole tra `{}`. Chiamiamo questo un blocco (di codice).

Il risultato dell'ultima espressione nel blocco sarà anche il risultato dell'intero blocco:

```tut
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Funzioni

Le funzioni sono espressioni che hanno parametri e prendono argomenti in input.

Puoi definire una funzione anonima (ossia una funzione che non ha un nome) che restituisce un determinato intero più uno:

```tut
(x: Int) => x + 1
```

A sinistra di `=>` c'è una lista di parametri. Sulla destra è presente un'espressione che coinvolge questi parametri.

Puoi anche dare un nome alle funzioni:

{% scalafiddle %}
```tut
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Una funzione può avere parametri multipli:

{% scalafiddle %}
```tut
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

O anche non averne affatto:

```tut
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Metodi

I metodi appaiono simili alla funzioni per aspetto e funzionalità, ma ci sono alcune differenze importanti.

I metodi sono definiti con la parola chiave `def`. `def` è seguita da un nome, un parametro o una lista di parametri, il tipo di ritorno del metodo, e il suo corpo:

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Da notare come il tipo di ritorno `Int` sia dichiarato _dopo_ l'elenco dei parametri da passare in input, e dopo un `:`.

Un metodo può avere più liste di parametri:

{% scalafiddle %}
```tut
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

Oppure nulla:

```tut
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

Ci sono altre differenze, ma per ora puoi pensare ai metodi come qualcosa di simile alle funzioni.

Anche i metodi possono avere espressioni su più righe (un blocco di codice):

{% scalafiddle %}
```tut
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

L'ultima espressione nel corpo del metodo sarà il valore di ritorno di quest'ultimo. (Scala possiede tuttavia la parola chiave `return`, ma è raramente usata.)

## Classi

Puoi definire delle classi con la parola chiave `class`, seguita dal suo nome e dai parametri del costruttore:

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

Il tipo di ritorno del metodo `greet` è `Unit`, stante a significare che non c'è nulla di interessante da restituire.
È usato in maniera quasi uguale al `void` di Java e C. (Una differenza è che, poichè un'espressione in Scala deve avere un qualche valore, in realtà c'è un valore singleton di tipo Unit, indicato come `()`, ma non fornisce alcuna informazione.)

Puoi instanziare una classe con la parola chiave `new`:

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
Tratteremo le classi più in dettaglio in [seguito](classes.html).

## Classi case (case classes)

Scala possiede un tipo speciale di classe chiamata classe "case". Di default, un'istanza di una classe case è immutabile, e sono comparate in base al valore (a differenza delle classi normali, le cui istanze sono comprate in base ai loro riferimenti in memoria). Questo le rende molto utili nel [pattern matching](https://docs.scala-lang.org/tour/pattern-matching.html#matching-on-case-classes).

Puoi definire le classi case con le parole chiave `case class`:

```tut
case class Point(x: Int, y: Int)
```

Puoi instanziare le classi case _senza_ la parola chiave `new`:

```tut
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Le istanze di classi case sono confrontate usando il valore, e non il riferimento in memoria:

```tut
if (point == anotherPoint) {
  println(point + " e " + anotherPoint + " sono uguali.")
} else {
  println(point + " e " + anotherPoint + " sono differenti.")
} // Point(1,2) e Point(1,2) sono uguali.

if (point == yetAnotherPoint) {
  println(point + " e " + yetAnotherPoint + " sono uguali.")
} else {
  println(point + " e " + yetAnotherPoint + " sono differenti.")
} // Point(1,2) e Point(2,2) sono differenti.
```

C'è molto di più riguardo alle classi case, e siamo convinti che finirai per amarle!
Verranno esaminate più nel dettaglio in [seguito](case-classes.html).

## Oggetti (Objects)

Gli oggetti sono delle singole istanze: come se fossero delle singole istanze di classi aventi lo stesso nome.

Puoi definire gli oggetti con la parola chiave `object`:

```tut
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Puoi accedere ad un oggetto facendo riferimento al suo nome:

```tut
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Tratteremo gli oggetti più in dettaglio in [seguito](singleton-objects.html).

## Tratti

I tratti sono dei tipi astratti di dati contenenti determinati campi e metodi. Secondo le regole di ereditarietà di Scala, una classe può estendere solo *una* classe, ma può estendere più tratti.

Puoi definire i tratti con la parola chiave `trait`:

```tut
trait Greeter {
  def greet(name: String): Unit
}
```

I tratti possono anche avere implementazioni di default:

{% scalafiddle %}
```tut
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Puoi estendere i tratti con la parola chiave `extends` e sovrascrivere (override) un'implementazione con la parola chiave `override`:

```tut
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

Nell'esempio sopra, `DefaultGreeter` estende un singolo tratto, ma avrebbe potuto estenderne un numero maggiore.

Esamineremo i tratti in dettaglio in [seguito](traits.html).

## Il metodo principale (metodo main)

Il metodo principale è il punto di ingresso di un programma Scala. La Macchina Virtuale Java (Java Virtual Machine) necessita di un particolare metodo principale, chiamato `main`, che prende un argomento: un array di stringhe.

Usando un oggetto, puoi definire il metodo principale come segue:

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```

## Altre risorse

* [Scala book](/overviews/scala-book/prelude-taste-of-scala.html) per una trattazione generale.
