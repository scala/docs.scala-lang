---
layout: tour
title: Singlton objekti
language: ba
partof: scala-tour

num: 13

next-page: regular-expression-patterns
previous-page: pattern-matching

---

Metode i vrijednosti koje ne pripadaju individualnim instancama [klase](classes.html) pripadaju *singlton objektima*,
označenim ključnom riječju `object` umjesto `class`.

```
package test

object Blah {
  def sum(l: List[Int]): Int = l.sum
}
```

Metoda `sum` je dostupna globalno, i može se pozvati, ili importovati, kao `test.Blah.sum`.

Singlton objekt je ustvari kratica za definisanje jednokratne klase, koja ne može biti direktno instancirana,
i ima `val` član `object`, s istim imenom.
Kao i `val`, singlton objekti mogu biti definisani kao članovi [trejta](traits.html) ili klase, iako je ovo netipično.

Singlton objekt može naslijediti klase i trejtove.
Ustvari, [case klasa](case-classes.html) bez [tipskih parametara](generic-classes.html) 
će podrazumijevano kreirati singlton objekt s istim imenom,
i implementiranim [`Function*`](https://www.scala-lang.org/api/current/scala/Function1.html) trejtom.

## Kompanjoni (prijatelji) ##

Većina singlton objekata nisu samostalni, već su povezani s istoimenom klasom.
“Singlton objekt istog imena” case klase, pomenut ranije, je jedan primjer ovoga.
U ovom slučaju, singlton objekt se zove *kompanjon objekt* klase, a klasa se zove *kompanjon klasa* objekta.

[Scaladoc](/style/scaladoc.html) ima posebnu podršku za prebacivanje između klase i njenog kompanjona:
ako krug s velikim “C” ili “O” ima savijenu ivicu (kao papir), možete kliknuti na krug da pređete na kompanjon.

Klasa i njen kompanjon objekt, ako ga ima, moraju biti definisani u istom izvornom fajlu:

```scala mdoc
class IntPair(val x: Int, val y: Int)

object IntPair {
  import math.Ordering

  implicit def ipord: Ordering[IntPair] =
    Ordering.by(ip => (ip.x, ip.y))
}
```

Često vidimo typeclass (jedan od dizajn paterna) instance kao [implicitne vrijednosti](implicit-parameters.html), kao navedeni `ipord`,
definisane u kompanjonu.
Ovo je pogodno jer se i članovi kompanjona uključuju u implicitnu pretragu za potrebnim vrijednostima.

## Napomene Java programerima ##

`static` nije ključna riječ u Scali.
Umjesto nje, svi članovi koji bi u Javi bili statički, uključujući i klase, trebaju ići u neki singlton objekt.
Pristupa im se istom sintaksom, importovanim posebno ili grupno.

Java programeri nekada definišu statičke članove privatnim kao pomoćne vrijednosti/funkcije.
Iz ovoga proizilazi čest šablon kojim se importuju svi članovi kompanjon objekta u klasu:

```
class X {
  import X._

  def blah = foo
}

object X {
  private def foo = 42
}
```

U kontekstu ključne riječi `private`, klasa i njen kompanjon su prijatelji.
`object X` može pristupiti privatnim članovima od `class X`, i obrnuto.
Da bi član bio *zaista* privatan, koristite `private[this]`.

Za pogodno korištenje u Javi, metode, uključujući `var` i `val` vrijednosti, definisane direktno u singlton objektu
također imaju statičke metode u kompanjon klasi, zvane *statički prosljeđivači*.
Drugi članovi su dostupni kroz `X$.MODULE$` statička polja za `object X`.

Ako prebacite sve u kompanjon objekt i klasa ostane prazna koju ne želite instancirati, samo obrišite klasu.
Statički prosljeđivači će biti kreirani svakako.
