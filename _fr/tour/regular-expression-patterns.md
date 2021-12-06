---
layout: tour
title: Regular Expression Patterns
partof: scala-tour

num: 17

language: fr

next-page: extractor-objects
previous-page: singleton-objects
---

Les expressions régulières sont des chaînes de caractères qui peuvent être utilisées pour trouver des motifs (ou l'absence de motif) dans un texte. Toutes les chaînes de caractères peuvent être converties en expressions régulières en utilisant la méthode `.r`. 

```scala mdoc
import scala.util.matching.Regex

val numberPattern: Regex = "[0-9]".r

numberPattern.findFirstMatchIn("awesomepassword") match {
  case Some(_) => println("Password OK")
  case None => println("Password must contain a number")
}
```

Dans l'exemple ci-dessus, `numberPattern` est une `Regex` (EXpression REGulière) que nous utilisons pour vérifier que le mot de passe contient un nombre.

Vous pouvez aussi faire des recherches avec des groupes d'expressions régulières en utilisant les parenthèses.

```scala mdoc
import scala.util.matching.Regex

val keyValPattern: Regex = "([0-9a-zA-Z- ]+): ([0-9a-zA-Z-#()/. ]+)".r

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

Ici nous analysons les clefs et les valeurs d'une chaîne de caractère. Chaque correspondance a un groupe de sous-correspondances. Voici le résultat :

```
key: background-color value: #A03300
key: background-image value: url(img/header100.png)
key: background-position value: top center
key: background-repeat value: repeat-x
key: background-size value: 2160px 108px
key: margin value: 0
key: height value: 108px
key: width value: 100
```

Traduit par Antoine Pointeau.