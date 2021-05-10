---
layout: tour
title: Generičke klase
language: ba
partof: scala-tour

num: 18
next-page: variances
previous-page: for-comprehensions
assumed-knowledge: classes unified-types

---

Generičke klase su klase koje primaju tipove kao parametre.
Vrlo su korisne za implementiranje kolekcija.

## Definisanje generičke klase

Generičke klase primaju tip kao parametar u uglastim zagradama `[]`. 
Konvencija je da se koristi slovo `A` kao identifikator tipa, mada se može koristiti bilo koje ime.

```scala mdoc
class Stack[A] {
  private var elements: List[A] = Nil
  def push(x: A): Unit =
    elements = x :: elements
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```

Ova implementacija `Stack` klase prima bilo koji tip `A` kao parametar. 
Ovo znači da unutarnja lista, `var elements: List[A] = Nil`, može čuvati samo elemente tipa `A`. 
Metoda `def push` prima samo objekte tipa `A` (napomena: `elements = x :: elements` dodjeljuje varijabli `elements` novu listu kreiranu dodavanjem `x` na trenutne `elements`).

## Korištenje

Da bi koristili generičku klasu, stavite tip u uglaste zagrade umjesto `A`.
```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop)  // prints 2
println(stack.pop)  // prints 1
```
Instanca `stack` može čuvati samo Int-ove. Međutim, ako tipski argument ima podtipove, oni mogu biti proslijeđeni:
```
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = new Stack[Fruit]
val apple = new Apple
val banana = new Banana

stack.push(apple)
stack.push(banana)
```
Klasa `Apple` i `Banana` obje nasljeđuju `Fruit` tako da možemo stavljati instance `apple` i `banana` na stek za `Fruit`.

_Napomena: nasljeđivanje generičkih tipova je *invarijantno*.
Ovo znači da ako imamo stek karaktera, koji ima tip `Stack[Char]` onda on ne može biti korišten kao stek cijelih brojeva tipa `Stack[Int]`.
Ovo bi bilo netačno (unsound) jer bi onda mogli stavljati i integere na stek karaktera.
Zaključimo, `Stack[A]` je podtip `Stack[B]` ako i samo ako je `A = B`.
Pošto ovo može biti prilično ograničavajuće, Scala ima i [anotacije tipskih parametara](variances.html) za kontrolisanje ponašanja podtipova generičkih tipova._
