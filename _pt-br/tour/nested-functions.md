---
layout: tour
title: Funções Aninhadas
partof: scala-tour

num: 8
next-page: multiple-parameter-lists
previous-page: higher-order-functions
language: pt-br
---

Em scala é possível aninhar definições de funções. O objeto a seguir fornece uma função `filter` para extrair valores de uma lista de inteiros que são abaixo de um determinado valor:

```scala mdoc
object FilterTest extends App {
  def filter(xs: List[Int], threshold: Int) = {
    def process(ys: List[Int]): List[Int] =
      if (ys.isEmpty) ys
      else if (ys.head < threshold) ys.head :: process(ys.tail)
      else process(ys.tail)
    process(xs)
  }
  println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
}
```

_Nota: a função aninhada `process` refere-se a variável `threshold` definida em um escopo externo como um parâmetro da função `filter`._

A saída gerada pelo programa é:

```
List(1,2,3,4)
```
