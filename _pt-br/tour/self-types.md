---
layout: tour
title: Auto Referências Explicitamente Tipadas
partof: scala-tour

num: 24
next-page: implicit-parameters
previous-page: compound-types
language: pt-br
---

Ao desenvolver um software extensível, às vezes é útil declarar explicitamente o tipo do valor `this`. Para ilustrar isso, criaremos uma pequena representação extensível de uma estrutura de dados de grafo em Scala.

Aqui está uma definição que descreve um grafo:

```scala mdoc
abstract class Graph {
  type Edge
  type Node <: NodeIntf
  abstract class NodeIntf {
    def connectWith(node: Node): Edge
  }
  def nodes: List[Node]
  def edges: List[Edge]
  def addNode: Node
}
```

Um grafo consiste em uma lista de nós e arestas onde o nó e o tipo de aresta são declarados como abstratos. O uso de [tipos abstratos](abstract-type-members.html) permite que a implementação da trait `Graph` forneça suas próprias classes concretas para nós e arestas. Além disso, existe um método `addNode` para adicionar novos nós a um grafo. Os nós são conectados usando o método `connectWith`.

Uma possível implementação de `Graph` é ilustrada na classe a seguir:

```scala mdoc:fail
abstract class DirectedGraph extends Graph {
  type Edge <: EdgeImpl
  class EdgeImpl(origin: Node, dest: Node) {
    def from = origin
    def to = dest
  }
  class NodeImpl extends NodeIntf {
    def connectWith(node: Node): Edge = {
      val edge = newEdge(this, node)
      edges = edge :: edges
      edge
    }
  }
  protected def newNode: Node
  protected def newEdge(from: Node, to: Node): Edge
  var nodes: List[Node] = Nil
  var edges: List[Edge] = Nil
  def addNode: Node = {
    val node = newNode
    nodes = node :: nodes
    node
  }
}
```

A classe `DirectedGraph` estende a classe `Graph` fornecendo uma implementação parcial. A implementação é apenas parcial porque gostaríamos de poder ampliar o `DirectedGraph`. Portanto, esta classe deixa todos os detalhes de implementação abertos e assim, tanto as arestas quanto os nós são definidos como abstratos. No entanto, a classe `DirectedGraph` revela alguns detalhes adicionais sobre a implementação do tipo das arestas ao restringir o limite de tipo para a classe `EdgeImpl`. Além disso, temos algumas implementações preliminares de arestas e nós representados pelas classes `EdgeImpl` e `NodeImpl`. Uma vez que é necessário criar novos objetos nó e aresta dentro da nossa implementação de grafo, também temos que adicionar os métodos de construção `newNode` e `newEdge`. Os métodos `addNode` e `connectWith` são ambos definidos em termos destes métodos de construção. Uma análise mais detalhada da implementação do método `connectWith` revela que, para criar uma aresta, temos que passar a auto-referência `this` para o método de construção `newEdge`. Mas a `this` é atribuído o tipo `NodeImpl`, por isso não é compatível com o tipo `Node` que é exigido pelo método de construção correspondente. Como consequência, o programa acima não é bem-formado e o compilador Scala irá emitir uma mensagem de erro.

Em Scala é possível vincular uma classe a outro tipo (que será implementado no futuro) ao fornecer a auto referência `this` ao outro tipo explicitamente. Podemos usar esse mecanismo para corrigir nosso código acima. O tipo explícito de `this` é especificado dentro do corpo da classe `DirectedGraph`.

Aqui está o programa já corrigido:

```scala mdoc
abstract class DirectedGraph extends Graph {
  type Edge <: EdgeImpl
  class EdgeImpl(origin: Node, dest: Node) {
    def from = origin
    def to = dest
  }
  class NodeImpl extends NodeIntf {
    self: Node =>                     // nova linha adicionada
    def connectWith(node: Node): Edge = {
      val edge = newEdge(this, node)  // agora válido
      edges = edge :: edges
      edge
    }
  }
  protected def newNode: Node
  protected def newEdge(from: Node, to: Node): Edge
  var nodes: List[Node] = Nil
  var edges: List[Edge] = Nil
  def addNode: Node = {
    val node = newNode
    nodes = node :: nodes
    node
  }
}
```

Nesta nova definição de classe `NodeImpl`, `this` tem o tipo `Node`. Como o tipo `Node` é abstrato e, portanto, ainda não sabemos se `NodeImpl` é realmente um subtipo de `Node`, o sistema de tipo Scala não nos permitirá instanciar esta classe. No entanto declaramos com a anotação de tipo explícito que, em algum ponto, (uma subclasse de) `NodeImpl` precisa denotar um subtipo de tipo `Node` para ser instantiável.

Aqui está uma especialização concreta de `DirectedGraph` onde todos os membros da classe abstrata são definidos:

```scala mdoc
class ConcreteDirectedGraph extends DirectedGraph {
  type Edge = EdgeImpl
  type Node = NodeImpl
  protected def newNode: Node = new NodeImpl
  protected def newEdge(f: Node, t: Node): Edge =
    new EdgeImpl(f, t)
}
```

Observe que nesta classe, podemos instanciar `NodeImpl` porque agora sabemos que `NodeImpl` representa um subtipo de tipo `Node` (que é simplesmente um *alias* para `NodeImpl`).

Aqui está um exemplo de uso da classe `ConcreteDirectedGraph`:

```scala mdoc
object GraphTest extends App {
  val g: Graph = new ConcreteDirectedGraph
  val n1 = g.addNode
  val n2 = g.addNode
  val n3 = g.addNode
  n1.connectWith(n2)
  n2.connectWith(n3)
  n1.connectWith(n3)
}
```
