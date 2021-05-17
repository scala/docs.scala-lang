---
layout: tour
title: Klasy wewnętrzne
partof: scala-tour

num: 23
language: pl
next-page: abstract-type-members
previous-page: lower-type-bounds
---

W Scali możliwe jest zdefiniowanie klasy jako element innej klasy. W przeciwieństwie do języków takich jak Java, gdzie tego typu wewnętrzne klasy są elementami ujmujących ich klas, w Scali są one związane z zewnętrznym obiektem. Aby zademonstrować tę różnicę, stworzymy teraz prostą implementację grafu:
 
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
 
W naszym programie grafy są reprezentowane przez listę wierzchołków. Wierzchołki są obiektami klasy wewnętrznej `Node`. Każdy wierzchołek zawiera listę sąsiadów, które są przechowywane w liście `connectedNodes`. Możemy teraz skonfigurować graf z kilkoma wierzchołkami i połączyć je ze sobą:
 
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
 
Teraz wzbogacimy nasz przykład o jawne typowanie, aby można było zobaczyć powiązanie typów wierzchołków z grafem:
 
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
 
Ten kod pokazuje, że typ wierzchołka jest prefiksowany przez swoją zewnętrzną instancję (która jest obiektem `g` w naszym przykładzie). Jeżeli mielibyśmy dwa grafy, system typów w Scali nie pozwoli nam na pomieszanie wierzchołków jednego z wierzchołkami drugiego, ponieważ wierzchołki drugiego grafu są określone przez inny typ.

Przykład niedopuszczalnego programu:
 
```scala mdoc:fail
object IllegalGraphTest extends App {
  val g: Graph = new Graph
  val n1: g.Node = g.newNode
  val n2: g.Node = g.newNode
  n1.connectTo(n2)      // dopuszczalne
  val h: Graph = new Graph
  val n3: h.Node = h.newNode
  n1.connectTo(n3)      // niedopuszczalne!
}
```
 
Warto zwrócić uwagę na to, że ostatnia linia poprzedniego przykładu byłaby poprawnym programem w Javie. Dla wierzchołków obu grafów Java przypisałaby ten sam typ `Graph.Node`. W Scali także istnieje możliwość wyrażenia takiego typu, zapisując go w formie: `Graph#Node`. Jeżeli byśmy chcieli połączyć wierzchołki różnych grafów, musielibyśmy wtedy zmienić definicję implementacji naszego grafu w następujący sposób:
 
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
 
> Ważne jest, że ten program nie pozwala nam na dołączenie wierzchołka do dwóch różnych grafów. Jeżeli chcielibyśmy znieść to ograniczenie, należy zmienić typ zmiennej `nodes` na `Graph#Node`.
