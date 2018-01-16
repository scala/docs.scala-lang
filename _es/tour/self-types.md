---
layout: tour
title: Autorefrencias explicitamente tipadas

discourse: false

partof: scala-tour

num: 27
language: es

next-page: type-inference
previous-page: lower-type-bounds
---

Cuando se está construyendo software extensible, algunas veces resulta útil declarar el tipo de la variable `this` explícitamente. Para motivar esto, realizaremos una pequeña representación de una estructura de datos Grafo, en Scala.

Aquí hay una definición que sirve para describir un grafo:

    abstract class Grafo {
      type Vertice
      type Nodo <: NodoIntf
      abstract class NodoIntf {
        def conectarCon(nodo: Nodo): Vertice
      }
      def nodos: List[Nodo]
      def vertices: List[Vertice]
      def agregarNodo: Nodo
    }

Los grafos consisten de una lista de nodos y vértices (o aristas en alguna bibliografía) donde tanto el tipo nodo, como el vértice fueron declarados abstractos. El uso de [tipos abstractos](abstract-types.html) permite las implementaciones del trait `Grafo` proveer sus propias clases concretas para nodos y vértices. Además, existe un método `agregarNodo` para agregar nuevos nodos al grafo. Los nodos se conectan entre sí utilizando el método `conectarCon`.

Una posible implementación de la clase `Grafo`es dada en el siguiente programa:

    abstract class GrafoDirigido extends Grafo {
      type Vertice <: VerticeImpl
      class VerticeImpl(origen: Nodo, dest: Nodo) {
        def desde = origen
        def hasta = dest
      }
      class NodoImpl extends NodoIntf {
        def conectarCon(nodo: Nodo): Vertice = {
          val vertice = nuevoVertice(this, nodo)
          vertices = vertice :: vertices
          vertice
        }
      }
      protected def nuevoNodo: Nodo
      protected def nuevoVertice(desde: Nodo, hasta: Nodo): Vertice
      var nodos: List[Nodo] = Nil
      var vertices: List[Vertice] = Nil
      def agregarNodo: Nodo = {
        val nodo = nuevoNodo
        nodos = nodo :: nodos
        nodo
      }
    }

La clase `GrafoDirigido` especializa la clase `Grafo` al proveer una implementación parcial. La implementación es solamente parcial, porque queremos que sea posible extender `GrafoDirigido` aun más. Por lo tanto, esta clase deja todos los detalles de implementación abiertos y así tanto los tipos vértice como nodo son abstractos.  De todas maneras, la clase `GrafoDirigido` revela algunos detalles adicionales sobre la implementación del tipo vértice al acotar el límite a la clase `VerticeImpl`. Además, tenemos algunas implementaciones preliminares de vértices y nodos representados por las clases `VerticeImpl` y `NodoImpl`.

Ya que es necesario crear nuevos objetos nodo y vértice con nuestra implementación parcial del grafo, también debimos agregar los métodos constructores `nuevoNodo` y `nuevoVertice`. Los métodos `agregarNodo` y `conectarCon` están ambos definidos en términos de estos métodos constructores. Una mirada más cercana a la implementación del método `conectarCon` revela que para crear un vértice es necesario pasar la auto-referencia `this` al método constructor `newEdge`. Pero a `this` en ese contexto le es asignado el tipo `NodoImpl`, por lo tanto no es compatible con el tipo `Nodo` el cual es requerido por el correspondiente método constructor. Como consecuencia, el programa superior no está bien definido y compilador mostrará un mensaje de error.

En Scala es posible atar a una clase otro tipo (que será implementado en el futuro) al darle su propia auto-referencia `this` el otro tipo explicitamente. Podemos usar este mecanismo para arreglar nuestro código de arriba. El tipo the `this` explícito es especificado dentro del cuerpo de la clase `GrafoDirigido`.

Este es el progama arreglado:

    abstract class GrafoDirigido extends Grafo {
      ...
      class NodoImpl extends NodoIntf {
        self: Nodo =>
        def conectarCon(nodo: Nodo): Vertice = {
          val vertice = nuevoVertice(this, nodo) // ahora legal
          vertices = vertice :: vertices
          vertice
        }
      }
      ...
    }

En esta nueva definición de la clase `NodoImpl`, `this` tiene el tipo `Nodo`. Ya que `Nodo` es abstracta y por lo tanto todavía no sabemos si `NodoImpl` es realmente un subtipo de `Nodo`, el sistema de tipado de Scala no permitirá instanciar esta clase. Pero de todas maneras, estipulamos con esta anotación explicita de tipo que en algún momento en el tiempo, una subclase de `NodeImpl` tiene que denotar un subtipo del tipo `Nodo` de forma de ser instanciable.

Aquí presentamos una especialización concreta de `GrafoDirigido` donde todos los miembros abstractos son definidos:

    class GrafoDirigidoConcreto extends GrafoDirigido {
      type Vertice = VerticeImpl
      type Nodo = NodoImpl
      protected def nuevoNodo: Nodo = new NodoImpl
      protected def nuevoVertice(d: Nodo, h: Node): Vertice =
        new VerticeImpl(d, h)
    }


Por favor nótese que en esta clase nos es posible instanciar `NodoImpl` porque ahora sabemos que `NodoImpl` denota a un subtipo de `Nodo` (que es simplemente un alias para `NodoImpl`).

Aquí hay un ejemplo de uso de la clase `GrafoDirigidoConcreto`:

    object GraphTest extends App {
      val g: Grafo = new GrafoDirigidoConcreto
      val n1 = g.agregarNodo
      val n2 = g.agregarNodo
      val n3 = g.agregarNodo
      n1.conectarCon(n2)
      n2.conectarCon(n3)
      n1.conectarCon(n3)
    }
