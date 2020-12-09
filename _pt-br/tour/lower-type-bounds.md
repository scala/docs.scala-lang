---
layout: tour
title: Limitante Inferior de Tipos
partof: scala-tour

num: 20
next-page: inner-classes
previous-page: upper-type-bounds
language: pt-br
---

Enquanto o [limitante superior de tipos](upper-type-bounds.html) limita um tipo a um subtipo de outro tipo, o *limitante inferior de tipos* declara um tipo para ser supertipo de outro tipo. O termo `T>: A` expressa que o parâmetro de tipo `T` ou tipo abstracto `T` refere-se a um supertipo do tipo `A`.

Aqui está um exemplo onde isso é útil:

```scala mdoc
case class ListNode[T](h: T, t: ListNode[T]) {
  def head: T = h
  def tail: ListNode[T] = t
  def prepend(elem: T): ListNode[T] =
    ListNode(elem, this)
}
```

O programa acima implementa uma linked list com uma operação de pré-inserção. Infelizmente, esse tipo é invariante no parâmetro de tipo da classe `ListNode`; Ou seja, `ListNode [String]` não é um subtipo de `ListNode [Any]`. Com a ajuda de [anotações de variância](variances.html) podemos expressar tal semântica de subtipo:

```scala
case class ListNode[+T](h: T, t: ListNode[T]) { ... }
```

Infelizmente, este programa não compila, porque uma anotação de covariância só é possível se a variável de tipo é usada somente em posições covariantes. Como a variável de tipo `T` aparece como um parâmetro de tipo do método `prepend`, tal regra é violada. Porém com a ajuda de um *limitante inferior de tipo*, podemos implementar um método de pré-inserção onde `T` só aparece em posições covariantes.

Aqui está o código correspondente:

```scala mdoc:reset
case class ListNode[+T](h: T, t: ListNode[T]) {
  def head: T = h
  def tail: ListNode[T] = t
  def prepend[U >: T](elem: U): ListNode[U] =
    ListNode(elem, this)
}
```

_Nota:_ o novo método `prepend` tem um tipo ligeiramente menos restritivo. Permite, por exemplo, inserir um objeto de um supertipo a uma lista existente. A lista resultante será uma lista deste supertipo.

Aqui está o código que ilustra isso:

```scala
object LowerBoundTest extends App {
  val empty: ListNode[Null] = ListNode(null, null)
  val strList: ListNode[String] = empty.prepend("hello")
                                       .prepend("world")
  val anyList: ListNode[Any] = strList.prepend(12345)
}
```

