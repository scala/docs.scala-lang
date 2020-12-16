---
layout: tour
title: Self-tipovi
language: ba
partof: scala-tour

num: 25
next-page: implicit-parameters
previous-page: compound-types
prerequisite-knowledge: nested-classes, mixin-class-composition

---
Self-tipovi su način da deklarišemo da trejt mora biti umiksan u drugi trejt, iako ga ne nasljeđuje direktno.
Ovo omogućuje da članovi zavisnog trejta budu dostupni bez importovanja.

Self-tip je način da se suzi tip `this` ili drugi identifikator koji je alijas za `this`. 
Sintaksa izgleda kao obična funkcija ali znači nešto sasvim drugačije.

Da bi koristili self-tip u trejtu, napišite identifikator, tip drugog trejta za umiksavanje, i `=>` (tj. `someIdentifier: SomeOtherTrait =>`).
```scala mdoc
trait User {
  def username: String
}

trait Tweeter {
  this: User =>  // reassign this
  def tweet(tweetText: String) = println(s"$username: $tweetText")
}

class VerifiedTweeter(val username_ : String) extends Tweeter with User {  // We mixin User because Tweeter required it
  def username = s"real $username_"
}

val realBeyoncé = new VerifiedTweeter("Beyoncé")
realBeyoncé.tweet("Just spilled my glass of lemonade")  // prints "real Beyoncé: Just spilled my glass of lemonade"
```

Pošto smo rekli `this: User =>` u `trait Tweeter`, sada je varijabla `username` u domenu korištenja `tweet` metode. 
Ovo znači da pošto `VerifiedTweeter` nasljeđuje `Tweeter`, također mora umiksati i `User`a (koristeći `with User`).
