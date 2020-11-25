---
layout: tour
title: Classes
partof: scala-tour

num: 4
next-page: default-parameter-values
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)

In Scala le classi sono dei modelli per creare oggetti. Possono contenere metodi, valori, variabili, tipi, oggetti, tratti e classi che sono chiamate _members_. Tipi, oggetti e tratti verranno trattati in dettaglio in altre pagine.

## Definire una classe
La classe più piccola che si può definire consiste semplicemente nella parola chiave `class` seguita dal nome che si vuole dare ad essa. Per convenzione i nomi delle classi hanno la prima lettera in maiuscolo.
```tut
class User

val user1 = new User
```
La parola chiave `new` è usata per creare un'istanza della classe. `User` ha un costruttore di default che non prende argomenti, dal momento che non è stato definito un costruttore dall'utente. Di solito però una classe possiede un costruttore e un corpo, pertanto di seguito viene fornito un esempio di definizione di una classe per un punto geometrico in 2D:

```tut
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
println(point1.x)  // 2
println(point1)  // prints (2, 3)
```

La classe `Point` ha quattro membri: le variabili `x` e `y`, e i metodi `move` e `toString`. A differenza di molti altri linguaggi di programmazioni, il costruttore primario è già presente al momento della definizione dei parametri richiesti per l'istanziamento della classe, ossia `(var x: Int, var y: Int)`. Il metodo `move` prende in input due interi e restituisce il valore `()` di tipo Unit, che non fornisce alcuna informazione utile. Unit può essere pensato come ad un equivalente di `void` nei linguaggi di tipo Java. `toString` invece non prende argomenti in input ma restituisce un valore di tipo `String`. Poichè il metodo `toString` qui definito va a sovrascrivere il metodo `toString` ereditato da [`AnyRef`](unified-types.html), viene segnato con la parola chiave `override`.

## Costruttori

I costruttori possono avere parametri opzionali, nel qual caso viene loro fornito un valore di default:

```tut
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // In questo caso x ed y avranno entrambi valore 0
val point1 = new Point(1)
println(point1.x)  // Ci verrà mostrato a schermo il valore 1

```

In questa versione della classe `Point`, `x` e `y` hanno un valore di default uguale a `0`, pertanto non sono necessari argomenti. Nel caso in cui si volesse fornire un valore solamente al membro `y` bisogna necessariamente indicare esplicitamente a quale membro si sta assegnando un valore; questo è dovuto al fatto che il costruttore legge gli argomenti da sinistra a destra.
```
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y = 2)
println(point2.y)  // Stamperà a schermo 2
```

Questa restrizione aiuta inoltre a migliorare la leggibilità del codice.

## Membri privati e sintassi per Getter/Setter
Di default i metodi sono pubblici, pertanto non serve anteporre `public`. Se si volesse renderli privati, è necessario anteporre `private` per renderli non accessibili fuori dalla classe in cui sono definiti.
```tut
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
In questa versione della classe `Point` le informazoni sono immagazzinate nelle variabili private `_x` e `_y`. Per accedere ai loro valori si possono usare i metodi `def x` e `def y`. I metodi `def x_=` e `def y_=` sono usati per verificare e impostare il valore di `_x` e `_y`. Si ponga attenzione alla sintassi usati per definire i metodi setter: il metodo ha `_=` aggiunto al nome del metodo getter, seguito dai parametri.

I parametri del costruttore primario indicati con `val` o `var` sono pubblici, ma essendo i valori `val` immutabili, non si potrà utilizzare il codice seguente:
```
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- Non potrà essere compilato
```

Parametri senza `val` o `var` saranno segnati automaticamente come privati, pertanto visibili solo all'interno della classe.
```
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- Non potrà essere compilato
```

## Altre risorse

* Maggiori informazioni sulle classi sono presenti nel [Libro di Scala](/overviews/scala-book/classes.html)
* Leggi il capitolo [Costruttori ausiliari](/overviews/scala-book/classes-aux-constructors.html) per avere più dettagli.
