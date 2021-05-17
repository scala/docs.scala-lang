---
layout: tour
title: Klasy przypadków
partof: scala-tour

num: 13
language: pl
next-page: pattern-matching
previous-page: multiple-parameter-lists
---

Scala wspiera mechanizm _klas przypadków_ (ang. case class).
Są one zwykłymi klasami z dodatkowymi założeniami, przez które przejdziemy.
Klasy przypadków idealnie nadają się do modelowania niezmiennych (niemutowalnych) danych.
W dalszych rozdziałach przyjrzymy się jak przydają się w [dopasowywaniu wzorców (ang. pattern matching)](pattern-matching.html).

## Definiowanie klas przypadków

Minimalna definicja klasy przypadku wymaga słów kluczowych `case class`, identyfikatora oraz listy parametrów (może być pusta):

```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```

Zauważ, że słowo kluczowe `new` nie było konieczne do stworzenia instancji klasy przypadku `Book`.
Jest tak, ponieważ klasy przypadków posiadają domyślnie zdefiniowaną metodę `apply`, która zajmuje się tworzeniem obiektu klasy.

W przypadku, kiedy tworzymy klasę przypadku zawierającą parametry, są one publiczne i stałe (`val`).

```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // wypisze guillaume@quebec.ca
message1.sender = "travis@washington.us"  // ten wiersz nie skompiluje się
```

Nie można ponownie przydzielić wartości do `message1.sender`, ponieważ jest to `val` (stała).
Alternatywnie, w klasach przypadków można też używać `var`, jednak stanowczo tego odradzamy.

## Porównywanie

Klasy przypadków są porównywane według ich struktury, a nie przez referencje:

```scala mdoc
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```

Mimo, że `message1` oraz `message2` odnoszą się do innych obiektów, to ich wartości są identyczne.

## Kopiowanie

Możliwe jest stworzenie płytkiej kopii (ang. shallow copy) instancji klasy przypadku używając metody `copy`.
Opcjonalnie można zmienić jeszcze wybrane parametry konstruktora.

```scala mdoc:nest
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```

Odbiorca wiadomości 4 `message4.recipient` jest użyty jako nadawca wiadomości 5 `message5.sender`, ciało wiadomości 5 zostało skopiowane bez zmian z wiadomości 4.

