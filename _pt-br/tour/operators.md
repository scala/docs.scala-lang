---
layout: tour
title: Operadores
partof: scala-tour

num: 29
next-page: automatic-closures
previous-page: type-inference
language: pt-br
---

Qualquer método que tenha um único parâmetro pode ser usado como um *operador infix* em Scala. Aqui está a definição da classe `MyBool` que inclui os métodos `add` e `or`:

```scala mdoc
case class MyBool(x: Boolean) {
  def and(that: MyBool): MyBool = if (x) that else this
  def or(that: MyBool): MyBool = if (x) this else that
  def negate: MyBool = MyBool(!x)
}
```

Agora é possível utilizar as funções `and` and `or` como operadores infix:

```scala mdoc
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)
```

Isso ajuda a tornar a definição de `xor` mais legível.

Aqui está o código correspondente em uma sintaxe de linguagem de programação orientada a objetos mais tradicional:

```scala mdoc:nest
def not(x: MyBool) = x.negate
def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
```
