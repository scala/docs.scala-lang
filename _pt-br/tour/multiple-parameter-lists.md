---
layout: tour
title: Currying
partof: scala-tour

num: 9
next-page: case-classes
previous-page: nested-functions
language: pt-br
---

_Nota de tradução: Currying é uma técnica de programação Funcional nomeada em honra ao matemático e lógico Haskell Curry. Por essa razão a palavra Currying não será traduzida. Entende-se que é uma ação, uma técnica básica de Programação Funcional._

Métodos podem definir múltiplas listas de parâmetros. Quando um método é chamado com uma lista menor de parâmetros, então será retornada uma função que recebe a lista que parâmetros que falta como argumentos.

Aqui um exemplo:

```scala mdoc
object CurryTest extends App {

  def filter(xs: List[Int], p: Int => Boolean): List[Int] =
    if (xs.isEmpty) xs
    else if (p(xs.head)) xs.head :: filter(xs.tail, p)
    else filter(xs.tail, p)

  def modN(n: Int)(x: Int) = ((x % n) == 0)

  val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
  println(filter(nums, modN(2)))
  println(filter(nums, modN(3)))
}
```

_Nota: o método `modN` é parcialmente aplicado em duas chamadas de `filter`; por exemplo: somente o primeiro argumento é realmente aplicado. O termo `modN(2)` retorna uma função do tipo `Int => Boolean` e esta se torna uma possível candidata a segundo argumento da função `filter`._

A saída do programa acima produz:

```
List(2,4,6,8)
List(3,6)
```
