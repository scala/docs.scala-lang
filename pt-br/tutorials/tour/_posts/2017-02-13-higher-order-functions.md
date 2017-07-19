---
layout: inner-page-no-masthead
title: Funções de ordem superior

discourse: false

tutorial: scala-tour
categories: tour
num: 7
next-page: nested-functions
previous-page: anonymous-function-syntax
language: pt-br
---

Scala permite definir funções de ordem superior. Tais funções _recebem outras funções como parâmetros_, ou _resultam em uma função_. Por exemplo, a função `apply` recebe outra função `f` e um valor `v` então aplica a função `f` em`v`:

```tut
def apply(f: Int => String, v: Int) = f(v)
```

_Nota: métodos são automaticamente convertidos em funções se o contexto demandar.**_

Outro exemplo:
 
```tut
class Decorator(left: String, right: String) {
  def layout[A](x: A) = left + x.toString() + right
}

object FunTest extends App {
  def apply(f: Int => String, v: Int) = f(v)
  val decorator = new Decorator("[", "]")
  println(apply(decorator.layout, 7))
}
```
 
A execução produz a saída:

```
[7]
```

Nesse exemplo, o método `decorator.layout` é automaticamente convertido em um valor do tipo `Int => String` conforme o método `apply` demanda. Note que o método `decorator.layout` é um _método polimórfico_ (por exemplo: ele abstrai alguns tipos de sua assinatura) e o compilador Scala precisa primeiro instanciar corretamento o tipo do método.
