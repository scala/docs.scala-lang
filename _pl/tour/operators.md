---
layout: tour
title: Operatory

discourse: false

partof: scala-tour

num: 29
language: pl
next-page: automatic-closures
previous-page: type-inference
---

Każda metoda, która przyjmuje jeden parametr, może być użyta jako *operator infiksowy*. Oto definicja klasy `MyBool` która zawiera metody `and` i `or`:

```tut
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

Można teraz użyć `and` i `or` jako operatory infiksowe:

```tut
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

Można zauważyć, że dzięki zastosowaniu operatorów infiksowych metoda `xor` jest czytelniejsza.

Dla porównania, oto kod który nie wykorzystuje operatorów infiksowych:

```tut
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
```
