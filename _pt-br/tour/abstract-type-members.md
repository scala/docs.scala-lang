---
layout: tour
title: Tipos Abstratos
partof: scala-tour

num: 22
next-page: compound-types
previous-page: inner-classes
language: pt-br
---

Em Scala, as classes são parametrizadas com valores (os parâmetros de construtor) e com tipos (se as [classes genéricas](generic-classes.html)). Por razões de regularidade, só não é possível ter valores como membros de um objeto; tipos juntamente com valores são membros de objetos. Além disso, ambas as formas de membros podem ser concretas e abstratas.

Aqui está um exemplo que mostra uma definição de valor diferido e uma definição de tipo abstrato como membros de uma [trait](traits.html) chamada `Buffer`.

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```

*Tipos Abstratos* são tipos cuja identidade não é precisamente conhecida. No exemplo acima, só sabemos que cada objeto da classe `Buffer` tem um membro de tipo `T`, mas a definição de classe `Buffer` não revela a qual tipo concreto o membro do tipo `T` corresponde. Como definições de valores, podemos sobrescrever definições de tipos em subclasses. Isso nos permite revelar mais informações sobre um tipo abstrato ao limitar o tipo associado (o qual descreve as possíveis instâncias concretas do tipo abstrato).

No seguinte programa temos uma classe `SeqBuffer` que nos permite armazenar apenas as sequências no buffer ao definir que o tipo `T` precisa ser um subtipo de `Seq[U]` para um novo tipo abstrato `U`:

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```

[Traits](traits.html) ou [classes](classes.html) com membros de tipo abstratos são frequentemente utilizadas em combinação com instâncias de classe anônimas. Para ilustrar isso, agora analisamos um programa que lida com um buffer de sequência que se refere a uma lista de inteiros:

```scala mdoc
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}

object AbstractTypeTest1 extends App {
  def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
    new IntSeqBuffer {
         type T = List[U]
         val element = List(elem1, elem2)
       }
  val buf = newIntSeqBuf(7, 8)
  println("length = " + buf.length)
  println("content = " + buf.element)
}
```

O tipo de retorno do método `newIntSeqBuf` refere-se a uma especialização da trait `Buffer` no qual o tipo `U` é agora equivalente a `Int`. Declaramos um tipo *alias* semelhante ao que temos na instanciação da classe anônima dentro do corpo do método `newIntSeqBuf`. Criamos uma nova instância de `IntSeqBuffer` na qual o tipo `T` refere-se a `List[Int]`.

Observe que muitas vezes é possível transformar os membros de tipo abstrato em parâmetros de tipo de classes e vice-versa. Aqui está uma versão do código acima que usa apenas parâmetros de tipo:

```scala mdoc:nest
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}
def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
  new SeqBuffer[Int, List[Int]] {
    val element = List(e1, e2)
  }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Note que temos que usar [anotação de variância](variances.html) aqui; Caso contrário, não seríamos capazes de ocultar o tipo implementado pela sequência concreta do objeto retornado pelo método `newIntSeqBuf`. Além disso, há casos em que não é possível substituir tipos abstratos com parâmetros de tipo.
