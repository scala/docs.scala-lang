---
layout: tour
title: Varijanse
language: ba
partof: scala-tour

num: 19
next-page: upper-type-bounds
previous-page: generic-classes

---

Varijansa je korelacija podtipskih veza kompleksnih tipova i podtipskih veza njihovih tipova komponenti. 
Scala podržava anotacije varijanse tipskih parametara [generičkih klasa](generic-classes.html), dozvoljavajući im da budu kovarijantni, kontravarijantni, ili invarijantni ako se anotacije ne koriste. 
Korištenje varijanse u sistemu tipova dozvoljava pravljenje intuitivnijih veza među kompleksnim tipovima, a nedostatak varijanse može ograničiti ponovno iskorištenje klasne apstrakcije.

```scala mdoc
class Foo[+A] // kovarijantna klasa
class Bar[-A] // kontravarijantna klasa
class Baz[A]  // invarijantna klasa
```

### Kovarijansa

Tipski parametar `A` generičke klase može se učiniti kovarijantnim koristeći anotaciju `+A`. 
Za neku klasu `List[+A]`, praveći `A` kovarijantnim implicira da za dva tipa `A` i `B` gdje je `A` podtip od `B`, onda je `List[A]` podtip od `List[B]`. 
Ovo dozvoljava pravljenje vrlo intuitivnih podtipskih veza koristeći generiku.

Razmotrite sljedeću strukturu klasa:

```scala mdoc
abstract class Animal {
  def name: String
}
case class Cat(name: String) extends Animal
case class Dog(name: String) extends Animal
```

Oboje `Cat` i `Dog` su podtipovi od `Animal`. 
Scalina standardna biblioteka sadrži generičk nepromjenjivu `sealed abstract class List[+A]` klasu, gdje je tipski parametar `A` kovarijantan.
Ovo znači da je `List[Cat]` također i `List[Animal]`, a `List[Dog]` je isto `List[Animal]`. 
Intuitivno, ima smisla da su lista mačaka i lista pasa također liste životinja, i trebalo bi da možete zamijeniti bilo koju od njih za `List[Animal]`.

U sljedećem primjeru, metoda `printAnimalNames` prima listu životinja kao argument i ispisuje njihova imena, svako na idućoj liniji. 
Da `List[A]` nije kovarijantna, zadnja dva poziva metode se ne bi kompajlirali, što bi značajno ograničilo korisnost `printAnimalNames` metode.

```scala mdoc
object CovarianceTest extends App {
  def printAnimalNames(animals: List[Animal]): Unit = {
    animals.foreach { animal =>
      println(animal.name)
    }
  }

  val cats: List[Cat] = List(Cat("Whiskers"), Cat("Tom"))
  val dogs: List[Dog] = List(Dog("Fido"), Dog("Rex"))

  printAnimalNames(cats)
  // Whiskers
  // Tom

  printAnimalNames(dogs)
  // Fido
  // Rex
}
```

### Kontravarijansa

Tipski parametar `A` generičke klase može se učiniti kontravarijantnim koristeći anotaciju `-A`. 
Ovo kreira podtipsku vezu između klase i njenih tipskih parametara koja je suprotna od kovarijanse.
To jest, za neku `class Writer[-A]`, kontravarijantno `A` znači da za dva tipa `A` i `B` gdje je `A` podtip `B`, `Writer[B]` je podtip `Writer[A]`.

Razmotrimo `Cat`, `Dog`, i `Animal` klase u sljedećem primjeru:

```scala mdoc
abstract class Printer[-A] {
  def print(value: A): Unit
}
```

`Printer[A]` je jednostavna klasa koja zna ispisati neki tip `A`. Definišimo neke podklase za specifične tipove:

```scala mdoc
class AnimalPrinter extends Printer[Animal] {
  def print(animal: Animal): Unit =
    println("The animal's name is: " + animal.name)
}

class CatPrinter extends Printer[Cat] {
  def print(cat: Cat): Unit =
    println("The cat's name is: " + cat.name)
}
```

Ako `Printer[Cat]` zna kako da ispiše bilo koju `Cat`, a `Printer[Animal]` zna kako da ispiše bilo koju `Animal`, 
ima smisla da `Printer[Animal]` također zna ispisati `Cat`. 
Inverzna veza ne vrijedi, jer `Printer[Cat]` ne zna kako da ispiše bilo koju `Animal`. 
Stoga, terbali bismo moći zamijeniti `Printer[Animal]` za `Printer[Cat]`, ako želimo, i praveći `Printer[A]` kontravarijantnim nam to dozvoljava.


```scala mdoc
object ContravarianceTest extends App {
  val myCat: Cat = Cat("Boots")

  def printMyCat(printer: Printer[Cat]): Unit = {
    printer.print(myCat)
  }

  val catPrinter: Printer[Cat] = new CatPrinter
  val animalPrinter: Printer[Animal] = new AnimalPrinter

  printMyCat(catPrinter)
  printMyCat(animalPrinter)
}
```

Izlaz programa biće:

```
The cat's name is: Boots
The animal's name is: Boots
```

### Invarijansa

Generičke klase u Scali su invarijantne po defaultu. 
Ovo znač da nisu ni kovarijantne ni kontravarijantne. 
U kontekstu sljedećeg primjera, `Container` klasa je invarijantna. 
`Container[Cat]` _nije_ `Container[Animal]`, niti obrnuto.

```scala mdoc
class Container[A](value: A) {
  private var _value: A = value
  def getValue: A = _value
  def setValue(value: A): Unit = {
    _value = value
  }
}
```

Čini se prirodnim da bi `Container[Cat]` trebao biti također `Container[Animal]`, ali dozvoljavanjem promjenjivoj generičkoj klasi da bude kovarijantna ne bi bilo sigurno. 
U ovom primjeru, vrlo važno je da je `Container` invarijantan. 
Pretpostavimo da je `Container` kovarijantan, nešto slično bi se moglo desiti:

```
val catContainer: Container[Cat] = new Container(Cat("Felix"))
val animalContainer: Container[Animal] = catContainer
animalContainer.setValue(Dog("Spot"))
val cat: Cat = catContainer.getValue // Ups, završili smo dodjeljivanjem Dog u Cat
```

Srećom, kompajler nas sprečava davno prije nego dođemo do ovoga.

### Drugi primjeri

Još jedan primjer koji može pomoći za shvatanje varijanse je `trait Function1[-T, +R]` iz Scaline standardne biblioteke. 
`Function1` predstavlja funkciju s jednim argumentom, gdje prvi tipski parametar `T` predstavlja tip argument, 
a drugi parametar `R` predstavlja povratni tip. 
`Function1` je kontravarijantna u tipu argumenta, i kovarijantna u povratnom tipu.
Za ovaj primjer koristićemo literal notaciju `A => B` za predstavljanje `Function1[A, B]`.

Pretpostavimo da imamo sličnu hijerarhiju klasa `Cat`, `Dog`, `Animal` otprije, plus sljedeće:

```scala mdoc
class SmallAnimal
class Mouse extends SmallAnimal
```

Recimo da radimo sa funkcijama koje primaju tipove životinja, i vraćaju tipove hrane koju jedu.
Ako bismo htjeli funkciju `Cat => SmallAnimal` (jer mačke jedu male životinje), ali nam je data `Animal => Mouse` funkcija, 
naš program će i dalje raditi. 
Intuitivno `Animal => Mouse` će i dalje prihvatiti `Cat` kao argument, jer `Cat` jeste `Animal`, i vraća `Mouse`, koji je također `SmallAnimal`. 
Pošto sigurno i nevidljivo možemo zamijeniti prvo drugim, možemo reći da je `Animal => Mouse` podtip `Cat => SmallAnimal`.

### Uporedba s drugim jezicima

Varijansa je podržana na različite načine u nekim drugim jezicima sličnim Scali.
Npr, anotacije varijanse u Scali podsjećaju na one u C#, gdje se anotacije dodaju pri deklaraciji klasne apstrakcije (varijansa na strani deklaracije). 
U Javi, međutim, anotacije varijanse daju korisnici kada se klasna apstrakcija koristi (varijansa na strani korisnika).
