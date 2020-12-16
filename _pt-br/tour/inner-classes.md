---
layout: tour
title: Classes Internas
partof: scala-tour

num: 21
next-page: abstract-type-members
previous-page: lower-type-bounds
language: pt-br
---

Em Scala é possível declarar classes que tenham outras classes como membros. Em contraste com a linguagenm Java, onde classes internas são membros da classe em que foram declaradas, em Scala as classes internas são ligadas ao objeto exterior. Para ilustrar essa diferença, rapidamente esboçamos a implementação de grafo como um tipo de dados:

```scala mdoc
class Graph {
  class Node {
    var connectedNodes: List[Node] = Nil
    def connectTo(node: Node) {
      if (!connectedNodes.exists(node.equals)) {
        connectedNodes = node :: connectedNodes
      }
    }
  }
  var nodes: List[Node] = Nil
  def newNode: Node = {
    val res = new Node
    nodes = res :: nodes
    res
  }
}
```

Em nosso programa, os grafos são representados por uma lista de nós. Os nós são objetos da classe interna `Node`. Cada nó tem uma lista de vizinhos, que são armazenados na lista `connectedNodes`. Agora podemos configurar um grafo com alguns nós e conectar os nós de forma incremental:
 
```scala mdoc
object GraphTest extends App {
  val g = new Graph
  val n1 = g.newNode
  val n2 = g.newNode
  val n3 = g.newNode
  n1.connectTo(n2)
  n3.connectTo(n1)
}
```

Agora melhoramos o exemplo acima com tipos, para assim declarar explicitamente qual o tipo das várias entidades definidas:
 
```scala mdoc:nest
object GraphTest extends App {
  val g: Graph = new Graph
  val n1: g.Node = g.newNode
  val n2: g.Node = g.newNode
  val n3: g.Node = g.newNode
  n1.connectTo(n2)
  n3.connectTo(n1)
}
```

Este código mostra claramente que o tipo nó é prefixado com sua instância externa (em nosso exemplo é o objeto `g`). Se agora temos dois grafos, o sistema de tipos de Scala não nos permite misturar nós definidos dentro de um grafo com os nós de outro, já que os nós do outro grafo têm um tipo diferente.
Aqui está um programa inválido:
 
```scala mdoc:fail
object IllegalGraphTest extends App {
  val g: Graph = new Graph
  val n1: g.Node = g.newNode
  val n2: g.Node = g.newNode
  n1.connectTo(n2)      // legal
  val h: Graph = new Graph
  val n3: h.Node = h.newNode
  n1.connectTo(n3)      // illegal!
}
```

Observe que em Java a última linha no programa do exemplo anterior é válida. Para nós de ambos os grafos, Java atribuiria o mesmo tipo `Graph.Node`; isto é, `Node` é prefixado com a classe `Graph`. Em Scala, esse tipo também pode ser expresso, e é escrito `Graph#Node`. Se quisermos ser capazes de conectar nós de diferentes grafos, temos que mudar a definição inicial da nossa implementação do grafo da seguinte maneira:
 
```scala mdoc:nest
class Graph {
  class Node {
    var connectedNodes: List[Graph#Node] = Nil
    def connectTo(node: Graph#Node) {
      if (!connectedNodes.exists(node.equals)) {
        connectedNodes = node :: connectedNodes
      }
    }
  }
  var nodes: List[Node] = Nil
  def newNode: Node = {
    val res = new Node
    nodes = res :: nodes
    res
  }
}
```

> Note que este programa não nos permite anexar um nó a dois grafos diferentes. Se quisermos também remover esta restrição, temos de mudar o tipo da variável `nodes` para `Graph#Node`.
