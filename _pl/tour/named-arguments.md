---
layout: tour
title: Parametry nazwane

discourse: false

partof: scala-tour

num: 33
language: pl
previous-page: default-parameter-values
---

Wywołując metody i funkcje, możesz użyć nazwy parametru jawnie podczas wywołania:

```tut
def printName(first:String, last:String) = {
  println(first + " " + last)
}

printName("John", "Smith") // Wypisuje "John Smith"
printName(first = "John", last = "Smith") // Wypisuje "John Smith"
printName(last = "Smith", first = "John") // Wypisuje "John Smith"
```

Warto zwrócić uwagę na to, że kolejność wyboru parametrów podczas wywołania nie ma znaczenia, dopóki wszystkie parametry są nazwane. Ta funkcjonalność jest dobrze zintegrowana z [domyślnymi wartościami parametrów](default-parameter-values.html):

```tut
def printName(first: String = "John", last: String = "Smith") = {
  println(first + " " + last)
}

printName(last = "Jones") // Wypisuje "John Jones"
```
