---
layout: tour
title: Objetos Extratores
partof: scala-tour

num: 15
next-page: generic-classes
previous-page: regular-expression-patterns
language: pt-br
---

Em Scala, padrões podem ser definidos independentemente de classes case. Para este fim, um método chamado `unapply` é definido para retornar um extrator. Um extrator pode ser pensado como um método especial que inverte o efeito da aplicação de um determinado objeto em algumas entradas. Seu objetivo é "extrair" as entradas que estavam presentes antes da operação `apply`. Por exemplo, o código a seguir define um [objeto](singleton-objects.html) extrator chamado Twice.

```scala mdoc
object Twice {
  def apply(x: Int): Int = x * 2
  def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
}

object TwiceTest extends App {
  val x = Twice(21)
  x match { case Twice(n) => Console.println(n) } // prints 21
}
```

Existem duas convenções sintáticas em ação aqui:

O padrão `case Twice (n)` causa a invocação do método `Twice.unapply`, que é usado para fazer a comparação de qualquer número par; O valor de retorno de `unapply` indica se a comparação falhou ou não, e quaisquer sub-valores que possam ser utilizados para uma seguinte comparação. Aqui, o sub-valor é `z/2`.

O método `apply` não é necessário na correspondência de padrões. É utilizado somente para simular um construtor. `val x = Twice(21)` é expandido para `val x = Twice.apply(21)`.

O tipo de retorno de uma chamada `unapply` deveria ser escolhido da seguinta forma:

* Se é somente um teste, retorne `Boolean`. Por exemplo `case even()`
* Se retorna um único subvalor to tipo `T`, retorne `Option[T]`
* Se você quer retornar vários subvalores `T1,...,Tn`, agrupe todos em uma tupla opcional como `Option[(T1,...,Tn)]`.

Algumas vezes, o número de subvalores é fixo e você precisa retornar uma sequência. Para isso, você pode definir padrões através da chamada `unapplySeq`. O último subvalor do tipo `Tn` precisa ser `Seq[S]`. Tal mecanismo é utilizado como exemplo no padrão `case List(x1, ..., xn)`.

Extratores podem tornar o código mais fácil de manter. Para mais detalhes, leia o artigo ["Matching Objects with Patterns"](https://infoscience.epfl.ch/record/98468/files/MatchingObjectsWithPatterns-TR.pdf) (veja a seção 4) by Emir, Odersky and Williams (January 2007).
