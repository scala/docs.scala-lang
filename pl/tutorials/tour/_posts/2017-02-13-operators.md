---
layout: tutorial
title: Operatory

disqus: true

tutorial: scala-tour
categories: tour
num: 29
language: pl
tutorial-next: automatic-closures
tutorial-previous: local-type-inference
---

Każda metoda, która przyjmuje jeden parametr może być użyta jako *operator infiksowy*. Oto definicja klasy `MyBool` która zawiera metody `and` i `or`:

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
