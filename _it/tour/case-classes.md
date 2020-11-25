---
layout: tour
title: Case Classes
partof: scala-tour

num: 13
next-page: pattern-matching
previous-page: multiple-parameter-lists
prerequisite-knowledge: classes, basics, mutability
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)

Le classi case (_case classes_) sono simili alle classi tradizionali, ma con alcune importanti differenze. Le classi case si prestano bene per modellare dati immutabili. Potrai vedere la loro utilità leggendo la pagina relativa al [pattern matching](pattern-matching.html).

## Definire una classe case
La definizione più piccola di una classe case richiede solamente la parola chiave `case class`, il nome che le si vuole assegnare e una lista di parametri (che potrebbe anche essere vuota):
```tut
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```
Notare come non sia stata usata la parola chiave `new` per istanziare la classe case `Book`: questo perchè queste particolari classi hanno un'implementazione di default del metodo `apply` che gestisce la costruzione dell'oggetto.

Quando crei una classe case con parametri, i parametri sono pubblici e di tipo `val`.
```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // Restituirà a schermo guillaume@quebec.ca
message1.sender = "travis@washington.us"  // Questa linea di codice non si compilerà
```
Non puoi riassegnare `message1.sender` perchè è un `val` (quindi immutabile). È comunque possibile definire i parametri come `var`, ma questa è una pratica che viene disincentivata per quanto riguarda le classi case.

## Confronti
Le istanze delle classi case sono comparate a livello di strutture, e non di riferimenti in memoria:
```tut
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```
Anche se `message2` e `message3` fanno riferimenti ad oggetti allocati in spazi differenti in memoria, il valore di ognuno di essi è uguale.

## Effettuare una copia
Si può creare una copia si un'istanza di una classe case semplicemente utilizzando il metodo `copy`. È possibile inoltre cambiare gli argomenti del costruttore:
```tut
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```
Il destinarario di `message4` è usato come mittente di `message5`, ma il `body` di `message4` è stato copiato direttamente.
The recipient of `message4` is used as the sender of `message5` but the `body` of `message4` was copied directly.

## Altre risorse

* Per saperne di più sulle classi case puoi leggere il relativo capitolo presente in [Scala Book](/overviews/scala-book/case-classes.html)
