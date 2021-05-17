---
layout: tour
title: Tipos Compostos
partof: scala-tour

num: 23
next-page: self-types
previous-page: abstract-type-members
language: pt-br
---

Às vezes é necessário expressar que o tipo de um objeto é um subtipo de vários outros tipos. Em Scala isso pode ser expresso com a ajuda de *tipos compostos*, que são interseções de tipos de objetos.

Suponha que temos duas traits `Cloneable` and `Resetable`:

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = { 
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

Agora supondo que queremos escrever uma função `cloneAndReset` que recebe um objeto, clona e reseta o objeto original:

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

A questão é: qual é o tipo do parâmetro `obj`? Se for `Cloneable` então o objeto pode ser clonado, mas não resetado; Se for `Resetable` nós podemos resetar, mas não há nenhuma operação para clonar. Para evitar conversão de tipos em tal situação, podemos especificar o tipo de `obj` para ser tanto `Cloneable` como `Resetable`. Este tipo composto pode ser escrito da seguinte forma em Scala: `Cloneable with Resetable`.

Aqui está a função atualizada:

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

Os tipos de compostos podem consistir em vários tipos de objeto e eles podem ter um único refinamento que pode ser usado para restrigir a assinatura de membros de objetos existentes.

A forma geral é: `A with B with C ... { refinamento }`

Um exemplo para o uso de refinamentos é dado na página sobre [tipos abstratos](abstract-type-members.html). 
