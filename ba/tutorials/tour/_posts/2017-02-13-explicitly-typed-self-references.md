---
layout: tutorial
title: Eksplicitno tipizirane samo-reference

discourse: false

tutorial: scala-tour
categories: tour
num: 24
outof: 33
language: ba

next-page: implicit-parameters
previous-page: compound-types
---

Kada se razvija proširiv softver ponekad je zgodno deklarisati tip vrijednosti `this` eksplicitno.  
Za motivaciju, izvešćemo malu proširivu reprezentaciju strukture grafa u Scali.

Slijedi definicija koja opisuje grafove:

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

Grafovi se sastoje od liste čvorova i ivica gdje su oba tipa ostavljena apstraktnim.
Upotreba [apstraktnih tipova](abstract-types.html) dozvoljava da implementacije trejta `Graph` obezbijede svoje konkretne klase za čvorove i ivice.
Nadalje, tu je metoda `addNode` za dodavanje novih čvorova u graf. Čvorovi se povezuju metodom `connectWith`.

Moguća implementacija klase `Graph` data je u sljedećoj klasi:

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

Klasa `DirectedGraph` je specijalizacija klase `Graph`, predstavlja parcijalnu implementaciju.
Implementacija je parcijalna jer želimo da proširimo klasu `DirectedGraph` dalje.
Zato ova klasa ostavlja implementacijske detalje otvorenim pa su tipovi čvora i ivice ostavljeni apstraktnim.
Klasa `DirectedGraph` otkriva neke dodatne detalje o implementaciji tipa čvora ograničavanjem ga klasom `EdgeImpl`.
Nadalje, imamo neke preliminarne implementacije ivica i čvorova u klasama `EdgeImpl` i `NodeImpl`.
Pošto je potrebno kreirati nove čvorove i ivice u našoj parcijalnoj implementaciji grafa,
moramo dodati i tvorničke (factory) metode `newNode` i `newEdge`.
Metode `addNode` i `connectWith` su definisane pomoću ovih tvorničkih metoda.
Pažljiviji pogled na implementaciju metode `connectWith` otkriva da za kreiranje ivice,
moramo proslijediti samo-referencu (self-reference) `this` tvorničkoj metodi `newEdge`.
Ali, `this` ima tip `NodeImpl`, tako da nije kompatibilan s tipom `Node` kojeg zahtijeva odgovarajuća tvornička metoda.
Kao posljedica, gornji program nije dobro formiran i Scala kompajler će javiti grešku.

U Scali je moguće vezati klasu za neki drugi tip (koji će biti implementiran kasnije)
davanjem drugog tipa samo-referenci `this`.
Ovaj mehanizam možemo iskoristiti u gornjem kodu.
Eksplicitna samo-referenca je specificirana u tijelu klase `DirectedGraph`.

Ovo je popravljeni program:

    abstract class DirectedGraph extends Graph {
      ...
      class NodeImpl extends NodeIntf {
        self: Node =>
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)  // now legal
          edges = edge :: edges
          edge
        }
      }
      ...
    }

U novoj definiciji klase `NodeImpl`, `this` (self) ima tip `Node`. Pošto je tip `Node` apstraktan i još uvijek ne znamo da li je `NodeImpl`
podtip od `Node`, sistem tipova Scale nam neće dozvoliti instanciranje ove klase.
Kako god, eksplicitnom anotacijom iskazali smo da podklasa `NodeImpl`
mora navesti podtip tipa `Node` da bi se mogla instancirati.

Ovo je konkretna specijalizacija klase `DirectedGraph` u kojoj su svi apstraktni članovi klase sada konkretni:

    class ConcreteDirectedGraph extends DirectedGraph {
      type Edge = EdgeImpl
      type Node = NodeImpl
      protected def newNode: Node = new NodeImpl
      protected def newEdge(f: Node, t: Node): Edge =
        new EdgeImpl(f, t)
    }

Primijetite da u ovoj klasi možemo instancirati `NodeImpl` jer znamo da je `NodeImpl`
podtip tipa `Node` (koja je samo pseudonim za `NodeImpl`).

Primjer korištenja klase `ConcreteDirectedGraph`:

    object GraphTest extends App {
      val g: Graph = new ConcreteDirectedGraph
      val n1 = g.addNode
      val n2 = g.addNode
      val n3 = g.addNode
      n1.connectWith(n2)
      n2.connectWith(n3)
      n1.connectWith(n3)
    }

