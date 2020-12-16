---
layout: tour
title: Funkcije višeg reda
language: ba
partof: scala-tour

num: 8
next-page: nested-functions
previous-page: mixin-class-composition

---

Scala dozvoljava definisanje funkcija višeg reda.
To su funkcije koje _primaju druge funkcije kao parametre_, ili čiji je _rezultat funkcija_.
Ovo je funkcija `apply` koja uzima drugu funkciju `f` i vrijednost `v` i primjenjuje funkciju `f` na `v`:

```scala mdoc
def apply(f: Int => String, v: Int) = f(v)
```

_Napomena: metode se automatski pretvaraju u funkcije ako to kontekst zahtijeva._

Ovo je još jedan primjer:
 
```scala mdoc
class Decorator(left: String, right: String) {
  def layout[A](x: A) = left + x.toString() + right
}

object FunTest extends App {
  override def apply(f: Int => String, v: Int) = f(v)
  val decorator = new Decorator("[", "]")
  println(apply(decorator.layout, 7))
}
```
 
Izvršavanjem se dobije izlaz:

```
[7]
```

U ovom primjeru, metoda `decorator.layout` je automatski pretvorena u vrijednost tipa `Int => String` koju zahtijeva metoda `apply`.
Primijetite da je metoda `decorator.layout` _polimorfna metoda_ (tj. apstrahuje neke tipove u svom potpisu)
i Scala kompajler mora prvo instancirati tipove metode.
