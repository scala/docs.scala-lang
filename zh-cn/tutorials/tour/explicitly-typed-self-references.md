---
layout: tutorial
title: Explicitly Typed Self References

disqus: true

tutorial: scala-tour
num: 27
---

When developing extensible software it is sometimes handy to declare the type of the value `this` explicitly. To motivate this, we will derive a small extensible representation of a graph data structure in Scala.

Here is a definition describing graphs:

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

Graphs consist of a list of nodes and edges where both the node and the edge type are left abstract. The use of [abstract types](abstract-types.html) allows implementations of trait Graph to provide their own concrete classes for nodes and edges. Furthermore, there is a method `addNode` for adding new nodes to a graph. Nodes are connected using method `connectWith`.

A possible implementation of class `Graph` is given in the next class:

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

Class `DirectedGraph` specializes the `Graph` class by providing a partial implementation. The implementation is only partial, because we would like to be able to extend `DirectedGraph` further. Therefore this class leaves all implementation details open and thus both the edge and the node type are left abstract. Nevertheless, class `DirectedGraph` reveals some additional details about the implementation of the edge type by tightening the bound to class `EdgeImpl`. Furthermore, we have some preliminary implementations of edges and nodes represented by the classes `EdgeImpl` and `NodeImpl`. Since it is necessary to create new node and edge objects within our partial graph implementation, we also have to add the factory methods `newNode` and `newEdge`. The methods `addNode` and `connectWith` are both defined in terms of these factory methods. A closer look at the implementation of method `connectWith` reveals that for creating an edge, we have to pass the self reference `this` to the factory method `newEdge`. But `this` is assigned the type `NodeImpl`, so it's not compatible with type `Node` which is required by the corresponding factory method. As a consequence, the program above is not well-formed and the Scala compiler will issue an error message.

In Scala it is possible to tie a class to another type (which will be implemented in future) by giving self reference `this` the other type explicitly. We can use this mechanism for fixing our code above. The explicit self type is specified within the body of the class `DirectedGraph`.

Here is the fixed program:

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

In this new definition of class `NodeImpl`, `this` has type `Node`. Since type `Node` is abstract and we therefore don't know yet if `NodeImpl` is really a subtype of `Node`, the type system of Scala will not allow us to instantiate this class. But nevertheless, we state with the explicit type annotation of this that at some point, (a subclass of) `NodeImpl` has to denote a subtype of type `Node` in order to be instantiatable.

Here is a concrete specialization of `DirectedGraph` where all abstract class members are turned into concrete ones:

    class ConcreteDirectedGraph extends DirectedGraph {
      type Edge = EdgeImpl
      type Node = NodeImpl
      protected def newNode: Node = new NodeImpl
      protected def newEdge(f: Node, t: Node): Edge =
        new EdgeImpl(f, t)
    }

Please note that in this class, we can instantiate `NodeImpl` because now we know that `NodeImpl` denotes a subtype of type `Node` (which is simply an alias for `NodeImpl`).

Here is a usage example of class `ConcreteDirectedGraph`:

    object GraphTest extends App {
      val g: Graph = new ConcreteDirectedGraph
      val n1 = g.addNode
      val n2 = g.addNode
      val n3 = g.addNode
      n1.connectWith(n2)
      n2.connectWith(n3)
      n1.connectWith(n3)
    }

