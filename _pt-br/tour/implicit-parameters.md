---
layout: tour
title: Parâmetros Implícitos
partof: scala-tour

num: 25
next-page: implicit-conversions
previous-page: self-types
language: pt-br
---

Um método com _parâmetros implícitos_ pode ser aplicado a argumentos como um método normal. Neste caso, o rótulo implícito não tem efeito. No entanto, se faltarem argumentos para os parâmetros implícitos declarados, tais argumentos serão automaticamente fornecidos.

Os argumentos reais que são elegíveis para serem passados para um parâmetro implícito se dividem em duas categorias:

* Primeira, são elegíveis todos os identificadores x que podem ser acessados no ponto da chamada do método sem um prefixo e que denotam uma definição implícita ou um parâmetro implícito.

* Segunda, são elegíveis também todos os membros dos módulos acompanhantes do tipo do parâmetro implícito que são rotulados como `implicit`.

No exemplo a seguir, definimos um método `sum` que calcula a soma de uma lista de elementos usando as operações `add` e `unit` do monoide. Observe que valores implícitos não podem ser *top-level*, eles precisam ser membros de um modelo.

```scala mdoc
/** Este exemplo usa uma estrutura da álgebra abstrata para mostrar como funcionam os parâmetros implícitos. Um semigrupo é uma estrutura algébrica em um conjunto A com uma operação (associativa), chamada add, que combina um par de A's e retorna um outro A. */
abstract class SemiGroup[A] {
  def add(x: A, y: A): A
}
/** Um monóide é um semigrupo com um elemento distinto de A, chamado unit, que quando combinado com qualquer outro elemento de A retorna esse outro elemento novamente. */
abstract class Monoid[A] extends SemiGroup[A] {
  def unit: A
}
object ImplicitTest extends App {
  /** Para mostrar como os parâmetros implícitos funcionam, primeiro definimos os monóides para strings e inteiros. A palavra-chave implicit indica que o objeto correspondente pode ser usado implicitamente, dentro deste escopo, como um parâmetro de uma função definia como implícita. */
  implicit object StringMonoid extends Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  implicit object IntMonoid extends Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  /** Este método recebe uma List[A] retorna um A que representa o valor da combinação resultante ao aplicar a operação monóide sucessivamente em toda a lista. Tornar o parâmetro m implícito aqui significa que só temos de fornecer o parâmetro xs no local de chamada, pois se temos uma List[A] sabemos qual é realmente o tipo A e, portanto, o qual o tipo do Monoid[A] é necessário. Podemos então encontrar implicitamente qualquer val ou objeto no escopo atual que também tem esse tipo e usá-lo sem precisar especificá-lo explicitamente. */
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))

  /** Aqui chamamos a função sum duas vezes, com apenas um parâmetro cada vez. Como o segundo parâmetro de soma, m, está implícito, seu valor é procurado no escopo atual, com base no tipo de monóide exigido em cada caso, o que significa que ambas as expressões podem ser totalmente avaliadas. */
  println(sum(List(1, 2, 3)))          // uses IntMonoid implicitly
  println(sum(List("a", "b", "c")))    // uses StringMonoid implicitly
}
```

Aqui está a saída do programa:

```
6
abc
```
