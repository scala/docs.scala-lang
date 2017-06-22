---
layout: inner-page-no-masthead
title: Sequence Comprehensions

discourse: false

tutorial: scala-tour
categories: tour
num: 16
next-page: generic-classes
previous-page: extractor-objects
language: pt-br
---

Scala oferece uma notação simples para expressar *compreensões de sequência*. As compreensões têm a forma `for (enumerators) yield e`, onde` enumerators` se refere a uma lista de enumeradores separados por ponto-e-vírgula. Um *enumerator* é um gerador que introduz novas variáveis ou é um filtro. A compreensão avalia o corpo `e` para cada associação gerada pelos enumeradores e retorna uma sequência desses valores.

Por exemplo:
 
```tut
object ComprehensionTest1 extends App {
  def par(de: Int, ate: Int): List[Int] =
    for (i <- List.range(de, ate) if i % 2 == 0) yield i
  Console.println(par(0, 20))
}
```
 
A função for-expression introduz uma nova variável `i` do tipo `Int`, que é subsequentemente associada a todos os valores da lista `List (de, de + 1, ..., ate - 1)`. A restrição `if i% 2 == 0` ignora todos os números ímpares para que o corpo (que só consiste na expressão i) seja avaliado somente para números pares. Consequentemente, toda a expressão `for` retorna uma lista de números pares.

O programa produz a seguinte saída:

```
List(0, 2, 4, 6, 8, 10, 12, 14, 16, 18)
```

Agora um exemplo mais complicado que calcula todos os pares de números entre `0` e` n-1` cuja soma é igual a um dado valor `v`:

```tut
object ComprehensionTest2 extends App {
  def foo(n: Int, v: Int) =
    for (i <- 0 until n;
         j <- i until n if i + j == v) yield
      (i, j);
  foo(20, 32) foreach {
    case (i, j) =>
      println(s"($i, $j)")
  }
}
```
 
Este exemplo mostra que as compreensões não estão restritas às listas. Pois o programa anterior usa iteradores. Todo tipo de dados que suporta as operações `withFilter`, `map`, e `flatMap` (com os tipos apropriados) pode ser usado em compreensões de sequência.

Aqui está a saída do programa:

```
(13, 19)
(14, 18)
(15, 17)
(16, 16)
```

Há também uma forma especial de compreensão de sequência que retorna `Unit`. Aqui as associações que são criadas a partir da lista de geradores e filtros são utilizadas para gerar efeitos colaterais. O programador precisa omitir a palavra-chave `yield` para fazer uso de tal compreensão de sequência.
Aqui está um programa que é equivalente ao anterior, mas usa uma forma especial de for-expression que retorna `Unit`:
 
```
object ComprehensionTest3 extends App {
  for (i <- Iterator.range(0, 20);
       j <- Iterator.range(i, 20) if i + j == 32)
    println(s"($i, $j)")
}
```
