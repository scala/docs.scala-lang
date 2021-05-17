---
layout: tour
title: Unutarnje klase
language: ba
partof: scala-tour

num: 22
next-page: abstract-type-members
previous-page: lower-type-bounds

---

U Scali je moguće da klase imaju druge klase kao članove.
Nasuprot jezicima sličnim Javi, gdje su unutarnje klase članovi vanjske klase,
u Scali takve unutarnje klase su vezane za vanjski objekt.
Pretpostavimo da želimo da nas kompejler spriječi da pomiješamo koji čvorovi pripadaju kojem grafu. Tipovi zavisni od putanje (en. path-dependent) omogućuju rješenje.

Radi ilustracije razlike, prikazaćemo implementaciju klase grafa:

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
 
U našem programu, grafovi su predstavljeni listom čvorova (`List[Node]`).
Svaki čvor ima listu drugih čvorova s kojima je povezan (`connectedNodes`). Klasa `Node` je _path-dependent tip_ jer je ugniježdena u klasi `Graph`. Stoga, svi čvorovi u `connectedNodes` moraju biti kreirani koristeći `newNode` iz iste instance klase `Graph`.

```scala mdoc
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
val node3: graph1.Node = graph1.newNode
node1.connectTo(node2)
node3.connectTo(node1)
```
 
Eksplicitno smo deklarisali tip `node1`, `node2`, i `node3` kao `graph1.Node` zbog jasnosti ali ga je kompajler mogao sam zaključiti. Pošto kada pozivamo `graph1.newNode` koja poziva `new Node`, metoda koristi instancu `Node` specifičnu instanci `graph1`.

Da imamo dva grafa, sistem tipova Scale ne dozvoljava miješanje  čvorova definisanih u različitim grafovima,
jer čvorovi različitih grafova imaju različit tip.
Ovo je primjer netačnog programa:
 
```scala mdoc:fail
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
node1.connectTo(node2)      // legal
val graph2: Graph = new Graph
val node3: graph2.Node = graph2.newNode
node1.connectTo(node3)      // illegal!
```

Tip `graph1.Node` je različit od `graph2.Node`.
U Javi bi zadnja linija prethodnog primjera bila tačna.
Za čvorove oba grafa, Java bi dodijelila isti tip `Graph.Node`; npr. `Node` bi imala prefiks klase `Graph`.
U Scali takav tip je također moguće izraziti, piše se kao `Graph#Node`.
Ako želimo povezati čvorove različitih grafova, moramo promijeniti definiciju naše inicijalne implementacije grafa:
 
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
 
> Primijetite da ovaj program ne dozvoljava da dodamo čvor u dva različita grafa.
Ako bi htjeli ukloniti i ovo ograničenje, moramo promijeniti tipski parametar `nodes` u `Graph#Node`.
