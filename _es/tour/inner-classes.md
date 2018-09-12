---
layout: tour
title: Clases Internas

discourse: false

partof: scala-tour

num: 11
language: es

next-page: tuples
previous-page: implicit-parameters
---

En Scala es posible que las clases tengan como miembro otras clases. A diferencia de lenguajes similares a Java donde ese tipo de clases internas son miembros de las clases que las envuelven, en Scala esas clases internas están ligadas al objeto externo. Para ilustrar esta diferencia, vamos a mostrar rápidamente una implementación del tipo grafo:

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

En nuestro programa, los grafos son representados mediante una lista de nodos. Estos nodos son objetos de la clase interna `Node`. Cada nodo tiene una lista de vecinos que se almacena en la lista `connectedNodes`. Ahora podemos crear un grafo con algunos nodos y conectarlos incrementalmente:

    object GraphTest extends App {
      val g = new Graph
      val n1 = g.newNode
      val n2 = g.newNode
      val n3 = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }

Ahora vamos a completar el ejemplo con información relacionada al tipado para definir explicitamente de qué tipo son las entidades anteriormente definidas:

    object GraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      val n3: g.Node = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }

El código anterior muestra que al tipo del nodo le es prefijado con la instancia superior (que en nuestro ejemplo es `g`). Si ahora tenemos dos grafos, el sistema de tipado de Scala no nos permite mezclar nodos definidos en un grafo con nodos definidos en otro, ya que los nodos del otro grafo tienen un tipo diferente.

Aquí está el programa ilegal:

    object IllegalGraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      n1.connectTo(n2)      // legal
      val h: Graph = new Graph
      val n3: h.Node = h.newNode
      n1.connectTo(n3)      // ilegal!
    }

Por favor note que en Java la última linea del ejemplo anterior hubiese sido correcta. Para los nodos de ambos grafos, Java asignaría el mismo tipo `Graph.Node`; es decir, `Node` es prefijado con la clase `Graph`. En Scala un tipo similar también puede ser definido, pero es escrito `Graph#Node`. Si queremos que sea posible conectar nodos de distintos grafos, es necesario modificar la implementación inicial del grafo de la siguiente manera:

    class Graph {
      class Node {
        var connectedNodes: List[Graph#Node] = Nil   // Graph#Node en lugar de Node
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

> Por favor note que este programa no nos permite relacionar un nodo con dos grafos diferentes. Si también quisiéramos eliminar esta restricción, sería necesario cambiar el tipo de la variable `nodes` a `Graph#Node`.
