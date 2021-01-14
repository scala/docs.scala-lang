---
layout: tour
title: Construção Automática de Closures de Tipo-Dependente
partof: scala-tour

num: 30
next-page: annotations
previous-page: operators
language: pt-br
---

_Nota de tradução: A palavra `closure` em pode ser traduzida como encerramento/fechamento, porém é preferível utilizar a notação original_

Scala permite funções sem parâmetros como parâmetros de métodos. Quando um tal método é chamado, os parâmetros reais para nomes de função sem parâmetros não são avaliados e uma função nula é passada em vez disso, tal função encapsula a computação do parâmetro correspondente (isso é conhecido por avaliação *call-by-name*).

O código a seguir demonstra esse mecanismo:

```scala mdoc
object TargetTest1 extends App {
  def whileLoop(cond: => Boolean)(body: => Unit): Unit =
    if (cond) {
      body
      whileLoop(cond)(body)
    }
  var i = 10
  whileLoop (i > 0) {
    println(i)
    i -= 1
  }
}
```

A função `whileLoop` recebe dois parâmetros: `cond` e `body`. Quando a função é aplicada, os parâmetros reais não são avaliados. Mas sempre que os parâmetros formais são usados no corpo de `whileLoop`, as funções nulas criadas implicitamente serão avaliadas em seu lugar. Assim, o nosso método `whileLoop` implementa um while-loop Java-like com um esquema de implementação recursiva.

Podemos combinar o uso de [operadores infix/postfix](operators.html) com este mecanismo para criar declarações mais complexas (com uma sintaxe agradável).

Aqui está a implementação de uma instrução que executa loop a menos que uma condição seja satisfeita:

```scala mdoc
object TargetTest2 extends App {
  def loop(body: => Unit): LoopUnlessCond =
    new LoopUnlessCond(body)
  protected class LoopUnlessCond(body: => Unit) {
    def unless(cond: => Boolean) {
      body
      if (!cond) unless(cond)
    }
  }
  var i = 10
  loop {
    println("i = " + i)
    i -= 1
  } unless (i == 0)
}
```

A função `loop` aceita apenas um corpo e retorna uma instância da classe` LoopUnlessCond` (que encapsula este objeto de corpo). Note que o corpo ainda não foi avaliado. A classe `LoopUnlessCond` tem um método `unless` que podemos usar como um *operador infix*. Dessa forma, obtemos uma sintaxe bastante natural para nosso novo loop: `loop { <stats> } unless ( <cond> )`.

Aqui está a saída de quando o `TargetTest2` é executado:

```
i = 10
i = 9
i = 8
i = 7
i = 6
i = 5
i = 4
i = 3
i = 2
i = 1
```
