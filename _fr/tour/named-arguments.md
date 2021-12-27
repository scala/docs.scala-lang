---
layout: tour
title: Named Arguments
partof: scala-tour

num: 6

language: fr

next-page: traits
previous-page: default-parameter-values
---

En appelant des méthodes, vous pouvez nommer leurs arguments comme ceci :

```scala mdoc
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```

Notez comment l'ordre des arguments nommés peut être réarrangé. Cependant, si certains arguments sont nommés et d'autres non, les arguments non nommés doivent venir en premier et suivrent l'ordre de leurs paramètres dans la signature de la méthode.

```scala mdoc:fail
printName(last = "Smith", "john") // error: positional after named argument
```

Les arguments nommés fonctionnent avec les appels de méthodes Java, mais seulement si la librairie Java en question a été compilée avec `-parameters`.

Traduction par Antoine Pointeau.