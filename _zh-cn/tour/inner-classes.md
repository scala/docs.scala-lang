---
layout: tour
title: 内部类
partof: scala-tour

num: 20

language: zh-cn

next-page: abstract-type-members
previous-page: lower-type-bounds
---

在Scala中，一个类可以作为另一个类的成员。 在一些类似 Java 的语言中，内部类是外部类的成员，而 Scala 正好相反，内部类是绑定到外部对象的。 假设我们希望编译器在编译时阻止我们混淆节点 nodes 与图形 graph 的关系，路径依赖类型提供了一种解决方案。

为了说明差异，我们简单描述了一个图形数据类型的实现：

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
该程序将图形表示为节点列表 (`List[Node]`)。 每个节点都有一个用来存储与其相连的其他节点的列表 (`connectedNodes`)。 类 `Node` 是一个 _路径依赖类型_，因为它嵌套在类 `Graph` 中。 因此，`connectedNodes` 中存储的所有节点必须使用同一个 `Graph` 的实例对象的 `newNode` 方法来创建。

```scala mdoc
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
val node3: graph1.Node = graph1.newNode
node1.connectTo(node2)
node3.connectTo(node1)
```
为清楚起见，我们已经明确地将 `node1`，`node2`，和 `node3` 的类型声明为`graph1.Node`，但编译器其实可以自动推断出它。 这是因为当我们通过调用 `graph1.newNode` 来调用 `new Node` 时，该方法产生特定于实例 `graph1` 的 `Node` 类型的实例对象。

如果我们现在有两个图形，Scala 的类型系统不允许我们将一个图形中定义的节点与另一个图形的节点混合，因为另一个图形的节点具有不同的类型。
下例是一个非法的程序：

```scala mdoc:fail
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
node1.connectTo(node2)      // legal
val graph2: Graph = new Graph
val node3: graph2.Node = graph2.newNode
node1.connectTo(node3)      // illegal!
```
类型 `graph1.Node` 与类型 `graph2.Node` 完全不同。 在 Java 中，上一个示例程序中的最后一行是正确的。 对于两个图形的节点，Java 将分配相同的类型 `Graph.Node`; 即 `Node` 以类 `Graph` 为前缀。 在Scala中也可以表示出这种类型，它写成了 `Graph#Node`。 如果我们希望能够连接不同图形的节点，我们必须通过以下方式更改图形类的初始实现的定义：

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
 
