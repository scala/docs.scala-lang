---
layout: tour
title: Podudaranje uzoraka (pattern matching)
language: ba
partof: scala-tour

num: 12

next-page: singleton-objects
previous-page: case-classes
prerequisite-knowledge: case-classes, string-interpolation, subtyping

---

Podudaranje uzoraka je mehanizam za provjeranje da li vrijednost odgovara uzroku. Uspješno podudaranje može također i dekonstruisati vrijednost na njene dijelove. Ono je moćnija verzija `switch` izjave u Javi tako da se može koristiti umjesto serije if/else izjava.

## Sintaksa
Izraz za podudaranje ima vrijednost, `match` ključnu riječ, i bar jednu `case` klauzu.
```scala mdoc
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
```
`val x` iznad je nasumično odabrani integer između 0 i 10. 
`x` postaje lijevi operand `match` operatora a na desnoj strani je izraz s četiri slučaja.
Zadnji slučaj, `_`, je "uhvati sve" slučaj za brojeve veće od 2. 
Slučajevi se još zovu i _alternative_.

Izrazi za podudaranje imaju vrijednost.
```scala mdoc
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
matchTest(3)  // many
matchTest(1)  // one
```
Ovaj izraz za podudaranje ima tip `String` jer svi slučajevi vraćaju `String`. 
Stoga, metoda `matchTest` vraća `String`.

## Podudaranje case klasa

Case klase su posebno korisne za podudaranje uzoraka.

```scala mdoc
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification


```
`Notification` je apstraktna nadklasa koja ima tri konkretna tipa implementirana kao case klase `Email`, `SMS`, i `VoiceRecording`. 
Sada možemo podudarati uzorke s ovim case klasama:

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(email, title, _) =>
      s"You got an email from $email with title: $title"
    case SMS(number, message) =>
      s"You got an SMS from $number! Message: $message"
    case VoiceRecording(name, link) =>
      s"you received a Voice Recording from $name! Click the link to hear it: $link"
  }
}
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))  // prints You got an SMS from 12345! Message: Are you there?

println(showNotification(someVoiceRecording))  // you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
```
Metoda `showNotification` prima parametar tipa `Notification` i podudara tip `Notification` (tj. traži da li je to `Email`, `SMS`, ili `VoiceRecording`). 
U slučaju `case Email(email, title, _)` polja `email` i `title` se koriste za povratnu vrijednostali se `body` ignoriše s `_`.

## Čuvari uzoraka (en. guards)
Čuvari uzoraka su jednostavno boolean izrazi koji se koriste za preciziranje uzorka. 
Samo dodajte `if <boolean expression>` nakon uzorka.
```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(email, _, _) if importantPeopleInfo.contains(email) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // nothing special, delegate to our original showNotification function
  }
}

val importantPeopleInfo = Seq("867-5309", "jenny@gmail.com")

val someSms = SMS("867-5309", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val importantEmail = Email("jenny@gmail.com", "Drinks tonight?", "I'm free after 5!")
val importantSms = SMS("867-5309", "I'm here! Where are you?")

println(showImportantNotification(someSms, importantPeopleInfo))
println(showImportantNotification(someVoiceRecording, importantPeopleInfo))
println(showImportantNotification(importantEmail, importantPeopleInfo))
println(showImportantNotification(importantSms, importantPeopleInfo))
```

U `case Email(email, _, _) if importantPeopleInfo.contains(email)`, uzorak se podudara samo ako je `email` u listi važnih ljudi.

## Podudaranje samo tipa
Možete podudarati samo tip ovako:
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
`def goIdle` ima različito ponašanje zavisno od tipa `Device`. 
Ovo je korisno kada uzorak mora pozvati metodu na uzorku. 
Konvencija je da se koristi prvo slovo tipa kao identifikator (`p` i `c` ovdje).

## Zapečaćene klase (en. sealed)
Trejtovi i klase mogu biti `sealed` što znači da svi podtipovi moraju biti reklarisani u istom fajlu. 
Ovo osigurava da su svi podtipovi poznati.

```scala mdoc
sealed abstract class Furniture
case class Couch() extends Furniture
case class Chair() extends Furniture

def findPlaceToSit(piece: Furniture): String = piece match {
  case a: Couch => "Lie on the couch"
  case b: Chair => "Sit on the chair"
}
```
Ovo je korisno za podudaranje tipovajer nam ne treba "catch all" slučaj.

## Napomene

Scalin mehanizam podudaranja uzoraka je najkorisniji za algebarske tipove koji su izraženi kroz [case klase](case-classes.html).
Scala također dozvoljava definisanje uzoraka nezavisno od case klasa, koristeći `unapply` metode u [ekstraktor objektima](extractor-objects.html).
