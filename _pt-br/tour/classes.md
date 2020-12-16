---
layout: tour
title: Classes
partof: scala-tour

num: 3
next-page: traits
previous-page: unified-types
language: pt-br
---

Classes em Scala são templates estáticos que podem ser instanciados como vários objetos em tempo de execução.
Aqui uma definição de classe que define a classe `Ponto`:

```scala mdoc
class Ponto(var x: Int, var y: Int) {
  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }
  override def toString: String =
    "(" + x + ", " + y + ")"
}
```

Classes em Scala são parametrizadas com argumentos de construtor. O código acima define dois argumentos de construtor, `x` e `y`; ambos são acessíveis por todo o corpo da classe.

A classe também inclui dois métodos, `move` and `toString`. `move` recebe dois parâmetros inteiros mas não retorna um valor (o tipo de retorno `Unit` equivale ao `void` em linguagens como Java). `toString`, por outro lado, não recebe parâmetro algum mas retorna um valor `String`. Dado que `toString` sobrescreve o método pré-definido `toString`, o mesmo é marcado com a palavra-chave `override`.

Perceba que em Scala, não é necessário declarar `return` para então retornar um valor. O valor retornado em um método é simplesmente o último valor no corpo do método. No caso do método `toString` acima, a expressão após o sinal de igual é avaliada e retornada para quem chamou a função.

Classes são instânciadas com a primitiva `new`, por exemplo:

```scala mdoc
object Classes {
  def main(args: Array[String]) {
    val pt = new Ponto(1, 2)
    println(pt)
    pt.move(10, 10)
    println(pt)
  }
}
```

O programa define uma aplicação executável chamada Classes como um [Objeto Singleton](singleton-objects.html) dentro do método `main`. O método `main` cria um novo `Ponto` e armazena o valor em `pt`. Perceba que valores definidos com o construtor `val` são diferentes das variáveis definidas com o construtor `var` (veja acima a classe `Ponto`), `val` não permite atualização do valor, ou seja, o valor é uma constante.

Aqui está a saída do programa:

```
(1, 2)
(11, 12)
```
