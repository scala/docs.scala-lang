---
layout: tour
title: Tuplas
partof: scala-tour

num: 6
next-page: mixin-class-composition
previous-page: traits
language: pt-br
---

Em Scala, uma tupla é um valor que contém um número fixo de elementos, cada um com tipos distintos e as tuplas são imutáveis.

Tuplas são sobretudo úteis para retornar múltiplos valores de um método.

Uma Tupla com dois elementos pode ser criada dessa forma:

```scala mdoc
val ingrediente = ("Açucar" , 25)
```

Isto cria uma tupla contendo dois elementos um `String` e o outro `Int`.

O tipo inferido de `ingrediente` é `(String, Int)`, que é uma forma abreviada para `Tuple2[String, Int]` .

Para representar tuplas, Scala usa uma serie de classes: `Tuple2`, `Tuple3`, etc., até `Tuple22` . Cada classe tem tantos parâmetros de tipo quanto elementos.

## Acessando os Elementos

Uma maneira de acessar os elementos da tupla é pela sua respectiva posição. Os elementos individuais são nomeados `_1` , `_2` , e assim por diante.

```scala mdoc
println(ingrediente._1) // Açucar
println(ingrediente._2) // 25
```

## Correspondência de padrões em tuplas

Uma tupla pode também ser desmembrada usando correspondência de padrões:

```scala mdoc
val (nome, quantidade) = ingrediente
println(nome) // Açucar
println(quantidade) // 25
```

Aqui o tipo inferido para `nome` é `String` e para `quantidade` o tipo inferido é `Int`.

Outro exemplo de correspondência de padrões em uma tupla:

```scala mdoc
val planetas =
 List(("Mercúrio", 57.9), ("Vênus", 108.2), ("Terra", 149.6),
       ("Marte", 227.9), ("Júpiter", 778.3))
planetas.foreach{
  case ("Terra", distancia) =>
    println(s"Nosso planeta está a $distancia milhões de quilômetros do sol")
  case _ =>
}
```

Ou, um exemplo com `for` :

```scala mdoc
val numPars = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPars) {
  println(a * b)
}
```

## Tuplas e classes case

Desenvolvedores às vezes acham dificil escolher entre tuplas e classes case. Classes case têm elementos nomeados, e esses podem melhorar a leitura de alguns tipos de códigos. No exemplo dos planetas acima, nós poderiamos definir uma `case class Planeta(nome: String, distancia: Double)` ao invés de usar tuplas.


