---
layout: tour
title: Padrões de Expressões Regulares
partof: scala-tour

num: 14

next-page: extractor-objects
previous-page: singleton-objects
language: pt-br
---

## Padrões de sequência que ignoram a direita ##

Padrões de sequência que ignoram a direita são uma funcionalidade útil para decompor qualquer dado sendo ele um subtipo de `Seq[A]` ou uma classe case com um parâmetro iterador formal, como por exemplo:

```
Elem(prefix:String, label:String, attrs:MetaData, scp:NamespaceBinding, children:Node*)
```
Em tais casos, Scala permite que padrões tenham o curinga `_*` na posição mais à direita para ter lugar para sequências arbitrariamente longas.
O exemplo a seguir demonstra um padrão que faz o match de um prefixo de uma sequência e vincula o resto à variável `rest`.

```scala mdoc
object RegExpTest1 extends App {
  def containsScala(x: String): Boolean = {
    val z: Seq[Char] = x
    z match {
      case Seq('s','c','a','l','a', rest @ _*) =>
        println("rest is "+rest)
        true
      case Seq(_*) =>
        false
    }
  }
}
```

Em contraste com versões anteriores Scala, não é mais permitido ter expressões regulares arbitrárias, pelas razões descritas abaixo.

###Padrões genéricos de expressões regulares `RegExp` temporariamente retirados de Scala###

Desde que descobrimos um problema de precisão, esse recurso está temporariamente removido da linguagem Scala. Se houver solicitação da comunidade de usuários, poderemos reativá-la de forma aprimorada.

De acordo com nossa opinião, os padrões de expressões regulares não eram tão úteis para o processamento XML como estimamos. Em aplicações de processamento de XML de vida real, XPath parece uma opção muito melhor. Quando descobrimos que nossos padrões de expressões regulares ou de tradução tinham alguns bugs para padrões raros que são incomuns e difíceis de excluir, escolhemos que seria hora de simplificar a linguagem.

