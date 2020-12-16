---
layout: tour
title: Jawnie typowane samoreferencje
partof: scala-tour

num: 26
language: pl
next-page: implicit-parameters
previous-page: compound-types
---

Dążąc do tego, aby nasze oprogramowanie było rozszerzalne, często przydatne okazuje się jawne deklarowanie typu `this`. Aby to umotywować, spróbujemy opracować rozszerzalną reprezentację grafu w Scali.

Oto definicja opisująca grafy:

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

Grafy składają się z listy węzłów oraz krawędzi, gdzie zarówno typ węzła jak i krawędzi jest abstrakcyjny. Użycie [typów abstrakcyjnych](abstract-type-members.html) pozwala implementacjom cechy `Graph` na to, by określały swoje konkretne klasy dla węzłów i krawędzi. Ponadto graf zawiera metodę `addNode`, której celem jest dodanie nowych węzłów do grafu. Węzły są połączone z użyciem metody `connectWith`.

Przykład implementacji klasy `Graph`:

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

Klasa `DirectedGraph` częściowo implementuje i jednocześnie specjalizuje klasę `Graph`. Implementacja jest tylko częsciowa, ponieważ chcemy pozwolić na dalsze jej rozszerzanie. Dlatego szczegóły implementacyjne są pozostawione dla klas pochodnych co wymaga też określenia typu krawędzi oraz wierzchołków jako abstrakcyjne. Niemniej klasa `DirectedGraph` zawęża te typy do klas `EdgeImpl` oraz `NodeImpl`.

Ponieważ konieczne jest udostępnienie możliwości tworzenia wierzchołków i krawędzi w naszej częściowej implementacji grafu, dodane zostały metody fabrykujące `newNode` oraz `newEdge`. Metody `addNode` wraz z `connectWith` są zdefiniowane na podstawie tych metod fabrykujących.

Jeżeli przyjrzymy się bliżej implementacji metody `connectWith`, możemy dostrzec, że tworząc krawędź, musimy przekazać samoreferencję `this` do metody fabrykującej `newEdge`. Lecz `this` jest już powązany z typem `NodeImpl`, który nie jest kompatybilny z typem `Node`, ponieważ jest on tylko ograniczony z góry typem `NodeImpl`. Wynika z tego, iż powyższy program nie jest prawidłowy i kompilator Scali wyemituje błąd kompilacji.

Scala rozwiązuje ten problem pozwalając na powiązanie klasy z innym typem poprzez jawne typowanie samoreferencji. Możemy użyć tego mechanizmu, aby naprawić powyższy kod:

```scala mdoc
    abstract class DirectedGraph extends Graph {
      type Edge <: EdgeImpl
      class EdgeImpl(origin: Node, dest: Node) {
        def from = origin
        def to = dest
      }
      class NodeImpl extends NodeIntf {
        self: Node =>                     // określenie typu "self"
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)  // w tej chwili się skompiluje
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

W nowej definicji klasy `NodeImpl` referencja `this` jest typu `Node`. Ponieważ typ `Node` jest abstrakcyjny i stąd nie wiemy jeszcze, czy `NodeImpl` w rzeczywistości odpowiada `Node`, system typów w Scali nie pozwoli nam na utworzenie tego typu. Mimo wszystko za pomocą jawnej adnotacji typu stwierdzamy, że w pewnym momencie klasa pochodna od `NodeImpl` musi odpowiadać typowi `Node`, aby dało się ją utworzyć.

Oto konkretna specjalizacja `DirectedGraph`, gdzie abstrakcyjne elementy klasy mają ustalone ścisłe znaczenie:

```scala mdoc
class ConcreteDirectedGraph extends DirectedGraph {
  type Edge = EdgeImpl
  type Node = NodeImpl
  protected def newNode: Node = new NodeImpl
  protected def newEdge(f: Node, t: Node): Edge =
    new EdgeImpl(f, t)
}
```

Należy dodać, że w tej klasie możemy utworzyć `NodeImpl`, ponieważ wiemy już teraz, że `NodeImpl` określa klasę pochodną od `Node` (która jest po prostu aliasem dla `NodeImpl`).

Poniżej przykład zastosowania klasy `ConcreteDirectedGraph`:

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
