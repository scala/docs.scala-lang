---
layout: tour
title: Imenovani parametri
language: ba
partof: scala-tour

num: 34
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

---

Kada se pozivaju metode, možete koristiti imena varijabli eksplicitno pri pozivu:

```scala mdoc
  def printName(first: String, last: String): Unit = {
    println(first + " " + last)
  }

  printName("John", "Smith")  // Prints "John Smith"
  printName(first = "John", last = "Smith")  // Prints "John Smith"
  printName(last = "Smith", first = "John")  // Prints "John Smith"
```

Primijetite da kada koristite imenovane parametre pri pozivu, redoslijed nije bitan, dok god su svi parametri imenovani.
Neimenovani argumenti moraju doći prvi i u zadanom redoslijedu kao u potpisu metode.

```
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName(last = "Smith", "john")  // Does not compile
```

Imenovani parametri ne rade kada se pozivaju metode iz Jave.
