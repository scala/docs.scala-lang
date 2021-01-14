---
layout: tour
title: For Comprehensions
partof: scala-tour

num: 18
language: pl
next-page: generic-classes
previous-page: extractor-objects
---

Trudno znaleźć dobre tłumaczenie _for comprehensions_ w języku polskim, dlatego stosujemy wersję angielską. 

Scala oferuje prostą w zapisie formę wyrażania _sequence comprehensions._
_For comprehensions_ przedstawione jest w formie `for (enumerators) yield e`, gdzie `enumerators` to lista enumeratorów oddzielonych średnikami. _Enumerator_ może być zarówno generatorem nowych wartości lub filtrem dla wartości przetwarzanych. Wyrażenie to definiuje ciało `e` dla każdej wartości wywołanej przez enumerator i zwraca te wartości w postaci sekwencji. 

Poniżej znajduje się przykład, który przekształca listę osób na listę imion osób, których wiek mieści się w przedziale od 30 do 40 lat.

```scala mdoc
case class Person(name: String, age: Int)

val people = List(
  Person("Monika", 25),
  Person("Czarek", 35),
  Person("Marcin", 26),
  Person("Filip", 25)
)

val names = for (
  person <- people if (person.age >=30 && person.age < 40)
) yield person.name  // czyli dodaj do listy wynikowej

names.foreach(name => println(name))  // wydrukowane zostanie: Czarek
```

Na początku `for` znajduje się generator `person <- people`. Następujące po tym wyrażenie warunkowe `if (person.age >=30 && person.age < 40)` odfiltrowuje wszystkie osoby poniżej 30 i powyżej 40 roku życia. W powyższym przykładzie po wyrażeniu `yield` wywołano `person.name`, `name` jest typu `String`, więc lista wynikowa będzie typu `List[String]`. W ten sposób lista typu `List[Person]` została przekształcona na listę `Lista[String]`.

Poniżej znajduje się bardziej złożony przykład, który używa dwóch generatorów. Jego zadaniem jest sprawdzenie wszystkich par liczb od `0` do `n-1` i wybór tylko tych par, których wartości są sobie równe.

```scala mdoc
def someTuple(n: Int) =
  for (
    i <- 0 until n;
    j <- 0 until n if i == j
  ) yield (i, j)

someTuple(10) foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // drukuje (0, 0) (1, 1) (2, 2) (3, 3) (4, 4) (5, 5) (6, 6) (7, 7) (8, 8) (9, 9)
}
```

Załóżmy, że wartością początkową jest `n == 10`. W pierwszej iteracji `i` przyjmuje wartość równą `0` tak samo jak `j`, filtr `i == j` zwróci `true` więc zostanie przekazane do `yield`. W kolejnej iteracji `j` przyjmie wartość równą `1`, więc `i == j` zwróci `false`, ponieważ `0 != 1` i nie zostanie przekazane do `yield`. Kolejne osiem iteracji to zwiększanie wartości `j` aż osiągnie wartość równą `9`. W następnej iteracji `j` powraca do wartości `0`, a `i` zostaje zwiększona o `1`. Gdyby w powyższym przykładzie nie umieszczono filtra `i == j` wydrukowana zostałaby prosta sekwencja:

```
(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 0) ...
```

Bardzo istotne jest to, że comprehensions nie są ograniczone do list. Każdy typ danych, który wspiera operację `withFilter`, `map` czy `flatMap` (z odpowiednim typem) może być użyty w _sequence comprehensions_.

Przykładem innego użycia _comprehensions_ jest jego wykorzystanie do obsługi typu `Option`.
Załóżmy, że mamy dwie wartości `Option[String]` i chcielibyśmy zwrócić obiekt `Student(imie: String, nazwisko: String` tylko gdy obie wartości są zadeklarowane - nie są `None`.

Spójrzmy poniżej:

```scala mdoc
case class Student(name: String, surname: String)

val nameOpt: Option[String] = Some("John")
val surnameOpt: Option[String] = Some("Casey")

val student = for {
    name <- nameOpt
    surname <- surnameOpt
  } yield Student(name, surname) // wynik będzie typu Option[Student].
```

Jeżeli `name` lub `surname` nie byłyby określone, np. przyjmowałyby wartość równą `None` to zmienna `student` również byłaby `None`. Powyższy przykład to przekształcenie dwóch wartości `Option[String]` na `Option[Student]`. 

Wszystkie powyższe przykłady posiadały wyrażenie `yield` na końcu _comprehensions_, jednak nie jest to obligatoryjne. Gdy `yield` nie zostanie dodanie zwrócony zostanie `Unit`. Takie rozwiązanie może być przydatne gdy chcemy uzyskać jakieś skutki uboczne. Poniższy przykład wypisuje liczby od 0 do 9 bez użycia `yield`.


```scala mdoc
def count(n: Int) =
    for (i <- 0 until n)
    println(s"$i ")

count(10) // wyświetli  "0 1 2 3 4 5 6 7 8 9 "
```

