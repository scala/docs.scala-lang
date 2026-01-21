---
layout: tour
title: Pattern Matching
partof: scala-tour

num: 14

language: fr

next-page: singleton-objects
previous-page: case-classes
---

Le filtrage par motif est un mécanisme pour comparer une valeur par rapport à un motif. Un filtrage réussi permet de décomposer la valeur à partir de ses composants. C'est une version plus puissante du `switch` en Java et cela peut être utilisé à la place d'une série de blocs if/else. 

## Syntaxe

Un motif a une valeur, le mot clef `match` et au moins une clause `case`.

```scala mdoc
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```

`val x` ci-dessus est un entier aléatoire compris entre 0 et 10. `x` devient l'opérateur de gauche de l'opération `match` et sur la droite il y a une expression avec quatre cas. Le dernier cas `_` est appelé cas "catch all" (attrape tout) pour toutes les autres valeurs `Int` possibles. Les cas sont aussi appelés des _alternatives_.

Les expressions de motif ont une valeur.

```scala mdoc
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
matchTest(3)  // returns other
matchTest(1)  // returns one
```

Cette expression de motif est de type String parce que tous ses cas retournent String. Donc la fonction `matchTest` retourne une String.

## Appliquer un motif sur les classes de cas

Les classes de cas sont particulièrement utiles pour le filtrage par motif.

```scala mdoc
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification

```

`Notification` est une super-classe abstraite qui a trois types concrets de Notification implémentés, avec les classes `Email`, `SMS`, et `VoiceRecording`. Maintenant nous pouvons faire du filtrage par motif sur ces trois classes de cas :

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(sender, title, _) =>
      s"You got an email from $sender with title: $title"
    case SMS(number, message) =>
      s"You got an SMS from $number! Message: $message"
    case VoiceRecording(name, link) =>
      s"You received a Voice Recording from $name! Click the link to hear it: $link"
  }
}
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))  // prints You got an SMS from 12345! Message: Are you there?

println(showNotification(someVoiceRecording))  // prints You received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
```

La fonction `showNotification` prend en paramètre le type abstrait `Notification` et applique le motif sur le type de `Notification` (càd. qu'il ne fait pas de différence si c'est un `Email`, `SMS`, ou `VoiceRecording`). Dans le cas `case Email(sender, title, _)` les champs `sender` et `title` sont utilisés pour retourner une valeur, mais le champs `body` est ignoré avec `_`.

## Protections de filtrage

Les protections de filtrage sont simplement des expressions booléennes qui sont utilisées pour rendre le cas plus spécifique. Ajoutez seulement `if <boolean expression>` après le filtre.

```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(sender, _, _) if importantPeopleInfo.contains(sender) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // nothing special, delegate to our original showNotification function
  }
}

val importantPeopleInfo = Seq("867-5309", "jenny@gmail.com")

val someSms = SMS("123-4567", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val importantEmail = Email("jenny@gmail.com", "Drinks tonight?", "I'm free after 5!")
val importantSms = SMS("867-5309", "I'm here! Where are you?")

println(showImportantNotification(someSms, importantPeopleInfo)) // prints You got an SMS from 123-4567! Message: Are you there?
println(showImportantNotification(someVoiceRecording, importantPeopleInfo)) // prints You received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
println(showImportantNotification(importantEmail, importantPeopleInfo)) // prints You got an email from special someone!

println(showImportantNotification(importantSms, importantPeopleInfo)) // prints You got an SMS from special someone!
```

Dans le cas `case Email(sender, _, _) if importantPeopleInfo.contains(sender)`, le filtre laisse passer seulement si le `sender` est dans la liste des personnes imortantes.

## Filtrer sur les types uniquement

Vous pouvez filtrer sur les types uniquement, comme ceci :

```scala mdoc
abstract class Device
case class Phone(model: String) extends Device {
  def screenOff = "Turning screen off"
}
case class Computer(model: String) extends Device {
  def screenSaverOn = "Turning screen saver on..."
}

def goIdle(device: Device) = device match {
  case p: Phone => p.screenOff
  case c: Computer => c.screenSaverOn
}
```

`def goIdle` a un comportement différent en fonction du type de `Device`. C'est utile quand le cas à besoin d'appeler une méthode. C'est une convention d'utiliser la première lettre du type comme identifiant de cas (`p` et `c` dans l'exemple).

## Classes scellées

Les traits et les classes peuvent être marquées comme `sealed` (scellées), ce qui veut dire que tous les sous-types doivent être déclarés dans le même fichier. Cela permet de s'assurer que tous les sous-types sont connus.

```scala mdoc
sealed abstract class Furniture
case class Couch() extends Furniture
case class Chair() extends Furniture

def findPlaceToSit(piece: Furniture): String = piece match {
  case a: Couch => "Lie on the couch"
  case b: Chair => "Sit on the chair"
}
```

C'est utile pour le filtrage par motif, parce que le cas "catch all" (attrape tout) ne devient plus nécessaire.

## Notes

Le filtrage par motif en Scala est plus utiles en filtrant des types algébriques exprimés via [case classes](case-classes.html).
Scala autorise aussi la définition de filtres indépendamment des classes de cas, en utilisant la méthode `unapply` des [extractor objects](extractor-objects.html).

## Plus d'informations

* Plus de détails sur les expressions de filtrage dans [Scala Book](/overviews/scala-book/match-expressions.html)

Traduit par Antoine Pointeau.