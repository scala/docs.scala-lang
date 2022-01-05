---
layout: tour
title: Case Classes
partof: scala-tour

num: 13

language: fr

next-page: pattern-matching
previous-page: multiple-parameter-lists
---

Les classes de cas sont comme les autres classes avec quelques différences que nous allons présenter. Les classes de cas sont pratiques pour modéliser des données immuables. Dans la prochaine étape du tour, nous verrons comment elles peuvent être utilisées avec le [pattern matching](pattern-matching.html).

## Définir une classe de cas

Une classe de cas requiert au minimum le mot clef `case class`, un identifiant, et une liste de paramètres (qui peut être vide) :

```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```

Notez que le mot clef `new` n'a pas été utilisé pour instancier la classe de cas `Book`. C'est parce que la classe de cas a une méthode `apply` par défaut qui prend en charge la construction de l'objet.

Quand vous créez une classe de cas avec des paramètres, les paramètres sont des `val` publiques.

```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // prints guillaume@quebec.ca
message1.sender = "travis@washington.us"  // cette ligne ne compile pas
```

Vous ne pouvez pas réaffecter `message1.sender` parce que c'est une `val` (càd. une valeur immuable). Il est possible d'utiliser des `var` dans les classes de cas mais ce n'est pas recommandé.

## Comparaison

Les instances des classes de cas sont comparées structurellement et non par référence :

```scala mdoc
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```

Même si `message2` et `message3` font référence à des objets différents, les valeurs de chaque objet sont égales.

## Copier

Vous pouvez créer une copie (superficielle) d'une instance de classe de cas simplement en utlisant la méthode `copy`. Vous pouvez optionnellement changer les arguments du constructeur.

```scala mdoc:nest
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```

Le destinataire (recipient) de `message4` est utilisé comment expéditeur (sender) du message `message5` mais le `body` du `message4` a été directement copié.

## Plus d'informations

* Apprennez-en plus sur les classes de cas dans [Scala Book](/overviews/scala-book/case-classes.html)

Traduit par Antoine Pointeau.
