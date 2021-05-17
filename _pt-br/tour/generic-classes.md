---
layout: tour
title: Classes Genéricas
partof: scala-tour

num: 17
next-page: variances
previous-page: extractor-objects
language: pt-br
---

Semelhante ao Java 5 (aka. JDK 1.5), Scala tem suporte nativo para classes parametrizadas com tipos. Essas classes genéricas são particularmente úteis para o desenvolvimento de classes que representam coleções de dados.
Aqui temos um exemplo que demonstra isso:

```scala mdoc
class Stack[T] {
  var elems: List[T] = Nil
  def push(x: T): Unit =
    elems = x :: elems
  def top: T = elems.head
  def pop() { elems = elems.tail }
}
```

A classe `Stack` modela uma pilha mutável que contém elementos de um tipo arbitrário `T`. Os parâmetros de tipo garantem que somente os elementos legais (que são do tipo `T`) são inseridos na pilha. Da mesma forma, com os parâmetros de tipo podemos expressar que o método `top` retorna somente elementos de um único tipo de dado, no caso, `T`.

Aqui temos mais alguns exemplos de uso:

```scala mdoc
object GenericsTest extends App {
  val stack = new Stack[Int]
  stack.push(1)
  stack.push('a')
  println(stack.top)
  stack.pop()
  println(stack.top)
}
```

A saída do programa é:

```
97
1
```
_Nota: subtipos de tipos genéricos são *invariantes*. Isto significa que se tivermos uma pilha de caracteres do tipo `Stack[Char]` então ela não pode ser usada como uma pilha de inteiros do tipo `Stack[Int]`. Isso seria incorreto porque isso nos permitiria inserir inteiros verdadeiros na pilha de caracteres. Para concluir, `Stack[T]` é um subtipo de de `Stack[S]` se e somente se `S = T`. Como isso pode ser bastante restritivo, Scala oferece um [mecanismo de anotação de parâmetro de tipo](variances.html) para controlar o comportamento de subtipo de tipos genéricos._
