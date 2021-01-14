---
layout: tour
title: Regularni izrazi
language: ba
partof: scala-tour

num: 15

next-page: extractor-objects
previous-page: singleton-objects

---

Regularni izrazi su stringovi koji se mogu koristiti za traženje uzoraka u podacima.
Bilo koji string se može pretvoriti u regularni izraz pozivom `.r` metode.

```scala mdoc
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```

U gornjem primjeru, `numberPattern` je `Regex`
(regularni izraz) kojim provjeravamo da li šifra sadrži broj.

Također, možete tražiti grupe regularnih izraza koristeći zagrade.

```scala mdoc
import scala.util.matching.Regex

val keyValPattern: Regex = "([0-9a-zA-Z-#() ]+): ([0-9a-zA-Z-#() ]+)".r

val input: String =
  """background-color: #A03300;
    |background-image: url(img/header100.png);
    |background-position: top center;
    |background-repeat: repeat-x;
    |background-size: 2160px 108px;
    |margin: 0;
    |height: 108px;
    |width: 100%;""".stripMargin

for (patternMatch <- keyValPattern.findAllMatchIn(input))
  println(s"key: ${patternMatch.group(1)} value: ${patternMatch.group(2)}")
```
Ovdje parsiramo ključeve i vrijednosti Stringa. 
Svaki pogodak ima grupu pod-pogodaka. Ovo je izlaz:
```
key: background-color value: #A03300
key: background-image value: url(img
key: background-position value: top center
key: background-repeat value: repeat-x
key: background-size value: 2160px 108px
key: margin value: 0
key: height value: 108px
key: width value: 100
```
