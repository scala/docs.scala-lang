---
layout: tour
title: Tipos Unificados
partof: scala-tour

num: 2
next-page: classes
previous-page: tour-of-scala
language: pt-br
---

Diferente de Java, todos os valores em Scala são objetos (incluindo valores numéricos e funções). Dado que Scala é baseada em classes, todos os valores são instâncias de uma classe. O diagrama a seguir ilustra a hierarquia de classes.

![Hierarquia de Tipos Scala]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Hierarquia de Tipos Scala ##

A superclass de todas as classes `scala.Any` tem duas subclasses diretas `scala.AnyVal` e `scala.AnyRef` representando dois mundos de classes distintos: classes de valor e classes de referência. Todas as classes de valor são predefinidas; elas correspondem aos tipos primitivos em linguagens semelhante a Java. Todas as outras classes definem tipos de referência. Classes definidas pelo usuário definem tipos de referência por padrão; por exemplo, tais classes sempre (indiretamente) são subclasses de `scala.AnyRef`. Toda classes definida pelo usuário em Scala implicitamente estende a trait `scala.ScalaObject`. Classes de infraestrutura nas quais Scala está sendo executado (ex. ambiente de execução do Java) não estendem `scala.ScalaObject`. Se utilizar Scala no contexto do ambiente de execução do Java, então `scala.AnyRef` corresponde à `java.lang.Object`.
Observe que o diagrama acima mostra implicitamente as conversões entre as classes de valores.
Este exemplo demonstra que números numbers, caracteres, valores booleanos, e funções são objetos como qualquer outro objeto:
 
```scala
object TiposUnificados extends App {
  val set = new scala.collection.mutable.LinkedHashSet[Any]
  set += "Sou uma string"     // adiciona uma string ao set
  set += 732                  // adiciona um número
  set += 'c'                  // adiciona um caractere
  set += true                 // adiciona um valor booleano
  set += main _               // adiciona a função main
  val iter: Iterator[Any] = set.iterator
  while (iter.hasNext) {
    println(iter.next.toString())
  }
}
```

O programa declara uma aplicação chamada `TiposUnificados` em forma de um [objeto Singleton](singleton-objects.html) que estende `App`. A aplicação define uma variável local `set` que se refere a uma instância da classe `LinkedHashSet[Any]`. As demais linhas adicionam vários elementos à variável set. Tais elementos devem estar em conformidade com o tipo `Any` que foi declarado para o set. Por fim, são escritas as representações em string de todos os elementos adicionados ao set.


Escrita de saída do programa:
```
Sou uma string
732
c
true
<function>
```
