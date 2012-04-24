---
layout: tutorial
title: Inner Classes

disqus: true

tutorial: scala-tour
num: 11
---

In Scala it is possible to let classes have other classes as members. Opposed to Java-like languages where such inner classes are members of the enclosing class, in Scala such inner classes are bound to the outer object. To illustrate the difference, we quickly sketch the implementation of a graph datatype:
 
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
 
In our program, graphs are represented by a list of nodes. Nodes are objects of inner class `Node`. Each node has a list of neighbours, which get stored in the list `connectedNodes`. Now we can set up a graph with some nodes and connect the nodes incrementally:
 
    object GraphTest extends App {
      val g = new Graph
      val n1 = g.newNode
      val n2 = g.newNode
      val n3 = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
We now enrich the above example with types to state explicitly what the type of the various defined entities is:
 
    object GraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      val n3: g.Node = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
This code clearly shows that a node type is prefixed with its outer instance (which is object `g` in our example). If we now have two graphs, the type system of Scala does not allow us to mix nodes defined within one graph with the nodes of another graph, since the nodes of the other graph have a different type.
Here is an illegal program:
 
    object IllegalGraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      n1.connectTo(n2)      // legal
      val h: Graph = new Graph
      val n3: h.Node = h.newNode
      n1.connectTo(n3)      // illegal!
    }
 
Please note that in Java the last line in the previous example program would have been correct. For nodes of both graphs, Java would assign the same type `Graph.Node`; i.e. `Node` is prefixed with class `Graph`. In Scala such a type can be expressed as well, it is written `Graph#Node`. If we want to be able to connect nodes of different graphs, we have to change the definition of our initial graph implementation in the following way:
 
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
 
> Please note that this program doesn't allow us to attach a node to two different graphs. If we want to remove this restriction as well, we have to change the type of variable nodes to `Graph#Node`.
