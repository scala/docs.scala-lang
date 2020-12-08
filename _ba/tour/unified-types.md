---
layout: tour
title: Sjedinjeni tipovi
language: ba
partof: scala-tour

num: 3
next-page: classes
previous-page: basics
prerequisite-knowledge: classes, basics

---

Sve vrijednosti u Scali su objekti, uključujući brojeve i funkcije.
Dijagram ispod prikazuje hijerarhiju Scala klasa.

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="Scala Type Hierarchy"></a>

## Hijerarhija tipova u Scali ##

[`Any`](https://www.scala-lang.org/api/2.12.1/scala/Any.html) je nadtip svih tipova, zove se još i vrh-tip. 
Definiše određene univerzalne metode kao što su `equals`, `hashCode` i `toString`.
`Any` ima dvije direktne podklase, `AnyVal` i `AnyRef`.


`AnyVal` predstavlja vrijednosne tipove. Postoji devet predefinisanih vrijednosnih tipova i oni ne mogu biti `null`: 
`Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit` i `Boolean`.
`Unit` je vrijednosni tip koji ne nosi značajnu informaciju. Postoji tačno jedna instanca tipa `Unit` koja se piše `()`. 
Sve funkcije moraju vratiti nešto tako da je `Unit` ponekad koristan povratni tip.

`AnyRef` predstavlja referencne tipove. Svi nevrijednosni tipovi definišu se kao referencni.
Svaki korisnički definisan tip je podtip `AnyRef`.
Ako se Scala koristi u kontekstu JRE, onda `AnyRef` odgovara klasi `java.lang.Object`.

Slijedi primjer koji demonstrira da su stringovi, integeri, karakteri, booleani i funkcije svi objekti kao bilo koji drugi:

```scala mdoc
val list: List[Any] = List(
  "a string",
  732,  // an integer
  'c',  // a character
  true, // a boolean value
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```

Definisana je varijabla `list` tipa `List[Any]`. Lista je inicijalizovana elementima različitih tipova, ali su svi instanca `Any`, tako da se mogu dodati u listu.

Ovo je izlaz programa:

```
a string
732
c
true
<function>
```

## Kastovanje tipova
Vrijednosni tipovi mogu biti kastovani na sljedeći način:
<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

Npr:

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (određena doza preciznosti se gubi ovdje)

val face: Char = '☺'
val number: Int = face  // 9786
```

Kastovanje je jednosmjerno. Ovo se ne kompajlira:

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // Does not conform
```

Također možete kastovati i referencni tip u podtip. Ovo će biti pokriveno kasnije.

## Nothing i Null
`Nothing` je podtip svih tipova, također se zove i donji tip (en. bottom type). Ne postoji vrijednost koja ima tip `Nothing`.  
Česta upotreba ovog tipa je signalizacija neterminacije kao što je bacanje izuzetka, izlaz iz programa, ili beskonačna petlja (tj. tip izraza koji se ne izračunava u vrijednost, ili metoda koja se ne završava normalno).

`Null` je podtip svih referencnih tipova (tj. bilo kog podtipa `AnyRef`). 
Ima jednu vrijednost koja se piše literalom `null`. 
`Null` se uglavnom koristi radi interoperabilnosti s ostalim JVM jezicima i skoro nikad se ne koristi u Scala kodu. 
Alternative za `null` obradićemo kasnije.
