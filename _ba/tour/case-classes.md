---
layout: tour
title: Case klase
language: ba
partof: scala-tour

num: 11
next-page: pattern-matching
previous-page: multiple-parameter-lists
prerequisite-knowledge: classes, basics, mutability

---

Case klase su kao obične klase s par ključnih razlika.
Dobre su za modelovanje nepromjenjivih podataka.
U sljedećem koraku turneje, vidjećemo kako su korisne u [podudaranju uzoraka (pattern matching)](pattern-matching.html).

## Definisanje case klase
Minimalna case klasa se sastoji iz ključnih riječi `case class`,  identifikatora, i liste parametara (koja može biti prazna):
```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```
Primijetite kako se ključna riječ `new` ne koristi za instanciranje `Book` case klase. To je zato što case klase imaju podrazumijevanu `apply` metodu koja se brine o instanciranju.

Kada kreirate case klasu s parametrima, parametri su public `val`.
```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // prints guillaume@quebec.ca
message1.sender = "travis@washington.us"  // this line does not compile
```
Ne možete izmijetniti `message1.sender` zato što je  `val` (tj. nepromjenjiv). Moguće je koristiti i `var` u case klasama ali nije preporučeno.

## Poređenje
Case klase se porede po strukturi a ne po referenci:
```
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```
Iako se  `message2` i `message3` odnose na različite objekte, vrijednost oba objekta je ista.

## Kopiranje
Možete kreirati (plitku) kopiju instance case klase koristeći `copy` metodu. Opciono možete promijeniti argumente konstruktora.

```
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```

`recipient` od `message4` se koristi kao `sender` od `message5` ali je `body` od `message4` kopiran direktno.
