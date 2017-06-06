---
layout: tutorial
title: Unutarnje klase

discourse: true

tutorial: scala-tour
categories: tour
num: 21
outof: 33
language: ba
---

U Scali je moguće da klase imaju druge klase kao članove.
Nasuprot jezicima sličnim Javi, gdje su unutarnje klase članovi vanjske klase,
u Scali takve unutarnje klase su vezane za vanjski objekt.
Radi ilustracije razlike, prikazaćemo implementaciju klase grafa:
 
    class Graph {
      class Node {
        var connectedNodes: List[Node] = Nil
        def connectTo(node: Node) {
          if (connectedNodes.find(node.equals).isEmpty) {
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
 
U našem programu, grafovi su predstavljeni listom čvorova.
Čvorovi su objekti unutarnje klase `Node`.
Svaki čvor ima listu susjeda, koji se smještaju  u listu `connectedNodes`.
Sada kad možemo kreirati graf s nekim čvorovima i povezati čvorove inkrementalno:
 
    object GraphTest extends App {
      val g = new Graph
      val n1 = g.newNode
      val n2 = g.newNode
      val n3 = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
Sada obogaćujemo gornji primjer s tipovima s eksplicitno napisanim tipovima:
 
    object GraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      val n3: g.Node = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
Ovaj kod jasno pokazuje da tip čvora ima prefiks instance vanjskog objekta (`g` u našem primjeru).
Ako sada imamo dva grafa, Scalin sistem tipova neće dozvoliti miješanje čvorova definisanih u različitim grafovima,
jer čvorovi različitih grafova imaju različit tip.
Ovo je primjer netačnog programa:
 
    object IllegalGraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      n1.connectTo(n2)      // može
      val h: Graph = new Graph
      val n3: h.Node = h.newNode
      n1.connectTo(n3)      // ne može!
    }
 
Primijetite da bi u Javi zadnja linija prethodnog primjera bila tačna.
Za čvorove oba grafa, Java bi dodijelila isti tip `Graph.Node`; npr. `Node` bi imala prefiks klase `Graph`.
U Scali takav tip je također moguće izraziti, piše se kao `Graph#Node`.
Ako želimo povezati čvorove različitih grafova, moramo promijeniti definiciju naše inicijalne implementacije grafa:
 
    class Graph {
      class Node {
        var connectedNodes: List[Graph#Node] = Nil
        def connectTo(node: Graph#Node) {
          if (connectedNodes.find(node.equals).isEmpty) {
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
 
> Primijetite da ovaj program ne dozvoljava da dodamo čvor u dva različita grafa.
Ako bi htjeli ukloniti i ovo ograničenje, moramo promijeniti tipski parametar `nodes` u `Graph#Node`.
