---
layout: tour
title: Operatori
language: ba
partof: scala-tour

num: 30
next-page: by-name-parameters
previous-page: type-inference
prerequisite-knowledge: case-classes

---

U Scali, operatori su metode. 
Bilo koja metoda koja prima samo jedan parametar može biti korištena kao _infiksni operator_. Npr, `+` se može pozvati s tačka-notacijom:
```
10.+(1)
```

Međutim, lakše je čitati kada se napiše kao infiksni operator:
```
10 + 1
```

## Definisanje i korištenje operatora
Možete koristiti bilo koji legalni identifikator kao operator. 
To uključuje i imena kao `add` ili simbole kao `+`.
```scala mdoc
case class Vec(x: Double, y: Double) {
  def +(that: Vec) = Vec(this.x + that.x, this.y + that.y)
}

val vector1 = Vec(1.0, 1.0)
val vector2 = Vec(2.0, 2.0)

val vector3 = vector1 + vector2
vector3.x  // 3.0
vector3.y  // 3.0
```
Klasa `Vec` ima metodu `+` koja se može koristiti za sabiranje  `vector1` i `vector2`. 
Koristeći zagrade, možete pisati kompleksne izraze s čitljivom sintaksom.

Slijedi definicija klase `MyBool` koja definiše tri metode `and`, `or`, i `negate`.

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

Sada je moguće koristiti `and` i `or` kao infiksne operatore:

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

Ovo pomaže da definicija `xor` metode bude čitljivija.

## Prednost
Kada izraz koristi više operatora, operatori se primjenjuju bazirano na prioritetu prvog karaktera:
```
(karakteri koji nisu jedan od ovih ispod)
* / %
+ -
:
= !
< >
&
^
|
(sva slova)
```
Ovo se odnosi na metode koje definišete. Npr, sljedeći izraz:
```
a + b ^? c ?^ d less a ==> b | c
```
je ekvivalentan
```
((a + b) ^? (c ?^ d)) less ((a ==> b) | c)
```
`?^` ima najveću prednost jer počinje s karakterom `?`. `+` ima drugu prednost, pa `^?`, `==>`, `|`, i `less`.
